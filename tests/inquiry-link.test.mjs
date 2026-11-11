// "Do you have project specs?" link (November 11): normalization, validation
// and what is sent. Imported by public-content.test.mjs.
import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { LINK_MESSAGE, hireUsFormSchema, isValidLink, normalizeLink, transformFormDataToApiFormat } from "../src/lib/validation.ts";

const base = { name: "Ada Lovelace", email: "ada@example.com", bio: "Founder", altContactChannel: "DISCORD", altContactName: "", projectName: "Engine", description: "An audit and a front end.", budget: "NOT_SURE", timeline: "1-3months", services: [{ label: "Development", value: "DEVELOPMENT" }], projectPriority: "FAST_AND_POLISHED" };
const issues = (specsLink) => { const r = hireUsFormSchema.safeParse({ ...base, specsLink }); return r.success ? [] : r.error.issues.filter((i) => i.path[0] === "specsLink").map((i) => i.message); };

describe("specs link", () => {
  test("a domain without protocol gets https://; spaces are trimmed", () => {
    assert.equal(normalizeLink("example.com"), "https://example.com");
    assert.equal(normalizeLink("  figma.com/file/AbC?node-id=1-2  "), "https://figma.com/file/AbC?node-id=1-2");
    assert.equal(normalizeLink("//docs.example.co.uk/spec"), "https://docs.example.co.uk/spec");
  });

  test("full http:// and https:// links are kept exactly as entered", () => {
    for (const link of ["https://Example.com/Path?Q=1#Top", "http://example.com", "HTTPS://docs.example.com/a%20b"]) assert.equal(normalizeLink(` ${link} `), link);
  });

  test("an empty field stays empty and is valid", () => {
    for (const value of ["", "   ", undefined]) { assert.equal(normalizeLink(value), ""); assert.deepEqual(issues(value), []); }
  });

  test("valid links pass, with or without protocol", () => {
    for (const value of ["example.com", " example.com ", "https://example.com", "http://example.com/x", "notion.so/team/spec-123", "sub.domain.example.io/path"]) assert.deepEqual(issues(value), [], value);
  });

  test("invalid text shows the link message", () => {
    for (const value of ["not a link", "example", "https://", "ftp://example.com", "javascript://example.com", "mailto:ada@example.com", "https://user:pass@example.com", "example .com", "http://localhost:3000"]) {
      assert.deepEqual(issues(value), [LINK_MESSAGE], value);
      assert.equal(isValidLink(normalizeLink(value)), false, value);
    }
    assert.equal(LINK_MESSAGE, "Enter a valid link, like example.com.");
  });

  test("the normalized link is what is sent", () => {
    const sent = transformFormDataToApiFormat({ ...base, specsLink: "  example.com/spec " });
    assert.equal(sent.link, "https://example.com/spec");
    assert.equal(sent.specs_key, "YES");
    const kept = transformFormDataToApiFormat({ ...base, specsLink: "http://example.com/Spec" });
    assert.equal(kept.link, "http://example.com/Spec");
    const none = transformFormDataToApiFormat({ ...base, specsLink: "  " });
    assert.equal(none.link, "");
    assert.equal(none.specs_key, "NONE");
  });
});
