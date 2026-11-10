// Editorial drafts: the pure logic behind Editorial Mode (no React, no DOM, no
// storage). A draft is one editorial decision about one copy item, keyed by its
// stable id. Drafts never touch the narrative files: they live in the browser
// (localStorage) and leave it only as an export for review. Nothing here
// approves a change; every exported change has the review status "proposed".
//
// Operations (v0.2):
//   REPLACE  new wording for the item, kept exactly as typed;
//   SHORTEN  a shorter version, kept exactly as typed;
//   REMOVE   take the item away (this text, the whole item or the whole
//            section): an explicit operation, never an empty string;
//   KEEP     reviewed, keep as is: no content change.
// Every operation is reversible: reverting a draft restores the published copy.
import { inlineProblems, plainText } from "../narrative/inline";
import { EDITORIAL_SECTIONS, KIND_LABEL, componentOf, fieldLabel, formattingFor, kindOf, removalTarget, sectionFor, structuralReason, OPERATION_LABEL, SCOPE_LABEL, type CopyKind, type Operation, type RemoveScope } from "./config";

export type { Operation, RemoveScope } from "./config";

export type Draft = {
  id: string;
  op: Operation;
  // REPLACE / SHORTEN: the proposed text ("**strong**" segments allowed, as in
  // the narrative copy). REMOVE / KEEP: the base text (no content change).
  text: string;
  // The source text when the draft was made: if the source changes later, the
  // draft is in conflict until someone reviews it.
  base: string;
  // REMOVE only.
  scope?: RemoveScope;
  comment?: string;
  updatedAt: string;
};

export type Drafts = Record<string, Draft>;

// The text of a source copy item, by id, for the editable sections.
export type Originals = ReadonlyMap<string, string>;

export const EXPORT_FORMAT = "raidguild-editorial-changes";
export const EXPORT_VERSION = 2;
export const OPERATIONS: readonly Operation[] = ["REPLACE", "SHORTEN", "REMOVE", "KEEP"];
const SCOPES: readonly RemoveScope[] = ["item", "component", "section"];

export type Conflict = null | "source-changed" | "unknown-id";

export type ExportedChange = {
  id: string;
  page: string;
  pageLabel: string;
  section: string;
  field: string;
  // v0.3: only for copy that is not shown as text (alt text, screen-reader
  // names, search and sharing metadata); absent for page text, so exports of
  // page text keep the v0.2 shape.
  kind?: Exclude<CopyKind, "visible">;
  operation: Operation;
  // REMOVE: what disappears ("item" = this text) and its id prefix.
  removeScope?: RemoveScope;
  removeTarget?: string;
  // The published text the decision was made against, and its SHA-256.
  base: string;
  baseFingerprint: string;
  // REPLACE / SHORTEN only: the exact proposed wording.
  proposed?: string;
  sourceRevision: string;
  reviewStatus: "proposed";
  // A structural decision (see config.ts `structuralReason`) needs separate approval.
  structural: null | { reason: string };
  comment: string;
  editedAt: string;
  // "source-changed": the site's copy is no longer the text the editor saw.
  // "unknown-id": the id is not an editable copy item any more.
  conflict: Conflict;
  // A SHORTEN whose proposal is not shorter than the base.
  warnings: string[];
};

export type ChangesExport = {
  format: typeof EXPORT_FORMAT;
  version: typeof EXPORT_VERSION;
  status: "proposed";
  note: string;
  // SHA-256 of the change list: the JSON and the Markdown of one export carry the same id.
  exportId: string;
  sourceRevision: string;
  lastEdited: string;
  summary: Record<Operation, number> & { structural: number; conflicts: number };
  changes: ExportedChange[];
};

// Text as typed into the page: single spaces (contentEditable inserts NBSPs),
// no line breaks, trimmed. The narrative copy uses neither NBSPs nor newlines.
export const normalizeText = (text: string) => text.replace(/[ \s]+/g, " ").trim();
// Lengths and comparisons count words, not formatting markers (lib/narrative/inline.ts).
const plainLength = (text: string) => plainText(text).length;

export async function fingerprint(text: string) {
  const bytes = new TextEncoder().encode(text);
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return `sha256:${[...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("")}`;
}

