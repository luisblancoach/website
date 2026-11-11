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
    assert.doesNotMatch(llms.toLowerCase(), /todo|placeholder|lorem ipsum/);
  });

  test("negotiates only explicit Markdown", () => {
    assert.equal(acceptsMarkdown("text/markdown"), true);
    assert.equal(acceptsMarkdown("text/html, text/markdown; q=0.8"), true);
    assert.equal(acceptsMarkdown("text/markdown;q=0, text/html"), false);
    assert.equal(acceptsMarkdown("text/html,*/*"), false);
  });

  test("limits Markdown to intentional routes", () => {
    assert.match(markdownForPath("/") ?? "", /# RaidGuild/);
    assert.match(markdownForPath("/join/") ?? "", /# Join/);
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
