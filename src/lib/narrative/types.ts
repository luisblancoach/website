// Narrative copy is data. Every string that reaches a page carries its review
// status so unresolved claims stay visible until someone confirms them.
//
// approved      Tae's approved brief verbatim, or copy already published on the
//               site and reused in the same meaning.
// needs-review  Anything else. `reason` says why:
//               claim   states a fact (ownership, governance, membership,
//                       process, metrics, destinations) that needs confirmation;
//               wording new narrative copy that only needs editorial approval.

export type ReviewStatus = "approved" | "needs-review";
export type ReviewReason = "claim" | "wording";
// "oct23-iteration": copy written in the October 23 visual iteration (40f3910),
// never published and not in Tae's brief, so it always needs review.
export type CopySource = "tae-brief" | "existing-site" | "handbook" | "portal" | "oct23-iteration" | "draft";

export type Copy = {
  id: string;
  text: string;
  status: ReviewStatus;
  source: CopySource;
  reason?: ReviewReason;
  note?: string;
  sourceUrl?: string;
};

type CopyInput = Omit<Copy, "id">;

export const approved = (text: string, source: Extract<CopySource, "tae-brief" | "existing-site">, sourceUrl?: string): Copy =>
  ({ id: "", text, status: "approved", source, sourceUrl });

export const claim = (text: string, source: CopySource, note: string, sourceUrl?: string): Copy =>
  ({ id: "", text, status: "needs-review", reason: "claim", source, note, sourceUrl });

export const wording = (text: string, note = "New narrative copy; needs editorial approval."): Copy =>
  ({ id: "", text, status: "needs-review", reason: "wording", source: "draft", note });

// Copy carried over from the October 23 iteration: editorial review by default.
export const oct23 = (text: string, note = "October 23 iteration copy (40f3910); needs editorial approval."): Copy =>
  ({ id: "", text, status: "needs-review", reason: "wording", source: "oct23-iteration", note });

// A link whose label is copy. `section` targets an in-page section (routed
// across audiences when needed); `destination` records a claim about where an
// external link leads, flagged until confirmed.
export type NarrativeLink = {
  label: Copy;
  href?: string;
  section?: import("@/lib/venture-routes").SectionId;
  destination?: Copy;
};

export type HeroContent = {
  eyebrow: Copy;
  title: { lead: Copy; em: Copy; long?: boolean };
  dek: Copy;
  paths: (NarrativeLink & { variant: "filled" | "outline"; icon: "↓" | "↗"; primary?: boolean })[];
};

export type GuildContent = {
  label: Copy;
  title: { lead: Copy; em: Copy };
  body: Copy;
  more: { summary: Copy; text: Copy };
  kit: { heading: Copy; items: { term: Copy; detail: Copy }[]; requirement: Copy };
  actions: (NarrativeLink & { variant: "filled" | "outline"; icon: "logo" | "discord" })[];
  links: NarrativeLink[];
  metricsLabel: string;
  metrics: { value: Copy; label: Copy }[];
};

type Title = { lead: Copy; em: Copy };
type Action = NarrativeLink & { variant: "filled" | "outline"; icon: "logo" | "discord" };

export type TensionContent = {
  label: Copy;
  title: Title;
  sides: { heading: Copy; points: Copy[]; owned?: boolean }[];
};

export type PathContent = {
  label: Copy;
  title: Title;
  framing: Copy;
  steps: { title: Copy; body: Copy }[];
  footnote: NarrativeLink;
};

export type ActivityContent = {
  label: Copy;
  title: Title;
  intro: Copy;
  postsHeading: Copy;
  postsUnavailable: Copy;
  allPosts: NarrativeLink;
  collection: { label: Copy; title: Title; intro?: Copy };
};

export type JoinContent = {
  label: Copy;
  title: Title;
  body: Copy;
  actions: Action[];
  links: NarrativeLink[];
};