export function conflictOf(draft: Draft, originals: Originals): Conflict {
  const source = originals.get(draft.id);
  if (source === undefined) return "unknown-id";
  return source === draft.base ? null : "source-changed";
}

// The REMOVE draft that takes `id` away (its own, or a whole item or section around it).
export function removedBy(drafts: Drafts, id: string): Draft | undefined {
  for (const draft of Object.values(drafts)) {
    if (draft.op !== "REMOVE") continue;
    const target = removalTarget(draft.id, draft.scope ?? "item");
    if (target === id || id.startsWith(`${target}.`)) return draft;
  }
  return undefined;
}

export function warningsOf(draft: Draft): string[] {
  const warnings: string[] = [];
  if (draft.op === "SHORTEN" && plainLength(draft.text) >= plainLength(draft.base)) warnings.push("Marked as Shorten, but the proposal is not shorter than the current text.");
  // Formatting the field does not take, or an unsafe link (November 10, rich text).
  if ((draft.op === "REPLACE" || draft.op === "SHORTEN") && draft.text) warnings.push(...inlineProblems(draft.text, formattingFor(draft.id)));
  return warnings;
}

// Saves typed `text` for `id`. Rules:
// - an emptied text is a removal of this text (REMOVE, scope "item"), never an empty string;
// - the source text again: no change; the draft stays only as KEEP when it carries
//   a comment or was already KEEP, otherwise it is dropped;
// - other text: REPLACE, or SHORTEN when the editor had chosen Shorten.
// Returns a new object; `drafts` is not changed.
export function applyEdit(drafts: Drafts, id: string, text: string, source: string, now = new Date().toISOString()): Drafts {
  const proposed = normalizeText(text);
  const existing = drafts[id];
  const base = existing?.base ?? source;
  if (!proposed) return setOperation(drafts, id, "REMOVE", source, { scope: "item", now });
  const next = { ...drafts };
  if (proposed === base) {
    if (existing?.comment || existing?.op === "KEEP") next[id] = { id, op: "KEEP", text: base, base, comment: existing.comment, updatedAt: now };
    else delete next[id];
    return next;
  }
  // A draft keeps the base it was made against, so a changed source still shows as a conflict.
  next[id] = { id, op: existing?.op === "SHORTEN" ? "SHORTEN" : "REPLACE", text: proposed, base, comment: existing?.comment, updatedAt: now };
  return next;
}

// An explicit choice from the editor: Keep as is, Remove (this text, the whole
// item, the whole section), or Rewrite / Shorten for a text that was changed.
export function setOperation(drafts: Drafts, id: string, op: Operation, source: string, { scope = "item", now = new Date().toISOString() }: { scope?: RemoveScope; now?: string } = {}): Drafts {
  const existing = drafts[id];
  const base = existing?.base ?? source;
  const keep = { id, base, comment: existing?.comment, updatedAt: now };
  if (op === "KEEP") return { ...drafts, [id]: { ...keep, op, text: base } };
  if (op === "REMOVE") return { ...drafts, [id]: { ...keep, op, text: base, scope } };
  // Rewrite and Shorten need a changed text.
  if (!existing || existing.text === existing.base) return drafts;
  return { ...drafts, [id]: { ...existing, op, updatedAt: now } };
}

export function setComment(drafts: Drafts, id: string, comment: string, source: string, now = new Date().toISOString()): Drafts {
  const existing = drafts[id];
  const next = { ...drafts };
  const clean = comment.trim() ? comment : undefined;
  if (!existing) {
    if (!clean) return drafts;
    // A comment on unchanged copy is a review decision: "keep as is, because …".
    next[id] = { id, op: "KEEP", text: source, base: source, comment: clean, updatedAt: now };
    return next;
  }
  next[id] = { ...existing, comment: clean, updatedAt: now };
  return next;
}

// Undo any decision: the item shows the published copy again.
export function revert(drafts: Drafts, id: string): Drafts {
  const next = { ...drafts };
  delete next[id];
  return next;
}

