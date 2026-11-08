// Editorial Mode (local prototype): the pure draft logic, the section registry
// and the catalog. Runs with the narrative tests (imported by
// narrative.test.mjs, so package.json's test list is unchanged).
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { EDITORIAL_SECTIONS, fieldLabel, isEditableId, sectionFor } from "../src/lib/editorial/config.ts";
import { itemContext, originals, sourceOrder } from "../src/lib/editorial/catalog.ts";
import {
  applyEdit, conflictOf, fromExport, normalizeText, parseStored, rebase, revert, serializeStored, setComment, toExport, toMarkdown,
} from "../src/lib/editorial/drafts.ts";

const NOW = "2026-11-07T22:00:00.000Z";
const HERO = "clients.hero.title.lead";

describe("editorial sections", () => {
  test("the six prototype sections are editable, nothing else", () => {
    assert.deepEqual(EDITORIAL_SECTIONS.map((section) => section.prefix), [
      "clients.hero", "clients.serviceGallery", "clients.reasons", "community.hero", "community.capabilities", "community.join",
    ]);
    assert.ok(isEditableId(HERO));
    assert.ok(isEditableId("community.join.actions.0.label"));
    assert.ok(!isEditableId("clients.faq.items.0.answer"), "FAQ is not in the prototype");
    assert.ok(!isEditableId("clients.heroic.x"), "prefix match is by whole segment");
    assert.ok(!isEditableId("community.capabilities.cards.1.link.destination"), "destinations are review notes, not page text");
    assert.ok(!isEditableId(""));
  });

  test("labels are human-readable", () => {
    assert.equal(fieldLabel(HERO), "Headline, line 1");
    assert.equal(fieldLabel("clients.hero.dek"), "Introduction");
    assert.equal(fieldLabel("clients.hero.paths.1.label"), "Button 2");
    assert.equal(fieldLabel("clients.serviceGallery.label"), "Section label");
    assert.equal(fieldLabel("clients.serviceGallery.cta.label"), "Section button");
    assert.equal(fieldLabel("clients.serviceGallery.cards.1.body", itemContext("clients.serviceGallery.cards.1.body")), "Card 2 (“Smart contracts, onchain systems”) · Text");
    assert.equal(fieldLabel("clients.serviceGallery.cards.1.title.em"), "Card 2 · Title, line 2");
    assert.equal(fieldLabel("clients.serviceGallery.cards.1.link.label"), "Card 2 · Link");
    assert.equal(fieldLabel("clients.reasons.items.0.body"), "Reason 1 · Expanded text");
    assert.equal(fieldLabel("community.join.links.0.label"), "Link 1");
    for (const id of originals.keys()) assert.doesNotMatch(fieldLabel(id), /\b(lead|em|dek|paths|cards|items)\b/, `${id} → ${fieldLabel(id)}`);
  });

  test("the catalog holds every visible copy item of each section, in order", () => {
    for (const section of EDITORIAL_SECTIONS) {
      const ids = [...originals.keys()].filter((id) => sectionFor(id) === section);
      assert.ok(ids.length >= 4, `${section.prefix}: ${ids.length} items`);
    }
    assert.equal(originals.get(HERO), "Hard problems,");
    assert.equal(originals.get("community.hero.title.finale"), "together.");
    assert.ok([...originals.keys()].every(isEditableId));
  });
});

