// Editorial Mode (local prototype, 2026-11-07): which copy can be edited, and
// the human-readable names the editor shows for it. Pure data and functions, no
// React or DOM, so the draft logic and the tests can use it too.
//
// Local development only. `EDITORIAL_AVAILABLE` is the build-time switch: Next
// inlines `process.env.NODE_ENV`, so in a production build every branch that
// checks it is removed and the editor never reaches the bundle.
export const EDITORIAL_AVAILABLE = process.env.NODE_ENV === "development";

export type EditorialPage = "/agency" | "/community";

// One entry per editable section. A section is the copy subtree under `prefix`
// (the stable ids from defineNarrative, e.g. "clients.hero.title.lead").
// To enable another section later, add an entry here (and its narrative tree
// to catalog.ts); the editor needs no other change.
export type EditorialSection = {
  prefix: string;
  page: EditorialPage;
  pageLabel: string;
  label: string;
  // Names for array items ("cards" → "Card"), so "cards.2.body" reads "Card 3 · Text".
  items?: Record<string, string>;
  // Names for leaves that differ in this section ("title" → "Headline" in a hero).
  fields?: Record<string, string>;
};

export const EDITORIAL_SECTIONS: EditorialSection[] = [
  { prefix: "clients.hero", page: "/agency", pageLabel: "Agency", label: "Hero", items: { paths: "Button" }, fields: { title: "Headline", dek: "Introduction" } },
  { prefix: "clients.serviceGallery", page: "/agency", pageLabel: "Agency", label: "Services gallery", items: { cards: "Card" }, fields: { cta: "Section button" } },
  { prefix: "clients.reasons", page: "/agency", pageLabel: "Agency", label: "Why RaidGuild", items: { items: "Reason" }, fields: { "items.title": "Title", "items.body": "Expanded text" } },
  { prefix: "community.hero", page: "/community", pageLabel: "Community", label: "Hero", items: { paths: "Button" }, fields: { title: "Headline", dek: "Introduction" } },
  { prefix: "community.capabilities", page: "/community", pageLabel: "Community", label: "Capabilities gallery", items: { cards: "Card" }, fields: { cta: "Section button" } },
  { prefix: "community.join", page: "/community", pageLabel: "Community", label: "Join", items: { actions: "Button", links: "Link" } },
];

export const sectionFor = (id: string) => EDITORIAL_SECTIONS.find((section) => id.startsWith(`${section.prefix}.`));
// A link's `destination` is a review note about where it leads, never shown as text.
export const isEditableId = (id: string) => Boolean(id) && sectionFor(id) !== undefined && !/\.destination$/.test(id);

// Generic names for the leaves of the narrative types (lib/narrative/types.ts).
const FIELD: Record<string, string> = {
  label: "Label",
  title: "Title",
  intro: "Introduction",
  body: "Text",
  dek: "Introduction",
  eyebrow: "Eyebrow",
  cta: "Button",
  footnote: "Footnote",
  link: "Link",
};
const LINE: Record<string, string> = { lead: "line 1", em: "line 2", finale: "line 3" };

// "clients.serviceGallery.cards.2.title.em" → "Card 3 · Title, line 2".
// `context` names an item ("Smart contracts, onchain systems"), when known.
export function fieldLabel(id: string, context?: (itemPath: string) => string | undefined): string {
  const section = sectionFor(id);
  if (!section) return id;
  const parts = id.slice(section.prefix.length + 1).split(".");
  const out: string[] = [];
  let arrayKey = "";
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const next = parts[i + 1];
    if (next !== undefined && /^\d+$/.test(next)) {
      const noun = section.items?.[part] ?? FIELD[part] ?? part;
      const name = context?.(parts.slice(0, i + 2).join("."));
      out.push(`${noun} ${Number(next) + 1}${name ? ` (“${name}”)` : ""}`);
      arrayKey = part;
      i++;
      continue;
    }
    // Title lines: "Headline, line 2". Under anything else ("footnote.lead") the leaf is that thing's text.
    if (LINE[part]) { if (parts[i - 1] === "title") out[out.length - 1] = `${out[out.length - 1]}, ${LINE[part]}`; continue; }
    // A link's label is the link itself: "Button 1", not "Button 1 · Label".
    if (part === "label" && i > 0) continue;
    if (part === "label") { out.push("Section label"); continue; }
    const scoped = arrayKey ? section.fields?.[`${arrayKey}.${part}`] : undefined;
    out.push(scoped ?? section.fields?.[part] ?? FIELD[part] ?? part);
  }
  return out.join(" · ") || section.label;
}

export const sectionTitle = (section: EditorialSection) => `${section.pageLabel} · ${section.label}`;
