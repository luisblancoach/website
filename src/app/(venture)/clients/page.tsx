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
// SEO copy (October 30, owner): the page title stands alone (no "| RaidGuild"
// template); Open Graph and Twitter carry the Hire title and the same
// description. A page's openGraph replaces the root's, so the site name, type
// and this route's URL are restated. Share image (October 30): a 1200 × 630
// WebP cut of the Queen Raida rectangle artwork (public/images/venture/og/,
// 150 KB; the 6 MB original is untouched).
const SEO_TITLE = "RaidGuild | Smart Contracts, dApp & AI Development Studio";
const SHARE_TITLE = "Hire RaidGuild: senior teams for hard onchain and AI builds";
const SEO_DESCRIPTION =
  "Small senior teams for smart contracts, dApps, product design and applied AI. We've shipped work for Livepeer, Pokt Network, DAOHaus, Gitcoin and more. Start your project brief.";
const SHARE_IMAGE = { url: "/images/venture/og/clients-queen-raida.webp", width: 1200, height: 630, type: "image/webp", alt: "Queen Raida, RaidGuild's AI agent, rising from the clouds above a group of Guild builders" };
export const metadata: Metadata = {
  alternates: { canonical: "/clients" },
  title: { absolute: SEO_TITLE },
  description: SEO_DESCRIPTION,
  openGraph: { siteName: "RaidGuild", type: "website", url: "/clients", title: SHARE_TITLE, description: SEO_DESCRIPTION, images: [SHARE_IMAGE] },
  twitter: { card: "summary_large_image", title: SHARE_TITLE, description: SEO_DESCRIPTION, images: [SHARE_IMAGE.url] },
  robots: { index: false, follow: true },
};

export default function ClientsPage() {
  return (
    <>
      <Hero content={forAudience(clientsHero)} grouped curtain still />
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
