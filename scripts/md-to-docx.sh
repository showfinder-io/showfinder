#!/bin/bash
# Convert every .md in a directory to .docx (via pandoc).
# Usage: ./scripts/md-to-docx.sh path/to/dir
# Default: content/cohorte-1-btp/

set -e

DIR="${1:-content/cohorte-1-btp}"

if [ ! -d "$DIR" ]; then
  echo "error: directory '$DIR' not found" >&2
  exit 1
fi

if ! command -v pandoc >/dev/null 2>&1; then
  echo "error: pandoc not installed (brew install pandoc)" >&2
  exit 1
fi

count=0
for md in "$DIR"/*.md; do
  [ -f "$md" ] || continue
  out="${md%.md}.docx"
  pandoc "$md" -o "$out"
  echo "  ok  $(basename "$out")"
  count=$((count + 1))
done

echo "converted: $count file(s) → $DIR/*.docx"
