import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { communityNarrative } from "../src/lib/narrative/community.ts";
import { clientsNarrative } from "../src/lib/narrative/clients.ts";
import { sharedNarrative } from "../src/lib/narrative/shared.ts";
import { entryGuild, entryHero } from "../src/lib/narrative/entry.ts";
import { services } from "../src/lib/data/content.ts";
import { activeSpears } from "../src/lib/data/venture.ts";
import { caseStudyProjects } from "../src/lib/data/caseStudies.ts";
import { PORTAL_JOIN_URL } from "../src/lib/data/constants.ts";
import { HATS_TREE_URL, featuredHats, hatImageSize, hatsParent, hatsRoles } from "../src/lib/data/hats.ts";
import { molochArtwork, queenRaidaArtwork } from "../src/lib/data/illustrations.ts";
import { collectCopy, reviewFlagsEnabled } from "../src/lib/narrative/types.ts";
import { existsSync } from "node:fs";

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
  "Livepeer provides decentralized infrastructure for video and AI processing. RaidGuild helped maintain its Explorer and analyzed the staking and delegation experience to identify usability gaps and guide interface improvements.",
  "Pocket Network connects applications to blockchain data through a decentralized network. RaidGuild built wrapped POKT infrastructure and gateway setup tools, including a CLI for wallet creation, staking, and delegation, alongside development of the Gateway OS frontend.",
  // Case-study copy supplied on October 28.
  "YieldNest develops liquid restaking products that put staked assets to work across DeFi. RaidGuild contributed smart contract engineering, including refactoring deployment scripts to support new baskets of assets and helping its developers take over the resulting tools.",
  "Hypercerts creates onchain records of impactful work, helping funders understand and support contributions. RaidGuild contributed application and smart contract development to the infrastructure behind those records.",
  "DAOhaus provides tools for launching DAOs, voting on proposals, and managing shared treasuries. RaidGuild modernized its admin app, simplified its codebase and dependencies, and delivered maintenance documentation, operational runbooks, and AI-assisted development workflows with human review.",
  "BrightID helps applications verify that users are unique people while protecting their privacy. RaidGuild built Aura’s MetaNode graph explorer, including tools for labeling identities and assessing reputation, giving community verifiers more context for identifying trustworthy participants.",
  "Daedalus builds custom software and practical AI systems for businesses. RaidGuild delivered a client quote generator and integrated Coinbase embedded wallets, supporting both its business operations and wallet-enabled product development.",
  "RaidGuild contributed development and UX work to Problem Media’s Good Game platform, helping bring the application toward delivery.",
  "Funding public goods through open-source tools and community coordination. RaidGuild contributed Passport–Snapshot validation work, Moloch-themed creative projects, and development support via our Skunk Squad.",
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
    assert.equal(`${communityHero.title.lead.text} ${communityHero.title.em.text}`, "Find your people. Build something together.");
    assert.equal(communityHero.eyebrow.text, "[ THE GUILD ]");
    assert.equal(`${communityTension.title.lead.text} ${communityTension.title.em.text}`, "Freelance work versus real ownership");
    assert.deepEqual(communityPath.steps.map((step) => step.title.text), ["Enter a cohort", "Take a raid", "Earn ownership"]);
      assert.equal(communityHero.paths[0].label.text, "Explore the community");
      assert.equal(communityHero.paths[1].label.text, "See what we’re building");
      assert.equal(communityHero.paths[1].section, "work");
      assert.equal(`${communityJoin.title.lead.text} ${communityJoin.title.em.text}`, "Your first step into the Guild.");
      assert.equal(communityJoin.body.text, "Create a Portal profile to explore sessions, projects, and posts. Meet the community on Discord, and read the membership guide when you’re ready to learn how joining the DAO works.");
      assert.equal(communityJoin.actions[0].label.text, "Create your Portal profile");
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
      if (copy.source === "handbook") assert.match(copy.sourceUrl ?? "", /^https:\/\/(?:handbook\.raidguild\.org\/docs|rg-handbook-nextra\.vercel\.app)\//, `${copy.id} needs a handbook URL`);
      if (copy.source === "portal") assert.match(copy.sourceUrl ?? "", /^https:\/\/portal\.raidguild\.org\//, `${copy.id} needs a Portal URL`);
    }
  });

  test("every community CTA records its intended destination", () => {
    const { communityHero, communityNav, communityCreed } = communityNarrative;
    const joins = [communityHero.paths[0], communityNav.cta, communityCreed.cta];
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
  test("shows on previews, hides locally and in production", () => {
    assert.equal(reviewFlagsEnabled({ NODE_ENV: "development" }), false);
    assert.equal(reviewFlagsEnabled({ NODE_ENV: "development", SHOW_REVIEW_FLAGS: "true" }), true);
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
    assert.ok(links.length >= 4);
    for (const link of links) assert.equal(link.destination?.status, "needs-review", link.label.id);
  });
});

