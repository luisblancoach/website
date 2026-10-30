import { DISCORD_INVITE_URL, PORTAL_JOIN_URL } from "../data/constants";
import { HATS_TREE_URL } from "../data/hats";
import {
  approved, claim, defineNarrative, oct23, wording,
  type ActivityContent, type Copy, type CreedContent, type GuildContent, type HeroContent, type JoinContent, type NavContent, type PathContent,
  type HatsContent, type ImmersiveContent, type QueenRaidaContent, type StewardshipContent, type TensionContent,
} from "./types";

// Community narrative (dark by default). Structure and headline lines follow
// Tae's approved direction; facts come from the public handbook or Portal and
// stay flagged until confirmed. Handbook pages show no update dates; their
// source files were last edited between Nov 2024 and Aug 2026.

const HB = "https://handbook.raidguild.org/docs/";
const tae = (text: string) => approved(text, "tae-brief");
const existing = (text: string) => approved(text, "existing-site");
const steward = (text: string) => approved(text, "steward-brief");

const joinDestination = () => claim(
  "Interim destination: Portal account sign-up",
  "portal",
  "portal.raidguild.org/join creates a Portal account; it is not DAO membership. The handbook describes membership as cohort → champion → membership proposal. Confirm where “Join the DAO” should lead.",
  PORTAL_JOIN_URL,
);

const unverifiedBenefit = (text: string): Copy => claim(
  text,
  "existing-site",
  "Member benefit published on the current redesign; not documented in the handbook. Confirm it is offered today.",
);

const unverifiedMetric = (text: string): Copy => claim(
  text,
  "existing-site",
  "Unverified mockup value (docs/venture-integration.md). Confirm or replace with a sourced figure.",
);

// October 29 (evening) owner copy. "builder owned community" is set in bold for
// emphasis; the words are verbatim.
const owner = (text: string) => approved(text, "owner-approval");
export const communityHero: HeroContent = defineNarrative("community.hero", {
  eyebrow: owner("[ THE GUILD ]"),
  title: { lead: owner("Find your people."), em: owner("Build something together."), long: true },
  dek: owner("RaidGuild is a **builder owned community** working across onchain systems, applied AI, and open source software. Meet fellow builders, explore their experiments, and find a place to contribute."),
  paths: [
    { label: owner("Explore the community"), href: PORTAL_JOIN_URL, destination: joinDestination(), variant: "filled", icon: "→", primary: true },
    { label: owner("See what we’re building"), section: "work", variant: "outline", icon: "↓" },
  ],
} satisfies HeroContent);

export const communityTension: TensionContent = defineNarrative("community.tension", {
  label: wording("[ THE TENSION ]"),
  title: { lead: tae("Freelance work"), em: tae("versus real ownership") },
  sides: [
    {
      heading: wording("You build it. Someone else owns it."),
      points: [
        wording("Each contract ends when the work ships."),
        wording("The upside of what you build stays with the client."),
        wording("Every new project starts from zero: new team, new trust, new terms."),
      ],
    },
    {
      owned: true,
      heading: claim(
        "Build together. Hold a share of the guild.",
        "handbook",
        "Relies on members holding DAO shares (handbook: Raid Guild shares). Confirm the ownership framing.",
        `${HB}membership/raid-guild-shares`,
      ),
      points: [
        claim(
          "Members hold shares in the RaidGuild DAO. Each share carries one vote and a proportional claim on the guild treasury.",
          "handbook",
          "Handbook, Raid Guild shares (source last edited Nov 2024). Confirm the share model is current.",
          `${HB}membership/raid-guild-shares`,
        ),
        claim(
          "Raiders can take part of their pay in voting shares.",
          "handbook",
          "Handbook, getting paid: up to 20% of a raid payment can be taken as voting shares (source last edited Nov 2024). Confirm current terms.",
          `${HB}raids/getting-paid`,
        ),
        claim(
          "Members can ragequit at any time, exchanging their shares for their portion of the treasury.",
          "handbook",
          "Handbook, Raid Guild shares (source last edited Nov 2024). Confirm before publishing.",
          `${HB}membership/raid-guild-shares`,
        ),
      ],
    },
  ],
} satisfies TensionContent);

