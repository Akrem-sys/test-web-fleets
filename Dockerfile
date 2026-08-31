# syntax=docker/dockerfile:1

##############################################################################
# Stage 1 — deps: install node_modules with bun.
# bun's trustedDependencies semantics (package.json) apply ONLY in the bun
# stages; the runtime stage is plain node with no package install at all.
##############################################################################
FROM oven/bun:1 AS deps
WORKDIR /app

# Lockfile-first install for reproducible, cacheable layers.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

##############################################################################
# Stage 2 — migrate: everything `prisma db migrate` needs (no next build).
# Reused by the `migrate` compose service (build target: "migrate").
##############################################################################
FROM deps AS migrate
WORKDIR /app
# prisma.config.ts + the on-disk migration graph + the contract it references.
COPY prisma.config.ts ./
COPY migrations ./migrations
COPY src/prisma ./src/prisma

##############################################################################
# Stage 3 — builder: compile the Next.js standalone server.
##############################################################################
FROM oven/bun:1 AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# Build-time placeholder only (routes are dynamic; nothing connects at build).
# Real DATABASE_URL is injected per-environment at runtime. Never bake secrets.
ENV DATABASE_URL="postgresql://build:build@127.0.0.1:5432/build"

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

##############################################################################
# Stage 4 — runtime: standalone Next server on node.
# .next/standalone does NOT include .next/static or public — the Next docs
# require copying them in manually (node_modules/next/dist/docs/.../output.md):
#   cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/
##############################################################################
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

USER node
EXPOSE 3000
CMD ["node", "server.js"]
