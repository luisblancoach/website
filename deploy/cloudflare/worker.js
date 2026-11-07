// Deployment wrapper for the review host, around the OpenNext worker. It is
// not part of the app: build.sh copies it next to the generated .open-next/.
//
// - Every response carries `X-Robots-Tag: noindex, nofollow`, so the review
//   host stays out of search indexes (static files get the same header from
//   .open-next/assets/_headers, written by build.sh).
// - Lead submission is not configured on this host: the inquiry, contact and
//   referral endpoints answer 503 before reaching the app, so no form secret
//   is needed and nothing is half-sent.
import handler from "./.open-next/worker.js";

export { DOQueueHandler, DOShardedTagCache, BucketCachePurge } from "./.open-next/worker.js";

const LEAD_ENDPOINTS = new Set(["/api/consultations", "/api/contact", "/api/email-referrals"]);
const ROBOTS = "noindex, nofollow";

const reviewHost = {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    const response = request.method !== "GET" && request.method !== "HEAD" && LEAD_ENDPOINTS.has(path)
      ? Response.json({ success: false, error: "Submissions are disabled on this review deployment." }, { status: 503 })
      : await handler.fetch(request, env, ctx);
    // Responses from fetch() and Response.redirect() have immutable headers.
    const out = new Response(response.body, response);
    out.headers.set("X-Robots-Tag", ROBOTS);
    return out;
  },
};

export default reviewHost;
