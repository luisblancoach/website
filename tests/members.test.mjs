import test from "node:test";
import assert from "node:assert/strict";
import { filterMembers, memberCategories } from "../src/lib/data/memberCategories.ts";
import { mercenaries } from "../src/lib/data/members.ts";

// Ported from the October 23 iteration (40f3910, tests/audiences.test.mjs). Its
// audience-resolution tests are covered by the route redirects in routes.test.mjs.
test("skill filters partition the real member list and normalize both design titles", () => {
  const groups = memberCategories.slice(1).map((category) => filterMembers(mercenaries, category));
  assert.equal(groups.flat().length, mercenaries.length);
  assert.equal(new Set(groups.flat().map((member) => member.name)).size, mercenaries.length);
  assert.deepEqual(filterMembers(mercenaries, "UX/UI").map((member) => member.name), ["Suede", "Vika", "Chiali"]);
  assert.equal(filterMembers(mercenaries, "Frontend").length, 5);
  assert.equal(filterMembers([], "Smart Contracts").length, 0);
});
