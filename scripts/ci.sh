#!/usr/bin/env bash
# Local docs CI: Mintlify build validation, broken-link check, EN<->KO parity.
#
# This is the primary CI path (GitHub Actions is not used for billing reasons;
# the workflow in .github/workflows/docs-ci.yml is optional and just calls this).
#
# Usage:  scripts/ci.sh
# Env:
#   MINTLIFY_VERSION  mintlify CLI version for npx (default: pinned below; "latest" also works)
#   CI_OUT_ROOT       where log dirs go (default: /workspace/out locally, ./ci-logs under $CI)
#
# Logs: $CI_OUT_ROOT/local-ci-<short-sha>/{validate,broken-links,parity}.log + summary.txt
set -uo pipefail

cd "$(dirname "$0")/.."

MINTLIFY_VERSION="${MINTLIFY_VERSION:-4.2.1126}"
SHA="$(git rev-parse --short HEAD 2>/dev/null || echo nogit)"
if ! git diff --quiet HEAD 2>/dev/null; then SHA="${SHA}-dirty"; fi
if [[ -n "${CI:-}" ]]; then DEFAULT_OUT_ROOT="$PWD/ci-logs"; else DEFAULT_OUT_ROOT="/workspace/out"; fi
OUT_DIR="${CI_OUT_ROOT:-$DEFAULT_OUT_ROOT}/local-ci-${SHA}"
mkdir -p "$OUT_DIR"

MINT=(npx --yes "mintlify@${MINTLIFY_VERSION}")
declare -a RESULTS=()
FAILED=0

run_step() {
  local name="$1"; shift
  local log="$OUT_DIR/${name}.log"
  echo "==> ${name}: $*"
  if "$@" >"$log" 2>&1; then
    RESULTS+=("PASS  ${name}  (${log})")
  else
    RESULTS+=("FAIL  ${name}  (${log})")
    FAILED=1
    tail -n 40 "$log" | sed 's/^/    /'
  fi
}

run_step validate     "${MINT[@]}" validate
run_step broken-links "${MINT[@]}" broken-links
run_step parity       node scripts/check-parity.mjs

{
  echo "docs local CI @ ${SHA}  ($(date '+%Y-%m-%d %H:%M:%S %Z'))"
  echo "mintlify@${MINTLIFY_VERSION}, node $(node --version)"
  printf '%s\n' "${RESULTS[@]}"
} | tee "$OUT_DIR/summary.txt"

exit "$FAILED"
