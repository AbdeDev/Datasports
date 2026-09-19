#!/usr/bin/env bash
# Blocks commits where a *.env.example file contains what looks like a real
# secret instead of a placeholder (this has happened 3 times already — see
# memory: real credentials pasted into .env.example instead of .env).
set -euo pipefail

found=0

for file in "$@"; do
  [ -f "$file" ] || continue

  # URL with embedded credentials, e.g. postgresql://user:realpassword@host
  # (skip obvious placeholders like PASSWORD, xxx, changeme)
  url_creds=$(grep -Eo '://[^:/@[:space:]]+:[^@/[:space:]]+@' "$file" || true)
  if [ -n "$url_creds" ]; then
    while IFS= read -r match; do
      [ -n "$match" ] || continue
      case "$match" in
        *[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd]*|*xxx*|*XXX*|*changeme*|*your_*|*placeholder*) ;;
        *)
          echo "✖ $file: contains a URL with embedded credentials (user:password@host)"
          found=1
          ;;
      esac
    done <<< "$url_creds"
  fi

  # JWT-looking value: header.payload.signature, base64url segments
  if grep -Eq 'eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}' "$file"; then
    echo "✖ $file: contains what looks like a real JWT"
    found=1
  fi

  # Long value assigned to a *_SECRET / *_KEY / *_TOKEN / *_PASSWORD variable
  while IFS='=' read -r varname value; do
    [ -n "${varname:-}" ] || continue
    case "$varname" in
      *_SECRET|*_KEY|*_TOKEN|*_PASSWORD)
        case "$value" in
          *xxx*|*XXX*|*changeme*|*your_*|*placeholder*|"") ;;
          *)
            if [ "${#value}" -gt 20 ]; then
              echo "✖ $file: $varname looks like a real secret (long, non-placeholder value)"
              found=1
            fi
            ;;
        esac
        ;;
    esac
  done < <(grep -E '^[A-Za-z_]+=' "$file" || true)
done

if [ "$found" -eq 1 ]; then
  echo ""
  echo "Blocked: move the real value to the matching .env file (gitignored)"
  echo "and keep .env.example as a placeholder template."
  exit 1
fi
