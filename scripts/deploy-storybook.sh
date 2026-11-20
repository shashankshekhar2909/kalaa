#!/usr/bin/env bash
# Build the Kalaa site + Storybook and publish to a remote host, served by Caddy on :8100:
# site at /, Storybook at /storybook/. Public at https://kalaa.buildwithshashank.com.
#   scripts/deploy-storybook.sh        build from the committed HEAD and publish
# Rollback: ssh "$HOST" "cd ~/$DIR && docker compose down"  (or re-run from an older commit)
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")/.."
. bin/env.sh
[ -f .env.deploy ] && . .env.deploy || true
[ -z "$(git status --porcelain)" ] || { echo "working tree is dirty; commit first" >&2; exit 1; }
HOST="${DEPLOY_HOST:-${HOST:-deploy-server}}"
DIR="${DEPLOY_DIR:-${DIR:-kalaa-storybook}}"
PORT="${DEPLOY_PORT:-${PORT:-8100}}"
DEPLOY_URL="${DEPLOY_URL:-http://127.0.0.1:${PORT}}"
REV=$(git rev-parse --short HEAD)
pnpm build >/dev/null
pnpm build-storybook >/dev/null
SITE_BASE=/ SITE_STORYBOOK_URL=/storybook/ pnpm build:site >/dev/null
rm -rf .deploy-site && mkdir .deploy-site
cp -r apps/site/dist/. .deploy-site/
mkdir .deploy-site/storybook && cp -r apps/storybook/storybook-static/. .deploy-site/storybook/
echo "$REV" > .deploy-site/version.txt
ssh -o BatchMode=yes "$HOST" "mkdir -p ~/$DIR/site"
rsync -a deploy/compose.yaml deploy/Caddyfile "$HOST:$DIR/"
rsync -a --delete-after .deploy-site/ "$HOST:$DIR/site/"
rm -rf .deploy-site
ssh -o BatchMode=yes "$HOST" "cd ~/$DIR && docker compose up -d --quiet-pull --force-recreate 2>&1 | tail -1"  # recreate: Caddy admin is off, so no reload
for i in $(seq 10); do
  v=$(ssh -o BatchMode=yes "$HOST" "curl -fsS -m 5 http://127.0.0.1:${PORT}/version.txt" 2>/dev/null || true)
  [ "$v" = "$REV" ] && { echo "[storybook] $REV live on $DEPLOY_URL"; exit 0; }
  sleep 2
done
echo "[storybook] deployed but version check failed" >&2; exit 1
