#!/usr/bin/env bash
#
# One-shot deployment of caspratique.conduigo.com on a fresh Ubuntu EC2 box.
#
#   sudo bash deploy/deploy.sh
#
# Idempotent: safe to re-run at any time — it converges (skips what is already
# done) instead of duplicating work. It never git-commits anything.
#
# Environment overrides (all optional):
#   DOMAIN        caspratique.conduigo.com
#   REPO_URL      https://github.com/Akrem-sys/test-web-fleets.git
#   APP_DIR       directory containing docker-compose.yml
#   CERTBOT_EMAIL admin@conduigo.com (placeholder default — override!)
#
set -Eeuo pipefail

readonly DEFAULT_DOMAIN="caspratique.conduigo.com"
readonly DEFAULT_REPO_URL="https://github.com/Akrem-sys/test-web-fleets.git"
readonly DEFAULT_CLONE_DIR="/opt/caspratique"
readonly DEFAULT_CERTBOT_EMAIL="admin@conduigo.com"
readonly CRON_MARKER="caspratique-certbot-renew"

DOMAIN="${DOMAIN:-$DEFAULT_DOMAIN}"
CERTBOT_EMAIL="${CERTBOT_EMAIL:-}"
REPO_URL="${REPO_URL:-$DEFAULT_REPO_URL}"
APP_DIR="${APP_DIR:-}"

log()  { printf '\033[1;32m[deploy]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }
on_err() { # on_err <rc> <line>
    [ "$1" -eq 0 ] || die "deploy failed at line $2 (rc=$1) — re-run after fixing; safe to retry."
}
trap 'on_err $? $LINENO' ERR

##############################################################################
# 0. Preflight
##############################################################################
[ "$(id -u)" -eq 0 ] || die "run me as root: sudo bash deploy/deploy.sh"

if [ -r /etc/os-release ]; then
    # shellcheck disable=SC1091
    . /etc/os-release
    case "${ID:-unknown}" in
        ubuntu) log "OS: Ubuntu ${VERSION_ID:-?} (${PRETTY_NAME:-})" ;;
        debian) warn "Debian detected — continuing, but Ubuntu 22.04+ is the tested target" ;;
        *)      warn "Unexpected OS '${ID:-unknown}' — continuing, YMMV" ;;
    esac
fi

missing_pkgs=()
command -v curl    >/dev/null 2>&1 || missing_pkgs+=(curl)
command -v dig     >/dev/null 2>&1 || missing_pkgs+=(dnsutils)
command -v openssl >/dev/null 2>&1 || missing_pkgs+=(openssl)
command -v git     >/dev/null 2>&1 || missing_pkgs+=(git)
if [ "${#missing_pkgs[@]}" -gt 0 ]; then
    log "installing prerequisites: ${missing_pkgs[*]}"
    apt-get update -y
    apt-get install -y "${missing_pkgs[@]}"
fi

# --- this instance's public IP -----------------------------------------------
public_ip=""
try_ip() { # try_ip <description> <cmd...>
    [ -n "$public_ip" ] && return 0
    local out
    out="$("$@" 2>/dev/null || true)"
    if [[ "$out" =~ ^([0-9]{1,3}\.){3}[0-9]{1,3}$ ]]; then public_ip="$out"; fi
}
try_ip "ifconfig.me"       curl -fsS --max-time 5 https://ifconfig.me
try_ip "aws checkip"       curl -fsS --max-time 5 http://checkip.amazonaws.com
try_ip "ec2 metadata v2"   curl -fsS --max-time 3 -H "X-aws-ec2-metadata-token: $(curl -fsS --max-time 3 -X PUT -H 'X-aws-ec2-metadata-token-ttl-seconds: 60' http://169.254.169.254/latest/api/token || true)" http://169.254.169.254/latest/meta-data/public-ipv4
try_ip "opendns"           dig +short myip.opendns.com @resolver1.opendns.com
[ -n "$public_ip" ] || die "could not determine this machine's public IP"
log "public IP: $public_ip"

# --- DNS must point here BEFORE certbot can issue anything -------------------
resolved_ips="$(dig +short "$DOMAIN" A 2>/dev/null | grep -E '^[0-9]+\.' || true)"
if [ -z "$resolved_ips" ]; then
    die "no A record found for $DOMAIN — create it (value $public_ip) and re-run. Let's Encrypt would fail anyway."
fi
if ! grep -qx "$public_ip" <<<"$resolved_ips"; then
    die "DNS mismatch: $DOMAIN resolves to [$(echo "$resolved_ips" | tr '\n' ' ')] but this instance is $public_ip. Fix the A record and re-run."
fi
log "DNS OK: $DOMAIN → $public_ip"

# Ports 80/443 cannot be self-tested from inside the SG — remind the operator.
log "PREREQUISITE: the EC2 security group must allow inbound TCP 80 and 443 from 0.0.0.0/0 (cannot be verified from the host)."

