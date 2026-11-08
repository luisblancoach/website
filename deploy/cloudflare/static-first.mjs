// Static-first step of the Cloudflare build (run by build.sh in the build
// directory, after `opennextjs-cloudflare build`). It puts everything the
// public pages need into the static assets, so the Worker can answer those
// requests without loading Next.js (Workers Free allows 10 ms of CPU per
// request; a Next.js render takes 30–500 ms):
//
// 1. Prerendered routes (prerender-manifest.json, never revalidated): the HTML
//    and the RSC payload of each page, and the body of each static route
//    handler (robots.txt, sitemap.xml, favicon.ico, opengraph-image.png), with
//    the headers Next.js stored for them.
// 2. Optimised images: every /_next/image URL in those pages, produced by this
//    build's own `next start` (Next.js's optimiser, the same bytes a Node
//    deployment serves), as WebP.
// 3. Data snapshots: /api/posts and /api/artifacts as they answer at build
//    time (the Projects Explorer reads them; it has its own fallback list).
//
// Output: .open-next/assets/_static/… and static-manifest.js, which worker.js
// imports. Nothing here changes the application or its pages.
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { dirname, join } from "node:path";

const APP = ".next/server/app";
const ASSETS = ".open-next/assets";
const PREFIX = "/_static";
const DATA_ROUTES = ["/api/posts", "/api/artifacts"];
const IMAGE_ACCEPT = "image/avif,image/webp,*/*";

const put = (path, bytes) => {
  const file = join(ASSETS, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, bytes);
};
const meta = (base) => (existsSync(`${base}.meta`) ? JSON.parse(readFileSync(`${base}.meta`, "utf8")) : {});
const short = (text) => createHash("sha256").update(text).digest("hex").slice(0, 20);

// 1. Prerendered routes.
const prerender = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
const routes = {};
const pageHtml = [];
for (const [route, info] of Object.entries(prerender.routes)) {
  if (info.initialRevalidateSeconds !== false || route === "/_not-found") continue;
  const base = join(APP, route === "/" ? "index" : route.slice(1));
  const stored = meta(base);
  const headers = Object.fromEntries(Object.entries(stored.headers ?? {}).filter(([name]) => name !== "x-next-cache-tags"));
  const id = short(route);
  if (existsSync(`${base}.html`)) {
    const html = readFileSync(`${base}.html`);
    put(`${PREFIX}/p/${id}.page`, html);
    put(`${PREFIX}/p/${id}.flight`, readFileSync(`${base}.rsc`));
    routes[route] = { kind: "page", html: `${PREFIX}/p/${id}.page`, rsc: `${PREFIX}/p/${id}.flight`, status: stored.status ?? 200, headers };
    pageHtml.push(html.toString("utf8"));
  } else if (existsSync(`${base}.body`)) {
    put(`${PREFIX}/r/${id}.body`, readFileSync(`${base}.body`));
    routes[route] = { kind: "route", body: `${PREFIX}/r/${id}.body`, status: stored.status ?? 200, headers };
  }
}

// 2 and 3 need the built app running: `next start` on a free local port.
const port = await new Promise((resolve) => { const s = createServer(); s.listen(0, "127.0.0.1", () => { const { port: p } = s.address(); s.close(() => resolve(p)); }); });
const origin = `http://127.0.0.1:${port}`;
const server = spawn("./node_modules/.bin/next", ["start", "-p", String(port), "-H", "127.0.0.1"], { env: process.env, stdio: ["ignore", "pipe", "pipe"] });
let serverLog = "";
server.stdout.on("data", (chunk) => { serverLog += chunk; });
server.stderr.on("data", (chunk) => { serverLog += chunk; });
const stop = () => { if (!server.killed) server.kill("SIGTERM"); };
process.on("exit", stop);
for (let i = 0; ; i++) {
  try { if ((await fetch(`${origin}/robots.txt`)).ok) break; } catch { /* not up yet */ }
  if (i > 120) { console.error(serverLog); throw new Error("static-first: next start did not come up"); }
  await new Promise((resolve) => setTimeout(resolve, 500));
}

// 2. Images referenced by the prerendered pages (src, srcset and preload links).
const decode = (text) => text.replace(/&amp;/g, "&");
const urls = new Set();
for (const html of pageHtml) for (const match of html.matchAll(/\/_next\/image\?url=[^"'\s,]+/g)) urls.add(decode(match[0]));
const images = {};
const failed = [];
const queue = [...urls].sort();
await Promise.all(Array.from({ length: 6 }, async () => {
  for (let url = queue.shift(); url; url = queue.shift()) {
    const params = new URL(url, origin).searchParams;
    const key = `${params.get("url")}|${params.get("w")}|${params.get("q")}`;
    const response = await fetch(origin + url, { headers: { accept: IMAGE_ACCEPT } });
    if (!response.ok) { failed.push(`${response.status} ${url}`); continue; }
    const type = response.headers.get("content-type") ?? "application/octet-stream";
    const ext = type.split("/")[1]?.split(/[;+]/)[0] ?? "bin";
    const asset = `${PREFIX}/i/${short(key)}.${ext}`;
    put(asset, Buffer.from(await response.arrayBuffer()));
    images[key] = { asset, type, disposition: response.headers.get("content-disposition") ?? undefined };
  }
}));

// 3. Data snapshots (skipped when the upstream is unavailable: the Worker then
// falls back to the live route).
const data = {};
for (const route of DATA_ROUTES) {
  const response = await fetch(origin + route);
  const body = Buffer.from(await response.arrayBuffer());
  if (!response.ok || !(response.headers.get("content-type") ?? "").includes("json")) { failed.push(`${response.status} ${route} (snapshot skipped)`); continue; }
  const asset = `${PREFIX}/d/${short(route)}.json`;
  put(asset, body);
  data[route] = { asset, type: response.headers.get("content-type"), cacheControl: response.headers.get("cache-control") ?? "public, max-age=60" };
}
stop();

const manifest = { builtAt: new Date().toISOString(), routes, images, data };
writeFileSync("static-manifest.js", `// Generated by deploy/cloudflare/static-first.mjs. Do not edit.\nexport default ${JSON.stringify(manifest, null, 1)};\n`);
console.log(`static-first: ${Object.keys(routes).length} routes (${Object.keys(routes).join(" ")}), ${Object.keys(images).length} of ${urls.size} images, ${Object.keys(data).length} data snapshots`);
if (failed.length) console.log(`static-first: not static (served live): ${failed.join("; ")}`);
