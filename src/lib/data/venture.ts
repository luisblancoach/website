import { mercenaries } from "./members";


export const activeSpears = [
  {
    index: "01",
    title: "Applied AI",
    copy: "An independently led practice bringing the network’s technical curiosity to applied AI. Explore its work with agents, workflows, and the systems that support them.",
    tag: "ACTIVE SPEAR / RAIDGUILD.AI",
    status: "DEPLOYING",
    href: "https://raidguild.ai",
    cta: "Explore the AI practice",
    art: "/images/neo/spear-applied-ai-v1.webp",
    artAlt: "A field technologist working with an AI companion and portable systems",
  },
  {
    index: "02",
    title: "Onchain Systems",
    copy: "A specialist practice rooted in the Guild’s onchain experience since 2019. Explore its work with protocols, products, governance, and shared ownership.",
    tag: "ACTIVE SPEAR / ONCHAIN",
    status: "BATTLE-TESTED",
    href: "https://raidguild-onchain-production.up.railway.app/",
    cta: "Explore onchain work",
    art: "/images/neo/spear-onchain-v1.webp",
    artAlt: "Guild builders operating an onchain systems foundry",
  },
];

// Reuse the identity assets from the original site's partner-logo banner.
// The group includes client, partner, and member-built projects, not just clients.
export const networkLogos = [
  // Organization summaries and official destinations checked September 23, 2026.
  // These describe the organizations, not the scope of RaidGuild's engagements.
  { name: "Gitcoin", file: "logo-Gitcoin.svg", href: "https://gitcoin.co/", description: "Gitcoin explores how communities fund public goods and open-source work. Its site brings together funding campaigns, tools, research, and lessons from the Ethereum ecosystem." },
  { name: "Gnosis", file: "logo-Gnosis.svg", href: "https://www.gnosis.io/chain", description: "Gnosis Chain is an Ethereum-compatible blockchain designed for accessible, low-cost transactions. It supports an ecosystem of applications and infrastructure for building onchain." },
  { name: "Pocket Network", file: "logo-Pocket.svg", href: "https://pocket.network/", description: "Pocket Network provides decentralized access to blockchain data through a network of infrastructure providers. Developers use its RPC services to connect applications, wallets, and other tools to blockchains." },
  { name: "Unlock Protocol", file: "logo-Unlock.svg", href: "https://unlock-protocol.com/", description: "Unlock Protocol provides open-source smart contracts for memberships and subscriptions. Its tools support time-based access, renewals, and recurring payments onchain." },
  { name: "BrightID", file: "logo-brightid.svg", href: "https://www.brightid.org/", description: "BrightID is a privacy-focused social identity network that helps people demonstrate they are using an application with only one account. It supports fair access without collecting personally identifying information." },
  { name: "DAOhaus", file: "logo-daohaus.svg", href: "https://daohaus.club/", description: "DAOhaus builds open-source tools for creating and operating DAOs. Its applications and Moloch-based contracts help communities manage membership, proposals, and shared treasuries." },
  { name: "Hypercerts", file: "logo-Hypercerts.svg", href: "https://hypercerts.org/", description: "Hypercerts develops open infrastructure for funding valuable work. Its protocol connects project records, reviews, and endorsements so funders can make better-informed decisions." },
  { name: "Protocol Labs", file: "logo-Protocol.svg", href: "https://pl.xyz/", description: "Protocol Labs is an innovation network connecting researchers, builders, and technology companies. It supports work from early research and invention through venture formation and growth." },
  { name: "Livepeer", file: "logo-Livepeer.svg", href: "https://livepeer.org/", description: "Livepeer provides open video infrastructure powered by a permissionless network of GPU providers. Its ecosystem supports AI video generation and processing alongside transcoding and streaming." },
  { name: "Daedalus", file: "logo-Daedalus.png", href: "https://ddls.co/", description: "Daedalus builds custom software for organizations whose operations need more than generic tools. The team combines practical AI, conventional software, and existing products to deliver systems clients can own and maintain." },
  { name: "LX2 Labs", file: "logo-LX2.svg", href: "https://www.lx2labs.com/", description: "LX2 Labs helps fintech companies improve their products and grow through design, branding, and lifecycle systems. Its work includes onboarding, automation, and AI implementation." },
];

export const stewards = [
  {
    name: "Dekan",
    role: "Knowledge Steward",
    href: "https://x.com/DekanBro",
    project: "KNOWLEDGE SYSTEMS",
    image: "/images/member-dekan.png",
  },
  {
    name: "ECWireless",
    role: "Infrastructure Steward",
    href: "https://github.com/ECWireless",
    project: "GITHUB / ECWIRELESS",
    image: "/images/member-ecwireless.png",
  },
  {
    name: "Takekek",
    role: "Sync Steward",
    project: "PROFILE FORTHCOMING",
    image: "/images/member-takekek.png",
  },
  {
    name: "Pupcakes",
    role: "Participation Steward",
    href: "https://github.com/Fluffy9",
    project: "GITHUB / FLUFFY9",
    image: "/images/member-pupcakes.png",
  },
  {
    name: "Louchi",
    role: "Brand Steward",
    href: "https://estudioblanco.org",
    project: "ESTUDIO BLANCO",
    image: "/images/member-louchi.png",
  },
];

const stewardNames = new Set(stewards.map((steward) => steward.name.toLowerCase()));
export const guildMembers = mercenaries.filter((member) => !stewardNames.has(member.name.toLowerCase()));
