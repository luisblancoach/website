// Editorial Mode rich text (November 10): the inline format, its field policy,
// backward compatibility with every existing string, and link safety.
// Imported by editorial.test.mjs.
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { hasFormatting, inlineProblems, parseInline, plainText, printInline, safeHref } from "../src/lib/narrative/inline.ts";
import { formattingFor, isEditableId, kindOf } from "../src/lib/editorial/config.ts";
import { originals } from "../src/lib/editorial/catalog.ts";
import { applyEdit, setOperation, warningsOf } from "../src/lib/editorial/drafts.ts";

const NOW = "2026-11-10T22:00:00.000Z";
const ANSWER = "clients.faq.items.0.answer";
const TITLE = "clients.reasons.items.0.title";

describe("editorial rich text", () => {
  test("every copy string prints back unchanged and carries only the formatting its field takes", () => {
    for (const [id, text] of originals) {
      assert.equal(printInline(parseInline(text)), text, id);
      // Holds for applied editorial changes too: formatted prose is fine, formatting elsewhere or an unsafe link is not.
      assert.deepEqual(inlineProblems(text, formattingFor(id)), [], id);
    }
    assert.equal(plainText("**RaidGuild** runs as a DAO"), "RaidGuild runs as a DAO");
    assert.equal(plainText("[ THE GUILD ]"), "[ THE GUILD ]", "bracketed labels are not links");
    assert.equal(plainText("<<< SCROLL TO DESCEND"), "<<< SCROLL TO DESCEND");
  });

  test("the four marks, nesting, and unclosed markers", () => {
    const text = "A **bold _and italic_** word, ++underlined++, and [the **handbook**](https://handbook.raidguild.org/docs/) here.";
    const nodes = parseInline(text);
    assert.equal(printInline(nodes), text);
    assert.deepEqual(nodes.map((node) => node.type), ["text", "strong", "text", "u", "text", "link", "text"]);
    assert.equal(plainText(text), "A bold and italic word, underlined, and the handbook here.");
    assert.ok(hasFormatting(text));
    assert.equal(plainText("snake_case and a_b"), "snake_case and a_b", "underscores inside words stay text");
    assert.equal(plainText("an **unclosed bold"), "an **unclosed bold");
    assert.equal(plainText("[a [b](https://x.org)](https://y.org)").includes("https"), true, "a link inside a link is not created");
  });

  test("links: safe addresses only", () => {
    for (const ok of ["https://raidguild.org", "http://example.com/a?b=c#d", "mailto:hello@raidguild.org", "/agency", "/community#join", "#faq"]) assert.equal(safeHref(ok), ok, ok);
    for (const bad of ["javascript:alert(1)", "JAVASCRIPT:alert(1)", "data:text/html,<b>", "vbscript:x", "//evil.example", "https://", "ftp://x.org", "https://a b.org", "mailto:nobody", "https://x.org/\"onclick", "", "  "]) assert.equal(safeHref(bad), null, bad);
    assert.equal(plainText("[click](javascript:alert(1))"), "[click](javascript:alert(1))", "an unsafe link stays visible text, never a link");
    assert.deepEqual(parseInline("[click](javascript:alert(1))").map((node) => node.type), ["text"]);
  });

  test("formatting is limited to running prose; titles, labels and hidden text stay plain", () => {
    assert.deepEqual(formattingFor(ANSWER), { marks: true, links: true });
    for (const id of [TITLE, "clients.hero.title.lead", "clients.nav.items.0.label", "clients.faq.items.0.question", "clients.meta.description", "clients.previousWorks.works.0.snapshot.alt", "site.ticker.words.0"]) assert.deepEqual(formattingFor(id), { marks: false, links: false }, id);
    // Backward compatible: every field that already uses bold may keep it.
    for (const [id, text] of originals) if (text.includes("**")) assert.ok(formattingFor(id).marks, id);
    let prose = 0;
    for (const id of originals.keys()) if (formattingFor(id).marks) { prose++; assert.ok(isEditableId(id) && kindOf(id) === "visible", id); }
    assert.ok(prose >= 60, `${prose} prose fields take formatting`);
  });

  test("drafts warn about formatting a field does not take, and about unsafe links", () => {
    let drafts = applyEdit({}, ANSWER, "Share your goals with [our team](https://raidguild.org/) and _budget_.", originals.get(ANSWER), NOW);
    assert.deepEqual(warningsOf(drafts[ANSWER]), []);
    drafts = applyEdit(drafts, TITLE, "Small teams. **Clear** accountability", originals.get(TITLE), NOW);
    assert.match(warningsOf(drafts[TITLE]).join(), /plain text only/);
    drafts = applyEdit(drafts, ANSWER, "See [this](javascript:alert(1)).", originals.get(ANSWER), NOW);
    assert.match(warningsOf(drafts[ANSWER]).join(), /not allowed/);
    assert.deepEqual(inlineProblems("<b>bold</b>", formattingFor(ANSWER)), ["HTML is not allowed in copy."]);
  });

  test("Shorten counts words, not markers", () => {
    const base = originals.get(ANSWER);
    // The same words, only made bold: not shorter.
    let drafts = applyEdit({}, ANSWER, `**${base}**`, base, NOW);
    drafts = setOperation(drafts, ANSWER, "SHORTEN", base, { now: NOW });
    assert.match(warningsOf(drafts[ANSWER]).join(), /not shorter/);
  });
});
