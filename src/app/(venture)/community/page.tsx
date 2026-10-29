import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import Hero from "@/components/venture/sections/Hero";
import GuildTicker from "@/components/venture/sections/GuildTicker";
import GuildPrologue from "@/components/venture/sections/GuildPrologue";
import QueenRaidaBanner from "@/components/venture/sections/QueenRaidaBanner";
import WallOfCuriosities from "@/components/venture/sections/WallOfCuriosities";
import Stewardship from "@/components/venture/sections/Stewardship";
import BuilderNetwork from "@/components/venture/sections/BuilderNetwork";
import JoinCTA from "@/components/venture/sections/JoinCTA";
import Capabilities from "@/components/venture/sections/Capabilities";
import Creed from "@/components/venture/sections/Creed";
import {
  communityActivity, communityCreed, communityGuild, communityHero, communityJoin, communityQueenRaida, communityStewardship,
} from "@/lib/narrative/community";
import { clientsCapabilities } from "@/lib/narrative/clients";
import { buildersCommunity } from "@/lib/narrative/shared";
import { foundryPortrait, keeperHorizontal } from "@/lib/data/illustrations";
import { forAudience } from "@/lib/narrative/public";

// The October 23 Join composition (40f3910): guild → Queen Raida → curiosities →
// stewardship → builders → join → services. Tae's tension, path and activity chapters
// (Phase 2) return in the editorial batch. Unconfirmed claims are flagged in
// review builds; keep the route out of search until they are resolved.
export const metadata: Metadata = {
  alternates: { canonical: "/community" },
  title: "Community",
  description:
    "RaidGuild is a community-driven DAO of Web3 builders. Explore how contribution grows inside the guild, who is building, and what members are shipping.",
  robots: { index: false, follow: true },
};

// The Queen Raida artwork renders only if its file is present in the build, so
// a missing file shows the empty frame rather than a broken image.
const raidaArtworkAvailable = existsSync(join(process.cwd(), "public", communityQueenRaida.artwork.src));

export default function CommunityPage() {
  return (
    <>
      <Hero content={forAudience(communityHero)} grouped />
      <GuildTicker />
      <GuildPrologue content={forAudience(communityGuild)} metrics={false} />
      <QueenRaidaBanner content={forAudience(communityQueenRaida)} artworkAvailable={raidaArtworkAvailable} />
      <WallOfCuriosities content={forAudience(communityActivity.collection)} />
      <Stewardship content={forAudience(communityStewardship)} illustration={keeperHorizontal} />
      <BuilderNetwork content={forAudience(buildersCommunity)} />
      <JoinCTA content={forAudience(communityJoin)} />
      <Capabilities content={forAudience(clientsCapabilities)} illustration={foundryPortrait} />
      <Creed content={forAudience(communityCreed)} />
    </>
  );
}
