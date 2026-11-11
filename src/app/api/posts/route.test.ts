import { test } from "node:test";
import assert from "node:assert/strict";
import { GET } from "./route";

test("latest posts are public, published, dated, limited and allowlisted", async () => {
  const original = globalThis.fetch;
  const post = { id: 1, title: "Post", slug: "post", visibility: "public", _status: "published", publishedAt: "2025-01-01", meta: { description: "Summary", image: { url: "/cover.png" } } };
  globalThis.fetch = async input => {
    const url = new URL(String(input));
    assert.equal(url.searchParams.get("limit"), "5");
    assert.equal(url.searchParams.get("where[visibility][equals]"), "public");
    return Response.json({ docs: [
      ...Array.from({ length: 7 }, (_, i) => ({ ...post, slug: `post-${i}`, publishedAt: `2025-01-0${i + 1}`, privateField: "omit" })),
      { ...post, visibility: "member" }, { ...post, _status: "draft" },
      { ...post, publishedAt: "2999-01-01" },
    ] });
  };
  try {
    const result = await (await GET()).json();
    assert.equal(result.docs.length, 5);
    assert.equal(result.docs[0].id, "post-post-6");
    assert.equal(result.docs[0].href, "https://portal.raidguild.org/posts/post-6");
    assert.equal(result.docs[0].image, "https://portal.raidguild.org/cover.png");
    assert.equal("privateField" in result.docs[0], false);
  } finally { globalThis.fetch = original; }
});

test("empty feeds remain empty and errors fail without caching", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => Response.json({ docs: [] });
    assert.deepEqual(await (await GET()).json(), { docs: [] });
    globalThis.fetch = async () => new Response(null, { status: 500 });
    const response = await GET();
    assert.equal(response.status, 503);
    assert.equal(response.headers.get("cache-control"), "no-store");
  } finally { globalThis.fetch = original; }
});

test("unsafe thumbnails are omitted", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => Response.json({ docs: [{ id: 1, title: "Post", slug: "post", visibility: "public", _status: "published", publishedAt: "2025-01-01", meta: { image: { url: "javascript:alert(1)" } } }] });
  try { assert.equal((await (await GET()).json()).docs[0].image, null); }
  finally { globalThis.fetch = original; }
});
