#!/usr/bin/env bash
set -euo pipefail

# Vercel always exposes VERCEL=1 during its build. Keep the existing Sites
# artifact path for this project's current hosted deployment, while producing a
# standard Next.js .next output when the same repository is built by Vercel.
if [[ "${VERCEL:-}" == "1" ]]; then
  exec npm run build:vercel
fi

exec npm run build:sites