export const communityPath: PathContent = defineNarrative("community.path", {
  label: wording("[ THE PATH ]"),
  title: { lead: wording("From contributor"), em: wording("to owner") },
  framing: wording(
    "A way to picture how contribution grows inside the guild, not an automatic progression. Every path is different, and the current requirements live in the handbook.",
    "Framing requested by Tae: present the path as a narrative, not a guaranteed sequence. Needs editorial approval.",
  ),
  steps: [
    {
      title: tae("Enter a cohort"),
      body: claim(
        "New builders start in an apprentice cohort: a shared season of onboarding alongside other newcomers. Cohorts run from time to time.",
        "handbook",
        "Handbook pages disagree on whether a cohort is required (become-an-apprentice vs champion-a-member). Confirm how cohorts run today and where people apply; the handbook points to an application on the main website, which no longer exists.",
        `${HB}membership/become-an-apprentice`,
      ),
    },
    {
      title: tae("Take a raid"),
      body: claim(
        "A raid is a client project taken on by a party of guild members. Apprentices can work on raids and on internal guild projects.",
        "handbook",
        "The glossary defines a raid and join-the-guild says apprentices raid, but intro-to-raiding addresses members only. Confirm who can join raids today.",
        `${HB}raids/intro-to-raiding`,
      ),
    },
    {
      title: tae("Earn ownership"),
      body: claim(
        "Membership is proposed to the DAO with a current member as champion, and members vote on it. Members hold voting shares in the DAO.",
        "handbook",
        "Handbook (2024–25) adds a $RAID stake by the champion, a 100-share cap and a wxDAI tribute; those details are deliberately left out. Confirm the current process.",
        `${HB}membership/become-a-member`,
      ),
    },
  ],
  footnote: { label: wording("Read the membership guide in the handbook ↗"), href: `${HB}membership/join-the-guild` },
} satisfies PathContent);

// About RaidGuild: the "Builder-owned / member-governed" chapter as published
// before October 28 (restored from f842d87 on October 29). Its October 28
// replacement copy moved to the Moloch feature and the Hats Tree section below.
export const communityGuild: GuildContent = defineNarrative("community.guild", {
  label: existing("[ THE GUILD ]"),
  title: {
    lead: existing("Builder-owned"),
    em: claim(
      "member-governed",
      "handbook",
      "Supported by the handbook's DAO operations page (members sponsor and vote on proposals). Confirm the wording.",
      `${HB}dao-operations/`,
    ),
  },
  body: claim(
    "**RaidGuild** runs as a DAO with no single leader. **Members** sponsor and vote on proposals, from welcoming new members to funding guild projects.",
    "handbook",
    "Paraphrases what-is-raidguild (“operates without a single leader”) and DAO operations (member sponsorship and votes). Confirm.",
    `${HB}dao-operations/`,
  ),
  more: {
    summary: existing("See more"),
    text: claim(
      "Proposals are made through DAOhaus. After a vote closes, members have a grace period to ragequit if they disagree with the outcome.",
      "handbook",
      "Handbook DAO operations (source last edited Nov 2024): 72-hour vote, simple majority, 48-hour grace period. Confirm the governance setup is current.",
      `${HB}dao-operations/`,
    ),
  },
  kit: {
    heading: existing("Your Guild kit"),
    items: [
      { term: existing("Guild email"), detail: unverifiedBenefit("Your own @raidguild.org address") },
      { term: existing("Space to launch"), detail: unverifiedBenefit("A raidguild.org subdomain for your personal site or Tip of the Spear initiative") },
      {
        term: claim("Voting shares", "handbook", "Replaces “Shared ownership: Equity in the company”, which no RaidGuild source supports. Confirm which ownership language is correct.", `${HB}membership/raid-guild-shares`),
        detail: claim("One vote per share and a proportional claim on the guild treasury", "handbook", "Handbook, Raid Guild shares (source last edited Nov 2024).", `${HB}membership/raid-guild-shares`),
      },
      { term: existing("AI companion"), detail: unverifiedBenefit("Your own personal organizational AI assistant") },
    ],
    requirement: claim(
      "To become a member, first complete a cohort.",
      "existing-site",
      "Published on the current redesign, but handbook pages disagree on whether a cohort is required. Confirm.",
    ),
  },
  actions: [
    { label: tae("Join the DAO"), href: PORTAL_JOIN_URL, destination: joinDestination(), variant: "filled", icon: "→" },
    { label: existing("Enter Discord"), href: DISCORD_INVITE_URL, variant: "outline", icon: "discord" },
  ],
  links: [
    { label: existing("Read the handbook ↗"), href: `${HB}overview/what-is-raidguild` },
    { label: existing("Questions? Ask Queen Raida, our AI CTO ↗"), href: "/chat" },
  ],
  metricsLabel: "RaidGuild statistics",
  metrics: [
    { value: unverifiedMetric("150"), label: existing("GLOBAL MEMBERS") },
    { value: unverifiedMetric("88+"), label: existing("RAIDS SHIPPED ACROSS THE FRONTIER") },
    { value: existing("∞"), label: existing("QUESTIONS TO EXPLORE") },
    { value: existing("2019"), label: existing("BUILDING TOGETHER SINCE") },
  ],
} satisfies GuildContent);

