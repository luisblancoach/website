import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { AUDIENCES, audienceForPath, legacyAudienceRedirect, sectionHref } from "../src/lib/venture-routes.ts";
import nextConfig from "../next.config.ts";

const redirect = (href) => legacyAudienceRedirect(new URL(href))?.href ?? null;

describe("audience routes", () => {
  test("audience switch labels and destinations", () => {
    // November 10: Hire the DAO is the root page.
    assert.deepEqual(AUDIENCES.map((a) => [a.label, a.href]), [["Hire the DAO", "/"], ["Join the DAO", "/community"]]);
    assert.equal(audienceForPath("/"), "clients");
    // /agency and /clients are redirects now (next.config.ts), not audience routes.
    assert.equal(audienceForPath("/agency"), null);
    assert.equal(audienceForPath("/clients"), null);
    assert.equal(audienceForPath("/community"), "community");
    assert.equal(audienceForPath("/community/x"), "community");
    assert.equal(audienceForPath("/chat"), null, "\"/\" is not a prefix of every route");
  });

  test("section links route to the audience that owns the section", () => {
    assert.equal(sectionHref("/", "guild"), "/community#guild");
    assert.equal(sectionHref("/community", "contact"), "/#contact");
  });

  test("each audience route carries its October 23 chapters", () => {
    for (const section of ["case-studies", "capabilities", "spears", "team", "project-inquiry"]) assert.equal(sectionHref("/", section), `#${section}`, section);
    // October 23 Join also closes with the services chapter.
    for (const section of ["guild", "raida", "work", "team", "join", "spears"]) assert.equal(sectionHref("/community", section), `#${section}`, section);
    // Chapters a route does not carry lead to the route that owns them.
    assert.equal(sectionHref("/", "raida"), "/community#raida");
    assert.equal(sectionHref("/community", "case-studies"), "/#case-studies");
    assert.equal(sectionHref("/community", "project-inquiry"), "/#project-inquiry");
  });
});

describe("legacy ?audience= links", () => {
  test("map to the audience routes", () => {
    assert.equal(redirect("https://www.raidguild.org/?audience=hire"), "https://www.raidguild.org/");
    assert.equal(redirect("https://www.raidguild.org/?audience=join"), "https://www.raidguild.org/community");
  });

  test("keep unrelated query parameters and the hash", () => {
    assert.equal(redirect("https://www.raidguild.org/?utm_source=x&audience=join&ref=tae#raida"), "https://www.raidguild.org/community?utm_source=x&ref=tae#raida");
    assert.equal(redirect("http://localhost:3000/?audience=hire&utm_campaign=review"), "http://localhost:3000/?utm_campaign=review");
  });

  test("leave everything else alone", () => {
    for (const href of [
      "https://www.raidguild.org/",
      "https://www.raidguild.org/?audience=HIRE",
      "https://www.raidguild.org/?audience=unknown",
      "https://www.raidguild.org/?audience=",
      "https://www.raidguild.org/agency?audience=join",
      "https://www.raidguild.org/community?audience=hire",
      "https://www.raidguild.org/chat?audience=join",
    ]) assert.equal(redirect(href), null, href);
  });

  test("a redirected URL never redirects again", () => {
    for (const href of ["https://www.raidguild.org/?audience=hire&x=1", "https://www.raidguild.org/?audience=join"]) {
      const once = redirect(href);
      assert.ok(once);
      assert.equal(redirect(once), null);
      assert.ok(!new URL(once).searchParams.has("audience"));
    }
  });
});

describe("canonical routes (November 10, 2026): Hire the DAO at /", () => {
  test("/agency and /clients, and everything below them, redirect permanently to /", async () => {
    const redirects = await nextConfig.redirects();
    const moved = redirects.filter((rule) => /^\/(agency|clients)/.test(rule.source));
    // The bare paths have explicit rules: "/:path*" with an empty path loops (found November 10).
    assert.deepEqual(moved, [
      { source: "/agency", destination: "/", permanent: true },
      { source: "/agency/:path+", destination: "/:path+", permanent: true },
      { source: "/clients", destination: "/", permanent: true },
      { source: "/clients/:path+", destination: "/:path+", permanent: true },
    ]);
  });

  test("nothing redirects away from / or /community (no loop on any host)", async () => {
    const redirects = await nextConfig.redirects();
    assert.ok(!redirects.some((rule) => rule.source === "/" || /^\/community(\/|$)/.test(rule.source)), JSON.stringify(redirects));
  });
});
