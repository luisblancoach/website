// The editorial integration CLI (scripts/apply-editorial.mjs): validation, dry
// run, refusals, and a verified apply on a throwaway copy of the source. The
// real narrative files are only read. Imported by editorial.test.mjs.
import { describe, test, after } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { cpSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync, appendFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { itemContext, originals, sourceOrder } from "../src/lib/editorial/catalog.ts";
import { applyEdit, setComment, setOperation, toExport } from "../src/lib/editorial/drafts.ts";

const REPO = new URL("..", import.meta.url).pathname;
const CLI = join(REPO, "scripts/apply-editorial.mjs");
const NOW = "2026-11-08T22:00:00.000Z";
const HERO = "clients.hero.title.lead";
const CARD = "clients.serviceGallery.cards.0.body";
const work = mkdtempSync(join(tmpdir(), "editorial-cli-test-"));
after(() => rmSync(work, { recursive: true, force: true }));

const run = (file, extra = [], root = REPO) => {
  const result = spawnSync("bun", [CLI, file, "--root", root, ...extra], { cwd: root, encoding: "utf8" });
  return { code: result.status, out: `${result.stdout}${result.stderr}` };
};
const write = (name, data) => { const path = join(work, name); writeFileSync(path, typeof data === "string" ? data : JSON.stringify(data, null, 2)); return path; };
async function changeSet(build) {
  return toExport(build({}), originals, { context: itemContext, order: sourceOrder, revision: "test" });
}
const sample = () => changeSet((drafts) => {
  drafts = applyEdit(drafts, HERO, "Hard problems, solved,", originals.get(HERO), NOW);
  drafts = applyEdit(drafts, CARD, "Web apps and dApps, built end to end.", originals.get(CARD), NOW);
  drafts = setOperation(drafts, CARD, "SHORTEN", originals.get(CARD), { now: NOW });
  drafts = setComment(drafts, CARD, "Tighter.", originals.get(CARD), NOW);
  drafts = setOperation(drafts, "clients.hero.paths.1.label", "REMOVE", originals.get("clients.hero.paths.1.label"), { now: NOW });
  drafts = setOperation(drafts, "community.hero.dek", "KEEP", originals.get("community.hero.dek"), { now: NOW });
  return drafts;
});
// A throwaway checkout: the repository's src and config, committed, so --apply can check for uncommitted work.
function copyRoot(name) {
  const root = join(work, name);
  cpSync(join(REPO, "src"), join(root, "src"), { recursive: true });
  for (const file of ["tsconfig.json", "package.json"]) cpSync(join(REPO, file), join(root, file));
  symlinkSync(join(REPO, "node_modules"), join(root, "node_modules"));
  execFileSync("git", ["init", "-q"], { cwd: root });
  execFileSync("git", ["add", "-A"], { cwd: root });
  execFileSync("git", ["-c", "user.name=test", "-c", "user.email=test@invalid", "commit", "-qm", "copy"], { cwd: root });
  return root;
}

describe("apply-editorial CLI", { timeout: 120000 }, () => {
  test("dry run (default): validates, resolves, previews, verifies on a copy, writes nothing", async () => {
    const data = await sample();
    const before = readFileSync(join(REPO, "src/lib/narrative/clients.ts"), "utf8");
    const { code, out } = run(write("sample.json", data));
    assert.equal(code, 0, out);
    assert.match(out, /DRY RUN \(nothing is written\)/);
    assert.match(out, /✓ Hero · Headline, line 1 · Rewrite/);
    assert.match(out, /✓ Services gallery · Card 1 .* · Shorten/);
    assert.match(out, /⚠ Hero · Button 2 · Remove \(item\)[\s\S]*STRUCTURAL: .*Needs separate approval; not applied\./);
    assert.match(out, /○ Hero · Introduction · Keep as is[\s\S]*recorded: reviewed, keep as is \(no change\)/);
    assert.match(out, /-  title: \{ lead: design\("Hard problems,"\)/);
    assert.match(out, /\+  title: \{ lead: design\("Hard problems, solved,"\)/);
    assert.match(out, /Verified on a copy: 2 text changes read exactly as proposed; all \d+ other copy items are unchanged\./);
    assert.equal(readFileSync(join(REPO, "src/lib/narrative/clients.ts"), "utf8"), before, "the real source is untouched");
  });

  test("a stale decision (the source changed) is a conflict, and blocks apply", async () => {
    const stale = await changeSet((drafts) => applyEdit(drafts, HERO, "Hard problems, solved,", "Hard problems (old),", NOW));
    const file = write("stale.json", stale);
    const { code, out } = run(file);
    assert.equal(code, 2);
    assert.match(out, /✗ Hero · Headline, line 1[\s\S]*made against: "Hard problems \(old\),"[\s\S]*CONFLICT: source changed/);
    const applied = run(file, ["--apply", "--confirm", stale.exportId.slice(7, 23), "--allow-dirty"]);
    assert.equal(applied.code, 2);
    assert.match(applied.out, /refused: the change set is not clean/);
  });

  test("an edited or malformed file is rejected", async () => {
    const data = await sample();
    const edited = structuredClone(data);
    edited.changes[0].proposed = "Hard problems, quietly changed,";
    assert.match(run(write("edited.json", edited)).out, /does not match its change set id: the file was edited after export/);
    const fingerprint = structuredClone(data);
    fingerprint.changes[0].base = "Something else";
    assert.match(run(write("fingerprint.json", fingerprint)).out, /base text does not match its fingerprint/);
    const empty = await changeSet((drafts) => drafts);
    empty.changes = [{ ...data.changes[0], proposed: "" }, { ...data.changes[1], operation: "DELETE" }, { ...data.changes[2], reviewStatus: "approved" }];
    const out = run(write("bad.json", empty)).out;
    assert.match(out, /without proposed text \(a removal must be REMOVE, never an empty text\)/);
    assert.match(out, /unknown operation "DELETE"/);
    assert.match(out, /review status "approved"; an export only carries proposals/);
    assert.equal(run(write("notjson.json", "{")).code, 1);
    assert.match(run(write("foreign.json", { format: "other", changes: [] })).out, /not a RaidGuild editorial change set/);
  });

  test("SHORTEN that is not shorter is invalid", async () => {
    const data = await changeSet((drafts) => setOperation(applyEdit(drafts, HERO, "Hard problems, and much longer,", originals.get(HERO), NOW), HERO, "SHORTEN", originals.get(HERO), { now: NOW }));
    assert.match(run(write("longer.json", data)).out, /SHORTEN, but the proposal is not shorter than the base/);
  });

  test("text found more than once in the source is blocked, not guessed", async () => {
    const root = copyRoot("ambiguous");
    appendFileSync(join(root, "src/lib/data/constants.ts"), `\nexport const editorialTestDuplicate = ${JSON.stringify(originals.get(HERO))};\n`);
    const data = await changeSet((drafts) => applyEdit(drafts, HERO, "Hard problems, solved,", originals.get(HERO), NOW));
    const { code, out } = run(write("ambiguous.json", data), [], root);
    assert.equal(code, 2);
    assert.match(out, /BLOCKED: the text appears 2 times in the source/);
  });

  test("--apply needs the change set id, writes exactly the proposals, verifies, and leaves removals and KEEP alone", async () => {
    const root = copyRoot("apply");
    const data = await sample();
    const file = write("apply.json", data);
    const clients = join(root, "src/lib/narrative/clients.ts");
    const before = readFileSync(clients, "utf8");
    const refused = run(file, ["--apply"], root);
    assert.equal(refused.code, 2);
    assert.match(refused.out, /--confirm must give the change set id/);
    assert.equal(readFileSync(clients, "utf8"), before);
    const { code, out } = run(file, ["--apply", "--confirm", data.exportId.slice(7, 23)], root);
    assert.equal(code, 0, out);
    assert.match(out, /APPLIED: 2 text change\(s\) in src\/lib\/narrative\/clients\.ts/);
    const changed = execFileSync("git", ["diff", "--numstat"], { cwd: root, encoding: "utf8" }).trim().split("\n");
    assert.deepEqual(changed, ["2\t2\tsrc/lib/narrative/clients.ts"], "only the two literals changed");
    const after = readFileSync(clients, "utf8");
    assert.ok(after.includes('design("Hard problems, solved,")'));
    assert.ok(after.includes('"Web apps and dApps, built end to end."'));
    assert.ok(after.includes(originals.get("clients.hero.paths.1.label")), "the structural removal was not applied");
    // Applying the same file again: the source has moved on, so every text change is now stale.
    const again = run(file, ["--apply", "--confirm", data.exportId.slice(7, 23)], root);
    assert.equal(again.code, 2);
    assert.match(again.out, /CONFLICT: source changed/);
    // Uncommitted work in a target file blocks apply.
    const second = await changeSet((drafts) => applyEdit(drafts, "community.hero.title.lead", "Build with the guild,", originals.get("community.hero.title.lead"), NOW));
    appendFileSync(join(root, "src/lib/narrative/community.ts"), "\n// local edit\n");
    const dirty = run(write("dirty.json", second), ["--apply", "--confirm", second.exportId.slice(7, 23)], root);
    assert.equal(dirty.code, 2);
    assert.match(dirty.out, /uncommitted changes/);
  });
});
