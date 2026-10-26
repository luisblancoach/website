import type { Metadata } from "next";
import Hero from "@/components/venture/sections/Hero";
import GuildTicker from "@/components/venture/sections/GuildTicker";
import ActiveSpears from "@/components/venture/sections/ActiveSpears";
import GuildInquiry from "@/components/venture/sections/GuildInquiry";
import Creed from "@/components/venture/sections/Creed";
import SectionSlope from "@/components/venture/primitives/SectionSlope";

// Phase 1 scaffold: existing practice and inquiry sections only. Tae's client
// narrative replaces this composition in Phase 3; keep it out of search until then.
export const metadata: Metadata = {
  alternates: { canonical: "/clients" },
  title: "Clients",
  description:
    "Explore the people, ideas, and independent specialist practices growing from the RaidGuild community.",
  robots: { index: false, follow: true },
};

export default function ClientsPage() {
  return (
    <>
      <Hero />
      <GuildTicker />
      <ActiveSpears />
      <SectionSlope variant="practiceContact" />
      <GuildInquiry />
      <Creed />
    </>
  );
}
