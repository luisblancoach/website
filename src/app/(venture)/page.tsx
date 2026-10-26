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

const publicAssetOrigin = process.env.RAILWAY_PUBLIC_DOMAIN
  ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
  : "https://www.raidguild.org";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  title: { absolute: "RaidGuild — Venture Beyond" },
  description:
    "Meet RaidGuild, a builder-owned community of designers, engineers, researchers, strategists, and operators exploring emerging technology together, from applied AI to onchain systems.",
  openGraph: {
    type: "website",
    url: "https://www.raidguild.org",
    siteName: "RaidGuild",
    title: "RaidGuild — Venture Beyond",
    description:
      "Meet the builder-owned RaidGuild community and explore its people, experiments, and independent practices in applied AI and onchain systems.",
    images: [
      {
        url: `${publicAssetOrigin}/opengraph-image.png`,
        width: 1733,
        height: 908,
        alt: "Two RaidGuild travelers overlooking a coral citadel in an alien landscape",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RaidGuild — Venture Beyond",
    description:
      "Meet the builder-owned RaidGuild community and explore its people, experiments, and independent practices in applied AI and onchain systems.",
    images: [`${publicAssetOrigin}/opengraph-image.png`],
  },
};

export const dynamic = "force-dynamic";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "RaidGuild",
  url: "https://www.raidguild.org",
  logo: "https://www.raidguild.org/images/raidguild-logo.svg",
  description:
    "A builder-owned community of creative and technical people sharing knowledge, exploring technology, and building together since 2019.",
  foundingDate: "2019",
  sameAs: [
    "https://github.com/raid-guild",
    "https://x.com/RaidGuild",
    "https://discord.gg/2vx47gT95y",
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <Hero />
      <GuildTicker />
      <GuildPrologue />
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
