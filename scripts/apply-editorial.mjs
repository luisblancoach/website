#!/usr/bin/env bun
// Editorial change set → controlled source patch (Editorial Mode v0.2).
//
//   bun scripts/apply-editorial.mjs <raidguild-tae-editorial.json>            dry run (default)
//   bun scripts/apply-editorial.mjs <file> --report <out.json>               dry run, plus a machine report
//   bun scripts/apply-editorial.mjs <file> --apply --confirm <change-set-id>  write the source (after approval)
//   bun scripts/apply-editorial.mjs --map [--report <out.json>]              source of every editable copy id (v0.3)
//
// Workflow: editorial export → validation → dry run → review → source changes →
// tests → commit → deployment. This tool covers validation, the dry run and,
// only with --apply and the change set id, the source change. It never
// approves anything, never infers or rewrites wording, never commits, and has
// no network code: it cannot reach the deployed Worker.
//
// What it does with each decision:
//   REPLACE / SHORTEN  the exact proposed text replaces the one string literal
//                      in the narrative source that holds the published text;
//   REMOVE             never applied automatically: removing copy changes the
//                      page's structure (components, types), so it is reported
//                      with its source location for a reviewed code change;
//                      structural removals are flagged for separate approval;
//   KEEP               recorded in the report, no change.
//   any decision that changes a stated price, or removes navigation, a call to
//   action, a heading or accessibility text, is structural: reported, never applied.
// Source mapping (v0.3): an id's text is found as a string literal in the
// narrative and data source. When the same text is in several literals, or one
// literal feeds several copy items (a shared constant, a helper called twice),
// each candidate is probed on a scratch copy of the source to learn exactly
// which ids it produces. A literal that feeds several items is applied only
// when the change set gives all of them the same new text; otherwise the
// decision is blocked with the list of items that share it.
// Refuses to write when anything is invalid, stale, ambiguous or in conflict.
// Every patch is first rehearsed on a throwaway copy of the source and verified:
// the planned copy items must read exactly the proposed text and every other
// copy item on the site must be unchanged.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const SELF = new URL(import.meta.url).pathname;
const FORMAT = "raidguild-editorial-changes";
const OPERATIONS = ["REPLACE", "SHORTEN", "REMOVE", "KEEP"];
const SCOPES = ["item", "component", "section"];
const SOURCE_DIRS = ["src/lib/narrative", "src/lib/data"];
const sha256 = (text) => `sha256:${createHash("sha256").update(text, "utf8").digest("hex")}`;


// --- internal: print every copy item of a source tree (run in a separate process per tree) ---
if (process.argv[2] === "--dump-copy") {
  const root = resolve(process.argv[3]);
  const { collectCopy } = await import(join(root, "src/lib/narrative/types.ts"));
  const out = {};
  for (const file of readdirSync(join(root, "src/lib/narrative")).filter((name) => name.endsWith(".ts")).sort()) {
    const exported = await import(join(root, "src/lib/narrative", file));
    for (const value of Object.values(exported)) for (const copy of collectCopy(value)) if (copy.id) out[copy.id] = copy.text;
  }
  process.stdout.write(JSON.stringify(out));
  process.exit(0);
}

// --- arguments ---
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const option = (name) => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
const file = args.find((arg, index) => !arg.startsWith("--") && !["--confirm", "--root", "--report"].includes(args[index - 1]));
const MAP = flag("--map");
if ((!file && !MAP) || flag("--help")) {
  console.log("usage: bun scripts/apply-editorial.mjs <change-set.json> [--dry-run] [--report out.json] [--apply --confirm <change-set-id>] [--root <repo>] [--allow-dirty]\n       bun scripts/apply-editorial.mjs --map [--report out.json] [--root <repo>]");
  process.exit(file || MAP ? 0 : 1);
}
const APPLY = flag("--apply");
const ROOT = resolve(option("--root") ?? process.cwd());
// Inline formatting (November 10): the one parser the site renders with; lengths
// count words, not formatting markers.
const inline = await import(join(ROOT, "src/lib/narrative/inline.ts"));
const plainLength = (text) => inline.plainText(text).length;
const fail = (message) => { console.error(`apply-editorial: ${message}`); process.exit(1); };

