import { DISCORD_INVITE_URL, PORTAL_JOIN_URL } from "../data/constants";
import { approved, defineNarrative, type GuildContent, type HeroContent, type InquiryContent } from "./types";

// Copy currently published on "/" (the Venture Beyond entry). Reused verbatim so
// the entry renders exactly as before; the entry narrative is revisited in Phase 4.
// Known unverified items kept here unflagged until then: "Equity in the company",
// the 150 / 88+ statistics, the cohort requirement, and "Start with a cohort"
// pointing at Portal account sign-up. /community flags or replaces each of them.
const existing = (text: string) => approved(text, "existing-site");

export const entryHero: HeroContent = defineNarrative("entry.hero", {
  eyebrow: existing("Independent digital mercenaries"),
  title: { lead: existing("VENTURE"), em: existing("BEYOND") },
  dek: existing("RaidGuild is a builder-owned community where creative and technical people explore emerging technology and build together."),
  paths: [
    { label: existing("Explore the Guild"), section: "guild", variant: "filled", icon: "↓", primary: true },
    { label: existing("Join through Portal"), href: PORTAL_JOIN_URL, variant: "outline", icon: "↗" },
    { label: existing("Bring a project"), section: "spears", variant: "outline", icon: "↓" },
  ],
} satisfies HeroContent);

export const entryGuild: GuildContent = defineNarrative("entry.guild", {
  label: existing("[ THE GUILD ]"),
  title: { lead: existing("The network"), em: existing("is the engine") },
  body: existing("**RaidGuild** is a builder-owned community exploring emerging technology together. **Designers, engineers, researchers, strategists, and operators** share knowledge, reputation, and infrastructure."),
  more: {
    summary: existing("See more"),
    text: existing("We learn from one another, test ideas, and build lasting relationships. Shared work grows from those connections, from open experiments to independent practices in applied AI and onchain systems."),
  },
  kit: {
    heading: existing("Your Guild kit"),
    items: [
      { term: existing("Guild email"), detail: existing("Your own @raidguild.org address") },
      { term: existing("Space to launch"), detail: existing("A raidguild.org subdomain for your personal site or Tip of the Spear initiative") },
      { term: existing("Shared ownership"), detail: existing("Equity in the company") },
      { term: existing("AI companion"), detail: existing("Your own personal organizational AI assistant") },
    ],
    requirement: existing("To become a member, first complete a cohort."),
  },
  actions: [
    { label: existing("Start with a cohort"), href: PORTAL_JOIN_URL, variant: "filled", icon: "logo" },
    { label: existing("Enter Discord"), href: DISCORD_INVITE_URL, variant: "outline", icon: "discord" },
  ],
  links: [
    { label: existing("Read the handbook ↗"), href: "https://handbook.raidguild.org/docs/overview/what-is-raidguild" },
    { label: existing("Questions? Ask Queen Raida, our AI CTO ↗"), href: "/chat" },
  ],
  metricsLabel: "RaidGuild statistics",
  metrics: [
    { value: existing("150"), label: existing("GLOBAL MEMBERS") },
    { value: existing("88+"), label: existing("RAIDS SHIPPED ACROSS THE FRONTIER") },
    { value: existing("∞"), label: existing("QUESTIONS TO EXPLORE") },
    { value: existing("2019"), label: existing("BUILDING TOGETHER SINCE") },
  ],
} satisfies GuildContent);

export const entryInquiry: InquiryContent = defineNarrative("entry.inquiry", {
  label: existing("[ BEGIN A TRANSMISSION ]"),
  title: { lead: existing("Find your"), em: existing("starting point.") },
  body: existing("Start with a specialist practice above. If the fit is unclear, send the Guild a short inquiry."),
  summary: { label: existing("Start a Guild inquiry"), hint: existing("Share a project or question ↓"), hintOpen: existing("Close the inquiry ↑") },
  coordinates: [existing("RG—INTAKE / 001"), existing("ENCRYPTION: OPEN")],
  image: { alt: existing("Four Guild characters with maps, tools, and a staff") },
} satisfies InquiryContent);
