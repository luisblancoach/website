const origin = "https://portal.raidguild.org";

type Post = {
  id: number | string; title: string; slug: string; visibility: string;
  _status: string; publishedAt: string;
  meta?: { description?: string; image?: { url?: string; sizes?: { small?: { url?: string } } } };
};

export async function GET() {
  try {
    const now = new Date();
    const url = new URL("/api/posts", origin);
    const params = {
      limit: "5", depth: "1", sort: "-publishedAt",
      "where[visibility][equals]": "public",
      "where[_status][equals]": "published",
      "where[publishedAt][less_than_equal]": now.toISOString(),
      "select[title]": "true", "select[slug]": "true",
      "select[visibility]": "true", "select[_status]": "true",
      "select[publishedAt]": "true", "select[meta]": "true",
    };
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    const response = await fetch(url, { next: { revalidate: 300 }, signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error("Posts unavailable");
    const body = await response.json();
    if (!Array.isArray(body.docs)) throw new Error("Invalid posts");
    const docs = (body.docs as Post[])
      .filter(post => post && post.visibility === "public" && post._status === "published"
        && typeof post.slug === "string" && /^[a-zA-Z0-9_-]+$/.test(post.slug)
        && typeof post.title === "string" && Number.isFinite(Date.parse(post.publishedAt))
        && Date.parse(post.publishedAt) <= now.getTime())
      .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
      .slice(0, 5)
      .map(post => {
        let image: string | null = null;
        const source = post.meta?.image?.sizes?.small?.url || post.meta?.image?.url;
        if (typeof source === "string") {
          try {
            const candidate = new URL(source, origin);
            if (candidate.protocol === "https:" && !candidate.username && !candidate.password) image = candidate.href;
          } catch { /* Use the placeholder for invalid thumbnails. */ }
        }
        return {
          id: `post-${post.slug}`, title: post.title, kind: "post",
          category: "Field note", publishedAt: post.publishedAt,
          description: typeof post.meta?.description === "string" ? post.meta.description : "",
          image, href: `${origin}/posts/${encodeURIComponent(post.slug)}`,
        };
      });
    return Response.json({ docs }, { headers: { "Cache-Control": "public, max-age=60, s-maxage=300" } });
  } catch {
    return Response.json({ error: "Posts temporarily unavailable" }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
}