// --- source probing (shared by the dry run and --map) ---
const dump = (root) => JSON.parse(execFileSync(process.execPath, [SELF, "--dump-copy", root], { cwd: root, stdio: ["ignore", "pipe", "pipe"] }).toString());
const scratch = () => {
  const temp = mkdtempSync(join(tmpdir(), "raidguild-editorial-"));
  cpSync(join(ROOT, "src"), join(temp, "src"), { recursive: true });
  for (const name of ["tsconfig.json", "package.json"]) cpSync(join(ROOT, name), join(temp, name));
  symlinkSync(join(ROOT, "node_modules"), join(temp, "node_modules"));
  return temp;
};
let probeRoot = null;
const probes = new Map();
const SENTINEL = "\u2063editorial-probe\u2063";
// The copy ids a literal produces: replace it with a sentinel on the scratch copy and dump.
const probe = (literal) => {
  const key = `${literal.path}:${literal.start}`;
  if (probes.has(key)) return probes.get(key);
  probeRoot ??= scratch();
  const original = readFileSync(join(ROOT, literal.path), "utf8");
  writeFileSync(join(probeRoot, literal.path), original.slice(0, literal.start) + JSON.stringify(SENTINEL) + original.slice(literal.end));
  // exact: items whose whole text is this literal; derived: items assembled from it ("<name> website homepage").
  let ids = null;
  try {
    const entries = Object.entries(dump(probeRoot));
    ids = { exact: entries.filter(([, text]) => text === SENTINEL).map(([id]) => id).sort(), derived: entries.filter(([, text]) => text !== SENTINEL && text.includes(SENTINEL)).map(([id]) => id).sort() };
  } catch { ids = null; }
  finally { writeFileSync(join(probeRoot, literal.path), original); }
  probes.set(key, ids);
  return ids;
};
process.on("exit", () => { if (probeRoot) rmSync(probeRoot, { recursive: true, force: true }); });

// --- 1. validate the file ---
let data;
if (MAP) data = { format: FORMAT, version: 2, changes: [] };
else try { data = JSON.parse(readFileSync(file, "utf8")); } catch (error) { fail(`cannot read ${file}: ${error.message}`); }
if (data?.format !== FORMAT || !Array.isArray(data.changes)) fail("not a RaidGuild editorial change set");
if (data.version !== 1 && data.version !== 2) fail(`unsupported version ${data.version}`);
const errors = [];
const notes = [];
let changes = data.changes;
if (data.version === 1) {
  // Version 1 had no operations or fingerprints: same text = KEEP, other text = REPLACE.
  notes.push("Version 1 file: operations inferred (same text = KEEP, other text = REPLACE); no fingerprints to check.");
  changes = changes.map((change) => ({ id: change.id, operation: typeof change.proposed === "string" && change.proposed === change.original ? "KEEP" : "REPLACE", base: change.original, proposed: change.proposed === change.original ? undefined : change.proposed, comment: change.comment ?? "", reviewStatus: "proposed" }));
} else {
  // The change set id is the SHA-256 of the change list: an edited file no longer matches.
  if (!MAP && data.exportId !== sha256(JSON.stringify(data.changes))) errors.push("The change list does not match its change set id: the file was edited after export. Export it again from the editor.");
}
const seen = new Set();
changes.forEach((change, index) => {
  const where = `change ${index + 1}${typeof change?.id === "string" ? ` (${change.id})` : ""}`;
  if (typeof change?.id !== "string" || !change.id) { errors.push(`${where}: no copy id`); return; }
  if (seen.has(change.id)) errors.push(`${where}: duplicate copy id`);
  seen.add(change.id);
  if (!OPERATIONS.includes(change.operation)) errors.push(`${where}: unknown operation ${JSON.stringify(change.operation)}`);
  if (typeof change.base !== "string") errors.push(`${where}: no base text`);
  if (data.version === 2 && typeof change.base === "string" && change.baseFingerprint !== sha256(change.base)) errors.push(`${where}: the base text does not match its fingerprint`);
  if (change.reviewStatus !== undefined && change.reviewStatus !== "proposed") errors.push(`${where}: review status ${JSON.stringify(change.reviewStatus)}; an export only carries proposals`);
  if (change.operation === "REPLACE" || change.operation === "SHORTEN") {
    if (typeof change.proposed !== "string" || !change.proposed.trim()) errors.push(`${where}: ${change.operation} without proposed text (a removal must be REMOVE, never an empty text)`);
    else if (change.proposed === change.base) errors.push(`${where}: ${change.operation} with the same text as the base (use KEEP)`);
    else if (/[\n\r]/.test(change.proposed)) errors.push(`${where}: proposed text contains a line break`);
    if (change.operation === "SHORTEN" && typeof change.proposed === "string" && typeof change.base === "string" && plainLength(change.proposed) >= plainLength(change.base)) errors.push(`${where}: SHORTEN, but the proposal is not shorter than the base`);
  } else if (change.proposed !== undefined) errors.push(`${where}: ${change.operation} must not carry proposed text`);
  if (change.operation === "REMOVE" && !SCOPES.includes(change.removeScope ?? (data.version === 1 ? "item" : undefined))) errors.push(`${where}: REMOVE without a valid scope`);
});

