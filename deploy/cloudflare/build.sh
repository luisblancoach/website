#!/usr/bin/env bash
# Reproducible Cloudflare Workers build of a committed ref (OpenNext adapter).
#
#   deploy/cloudflare/build.sh <git-ref> [out-dir]
#
# - Builds from `git archive <ref>` only: the working tree (uncommitted Night
#   CSS, the owner's package.json, local images, fonts, PDFs, .env files) never
#   enters the build.
# - Refuses unless the app tree of <ref> equals $BASELINE (default
#   checkpoint/agency-baseline): everything except deploy/, docs/ and the
#   continuity Markdown files at the root (STATUS, CHANGELOG, AGENTS, ...).
# - The repository package.json is never edited: the adapter comes from the
#   locked overlay in this directory (package.cloudflare.json and
#   bun.cloudflare.lock = the app's package.json and lock plus the two pinned
#   tools), installed with --frozen-lockfile in the build directory.
# - Builds with an empty environment plus SHOW_REVIEW_FLAGS=false, so review
#   flags stay off and no local variable leaks into the prerendered pages.
# - NEXT_PUBLIC_EDITORIAL_MODE=opt-in: Editorial Mode ships with the review host,
#   hidden until a visitor opens a page with ?editorial=1 (browser-local drafts
#   only; the parameter is not authentication). See src/lib/editorial/config.ts.
# - Static first (static-first.mjs): prerendered pages, their RSC payloads, the
#   optimised images they use and the data snapshots go into the static assets,
#   so the Worker answers them without loading Next.js (Workers Free CPU limit).
# - Ends with `wrangler deploy --dry-run` (no account call) and BUILD_INFO.
#
# KIT_DIR=<dir> takes the kit files from <dir> instead of <ref>: for testing an
# uncommitted kit only. BUILD_INFO then says so, and such a build must not be
# deployed.
set -euo pipefail

REF="${1:?usage: deploy/cloudflare/build.sh <git-ref> [out-dir]}"
ROOT="$(git rev-parse --show-toplevel)"
SHA="$(git -C "$ROOT" rev-parse --verify "$REF^{commit}")"
BASELINE="${BASELINE:-checkpoint/agency-baseline}"
OUT="${2:-$HOME/Projects/raidguild-backups/$(date +%F)/cf-build-${SHA:0:7}}"

if [ -e "$OUT" ]; then echo "build.sh: $OUT exists; refusing to reuse it" >&2; exit 1; fi
APP=(. ':(exclude)deploy' ':(exclude)docs' ':(exclude,glob)*.md')
if ! git -C "$ROOT" diff --quiet "$BASELINE" "$SHA" -- "${APP[@]}"; then
  echo "build.sh: the app tree of $REF differs from $BASELINE:" >&2
  git -C "$ROOT" diff --stat "$BASELINE" "$SHA" -- "${APP[@]}" >&2
  exit 1
fi

mkdir -p "$OUT"
git -C "$ROOT" archive "$SHA" | tar -x -C "$OUT"
KIT_SOURCE="$REF ($SHA)"
if [ -n "${KIT_DIR:-}" ]; then
  mkdir -p "$OUT/deploy/cloudflare"
  cp "$KIT_DIR"/{package.cloudflare.json,bun.cloudflare.lock,wrangler.jsonc,wrangler.route.jsonc,worker.js,static-first.mjs} "$OUT/deploy/cloudflare/"
  KIT_SOURCE="$KIT_DIR (uncommitted; NOT FOR DEPLOYMENT)"
fi
KIT="$OUT/deploy/cloudflare"
cd "$OUT"

