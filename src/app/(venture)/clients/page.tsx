import type { Metadata } from "next";
import Hero from "@/components/venture/sections/Hero";
import GuildTicker from "@/components/venture/sections/GuildTicker";
import PreviousWorks from "@/components/venture/sections/PreviousWorks";
import Services from "@/components/venture/sections/Services";
import BuilderNetwork from "@/components/venture/sections/BuilderNetwork";
import Stewardship from "@/components/venture/sections/Stewardship";
import GuildInquiry from "@/components/venture/sections/GuildInquiry";
import Creed from "@/components/venture/sections/Creed";
import { clientsCreed, clientsHero, clientsInquiry, clientsPreviousWorks, clientsServices } from "@/lib/narrative/clients";
import { buildersClients, peopleClients } from "@/lib/narrative/shared";
import { crewHorizontal, foundryHorizontal, foundryPortrait } from "@/lib/data/illustrations";
import { forAudience } from "@/lib/narrative/public";

// The October 23 Hire composition (40f3910): previous works → services →
// builders → people → inquiry, with the October 27 hero, client showcase and
// services. Unconfirmed claims are flagged in review builds and
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
      <Hero content={forAudience(clientsHero)} grouped curtain />
      <GuildTicker />
      <PreviousWorks content={forAudience(clientsPreviousWorks)} rotate />
      <Services content={forAudience(clientsServices)} portrait={foundryPortrait} horizontal={foundryHorizontal} />
      <BuilderNetwork content={forAudience(buildersClients)} illustration={crewHorizontal} masonry />
      <Stewardship content={forAudience(peopleClients)} titles="professional" />
      <GuildInquiry content={forAudience(clientsInquiry)} surface="cyan" />
      <Creed content={forAudience(clientsCreed)} />
    </>
  );
}
