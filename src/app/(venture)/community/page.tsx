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
import { foundryHorizontal, foundryPortrait, molochArtwork, queenRaidaArtwork } from "@/lib/data/illustrations";
import { forAudience } from "@/lib/narrative/public";

// Join the DAO architecture (October 29, final pass): hero → About RaidGuild →
// Queen Raida → About Moloch → Projects & Experiments → builders → Hats Tree →
// join → ideas into working systems → creed. The hero uses the same curtain
// as /clients. Tae's tension, path and activity chapters
// (Phase 2) return in the editorial batch. Unconfirmed claims are flagged in
// review builds; keep the route out of search until they are resolved.
export const metadata: Metadata = {
  alternates: { canonical: "/community" },
  title: "Community",
  description:
    "RaidGuild is a community-driven DAO of Web3 builders. Explore how contribution grows inside the guild, who is building, and what members are shipping.",
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
      <BuilderNetwork content={forAudience(buildersCommunity)} masonry />
      <HatsTree content={forAudience(communityHats)} />
      <JoinCTA content={forAudience(communityJoin)} />
      <Services content={ideas} portrait={foundryPortrait} horizontal={foundryHorizontal} practices={{ label: capabilities.practicesLabel, items: capabilities.practices }} />
      <Creed content={forAudience(communityCreed)} />
    </>
  );
}
