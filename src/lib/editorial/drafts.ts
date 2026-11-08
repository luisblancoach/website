// Editorial drafts: the pure logic behind Editorial Mode (no React, no DOM, no
// storage). A draft is a proposal for one copy item, keyed by its stable id.
// Drafts never touch the narrative files: they live in the browser
// (localStorage) and leave it only as an export for review. Nothing here
// approves a change; every exported change has the status "proposed".
import { EDITORIAL_SECTIONS, fieldLabel, sectionFor, sectionTitle } from "./config";

export type Draft = {
  id: string;
  // The proposed text ("**strong**" segments allowed, as in the narrative copy).
  text: string;
  // The source text when the draft was made: if the source changes later, the
  // draft is in conflict until someone reviews it.
  base: string;
  comment?: string;
  updatedAt: string;
};

export type Drafts = Record<string, Draft>;

// The text of a source copy item, by id, for the editable sections.
export type Originals = ReadonlyMap<string, string>;

export const EXPORT_FORMAT = "raidguild-editorial-changes";
export const EXPORT_VERSION = 1;

export type ExportedChange = {
  id: string;
  page: string;
  section: string;
  field: string;
  original: string;
  proposed: string;
  comment: string;
  editedAt: string;
  // "source-changed": the site's copy is no longer the text the editor saw.
  // "unknown-id": the id is not an editable copy item any more.
  conflict: null | "source-changed" | "unknown-id";
};

export type ChangesExport = {
  format: typeof EXPORT_FORMAT;
  version: typeof EXPORT_VERSION;
  exportedAt: string;
  status: "proposed";
  note: string;
  changes: ExportedChange[];
};

// Text as typed into the page: single spaces (contentEditable inserts NBSPs),
// no line breaks, trimmed. The narrative copy uses neither NBSPs nor newlines.
export const normalizeText = (text: string) => text.replace(/[ \s]+/g, " ").trim();

export type Conflict = ExportedChange["conflict"];

export function conflictOf(draft: Draft, originals: Originals): Conflict {
  const source = originals.get(draft.id);
  if (source === undefined) return "unknown-id";
  return source === draft.base ? null : "source-changed";
}

// Saves `text` as the draft for `id`, or removes the draft when the text is
// the source text again. Returns a new object; `drafts` is not changed.
export function applyEdit(drafts: Drafts, id: string, text: string, source: string, now = new Date().toISOString()): Drafts {
  const proposed = normalizeText(text);
  const existing = drafts[id];
  const next = { ...drafts };
  if (proposed === source && !existing?.comment) { delete next[id]; return next; }
  // A draft keeps the base it was made against, so a changed source still shows as a conflict.
  next[id] = { id, text: proposed, base: existing?.base ?? source, comment: existing?.comment, updatedAt: now };
  return next;
}

export function setComment(drafts: Drafts, id: string, comment: string, source: string, now = new Date().toISOString()): Drafts {
  const existing = drafts[id];
  const next = { ...drafts };
  const clean = comment.trim() ? comment : undefined;
  if (!existing) {
    if (!clean) return drafts;
    // A comment on unchanged copy is still a proposal: "keep as is, because …".
    next[id] = { id, text: source, base: source, comment: clean, updatedAt: now };
    return next;
  }
  if (!clean && existing.text === existing.base) { delete next[id]; return next; }
  next[id] = { ...existing, comment: clean, updatedAt: now };
  return next;
}

export function revert(drafts: Drafts, id: string): Drafts {
  const next = { ...drafts };
  delete next[id];
  return next;
}

// After a conflict: keep the proposal, now measured against the current source.
export function rebase(drafts: Drafts, id: string, source: string, now = new Date().toISOString()): Drafts {
  const existing = drafts[id];
  if (!existing) return drafts;
  return { ...drafts, [id]: { ...existing, base: source, updatedAt: now } };
}

const order = new Map(EDITORIAL_SECTIONS.map((section, index) => [section.prefix, index]));
const naturalId = (id: string) => id.split(".").map((part) => (/^\d+$/.test(part) ? part.padStart(4, "0") : part)).join(".");

// Drafts in page order: by section (registry order), then by copy id.
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
  now?: string;
};

