// Deployment wrapper for the review host, around the OpenNext worker. It is
// not part of the app: build.sh copies it next to the generated .open-next/.
//
// - Static first: GET and HEAD requests for prerendered routes, their RSC
//   payloads (client navigation and prefetch), the optimised images those pages
//   use and the data snapshots are answered from the static assets prepared by
//   static-first.mjs (static-manifest.js), without loading Next.js. Workers
//   Free allows 10 ms of CPU per request; a Next.js render takes 30–500 ms.
//   Everything else (redirects such as /clients → /agency, other routes, image
//   sizes not in the pages) goes to Next.js as before. Fast-path responses
//   carry `X-Static-First: hit`. /_vercel/* (Vercel Analytics, absent on
//   Cloudflare) answers 404, as Next.js did.
// - Every response carries `X-Robots-Tag: noindex, nofollow`, so the review
//   host stays out of search indexes (static files get the same header from
//   .open-next/assets/_headers, written by build.sh).
// - Lead submission is not configured on this host: the inquiry, contact and
//   referral endpoints answer 503 before reaching the app, so no form secret
//   is needed and nothing is half-sent.
import handler from "./.open-next/worker.js";
import manifest from "./static-manifest.js";

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";

const LEAD_ENDPOINTS = new Set(["/api/consultations", "/api/contact", "/api/email-referrals"]);
const ROBOTS = "noindex, nofollow";
// What `next start` sends for a prerendered page (Next.js 15.5).
const PAGE_VARY = "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding";

async function fromAssets(env, request, path, status, headers) {
  const asset = await env.ASSETS.fetch(new URL(path, request.url));
  if (!asset.ok) return null;
  headers.set("X-Static-First", "hit");
  return new Response(request.method === "HEAD" ? null : asset.body, { status, headers });
}

function staticResponse(request, env, url) {
  // Vercel Analytics (the app's <VercelAnalytics />) does not exist on Cloudflare: Next.js answered its
  // script with a 404 page at full render cost; the same 404, without Next.js.
  if (url.pathname.startsWith("/_vercel/")) return new Response(null, { status: 404, headers: { "X-Static-First": "hit", "Cache-Control": "public, max-age=3600" } });
  const route = manifest.routes[url.pathname];
  if (route?.kind === "page") {
    const rsc = request.headers.get("rsc") === "1";
    const headers = new Headers(route.headers);
    headers.set("Content-Type", rsc ? "text/x-component" : "text/html; charset=utf-8");
    headers.set("Cache-Control", "s-maxage=31536000");
    headers.set("Vary", PAGE_VARY);
    headers.set("x-nextjs-cache", "HIT");
    return fromAssets(env, request, rsc ? route.rsc : route.html, route.status, headers);
  }
  if (route?.kind === "route") return fromAssets(env, request, route.body, route.status, new Headers(route.headers));
  if (url.pathname === "/_next/image") {
    const key = `${url.searchParams.get("url")}|${url.searchParams.get("w")}|${url.searchParams.get("q")}`;
    const image = manifest.images[key];
    // The stored variant is WebP: only for browsers that accept it.
    if (!image || (image.type === "image/webp" && !(request.headers.get("accept") ?? "").includes("image/webp"))) return null;
    const headers = new Headers({ "Content-Type": image.type, "Cache-Control": "public, max-age=60, must-revalidate", Vary: "Accept", "Content-Security-Policy": "script-src 'none'; frame-src 'none'; sandbox;" });
    if (image.disposition) headers.set("Content-Disposition", image.disposition);
    return fromAssets(env, request, image.asset, 200, headers);
  }
  const data = manifest.data[url.pathname];
  if (data) return fromAssets(env, request, data.asset, 200, new Headers({ "Content-Type": data.type, "Cache-Control": data.cacheControl, "X-Snapshot-At": manifest.builtAt }));
  return null;
}

const reviewHost = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname } = url;
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    let response = null;
    if (request.method !== "GET" && request.method !== "HEAD" && LEAD_ENDPOINTS.has(path)) {
      response = Response.json({ success: false, error: "Submissions are disabled on this review deployment." }, { status: 503 });
    } else if (request.method === "GET" || request.method === "HEAD") {
      response = await staticResponse(request, env, url);
    }
    if (!response) response = await handler.fetch(request, env, ctx);
    // Responses from fetch() and Response.redirect() have immutable headers.
    const out = new Response(response.body, response);
    out.headers.set("X-Robots-Tag", ROBOTS);
    return out;
  },
};

export default reviewHost;
