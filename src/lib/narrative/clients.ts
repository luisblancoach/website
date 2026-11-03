import { caseStudyProjects } from "../data/caseStudies";
import { services } from "../data/content";
import { activeSpears } from "../data/venture";
import {
  approved, claim, defineNarrative, oct23, wording,
  type CapabilitiesContent, type CreedContent, type FaqContent, type FeatureGalleryContent, type GalleryCard, type HeroContent,
  type InquiryContent, type NavContent, type PreviousWorksContent, type ServicesContent, type ShowcaseWork,
} from "./types";

// Clients narrative ("Hire the DAO", light by default). Headline and calls to
// action follow Tae's approved direction; layout and supporting copy come from
// the October 23 iteration (40f3910) and stay flagged until approved. Case
// studies and services are drawn from the existing data modules, never authored
// here.

const tae = (text: string) => approved(text, "tae-brief");
const existing = (text: string) => approved(text, "existing-site");
// October 27 Hire the DAO designs, confirmed by the project owner.
const design = (text: string) => approved(text, "oct27-design");

export const clientsHero: HeroContent = defineNarrative("clients.hero", {
  // No eyebrow (November 2, hero experiment): "Venture Beyond · Hire the DAO" and its dot were removed.
  title: { lead: design("Hard problems,"), em: design("working products"), long: true, plain: true },
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
// A function, so each section gets its own copy items (and ids).
const publishedServices = () => services.map((record) => ({
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
  services: publishedServices(),
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

// Previous works: the nine projects supplied for the October 27 showcase
// (lib/data/caseStudies.ts). Each description is Tae's supplied copy (Livepeer
// and Pocket Network on October 27, the others on October 28). It replaces the
// October 23 archive summaries and their titles; no project carries a title
// line, and nothing is added to Tae's wording.
const work = (id: string, details: Pick<ShowcaseWork, "title" | "description"> = {}): ShowcaseWork => {
  const project = caseStudyProjects.find((item) => item.id === id);
  if (!project) throw new Error(`Not a showcase project: ${id}`);
  return {
    id,
    name: approved(project.name, "owner-approval"),
    button: project.button,
    snapshot: { src: project.snapshot, alt: wording(`${project.name} website homepage`, "Describes the supplied website screenshot.") },
    ...details,
    link: { label: design("Read more"), href: project.href },
  };
};
const showcaseDetails: Record<string, Pick<ShowcaseWork, "title" | "description">> = {
  daohaus: { description: tae("DAOhaus provides tools for launching DAOs, voting on proposals, and managing shared treasuries. RaidGuild modernized its admin app, simplified its codebase and dependencies, and delivered maintenance documentation, operational runbooks, and AI-assisted development workflows with human review.") },
  daedalus: { description: tae("Daedalus builds custom software and practical AI systems for businesses. RaidGuild delivered a client quote generator and integrated Coinbase embedded wallets, supporting both its business operations and wallet-enabled product development.") },
  brightid: { description: tae("BrightID helps applications verify that users are unique people while protecting their privacy. RaidGuild built Aura’s MetaNode graph explorer, including tools for labeling identities and assessing reputation, giving community verifiers more context for identifying trustworthy participants.") },
  livepeer: { description: tae("Livepeer provides decentralized infrastructure for video and AI processing. RaidGuild helped maintain its Explorer and analyzed the staking and delegation experience to identify usability gaps and guide interface improvements.") },
  hypercerts: { description: tae("Hypercerts creates onchain records of impactful work, helping funders understand and support contributions. RaidGuild contributed application and smart contract development to the infrastructure behind those records.") },
  pocket: { description: tae("Pocket Network connects applications to blockchain data through a decentralized network. RaidGuild built wrapped POKT infrastructure and gateway setup tools, including a CLI for wallet creation, staking, and delegation, alongside development of the Gateway OS frontend.") },
  problem: { description: tae("RaidGuild contributed development and UX work to Problem Media’s Good Game platform, helping bring the application toward delivery.") },
  gitcoin: { description: tae("Funding public goods through open-source tools and community coordination. RaidGuild contributed Passport–Snapshot validation work, Moloch-themed creative projects, and development support via our Skunk Squad.") },
  yieldnest: { description: tae("YieldNest develops liquid restaking products that put staked assets to work across DeFi. RaidGuild contributed smart contract engineering, including refactoring deployment scripts to support new baskets of assets and helping its developers take over the resulting tools.") },
};

export const clientsPreviousWorks: PreviousWorksContent = defineNarrative("clients.previousWorks", {
  title: { lead: design("What we've built for"), em: design("our clients") },
  works: caseStudyProjects.map((project) => work(project.id, showcaseDetails[project.id])),
  selectLabel: "Select a project",
  cta: { label: design("Discuss your project"), section: "project-inquiry" },
} satisfies PreviousWorksContent);

// October 27 services: the published services beside the foundry illustration.
export const clientsServices: ServicesContent = defineNarrative("clients.services", {
  label: design("[ Services & capabilities ]"),
  title: { lead: design("What are you"), em: design("trying to ship?") },
  intro: [
    design("The Guild is the center of gravity. We operate tightly scoped raids with small senior teams."),
    // The designs read "Owners - not vendors, to turn …"; this corrected
    // sentence (option A) was approved by the project owner on October 28, 2026.
    approved("Owners, not vendors: we turn shared experience into focused offerings with end dates of their own.", "owner-approval"),
  ],
  services: publishedServices(),
  cta: { label: design("Discuss your project"), section: "project-inquiry" },
  footnote: { lead: existing("Not sure which practice fits?"), link: { label: existing("Open the Guild inquiry form →"), section: "project-inquiry" } },
} satisfies ServicesContent);

// Services gallery (November 2): the services accordion becomes a row of
// cards right after the hero. Bodies are the published service copy (and the
// Onchain practice's copy for the smart-contract card), unchanged and still
// flagged; each title is the published service name split into two lines, the
// "Smart contracts and onchain systems" and "Applied AI" names follow the brief.
// Category labels are new wording. Art: existing site illustrations, none
// repeated on this page.
const cardNote = "Card title from the published service name, set on two lines (November 2 gallery). Confirm.";
const serviceCard = (title: string, lead: string, em: string, label: string, image: GalleryCard["image"], link?: GalleryCard["link"]): GalleryCard => {
  const record = services.find((item) => item.title === title);
  if (!record) throw new Error(`Unknown service: ${title}`);
  return { label: wording(label), title: { lead: claim(lead, "existing-site", cardNote), em: claim(em, "existing-site", cardNote) }, body: claim(record.bodyText, "existing-site", serviceNote), image, ...(link ? { link } : {}) };
};
const onchain = activeSpears.find((item) => item.title === "Onchain Systems")!;
const appliedAi = activeSpears.find((item) => item.title === "Applied AI")!;
export const clientsServiceGallery: FeatureGalleryContent = defineNarrative("clients.serviceGallery", {
  label: design("[ Services & capabilities ]"),
  title: { lead: wording("What we can", "Framing from the November 2 brief (“What we can build for you”). Confirm as the heading."), em: wording("build for you", "Framing from the November 2 brief. Confirm as the heading.") },
  intro: design("The Guild is the center of gravity. We operate tightly scoped raids with small senior teams."),
  cards: [
    serviceCard("Full-Stack Development", "Full-stack", "development", "Engineering", { src: "/images/neo/project-ship-schematic-v1.webp", width: 2160, height: 912 }),
    {
      label: wording("Onchain"),
      title: { lead: wording("Smart contracts,", "Service name from the November 2 brief (“Smart contracts and onchain systems”), on two lines. Confirm."), em: wording("onchain systems", "Service name from the November 2 brief. Confirm.") },
      body: claim(onchain.copy, "existing-site", "The Onchain Systems practice copy (lib/data/venture.ts); it mentions governance and shared ownership. Confirm the wording with the practice."),
      image: { src: onchain.art, width: 1024, height: 768, fit: "contain" },
      link: { label: existing(onchain.cta), href: onchain.href, destination: claim("Railway production URL", "existing-site", "The practice link points to a railway.app deployment. Confirm the public URL.") },
    },
    serviceCard("AI Solutions & Automation", "Applied AI", "and automation", "Applied AI", { src: appliedAi.art, width: 1024, height: 768, fit: "contain" }, { label: existing(appliedAi.cta), href: appliedAi.href }),
    serviceCard("Product & System Design", "Product and", "system design", "Design", { src: "/images/neo/guild-builders-v1.png", width: 768, height: 1024, fit: "contain" }),
    serviceCard("Marketing & Content Strategy", "Marketing and", "content strategy", "Growth", { src: "/images/neo/field-signal-commons.png", width: 1122, height: 1402 }),
    serviceCard("DAO Consulting & Governance", "DAO consulting", "and governance", "Coordination", { src: "/images/neo/field-autonomous-treasury.png", width: 1003, height: 1568 }),
  ],
  cta: { label: design("Discuss your project"), section: "project-inquiry" },
} satisfies FeatureGalleryContent);

// Buyer FAQ (November 2), right before the inquiry. Questions and answers are
// the brief's; bracketed values are placeholders awaiting the owner and render
// as marked placeholders (Faq.tsx). Every answer stays flagged until confirmed.
const faqNote = "Buyer FAQ answer from the November 2 brief. Confirm the facts; bracketed values are placeholders.";
const faq = (question: string, answer: string) => ({ question: wording(question, "Buyer FAQ question from the November 2 brief."), answer: claim(answer, "draft", faqNote) });
export const clientsFaq: FaqContent = defineNarrative("clients.faq", {
  label: wording("[ Before you start ]"),
  title: { lead: wording("Questions"), em: wording("before a raid") },
  items: [
    faq("What does it cost?", "Most raids run [$X–$Y]. Fixed scope, fixed price, quoted after a scoping call."),
    faq("How long does it take?", "Typical raids run [X–Y weeks]. Smaller fixes can start within [X days]."),
    faq("Who is accountable in a DAO?", "One project lead is your point of contact from kickoff to handoff. You get one contract and one invoice."),
    faq("What is the process?", "Brief, then scoping call, then proposal, then raid with weekly demos, then handoff with docs and runbooks."),
    faq("How do payment and contracts work?", "We invoice in [fiat / USDC / both] under [entity / agreement]."),
    faq("What happens after launch?", "We document everything and hand it off, or stay on for maintenance."),
  ],
} satisfies FaqContent);

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
    // "Previous works" shortened to "Works" at the owner's request (November 3).
    { label: approved("Works", "owner-approval"), section: "case-studies" },
    { label: oct23("Services"), section: "capabilities" },
    { label: oct23("Builders"), section: "team" },
  ],
  // The owner shortened the navigation call to action on October 28; the hero,
  // creed and inquiry keep Tae's "Tell us what you're building".
  cta: { label: approved("Build with us", "owner-approval"), section: "project-inquiry" },
} satisfies NavContent);

export const clientsCreed: CreedContent = defineNarrative("clients.creed", {
  cta: { label: tae("Tell us what you're building"), section: "project-inquiry" },
} satisfies CreedContent);

export const clientsNarrative = { clientsHero, clientsCapabilities, clientsServices, clientsServiceGallery, clientsPreviousWorks, clientsFaq, clientsInquiry, clientsNav, clientsCreed };