export const communityActivity: ActivityContent = defineNarrative("community.activity", {
  label: wording("[ PROOF OF LIFE ]"),
  title: { lead: wording("Signals"), em: wording("from the guild") },
  intro: wording("Recent field notes and public artifacts from members, loaded live from Portal."),
  postsHeading: wording("Latest field notes"),
  postsUnavailable: wording("Field notes are temporarily unavailable."),
  allPosts: { label: wording("All field notes on Portal ↗"), href: "https://portal.raidguild.org/posts" },
  // B3.4: heading and description supplied by the brand steward. The section
  // keeps its #work / #gallery anchors.
  collection: {
    label: existing("[ EXPLORE ]"),
    title: { lead: owner("What happens when builders"), em: owner("follow their curiosity.") },
    intro: steward("A collection of artifacts, experiments, games and ideas RaidGuild members have brought to life across emerging technology."),
  },
} satisfies ActivityContent);

export const communityJoin: JoinContent = defineNarrative("community.join", {
  label: wording("[ JOIN THE GUILD ]"),
  title: { lead: owner("Your first step"), em: owner("into the Guild.") },
  body: owner("Create a Portal profile to explore sessions, projects, and posts. Meet the community on Discord, and read the membership guide when you’re ready to learn how joining the DAO works."),
  actions: [
    { label: owner("Create your Portal profile"), href: PORTAL_JOIN_URL, destination: joinDestination(), variant: "filled", icon: "→" },
    { label: existing("Enter Discord"), href: DISCORD_INVITE_URL, variant: "outline", icon: "discord" },
  ],
  links: [
    { label: wording("Read the membership guide ↗"), href: `${HB}membership/join-the-guild` },
  ],
} satisfies JoinContent);

// Queen Raida: the October 23 carousel, kept as-is (B3.3 decision). The
// artwork is AI-generated for RaidGuild and approved for public use by the
// project owner (docs/asset-provenance.md). Capability statements are
// October 23 copy and stay claims.
const raidaClaim = (text: string) => claim(text, "oct23-iteration", "October 23 copy describing what Queen Raida can do or access. Confirm with the Queen Raida maintainers before publishing.");

