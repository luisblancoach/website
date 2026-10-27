import { clientData } from "../data/clients";
import { services } from "../data/content";
import { activeSpears } from "../data/venture";
import {
  approved, claim, defineNarrative, oct23, wording,
  type Copy, type CapabilitiesContent, type CreedContent, type HeroContent, type InquiryContent, type NavContent, type PreviousWorksContent,
} from "./types";

// Clients narrative ("Hire the DAO", light by default). Headline and calls to
// action follow Tae's approved direction; layout and supporting copy come from
// the October 23 iteration (40f3910) and stay flagged until approved. Case
// studies and services are drawn from the existing data modules, never authored
// here.

const tae = (text: string) => approved(text, "tae-brief");
const existing = (text: string) => approved(text, "existing-site");

export const clientsHero: HeroContent = defineNarrative("clients.hero", {
  eyebrow: wording("Venture Beyond · Hire the DAO"),
  title: { lead: tae("Turn complex technology"), em: tae("into products people can use"), long: true },
  dek: claim(
    "A decentralized collective of designers and engineers building onchain products, digital experiences and applied AI.",
    "oct23-iteration",
    "October 23 copy (40f3910). Describes what the Guild builds and how it is organised; confirm the scope is current before publishing.",
  ),
  paths: [
    { label: tae("Tell us what you're building"), section: "project-inquiry", variant: "filled", icon: "↓", primary: true },
    { label: tae("Explore our work"), section: "case-studies", variant: "outline", icon: "↓" },
  ],
} satisfies HeroContent);

// Published services (lib/data/content.ts, raidguild.org), in published order.
const serviceNote = "Published service on raidguild.org (lib/data/content.ts). Confirm it is offered today.";
const publishedServices = services.map((record) => ({
  title: claim(record.title, "existing-site", serviceNote),
  body: claim(record.bodyText, "existing-site", serviceNote),
}));
const service = (title: string) => {
  if (!services.some((item) => item.title === title)) throw new Error(`Unknown service: ${title}`);
  return title;
};

const spear = (title: string) => {
  const record = activeSpears.find((item) => item.title === title);
  if (!record) throw new Error(`Unknown practice: ${title}`);
  return {
    tag: existing(record.tag),
    title: existing(record.title),
    image: { src: record.art, alt: existing(record.artAlt) },
    // Existing copy, but statements about governance or ownership stay flagged.
    body: /governance|ownership/i.test(record.copy)
      ? claim(record.copy, "existing-site", "Existing practice copy that mentions governance or shared ownership. Confirm the wording with the practice.")
      : existing(record.copy),
    link: {
      label: existing(record.cta),
      href: record.href,
      ...(record.href.includes("railway.app")
        ? { destination: claim("Practice site on a temporary Railway address", "existing-site", `Links to ${record.href}. Confirm the public address for the onchain practice.`) }
        : {}),
    },
  };
};

export const clientsCapabilities: CapabilitiesContent = defineNarrative("clients.capabilities", {
  label: oct23("[ Services & capabilities ]"),
  title: { lead: oct23("Ideas into"), em: oct23("working systems") },
  intro: existing("The Guild is the center of gravity. These independently led practices are its tips of the spear, turning shared experience into focused offerings with their own teams and direction."),
  services: publishedServices,
  // Placement of each service under a pillar is a proposal until confirmed.
  pillars: [
    { title: tae("Design"), body: wording("Making complex technology understandable and usable."), services: [service("Product & System Design")] },
    { title: tae("Engineering"), body: wording("Building the products and systems behind it."), services: [service("Full-Stack Development"), service("AI Solutions & Automation")] },
    {
      title: tae("Product thinking"),
      body: wording("Deciding what to build, and why.", "New narrative copy; needs editorial approval. Placing DAO Consulting and Marketing under this pillar is unconfirmed."),
      services: [service("DAO Consulting & Governance"), service("Marketing & Content Strategy")],
    },
  ],
  practices: [spear("Applied AI"), spear("Onchain Systems")],
  practicesLabel: oct23("Explore our specialist practices"),
  inquiry: { label: existing("Open a Guild inquiry"), section: "project-inquiry" },
  footnote: { lead: existing("Not sure which practice fits?"), link: { label: existing("Open the Guild inquiry form →"), section: "project-inquiry" } },
} satisfies CapabilitiesContent);

// Previous works: the three October 23 selections, all present in the existing
// archive. Shortened titles and descriptions are October 23 copy; every client
// statement stays a claim until permission and scope are confirmed.
const archive = (id: string, company: string, title: string, description: string) => {
  const record = clientData.find((item) => item.id === id);
  if (!record) throw new Error(`Not in the project archive: ${id}`);
  const note = "From the existing project archive (lib/data/clients.ts) as summarised in the October 23 iteration. Confirm the scope and permission to feature this client.";
  return {
    id,
    logo: record.logo,
    company: claim(company, "existing-site", "Listed as a client project in the existing archive. Confirm permission to feature."),
    title: claim(title, "oct23-iteration", note),
    description: claim(description, "oct23-iteration", note),
    tags: record.tags.map((tag): Copy => existing(tag)),
    images: [],
  };
};

