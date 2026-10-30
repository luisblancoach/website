import type { Metadata } from "next";
import Hero from "@/components/venture/sections/Hero";
import GuildTicker from "@/components/venture/sections/GuildTicker";
import GuildPrologue from "@/components/venture/sections/GuildPrologue";
import WallOfCuriosities from "@/components/venture/sections/WallOfCuriosities";
import BuilderNetwork from "@/components/venture/sections/BuilderNetwork";
import JoinCTA from "@/components/venture/sections/JoinCTA";
import ImmersiveFeature from "@/components/venture/sections/ImmersiveFeature";
import HatsTree from "@/components/venture/sections/HatsTree";
import Services from "@/components/venture/sections/Services";
import Creed from "@/components/venture/sections/Creed";
import {
  communityActivity, communityCreed, communityGuild, communityHats, communityHero, communityJoin, communityMoloch, communityRaidaFeature,
} from "@/lib/narrative/community";
import { clientsCapabilities } from "@/lib/narrative/clients";
import { buildersCommunity } from "@/lib/narrative/shared";
import type { ServicesContent } from "@/lib/narrative/types";
import { crewHorizontal, foundryHorizontal, foundryPortrait, molochArtwork, queenRaidaArtwork } from "@/lib/data/illustrations";
import { forAudience } from "@/lib/narrative/public";

// Join the DAO architecture (October 29, final pass): hero → About RaidGuild →
// Queen Raida → About Moloch → Projects & Experiments → builders → Hats Tree →
// join → ideas into working systems → creed. The hero uses the same curtain
// as /clients. Tae's tension, path and activity chapters
// (Phase 2) return in the editorial batch. Unconfirmed claims are flagged in
// review builds; keep the route out of search until they are resolved.
// Metadata (October 30): community copy (builder-owned, members, experiments,
// finding people to build with), drafted for review. A page's openGraph
// replaces the root's, so site name, type and URL are restated. Share image:
// a 1200 × 630 WebP cut of the Moloch rectangle artwork (111 KB; the 5.7 MB
// original is untouched).
const SHARE_TITLE = "Join the DAO: find your people at RaidGuild";
const DESCRIPTION =
  "RaidGuild is a builder-owned community. Meet Guild members, explore their experiments, and find people to build and contribute with.";
const SHARE_IMAGE = { url: "/images/venture/og/community-moloch.webp", width: 1200, height: 630, type: "image/webp", alt: "Guild builders facing Moloch, a horned colossus, in a coral city" };
export const metadata: Metadata = {
  alternates: { canonical: "/community" },
  title: "Join the DAO",
  description: DESCRIPTION,
  openGraph: { siteName: "RaidGuild", type: "website", url: "/community", title: SHARE_TITLE, description: DESCRIPTION, images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", title: SHARE_TITLE, description: DESCRIPTION, images: [SHARE_IMAGE.url] },
  robots: { index: false, follow: true },
};

// "Ideas into working systems" in the shared Services module: the October 23
// capabilities copy, with its inquiry as the module's call to action.
const capabilities = forAudience(clientsCapabilities);
const ideas: ServicesContent = {
  label: capabilities.label,
  title: capabilities.title,
  intro: [capabilities.intro],
  services: capabilities.services,
  cta: capabilities.inquiry,
  footnote: capabilities.footnote,
};

export default function CommunityPage() {
  return (
    <>
      <Hero content={forAudience(communityHero)} grouped curtain still />
      <GuildTicker />
      <GuildPrologue content={forAudience(communityGuild)} metrics={false} kitExpander />
      <ImmersiveFeature id="raida" content={forAudience(communityRaidaFeature)} artwork={queenRaidaArtwork} tone="raida" />
      <ImmersiveFeature id="moloch" content={forAudience(communityMoloch)} artwork={molochArtwork} tone="moloch" />
      <WallOfCuriosities content={forAudience(communityActivity.collection)} />
      <BuilderNetwork content={forAudience(buildersCommunity)} illustration={crewHorizontal} masonry />
      <HatsTree content={forAudience(communityHats)} />
      <JoinCTA content={forAudience(communityJoin)} />
      <Services content={ideas} portrait={foundryPortrait} horizontal={foundryHorizontal} practices={{ label: capabilities.practicesLabel, items: capabilities.practices }} />
      <Creed content={forAudience(communityCreed)} />
    </>
  );
}