export const communityQueenRaida: QueenRaidaContent = defineNarrative("community.queenRaida", {
  title: { lead: existing("Queen"), em: oct23("Raida.") },
  cta: { label: oct23("Ask our AI CTO"), href: "/chat" },
  intro: oct23("A companion for shared Guild knowledge, exploration and conversation."),
  panels: [
    {
      subtitle: oct23("A companion for Guild knowledge"),
      title: oct23("Meet Queen Raida."),
      copy: raidaClaim("Ask RaidGuild\u2019s AI CTO about the Guild, its people and what we\u2019re exploring. The existing chat draws on public Guild knowledge."),
      detail: oct23("Start with a question about the Guild or its practices. Queen Raida is an AI agent; check important details against the original source."),
    },
    {
      subtitle: oct23("Meeting notes & shared context"),
      title: oct23("Follow the thread."),
      copy: raidaClaim("Use Queen Raida as a starting point for questions about shared Guild knowledge. Bring the context of the meeting you want to explore."),
      detail: raidaClaim("Automatic meeting capture and a searchable meeting-summary archive are not exposed by this website. Chat answers depend on the public knowledge available to the Guild\u2019s AI service."),
    },
    {
      subtitle: oct23("People, practices & possibilities"),
      title: oct23("Find your way in."),
      copy: claim("Explore what the Guild is working on, then follow your curiosity into the community. Portal is the place to begin your cohort journey.", "oct23-iteration", "October 23 copy. The Portal join page creates an account and does not mention cohorts; confirm where the cohort journey begins."),
      detail: claim("Queen Raida can help you explore. Applications and cohort onboarding continue through the existing RaidGuild Portal.", "oct23-iteration", "October 23 copy. Confirm that cohort applications run through Portal."),
    },
  ],
  detailsLabel: oct23("Explore this role"),
  artwork: {
    src: "/images/venture/entities/queen-raida/queen-rectangle.png",
    alt: existing("Queen Raida"),
    caption: existing("Queen Raida"),
    rights: approved("AI-generated for RaidGuild; approved for public use in this project by the project owner", "owner-approval"),
  },
} satisfies QueenRaidaContent);

// Stewardship keeps the published roster copy and adds the October 23 Hats note.
export const communityStewardship: StewardshipContent = defineNarrative("community.stewardship", {
  label: oct23("[ STEWARDSHIP ]"),
  title: { lead: existing("Keepers of"), em: existing("the signal") },
  intro: existing("Stewards help care for the Guild\u2019s shared knowledge, infrastructure, coordination, and public voice."),
  roster: { label: existing("Explore all members ↗"), href: "https://portal.raidguild.org" },
  hats: {
    summary: oct23("Hats & responsibilities"),
    body: claim(
      "Explore how the Guild organizes shared responsibilities. Current Hats assignments are not listed here; consult the Guild handbook and Portal for organizational context.",
      "handbook",
      "October 23 copy. Roles are Hats created and removed by DAO proposal (handbook, DAO roles). Confirm the wording.",
      `${HB}dao-operations/dao-roles`,
    ),
    link: { label: oct23("Open the Guild handbook ↗"), href: `${HB}overview/what-is-raidguild` },
  },
  agents: {
    summary: oct23("AI agents in the Guild"),
    body: claim("Meet Queen Raida, the Guild\u2019s AI CTO and a starting point for public Guild knowledge.", "oct23-iteration", "October 23 copy. Confirm how Queen Raida should be described and what it can access."),
    link: { label: oct23("Ask Queen Raida ↗"), href: "/chat" },
  },
} satisfies StewardshipContent);

// Immersive features (October 29): Queen Raida and Moloch share one layout
// (sections/ImmersiveFeature.tsx); artwork paths live in lib/data/illustrations.ts.
export const communityRaidaFeature: ImmersiveContent = defineNarrative("community.raidaFeature", {
  label: wording("[ Queen Raida ]", "Section label for the Queen Raida feature; confirm."),
  title: { lead: approved("A scout for signal.", "owner-approval"), em: approved("A scribe for the Guild.", "owner-approval") },
  body: approved("Queen Raida is RaidGuild’s AI agent. She helps spot useful developments, gather context, and turn the Guild’s work into clear updates, drafts, and next steps - giving members more room for the work that needs human judgment: choosing what matters, building trust, and making decisions.", "owner-approval"),
  cta: { label: oct23("Ask our AI CTO"), href: "/chat", variant: "filled" },
  artwork: { alt: existing("Queen Raida") },
} satisfies ImmersiveContent);