describe("clients narrative", () => {
  test("the October 27 headline and Tae's calls to action are present", () => {
    const { clientsHero, clientsInquiry, clientsCreed, clientsNav } = clientsNarrative;
    assert.equal(`${clientsHero.title.lead.text} ${clientsHero.title.em.text}`, "Hard problems, working products");
    assert.equal(clientsHero.title.lead.source, "oct27-design");
    assert.equal(clientsHero.title.plain, true);
    assert.deepEqual(clientsHero.paths.map((p) => p.label.text), ["Tell us what you're building", "Explore our work"]);
    assert.equal(clientsHero.paths[0].section, "project-inquiry");
    assert.equal(`${clientsInquiry.title.lead.text} ${clientsInquiry.title.em.text}`, "Tell us what you're building");
    assert.equal(clientsCreed.cta.label.text, "Tell us what you're building");
    assert.equal(clientsNav.cta.label.text, "Build with us", "the navigation CTA was shortened by the owner");
    assert.equal(clientsNav.cta.label.source, "owner-approval");
    assert.equal(clientsNav.cta.section, "project-inquiry", "the navigation CTA still opens the inquiry");
  });

  test("capabilities list the published services in order, grouped by Tae's three pillars", () => {
    const { services: listed, pillars } = clientsNarrative.clientsCapabilities;
    assert.deepEqual(listed.map((s) => s.title.text), services.map((s) => s.title), "the October 23 accordion follows the published order");
    for (const s of listed) assert.equal(s.title.reason, "claim", s.title.id);
    assert.deepEqual(pillars.map((p) => p.title.text), ["Design", "Engineering", "Product thinking"]);
    assert.deepEqual(pillars.flatMap((p) => p.services).sort(), services.map((s) => s.title).sort(), "every service sits under exactly one pillar");
  });

  test("specialist practices carry their existing artwork", () => {
    for (const practice of clientsNarrative.clientsCapabilities.practices) {
      assert.ok(activeSpears.some((spear) => spear.title === practice.title.text && spear.art === practice.image.src), practice.title.id);
    }
  });

  test("services: the October 27 layout over the published services, in order", () => {
    const { clientsServices } = clientsNarrative;
    assert.equal(`${clientsServices.title.lead.text} ${clientsServices.title.em.text}`, "What are you trying to ship?");
    assert.deepEqual(clientsServices.services.map((s) => s.title.text), services.map((s) => s.title), "the accordion keeps the published order");
    for (const s of clientsServices.services) assert.equal(s.title.reason, "claim", s.title.id);
    assert.equal(clientsServices.cta.section, "project-inquiry");
    assert.equal(clientsServices.intro[1].text, "Owners, not vendors: we turn shared experience into focused offerings with end dates of their own.");
    assert.equal(clientsServices.intro[1].source, "owner-approval", "the corrected sentence was approved by the owner");
    assert.equal(clientsNarrative.clientsCapabilities.title.lead.text, "Ideas into", "/community keeps the October 23 capabilities");
  });

  test("previous works: the nine supplied projects, each with its button, screenshot and site", () => {
    const { works } = clientsNarrative.clientsPreviousWorks;
    assert.deepEqual(works.map((w) => w.id), caseStudyProjects.map((p) => p.id));
    assert.deepEqual(works.map((w) => w.id), ["daohaus", "daedalus", "brightid", "livepeer", "hypercerts", "pocket", "problem", "gitcoin", "yieldnest"]);
    for (const work of works) {
      assert.ok(existsSync(new URL(`../public${work.button}`, import.meta.url)), work.button);
      assert.ok(existsSync(new URL(`../public${work.snapshot.src}`, import.meta.url)), work.snapshot.src);
      assert.match(work.link.href, /^https:\/\//, work.id);
      assert.doesNotMatch(work.link.href, /portal\.raidguild\.org|raidguild\.org/, "Read more opens the project's own site");
      assert.equal(work.pending, undefined, work.id);
    }
    const href = Object.fromEntries(works.map((w) => [w.id, w.link.href]));
    assert.equal(href.daedalus, "https://ddls.co");
    assert.equal(href.livepeer, "https://livepeer.org");
    assert.equal(href.pocket, "https://pocket.network");
  });

  test("every project describes RaidGuild's work in Tae's supplied copy", () => {
    const byId = Object.fromEntries(clientsNarrative.clientsPreviousWorks.works.map((w) => [w.id, w]));
    for (const work of clientsNarrative.clientsPreviousWorks.works) {
      assert.equal(work.description.source, "tae-brief", work.id);
      assert.equal(work.description.status, "approved", work.id);
      assert.equal(work.title, undefined, `${work.id}: the archive titles were replaced with the descriptions`);
    }
    assert.match(byId.daedalus.description.text, /^Daedalus builds custom software and practical AI systems for businesses\./);
    assert.match(byId.brightid.description.text, /Aura’s MetaNode graph explorer/);
    assert.match(byId.gitcoin.description.text, /^Funding public goods .* Skunk Squad\.$/);
    assert.equal(byId.daedalus.name.text, "Daedalus");
    assert.ok(!byId.ud && !byId.gnosis, "Ultimate Dominion and Gnosis are not in this showcase");
  });

  test("no outcome metrics are carried into case studies", () => {
    // Dollar amounts, multipliers and percentages; a "$" ticker such as $POKT is not a metric.
    for (const work of clientsNarrative.clientsPreviousWorks.works) {
      assert.doesNotMatch(`${work.title?.text ?? ""} ${work.description?.text ?? ""}`, /\$\d|\d+x\b|\d+%|million|\bM\b/);
    }
  });
});

describe("Join the DAO iteration (/community)", () => {
  test("the main call to action keeps its destination; navigation and creed read Join our community", () => {
    const { communityHero, communityNav, communityCreed } = communityNarrative;
    const primary = communityHero.paths.find((path) => path.primary);
    assert.equal(primary.label.text, "Explore the community");
    assert.equal(primary.href, PORTAL_JOIN_URL);
    assert.equal(communityNav.cta.label.text, "Join our community");
    assert.equal(communityNav.cta.href, PORTAL_JOIN_URL);
    assert.equal(communityCreed.cta.label.text, "Join our community");
  });

  test("About RaidGuild is restored from f842d87", () => {
    const guild = communityNarrative.communityGuild;
    assert.equal(`${guild.title.lead.text} ${guild.title.em.text}`, "Builder-owned member-governed");
    assert.match(guild.body.text, /runs as a DAO with no single leader/);
    assert.equal(guild.kit.heading.text, "Your Guild kit");
    assert.equal(guild.kit.items.length, 4);
  });

  test("Moloch is its own feature: October 29 title with the logo, October 28 body verbatim", () => {
    const moloch = communityNarrative.communityMoloch;
    assert.equal(`${moloch.title.lead.text} ${moloch.title.em.text}`, "Together we slay Moloch +");
    assert.equal(moloch.titleMark.src, "/images/venture/hats/raidguild.png", "the supplied RaidGuild logo, not text");
    assert.equal(moloch.titleMark.alt.text, "RaidGuild");
    assert.match(moloch.body.text, /^In RaidGuild lore, Moloch represents coordination failure/);
    assert.equal(moloch.cta.label.text, "Find your path into the Guild");
  });

  test("Queen Raida feature uses the approved copy", () => {
    const raida = communityNarrative.communityRaidaFeature;
    assert.equal(`${raida.title.lead.text} ${raida.title.em.text}`, "A scout for signal. A scribe for the Guild.");
    assert.equal(raida.body.text, "Queen Raida is RaidGuild’s AI agent. She helps spot useful developments, gather context, and turn the Guild’s work into clear updates, drafts, and next steps - giving members more room for the work that needs human judgment: choosing what matters, building trust, and making decisions.");
    assert.equal(raida.body.source, "owner-approval");
  });

  test("the Hats Tree section carries the Hats Tree and stewardship copy and links to tree 1822", () => {
    const hats = communityNarrative.communityHats;
    assert.equal(`${hats.title.lead.text} ${hats.title.em.text}`, "RaidGuild's Hats Tree");
    assert.match(hats.intro.text, /powered by Hats Protocol/);
    assert.match(hats.stewards.detail.text, /^Stewards are members who take responsibility/);
    assert.match(hats.snapshot.text, /Reference snapshot/);
  });

  test("the Hats Tree section has one link: the full tree on Hats Protocol", () => {
    const hats = communityNarrative.communityHats;
    assert.equal(hats.treeLink.label.text, "Explore the Hats Tree");
    assert.equal(hats.treeLink.href, "https://app.hatsprotocol.xyz/trees/100/1822");
    // October 29 follow-up: no "Also in the tree" list, role details, pill CTA or extra links.
    for (const field of ["moreLabel", "descriptions", "cta", "links"]) assert.equal(field in hats, false, field);
  });
});

describe("October 29 artwork contract", () => {
  const png = (path) => {
    const buf = readFileSync(new URL(`../public${path}`, import.meta.url));
    assert.equal(buf.toString("ascii", 1, 4), "PNG", path);
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20), alpha: buf[25] === 6 || buf[25] === 4 };
  };

  test("the Hats tree: parent 1822, nine roles, five featured in the owner's order", () => {
    assert.equal(hatsParent.id, "1822");
    assert.deepEqual(hatsRoles.map((role) => role.id), ["1822.1", "1822.2", "1822.3", "1822.4", "1822.5", "1822.6", "1822.7", "1822.8", "1822.9"]);
    assert.deepEqual(featuredHats.map((role) => role.name), ["Knowledge Steward", "Infrastructure Steward", "Sync Steward", "Participation Steward", "Brand Steward"]);
    assert.equal(HATS_TREE_URL, "https://app.hatsprotocol.xyz/trees/100/1822");
  });

  test("each featured hat has the owner's 600 × 600 PNG and its own accent; the parent is the RaidGuild mark", () => {
    for (const role of featuredHats) {
      assert.equal(role.image, `/images/venture/hats/${role.slug}.png`);
      assert.deepEqual(png(role.image), { ...hatImageSize, alpha: true }, role.slug);
    }
    assert.equal(new Set(featuredHats.map((role) => role.accent)).size, 5);
    assert.equal(hatsParent.image, "/images/venture/hats/raidguild.png");
    assert.deepEqual(png(hatsParent.image), { width: hatsParent.width, height: hatsParent.height, alpha: true });
  });

  test("Queen Raida and Moloch: desktop, rectangle and mobile cuts exist with their declared sizes", () => {
    for (const artwork of [queenRaidaArtwork, molochArtwork]) {
      for (const cut of [artwork.desktop, artwork.rectangle, artwork.mobile]) {
        const { width, height } = png(cut.src);
        assert.deepEqual({ width, height }, { width: cut.width, height: cut.height }, cut.src);
        assert.match(cut.src, /^\/images\/venture\/entities\/(queen-raida|moloch)\//);
      }
      assert.ok(artwork.desktop.width / artwork.desktop.height > 2, "wide horizontal desktop cut");
      assert.ok(Math.abs(artwork.rectangle.width / artwork.rectangle.height - 16 / 9) < .01, "16:9 rectangle");
      assert.ok(artwork.mobile.height > artwork.mobile.width, "vertical mobile cut");
    }
  });
});

