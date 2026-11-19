#!/usr/bin/env bash
# Build Storybook on Alpha and publish it to deploy-server (~/kalaa-storybook), served by Caddy on :8100 (LAN/Tailscale only).
#   scripts/deploy-storybook.sh        build from the committed HEAD and publish
# Rollback: ssh deploy-server 'cd ~/kalaa-storybook && docker compose down'  (or re-run from an older commit)
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")/.."
. bin/env.sh
[ -z "$(git status --porcelain)" ] || { echo "working tree is dirty; commit first" >&2; exit 1; }
HOST=deploy-server; DIR=kalaa-storybook; REV=$(git rev-parse --short HEAD)
pnpm build >/dev/null
pnpm build-storybook >/dev/null
echo "$REV" > apps/storybook/storybook-static/version.txt
ssh -o BatchMode=yes "$HOST" "mkdir -p ~/$DIR/site"
rsync -a deploy/compose.yaml deploy/Caddyfile "$HOST:$DIR/"
rsync -a --delete-after apps/storybook/storybook-static/ "$HOST:$DIR/site/"
ssh -o BatchMode=yes "$HOST" "cd ~/$DIR && docker compose up -d --quiet-pull 2>&1 | tail -1"
for i in $(seq 10); do
  v=$(ssh -o BatchMode=yes "$HOST" "curl -fsS -m 5 http://127.0.0.1:8100/version.txt" 2>/dev/null || true)
  [ "$v" = "$REV" ] && { echo "[storybook] $REV live on http://deploy-server:8100"; exit 0; }
  sleep 2
done
echo "[storybook] deployed but version check failed" >&2; exit 1
