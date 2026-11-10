import type { Metadata } from "next";
import Hero from "@/components/venture/sections/Hero";
import GuildTicker from "@/components/venture/sections/GuildTicker";
import GuildPrologue from "@/components/venture/sections/GuildPrologue";
import GuildPeople from "@/components/venture/sections/GuildPeople";
import WallOfCuriosities from "@/components/venture/sections/WallOfCuriosities";
import ActiveSpears from "@/components/venture/sections/ActiveSpears";
import GuildInquiry from "@/components/venture/sections/GuildInquiry";
import Creed from "@/components/venture/sections/Creed";
import SectionSlope from "@/components/venture/primitives/SectionSlope";
import { entryGuild, entryHero } from "@/lib/narrative/entry";
import { canonicalUrl, graph, jsonLd, organizationNode, webPageNode, websiteNode, X_HANDLE } from "@/lib/seo";

const TITLE = "RaidGuild — Venture Beyond";
const DESCRIPTION =
  "Meet RaidGuild, a builder-owned community of designers, engineers, researchers, strategists, and operators exploring emerging technology together, from applied AI to onchain systems.";

export const metadata: Metadata = {
  alternates: { canonical: canonicalUrl("/") },
  title: { absolute: TITLE },
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: canonicalUrl("/"),
    siteName: "RaidGuild",
    title: "RaidGuild — Venture Beyond",
    description:
      "Meet the builder-owned RaidGuild community and explore its people, experiments, and independent practices in applied AI and onchain systems.",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1733,
        height: 908,
        alt: "Two RaidGuild travelers overlooking a coral citadel in an alien landscape",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: X_HANDLE,
    title: "RaidGuild — Venture Beyond",
    description:
      "Meet the builder-owned RaidGuild community and explore its people, experiments, and independent practices in applied AI and onchain systems.",
    images: ["/opengraph-image.png"],
  },
};

export const dynamic = "force-dynamic";

// Organization, WebSite and this page (lib/seo.ts); November 10 replaces the
// Organization-only block, whose Discord invite was not an identity profile.
const structuredData = graph(organizationNode, websiteNode, webPageNode("/", TITLE, DESCRIPTION));

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData) }}
      />
      <Hero content={entryHero} />
      <GuildTicker />
      <GuildPrologue content={entryGuild} />
      <GuildPeople />
      <SectionSlope variant="communityField" />
      <WallOfCuriosities />
      <SectionSlope variant="fieldPractice" />
      <ActiveSpears />
      <SectionSlope variant="practiceContact" />
      <GuildInquiry />
      <Creed />
    </>
  );
}