// The October 28 "About Moloch" copy, moved here verbatim.
export const communityMoloch: ImmersiveContent = defineNarrative("community.moloch", {
  label: existing("[ THE GUILD ]"),
  title: { lead: approved("About", "owner-approval"), em: approved("Moloch", "owner-approval") },
  body: claim(
    "In RaidGuild lore, Moloch represents coordination failure: when individual incentives lead to outcomes nobody wants. Building together is our response—through shared ownership, useful tools, and systems that make cooperation easier.",
    "handbook",
    "Owner-supplied Join the DAO copy. Confirm the lore framing and current ownership language before publishing.",
    "https://rg-handbook-nextra.vercel.app/dao-operations/dao-roles",
  ),
  cta: { label: approved("Find your path into the Guild", "owner-approval"), href: `${HB}membership/join-the-guild`, variant: "outline" },
  artwork: { alt: existing("Moloch") },
} satisfies ImmersiveContent);

// The Hats Tree (October 29): replaces "Keepers of the signal". The October 28
// Hats Tree and stewardship copy moved here verbatim. The tree itself is a
// reference snapshot (lib/data/hats.ts); live roles and wearers are on Hats
// Protocol, the section's one link.
export const communityHats: HatsContent = defineNarrative("community.hats", {
  label: oct23("[ STEWARDSHIP ]"),
  title: { lead: approved("RaidGuild's", "owner-approval"), em: approved("Hats Tree", "owner-approval") },
  intro: claim(
    "RaidGuild’s Hats Tree maps the roles that help the Guild work: what each role is responsible for, how it fits into the wider organization, and who’s eligible to hold it. The tree is powered by Hats Protocol, which represents roles and their permissions onchain. Some roles also have budgets or defined decision-making authority.",
    "handbook",
    "Owner-supplied Join the DAO copy. Confirm current Hats assignments, permissions, budgets and decision-making authority.",
    "https://rg-handbook-nextra.vercel.app/dao-operations/dao-roles",
  ),
  stewards: {
    term: approved("Stewards", "owner-approval"),
    detail: claim(
      "Stewards are members who take responsibility for keeping important parts of the Guild moving. A Brand Steward, for example, helps maintain a shared brand; a Handbook Steward guides upkeep of the Guild’s knowledge. Stewardship means doing and reporting on the work—not being everyone’s boss. Taking action and staying accountable is important to keep the org moving forward.",
      "handbook",
      "Owner-supplied Join the DAO copy. Confirm current steward roles and responsibilities.",
      "https://rg-handbook-nextra.vercel.app/dao-operations/dao-roles",
    ),
  },
  snapshot: wording("Reference snapshot of the tree, October 29, 2026. Live roles and wearers are on Hats Protocol.", "States that the diagram is not live data; confirm the wording."),
  featuredLabel: wording("Featured roles", "Label for the five featured hats; confirm."),
  treeLink: { label: approved("Explore the Hats Tree", "owner-approval"), href: HATS_TREE_URL },
} satisfies HatsContent);

export const communityNav: NavContent = defineNarrative("community.nav", {
  // The October 23 navigation: one item per chapter it links to. The path and
  // activity chapters rejoin the navigation with the editorial batch.
  items: [
    { label: wording("Membership", "Phase 2 navigation label; needs editorial approval."), section: "guild" },
    { label: oct23("Queen Raida"), section: "raida" },
    { label: wording("Projects", "Follows the B3.4 rename of the section to Projects and Experiments; needs editorial approval."), section: "work" },
  ],
  cta: { label: approved("Join our community", "owner-approval"), href: PORTAL_JOIN_URL, destination: joinDestination() },
} satisfies NavContent);

export const communityCreed: CreedContent = defineNarrative("community.creed", {
  cta: { label: approved("Join our community", "owner-approval"), href: PORTAL_JOIN_URL, destination: joinDestination() },
} satisfies CreedContent);

export const communityNarrative = {
  communityHero, communityTension, communityPath, communityGuild, communityActivity, communityJoin,
  communityQueenRaida, communityStewardship, communityNav, communityCreed,
  communityRaidaFeature, communityMoloch, communityHats,
};
