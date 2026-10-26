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
export type CopySource = "tae-brief" | "existing-site" | "handbook" | "portal" | "draft";

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
  collection: { label: Copy; title: Title };
};

export type JoinContent = {
  label: Copy;
  title: Title;
  body: Copy;
  actions: Action[];
  links: NarrativeLink[];
};

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