export function toExport(drafts: Drafts, originals: Originals, { context, order, now = new Date().toISOString() }: ExportOptions = {}): ChangesExport {
  return {
    format: EXPORT_FORMAT,
    version: EXPORT_VERSION,
    exportedAt: now,
    status: "proposed",
    note: "Editorial proposals from RaidGuild Editorial Mode. Not approved and not published: each change needs review before it is applied to the narrative files.",
    changes: sortedDrafts(drafts, order).map((draft) => {
      const section = sectionFor(draft.id);
      return {
        id: draft.id,
        page: section?.page ?? "",
        section: section ? sectionTitle(section) : "",
        field: fieldLabel(draft.id, context?.(draft.id)),
        original: draft.base,
        proposed: draft.text,
        comment: draft.comment ?? "",
        editedAt: draft.updatedAt,
        conflict: conflictOf(draft, originals),
      };
    }),
  };
}

const quote = (text: string) => (text ? text.split("\n").map((line) => `> ${line}`).join("\n") : "> (empty)");

// A review document for people: one heading per section, then each change
// with the original, the proposal and the comment.
export function toMarkdown(data: ChangesExport): string {
  const lines = [
    "# RaidGuild: editorial proposals",
    "",
    `Exported ${data.exportedAt} · ${data.changes.length} ${data.changes.length === 1 ? "change" : "changes"} · status: **proposed, not approved**`,
    "",
    "Each change below is a proposal. Approve or reject it before anything is applied to the site.",
  ];
  let current = "";
  for (const change of data.changes) {
    const heading = change.section || "Other";
    if (heading !== current) { lines.push("", `## ${heading}`); current = heading; }
    lines.push("", `### ${change.field}`, "");
    if (change.conflict === "source-changed") lines.push("**Conflict:** the site's copy changed after this edit; the original below is the text the editor saw.", "");
    if (change.conflict === "unknown-id") lines.push("**Conflict:** this copy is no longer on the site.", "");
    lines.push("Original:", "", quote(change.original), "");
    lines.push(change.proposed === change.original ? "Proposed: no change (comment only)." : "Proposed:", "");
    if (change.proposed !== change.original) lines.push(quote(change.proposed), "");
    if (change.comment) lines.push("Comment:", "", quote(change.comment), "");
    lines.push(`<sub>${change.id} · ${change.page} · edited ${change.editedAt}</sub>`);
  }
  if (data.changes.length === 0) lines.push("", "No changes.");
  return `${lines.join("\n")}\n`;
}

export type ImportResult = { drafts: Drafts; added: number; replaced: number; conflicts: number; skipped: number };

// Reads an export back. Imported changes replace drafts with the same id;
// conflicts are kept and shown, never resolved automatically.
export function fromExport(json: string, current: Drafts, originals: Originals): ImportResult {
  let data: unknown;
  try { data = JSON.parse(json); } catch { throw new Error("The file is not valid JSON."); }
  const record = data as Partial<ChangesExport> | null;
  if (!record || record.format !== EXPORT_FORMAT || !Array.isArray(record.changes)) throw new Error("This file is not a RaidGuild editorial export.");
  if (record.version !== EXPORT_VERSION) throw new Error(`Unsupported export version ${String(record.version)}.`);
  const next = { ...current };
  let added = 0, replaced = 0, conflicts = 0, skipped = 0;
  for (const change of record.changes as Partial<ExportedChange>[]) {
    if (typeof change?.id !== "string" || typeof change.proposed !== "string" || typeof change.original !== "string") { skipped++; continue; }
    const draft: Draft = {
      id: change.id,
      text: normalizeText(change.proposed),
      base: change.original,
      comment: typeof change.comment === "string" && change.comment.trim() ? change.comment : undefined,
      updatedAt: typeof change.editedAt === "string" ? change.editedAt : new Date().toISOString(),
    };
    if (next[draft.id]) replaced++; else added++;
    next[draft.id] = draft;
    if (conflictOf(draft, originals)) conflicts++;
  }
  return { drafts: next, added, replaced, conflicts, skipped };
}

// Drafts as stored in localStorage; anything malformed is dropped.
export function parseStored(raw: string | null): Drafts {
  if (!raw) return {};
  try {
    const data = JSON.parse(raw) as { version?: number; drafts?: Record<string, Partial<Draft>> };
    if (data?.version !== 1 || typeof data.drafts !== "object" || data.drafts === null) return {};
    const out: Drafts = {};
    for (const [id, draft] of Object.entries(data.drafts)) {
      if (typeof draft?.text === "string" && typeof draft.base === "string" && draft.id === id) {
        out[id] = { id, text: draft.text, base: draft.base, comment: typeof draft.comment === "string" ? draft.comment : undefined, updatedAt: typeof draft.updatedAt === "string" ? draft.updatedAt : "" };
      }
    }
    return out;
  } catch {
    return {};
  }
}

export const serializeStored = (drafts: Drafts) => JSON.stringify({ version: 1, drafts });