##############################################################################
# 1. Docker engine + compose plugin (idempotent)
##############################################################################
if ! command -v docker >/dev/null 2>&1; then
    log "installing docker via get.docker.com"
    if ! curl -fsSL https://get.docker.com | sh; then
        warn "get.docker.com failed — falling back to apt docker.io + docker-compose-v2"
        apt-get update -y
        apt-get install -y docker.io docker-compose-v2
    fi
    systemctl enable --now docker 2>/dev/null || service docker start 2>/dev/null || true
fi
command -v docker >/dev/null 2>&1 || die "docker is not installed"
docker compose version >/dev/null 2>&1 || die "docker compose plugin is missing (apt-get install docker-compose-v2)"
log "docker $(docker --version | grep -o '[0-9][^ ]*') + compose $(docker compose version --short) ready"

##############################################################################
# 2. Get the repo on this machine
##############################################################################
if [ -z "$APP_DIR" ]; then
    script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
    if [ -f "$script_dir/../docker-compose.yml" ]; then
        APP_DIR="$(cd "$script_dir/.." && pwd)"   # ran from inside the repo
    else
        APP_DIR="$DEFAULT_CLONE_DIR"              # bootstrapping a fresh host
    fi
fi

if [ ! -f "$APP_DIR/docker-compose.yml" ]; then
    log "cloning $REPO_URL → $APP_DIR"
    mkdir -p "$(dirname "$APP_DIR")"
    git clone "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

# Pull latest code when this is a checkout. Run git as the invoking user when
# possible so root never owns merge artifacts.
if [ -d .git ]; then
    git_runner=(git)
    if [ -n "${SUDO_USER:-}" ] && [ "${SUDO_USER}" != "root" ]; then
        git_runner=(sudo -u "${SUDO_USER}" git)
    fi
    if "${git_runner[@]}" pull --ff-only; then
        log "repo up to date"
    else
        warn "git pull failed (local changes or no upstream?) — deploying the current tree"
    fi
fi
[ -f docker-compose.yml ] || die "$APP_DIR has no docker-compose.yml — wrong directory?"

##############################################################################
# 3. .env (generated on the server, never committed / baked into images)
##############################################################################
if [ ! -f .env ]; then
    if [ -z "$CERTBOT_EMAIL" ]; then
        CERTBOT_EMAIL="$DEFAULT_CERTBOT_EMAIL"
        warn "CERTBOT_EMAIL not set — using placeholder $CERTBOT_EMAIL. Override it: edit .env (or export CERTBOT_EMAIL) and re-run."
    fi
    POSTGRES_PASSWORD="$(openssl rand -hex 24)"
    umask 077
    cat > .env <<EOF
# Generated by deploy/deploy.sh on $(date -u +%Y-%m-%dT%H:%M:%SZ) — KEEP SECRET
POSTGRES_PASSWORD=$POSTGRES_PASSWORD
CERTBOT_EMAIL=$CERTBOT_EMAIL
DOMAIN=$DOMAIN
EOF
    log ".env generated (mode 600) — POSTGRES_PASSWORD is a fresh 24-byte hex secret"
else
    log ".env already exists — keeping it"
fi

# Single source of truth: whatever .env says wins (allows editing it by hand).
set -a
# shellcheck disable=SC1091
. ./.env
set +a
: "${POSTGRES_PASSWORD:?POSTGRES_PASSWORD missing in .env}"
: "${CERTBOT_EMAIL:?CERTBOT_EMAIL missing in .env}"
: "${DOMAIN:?DOMAIN missing in .env}"

##############################################################################
# 4. Build images, bring up the database, run migrations
##############################################################################
log "building images (bun deps → next build → node runtime)"
docker compose build

log "starting postgres"
docker compose up -d db

log "waiting for postgres to accept connections"
for i in $(seq 1 60); do
    if docker compose exec -T db pg_isready -U fleets -d fleets >/dev/null 2>&1; then
        break
    fi
    [ "$i" -eq 60 ] && die "postgres never became healthy — check: docker compose logs db"
    sleep 2
done
log "postgres healthy"

log "applying prisma migrations (one-shot 'migrate' service)"
docker compose run --rm migrate

##############################################################################
# 5. Apache bootstrap → certificate issuance → SSL cutover
##############################################################################
render_vhost() { # render_vhost <template> → apache/active.conf
    sed "s/__DOMAIN__/${DOMAIN}/g" "apache/$1" > apache/active.conf
    log "active vhost: apache/$1 → apache/active.conf (domain ${DOMAIN})"
}
cert_exists() { docker compose exec -T apache test -f "/etc/letsencrypt/live/${DOMAIN}/fullchain.pem" 2>/dev/null; }

log "starting apache with the HTTP bootstrap vhost"
render_vhost bootstrap.conf
docker compose up -d apache   # also starts frontend via depends_on

# Wait until apache actually answers on :80 (challenge must be servable).
for i in $(seq 1 30); do
    if curl -fsS -o /dev/null --max-time 2 "http://localhost/.well-known/acme-challenge/ping" 2>/dev/null; then
        break # 200 — someone dropped a file there; fine
    fi
    code="$(curl -s -o /dev/null -w '%{http_code}' --max-time 2 http://localhost/ 2>/dev/null || true)"
    [ "$code" != "000" ] && [ -n "$code" ] && break   # any HTTP answer = listening
    [ "$i" -eq 30 ] && warn "apache did not answer on :80 within 60s — certbot may fail; it can be retried"
    sleep 2
