import type { Metadata } from "next";
import Hero from "@/components/venture/sections/Hero";
import GuildTicker from "@/components/venture/sections/GuildTicker";
import GuildPrologue from "@/components/venture/sections/GuildPrologue";
import GuildPeople from "@/components/venture/sections/GuildPeople";
import WallOfCuriosities from "@/components/venture/sections/WallOfCuriosities";
import Creed from "@/components/venture/sections/Creed";
import SectionSlope from "@/components/venture/primitives/SectionSlope";

// Phase 1 scaffold: existing community sections only. Tae's community narrative
// replaces this composition in Phase 2; keep it out of search until then.
export const metadata: Metadata = {
  alternates: { canonical: "/community" },
  title: "Community",
  description:
    "A builder-owned community of creative and technical people sharing knowledge, exploring technology, and building together since 2019.",
  robots: { index: false, follow: true },
};

export default function CommunityPage() {
  return (
    <>
      <Hero />
      <GuildTicker />
      <GuildPrologue />
      <GuildPeople />
      <SectionSlope variant="communityField" />
      <WallOfCuriosities />
      <Creed />
    </>
  );
}
