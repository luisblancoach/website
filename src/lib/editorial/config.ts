// Editorial Mode (prototype 2026-11-07; v0.3 full coverage 2026-11-09): which
// copy can be edited, how it reaches the page, which decisions are structural,
// and the human-readable names the editor shows. Pure data and functions, no
// React or DOM, so the draft logic, the CLI and the tests can use it too.
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
export const EDITORIAL_PAGES: readonly EditorialPage[] = ["/agency", "/community"];
// "shared": the chrome every Venture route shows (header switch, hero ornaments,
// ticker, creed, footer); a decision there changes both pages.
export type SectionPage = EditorialPage | "shared";

// How a copy item reaches the visitor. "visible": text on the page, edited in
// place. The others are not shown as text and are edited from the Changes
// panel's "Hidden text" list: an image's alt text, an accessible name read by
// screen readers, or the page's search and sharing metadata.
export type CopyKind = "visible" | "alt" | "accessible-name" | "metadata";
export const KIND_LABEL: Record<Exclude<CopyKind, "visible">, string> = {
  alt: "Image description (alt text)",
  "accessible-name": "Screen-reader name",
  metadata: "Search and sharing",
};

// Editorial Mode v0.3 (2026-11-09): full coverage. One entry per narrative tree
// (the stable ids from defineNarrative, e.g. "clients.hero.title.lead") that the
// two pages render, in page order, then the shared chrome. Every copy item of a
// registered tree is editable unless an `exclude` rule names it, with the reason;
// tests/editorial.test.mjs checks that every item is classified and the e2e
// coverage audit checks the page against this list. Ids are never renamed: an
// export keeps working across releases, and an id that disappears shows as a
// conflict ("no longer on the site"), never as a silent change.
export type EditorialSection = {
  prefix: string;
  page: SectionPage;
  pageLabel: string;
  label: string;
  // Names for array items ("cards" → "Card"), so "cards.2.body" reads "Card 3 · Text".
  items?: Record<string, string>;
  // Names for leaves that differ in this section ("title" → "Headline" in a hero).
  fields?: Record<string, string>;
  // Items that are not shown as text (see CopyKind), by id pattern below the prefix.
  hidden?: [RegExp, Exclude<CopyKind, "visible">][];
  // Items of the tree that are not page copy here, by id pattern below the prefix, with the reason.
  exclude?: [RegExp, string][];
};

const AGENCY = { page: "/agency", pageLabel: "Agency" } as const;
const COMMUNITY = { page: "/community", pageLabel: "Community" } as const;
const SHARED = { page: "shared", pageLabel: "Both pages" } as const;
const META: EditorialSection["hidden"] = [[/^(title|description|shareTitle|shareImageAlt)$/, "metadata"]];
const META_FIELDS = { title: "Page title (browser tab, search results)", description: "Description (search results, link previews)", shareTitle: "Share title (link previews)", shareImageAlt: "Share image description" };
const NOT_RENDERED = "In the narrative source but not rendered on this page.";

