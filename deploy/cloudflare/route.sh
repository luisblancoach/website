#!/usr/bin/env bash
# Status and removal of the review route, for verification and rollback.
#
#   deploy/cloudflare/route.sh status   read-only: Workers routes on the zone and
#                                       what the review host answers
#   deploy/cloudflare/route.sh remove   deletes ONLY the route
#                                       raidguild.estudioblanco.org/* bound to
#                                       raidguild-estudioblanco
#
# Wrangler never removes a route when a config has no "routes", so the rollback
# needs this. Attaching the route is `wrangler deploy -c wrangler.route.jsonc`.
# Rollback order: re-enable the Cloudflare redirect rule FIRST (the record's
# own origin is unknown), then `route.sh remove`.
#
# Auth: $CLOUDFLARE_API_TOKEN if set, otherwise the Wrangler OAuth login. The
# token is never printed. Other routes and Workers on the zone are never touched.
set -euo pipefail

ZONE_NAME="estudioblanco.org"
HOST="raidguild.estudioblanco.org"
PATTERN="$HOST/*"
SCRIPT="raidguild-estudioblanco"
API="https://api.cloudflare.com/client/v4"
MODE="${1:?usage: route.sh status|remove}"

TOKEN="${CLOUDFLARE_API_TOKEN:-}"
if [ -z "$TOKEN" ]; then
  CONFIG="$HOME/Library/Preferences/.wrangler/config/default.toml"
  [ -f "$CONFIG" ] || CONFIG="$HOME/.config/.wrangler/config/default.toml"
  TOKEN="$(sed -nE 's/^oauth_token = "(.*)"$/\1/p' "$CONFIG")"
  [ -n "$TOKEN" ] || { echo "route.sh: no token; run 'wrangler login' or set CLOUDFLARE_API_TOKEN" >&2; exit 1; }
  echo "route.sh: using the Wrangler OAuth login (run 'wrangler whoami' first if it has expired)"
fi
api() { curl -sS -H "Authorization: Bearer $TOKEN" "$@"; }

ZONE_ID="$(api "$API/zones?name=$ZONE_NAME" | python3 -c 'import json,sys; d=json.load(sys.stdin); assert d["success"], d["errors"]; print(d["result"][0]["id"])')"
ROUTES="$(api "$API/zones/$ZONE_ID/workers/routes")"

case "$MODE" in
  status)
    echo "Workers routes on $ZONE_NAME:"
    python3 -c 'import json,sys; d=json.load(sys.stdin); assert d["success"], d["errors"]; [print("  %-40s -> %s" % (r["pattern"], r.get("script"))) for r in d["result"]]' <<<"$ROUTES"
    for path in / /agency /community /clients; do
      printf '  https://%s%-11s ' "$HOST" "$path"
      curl -s -o /dev/null --max-time 15 -w '%{http_code} -> %{redirect_url}\n' "https://$HOST$path"
    done
    ;;
  remove)
    ID="$(python3 -c '
import json, sys
d = json.load(sys.stdin); assert d["success"], d["errors"]
ids = [r["id"] for r in d["result"] if r["pattern"] == sys.argv[1] and r.get("script") == sys.argv[2]]
print(ids[0] if len(ids) == 1 else "")' "$PATTERN" "$SCRIPT" <<<"$ROUTES")"
    if [ -z "$ID" ]; then echo "route.sh: no route $PATTERN -> $SCRIPT; nothing to remove"; exit 0; fi
    api -X DELETE "$API/zones/$ZONE_ID/workers/routes/$ID" | python3 -c 'import json,sys; d=json.load(sys.stdin); print("removed" if d["success"] else d["errors"])'
    ;;
  *) echo "usage: route.sh status|remove" >&2; exit 1 ;;
esac