done

ssl_on=0
if cert_exists; then
    log "certificate already present in the certbot volume — skipping issuance"
    ssl_on=1
elif docker compose run --rm certbot; then
    log "certificate issued for ${DOMAIN}"
    ssl_on=1
else
    warn "certbot failed — keeping the HTTP bootstrap vhost so the site stays reachable."
    warn "retry later with:  docker compose run --rm certbot   then re-run this script to switch to SSL"
fi

if [ "$ssl_on" -eq 1 ]; then
    render_vhost caspratique.conf
    docker compose exec -T apache apachectl graceful \
        || { warn "graceful reload failed — restarting apache"; docker compose restart apache; }
    log "SSL active — https://${DOMAIN}"
fi

##############################################################################
# 6. Frontend + final smoke tests
##############################################################################
log "ensuring frontend is up"
docker compose up -d frontend

scheme="http"; [ "$ssl_on" -eq 1 ] && scheme="https"
curl_flags=(-s -o /dev/null -w '%{http_code}')
[ "$scheme" = "https" ] && curl_flags=(-sk -o /dev/null -w '%{http_code}')

code="$(curl "${curl_flags[@]}" "$scheme://localhost/")"
case "$code" in
    301|302) [ "$ssl_on" -eq 1 ] || die "unexpected redirect chain on bootstrap: / → $code" ;;
    307|200) [ "$ssl_on" -eq 1 ] && die "expected 301→https on / (got $code) — is apache/active.conf the SSL variant?" ;;
    *) die "GET / returned $code — check: docker compose logs apache frontend" ;;
esac
log "GET / → $code (redirect into the app)"

if [ "$ssl_on" -eq 1 ]; then
    code="$(curl -sk -o /dev/null -w '%{http_code}' https://localhost/)"
    [ "$code" = "307" ] || die "https://localhost/ returned $code (expected 307 → /fr/fleets) — check: docker compose logs apache frontend"
    log "https://localhost/ → 307 (locale redirect, handled by the app)"

    code="$(curl -sk -o /dev/null -w '%{http_code}' https://localhost/fr/fleets)"
    [ "$code" = "200" ] || die "/fr/fleets returned $code — check: docker compose logs frontend"
    log "https://localhost/fr/fleets → 200"

    code="$(curl -sk -X POST https://localhost/api/fleets \
        -H 'content-type: application/json' \
        -d '{"title":"deploy smoke test","color":"#3E93E1"}' \
        -o /dev/null -w '%{http_code}')"
    [ "$code" = "201" ] || die "POST /api/fleets returned $code — check: docker compose logs frontend db"
    log "POST /api/fleets → 201"

    curl -sk "https://localhost/api/fleets?limit=50" | grep -q '"deploy smoke test"' \
        || die "created fleet not returned by GET /api/fleets"
    log "GET  /api/fleets → contains the smoke-test row"
else
    code="$(curl -s -o /dev/null -w '%{http_code}' "http://localhost/fr/fleets")"
    [ "$code" = "200" ] || die "/fr/fleets returned $code over http bootstrap — check: docker compose logs frontend"
    log "http://localhost/fr/fleets → 200 (bootstrap mode — no SSL yet)"
fi

##############################################################################
# 7. Renewal crontab (idempotent)
##############################################################################
cron_line="0 3 * * 1 cd ${APP_DIR} && docker compose run --rm certbot renew --quiet && docker compose exec -T apache apachectl graceful #${CRON_MARKER}"
if crontab -l 2>/dev/null | grep -qF "$CRON_MARKER"; then
    log "renewal crontab already installed (weekly, Mondays 03:00)"
else
    (crontab -l 2>/dev/null || true; echo "$cron_line") | crontab -
    log "renewal crontab installed (weekly, Mondays 03:00): certbot renew && apache graceful"
fi

##############################################################################
# 8. Summary
##############################################################################
cat <<SUMMARY

──────────────────────────────────────────────────────────────────────────────
 deployment complete
──────────────────────────────────────────────────────────────────────────────
 site            : https://${DOMAIN}   $([ "$ssl_on" -eq 0 ] && echo '(HTTP-only bootstrap — SSL pending, see warning above)')
 app             : https://${DOMAIN}/fr/fleets
 api             : https://${DOMAIN}/api/fleets
 secrets         : ${APP_DIR}/.env  (POSTGRES_PASSWORD lives here; chmod 600)
 db (debug)      : docker compose --profile debug up -d db-debug  → 127.0.0.1:5433
 logs            : docker compose logs -f apache frontend
                   docker compose logs db migrate
 re-deploy       : git pull && sudo bash deploy/deploy.sh   (safe to re-run)
 backup          : docker compose exec -T db pg_dump -U fleets fleets > backup-\$(date +%F).sql
 restore         : docker compose exec -T db psql -U fleets fleets < backup.sql
 renew cert (man): docker compose run --rm certbot renew && docker compose exec -T apache apachectl graceful
──────────────────────────────────────────────────────────────────────────────
SUMMARY
