# Deploying caspratique.conduigo.com (one-shot)

## Prerequisites (manual, once)

- **EC2** Ubuntu 22.04+ (t3.small is plenty), with an **SSH key**.
- **Security group**: allow inbound **TCP 80 + 443** from `0.0.0.0/0` (and your
  SSH port). The deploy script cannot verify this from inside the instance.
- **DNS**: create an **A record** `caspratique.conduigo.com → <instance public IP>`.
  The script checks this itself and aborts with a clear message on mismatch —
  Let's Encrypt issuance would fail anyway.

## Run

```bash
git clone https://github.com/Akrem-sys/test-web-fleets.git /opt/caspratique
cd /opt/caspratique
sudo bash deploy/deploy.sh
```

Optional overrides (env vars): `DOMAIN`, `CERTBOT_EMAIL` (defaults to a
placeholder `admin@conduigo.com` — set the real one before first run, or edit
`.env` afterwards and re-run), `REPO_URL`, `APP_DIR`.

## What it does

1. **Preflight** — Ubuntu check, detects the instance's public IP, verifies DNS
   points here, reminds about the security group.
2. **Docker** — installs engine + compose plugin if missing (get.docker.com,
   fallback `apt docker.io docker-compose-v2`). Idempotent.
3. **Repo** — clones if absent (`REPO_URL` overridable), otherwise `git pull`.
4. **`.env`** — generated **on the server** (never committed, never baked into
   images): `POSTGRES_PASSWORD` (random 24-byte hex), `CERTBOT_EMAIL`, `DOMAIN`.
5. **Build + DB** — `docker compose build`, starts `db` (postgres:16, internal
   network only, no published ports), waits for `pg_isready`, then runs the
   one-shot `migrate` service: `bunx prisma db migrate` against `db:5432`.
6. **SSL bootstrap** — starts apache with the HTTP-only `bootstrap.conf`
   (site already works over `http://`), requests the certificate via
   `docker compose run --rm certbot certonly --webroot …`, then on success
   swaps in the SSL vhost and `apachectl graceful`. If issuance fails the
   bootstrap vhost stays active and the script prints how to retry.
7. **Frontend + smoke tests** — brings up `frontend` (Next standalone server,
   internal port 3000, never published), then checks `/ → 301 → https`,
   `https:/// → 307 → /fr/fleets`, `https:///fr/fleets → 200`, and a
   POST/GET round-trip on `/api/fleets`.
8. **Renewal cron** — installs root crontab `0 3 * * 1` (weekly, Mondays 03:00):
   `certbot renew` + apache graceful reload. Insertion is idempotent.

## Re-running

The script is **idempotent** — safe to run again at any time (it skips an
existing `.env`, skips issuance when the certificate already exists, and won't
duplicate the crontab). To ship new code: `git pull && sudo bash deploy/deploy.sh`.

## Operations

```bash
docker compose logs -f apache frontend      # tail logs
docker compose ps                           # state
docker compose --profile debug up -d db-debug   # db on 127.0.0.1:5433 (loopback only)

# Backup / restore
docker compose exec -T db pg_dump -U fleets fleets > backup-$(date +%F).sql
docker compose exec -T db psql -U fleets fleets < backup.sql

# Certificate ops
docker compose run --rm certbot renew
docker compose exec -T apache apachectl graceful

# Re-issue from scratch (new volume)
docker compose down && docker volume rm caspratique_certbot-etc
```
