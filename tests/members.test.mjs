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

// Frame 122 (restored October 30): short filtered lists fill the wall's area
// with an editorial grid.
// Every template must cover its grid exactly once (no gap, no overlap) and give
// each result one cell; longer lists keep the moving wall.
import { BUILDER_GRID_MAX, BUILDER_GRID_WIDE, builderGridSlots } from "../src/components/venture/builderGrid.ts";

const coverage = (areas, columns) => {
  const rows = Math.max(...areas.map(([, , , r2]) => r2)) - 1;
  const cells = new Map();
  for (const [c1, c2, r1, r2] of areas) for (let c = c1; c < c2; c++) for (let r = r1; r < r2; r++) cells.set(`${c},${r}`, (cells.get(`${c},${r}`) ?? 0) + 1);
  const all = [...Array(columns).keys()].flatMap((c) => [...Array(rows).keys()].map((r) => `${c + 1},${r + 1}`));
  return { gaps: all.filter((key) => !cells.has(key)), overlaps: [...cells].filter(([, n]) => n > 1).map(([key]) => key), outside: [...cells.keys()].filter((key) => !all.includes(key)) };
};

test("adaptive builder layouts cover their grid exactly once for 1 to 8 results", () => {
  for (let count = 1; count <= BUILDER_GRID_MAX; count++) {
    const slots = builderGridSlots(count);
    assert.equal(slots.length, count, `${count}: one cell per result`);
    const wide = coverage(slots.map((slot) => slot.wide), BUILDER_GRID_WIDE.columns);
    assert.deepEqual(wide, { gaps: [], overlaps: [], outside: [] }, `${count}: wide template`);
    assert.equal(Math.max(...slots.map((slot) => slot.wide[3])) - 1, BUILDER_GRID_WIDE.rows, `${count}: wide uses all three rows`);
    assert.deepEqual(coverage(slots.map((slot) => slot.narrow), 2), { gaps: [], overlaps: [], outside: [] }, `${count}: narrow template`);
  }
  assert.equal(builderGridSlots(0), null);
  assert.equal(builderGridSlots(BUILDER_GRID_MAX + 1), null, "longer lists keep the moving wall");
});

test("adaptive layouts follow the agreed compositions", () => {
  assert.deepEqual(builderGridSlots(1).map((slot) => slot.wideShape), ["feature"], "one prominent card");
  assert.deepEqual(builderGridSlots(2).map((slot) => slot.wideShape), ["feature", "feature"], "two balanced cards");
  for (const count of [3, 4]) {
    const sizes = builderGridSlots(count).map(({ wide: [c1, c2, r1, r2] }) => (c2 - c1) * (r2 - r1));
    assert.ok(new Set(sizes).size > 1, `${count}: asymmetric proportions`);
    assert.ok(new Set(builderGridSlots(count).map((slot) => slot.wideShape)).size > 1, `${count}: mixed vertical and horizontal cards`);
  }
  for (const [category, count] of [["Frontend", 5], ["Smart Contracts", 4], ["UX/UI", 3], ["Fullstack", 6]]) {
    assert.equal(filterMembers(mercenaries, category).length, count);
    assert.ok(builderGridSlots(count), `${category} uses the adaptive grid`);
  }
  assert.equal(builderGridSlots(filterMembers(mercenaries, "Coordination").length), null, "Coordination (12) keeps the wall");
});