describe("steward-supplied copy", () => {
  test("the steward's B3.4 lines were replaced by the owner's October 29 copy", () => {
    const lines = collectCopy([communityNarrative, clientsNarrative, sharedNarrative]).filter((copy) => copy.source === "steward-brief");
    assert.equal(lines.length, 0);
    assert.equal(communityNarrative.communityActivity.collection.intro.text, "Games, tools, digital experiences, and field notes from Guild members. Explore what they made, how they approached it, and what they learned.");
    assert.equal(communityNarrative.communityActivity.collection.intro.source, "owner-approval");
  });

  test("the gallery heading is the owner's October 29 line; its anchor and nav label are unchanged", () => {
    const { collection } = communityNarrative.communityActivity;
    assert.equal(`${collection.title.lead.text} ${collection.title.em.text}`, "What happens when builders follow their curiosity.");
    assert.equal(communityNarrative.communityNav.items.find((item) => item.section === "work")?.label.text, "Projects");
  });
});

describe("community additions", () => {
  test("Queen Raida links to the chat; its artwork carries the owner's approval", () => {
    const raida = communityNarrative.communityQueenRaida;
    assert.equal(raida.cta.href, "/chat");
    assert.equal(raida.cta.label.text, "Ask our AI CTO", "the October 23 carousel is kept as-is");
    assert.equal(raida.artwork.rights.status, "approved");
    assert.equal(raida.artwork.rights.source, "owner-approval");
    assert.equal(raida.artwork.src, "/images/venture/entities/queen-raida/queen-rectangle.png", "the owner's current artwork");
    assert.ok(existsSync(new URL(`../public${raida.artwork.src}`, import.meta.url)), "the artwork ships with the build");
  });

  test("Queen Raida keeps the three October 23 panels, with capability statements flagged", () => {
    const raida = communityNarrative.communityQueenRaida;
    assert.deepEqual(raida.panels.map((p) => p.title.text), ["Meet Queen Raida.", "Follow the thread.", "Find your way in."]);
    for (const panel of raida.panels) assert.equal(panel.copy.reason, "claim", panel.copy.id);
  });

  test("the Hats note is a sourced claim", () => {
    const hats = communityNarrative.communityStewardship.hats;
    assert.equal(hats.body.reason, "claim");
    assert.match(hats.body.sourceUrl, /handbook\.raidguild\.org\/docs\/dao-operations\/dao-roles/);
  });
});
