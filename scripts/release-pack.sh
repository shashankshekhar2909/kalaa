#!/usr/bin/env bash
# Build @kalaa/tokens and @kalaa/react and pack them as release tarballs (decision D8: apps vendor these).
#   scripts/release-pack.sh            -> release/kalaa-tokens-<v>.tgz, release/kalaa-react-<v>.tgz
# Apps copy both files into vendor/ and depend on "file:vendor/kalaa-<pkg>-<v>.tgz". Version comes from package.json.
set -euo pipefail
cd "$(dirname "$(readlink -f "$0")")/.."
. bin/env.sh
[ -z "$(git status --porcelain)" ] || { echo "working tree is dirty; commit first" >&2; exit 1; }
pnpm build >/dev/null
mkdir -p release
for p in tokens react; do (cd "packages/$p" && pnpm pack --pack-destination ../../release >/dev/null); done
ls -1 release/*.tgz
