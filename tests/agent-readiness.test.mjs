import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { AI_CRAWLERS, CONTENT_SIGNAL, ROBOTS_TEXT, acceptsMarkdown, appendDiscoveryLinks, isInternalNextRequest, markdownForPath, mergeVary } from "../src/lib/agent-readiness.ts";

describe("agent readiness", () => {
  test("allows named crawlers with a no-training signal", () => {
    for (const crawler of AI_CRAWLERS) assert.equal(ROBOTS_TEXT.match(new RegExp(`User-agent: ${crawler}`, "g"))?.length, 1);
    assert.match(ROBOTS_TEXT, new RegExp(`Content-Signal: ${CONTENT_SIGNAL}`));
    assert.doesNotMatch(ROBOTS_TEXT, /Disallow:/);
  });

  test("keeps llms.txt useful", async () => {
    const llms = await readFile("public/llms.txt", "utf8");
    assert.ok(llms.startsWith("# RaidGuild"));
    assert.match(llms, /https:\/\/portal\.raidguild\.org\/join/);
    // Both audience pages are listed (November 10).
    assert.match(llms, /\[Hire the DAO \(homepage\)\]\(https:\/\/www\.raidguild\.org\/\)/);
    assert.doesNotMatch(llms, /raidguild\.org\/agency|raidguild\.org\/#/, "no retired routes or anchors");
    assert.match(llms, /https:\/\/www\.raidguild\.org\/community/);
    assert.doesNotMatch(llms.toLowerCase(), /todo|placeholder|lorem ipsum/);
  });

  test("negotiates only explicit Markdown", () => {
    assert.equal(acceptsMarkdown("text/markdown"), true);
    assert.equal(acceptsMarkdown("text/html, text/markdown; q=0.8"), true);
    assert.equal(acceptsMarkdown("text/markdown;q=0, text/html"), false);
    assert.equal(acceptsMarkdown("text/html,*/*"), false);
  });

  test("limits Markdown to intentional routes", () => {
    // "/" and "/join" serve the page itself (November 10): no separate, stale Markdown copy.
    assert.equal(markdownForPath("/"), undefined);
    assert.equal(markdownForPath("/join/"), undefined);
    assert.match(markdownForPath("/witch/") ?? "", /# The RaidGuild Witch/);
    assert.equal(markdownForPath("/api/contact"), undefined);
  });

  test("preserves and deduplicates headers", () => {
    const preload = '</font.woff2>; rel="preload"; as="font"';
    const once = appendDiscoveryLinks(preload);
    assert.match(once, /font\.woff2/);
    assert.equal(appendDiscoveryLinks(once), once);
    assert.equal(mergeVary("RSC, accept", "Accept"), "RSC, accept");
  });

  test("excludes Next internal requests", () => {
    assert.equal(isInternalNextRequest(new Headers({ rsc: "1" })), true);
    assert.equal(isInternalNextRequest(new Headers()), false);
  });
});

// Search and structured-data checks (November 10); run through this file because the test list lives in package.json.
import "./seo.test.mjs";
