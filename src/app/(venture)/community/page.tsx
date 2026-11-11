import type { Metadata } from "next";
import Hero from "@/components/venture/sections/Hero";
import GuildTicker from "@/components/venture/sections/GuildTicker";
import GuildPrologue from "@/components/venture/sections/GuildPrologue";
import WallOfCuriosities from "@/components/venture/sections/WallOfCuriosities";
import BuilderNetwork from "@/components/venture/sections/BuilderNetwork";
import JoinCTA from "@/components/venture/sections/JoinCTA";
import ImmersiveFeature from "@/components/venture/sections/ImmersiveFeature";
import HatsTree from "@/components/venture/sections/HatsTree";
import FeatureGallery from "@/components/venture/sections/FeatureGallery";
import MemberBenefits from "@/components/venture/sections/MemberBenefits";
import Faq from "@/components/venture/sections/Faq";
import Creed from "@/components/venture/sections/Creed";
import {
  communityActivity, communityBenefits, communityCapabilities, communityCreed, communityFaq, communityGuild, communityHats, communityHero, communityJoin,
  communityMoloch, communityRaidaFeature,
} from "@/lib/narrative/community";
import { buildersCommunity } from "@/lib/narrative/shared";
import { crewHorizontal, foundryPortrait, molochArtwork, queenRaidaArtwork } from "@/lib/data/illustrations";
import { forAudience } from "@/lib/narrative/public";

// Join the DAO architecture (October 29, final pass; November 2, owner order):
// hero → ideas into working systems (capability gallery, builder side) →
// About RaidGuild → Queen Raida → About Moloch → Projects & Experiments →
// builders → Hats Tree → member FAQ → join → member benefits → creed. The hero uses the same curtain
// as /clients. Tae's tension, path and activity chapters
// (Phase 2) return in the editorial batch. Unconfirmed claims are flagged in
// review builds; keep the route out of search until they are resolved.
// Metadata (October 30): community copy (builder-owned, members, experiments,
// finding people to build with), drafted for review. A page's openGraph
// replaces the root's, so site name, type and URL are restated. Share image:
// the owner-supplied November 2026 Join the DAO card.
const SHARE_TITLE = "Join the DAO: find your people at RaidGuild";
const DESCRIPTION =
  "RaidGuild is a builder-owned community. Meet Guild members, explore their experiments, and find people to build and contribute with.";
const SHARE_IMAGE = { url: "/images/venture/og/join-dao-2026.png", width: 1731, height: 909, type: "image/png", alt: "Join the DAO: RaidGuild builders looking toward a shared future" };
export const metadata: Metadata = {
  alternates: { canonical: "/community" },
  title: "Join the DAO",
  description: DESCRIPTION,
  openGraph: { siteName: "RaidGuild", type: "website", url: "/community", title: SHARE_TITLE, description: DESCRIPTION, images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", title: SHARE_TITLE, description: DESCRIPTION, images: [SHARE_IMAGE.url] },
  robots: { index: false, follow: true },
};

// November 3: /community has its own capability gallery (the same six
// capabilities, framed for builders, with community links and no inquiry) and
// a separate, compact member-benefits module; /clients keeps the client view.

// November 3 (owner): the Guild module now precedes the capabilities gallery, and the Hats tree and Explore
// (Wall of curiosities) traded places. Later the same night: Membership (benefits) follows Stewardship (Hats),
// and the FAQ ("Before you join") follows Join the Guild: … Moloch → Hats → benefits → builders → Explore →
// Join → FAQ → creed.
export default function CommunityPage() {
  return (
    <>
      <Hero content={forAudience(communityHero)} grouped curtain still />
      <GuildTicker />
      <GuildPrologue content={forAudience(communityGuild)} metrics={false} kitExpander />
      <FeatureGallery id="spears" anchors={["services", "capabilities"]} content={forAudience(communityCapabilities)} tone="services" />
      <ImmersiveFeature id="raida" content={forAudience(communityRaidaFeature)} artwork={queenRaidaArtwork} tone="raida" />
      <ImmersiveFeature id="moloch" content={forAudience(communityMoloch)} artwork={molochArtwork} tone="moloch" />
      <HatsTree content={forAudience(communityHats)} />
      <MemberBenefits id="benefits" content={forAudience(communityBenefits)} />
      <BuilderNetwork content={forAudience(buildersCommunity)} illustration={crewHorizontal} masonry />
      <WallOfCuriosities content={forAudience(communityActivity.collection)} />
      <JoinCTA content={forAudience(communityJoin)} />
      <Faq id="faq" content={forAudience(communityFaq)} illustration={foundryPortrait} />
      <Creed content={forAudience(communityCreed)} />
    </>
  );
}
