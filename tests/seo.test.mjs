import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { INDEXABLE, PUBLIC_ROUTES, ROBOTS, SITE_ORIGIN, canonicalUrl, graph, jsonLd, organizationNode, serviceNodes, webPageNode, websiteNode } from "../src/lib/seo.ts";
import sitemap from "../src/app/sitemap.ts";
import { forAudience } from "../src/lib/narrative/public.ts";
import { clientsServiceGallery } from "../src/lib/narrative/clients.ts";
import { siteContent } from "../src/lib/narrative/site.ts";

// SEO / AEO handoff (November 10): canonical origin, indexing gate, structured data.
describe("seo", () => {
  test("canonical URLs name the public domain, never a review host", () => {
    assert.equal(SITE_ORIGIN, "https://www.raidguild.org");
    assert.deepEqual(PUBLIC_ROUTES.map(canonicalUrl), ["https://www.raidguild.org/", "https://www.raidguild.org/agency", "https://www.raidguild.org/community"]);
  });

  test("builds are noindex unless they are the canonical production deployment", () => {
    // The test environment has no RAIDGUILD_INDEXING and no Vercel production variables.
    assert.equal(INDEXABLE, false);
    assert.deepEqual(ROBOTS, { index: false, follow: true });
    assert.deepEqual(sitemap(), [], "no sitemap entries while pages are noindex");
  });

  test("Service markup is the services gallery as shown", () => {
    const cards = forAudience(clientsServiceGallery, false).cards;
    const services = serviceNodes("/agency", cards);
    assert.equal(services.length, 6);
    assert.deepEqual(services.map((s) => s.name), ["Full-stack development", "Smart contracts, onchain systems", "Applied AI and automation", "Product and system design", "Marketing and content strategy", "DAO consulting and governance"]);
    services.forEach((service, i) => {
      assert.equal(service.description, cards[i].body.text.replace(/\*\*/g, ""));
      assert.equal(service.provider["@id"], organizationNode["@id"]);
    });
  });

  test("Organization uses only published facts and the footer's official profiles", () => {
    const footer = siteContent.footer.socials.map((link) => link.href);
    for (const profile of organizationNode.sameAs) assert.ok(footer.includes(profile), profile);
    assert.equal(organizationNode.logo.url, "https://www.raidguild.org/images/raidguild-logo.svg");
    const all = JSON.stringify(graph(organizationNode, websiteNode, webPageNode("/agency", "t", "d"), ...serviceNodes("/agency", forAudience(clientsServiceGallery, false).cards)));
    assert.doesNotMatch(all, /"(aggregateRating|review|priceRange|telephone|address|employee|offers)"\s*:/, "no invented business facts");
    assert.doesNotMatch(all, /TODO|placeholder/i);
  });

  test("JSON-LD cannot close its script element", () => {
    assert.equal(jsonLd({ a: "</script><b>" }), '{"a":"\\u003c/script>\\u003cb>"}');
  });
});
