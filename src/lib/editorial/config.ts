// Editorial Mode (local prototype, 2026-11-07): which copy can be edited, and
// the human-readable names the editor shows for it. Pure data and functions, no
// React or DOM, so the draft logic and the tests can use it too.
//
// Where it exists:
// - Local development: always, with an "Edit copy" button on the editable pages.
// - A production build made with NEXT_PUBLIC_EDITORIAL_MODE=opt-in (the
//   Cloudflare review host): the editor ships in a chunk that loads only after a
//   visitor opens a page with ?editorial=1 (store.ts), and leaves with Exit or
//   ?editorial=0. Visitors without the parameter get the normal site: the server
//   HTML is the published copy, and no editor control or style is loaded.
//   The parameter is an interface switch, NOT authentication, and provides no
//   privacy or access restriction: anyone with the URL can open the editor. That is acceptable only because editing is entirely
//   local to the browser (drafts in localStorage, exported as files): nothing is
//   written to a server, shared or published, and the bundle holds no secret.
//   This is not a private editor.
// - Every other build (flag unset, raidguild.org): Next inlines both values at
//   build time, removes every branch that checks them, and the editor never
//   reaches the bundle. The entry points (primitives/Review.tsx,
//   shell/VentureShell.tsx) repeat this condition inline for that reason.
export const EDITORIAL_DEV = process.env.NODE_ENV === "development";
export const EDITORIAL_AVAILABLE = EDITORIAL_DEV || process.env.NEXT_PUBLIC_EDITORIAL_MODE === "opt-in";

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

// Editorial operations (v0.2). Plain-language names for the editor and the review document.
export type Operation = "REPLACE" | "SHORTEN" | "REMOVE" | "KEEP";
export type RemoveScope = "item" | "component" | "section";
export const OPERATION_LABEL: Record<Operation, string> = { REPLACE: "Rewrite", SHORTEN: "Shorten", REMOVE: "Remove", KEEP: "Keep as is" };
export const SCOPE_LABEL: Record<RemoveScope, string> = { item: "this text", component: "the whole item", section: "the whole section" };

// The array item a copy id belongs to ("clients.serviceGallery.cards.2.body" →
// "clients.serviceGallery.cards.2"), or undefined for section-level copy.
export function componentOf(id: string) {
  const section = sectionFor(id);
  if (!section) return undefined;
  const parts = id.slice(section.prefix.length + 1).split(".");
  const index = parts.findIndex((part) => /^\d+$/.test(part));
  return index > 0 ? `${section.prefix}.${parts.slice(0, index + 1).join(".")}` : undefined;
}

// What a removal takes away. `target` is the id prefix that disappears.
export function removalTarget(id: string, scope: RemoveScope) {
  if (scope === "section") return sectionFor(id)?.prefix ?? id;
  if (scope === "component") return componentOf(id) ?? id;
  return id;
}

// A removal that changes the page's structure, not just its copy, needs its own
// approval: a whole item or section, a button or link label (navigation), a
// heading or section label, or text that serves accessibility.
export function structuralReason(id: string, operation: Operation, scope: RemoveScope = "item"): string | null {
  if (operation !== "REMOVE") return null;
  if (scope === "section") return "Removes a whole section of the page.";
  if (scope === "component") return "Removes a whole item (card, button, row or link), not only its text.";
  const section = sectionFor(id);
  const rest = section ? id.slice(section.prefix.length + 1) : id;
  if (/(^|\.)(paths|actions|links)\.\d+\.label$|(^|\.)cta(\.label)?$|(^|\.)link\.label$/.test(rest)) return "Removes the label of a button or link, which would leave an empty control.";
  if (/(^|\.)title(\.(lead|em|finale))?$|(^|\.)heading$/.test(rest)) return "Removes (part of) a heading, which the page structure and screen readers rely on.";
  if (/^label$/.test(rest)) return "Removes the section label.";
  if (/(^|\.)(alt|ariaLabel|summary)$/.test(rest)) return "Removes text that serves accessibility.";
  return null;
}
