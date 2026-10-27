import { PORTAL_JOIN_URL } from "../data/constants";
import { approved, defineNarrative, oct23, type BuilderNetworkContent, type StewardshipContent } from "./types";

// Content for modules both audiences share. Each audience gets its own variant
// of the same component; the component never decides copy by audience itself.

const existing = (text: string) => approved(text, "existing-site");
const portalMembers = "https://portal.raidguild.org";

export const buildersClients: BuilderNetworkContent = defineNarrative("shared.builders.clients", {
  title: { lead: existing("A wide network"), em: existing("of builders") },
  intro: oct23("Find the people behind the work. Explore the skills across our Guild."),
  link: { label: oct23("Build with the Guild →"), section: "project-inquiry" },
} satisfies BuilderNetworkContent);

export const buildersCommunity: BuilderNetworkContent = defineNarrative("shared.builders.community", {
  title: { lead: existing("A wide network"), em: existing("of builders") },
  intro: oct23("Different skills. Shared curiosity. Find your people in the Guild."),
  link: { label: oct23("Meet the Guild on Portal ↗"), href: portalMembers },
} satisfies BuilderNetworkContent);

// "People behind the work" shows the same stewards with their professional
// titles for clients; Community keeps the stewardship roles.
export const peopleClients: StewardshipContent = defineNarrative("shared.people.clients", {
  label: oct23("[ People behind the work ]"),
  title: { lead: oct23("People behind"), em: oct23("the work") },
  intro: oct23("Meet some of the people contributing to the Guild. Explore the full network by professional skill."),
  roster: { label: existing("Explore all members ↗"), href: portalMembers },
} satisfies StewardshipContent);

export const sharedCtas = defineNarrative("shared.cta", {
  discord: existing("Enter Discord"),
  portal: { label: existing("Join through Portal"), href: PORTAL_JOIN_URL },
  allMembers: { label: existing("Explore all members ↗"), href: portalMembers },
});

export const sharedNarrative = { buildersClients, buildersCommunity, peopleClients, sharedCtas };
