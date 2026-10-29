import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { forAudience } from "../src/lib/narrative/public.ts";
import { clientsNarrative } from "../src/lib/narrative/clients.ts";
import { communityNarrative } from "../src/lib/narrative/community.ts";

// What leaves the server in production: no review notes, sources, statuses or
// pending entries (they would otherwise sit in the page payload and bundles).
describe("public narrative content", () => {
  const publicTree = forAudience({ clientsNarrative, communityNarrative }, false);
  const json = JSON.stringify(publicTree);

  test("production copy carries no review metadata", () => {
    assert.doesNotMatch(json, /"note"|"sourceUrl"|"reason"|needs-review|oct23-iteration|"pending"/);
    assert.doesNotMatch(json, /Confirm the scope and permission|returns 404/);
  });

  test("published text and ids are kept", () => {
    const works = publicTree.clientsNarrative.clientsPreviousWorks.works;
    assert.deepEqual(works.map((w) => w.id), ["daohaus", "daedalus", "brightid", "livepeer", "hypercerts", "pocket", "problem", "gitcoin", "yieldnest"]);
    assert.equal(works[0].description.id, "clients.previousWorks.works.0.description");
    assert.equal(works[0].link.href, "https://daohaus.org/");
    assert.equal(publicTree.communityNarrative.communityQueenRaida.artwork.src, "/images/queen-raida/queen-raida-v2.png");
  });

  test("pending works are dropped in production", () => {
    const pending = { text: "Source not public", status: "needs-review", source: "portal", reason: "claim", note: "hidden" };
    const tree = forAudience({ works: [{ id: "shown" }, { id: "hidden", pending }] }, false);
    assert.deepEqual(tree.works.map((w) => w.id), ["shown"]);
  });

  test("review builds keep the full tree", () => {
    const review = forAudience(clientsNarrative, true);
    assert.equal(review, clientsNarrative);
  });

  test("client components never import narrative content modules", () => {
    const files = [];
    const walk = (dir) => readdirSync(dir).forEach((name) => {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (/\.tsx?$/.test(p)) files.push(p);
    });
    walk(new URL("../src/components", import.meta.url).pathname);
    // entry.ts holds only published, approved copy, so the "/" inquiry may import it.
    const offenders = files.filter((f) => { const s = readFileSync(f, "utf8"); return s.includes('"use client"') && /lib\/narrative\/(clients|community|shared)["']/.test(s); });
    assert.deepEqual(offenders, []);
  });
});
