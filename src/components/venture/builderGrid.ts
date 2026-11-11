// Adaptive layouts for short filtered builder lists (October 28, Frame 122):
// instead of a few cards in one corner, the results fill the wall's area. Each
// count has a hand-made editorial template; the cell shape decides how a card
// arranges its avatar, name and role. Wide containers use a 12 × 3 grid,
// narrow ones two columns. Every template covers its grid exactly once, so
// there is no empty cell and no card is repeated (tests/builder-grid.test.mjs).

export type BuilderTileShape = "feature" | "tall" | "wide" | "compact";
// [column start, column end, row start, row end], grid lines.
export type BuilderTileArea = [number, number, number, number];
export type BuilderTileSlot = { wide: BuilderTileArea; wideShape: BuilderTileShape; narrow: BuilderTileArea; narrowShape: BuilderTileShape };

export const BUILDER_GRID_MAX = 8;
export const BUILDER_GRID_WIDE = { columns: 12, rows: 3 };

// 12 columns × 3 rows.
const WIDE: Record<number, Array<[BuilderTileArea, BuilderTileShape]>> = {
  1: [[[1, 13, 1, 4], "feature"]],
  2: [[[1, 7, 1, 4], "feature"], [[7, 13, 1, 4], "feature"]],
  3: [[[1, 6, 1, 4], "tall"], [[6, 13, 1, 3], "wide"], [[6, 13, 3, 4], "compact"]],
  4: [[[1, 5, 1, 4], "tall"], [[5, 13, 1, 3], "wide"], [[5, 9, 3, 4], "compact"], [[9, 13, 3, 4], "compact"]],
  5: [[[1, 5, 1, 4], "tall"], [[5, 9, 1, 3], "tall"], [[9, 13, 1, 3], "tall"], [[5, 9, 3, 4], "compact"], [[9, 13, 3, 4], "compact"]],
  6: [[[1, 5, 1, 3], "tall"], [[5, 9, 1, 2], "compact"], [[9, 13, 1, 4], "tall"], [[5, 9, 2, 3], "compact"], [[1, 5, 3, 4], "compact"], [[5, 9, 3, 4], "compact"]],
  7: [[[1, 5, 1, 3], "tall"], [[5, 9, 1, 2], "compact"], [[9, 13, 1, 2], "compact"], [[5, 9, 2, 3], "compact"], [[9, 13, 2, 4], "tall"], [[1, 5, 3, 4], "compact"], [[5, 9, 3, 4], "compact"]],
  8: [[[1, 4, 1, 3], "tall"], [[4, 7, 1, 2], "compact"], [[7, 10, 1, 2], "compact"], [[10, 13, 1, 3], "tall"], [[4, 7, 2, 3], "compact"], [[7, 10, 2, 3], "compact"], [[1, 7, 3, 4], "wide"], [[7, 13, 3, 4], "wide"]],
};

// Two columns: a full-width card first, then pairs; a last single card spans
// the width again.
function narrow(count: number): Array<[BuilderTileArea, BuilderTileShape]> {
  if (count === 1) return [[[1, 3, 1, 2], "feature"]];
  if (count === 2) return [[[1, 2, 1, 2], "tall"], [[2, 3, 1, 2], "tall"]];
  const slots: Array<[BuilderTileArea, BuilderTileShape]> = [[[1, 3, 1, 2], "wide"]];
  let row = 2;
  for (let index = 1; index < count; index += 2) {
    if (index === count - 1) slots.push([[1, 3, row, row + 1], "wide"]);
    else slots.push([[1, 2, row, row + 1], "tall"], [[2, 3, row, row + 1], "tall"]);
    row += 1;
  }
  return slots;
}

// One slot per result, or null when the list is long enough for the moving wall.
export function builderGridSlots(count: number): BuilderTileSlot[] | null {
  if (count < 1 || count > BUILDER_GRID_MAX) return null;
  const small = narrow(count);
  return WIDE[count].map(([wide, wideShape], index) => ({ wide, wideShape, narrow: small[index][0], narrowShape: small[index][1] }));
}
