import { caseStudyProjects } from "../data/caseStudies";
import { services } from "../data/content";
import { activeSpears } from "../data/venture";
import {
  approved, claim, defineNarrative, oct23, wording,
  type CapabilitiesContent, type CreedContent, type FaqContent, type FeatureGalleryContent, type GalleryCard, type HeroContent,
  type InquiryContent, type NavContent, type PreviousWorksContent, type ReasonsContent, type ServicesContent, type ShowcaseWork,
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
  // November 3 Figma artboard (Clients / Light / 1440×900, the owner's edit,
  // approved by the owner the same day): "builders" leads the list, and the
  // two key phrases are set in bold.
  dek: approved(
    "**A decentralized collective of builders**, engineers and designers **building onchain products**, digital experiences and applied AI.",
    "owner-approval",
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
// cards right after the hero. Titles are the published service names on two
// lines ("Smart contracts and onchain systems" and "Applied AI" follow the
// brief); category labels are new wording. Art: existing site illustrations.
// November 3 (owner): the Full-stack card's blueprint sketch (outside the
// illustration system) is replaced by the crashed-pod crew
// (spear-edge-problem-v1.webp), the same scene as the builders module art.
// November 3 (owner brief, client-facing rework): the intro and every card
// body speak to the buyer (what they get and why it holds up), replacing the
// published service copy and the Guild-internal intro ("center of gravity",
// "raids"). New drafts, flagged as claims: they describe offerings and ways of
// working. Facts reused from approved copy only: onchain work since 2019 (the
// Onchain practice), the named clients (the showcase), handoff with
// documentation (the showcase and the FAQ). No prices, timelines or guarantees.
const cardNote = "Card title from the published service name, set on two lines (November 2 gallery). Confirm.";
const clientNote = "Client-facing service description (November 3 owner brief: speak to prospective clients). New draft; confirm the offering and wording.";
const serviceCard = (title: string, lead: string, em: string, label: string, body: string, image: GalleryCard["image"], link?: GalleryCard["link"]): GalleryCard => {
  if (!services.some((item) => item.title === title)) throw new Error(`Unknown service: ${title}`);
  return { label: wording(label), title: { lead: claim(lead, "existing-site", cardNote), em: claim(em, "existing-site", cardNote) }, body: claim(body, "draft", clientNote), image, ...(link ? { link } : {}) };
};
const onchain = activeSpears.find((item) => item.title === "Onchain Systems")!;
const appliedAi = activeSpears.find((item) => item.title === "Applied AI")!;
export const clientsServiceGallery: FeatureGalleryContent = defineNarrative("clients.serviceGallery", {
  label: design("[ Services & capabilities ]"),
  title: { lead: wording("What we can", "Framing from the November 2 brief (“What we can build for you”). Confirm as the heading."), em: wording("build for you", "Framing from the November 2 brief. Confirm as the heading.") },
  intro: wording("Modernize the business you already run, or launch something new. We bring applied AI, smart contracts and product design to the problem, with a small senior team from scoping to handoff.", "Client-facing intro (November 3 owner brief). Replaces the Guild-internal intro (“The Guild is the center of gravity …”)."),
  cards: [
    serviceCard("Full-Stack Development", "Full-stack", "development", "Engineering",
      "Web apps, dApps, APIs and internal tools, built end to end and deployed, with code your own team can read, run and extend.",
      { src: "/images/neo/spear-edge-problem-v1.webp", width: 1024, height: 768, fit: "contain" }),
    {
      label: wording("Onchain"),
      title: { lead: wording("Smart contracts,", "Service name from the November 2 brief (“Smart contracts and onchain systems”), on two lines. Confirm."), em: wording("onchain systems", "Service name from the November 2 brief. Confirm.") },
      body: claim("Smart contracts, dApps and the infrastructure around them, from contract design to the interface your users touch. Onchain since 2019, for teams such as Pocket Network, YieldNest and Hypercerts.", "draft", `${clientNote} “Since 2019” is the Onchain practice's copy; the three clients are in the showcase.`),
      image: { src: onchain.art, width: 1024, height: 768, fit: "contain" },
      link: { label: existing(onchain.cta), href: onchain.href, destination: claim("Railway production URL", "existing-site", "The practice link points to a railway.app deployment. Confirm the public URL.") },
    },
    serviceCard("AI Solutions & Automation", "Applied AI", "and automation", "Applied AI",
      "Practical AI and automation for the work your team repeats every day: we find where it saves time, build it into the tools you already use, and keep people reviewing what it produces.",
      { src: appliedAi.art, width: 1024, height: 768, fit: "contain" }, { label: existing(appliedAi.cta), href: appliedAi.href }),
    serviceCard("Product & System Design", "Product and", "system design", "Design",
      "Complex ideas turned into products people can use: research, flows, interfaces and design systems, carried through to the shipped product.",
      { src: "/images/neo/guild-builders-v1.png", width: 768, height: 1024, fit: "contain" }),
    serviceCard("Marketing & Content Strategy", "Marketing and", "content strategy", "Growth",
      "Positioning, launch content and documentation that explain what you built to the people you need to reach.",
      { src: "/images/neo/field-signal-commons.png", width: 1122, height: 1402 }),
    serviceCard("DAO Consulting & Governance", "DAO consulting", "and governance", "Coordination",
      "Governance, treasury and token design for organizations that coordinate onchain, from people who have built and run that tooling themselves.",
      { src: "/images/neo/field-autonomous-treasury.png", width: 1003, height: 1568 }),
  ],
  cta: { label: design("Discuss your project"), section: "project-inquiry" },
} satisfies FeatureGalleryContent);

// Why RaidGuild (November 3, owner brief): the buyer's question "Why should I
// choose RaidGuild for this project?", right after the services gallery, as
// expandable rows (sections/ClientReasons.tsx). The seven reasons are the
// brief's points in client language. Process facts come from the buyer FAQ
// (one project lead, weekly demos, handoff with docs and runbooks, optional
// maintenance), itself still flagged; the client names from the showcase.
// Every body is flagged as a claim until confirmed.
const reasonNote = "Client reason (November 3 owner brief). New draft; confirm it describes how RaidGuild works today.";
// A title naming ownership is a claim (the narrative tests flag ownership statements); the others are wording.
const reason = (title: string, body: string, note = reasonNote) => ({
  title: /ownership/i.test(title) ? claim(title, "draft", "Reason title (November 3 owner brief). States a way of working; confirm.") : wording(title, "Reason title (November 3 owner brief). New draft."),
  body: claim(body, "draft", note),
});
export const clientsReasons: ReasonsContent = defineNarrative("clients.reasons", {
  label: wording("[ Why RaidGuild ]"),
  title: { lead: wording("Why build"), em: wording("with RaidGuild") },
  intro: wording("You need more than extra hands: a partner who can scope the problem, build the system and leave it in good shape for your team. This is how we work."),
  items: [
    reason("Small, senior, accountable teams", "A few experienced builders matched to your problem, with one project lead as your point of contact from kickoff to handoff.", `${reasonNote} The single project lead is the buyer FAQ's answer.`),
    reason("AI and blockchain where they earn their place", "We start from the business you run today and add applied AI or onchain systems where they solve a real problem, not for their own sake."),
    reason("Smart contracts, dApps and onchain products", "We design and ship contracts, decentralized applications and the products around them, and have done so since 2019.", `${reasonNote} “Since 2019” is the Onchain practice's copy.`),
    reason("From strategy to handoff, one team", "Scoping, design, implementation, documentation and handoff stay with the same team, so nothing is lost between the plan and the code."),
    reason("Focused scope, clear ownership", "Each project starts from an agreed scope and a named owner for every part of it, so you know what is being built and who is responsible."),
    reason("Progress you can see every week", "Weekly demos of working software, so you can steer early, while changes are still cheap.", `${reasonNote} Weekly demos are the buyer FAQ's process answer.`),
    reason("Systems your team can maintain", "We hand over the code with its documentation and runbooks, or stay on for maintenance if you prefer. Teams such as Livepeer, Pocket Network, DAOhaus and Gitcoin have shipped with us.", `${reasonNote} Handoff and maintenance are the buyer FAQ's answers; the clients are in the showcase.`),
  ],
} satisfies ReasonsContent);

// Buyer FAQ (November 2), right before the inquiry. Questions and answers are
// the brief's (November 3: "raid" reads "project" / "the build" for buyers); bracketed values are placeholders awaiting the owner and render
// as marked placeholders (Faq.tsx). Every answer stays flagged until confirmed.
const faqNote = "Buyer FAQ answer from the November 2 brief. Confirm the facts; bracketed values are placeholders.";
const faq = (question: string, answer: string) => ({ question: wording(question, "Buyer FAQ question from the November 2 brief."), answer: claim(answer, "draft", faqNote) });
export const clientsFaq: FaqContent = defineNarrative("clients.faq", {
  // No section label (November 3, owner: "[ Before you start ]" removed).
  title: { lead: wording("Questions"), em: wording("before we build") },
  items: [
    faq("What does it cost?", "Most projects run [$X–$Y]. Fixed scope, fixed price, quoted after a scoping call."),
    faq("How long does it take?", "Typical projects run [X–Y weeks]. Smaller fixes can start within [X days]."),
    faq("Who is accountable in a DAO?", "One project lead is your point of contact from kickoff to handoff. You get one contract and one invoice."),
    faq("What is the process?", "Brief, then a scoping call, then a proposal, then the build with weekly demos, then handoff with docs and runbooks."),
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

export const clientsNarrative = { clientsHero, clientsCapabilities, clientsServices, clientsServiceGallery, clientsReasons, clientsPreviousWorks, clientsFaq, clientsInquiry, clientsNav, clientsCreed };
