import type { Metadata } from "next";
import Hero from "@/components/venture/sections/Hero";
import GuildTicker from "@/components/venture/sections/GuildTicker";
import PreviousWorks from "@/components/venture/sections/PreviousWorks";
import FeatureGallery from "@/components/venture/sections/FeatureGallery";
import Faq from "@/components/venture/sections/Faq";
import ClientReasons from "@/components/venture/sections/ClientReasons";
import BuilderNetwork from "@/components/venture/sections/BuilderNetwork";
import Stewardship from "@/components/venture/sections/Stewardship";
import GuildInquiry from "@/components/venture/sections/GuildInquiry";
import Creed from "@/components/venture/sections/Creed";
import { clientsCreed, clientsFaq, clientsHero, clientsInquiry, clientsMeta, clientsPreviousWorks, clientsReasons, clientsServiceGallery } from "@/lib/narrative/clients";
import { buildersClients, peopleClients } from "@/lib/narrative/shared";
import { crewHorizontal, foundryPortrait } from "@/lib/data/illustrations";
import { forAudience } from "@/lib/narrative/public";
import { canonicalUrl, graph, jsonLd, organizationNode, serviceNodes, webPageNode, websiteNode, X_HANDLE } from "@/lib/seo";

// The October 23 Hire composition (40f3910), reordered November 2: hero →
// services gallery (replaces the services accordion) → previous works →
// builders → people → buyer FAQ → inquiry (November 3: "Why RaidGuild"
// reasons follow the services gallery), with the October 27 hero and client
// showcase. Unconfirmed claims are flagged in review builds and
// preview; keep the route out of search until they are resolved.
// SEO copy (October 30, owner): the page title stands alone (no "| RaidGuild"
// template); Open Graph and Twitter carry the Hire title and the same
// description. A page's openGraph replaces the root's, so the site name, type
// and this route's URL are restated. Share image (October 30): a 1200 × 630
// WebP cut of the Queen Raida rectangle artwork (public/images/venture/og/,
// 150 KB; the 6 MB original is untouched).
// Copy (November 9): the strings are narrative copy (clientsMeta), with stable ids for Editorial Mode.
// November 10 (owner, canonical routes): this is the root page "/". Hire the DAO was /agency (and
// /clients before); both redirect here permanently (next.config.ts). The former "/" entry page is retired.
const SEO_TITLE = clientsMeta.title.text;
const SHARE_TITLE = clientsMeta.shareTitle.text;
const SEO_DESCRIPTION = clientsMeta.description.text;
const SHARE_IMAGE = { url: "/images/venture/og/clients-queen-raida.webp", width: 1200, height: 630, type: "image/webp", alt: clientsMeta.shareImageAlt.text };
export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("/") },
  title: { absolute: SEO_TITLE },
  description: SEO_DESCRIPTION,
  openGraph: { siteName: "RaidGuild", type: "website", url: canonicalUrl("/"), title: SHARE_TITLE, description: SEO_DESCRIPTION, images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", site: X_HANDLE, title: SHARE_TITLE, description: SEO_DESCRIPTION, images: [SHARE_IMAGE.url] },
  // Indexing follows the root layout (lib/seo.ts): noindex until go-live.
};

// Organization, WebSite, this page and the six services exactly as the services
// gallery shows them (lib/seo.ts; November 10).
const structuredData = graph(organizationNode, websiteNode, webPageNode("/", SEO_TITLE, SEO_DESCRIPTION), ...serviceNodes("/", forAudience(clientsServiceGallery).cards));

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }} />
      <Hero content={forAudience(clientsHero)} grouped curtain still />
      <GuildTicker />
      <FeatureGallery id="spears" anchors={["services", "capabilities"]} content={forAudience(clientsServiceGallery)} tone="services" />
      <ClientReasons id="why-raidguild" content={forAudience(clientsReasons)} />
      <PreviousWorks content={forAudience(clientsPreviousWorks)} rotate />
      <BuilderNetwork content={forAudience(buildersClients)} illustration={crewHorizontal} masonry />
      <Stewardship content={forAudience(peopleClients)} titles="professional" />
      <Faq id="faq" content={forAudience(clientsFaq)} illustration={foundryPortrait} />
      <GuildInquiry content={forAudience(clientsInquiry)} surface="cyan" />
      <Creed content={forAudience(clientsCreed)} />
    </>
  );
}
