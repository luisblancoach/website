import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { communityNarrative } from "../src/lib/narrative/community.ts";
import { clientsNarrative } from "../src/lib/narrative/clients.ts";
import { sharedNarrative } from "../src/lib/narrative/shared.ts";
import { entryGuild, entryHero } from "../src/lib/narrative/entry.ts";
import { clientData } from "../src/lib/data/clients.ts";
import { collectCopy, reviewFlagsEnabled } from "../src/lib/narrative/types.ts";

// Lines that appear verbatim in Tae's approved narrative direction. Nothing else
// may carry the "tae-brief" source.
const TAE_BRIEF = new Set([
  "The guild for", "serious Web3 builders",
  "Freelance work", "versus real ownership",
  "Enter a cohort", "Take a raid", "Earn ownership",
  "Join the DAO", "Join", "the DAO",
  "Turn complex technology", "into products people can use",
  "Design", "Engineering", "Product thinking",
  "Tell us what you're building", "Tell us what", "you're building", "Explore our work",
]);

// Topics that must never ship unflagged unless they are Tae's own words.
// "share" counts only in the ownership sense (shares, a share, share of/in), not the verb.
const SENSITIVE = /\b(shares|a share|share (?:of|in)|votes?|voting|ragequit|treasury|equity|govern\w*|stake|wxDAI|\$RAID|champion|proposal|apprentice|members? hold|ownership)\b|\d+%/i;

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

const all = { community: collectCopy(communityNarrative), clients: collectCopy(clientsNarrative), shared: collectCopy(sharedNarrative) };
const everything = [...all.community, ...all.clients, ...all.shared];

describe("all narratives", () => {
  test("ids are unique across clients, community and shared content", () => {
    const ids = everything.map((copy) => copy.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const [prefix, list] of Object.entries(all)) assert.ok(list.every((copy) => copy.id.startsWith(`${prefix}.`)), prefix);
  });

  test("only Tae's verbatim lines carry her approval", () => {
    for (const copy of everything.filter((item) => item.source === "tae-brief")) {
      assert.ok(TAE_BRIEF.has(copy.text), `${copy.id}: “${copy.text}”`);
      assert.equal(copy.status, "approved");
    }
  });

  test("October 23 copy is never approved", () => {
    for (const copy of everything.filter((item) => item.source === "oct23-iteration")) assert.equal(copy.status, "needs-review", copy.id);
  });

  test("sensitive statements stay flagged as claims", () => {
    for (const copy of everything) {
      if (copy.source === "tae-brief" || !SENSITIVE.test(copy.text)) continue;
      assert.equal(copy.status, "needs-review", `${copy.id}: “${copy.text}”`);
      assert.equal(copy.reason, "claim", copy.id);
    }
  });

  test("no placeholder or filler text", () => {
    for (const copy of everything) assert.doesNotMatch(copy.text, /placeholder|forthcoming|being prepared|lorem|tbd|coming soon/i, copy.id);
  });

  test("every Portal join link records its destination as a claim", () => {
    const links = [];
    const walk = (node) => { if (node && typeof node === "object") { if (node.href === "https://portal.raidguild.org/join" && node.label) links.push(node); Object.values(node).forEach(walk); } };
    walk(communityNarrative);
    assert.ok(links.length >= 5);
    for (const link of links) assert.equal(link.destination?.status, "needs-review", link.label.id);
  });
});

describe("clients narrative", () => {
  test("Tae's headline and calls to action are present", () => {
    const { clientsHero, clientsInquiry, clientsCreed, clientsNav } = clientsNarrative;
    assert.equal(`${clientsHero.title.lead.text} ${clientsHero.title.em.text}`, "Turn complex technology into products people can use");
    assert.deepEqual(clientsHero.paths.map((p) => p.label.text), ["Tell us what you're building", "Explore our work"]);
    assert.equal(clientsHero.paths[0].section, "project-inquiry");
    assert.equal(`${clientsInquiry.title.lead.text} ${clientsInquiry.title.em.text}`, "Tell us what you're building");
    assert.equal(clientsCreed.cta.label.text, "Tell us what you're building");
    assert.equal(clientsNav.cta.label.text, "Tell us what you're building");
  });

  test("capabilities use Tae's three pillars over the published services", () => {
    const { pillars } = clientsNarrative.clientsCapabilities;
    assert.deepEqual(pillars.map((p) => p.title.text), ["Design", "Engineering", "Product thinking"]);
    const titles = pillars.flatMap((p) => p.services.map((s) => s.title.text));
    assert.deepEqual([...titles].sort(), ["AI Solutions & Automation", "DAO Consulting & Governance", "Full-Stack Development", "Marketing & Content Strategy", "Product & System Design"]);
    for (const p of pillars) for (const s of p.services) assert.equal(s.title.status, "needs-review");
  });

  test("previous works come only from the existing archive and stay flagged", () => {
    const { works } = clientsNarrative.clientsPreviousWorks;
    assert.deepEqual(works.map((w) => w.id), ["daohaus", "brightid", "hypercerts"]);
    for (const work of works) {
      assert.ok(clientData.some((record) => record.id === work.id && record.logo === work.logo), work.id);
      for (const field of [work.company, work.title, work.description]) assert.equal(field.reason, "claim", field.id);
      assert.equal(work.images.length, 0, "no unapproved screenshots");
    }
  });

  test("no outcome metrics are carried into case studies", () => {
    for (const work of clientsNarrative.clientsPreviousWorks.works) {
      assert.doesNotMatch(`${work.title.text} ${work.description.text}`, /\$|\d+x|\d+%|million|\bM\b/);
    }
  });
});

describe("community additions", () => {
  test("Queen Raida links to the chat and flags artwork rights", () => {
    const raida = communityNarrative.communityQueenRaida;
    assert.equal(raida.cta.href, "/chat");
    assert.equal(raida.cta.label.text, "Ask Queen Raida");
    assert.equal(raida.artwork.rights.status, "needs-review");
    assert.equal(raida.artwork.rights.reason, "claim");
    assert.equal(raida.value.reason, "claim");
  });

  test("the Hats note is a sourced claim", () => {
    const hats = communityNarrative.communityStewardship.hats;
    assert.equal(hats.body.reason, "claim");
    assert.match(hats.body.sourceUrl, /handbook\.raidguild\.org\/docs\/dao-operations\/dao-roles/);
  });
});