// --- 2–4. resolve ids against the current source, compare texts and fingerprints ---
const { originals } = await import(join(ROOT, "src/lib/editorial/catalog.ts"));
const config = await import(join(ROOT, "src/lib/editorial/config.ts"));
const git = (...command) => { try { return execFileSync("git", ["-C", ROOT, ...command], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch { return null; } };
const head = git("rev-parse", "HEAD");
if (data.sourceRevision && head && !data.sourceRevision.startsWith(head) && !head.startsWith(data.sourceRevision.replace(/\+changes$/, ""))) {
  notes.push(`The change set was made on the site built from ${data.sourceRevision.slice(0, 12)}; the source here is ${head.slice(0, 12)}. Fingerprints decide what is stale.`);
}

// Every string literal of the narrative and data source, with its position.
const ts = (await import(join(ROOT, "node_modules/typescript/lib/typescript.js"))).default;
const literals = [];
for (const dir of SOURCE_DIRS) {
  for (const name of readdirSync(join(ROOT, dir)).filter((entry) => /\.tsx?$/.test(entry)).sort()) {
    const path = join(dir, name);
    const text = readFileSync(join(ROOT, path), "utf8");
    const source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
    const visit = (node) => {
      if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        const start = node.getStart(source);
        literals.push({ path, start, end: node.end, value: node.text, line: source.getLineAndCharacterOfPosition(start).line + 1, raw: text.slice(start, node.end) });
      }
      ts.forEachChild(node, visit);
    };
    visit(source);
  }
}
const encode = (raw, value) => {
  const quote = raw[0];
  let body = value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n");
  body = body.split(quote).join(`\\${quote}`);
  if (quote === "`") body = body.replace(/\$\{/g, "\\${");
  return `${quote}${body}${quote}`;
};

// Where an id's current text lives in the source. Returns the literal and, when
// that literal feeds other copy items too, their ids (`sharedWith`).
const before = dump(ROOT);
// Every candidate is probed, even a single one: the literal must really produce this item.
const resolveSource = (id, text) => {
  const found = literals.filter((literal) => literal.value === text);
  const locations = found.map((literal) => `${literal.path}:${literal.line}`);
  if (!found.length) return { locations, problem: "the text is not a single string literal in the source (it is assembled in code, e.g. from a name)" };
  const feeding = found.map((literal) => ({ literal, ids: probe(literal) })).filter((entry) => entry.ids?.exact.includes(id));
  if (feeding.length !== 1) return { locations, problem: `the text appears ${found.length} times in the source (${locations.join(", ")}) and no single literal produces this item` };
  const [{ literal, ids }] = feeding;
  return { literal, locations: [`${literal.path}:${literal.line}`], sharedWith: ids.exact.filter((other) => other !== id), derived: ids.derived };
};

// --map: the source of every editable copy id (no change set).
if (MAP) {
  const { originals: all } = await import(join(ROOT, "src/lib/editorial/catalog.ts"));
  const rows = [...all].map(([id, text]) => {
    const source = resolveSource(id, text);
    return { id, kind: config.kindOf(id), page: config.sectionFor(id)?.page, source: source.literal ? `${source.literal.path}:${source.literal.line}` : null, sharedWith: source.sharedWith ?? [], derived: source.derived ?? [], problem: source.problem ?? null };
  });
  const unique = rows.filter((row) => row.source && !row.sharedWith.length).length;
  const shared = rows.filter((row) => row.source && row.sharedWith.length);
  const assembled = rows.filter((row) => !row.source);
  for (const row of rows) console.log(`${row.source ? (row.sharedWith.length ? "≡" : "✓") : "!"} ${row.id}  ${row.source ?? row.problem}${row.sharedWith.length ? `  (shared with ${row.sharedWith.join(", ")})` : ""}${row.derived.length ? `  (also feeds ${row.derived.join(", ")})` : ""}`);
  console.log(`\nSource map: ${rows.length} editable ids · ${unique} in their own literal · ${shared.length} in a literal shared with other items · ${assembled.length} assembled in code (integrate by hand)`);
  if (option("--report")) writeFileSync(option("--report"), `${JSON.stringify({ format: "raidguild-editorial-source-map", version: 1, sourceRevision: head, rows }, null, 2)}\n`);
  process.exit(0);
}

const results = changes.filter((change) => typeof change?.id === "string" && OPERATIONS.includes(change.operation)).map((change) => {
  const current = originals.get(change.id);
  const result = { id: change.id, operation: change.operation, field: change.field ?? config.fieldLabel(change.id), page: change.pageLabel ?? config.sectionFor(change.id)?.pageLabel ?? "", section: change.section ?? config.sectionFor(change.id)?.label ?? "", base: change.base, proposed: change.proposed, comment: change.comment ?? "", status: "ok", problems: [] };
  if (current === undefined) { const why = config.sectionFor(change.id) ? config.exclusionReason(change.id) : null; result.status = "conflict"; result.problems.push(why && /^Retired/.test(why) ? `retired: ${why}` : "unknown copy id: not an editable item in the current source"); return result; }
  result.current = current;
  if (current !== change.base) { result.status = "conflict"; result.problems.push("source changed: the site's text is no longer the text this decision was made against"); }
  if (change.operation === "REMOVE") {
    const scope = change.removeScope ?? "item";
    result.removeScope = scope;
    result.removeTarget = config.removalTarget(change.id, scope);
    result.structural = config.structuralReason(change.id, "REMOVE", scope);
  }
  if (change.operation === "REPLACE" || change.operation === "SHORTEN") {
    const reason = config.structuralReason(change.id, change.operation, "item", { base: change.base, proposed: change.proposed });
    if (reason) { result.structural = reason; if (result.status === "ok") { result.status = "blocked"; result.problems.push(`structural: ${reason} Not applied by this tool.`); } }
    // Formatting the field does not take, or an unsafe link: never written to the source.
    const formatting = typeof change.proposed === "string" ? inline.inlineProblems(change.proposed, config.formattingFor(change.id)) : [];
    if (formatting.length && result.status === "ok") { result.status = "blocked"; result.problems.push(...formatting.map((problem) => `formatting: ${problem}`)); }
  }
  if (change.operation !== "KEEP") {
    const source = resolveSource(change.id, current);
    result.locations = source.locations;
    result.sharedWith = source.sharedWith;
    result.derived = source.derived;
    if (change.operation === "REPLACE" || change.operation === "SHORTEN") {
      if (source.literal) result.literal = source.literal;
      else if (result.status === "ok") { result.status = "blocked"; result.problems.push(`${source.problem}; edit it by hand`); }
    }
  }
  return result;
});

// --- 5. rehearse the text changes on a copy and verify every copy item ---
const textChanges = results.filter((result) => (result.operation === "REPLACE" || result.operation === "SHORTEN") && result.status === "ok");
// A literal shared by several items changes all of them: allowed only when the
// change set gives every one of them the same new text (then it is one edit).
const byId = new Map(results.map((result) => [result.id, result]));
const byLiteral = new Map();
for (const result of textChanges) {
  if (result.sharedWith?.length) {
    const others = result.sharedWith.map((id) => byId.get(id));
    if (others.some((other) => !other || other.proposed !== result.proposed || !["REPLACE", "SHORTEN"].includes(other.operation))) {
      result.status = "blocked";
      result.problems.push(`its source text is shared with ${result.sharedWith.join(", ")}: one edit changes all of them. Propose the same text for all, or split the source first (a code change)`);
      continue;
    }
  }
  const key = `${result.literal.path}:${result.literal.start}`;
  if (!byLiteral.has(key)) byLiteral.set(key, result);
  else if (byLiteral.get(key).proposed !== result.proposed) { result.status = "blocked"; result.problems.push(`shares its source text with ${byLiteral.get(key).id}`); byLiteral.get(key).status = "blocked"; }
}
const planned = textChanges.filter((result) => result.status === "ok");
const edits = [...byLiteral.values()].filter((result) => result.status === "ok");
const patch = (base) => {
  const files = new Map();
  for (const result of edits) {
    const { path, start, end, raw } = result.literal;
    const entry = files.get(path) ?? { text: readFileSync(join(base, path), "utf8"), edits: [] };
    entry.edits.push({ start, end, replacement: encode(raw, result.proposed) });
    files.set(path, entry);
  }
  const out = new Map();
  for (const [path, { text, edits }] of files) {
    let next = text;
    for (const edit of edits.sort((a, b) => b.start - a.start)) next = next.slice(0, edit.start) + edit.replacement + next.slice(edit.end);
    out.set(path, next);
  }
  return out;
};
const verify = (before, after) => {
  const expected = new Map(planned.map((result) => [result.id, result.proposed]));
  // Items assembled from a changed literal follow it ("<name> website homepage").
  for (const result of planned) for (const id of result.derived ?? []) if (!expected.has(id)) expected.set(id, before[id].split(result.current).join(result.proposed));
  const problems = [];
  for (const id of new Set([...Object.keys(before), ...Object.keys(after)])) {
    const want = expected.has(id) ? expected.get(id) : before[id];
    if (after[id] !== want) problems.push(`${id}: expected ${JSON.stringify(want)}, got ${JSON.stringify(after[id])}`);
  }
  return problems;
};
let diff = "";
let verification = [];
if (planned.length) {
  const temp = scratch();
  try {
    const files = patch(ROOT);
    for (const [path, text] of files) writeFileSync(join(temp, path), text);
    verification = verify(before, dump(temp));
    for (const path of files.keys()) {
      try { execFileSync("git", ["diff", "--no-index", "--no-color", "-U1", join(ROOT, path), join(temp, path)], { stdio: ["ignore", "pipe", "ignore"] }); }
      catch (error) { diff += error.stdout.toString().split(ROOT).join("").split(temp).join(""); }
    }
  } finally {
    rmSync(temp, { recursive: true, force: true });
  }
}

// --- 6. report ---
const conflicts = results.filter((result) => result.status === "conflict");
const blocked = results.filter((result) => result.status === "blocked");
const structural = results.filter((result) => result.structural);
const label = { REPLACE: "Rewrite", SHORTEN: "Shorten", REMOVE: "Remove", KEEP: "Keep as is" };
const lines = [];
lines.push(`Change set ${data.exportId ? `${data.exportId.slice(7, 19)}…` : "(version 1, no id)"} · ${results.length} decisions · source ${head ? head.slice(0, 12) : ROOT}${APPLY ? "" : " · DRY RUN (nothing is written)"}`);
for (const note of notes) lines.push(`note: ${note}`);
for (const error of errors) lines.push(`INVALID: ${error}`);
let page = "";
for (const result of results) {
  if (result.page !== page) { lines.push("", `== ${result.page || "Unknown page"}`); page = result.page; }
  // ✓ text change ready · ○ recorded or left for a reviewed code change · ⚠ structural · ✗ conflict · ! blocked
  const mark = result.status === "conflict" ? "✗" : result.status === "blocked" ? "!" : result.structural ? "⚠" : result.operation === "REPLACE" || result.operation === "SHORTEN" ? "✓" : "○";
  lines.push(`${mark} ${result.section} · ${result.field} · ${label[result.operation]}${result.removeScope ? ` (${result.removeScope})` : ""}   [${result.id}]`);
  if (result.operation === "REPLACE" || result.operation === "SHORTEN") lines.push(`    current:  ${JSON.stringify(result.current ?? result.base)}`, `    proposed: ${JSON.stringify(result.proposed)}`);
  else lines.push(`    text:     ${JSON.stringify(result.current ?? result.base)}`);
  if (result.status === "conflict" && result.current !== undefined && result.current !== result.base) lines.push(`    made against: ${JSON.stringify(result.base)}`);
  if (result.literal && result.status === "ok") lines.push(`    source:   ${result.literal.path}:${result.literal.line}${result.sharedWith?.length ? ` (one text for ${[result.id, ...result.sharedWith].join(", ")})` : ""}`);
  if (result.derived?.length && result.status === "ok") lines.push(`    also updates (assembled from this text): ${result.derived.join(", ")}`);
  if (result.operation === "REMOVE") {
    lines.push(result.structural ? `    STRUCTURAL: ${result.structural} Needs separate approval; not applied.` : `    not applied automatically: removing copy needs a reviewed code change (component and narrative type), never an empty string.${result.locations?.length ? ` Text at ${result.locations.join(", ")}.` : ""}`);
    if (result.removeScope !== "item") lines.push(`    removes everything under ${result.removeTarget}`);
  }
  if (result.operation === "KEEP") lines.push("    recorded: reviewed, keep as is (no change)");
  if (result.comment) lines.push(`    comment:  ${JSON.stringify(result.comment)}`);
  for (const problem of result.problems) lines.push(`    ${result.status.toUpperCase()}: ${problem}`);
}
if (diff) lines.push("", "Patch preview (rehearsed on a copy of the source):", diff.trimEnd());
if (planned.length) lines.push("", verification.length ? `VERIFICATION FAILED:\n  ${verification.join("\n  ")}` : `Verified on a copy: ${planned.length} text ${planned.length === 1 ? "change reads" : "changes read"} exactly as proposed; all ${Object.keys(before).length - planned.length} other copy items are unchanged.`);
const count = (op) => results.filter((result) => result.operation === op).length;
lines.push("", `Summary: ${planned.length} text change(s) ready · ${count("REMOVE")} removal(s) for a reviewed code change (${structural.length} structural) · ${count("KEEP")} kept · ${conflicts.length} conflict(s) · ${blocked.length} blocked · ${errors.length} invalid`);

const ready = !errors.length && !conflicts.length && !blocked.length && !verification.length;
const report = { format: "raidguild-editorial-dry-run", version: 1, changeSet: data.exportId ?? null, sourceRevision: head, mode: APPLY ? "apply" : "dry-run", ready, errors, notes, verification, results: results.map(({ literal, ...rest }) => ({ ...rest, source: literal ? `${literal.path}:${literal.line}` : null })), diff };
if (option("--report")) writeFileSync(option("--report"), `${JSON.stringify(report, null, 2)}\n`);

// --- 7. apply (only on request, with the change set id, when everything is clean) ---
if (APPLY) {
  const refuse = (message) => { console.log(lines.join("\n")); console.error(`\napply-editorial: refused: ${message}`); process.exit(2); };
  if (!ready) refuse("the change set is not clean (invalid, conflicting, blocked or unverified decisions). Nothing was written.");
  const confirm = option("--confirm") ?? "";
  if (!data.exportId || confirm.replace(/^sha256:/, "").length < 12 || !data.exportId.slice(7).startsWith(confirm.replace(/^sha256:/, ""))) refuse("--confirm must give the change set id (at least 12 characters) of this file.");
  const files = patch(ROOT);
  if (!flag("--allow-dirty") && files.size) {
    const dirty = git("status", "--porcelain", "--", ...files.keys());
    if (dirty === null) refuse("not a git checkout; pass --allow-dirty to write anyway.");
    if (dirty) refuse(`these files have uncommitted changes:\n${dirty}`);
  }
  const saved = new Map([...files.keys()].map((path) => [path, readFileSync(join(ROOT, path), "utf8")]));
  for (const [path, text] of files) writeFileSync(join(ROOT, path), text);
  const check = verify(before, dump(ROOT));
  if (check.length) {
    for (const [path, text] of saved) writeFileSync(join(ROOT, path), text);
    refuse(`the written source did not verify; restored the original files:\n  ${check.join("\n  ")}`);
  }
  lines.push("", `APPLIED: ${planned.length} text change(s) in ${[...files.keys()].join(", ") || "no file"}. Removals and KEEP decisions were not written (see above).`, "Next: review `git diff`, run `bun run test`, then commit and deploy with approval.");
}

console.log(lines.join("\n"));
process.exit(errors.length ? 1 : conflicts.length || blocked.length || verification.length ? 2 : 0);
