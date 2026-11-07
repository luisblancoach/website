import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { AUDIENCES, audienceForPath, legacyAudienceRedirect, sectionHref } from "../src/lib/venture-routes.ts";
import nextConfig from "../next.config.ts";

const redirect = (href) => legacyAudienceRedirect(new URL(href))?.href ?? null;

describe("audience routes", () => {
  test("audience switch labels and destinations", () => {
    assert.deepEqual(AUDIENCES.map((a) => [a.label, a.href]), [["Hire the DAO", "/agency"], ["Join the DAO", "/community"]]);
    assert.equal(audienceForPath("/agency"), "clients");
    // /clients is a redirect now (next.config.ts), not an audience route.
    assert.equal(audienceForPath("/clients"), null);
    assert.equal(audienceForPath("/community"), "community");
    assert.equal(audienceForPath("/"), null);
    assert.equal(audienceForPath("/chat"), null);
  });

  test("section links route to the audience that owns the section", () => {
    assert.equal(sectionHref("/", "guild"), "#guild");
    assert.equal(sectionHref("/agency", "guild"), "/community#guild");
    assert.equal(sectionHref("/community", "contact"), "/agency#contact");
  });

  test("each audience route carries its October 23 chapters", () => {
    for (const section of ["case-studies", "capabilities", "spears", "team", "project-inquiry"]) assert.equal(sectionHref("/agency", section), `#${section}`, section);
    // October 23 Join also closes with the services chapter.
    for (const section of ["guild", "raida", "work", "team", "join", "spears"]) assert.equal(sectionHref("/community", section), `#${section}`, section);
    // Chapters a route does not carry lead to the route that owns them.
    assert.equal(sectionHref("/agency", "raida"), "/community#raida");
    assert.equal(sectionHref("/community", "case-studies"), "/agency#case-studies");
    assert.equal(sectionHref("/community", "project-inquiry"), "/agency#project-inquiry");
  });
});

describe("legacy ?audience= links", () => {
  test("map to the audience routes", () => {
    assert.equal(redirect("https://www.raidguild.org/?audience=hire"), "https://www.raidguild.org/agency");
    assert.equal(redirect("https://www.raidguild.org/?audience=join"), "https://www.raidguild.org/community");
  });

  test("keep unrelated query parameters and the hash", () => {
    assert.equal(redirect("https://www.raidguild.org/?utm_source=x&audience=join&ref=tae#raida"), "https://www.raidguild.org/community?utm_source=x&ref=tae#raida");
    assert.equal(redirect("http://localhost:3000/?audience=hire&utm_campaign=review"), "http://localhost:3000/agency?utm_campaign=review");
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

describe("/clients → /agency (November 7, 2026)", () => {
  test("/clients and everything below it redirect permanently to /agency", async () => {
    const redirects = await nextConfig.redirects();
    const moved = redirects.filter((rule) => rule.source.startsWith("/clients"));
    assert.deepEqual(moved, [{ source: "/clients/:path*", destination: "/agency/:path*", permanent: true }]);
  });

  test("the review domain root opens /agency directly, and nothing redirects away from the audience routes", async () => {
    const redirects = await nextConfig.redirects();
    const root = redirects.find((rule) => rule.source === "/" && rule.has?.some((condition) => condition.value === "raidguild.estudioblanco.org"));
    assert.equal(root?.destination, "/agency");
    assert.ok(!redirects.some((rule) => /^\/(agency|community)(\/|$)/.test(rule.source)));
  });
});
