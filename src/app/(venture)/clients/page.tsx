import type { Metadata } from "next";
import Hero from "@/components/venture/sections/Hero";
import GuildTicker from "@/components/venture/sections/GuildTicker";
import PreviousWorks from "@/components/venture/sections/PreviousWorks";
import Capabilities from "@/components/venture/sections/Capabilities";
import BuilderNetwork from "@/components/venture/sections/BuilderNetwork";
import Stewardship from "@/components/venture/sections/Stewardship";
import GuildInquiry from "@/components/venture/sections/GuildInquiry";
import Creed from "@/components/venture/sections/Creed";
import { clientsCapabilities, clientsCreed, clientsHero, clientsInquiry, clientsPreviousWorks } from "@/lib/narrative/clients";
import { buildersClients, peopleClients } from "@/lib/narrative/shared";
import { crewHorizontal, foundryPortrait } from "@/lib/data/illustrations";

// The October 23 Hire composition (40f3910): previous works → services →
// builders → people → inquiry. Unconfirmed claims are flagged in development and
// preview; keep the route out of search until they are resolved.
export const metadata: Metadata = {
  alternates: { canonical: "/clients" },
  title: "Clients",
  description:
    "Hire RaidGuild, a decentralized collective of designers and engineers. Explore previous work, services, and the builders behind them.",
  robots: { index: false, follow: true },
};

export default function ClientsPage() {
  return (
    <>
      <Hero content={clientsHero} grouped />
      <GuildTicker />
      <PreviousWorks content={clientsPreviousWorks} />
      <Capabilities content={clientsCapabilities} illustration={foundryPortrait} />
      <BuilderNetwork content={buildersClients} illustration={crewHorizontal} />
      <Stewardship content={peopleClients} titles="professional" />
      <GuildInquiry content={clientsInquiry} />
      <Creed content={clientsCreed} />
    </>
  );
}
