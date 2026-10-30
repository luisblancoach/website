// RaidGuild's Hats Protocol tree (Gnosis chain, tree 1822), as a reference
// snapshot taken on October 29, 2026 from the Hats app and the owner's
// screenshot. It lists roles only: wearers are not shown, and the diagram does
// not claim live status. Live roles: HATS_TREE_URL.
//
// Featured roles carry the owner's illustration (docs/asset-provenance.md):
// 600 × 600 PNGs at /images/venture/hats/<slug>.png, shown at about 76–176 px.
// The parent node uses the RaidGuild mark (raidguild.png, 800 × 800).

export const HATS_TREE_URL = "https://app.hatsprotocol.xyz/trees/100/1822";
export const hatsSnapshotDate = "2026-10-29";
export const hatImageSize = { width: 600, height: 600 };

export type HatRole = {
  id: string;
  name: string;
  slug: string;
  // Featured roles only.
  image?: string;
  // A RaidGuild token, after the role's colour in the Hats app.
  accent?: string;
};

export const hatsParent = { id: "1822", name: "RaidGuild Steward Admin", image: "/images/venture/hats/raidguild.png", width: 800, height: 800 };

const featured = (id: string, name: string, slug: string, accent: string): HatRole =>
  ({ id, name, slug, image: `/images/venture/hats/${slug}.png`, accent });

// In tree order (1822.1 … 1822.9).
export const hatsRoles: HatRole[] = [
  featured("1822.1", "Brand Steward", "brand-steward", "var(--color-pink)"),
  featured("1822.2", "Knowledge Steward", "knowledge-steward", "var(--color-cyan)"),
  featured("1822.3", "Infrastructure Steward", "infrastructure-steward", "var(--moloch-400, #d25c41)"),
  featured("1822.4", "Participation Steward", "participation-steward", "var(--scroll-300, #dccd6a)"),
  featured("1822.5", "Sync Steward", "sync-steward", "var(--color-indigo)"),
  { id: "1822.6", name: "Accounting Steward", slug: "accounting-steward" },
  { id: "1822.7", name: "Hat Tree Steward", slug: "hat-tree-steward" },
  { id: "1822.8", name: "Bard Steward", slug: "bard-steward" },
  { id: "1822.9", name: "Mini-admin", slug: "mini-admin" },
];

// The five featured roles, in the order the owner listed them.
export const featuredHatSlugs = ["knowledge-steward", "infrastructure-steward", "sync-steward", "participation-steward", "brand-steward"] as const;
export const featuredHats = featuredHatSlugs.map((slug) => hatsRoles.find((role) => role.slug === slug)!);
