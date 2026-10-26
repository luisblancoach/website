import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { communityNarrative } from "../src/lib/narrative/community.ts";
import { entryGuild, entryHero } from "../src/lib/narrative/entry.ts";
import { collectCopy, reviewFlagsEnabled } from "../src/lib/narrative/types.ts";

// Lines that appear verbatim in Tae's approved narrative direction. Nothing else
// may carry the "tae-brief" source.
const TAE_BRIEF = new Set([
  "The guild for", "serious Web3 builders",
  "Freelance work", "versus real ownership",
  "Enter a cohort", "Take a raid", "Earn ownership",
  "Join the DAO", "Join", "the DAO",
]);

// Topics that must never ship unflagged unless they are Tae's own words.
const SENSITIVE = /\b(shares?|votes?|voting|ragequit|treasury|equity|govern\w*|stake|wxDAI|\$RAID|champion|proposal|apprentice|members? hold)\b|\d+%/i;

const community = collectCopy(communityNarrative);

describe("community narrative", () => {
  test("every copy item has a unique id", () => {
    const ids = community.map((copy) => copy.id);
    assert.ok(ids.every((id) => id.startsWith("community.")), "ids are namespaced");
    assert.equal(new Set(ids).size, ids.length);
  });

  test("only Tae's verbatim lines are attributed to the brief", () => {
    for (const copy of community.filter((item) => item.source === "tae-brief")) {
      assert.ok(TAE_BRIEF.has(copy.text), `${copy.id} is not in the brief: “${copy.text}”`);
      assert.equal(copy.status, "approved");
    }
  });

  test("the headline lines from the brief are present and approved", () => {
    const { communityHero, communityTension, communityPath, communityJoin } = communityNarrative;
    assert.equal(`${communityHero.title.lead.text} ${communityHero.title.em.text}`, "The guild for serious Web3 builders");
    assert.equal(`${communityTension.title.lead.text} ${communityTension.title.em.text}`, "Freelance work versus real ownership");
    assert.deepEqual(communityPath.steps.map((step) => step.title.text), ["Enter a cohort", "Take a raid", "Earn ownership"]);
    assert.equal(communityJoin.actions[0].label.text, "Join the DAO");
  });

  test("ownership, governance and membership statements stay flagged", () => {
    for (const copy of community) {
      if (copy.source === "tae-brief" || !SENSITIVE.test(copy.text)) continue;
      assert.equal(copy.status, "needs-review", `${copy.id} states a sensitive fact without review: “${copy.text}”`);
      assert.equal(copy.reason, "claim", `${copy.id} should be flagged as a claim`);
    }
  });

  test("every unresolved item explains what to confirm, and sourced claims cite their source", () => {
    for (const copy of community.filter((item) => item.status === "needs-review")) {
      assert.ok(copy.note && copy.note.length > 20, `${copy.id} needs a review note`);
      if (copy.source === "handbook") assert.match(copy.sourceUrl ?? "", /^https:\/\/handbook\.raidguild\.org\/docs\//, `${copy.id} needs a handbook URL`);
      if (copy.source === "portal") assert.match(copy.sourceUrl ?? "", /^https:\/\/portal\.raidguild\.org\//, `${copy.id} needs a Portal URL`);
    }
  });

  test("every Join the DAO link records its interim destination as a claim", () => {
    const { communityHero, communityGuild, communityJoin } = communityNarrative;
    const joins = [...communityHero.paths, ...communityGuild.actions, ...communityJoin.actions].filter((link) => link.label.text === "Join the DAO");
    assert.equal(joins.length, 3);
    for (const link of joins) {
      assert.equal(link.href, "https://portal.raidguild.org/join");
      assert.equal(link.destination?.status, "needs-review");
    }
  });

  test("the unsupported equity line is not used on /community", () => {
    assert.ok(!community.some((copy) => /equity/i.test(copy.text)));
  });
});

describe("entry copy", () => {
  test("/ keeps its published copy verbatim", () => {
    assert.equal(`${entryHero.title.lead.text} ${entryHero.title.em.text}`, "VENTURE BEYOND");
    assert.ok(collectCopy([entryHero, entryGuild]).every((copy) => copy.status === "approved" && copy.source === "existing-site"));
  });
});

describe("review flag visibility", () => {
  test("shows locally and on previews, hides in production", () => {
    assert.equal(reviewFlagsEnabled({ NODE_ENV: "development" }), true);
    assert.equal(reviewFlagsEnabled({ NODE_ENV: "production" }), false);
    assert.equal(reviewFlagsEnabled({ NODE_ENV: "production", VERCEL_ENV: "production" }), false);
    assert.equal(reviewFlagsEnabled({ NODE_ENV: "production", VERCEL_ENV: "preview" }), true);
    assert.equal(reviewFlagsEnabled({ NODE_ENV: "production", RAILWAY_ENVIRONMENT_NAME: "production" }), true);
    assert.equal(reviewFlagsEnabled({ NODE_ENV: "production", RAILWAY_ENVIRONMENT_NAME: "production", SHOW_REVIEW_FLAGS: "false" }), false);
    assert.equal(reviewFlagsEnabled({ NODE_ENV: "production", SHOW_REVIEW_FLAGS: "true" }), true);
  });
});
