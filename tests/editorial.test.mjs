// Editorial Mode (local prototype): the pure draft logic, the section registry
// and the catalog. Runs with the narrative tests (imported by
// narrative.test.mjs, so package.json's test list is unchanged).
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import nextConfig from "../next.config.ts";
import "./editorial-apply.test.mjs";
import "./editorial-rich.test.mjs";
import { EDITORIAL_SECTIONS, componentOf, exclusionReason, fieldLabel, isEditableId, kindOf, removalTarget, sectionFor, structuralReason } from "../src/lib/editorial/config.ts";
import { TREES, hiddenIds, itemContext, originals, sourceOrder } from "../src/lib/editorial/catalog.ts";
import { collectCopy } from "../src/lib/narrative/types.ts";
import { clientsNarrative } from "../src/lib/narrative/clients.ts";
import { forAudience } from "../src/lib/narrative/public.ts";
import {
  applyEdit, conflictOf, fingerprint, fromExport, normalizeText, parseStored, rebase, removedBy, revert, serializeStored, setComment, setOperation, toExport, toMarkdown, warningsOf,
} from "../src/lib/editorial/drafts.ts";

const NOW = "2026-11-07T22:00:00.000Z";
const HERO = "clients.hero.title.lead";

describe("editorial sections", () => {
  test("v0.3 registers every narrative tree the two pages render, in page order, then the shared chrome", () => {
    assert.deepEqual(EDITORIAL_SECTIONS.map((section) => section.prefix), [
      "clients.nav", "clients.hero", "clients.serviceGallery", "clients.reasons", "clients.previousWorks", "shared.builders.clients", "shared.people.clients",
      "clients.faq", "clients.inquiry", "clients.creed", "clients.meta",
      "community.nav", "community.hero", "community.guild", "community.capabilities", "community.raidaFeature", "community.moloch", "community.hats",
      "community.benefits", "shared.builders.community", "community.activity.collection", "community.join", "community.faq", "community.creed", "community.meta",
      "site.header", "site.hero", "site.ticker", "site.creed", "site.footer",
    ]);
    for (const section of EDITORIAL_SECTIONS) assert.ok(TREES[section.prefix], `${section.prefix} has its narrative tree in catalog.ts`);
    // No prefix contains another, so every id belongs to exactly one section.
    for (const a of EDITORIAL_SECTIONS) for (const b of EDITORIAL_SECTIONS) if (a !== b) assert.ok(!b.prefix.startsWith(`${a.prefix}.`), `${b.prefix} is inside ${a.prefix}`);
    assert.ok(isEditableId(HERO));
    assert.ok(isEditableId("clients.faq.items.0.answer"), "the FAQ is covered since v0.3");
    assert.ok(isEditableId("site.footer.copyright"));
    assert.ok(!isEditableId("clients.heroic.x"), "prefix match is by whole segment");
    assert.ok(!isEditableId("community.capabilities.cards.1.link.destination"), "destinations are review notes, not page text");
    assert.ok(!isEditableId("clients.capabilities.title.lead"), "a tree the pages do not render is not registered");
    assert.ok(!isEditableId(""));
  });

  test("every copy item of a registered tree is editable or excluded with a reason", () => {
    const excluded = [];
    for (const section of EDITORIAL_SECTIONS) {
      for (const copy of collectCopy(TREES[section.prefix])) {
        assert.equal(sectionFor(copy.id), section, `${copy.id} belongs to ${section.prefix}`);
        if (isEditableId(copy.id)) assert.equal(originals.get(copy.id), copy.text, `${copy.id} is in the catalog`);
        else { const reason = exclusionReason(copy.id); assert.ok(reason && reason.length > 20, `${copy.id} is excluded with a reason`); excluded.push(copy.id); }
      }
    }
    // The exclusions are review notes (link destinations), copy these pages do not render, and retired items.
    assert.ok(excluded.every((id) => /\.destination$|^clients\.inquiry\.(summary\.hint|summary\.hintOpen|coordinates\.\d|image\.alt)|^community\.guild\.metrics\.|^clients\.reasons\.items\.5\./.test(id)), excluded.join(", "));
    // v0.3 released with 295 editable fields; Tae's batch 02 retired Reason 6 (2 fields): 293 active;
    // the footer's Portal Blog link (owner, November 10) adds one: 294.
    assert.equal(originals.size, 294);
    const pages = { "/agency": 0, "/community": 0, shared: 0 };
    for (const id of originals.keys()) pages[sectionFor(id).page]++;
    assert.deepEqual(pages, { "/agency": 128, "/community": 143, shared: 23 });
  });

  test("a retired item keeps its ids (tombstone) and leaves the active registry; the others do not shift", () => {
    const { clientsReasons } = clientsNarrative;
    assert.equal(clientsReasons.items.length, 7, "Reason 6 stays in the source");
    assert.match(clientsReasons.items[5].retired ?? "", /2026-11-10/);
    assert.equal(clientsReasons.items[5].title.id, "clients.reasons.items.5.title");
    assert.equal(clientsReasons.items[6].title.id, "clients.reasons.items.6.title", "Reason 7 keeps its id");
    for (const id of ["clients.reasons.items.5.title", "clients.reasons.items.5.body"]) {
      assert.ok(!isEditableId(id) && !originals.has(id), id);
      assert.match(exclusionReason(id), /^Retired/);
    }
    assert.ok(isEditableId("clients.reasons.items.6.title"));
    // Never sent to the browser, in public or review builds; the other items keep their ids.
    for (const reviewing of [false, true]) {
      const sent = forAudience(clientsReasons, reviewing);
      assert.equal(sent.items.length, 6);
      assert.ok(!JSON.stringify(sent).includes("Progress you can see every week"));
      assert.equal(sent.items[5].title.id, "clients.reasons.items.6.title");
    }
    let all = 0;
    for (const section of EDITORIAL_SECTIONS) all += collectCopy(TREES[section.prefix]).filter((copy) => !/\.destination$/.test(copy.id)).length;
    assert.equal(all - 13, 296, "the 295 v0.3 ids are all still in the source, plus the Portal Blog link (13 = items these pages do not render)");
  });

  test("copy that is not shown as text is classified: alt text, screen-reader names, metadata", () => {
    assert.equal(kindOf("community.moloch.artwork.alt"), "alt");
    assert.equal(kindOf("clients.previousWorks.works.3.snapshot.alt"), "alt");
    assert.equal(kindOf("clients.inquiry.summary.label"), "accessible-name");
    assert.equal(kindOf("site.ticker.label"), "accessible-name");
    assert.equal(kindOf("clients.meta.description"), "metadata");
    assert.equal(kindOf(HERO), "visible");
    assert.equal(hiddenIds.length, 21);
    assert.ok(hiddenIds.every((id) => kindOf(id) !== "visible"));
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
    assert.equal(fieldLabel("clients.faq.items.2.answer", itemContext("clients.faq.items.2.answer")), `Question 3 (“${originals.get("clients.faq.items.2.question").replace(/\*\*/g, "")}”) · Answer`);
    assert.equal(fieldLabel("site.creed.statement.em"), "Statement, line 2");
    assert.equal(fieldLabel("site.footer.socials.1.label"), "Social link 2");
    assert.equal(fieldLabel("clients.meta.title"), "Page title (browser tab, search results)");
    assert.equal(fieldLabel("community.moloch.artwork.alt"), "Artwork · Image description");
    for (const id of originals.keys()) assert.doesNotMatch(fieldLabel(id), /\b(lead|em|dek|paths|cards|items|works|socials|shareTitle)\b/, `${id} → ${fieldLabel(id)}`);
  });

  test("the catalog holds every copy item of each section, in order", () => {
    for (const section of EDITORIAL_SECTIONS) {
      const ids = [...originals.keys()].filter((id) => sectionFor(id) === section);
      assert.ok(ids.length >= 1, `${section.prefix}: ${ids.length} items`);
    }
    assert.equal(originals.get(HERO), "Hard problems,");
    assert.equal(originals.get("community.hero.title.finale"), "together.");
    assert.equal(originals.get("site.hero.scrollCue"), "<<< SCROLL TO DESCEND");
    assert.ok([...originals.keys()].every(isEditableId));
    const order = [...sourceOrder.values()];
    assert.deepEqual(order, order.map((_, index) => index));
  });

  test("v0.2 ids keep working: the six v0.2 sections are unchanged in id, label and page", () => {
    const v02 = { "clients.hero": "Hero", "clients.serviceGallery": "Services gallery", "clients.reasons": "Why RaidGuild", "community.hero": "Hero", "community.capabilities": "Capabilities gallery", "community.join": "Join" };
    for (const [prefix, label] of Object.entries(v02)) {
      const section = EDITORIAL_SECTIONS.find((entry) => entry.prefix === prefix);
      assert.equal(section.label, label);
      assert.equal(section.page, prefix.startsWith("clients") ? "/agency" : "/community");
      for (const copy of collectCopy(TREES[prefix])) if (!/\.destination$/.test(copy.id) && !/^Retired/.test(exclusionReason(copy.id) ?? "")) assert.ok(isEditableId(copy.id), copy.id);
    }
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
    // v0.3: navigation, more calls to action and headings, hidden text, prices.
    assert.match(structuralReason("clients.nav.items.0.label", "REMOVE"), /navigation label/);
    assert.match(structuralReason("site.header.audiences.community", "REMOVE"), /navigation label/);
    assert.match(structuralReason("site.footer.socials.0.label", "REMOVE"), /button or link/);
    assert.match(structuralReason("community.activity.collection.actions.portal", "REMOVE"), /button or link/);
    assert.match(structuralReason("community.guild.more.summary", "REMOVE"), /button or link/);
    assert.match(structuralReason("clients.faq.items.0.question", "REMOVE"), /heading/);
    assert.equal(structuralReason("site.creed.statement.lead", "REMOVE"), null, "the creed's statement is copy, not a heading");
    assert.match(structuralReason("community.moloch.artwork.alt", "REMOVE"), /accessibility/);
    assert.match(structuralReason("site.ticker.label", "REMOVE"), /accessibility/);
    assert.match(structuralReason("clients.meta.description", "REMOVE"), /search or sharing/);
    assert.equal(structuralReason("clients.faq.items.0.answer", "REMOVE"), null, "an answer's text is copy");
    const PRICE = "community.benefits.cards.3.body";
    // Fixture: the card's text before Tae's batch 03 removed its price.
    const base = "An @raidguild.org address and Linktree access for $20 a month.";
    assert.doesNotMatch(originals.get(PRICE), /\$\d/, "the site no longer states a price here");
    assert.match(structuralReason(PRICE, "REPLACE", "item", { base: originals.get(PRICE), proposed: `${originals.get(PRICE)} $20 a month.` }), /price/, "adding a price is a price change");
    assert.match(structuralReason(PRICE, "REPLACE", "item", { base, proposed: base.replace("$20", "$25") }), /price/);
    assert.equal(structuralReason(PRICE, "REPLACE", "item", { base, proposed: `Now: ${base}` }), null, "rewording around an unchanged price is copy");
    assert.match(structuralReason(PRICE, "SHORTEN", "item", { base, proposed: "Guild email." }), /price/, "dropping a price is a price change");
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
    assert.match(markdown, new RegExp(`#### Reason 1 \\(“${originals.get("clients.reasons.items.0.title")}”\\) · Expanded text`));
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
