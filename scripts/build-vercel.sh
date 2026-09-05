#!/usr/bin/env bash
set -euo pipefail

# Standard Vercel/Linux environments expose /proc and need no compatibility
# layer. The restricted verification workspace does not expose /proc, while
# Next.js reads process memory statistics during startup.
if [[ -r /proc/self/statm ]]; then
  exec next build --webpack
fi

NODE_OPTIONS="${NODE_OPTIONS:-} --require=$(pwd)/scripts/node-memory-compat.cjs" \
  exec next build --webpack
