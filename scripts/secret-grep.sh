#!/usr/bin/env bash
set -euo pipefail

PATTERN='rzp_live_[A-Za-z0-9]+|-----BEGIN (RSA )?PRIVATE KEY-----|mongodb(\+srv)?://[^ ]+:[^ @]+@|AIza[0-9A-Za-z_-]{20,}'

scan_path() {
  local path="$1"
  if grep -RInE --exclude='*.env.example' --exclude='secret-grep.sh' "$PATTERN" "$path"; then
    echo "Potential secret detected in $path" >&2
    return 1
  fi
}

scan_tracked() {
  if git grep -nE "$PATTERN" -- ':!*.env.example' ':!scripts/secret-grep.sh'; then
    echo "Potential secret detected in tracked files" >&2
    return 1
  fi
  for path in apps/*/dist; do
    [ -d "$path" ] && scan_path "$path"
  done
}

if [ "${1:-}" = "--self-test" ]; then
  temp_dir="$(mktemp -d)"
  trap 'rm -rf "$temp_dir"' EXIT
  printf 'rzp_live_fake123\n' > "$temp_dir/fake.txt"
  if scan_path "$temp_dir" >/dev/null 2>&1; then
    echo "secret-grep self-test failed to catch fake secret" >&2
    exit 1
  fi
  printf 'VITE_API_BASE_URL=placeholder\n' > "$temp_dir/.env.example"
  scan_path "$temp_dir/.env.example"
  echo "secret-grep self-test passed"
  exit 0
fi

scan_tracked
echo "No secret patterns found"
