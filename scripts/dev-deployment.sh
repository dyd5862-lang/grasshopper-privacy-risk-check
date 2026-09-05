#!/usr/bin/env bash
set -euo pipefail

# The Sites preview service forwards Vite's --strictPort option. Ordinary
# local development keeps the expected Next.js `npm run dev` experience.
for argument in "$@"; do
  if [[ "$argument" == "--strictPort" ]]; then
    exec npm run dev:sites -- "$@"
  fi
done

exec npm run dev:vercel -- "$@"
