import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { AUDIENCES, audienceForPath, legacyAudienceRedirect, sectionHref } from "../src/lib/venture-routes.ts";

const redirect = (href) => legacyAudienceRedirect(new URL(href))?.href ?? null;

describe("audience routes", () => {
  test("audience switch labels and destinations", () => {
    assert.deepEqual(AUDIENCES.map((a) => [a.label, a.href]), [["Hire the DAO", "/clients"], ["Join the DAO", "/community"]]);
    assert.equal(audienceForPath("/clients"), "clients");
    assert.equal(audienceForPath("/community"), "community");
    assert.equal(audienceForPath("/"), null);
    assert.equal(audienceForPath("/chat"), null);
  });

  test("section links route to the audience that owns the section", () => {
    assert.equal(sectionHref("/", "guild"), "#guild");
    assert.equal(sectionHref("/clients", "guild"), "/community#guild");
    assert.equal(sectionHref("/community", "spears"), "/clients#spears");
  });
});

describe("legacy ?audience= links", () => {
  test("map to the audience routes", () => {
    assert.equal(redirect("https://www.raidguild.org/?audience=hire"), "https://www.raidguild.org/clients");
    assert.equal(redirect("https://www.raidguild.org/?audience=join"), "https://www.raidguild.org/community");
  });

  test("keep unrelated query parameters and the hash", () => {
    assert.equal(redirect("https://www.raidguild.org/?utm_source=x&audience=join&ref=tae#raida"), "https://www.raidguild.org/community?utm_source=x&ref=tae#raida");
    assert.equal(redirect("http://localhost:3000/?audience=hire&utm_campaign=review"), "http://localhost:3000/clients?utm_campaign=review");
  });

  test("leave everything else alone", () => {
    for (const href of [
      "https://www.raidguild.org/",
      "https://www.raidguild.org/?audience=HIRE",
      "https://www.raidguild.org/?audience=unknown",
      "https://www.raidguild.org/?audience=",
      "https://www.raidguild.org/clients?audience=join",
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