// After a conflict: keep the proposal, now measured against the current source.
export function rebase(drafts: Drafts, id: string, source: string, now = new Date().toISOString()): Drafts {
  const existing = drafts[id];
  if (!existing) return drafts;
  const unchanged = existing.op === "KEEP" || existing.op === "REMOVE";
  return { ...drafts, [id]: { ...existing, base: source, ...(unchanged ? { text: source } : {}), updatedAt: now } };
}

const order = new Map(EDITORIAL_SECTIONS.map((section, index) => [section.prefix, index]));
const naturalId = (id: string) => id.split(".").map((part) => (/^\d+$/.test(part) ? part.padStart(4, "0") : part)).join(".");

// Drafts in page order: by section (registry order: Agency, then Community), then by copy id.
export function sortedDrafts(drafts: Drafts, sourceOrder?: ReadonlyMap<string, number>): Draft[] {
  return Object.values(drafts).sort((a, b) => {
    const sa = order.get(sectionFor(a.id)?.prefix ?? "") ?? 99;
    const sb = order.get(sectionFor(b.id)?.prefix ?? "") ?? 99;
    if (sa !== sb) return sa - sb;
    const oa = sourceOrder?.get(a.id);
    const ob = sourceOrder?.get(b.id);
    if (oa !== undefined && ob !== undefined) return oa - ob;
    return naturalId(a.id) < naturalId(b.id) ? -1 : 1;
  });
}

export type ExportOptions = {
  // Names array items in the field labels (catalog.ts `itemContext`).
  context?: (id: string) => ((itemPath: string) => string | undefined) | undefined;
  // Page order of the copy items (catalog.ts `sourceOrder`).
  order?: ReadonlyMap<string, number>;
  // The commit the site was built from (NEXT_PUBLIC_EDITORIAL_SOURCE_REVISION).
  revision?: string;
};

const NOTE = "Editorial decisions from RaidGuild Editorial Mode. Not approved and not published: each change needs review before it is applied to the narrative files. Structural decisions need separate approval.";

// Deterministic: the same drafts give the same files (no export timestamp; the
// change list is in page order and every value comes from the drafts).
export async function toExport(drafts: Drafts, originals: Originals, { context, order, revision = "unknown" }: ExportOptions = {}): Promise<ChangesExport> {
  const changes: ExportedChange[] = [];
  for (const draft of sortedDrafts(drafts, order)) {
    const section = sectionFor(draft.id);
    const scope = draft.op === "REMOVE" ? draft.scope ?? "item" : undefined;
    const reason = structuralReason(draft.id, draft.op, scope, { base: draft.base, proposed: draft.text });
    const kind = kindOf(draft.id);
    changes.push({
      id: draft.id,
      page: section?.page ?? "",
      pageLabel: section?.pageLabel ?? "",
      section: section?.label ?? "",
      field: fieldLabel(draft.id, context?.(draft.id)),
      ...(kind !== "visible" ? { kind } : {}),
      operation: draft.op,
      ...(scope ? { removeScope: scope, removeTarget: removalTarget(draft.id, scope) } : {}),
      base: draft.base,
      baseFingerprint: await fingerprint(draft.base),
      ...(draft.op === "REPLACE" || draft.op === "SHORTEN" ? { proposed: draft.text } : {}),
      sourceRevision: revision,
      reviewStatus: "proposed",
      structural: reason ? { reason } : null,
      comment: draft.comment ?? "",
      editedAt: draft.updatedAt,
      conflict: conflictOf(draft, originals),
      warnings: warningsOf(draft),
    });
  }
  const summary = { REPLACE: 0, SHORTEN: 0, REMOVE: 0, KEEP: 0, structural: 0, conflicts: 0 };
  for (const change of changes) { summary[change.operation]++; if (change.structural) summary.structural++; if (change.conflict) summary.conflicts++; }
  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    status: "proposed",
    note: NOTE,
    exportId: await fingerprint(JSON.stringify(changes)),
    sourceRevision: revision,
    lastEdited: changes.reduce((latest, change) => (change.editedAt > latest ? change.editedAt : latest), ""),
    summary,
    changes,
  };
}

export const EXPORT_FILES = { json: "raidguild-tae-editorial.json", markdown: "raidguild-tae-editorial.md" } as const;

const quote = (text: string) => (text ? text.split("\n").map((line) => `> ${line}`).join("\n") : "> (empty)");
const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

