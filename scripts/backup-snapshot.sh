#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAMP="$(date +%Y%m%d-%H%M)"
OUT="$ROOT/backups/releases/neon-park-$STAMP.tar.gz"
mkdir -p "$ROOT/backups/releases"
cd "$ROOT"
tar -czf "$OUT" \
  --exclude='backups/releases' \
  --exclude='.git' \
  --exclude='node_modules' \
  index.html kampagne.json README.md BACKUP.md docs assets vendor 2>/dev/null \
  || tar -czf "$OUT" index.html kampagne.json README.md BACKUP.md docs assets 2>/dev/null \
  || tar -czf "$OUT" index.html assets
ls -lh "$OUT"
echo "OK $OUT"
