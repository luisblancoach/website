import { approved, defineNarrative, type NarrativeLink, type Copy } from "./types";

// Copy of the site chrome every Venture route shares: the header switches, the
// hero ornaments, the ticker, the creed and the footer. Until November 9 these
// strings were written into the components; they moved here, verbatim, so they
// have stable ids and Editorial Mode can cover them (v0.3). Links keep their
// destinations here as data; only the labels are copy. The components get this
// tree from the server (VentureLayout → VentureShell), so it never ships to the
// browser bundle on its own.
const existing = (text: string) => approved(text, "existing-site");

export type SiteContent = {
  // The audience switch's labels (lib/venture-routes.ts keeps the routes). The
  // Day / Night switch stays in ThemeSwitch.tsx: control labels, not copy.
  header: { audiences: { clients: Copy; community: Copy } };
  // The hero's corner index ("TRANSMISSION 001") and its vertical scroll cue.
  hero: { index: { label: Copy; number: Copy }; scrollCue: Copy };
  ticker: { label: Copy; words: Copy[] };
  creed: { label: Copy; statement: { lead: Copy; em: Copy } };
  footer: { motto: { lead: Copy; em: Copy }; socials: (NarrativeLink & { href: string })[]; copyright: Copy };
};

export const siteContent: SiteContent = defineNarrative("site", {
  header: {
    audiences: { clients: existing("Hire the DAO"), community: existing("Join the DAO") },
  },
  hero: { index: { label: existing("TRANSMISSION"), number: existing("001") }, scrollCue: existing("<<< SCROLL TO DESCEND") },
  ticker: {
    label: existing("Guild ticker"),
    words: ["ONE GUILD", "SENIOR DEVS", "BUILDER-OWNED", "APPLIED AI", "SCOPED RAIDS", "BUILT BY OWNERS"].map(existing),
  },
  creed: {
    label: existing("[ THE RAIDGUILD CREED ]"),
    statement: { lead: existing("The future is not something to predict. It is something to"), em: existing("build.") },
  },
  footer: {
    motto: { lead: existing("INDEPENDENT MINDS."), em: existing("WE GO FURTHER TOGETHER.") },
    socials: [
      { label: existing("GITHUB"), href: "https://github.com/raid-guild" },
      { label: existing("X / TWITTER"), href: "https://x.com/RaidGuild" },
      { label: existing("DISCORD"), href: "https://discord.gg/2vx47gT95y" },
      { label: existing("BRAND ARCHIVE"), href: "https://raidguild-brand-guide-production.up.railway.app/" },
    ],
    copyright: existing("© 2019—2026 RAIDGUILD · EARTH & ELSEWHERE"),
  },
} satisfies SiteContent);