// The human review document: per page, per section, each decision with the
// current text, the proposal (or the removal), Tae's comment and the status.
export function toMarkdown(data: ChangesExport): string {
  const s = data.summary;
  const lines = [
    "# RaidGuild: Tae's editorial review",
    "",
    `${count(data.changes.length, "decision", "decisions")}: ${s.REPLACE} rewritten, ${s.SHORTEN} shortened, ${s.REMOVE} removed, ${s.KEEP} kept as is. Status: **proposed, not approved**.`,
    "",
    `Change set \`${data.exportId.slice(0, 19)}…\` (the same id is in ${EXPORT_FILES.json}) · site revision \`${data.sourceRevision.slice(0, 12)}\`${data.lastEdited ? ` · last edited ${data.lastEdited.slice(0, 16).replace("T", " ")} UTC` : ""}`,
    "",
    "Nothing here is published. Each decision is reviewed, then applied to the site's source with Claude, tested and deployed.",
  ];
  if (s.structural) lines.push("", `**${count(s.structural, "structural decision needs", "structural decisions need")} separate approval** (marked ⚠ below).`);
  if (s.conflicts) lines.push("", `**${count(s.conflicts, "decision was", "decisions were")} made against text that has changed since** (marked ⚡ below).`);
  let page = "", section = "";
  for (const change of data.changes) {
    if (change.pageLabel !== page) { lines.push("", `## ${change.pageLabel || "Other"}`); page = change.pageLabel; section = ""; }
    if (change.section !== section) { lines.push("", `### ${change.section || "Other"}`); section = change.section; }
    lines.push("", `#### ${change.structural ? "⚠ " : ""}${change.conflict ? "⚡ " : ""}${change.field}`, "");
    const operation = change.operation === "REMOVE" ? `Remove ${SCOPE_LABEL[change.removeScope ?? "item"]}` : OPERATION_LABEL[change.operation];
    lines.push(`- Page: ${change.pageLabel} (${change.page})`, `- Section: ${change.section}`, `- Field: ${change.field}`);
    if (change.kind) lines.push(`- Not shown as text: ${KIND_LABEL[change.kind]}`);
    lines.push(`- Operation: **${operation}** (${change.operation})`, `- Review status: ${change.structural ? "proposed, structural: needs separate approval" : "proposed"}`, "");
    if (change.structural) lines.push(`**Structural decision:** ${change.structural.reason}`, "");
    if (change.conflict === "source-changed") lines.push("**Conflict:** the site's text changed after this decision; the current text below is the one Tae saw.", "");
    if (change.conflict === "unknown-id") lines.push("**Conflict:** this text is no longer on the site.", "");
    for (const warning of change.warnings) lines.push(`**Check:** ${warning}`, "");
    lines.push("Current text:", "", quote(change.base), "");
    if (change.operation === "REPLACE" || change.operation === "SHORTEN") lines.push("Proposed text (exact wording):", "", quote(change.proposed ?? ""), "");
    if (change.operation === "REMOVE") lines.push(`Proposed: **remove ${SCOPE_LABEL[change.removeScope ?? "item"]}** from the page${change.removeScope && change.removeScope !== "item" ? ` (everything under \`${change.removeTarget}\`)` : ""}.`, "");
    if (change.operation === "KEEP") lines.push("Proposed: **keep as is** (reviewed, no change).", "");
    lines.push("Tae's comment:", "", change.comment ? quote(change.comment) : "> (none)", "");
    lines.push(`<sub>${change.id} · ${change.baseFingerprint.slice(0, 19)}… · edited ${change.editedAt}</sub>`);
  }
  if (data.changes.length === 0) lines.push("", "No decisions.");
  return `${lines.join("\n")}\n`;
}

export type ImportResult = { drafts: Drafts; added: number; replaced: number; conflicts: number; skipped: number };

type AnyChange = Partial<ExportedChange> & { original?: string };

// One change of an export (version 1 or 2) as a draft, or null when malformed.
export function draftFromChange(change: AnyChange, version: number): Draft | null {
  if (typeof change?.id !== "string") return null;
  const comment = typeof change.comment === "string" && change.comment.trim() ? change.comment : undefined;
  const updatedAt = typeof change.editedAt === "string" ? change.editedAt : "";
  if (version === 1) {
    // Version 1 had no operations: a different text is a rewrite, the same text a comment ("keep as is, because …").
    if (typeof change.proposed !== "string" || typeof change.original !== "string") return null;
    const text = normalizeText(change.proposed);
    if (!text) return { id: change.id, op: "REMOVE", text: change.original, base: change.original, scope: "item", comment, updatedAt };
    return text === change.original ? { id: change.id, op: "KEEP", text, base: change.original, comment, updatedAt } : { id: change.id, op: "REPLACE", text, base: change.original, comment, updatedAt };
  }
  if (typeof change.base !== "string" || !OPERATIONS.includes(change.operation as Operation)) return null;
  const op = change.operation as Operation;
  if (op === "REPLACE" || op === "SHORTEN") {
    if (typeof change.proposed !== "string" || !normalizeText(change.proposed) || change.proposed === change.base) return null;
    return { id: change.id, op, text: change.proposed, base: change.base, comment, updatedAt };
  }
  if (op === "REMOVE") {
    const scope = SCOPES.includes(change.removeScope as RemoveScope) ? (change.removeScope as RemoveScope) : null;
    return scope ? { id: change.id, op, text: change.base, base: change.base, scope, comment, updatedAt } : null;
  }
  return { id: change.id, op, text: change.base, base: change.base, comment, updatedAt };
}

// Reads an export back (version 1 or 2). Imported changes replace drafts with
// the same id; importing the same file twice gives the same drafts. Conflicts
// are kept and shown, never resolved automatically.
export function fromExport(json: string, current: Drafts, originals: Originals): ImportResult {
  let data: unknown;
  try { data = JSON.parse(json); } catch { throw new Error("The file is not valid JSON."); }
  const record = data as { format?: string; version?: number; changes?: unknown } | null;
  if (!record || record.format !== EXPORT_FORMAT || !Array.isArray(record.changes)) throw new Error("This file is not a RaidGuild editorial export.");
  if (record.version !== 1 && record.version !== 2) throw new Error(`Unsupported export version ${String(record.version)}.`);
  const next = { ...current };
  let added = 0, replaced = 0, conflicts = 0, skipped = 0;
  for (const change of record.changes as AnyChange[]) {
    const draft = draftFromChange(change, record.version);
    if (!draft) { skipped++; continue; }
    if (next[draft.id]) replaced++; else added++;
    next[draft.id] = draft;
    if (conflictOf(draft, originals)) conflicts++;
  }
  return { drafts: next, added, replaced, conflicts, skipped };
}

// Drafts as stored in localStorage (version 1 drafts are migrated); anything malformed is dropped.
export function parseStored(raw: string | null): Drafts {
  if (!raw) return {};
  try {
    const data = JSON.parse(raw) as { version?: number; drafts?: Record<string, Partial<Draft>> };
    if ((data?.version !== 1 && data?.version !== 2) || typeof data.drafts !== "object" || data.drafts === null) return {};
    const out: Drafts = {};
    for (const [id, stored] of Object.entries(data.drafts)) {
      if (typeof stored?.text !== "string" || typeof stored.base !== "string" || stored.id !== id) continue;
      const comment = typeof stored.comment === "string" ? stored.comment : undefined;
      const updatedAt = typeof stored.updatedAt === "string" ? stored.updatedAt : "";
      if (data.version === 1) {
        const draft = draftFromChange({ id, proposed: stored.text, original: stored.base, comment, editedAt: updatedAt }, 1);
        if (draft) out[id] = draft;
        continue;
      }
      if (!OPERATIONS.includes(stored.op as Operation)) continue;
      const op = stored.op as Operation;
      if (op === "REMOVE" && !SCOPES.includes(stored.scope as RemoveScope)) continue;
      out[id] = { id, op, text: stored.text, base: stored.base, ...(op === "REMOVE" ? { scope: stored.scope } : {}), comment, updatedAt };
    }
    return out;
  } catch {
    return {};
  }
}

export const serializeStored = (drafts: Drafts) => JSON.stringify({ version: 2, drafts });

export { componentOf, removalTarget, structuralReason };