export const EDITORIAL_SECTIONS: EditorialSection[] = [
  // Agency, in page order.
  { prefix: "clients.nav", ...AGENCY, label: "Navigation", items: { items: "Menu item" }, fields: { cta: "Menu button" } },
  { prefix: "clients.hero", ...AGENCY, label: "Hero", items: { paths: "Button" }, fields: { title: "Headline", dek: "Introduction" } },
  { prefix: "clients.serviceGallery", ...AGENCY, label: "Services gallery", items: { cards: "Card" }, fields: { cta: "Section button" } },
  {
    prefix: "clients.reasons", ...AGENCY, label: "Why RaidGuild", items: { items: "Reason" }, fields: { "items.title": "Title", "items.body": "Expanded text" },
    exclude: [[/^items\.5\./, "Retired: Reason 6 was removed from the page (Tae's editorial batch 02, 2026-11-10); kept in the source so the other reasons keep their ids."]],
  },
  {
    prefix: "clients.previousWorks", ...AGENCY, label: "Previous works", items: { works: "Project" },
    fields: { name: "Name", description: "Description", snapshot: "Screenshot", cta: "Section button" },
    hidden: [[/\.snapshot\.alt$/, "alt"]],
  },
  { prefix: "shared.builders.clients", ...AGENCY, label: "Builders", fields: { link: "Section link" } },
  { prefix: "shared.people.clients", ...AGENCY, label: "People behind the work", fields: { roster: "Roster link" } },
  { prefix: "clients.faq", ...AGENCY, label: "FAQ", items: { items: "Question" }, fields: { "items.question": "Question", "items.answer": "Answer" } },
  {
    prefix: "clients.inquiry", ...AGENCY, label: "Project inquiry", items: { coordinates: "Coordinate" },
    fields: { summary: "Form", "summary.label": "Form name" },
    // The audience routes keep the form open: the summary's label names the form for screen readers only.
    hidden: [[/^summary\.label$/, "accessible-name"]],
    exclude: [[/^(summary\.(hint|hintOpen)|coordinates\.\d+|image\.alt)$/, `${NOT_RENDERED} The form is always open here (no summary, hints or coordinates) and the illustration is the profession gallery.`]],
  },
  { prefix: "clients.creed", ...AGENCY, label: "Creed", fields: { cta: "Creed button" } },
  { prefix: "clients.meta", ...AGENCY, label: "Search and sharing", fields: META_FIELDS, hidden: META },
  // Community, in page order.
  { prefix: "community.nav", ...COMMUNITY, label: "Navigation", items: { items: "Menu item" }, fields: { cta: "Menu button" } },
  { prefix: "community.hero", ...COMMUNITY, label: "Hero", items: { paths: "Button" }, fields: { title: "Headline", dek: "Introduction" } },
  {
    prefix: "community.guild", ...COMMUNITY, label: "About RaidGuild", items: { items: "Kit item", actions: "Button", links: "Link", metrics: "Statistic" },
    fields: { more: "See more", summary: "Button", text: "Expanded text", kit: "Guild kit", heading: "Heading", term: "Name", detail: "Detail", requirement: "Requirement" },
    exclude: [[/^metrics\./, `${NOT_RENDERED} /community shows the Guild module without its statistics (metrics={false}).`]],
  },
  { prefix: "community.capabilities", ...COMMUNITY, label: "Capabilities gallery", items: { cards: "Card" }, fields: { cta: "Section button" } },
  { prefix: "community.raidaFeature", ...COMMUNITY, label: "Queen Raida", fields: { cta: "Button", artwork: "Artwork" }, hidden: [[/^artwork\.alt$/, "alt"]] },
  { prefix: "community.moloch", ...COMMUNITY, label: "Moloch", fields: { cta: "Button", artwork: "Artwork" }, hidden: [[/^artwork\.alt$/, "alt"]] },
  {
    prefix: "community.hats", ...COMMUNITY, label: "Hats tree",
    fields: { stewards: "Stewards", term: "Name", detail: "Detail", snapshot: "Snapshot note", featuredLabel: "Featured label", treeLink: "Tree link" },
  },
  { prefix: "community.benefits", ...COMMUNITY, label: "Member benefits", items: { cards: "Card" } },
  { prefix: "shared.builders.community", ...COMMUNITY, label: "Builders", fields: { link: "Section link" } },
  { prefix: "community.activity.collection", ...COMMUNITY, label: "Projects and experiments", fields: { actions: "Buttons", portal: "Portal button", explore: "Project button" } },
  { prefix: "community.join", ...COMMUNITY, label: "Join", items: { actions: "Button", links: "Link" } },
  { prefix: "community.faq", ...COMMUNITY, label: "FAQ", items: { items: "Question" }, fields: { "items.question": "Question", "items.answer": "Answer" } },
  { prefix: "community.creed", ...COMMUNITY, label: "Creed", fields: { cta: "Creed button" } },
  { prefix: "community.meta", ...COMMUNITY, label: "Search and sharing", fields: META_FIELDS, hidden: META },
  // Both pages (lib/narrative/site.ts).
  { prefix: "site.header", ...SHARED, label: "Header", fields: { audiences: "Page switch", clients: "Agency", community: "Community" } },
  { prefix: "site.hero", ...SHARED, label: "Hero ornaments", fields: { index: "Corner index", label: "Label", number: "Number", scrollCue: "Scroll cue" } },
  { prefix: "site.ticker", ...SHARED, label: "Ticker", items: { words: "Word" }, fields: { label: "Ticker name" }, hidden: [[/^label$/, "accessible-name"]] },
  { prefix: "site.creed", ...SHARED, label: "Creed", fields: { statement: "Statement" } },
  { prefix: "site.footer", ...SHARED, label: "Footer", items: { socials: "Social link" }, fields: { motto: "Motto", copyright: "Copyright line" } },
];

export const sectionFor = (id: string) => EDITORIAL_SECTIONS.find((section) => id.startsWith(`${section.prefix}.`));
const restOf = (id: string, section: EditorialSection) => id.slice(section.prefix.length + 1);

// Why an item of a registered tree is not editable, or null when it is. A
// link's `destination` is a review note about where it leads, never shown as text.
export function exclusionReason(id: string): string | null {
  const section = sectionFor(id);
  if (!section) return "Not in a registered section.";
  if (/\.destination$/.test(id)) return "Review note about a link's destination; never shown on the page.";
  const rest = restOf(id, section);
  return section.exclude?.find(([pattern]) => pattern.test(rest))?.[1] ?? null;
}
export const isEditableId = (id: string) => Boolean(id) && sectionFor(id) !== undefined && exclusionReason(id) === null;