export type CapabilitiesContent = {
  label: Copy;
  title: Title;
  intro: Copy;
  // Published services in their published order (the October 23 accordion).
  services: { title: Copy; body: Copy }[];
  // Tae's pillars group those services by title. Not rendered yet: the
  // editorial batch decides how they appear on the page.
  pillars: { title: Copy; body: Copy; services: string[] }[];
  practices: { tag: Copy; title: Copy; body: Copy; link: NarrativeLink; image: { src: string; alt: Copy } }[];
  practicesLabel: Copy;
  inquiry: NarrativeLink;
  footnote: { lead: Copy; link: NarrativeLink };
};

// Case studies come only from the existing project archive (lib/data/clients.ts).
// No screenshots are approved yet, so `images` stays empty rather than
// carrying placeholders.
export type PreviousWorksContent = {
  title: Title;
  intro: Copy;
  works: { id: string; logo: string; company: Copy; title: Copy; description: Copy; tags: Copy[]; images: { src: string; alt: Copy }[] }[];
  detailsLabel: Copy;
  cta: NarrativeLink;
};

export type InquiryContent = {
  label: Copy;
  title: Title;
  body: Copy;
  summary: { label: Copy; hint: Copy; hintOpen: Copy };
  coordinates: [Copy, Copy];
  image: { alt: Copy };
};

// October 23 Queen Raida carousel (kept as-is in B3.3).
export type QueenRaidaContent = {
  title: Title;
  cta: NarrativeLink;
  intro: Copy;
  panels: { subtitle: Copy; title: Copy; copy: Copy; detail: Copy }[];
  detailsLabel: Copy;
  artwork: { src: string; alt: Copy; caption: Copy; rights: Copy };
};

export type StewardshipContent = {
  label: Copy;
  title: Title;
  intro: Copy;
  roster: NarrativeLink;
  hats?: { summary: Copy; body: Copy; link: NarrativeLink };
  agents?: { summary: Copy; body: Copy; link: NarrativeLink };
};

export type BuilderNetworkContent = {
  title: Title;
  intro: Copy;
  link: NarrativeLink;
};

export type NavContent = { items: (NarrativeLink & { section: import("@/lib/venture-routes").SectionId })[]; cta: NarrativeLink };

export type CreedContent = { cta: NarrativeLink };

const isCopy = (value: unknown): value is CopyInput & { id: string } =>
  typeof value === "object" && value !== null && "text" in value && "status" in value && "source" in value;

// Assigns stable ids ("community.hero.title") to every copy leaf.
export function defineNarrative<T>(prefix: string, tree: T): T {
  const walk = (node: unknown, path: string): void => {
    if (isCopy(node)) { node.id = path; return; }
    if (Array.isArray(node)) node.forEach((child, index) => walk(child, `${path}.${index}`));
    else if (typeof node === "object" && node !== null) Object.entries(node).forEach(([key, child]) => walk(child, `${path}.${key}`));
  };
  walk(tree, prefix);
  return tree;
}

export function collectCopy(tree: unknown): Copy[] {
  const found: Copy[] = [];
  const walk = (node: unknown): void => {
    if (isCopy(node)) found.push(node);
    else if (Array.isArray(node)) node.forEach(walk);
    else if (typeof node === "object" && node !== null) Object.values(node).forEach(walk);
  };
  walk(tree);
  return found;
}

// Flags show in development and on preview deployments (Vercel previews and the
// Railway review service). SHOW_REVIEW_FLAGS=true|false overrides detection.
export function reviewFlagsEnabled(env: Record<string, string | undefined> = process.env) {
  if (env.SHOW_REVIEW_FLAGS === "true") return true;
  if (env.SHOW_REVIEW_FLAGS === "false") return false;
  if (env.NODE_ENV !== "production") return true;
  return env.VERCEL_ENV === "preview" || Boolean(env.RAILWAY_ENVIRONMENT_NAME);
}
