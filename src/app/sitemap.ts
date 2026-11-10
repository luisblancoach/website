import type { MetadataRoute } from "next";
import { INDEXABLE, PUBLIC_ROUTES, canonicalUrl } from "../lib/seo";

// The public routes on the canonical origin (November 10): "/", Hire the DAO and
// Join the DAO. Empty while the build is not indexable (review hosts), so a
// sitemap never lists pages that carry noindex. /clients only redirects (308),
// /chat is noindex, /witch is an embedded experience.
export default function sitemap(): MetadataRoute.Sitemap {
  if (!INDEXABLE) return [];
  return PUBLIC_ROUTES.map((path) => ({
    url: canonicalUrl(path),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