# The overlay must be the app's package.json plus exactly the two pinned tools.
node - "$KIT" <<'NODE'
const fs = require("node:fs");
const kit = process.argv[2];
const app = JSON.parse(fs.readFileSync("package.json", "utf8"));
const overlay = JSON.parse(fs.readFileSync(`${kit}/package.cloudflare.json`, "utf8"));
const tools = { "@opennextjs/cloudflare": "1.20.16", wrangler: "4.158.0" };
for (const [name, version] of Object.entries(tools)) {
  if (overlay.devDependencies?.[name] !== version) throw new Error(`overlay must pin ${name}@${version}`);
  delete overlay.devDependencies[name];
}
const canon = (v) => Array.isArray(v) ? v.map(canon) : v && typeof v === "object" ? Object.fromEntries(Object.keys(v).sort().map((k) => [k, canon(v[k])])) : v;
if (JSON.stringify(canon(app)) !== JSON.stringify(canon(overlay))) throw new Error("package.cloudflare.json has drifted from the app package.json; regenerate the overlay");
// The cutover config may differ from the workers.dev config only by "routes".
const jsonc = (file) => JSON.parse(fs.readFileSync(file, "utf8").split("\n").filter((line) => !/^\s*\/\//.test(line)).join("\n"));
const base = jsonc(`${kit}/wrangler.jsonc`);
const route = jsonc(`${kit}/wrangler.route.jsonc`);
const routes = route.routes; delete route.routes;
if (base.routes || JSON.stringify(canon(base)) !== JSON.stringify(canon(route))) throw new Error("wrangler.route.jsonc must equal wrangler.jsonc plus routes");
if (JSON.stringify(routes) !== JSON.stringify([{ pattern: "raidguild.estudioblanco.org/*", zone_name: "estudioblanco.org" }])) throw new Error("unexpected cutover routes");
console.log("overlay and wrangler configs: OK");
NODE

cp "$KIT/package.cloudflare.json" package.json
cp "$KIT/bun.cloudflare.lock" bun.lock
rm -f bun.lockb
cp "$KIT/wrangler.jsonc" "$KIT/wrangler.route.jsonc" "$KIT/worker.js" "$KIT/static-first.mjs" .
cat > open-next.config.ts <<'TS'
import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({});
TS

CLEAN_ENV=(env -i "PATH=$PATH" "HOME=$HOME" "TMPDIR=${TMPDIR:-/tmp}" CI=1 NEXT_TELEMETRY_DISABLED=1 SHOW_REVIEW_FLAGS=false NEXT_PUBLIC_EDITORIAL_MODE=opt-in)
"${CLEAN_ENV[@]}" bun install --frozen-lockfile
"${CLEAN_ENV[@]}" ./node_modules/.bin/opennextjs-cloudflare build 2>&1 | tee opennext-build.log
printf '/*\n  X-Robots-Tag: noindex, nofollow\n' > .open-next/assets/_headers
"${CLEAN_ENV[@]}" node static-first.mjs 2>&1 | tee static-first.log
"${CLEAN_ENV[@]}" ./node_modules/.bin/wrangler deploy --dry-run --outdir .wrangler-dry 2>&1 | tee dry-run.log

{
  echo "commit: $SHA"
  echo "ref: $REF"
  echo "baseline: $BASELINE ($(git -C "$ROOT" rev-parse "$BASELINE^{commit}")), app tree identical (deploy/, docs/, root *.md excluded)"
  echo "kit: $KIT_SOURCE"
  echo "built: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "bun: $(bun --version); node: $(node --version)"
  echo "@opennextjs/cloudflare: $(node -p 'require("./node_modules/@opennextjs/cloudflare/package.json").version'); wrangler: $(./node_modules/.bin/wrangler --version | tail -1)"
  echo "next: $(node -p 'require("./node_modules/next/package.json").version')"
  grep -E 'Total Upload' dry-run.log || true
  grep -E '^static-first:' static-first.log || true
  echo "static assets: $(find .open-next/assets -type f | wc -l | tr -d ' ') files, $(du -sh .open-next/assets | cut -f1)"
} | tee BUILD_INFO
echo "build.sh: done in $OUT"
