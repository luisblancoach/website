import type { Metadata } from "next";
import Hero from "@/components/venture/sections/Hero";
import GuildTicker from "@/components/venture/sections/GuildTicker";
import Tension from "@/components/venture/sections/Tension";
import PathSteps from "@/components/venture/sections/PathSteps";
import GuildPrologue from "@/components/venture/sections/GuildPrologue";
import CommunityActivity from "@/components/venture/sections/CommunityActivity";
import GuildPeople from "@/components/venture/sections/GuildPeople";
import JoinCTA from "@/components/venture/sections/JoinCTA";
import Creed from "@/components/venture/sections/Creed";
import SectionSlope from "@/components/venture/primitives/SectionSlope";
import {
  communityActivity, communityGuild, communityHero, communityJoin, communityPath, communityTension,
} from "@/lib/narrative/community";

// Tae's community narrative: hero → tension → path → membership → activity →
// people → join. Unconfirmed claims are flagged in development and preview;
// keep the route out of search until they are resolved.
export const metadata: Metadata = {
  alternates: { canonical: "/community" },
  title: "Community",
  description:
    "RaidGuild is a community-driven DAO of Web3 builders. Explore how contribution grows inside the guild, who is building, and what members are shipping.",
  robots: { index: false, follow: true },
};

export default function CommunityPage() {
  return (
    <>
      <Hero content={communityHero} />
      <GuildTicker />
      <Tension content={communityTension} />
      <SectionSlope variant="paperDeep" />
      <PathSteps id="path" content={communityPath} />
      <SectionSlope variant="practiceContact" />
      <GuildPrologue content={communityGuild} />
      <SectionSlope variant="communityField" />
      <CommunityActivity content={communityActivity} />
      <SectionSlope variant="skyPaper" />
      <GuildPeople />
      <SectionSlope variant="paperDeep" />
      <JoinCTA content={communityJoin} />
      <Creed />
    </>
  );
}
