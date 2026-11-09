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
    assert.match(out, /⚠ Hero · Button 2 (\(“Explore our work”\) )?· Remove \(item\)[\s\S]*STRUCTURAL: .*Needs separate approval; not applied\./);
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

  test("text found more than once is resolved by probing which literal produces the item, never guessed", async () => {
    const root = copyRoot("ambiguous");
    appendFileSync(join(root, "src/lib/data/constants.ts"), `\nexport const editorialTestDuplicate = ${JSON.stringify(originals.get(HERO))};\n`);
    const data = await changeSet((drafts) => applyEdit(drafts, HERO, "Hard problems, solved,", originals.get(HERO), NOW));
    const { code, out } = run(write("ambiguous.json", data), [], root);
    assert.equal(code, 0, out);
    assert.match(out, /source: {3}src\/lib\/narrative\/clients\.ts:\d+/);
    assert.match(out, /Verified on a copy: 1 text change reads exactly as proposed/);
    // The same text twice, and neither literal produces the item: blocked.
    const both = copyRoot("assembled");
    const narrative = join(both, "src/lib/narrative/clients.ts");
    writeFileSync(narrative, readFileSync(narrative, "utf8").replace('design("Hard problems,")', 'design(["Hard", "problems,"].join(" "))'));
    appendFileSync(join(both, "src/lib/data/constants.ts"), `\nexport const editorialTestDuplicate = ${JSON.stringify(originals.get(HERO))};\n`);
    const blocked = run(write("assembled.json", data), [], both);
    assert.equal(blocked.code, 2);
    assert.match(blocked.out, /BLOCKED: .*no single literal produces this item|BLOCKED: the text is not a single string literal/);
  });

  test("a literal shared by several items is applied only when all of them get the same text", async () => {
    const READ_MORE = (index) => `clients.previousWorks.works.${index}.link.label`;
    const one = await changeSet((drafts) => applyEdit(drafts, READ_MORE(0), "Read the case", originals.get(READ_MORE(0)), NOW));
    const single = run(write("shared-one.json", one));
    assert.equal(single.code, 2);
    assert.match(single.out, /its source text is shared with clients\.previousWorks\.works\.1\.link\.label/);
    const all = await changeSet((drafts) => { for (let index = 0; index < 9; index++) drafts = applyEdit(drafts, READ_MORE(index), "Read the case", originals.get(READ_MORE(index)), NOW); return drafts; });
    const together = run(write("shared-all.json", all));
    assert.equal(together.code, 0, together.out);
    assert.match(together.out, /Verified on a copy: 9 text changes read exactly as proposed/);
    assert.equal((together.out.match(/^\+.*"Read the case"/gm) ?? []).length, 1, "one edit in the source");
  });

  test("a text assembled from the changed literal follows it, and is verified", async () => {
    const NAME = "clients.previousWorks.works.3.name";
    const data = await changeSet((drafts) => applyEdit(drafts, NAME, "Livepeer Inc.", originals.get(NAME), NOW));
    const { code, out } = run(write("derived.json", data));
    assert.equal(code, 0, out);
    assert.match(out, /also updates \(assembled from this text\): clients\.previousWorks\.works\.3\.snapshot\.alt/);
    assert.match(out, /Verified on a copy: 1 text change reads exactly as proposed/);
  });

  test("a rewrite that changes a stated price is structural and never applied", async () => {
    const PRICE = "community.benefits.cards.3.body";
    const data = await changeSet((drafts) => applyEdit(drafts, PRICE, originals.get(PRICE).replace("$20", "$25"), originals.get(PRICE), NOW));
    assert.match(data.changes[0].structural.reason, /price/);
    const { code, out } = run(write("price.json", data));
    assert.equal(code, 2);
    assert.match(out, /BLOCKED: structural: Changes a stated price/);
  });

  test("--map gives the source of every editable copy id", () => {
    const result = spawnSync("bun", [CLI, "--map", "--root", REPO, "--report", join(work, "map.json")], { cwd: REPO, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    const map = JSON.parse(readFileSync(join(work, "map.json"), "utf8"));
    assert.equal(map.rows.length, originals.size);
    for (const row of map.rows) assert.ok(row.source || /assembled in code/.test(row.problem), `${row.id}: ${row.problem}`);
    // Only the screenshot descriptions ("<name> website homepage") are assembled in code.
    assert.deepEqual(map.rows.filter((row) => !row.source).map((row) => row.id).filter((id) => !/^clients\.previousWorks\.works\.\d\.snapshot\.alt$/.test(id)), []);
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
