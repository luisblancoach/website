import test from "node:test";
import assert from "node:assert/strict";
import { filterMembers, masonryRows, memberCategories } from "../src/lib/data/memberCategories.ts";
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

// October 28: filtered results showed every builder twice. The layout rows must
// hold each filtered builder exactly once, for every category and result count.
test("masonry rows hold each filtered builder exactly once", () => {
  for (const category of memberCategories) {
    const results = filterMembers(mercenaries, category);
    const rows = masonryRows(results);
    const names = rows.flat().map((member) => member.name);
    assert.equal(names.length, results.length, category);
    assert.equal(new Set(names).size, results.length, `${category}: no duplicates`);
    assert.deepEqual([...names].sort(), results.map((member) => member.name).sort(), category);
    assert.ok(rows.length <= 3 && rows.every((row) => row.length > 0), `${category}: at most three non-empty rows`);
  }
  assert.deepEqual(masonryRows(filterMembers(mercenaries, "UX/UI")).flat().map((member) => member.name).sort(), ["Chiali", "Suede", "Vika"]);
  assert.deepEqual(masonryRows([]), []);
  assert.equal(masonryRows(mercenaries.slice(0, 1)).length, 1, "one result fills one row");
});

test("filter counts match the builders they list", () => {
  const counts = Object.fromEntries(memberCategories.map((category) => [category, filterMembers(mercenaries, category).length]));
  assert.deepEqual(counts, { "All builders": 30, Frontend: 5, "Smart Contracts": 4, "UX/UI": 3, Fullstack: 6, Coordination: 12 });
});

// October 29: every category uses the same masonry cards (the editorial grid
// for short lists is gone). Short lists use fewer rows, as TeamWall does.
test("short filtered lists use one or two cards per row, every builder once", () => {
  for (const category of memberCategories) {
    const results = filterMembers(mercenaries, category);
    const rows = masonryRows(results, Math.min(3, Math.ceil(results.length / 2)));
    assert.equal(rows.flat().length, results.length, category);
    assert.equal(new Set(rows.flat().map((member) => member.name)).size, results.length, `${category}: no duplicates`);
    if (results.length <= 6) assert.ok(rows.every((row) => row.length <= 2), `${category}: at most two per row`);
  }
});
