// Search and answer-engine settings shared by every public route (November 10,
// SEO / AEO handoff). Server-only: metadata, the sitemap and JSON-LD read it at
// build time.
//
// Canonical origin: RaidGuild's public domain. The redesign is not live there
// yet, so canonical URLs point at the pages they will become; every other host
// (the Vercel review project, Railway, the Cloudflare review Worker) serves the
// same pages with `noindex` and never competes with it.
//
// Indexing is OFF unless the build is the production deployment of the
// canonical domain: either a Vercel production build whose production domain is
// raidguild.org, or any host that sets RAIDGUILD_INDEXING=on at build time.
// Go-live therefore needs no code change, and a review build cannot become
// indexable by accident.
import type { Metadata } from "next";
import { plainText } from "./narrative/inline";

export const SITE_ORIGIN = "https://www.raidguild.org";
export const SITE_NAME = "RaidGuild";
export const X_HANDLE = "@RaidGuild";
const CANONICAL_HOSTS = ["www.raidguild.org", "raidguild.org"];

const env = process.env;
export const INDEXABLE =
  env.RAIDGUILD_INDEXING === "on" ||
  (env.VERCEL_ENV === "production" && CANONICAL_HOSTS.includes(env.VERCEL_PROJECT_PRODUCTION_URL ?? ""));

export const ROBOTS: Metadata["robots"] = INDEXABLE ? { index: true, follow: true } : { index: false, follow: true };

// Share images load from the host that serves the page, so link previews work on
// review hosts too (canonical and og:url still name the canonical origin).
export const ASSET_ORIGIN =
  env.VERCEL_ENV === "production" && env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`
  : env.VERCEL_URL ? `https://${env.VERCEL_URL}`
  : env.RAILWAY_PUBLIC_DOMAIN ? `https://${env.RAILWAY_PUBLIC_DOMAIN}`
  : SITE_ORIGIN;

export const canonicalUrl = (path: string) => (path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`);

// The routes listed in the sitemap once the site is indexable.
export const PUBLIC_ROUTES = ["/", "/agency", "/community"] as const;

// --- Structured data (schema.org JSON-LD) ---
// Only facts already published on the site: the name, the domain, the logo, the
// founding year ("since 2019"), the description the site already uses and the
// official profiles linked from the footer. No ratings, reviews, prices,
// addresses or people.
const ORGANIZATION_ID = `${SITE_ORIGIN}/#organization`;
const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
// Words only: no formatting markers in structured data (lib/narrative/inline.ts).
const plain = (text: string) => plainText(text).replace(/\s+/g, " ").trim();

export const organizationNode = {
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: `${SITE_ORIGIN}/`,
  logo: { "@type": "ImageObject", url: `${SITE_ORIGIN}/images/raidguild-logo.svg` },
  description: "A builder-owned community of creative and technical people sharing knowledge, exploring technology, and building together since 2019.",
  foundingDate: "2019",
  sameAs: ["https://github.com/raid-guild", "https://x.com/RaidGuild"],
};

export const websiteNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: `${SITE_ORIGIN}/`,
  name: SITE_NAME,
  inLanguage: "en",
  publisher: { "@id": ORGANIZATION_ID },
};

export function webPageNode(path: string, name: string, description: string) {
  const url = canonicalUrl(path);
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: plain(name),
    description: plain(description),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
  };
}

// One Service per card of a visible services gallery: its name is the card
// title as shown, its description the card text as shown.
export function serviceNodes(path: string, cards: { title: { lead: { text: string }; em: { text: string } }; body: { text: string } }[]) {
  return cards.map((card, index) => ({
    "@type": "Service",
    "@id": `${canonicalUrl(path)}#service-${index + 1}`,
    name: plain(`${card.title.lead.text} ${card.title.em.text}`),
    description: plain(card.body.text),
    provider: { "@id": ORGANIZATION_ID },
  }));
}

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

// JSON for a <script type="application/ld+json">: "<" is escaped so no text
// can close the script element.
export const jsonLd = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");