// Recovered from the original case studies (the archived raidguild.org page in
// public/witch, and lib/data/clients.ts): the archive's own factual sentences,
// without its published metrics, which stay out until they are verified.
const recovered = (id: string, company: string, title: string, description: string, omitted?: string) => {
  const record = clientData.find((item) => item.id === id);
  if (!record) throw new Error(`Not in the project archive: ${id}`);
  const note = `Original RaidGuild case study (archived raidguild.org; lib/data/clients.ts), restored in B3.4.${omitted ? ` The archive also states ${omitted}; omitted until verified.` : ""} Confirm the scope and permission to feature this client.`;
  return {
    id,
    logo: record.logo,
    company: claim(company, "existing-site", "Listed as a client project in the original case studies. Confirm permission to feature."),
    title: claim(title, "existing-site", note),
    description: claim(description, "existing-site", note),
    tags: record.tags.map((tag): Copy => existing(tag)),
    images: [],
  };
};

// Supplied by Tae with its Portal article. The article is not publicly
// reachable yet (404, and not among Portal's public posts), so no copy is
// written from it and the work stays out of production.
const LIVEPEER_ARTICLE = "https://portal.raidguild.org/posts/turning-ux-research-into-a-product-roadmap-for-livepeer";
const livepeerNote = "Case study supplied by Tae. Its Portal article returns 404 and is not among the public posts, so its content could not be checked; add the description from the article once it is public.";
const livepeer = {
  id: "livepeer",
  logo: "/images/logo-Livepeer.svg",
  company: claim("Livepeer", "portal", livepeerNote, LIVEPEER_ARTICLE),
  title: claim("Turning UX research into a product roadmap", "portal", livepeerNote, LIVEPEER_ARTICLE),
  tags: [],
  images: [],
  pending: claim("Source article not yet public", "portal", livepeerNote, LIVEPEER_ARTICLE),
};

export const clientsPreviousWorks: PreviousWorksContent = defineNarrative("clients.previousWorks", {
  title: { lead: oct23("Previous"), em: oct23("works.") },
  intro: oct23("A few starting points from the Guild's project archive."),
  works: [
    archive("daohaus", "DAOhaus", "Automated protocol maintenance", "Protocol maintenance, documentation and human-governed AI workflows."),
    archive("brightid", "BrightID", "Social identity systems", "Design and development for social identity and user verification."),
    archive("hypercerts", "Hypercerts", "Tools for public goods funding", "Smart contracts for minting, burning and donating Hypercerts."),
    recovered("pocket", "Pocket Network", "Wrapped token, bridge and staking dApp", "Created the wrapped version of the $POKT token as well as the Uniswap pool, bridge and staking dApp.", "a 10x token price increase and $7M bridged in 2024"),
    recovered("ud", "Ultimate Dominion", "Onchain gameplay and interactions", "Designed and built a fully on-chain RPG, integrating smart contract-powered quest systems, player-driven narratives, and decentralized inventory management to create a trustless game world."),
    recovered("gnosis", "Gnosis", "The Omni-Token Bridge", "Built the Gnosis Omni-Token Bridge to enable secure, user-friendly asset transfers of any ERC-20 between Ethereum and Gnosis Chain.", "over $367M in bridged transfers"),
    livepeer,
  ],
  detailsLabel: oct23("Explore project details"),
  cta: { label: oct23("Bring us your next project"), section: "project-inquiry" },
} satisfies PreviousWorksContent);

export const clientsInquiry: InquiryContent = defineNarrative("clients.inquiry", {
  label: existing("[ Begin a transmission ]"),
  title: { lead: tae("Tell us what"), em: tae("you're building") },
  body: oct23("Share your goals, then we'll explore how the Guild can help."),
  summary: { label: existing("Start a Guild inquiry"), hint: existing("Share a project or question ↓"), hintOpen: existing("Close the inquiry ↑") },
  coordinates: [oct23("Your project starts here"), oct23("Contact · Project · Requirements")],
  image: { alt: existing("Four Guild characters with maps, tools, and a staff") },
} satisfies InquiryContent);

export const clientsNav: NavContent = defineNarrative("clients.nav", {
  items: [
    { label: oct23("Previous works"), section: "case-studies" },
    { label: oct23("Services"), section: "capabilities" },
    { label: oct23("Builders"), section: "team" },
  ],
  cta: { label: tae("Tell us what you're building"), section: "project-inquiry" },
} satisfies NavContent);

export const clientsCreed: CreedContent = defineNarrative("clients.creed", {
  cta: { label: tae("Tell us what you're building"), section: "project-inquiry" },
} satisfies CreedContent);

export const clientsNarrative = { clientsHero, clientsCapabilities, clientsPreviousWorks, clientsInquiry, clientsNav, clientsCreed };
