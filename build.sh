#!/bin/sh
set -u
out=${1:-public}
log=$(zola build --output-dir "$out" --force 2>&1)
status=$?
echo "$log"
[ "$status" -eq 0 ] || exit "$status"
if echo "$log" | grep -q WARN; then
    echo "Build com avisos: corrija os itens acima." >&2
    exit 1
fi