// "visible" (edited on the page) or a hidden kind (edited from the Changes panel).
export function kindOf(id: string): CopyKind {
  const section = sectionFor(id);
  if (!section) return "visible";
  const rest = restOf(id, section);
  return section.hidden?.find(([pattern]) => pattern.test(rest))?.[1] ?? "visible";
}

export { NOT_RENDERED };

// Inline formatting (November 10, rich text): which fields may carry
// **bold**, _italic_, ++underline++ and [links](https://…) (lib/narrative/inline.ts).
// Running prose only: texts, answers, introductions, descriptions, details.
// Labels, titles and their two display lines, questions, names, buttons, ticker
// words and every hidden text (alt text, screen-reader names, metadata) stay
// plain, so the type system, headings and controls cannot be restyled from copy.
// Links follow the same fields; none of them sits inside a link or button
// (checked on the rendered pages, tests/editorial-rich.test.mjs and the QA run).
const PROSE = /(?:^|\.)(body|answer|intro|description|detail|dek|text|requirement)$/;
export function formattingFor(id: string): { marks: boolean; links: boolean } {
  const prose = kindOf(id) === "visible" && PROSE.test(id) && isEditableId(id);
  return { marks: prose, links: prose };
}

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
  question: "Question",
  answer: "Answer",
  term: "Name",
  detail: "Detail",
  summary: "Button",
  text: "Text",
  heading: "Heading",
  value: "Value",
  name: "Name",
  description: "Description",
  alt: "Image description",
  image: "Image",
  artwork: "Artwork",
};
// Parents whose `lead` / `em` / `finale` children are lines of one text.
const MULTILINE = new Set(["title", "statement", "motto"]);
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
    if (LINE[part]) { if (MULTILINE.has(parts[i - 1])) out[out.length - 1] = `${out[out.length - 1]}, ${LINE[part]}`; continue; }
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

// Amounts in copy ("$20 a month"). Copy may state a price, but a changed price is
// a business decision, not an editorial one.
const PRICE = /[$€£]\s?\d[\d.,]*\s?(?:k|K|M)?|\b\d[\d.,]*\s?(?:USD|EUR|DAI|ETH|USDC)\b/g;
const pricesIn = (text: string) => (text.match(PRICE) ?? []).map((price) => price.replace(/\s/g, "")).join(" ");

// A decision that changes more than words needs its own approval (structural):
// - a removal of a whole item or section, a button, link or menu label
//   (navigation and calls to action), a heading or section label, or text that
//   serves accessibility or search (alt text, screen-reader names, metadata);
// - a rewrite that changes a stated price or amount.
// Applying a structural decision is always a separate, reviewed code change.
export function structuralReason(id: string, operation: Operation, scope: RemoveScope = "item", texts?: { base: string; proposed?: string }): string | null {
  if (operation === "REPLACE" || operation === "SHORTEN") {
    if (texts?.proposed !== undefined && pricesIn(texts.base) !== pricesIn(texts.proposed)) return "Changes a stated price or amount; prices are confirmed by the owner, not in an editorial pass.";
    return null;
  }
  if (operation !== "REMOVE") return null;
  if (scope === "section") return "Removes a whole section of the page.";
  if (scope === "component") return "Removes a whole item (card, button, row or link), not only its text.";
  const section = sectionFor(id);
  const rest = section ? restOf(id, section) : id;
  const kind = kindOf(id);
  if (kind === "alt" || kind === "accessible-name") return "Removes text that serves accessibility.";
  if (kind === "metadata") return "Removes the page's search or sharing text.";
  if (/(^|\.)(paths|actions|links|items|socials)\.\d+\.label$|(^|\.)(cta|link|roster|treeLink|allPosts|summary)(\.label)?$|^actions\.(portal|explore)$|^audiences\.\w+$/.test(rest)) {
    return section?.prefix.endsWith(".nav") || /^audiences\./.test(rest) ? "Removes a navigation label, which would leave an empty menu item." : "Removes the label of a button or link, which would leave an empty control.";
  }
  if (/(^|\.)title(\.(lead|em|finale))?$|(^|\.)(heading|question)$|^works\.\d+\.name$/.test(rest)) return "Removes (part of) a heading, which the page structure and screen readers rely on.";
  if (/^label$/.test(rest)) return "Removes the section label.";
  if (/(^|\.)(alt|ariaLabel)$/.test(rest)) return "Removes text that serves accessibility.";
  return null;
}
