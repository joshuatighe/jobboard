#!/bin/bash
# SessionStart hook for Claude Code cloud sessions:
#   1. installs dependencies with pnpm
#   2. starts Docker and a local Supabase stack (migrations applied), seeded with demo data
#   3. exports the local stack's credentials as SUPABASE_LOCAL_* for `pnpm dev:local` / `pnpm db:seed:local`
# Local Supabase is best-effort: if it fails, the session still starts.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

echo "Installing dependencies..."
pnpm install

start_local_supabase() {
  if ! docker info >/dev/null 2>&1; then
    echo "Starting Docker daemon..."
    nohup dockerd >/tmp/dockerd.log 2>&1 &
    for _ in $(seq 1 60); do
      docker info >/dev/null 2>&1 && break
      sleep 1
    done
    docker info >/dev/null 2>&1 || { echo "Docker did not start (see /tmp/dockerd.log)"; return 1; }
  fi

  echo "Starting local Supabase..."
  pnpm db:start >/tmp/supabase-start.log 2>&1 || { tail -20 /tmp/supabase-start.log; return 1; }

  local status
  status="$(pnpm -s supabase status -o env 2>/dev/null)"
  local api_url anon_key service_key
  api_url="$(sed -n 's/^API_URL="\(.*\)"$/\1/p' <<<"$status")"
  anon_key="$(sed -n 's/^ANON_KEY="\(.*\)"$/\1/p' <<<"$status")"
  service_key="$(sed -n 's/^SERVICE_ROLE_KEY="\(.*\)"$/\1/p' <<<"$status")"
  [ -n "$api_url" ] && [ -n "$anon_key" ] && [ -n "$service_key" ] || { echo "Could not read local Supabase credentials"; return 1; }

  if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
    {
      echo "export SUPABASE_LOCAL_URL='$api_url'"
      echo "export SUPABASE_LOCAL_ANON_KEY='$anon_key'"
      echo "export SUPABASE_LOCAL_SERVICE_ROLE_KEY='$service_key'"
    } >>"$CLAUDE_ENV_FILE"
  fi

  echo "Seeding local Supabase..."
  VITE_SUPABASE_URL="$api_url" SUPABASE_SERVICE_ROLE_KEY="$service_key" pnpm -s db:seed >/tmp/supabase-seed.log 2>&1 \
    || { tail -20 /tmp/supabase-seed.log; return 1; }
  echo "Local Supabase ready at $api_url"
}

start_local_supabase || echo "WARNING: local Supabase is unavailable this session. Continuing without it."
