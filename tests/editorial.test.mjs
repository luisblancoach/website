// Editorial Mode (local prototype): the pure draft logic, the section registry
// and the catalog. Runs with the narrative tests (imported by
// narrative.test.mjs, so package.json's test list is unchanged).
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import nextConfig from "../next.config.ts";
import "./editorial-apply.test.mjs";
import { EDITORIAL_SECTIONS, componentOf, fieldLabel, isEditableId, removalTarget, sectionFor, structuralReason } from "../src/lib/editorial/config.ts";
import { itemContext, originals, sourceOrder } from "../src/lib/editorial/catalog.ts";
import {
  applyEdit, conflictOf, fingerprint, fromExport, normalizeText, parseStored, rebase, removedBy, revert, serializeStored, setComment, setOperation, toExport, toMarkdown, warningsOf,
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

const OPTS = { context: itemContext, order: sourceOrder, revision: "abc1234" };
const DEK = "clients.hero.dek";
const CARD_BODY = "clients.serviceGallery.cards.2.body";
const CTA = "clients.hero.paths.0.label";

describe("editorial drafts (v0.2 operations)", () => {
  test("REPLACE: an edit becomes a draft with the exact text; editing back removes it", () => {
    let drafts = applyEdit({}, HERO, "  Hard  problems, solved ", "Hard problems,", NOW);
    assert.deepEqual(drafts[HERO], { id: HERO, op: "REPLACE", text: "Hard problems, solved", base: "Hard problems,", comment: undefined, updatedAt: NOW });
    drafts = applyEdit(drafts, HERO, "Hard problems,", "Hard problems,", NOW);
    assert.deepEqual(drafts, {});
  });

  test("normalizeText: one line, single spaces", () => {
    assert.equal(normalizeText(" a  b\n c "), "a b c");
  });

  test("SHORTEN keeps the wording; a longer text is flagged, never rewritten", () => {
    const base = originals.get(CARD_BODY);
    let drafts = applyEdit({}, CARD_BODY, "Practical AI where it saves time.", base, NOW);
    drafts = setOperation(drafts, CARD_BODY, "SHORTEN", base, { now: NOW });
    assert.equal(drafts[CARD_BODY].op, "SHORTEN");
    assert.equal(drafts[CARD_BODY].text, "Practical AI where it saves time.");
    assert.deepEqual(warningsOf(drafts[CARD_BODY]), []);
    drafts = applyEdit(drafts, CARD_BODY, "Practical AI, slightly reworded.", base, NOW);
    assert.equal(drafts[CARD_BODY].op, "SHORTEN", "further edits keep the chosen operation");
    const longer = applyEdit(drafts, CARD_BODY, `${base} And more.`, base, NOW);
    assert.equal(warningsOf(longer[CARD_BODY]).length, 1);
    assert.equal(setOperation({}, CARD_BODY, "SHORTEN", base, { now: NOW })[CARD_BODY], undefined, "Shorten needs a changed text");
  });

  test("REMOVE is explicit (never an empty string), scoped, and reversible", () => {
    const base = originals.get(CARD_BODY);
    const emptied = applyEdit({}, CARD_BODY, "   ", base, NOW);
    assert.deepEqual(emptied[CARD_BODY], { id: CARD_BODY, op: "REMOVE", text: base, base, scope: "item", comment: undefined, updatedAt: NOW });
    const whole = setOperation({}, CARD_BODY, "REMOVE", base, { scope: "component", now: NOW });
    assert.equal(removalTarget(CARD_BODY, "component"), "clients.serviceGallery.cards.2");
    assert.equal(removedBy(whole, "clients.serviceGallery.cards.2.title.lead")?.id, CARD_BODY, "the whole card goes");
    assert.equal(removedBy(whole, "clients.serviceGallery.cards.3.body"), undefined, "the next card stays");
    assert.equal(removedBy(whole, "clients.serviceGallery.cards.20.body"), undefined, "prefixes match whole segments");
    assert.deepEqual(revert(whole, CARD_BODY), {});
  });

  test("structural removals are flagged for separate approval", () => {
    assert.equal(structuralReason(CARD_BODY, "REMOVE", "item"), null, "a paragraph is copy");
    assert.match(structuralReason(CARD_BODY, "REMOVE", "component"), /whole item/);
    assert.match(structuralReason(DEK, "REMOVE", "section"), /whole section/);
    assert.match(structuralReason(CTA, "REMOVE", "item"), /button or link/);
    assert.match(structuralReason("clients.serviceGallery.cta.label", "REMOVE"), /button or link/);
    assert.match(structuralReason("community.capabilities.cards.0.link.label", "REMOVE"), /button or link/);
    assert.match(structuralReason(HERO, "REMOVE"), /heading/);
    assert.match(structuralReason("clients.serviceGallery.label", "REMOVE"), /section label/);
    assert.equal(structuralReason(CTA, "REPLACE"), null);
    assert.equal(componentOf(DEK), undefined);
  });

  test("KEEP records the review without changing the text; comments on unchanged copy are KEEP", () => {
    let drafts = setOperation({}, DEK, "KEEP", originals.get(DEK), { now: NOW });
    assert.deepEqual(drafts[DEK], { id: DEK, op: "KEEP", text: originals.get(DEK), base: originals.get(DEK), comment: undefined, updatedAt: NOW });
    drafts = setComment({}, HERO, "Keep: it is the brand line.", "Hard problems,", NOW);
    assert.equal(drafts[HERO].op, "KEEP");
    assert.equal(drafts[HERO].text, "Hard problems,");
    drafts = applyEdit({}, HERO, "Hard problems.", "Hard problems,", NOW);
    drafts = setComment(drafts, HERO, "Period reads stronger.", "Hard problems,", NOW);
    drafts = applyEdit(drafts, HERO, "Hard problems,", "Hard problems,", NOW);
    assert.equal(drafts[HERO].op, "KEEP", "back to the source text with a comment: kept, with the comment");
    assert.deepEqual(revert(drafts, HERO), {});
  });

  test("conflicts: changed source and unknown id; rebase keeps the decision", () => {
    const drafts = applyEdit({}, HERO, "Hard problems.", "Hard problems (old),", NOW);
    assert.equal(conflictOf(drafts[HERO], originals), "source-changed");
    assert.equal(conflictOf({ ...drafts[HERO], id: "clients.hero.gone" }, originals), "unknown-id");
    const rebased = rebase(drafts, HERO, originals.get(HERO), NOW);
    assert.equal(conflictOf(rebased[HERO], originals), null);
    assert.equal(rebased[HERO].text, "Hard problems.");
  });

  test("JSON export v2: explicit operations, fingerprints, revision, page order; deterministic; imports back", async () => {
    let drafts = applyEdit({}, HERO, "Hard problems.", "Hard problems,", NOW);
    drafts = setComment(drafts, "community.join.body", "Fine as is.", originals.get("community.join.body"), NOW);
    drafts = setOperation(drafts, CARD_BODY, "REMOVE", originals.get(CARD_BODY), { scope: "item", now: NOW });
    drafts = setOperation(drafts, CTA, "REMOVE", originals.get(CTA), { now: NOW });
    const data = await toExport(drafts, originals, OPTS);
    assert.equal(data.version, 2);
    assert.equal(data.status, "proposed");
    assert.equal(data.sourceRevision, "abc1234");
    assert.deepEqual(data.changes.map((change) => change.id), [HERO, CTA, CARD_BODY, "community.join.body"]);
    const [hero, cta, card, join] = data.changes;
    assert.equal(hero.operation, "REPLACE");
    assert.equal(hero.proposed, "Hard problems.");
    assert.equal(hero.base, "Hard problems,");
    assert.equal(hero.baseFingerprint, await fingerprint("Hard problems,"));
    assert.match(hero.baseFingerprint, /^sha256:[0-9a-f]{64}$/);
    assert.equal(hero.pageLabel, "Agency");
    assert.equal(hero.section, "Hero");
    assert.equal(hero.field, "Headline, line 1");
    assert.equal(hero.reviewStatus, "proposed");
    assert.equal(hero.sourceRevision, "abc1234");
    assert.equal(card.operation, "REMOVE");
    assert.equal(card.removeScope, "item");
    assert.ok(!("proposed" in card), "REMOVE carries no text");
    assert.equal(card.structural, null);
    assert.ok(cta.structural, "removing a button label is structural");
    assert.equal(join.operation, "KEEP");
    assert.ok(!("proposed" in join));
    assert.deepEqual(data.summary, { REPLACE: 1, SHORTEN: 0, REMOVE: 2, KEEP: 1, structural: 1, conflicts: 0 });
    assert.ok(!JSON.stringify(data).includes("\"approved\""), "nothing is ever marked approved");
    assert.deepEqual(await toExport(drafts, originals, OPTS), data, "the same drafts give the same export");
    const back = fromExport(JSON.stringify(data), {}, originals);
    assert.deepEqual(back.drafts, drafts);
    assert.equal(back.added, 4);
    const again = fromExport(JSON.stringify(data), back.drafts, originals);
    assert.equal(again.replaced, 4);
    assert.deepEqual(again.drafts, drafts, "importing twice is safe");
  });

  test("version 1 exports and stored drafts still import", () => {
    const v1 = { format: "raidguild-editorial-changes", version: 1, changes: [
      { id: HERO, original: "Hard problems,", proposed: "Hard problems.", comment: "", editedAt: NOW },
      { id: DEK, original: originals.get(DEK), proposed: originals.get(DEK), comment: "Keep.", editedAt: NOW },
    ] };
    const result = fromExport(JSON.stringify(v1), {}, originals);
    assert.equal(result.drafts[HERO].op, "REPLACE");
    assert.equal(result.drafts[DEK].op, "KEEP");
    const stored = JSON.stringify({ version: 1, drafts: { [HERO]: { id: HERO, text: "Hard problems.", base: "Hard problems,", updatedAt: NOW } } });
    assert.equal(parseStored(stored)[HERO].op, "REPLACE");
  });

  test("import rejects foreign or malformed files and counts conflicts", async () => {
    assert.throws(() => fromExport("not json", {}, originals), /not valid JSON/);
    assert.throws(() => fromExport("{\"changes\":[]}", {}, originals), /not a RaidGuild editorial export/);
    assert.throws(() => fromExport(JSON.stringify({ format: "raidguild-editorial-changes", version: 9, changes: [] }), {}, originals), /Unsupported export version 9/);
    const stale = await toExport(applyEdit({}, HERO, "New.", "Old source,", NOW), originals, OPTS);
    assert.equal(stale.changes[0].conflict, "source-changed");
    const result = fromExport(JSON.stringify(stale), {}, originals);
    assert.equal(result.conflicts, 1);
    const bad = [{ id: 3 }, { id: HERO, operation: "DELETE", base: "x" }, { id: HERO, operation: "REPLACE", base: "x", proposed: "" }, { id: HERO, operation: "REMOVE", base: "x", removeScope: "page" }];
    assert.equal(fromExport(JSON.stringify({ ...stale, changes: [...bad, ...stale.changes] }), {}, originals).skipped, 4);
  });

  test("Markdown review document: page, section, field, operation, texts, comment, status; same change set id", async () => {
    let drafts = applyEdit({}, "clients.reasons.items.0.body", "One lead, start to finish.", originals.get("clients.reasons.items.0.body"), NOW);
    drafts = setOperation(drafts, "clients.reasons.items.0.body", "SHORTEN", originals.get("clients.reasons.items.0.body"), { now: NOW });
    drafts = setComment(drafts, "clients.reasons.items.0.body", "Tighter.", "", NOW);
    drafts = setOperation(drafts, CTA, "REMOVE", originals.get(CTA), { now: NOW });
    drafts = setOperation(drafts, "community.hero.dek", "KEEP", originals.get("community.hero.dek"), { now: NOW });
    const data = await toExport(drafts, originals, OPTS);
    const markdown = toMarkdown(data);
    assert.match(markdown, /^# RaidGuild: Tae's editorial review/);
    assert.match(markdown, /Status: \*\*proposed, not approved\*\*/);
    assert.ok(markdown.includes(data.exportId.slice(0, 19)));
    assert.ok(markdown.indexOf("## Agency") < markdown.indexOf("## Community"));
    assert.match(markdown, /### Why RaidGuild/);
    assert.match(markdown, /#### Reason 1 \(“Small, senior, accountable teams”\) · Expanded text/);
    assert.match(markdown, /- Operation: \*\*Shorten\*\* \(SHORTEN\)/);
    assert.match(markdown, /Proposed text \(exact wording\):\n\n> One lead, start to finish\./);
    assert.match(markdown, /Tae's comment:\n\n> Tighter\./);
    assert.match(markdown, /#### ⚠ Button 1/);
    assert.match(markdown, /Proposed: \*\*remove this text\*\* from the page/);
    assert.match(markdown, /- Review status: proposed, structural: needs separate approval/);
    assert.match(markdown, /Proposed: \*\*keep as is\*\* \(reviewed, no change\)/);
  });

  test("stored drafts survive a round trip; malformed storage is ignored", () => {
    let drafts = applyEdit({}, HERO, "Hard problems.", "Hard problems,", NOW);
    drafts = setOperation(drafts, CARD_BODY, "REMOVE", originals.get(CARD_BODY), { scope: "section", now: NOW });
    assert.deepEqual(parseStored(serializeStored(drafts)), drafts);
    assert.deepEqual(parseStored("{"), {});
    assert.deepEqual(parseStored(JSON.stringify({ version: 3, drafts })), {});
    assert.deepEqual(parseStored(JSON.stringify({ version: 1, drafts: { x: { id: "y", text: "a", base: "b" } } })), {});
    assert.deepEqual(parseStored(JSON.stringify({ version: 2, drafts: { [HERO]: { id: HERO, op: "ERASE", text: "a", base: "b" } } })), {});
  });
});

describe("editorial mode stays out of production unless opted in", () => {
  test("the build flag is a literal that defaults to disabled", () => {
    // Loaded with the test environment, where the flag is not set.
    assert.equal(process.env.NEXT_PUBLIC_EDITORIAL_MODE, undefined);
    assert.equal(nextConfig.env.NEXT_PUBLIC_EDITORIAL_MODE, "disabled");
    // Only the exact value "opt-in" turns it on; anything else is "disabled".
    const source = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");
    assert.match(source, /NEXT_PUBLIC_EDITORIAL_MODE: process\.env\.NEXT_PUBLIC_EDITORIAL_MODE === "opt-in" \? "opt-in" : "disabled"/);
  });

  test("every mount point is behind the build-time editorial check", () => {
    const review = readFileSync(new URL("../src/components/venture/primitives/Review.tsx", import.meta.url), "utf8");
    const shell = readFileSync(new URL("../src/components/venture/shell/VentureShell.tsx", import.meta.url), "utf8");
    // The editor is only ever required inside the build-time check, never imported statically.
    const gate = String.raw`process\.env\.NODE_ENV === "development" \|\| process\.env\.NEXT_PUBLIC_EDITORIAL_MODE === "opt-in"\s*(\/\/[^\n]*\s*)?\? require`;
    assert.match(review, new RegExp(`${gate}\\("\\.\\./editorial/EditableCopy"\\) : null`));
    assert.match(shell, new RegExp(`${gate}\\("\\.\\./editorial/EditorialEntry"\\)\\.default : null`));
    for (const source of [review, shell]) assert.doesNotMatch(source, /^import .*editorial/m);
  });

  test("an opt-in build loads the editor only after ?editorial=1, and shows no entry button", () => {
    const entry = readFileSync(new URL("../src/components/venture/editorial/EditorialEntry.tsx", import.meta.url), "utf8");
    const mode = readFileSync(new URL("../src/components/venture/editorial/EditorialMode.tsx", import.meta.url), "utf8");
    const store = readFileSync(new URL("../src/components/venture/editorial/store.ts", import.meta.url), "utf8");
    // The chrome is a lazy chunk, rendered only in the browser and only when active (or in development).
    assert.match(entry, /lazy\(\(\) => import\("\.\/EditorialMode"\)\)/);
    assert.match(entry, /if \(!mounted \|\| !\(active \|\| EDITORIAL_DEV\)\) return null;/);
    assert.doesNotMatch(entry, /^import (?!type).*["']\.\/EditorialMode["']/m);
    // No "Edit copy" button outside development; the bar says the drafts are local.
    assert.match(mode, /\(!state\.active && !EDITORIAL_DEV\)\) return null;/);
    assert.match(mode, /Local draft — not published/);
    // The mode starts only from the URL or a previous opt-in in this browser; it never calls a server.
    assert.match(store, /get\("editorial"\)/);
    for (const source of [entry, mode, store]) assert.doesNotMatch(source, /\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket/);
  });
});