describe("editorial drafts", () => {
  test("an edit becomes a draft against the source; editing back removes it", () => {
    let drafts = applyEdit({}, HERO, "  Hard  problems, solved ", "Hard problems,", NOW);
    assert.deepEqual(drafts[HERO], { id: HERO, text: "Hard problems, solved", base: "Hard problems,", comment: undefined, updatedAt: NOW });
    drafts = applyEdit(drafts, HERO, "Hard problems,", "Hard problems,", NOW);
    assert.deepEqual(drafts, {});
  });

  test("normalizeText: one line, single spaces", () => {
    assert.equal(normalizeText(" a  b\n c "), "a b c");
  });

  test("comments, revert and comment-only proposals", () => {
    let drafts = setComment({}, HERO, "Keep: it is the brand line.", "Hard problems,", NOW);
    assert.equal(drafts[HERO].text, "Hard problems,");
    assert.equal(drafts[HERO].comment, "Keep: it is the brand line.");
    drafts = setComment(drafts, HERO, "  ", "Hard problems,", NOW);
    assert.deepEqual(drafts, {}, "an empty comment on unchanged copy leaves nothing");
    drafts = applyEdit({}, HERO, "Hard problems.", "Hard problems,", NOW);
    drafts = setComment(drafts, HERO, "Period reads stronger.", "Hard problems,", NOW);
    drafts = applyEdit(drafts, HERO, "Hard problems,", "Hard problems,", NOW);
    assert.equal(drafts[HERO].text, "Hard problems,", "the comment keeps the entry");
    assert.deepEqual(revert(drafts, HERO), {});
  });

  test("conflicts: changed source and unknown id; rebase keeps the proposal", () => {
    const drafts = applyEdit({}, HERO, "Hard problems.", "Hard problems (old),", NOW);
    assert.equal(conflictOf(drafts[HERO], originals), "source-changed");
    assert.equal(conflictOf({ ...drafts[HERO], id: "clients.hero.gone" }, originals), "unknown-id");
    const rebased = rebase(drafts, HERO, originals.get(HERO), NOW);
    assert.equal(conflictOf(rebased[HERO], originals), null);
    assert.equal(rebased[HERO].text, "Hard problems.");
  });

  test("JSON export: proposals only, and it imports back", () => {
    let drafts = applyEdit({}, HERO, "Hard problems.", "Hard problems,", NOW);
    drafts = setComment(drafts, "community.join.body", "Shorter?", originals.get("community.join.body"), NOW);
    drafts = applyEdit(drafts, "clients.hero.dek", "A collective of builders.", originals.get("clients.hero.dek"), NOW);
    const data = toExport(drafts, originals, { context: itemContext, order: sourceOrder, now: NOW });
    assert.equal(data.status, "proposed");
    // Page order: the headline comes before the dek below it, then the other page.
    assert.deepEqual(data.changes.map((change) => change.id), [HERO, "clients.hero.dek", "community.join.body"]);
    assert.equal(data.changes[0].page, "/agency");
    assert.equal(data.changes[0].section, "Agency · Hero");
    assert.equal(data.changes[0].original, "Hard problems,");
    assert.equal(data.changes[0].proposed, "Hard problems.");
    assert.ok(!JSON.stringify(data).includes("\"approved\""), "nothing is ever marked approved");
    const back = fromExport(JSON.stringify(data), {}, originals);
    assert.deepEqual(back.drafts, drafts);
    assert.equal(back.added, 3);
    const again = fromExport(JSON.stringify(data), back.drafts, originals);
    assert.equal(again.replaced, 3);
  });

  test("import rejects foreign files and counts conflicts", () => {
    assert.throws(() => fromExport("not json", {}, originals), /not valid JSON/);
    assert.throws(() => fromExport("{\"changes\":[]}", {}, originals), /not a RaidGuild editorial export/);
    const stale = toExport(applyEdit({}, HERO, "New.", "Old source,", NOW), originals, { now: NOW });
    const result = fromExport(JSON.stringify(stale), {}, originals);
    assert.equal(result.conflicts, 1);
    const malformed = { ...stale, changes: [{ id: 3 }, ...stale.changes] };
    assert.equal(fromExport(JSON.stringify(malformed), {}, originals).skipped, 1);
  });

  test("Markdown export for review", () => {
    const drafts = applyEdit({}, "clients.reasons.items.0.body", "One lead, start to finish.", originals.get("clients.reasons.items.0.body"), NOW);
    const markdown = toMarkdown(toExport(drafts, originals, { context: itemContext, order: sourceOrder, now: NOW }));
    assert.match(markdown, /^# RaidGuild: editorial proposals/);
    assert.match(markdown, /status: \*\*proposed, not approved\*\*/);
    assert.match(markdown, /## Agency · Why RaidGuild/);
    assert.match(markdown, /### Reason 1 \(“Small, senior, accountable teams”\) · Expanded text/);
    assert.match(markdown, /Proposed:\n\n> One lead, start to finish\./);
  });

  test("stored drafts survive a round trip; malformed storage is ignored", () => {
    const drafts = applyEdit({}, HERO, "Hard problems.", "Hard problems,", NOW);
    assert.deepEqual(parseStored(serializeStored(drafts)), drafts);
    assert.deepEqual(parseStored("{"), {});
    assert.deepEqual(parseStored(JSON.stringify({ version: 2, drafts })), {});
    assert.deepEqual(parseStored(JSON.stringify({ version: 1, drafts: { x: { id: "y", text: "a", base: "b" } } })), {});
  });
});

describe("editorial mode stays out of production", () => {
  test("every mount point is behind NODE_ENV === development", () => {
    const review = readFileSync(new URL("../src/components/venture/primitives/Review.tsx", import.meta.url), "utf8");
    const shell = readFileSync(new URL("../src/components/venture/shell/VentureShell.tsx", import.meta.url), "utf8");
    // The editor is only ever required inside the check, never imported statically.
    assert.match(review, /process\.env\.NODE_ENV === "development" \? require\("\.\.\/editorial\/EditableCopy"\) : null/);
    assert.match(shell, /process\.env\.NODE_ENV === "development" \? require\("\.\.\/editorial\/EditorialMode"\)\.default : null/);
    for (const source of [review, shell]) assert.doesNotMatch(source, /^import .*editorial/m);
  });
});
