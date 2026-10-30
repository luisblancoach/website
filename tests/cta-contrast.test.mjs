import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

// Reads the CTA tokens from the stylesheet itself, so the test fails if a token
// is edited to a value that no longer meets WCAG contrast.
const css = readFileSync(new URL("../src/components/venture/venture.module.css", import.meta.url), "utf8");
const block = (start) => css.slice(css.indexOf(start), css.indexOf("}", css.indexOf(start)));
const root = block(".site {");
const dark = block(':global(html[data-theme="dark"]) .site {');

const palette = Object.fromEntries([...root.matchAll(/--(color-[a-z-]+):\s*(#[0-9a-f]{6})/gi)].map(([, k, v]) => [k, v]));
const resolve = (value) => {
  const ref = value.match(/var\(--([a-z-]+)\)/i);
  return ref ? resolve(palette[ref[1]] ?? (root.match(new RegExp(`--${ref[1]}:\\s*([^;]+);`)) || [])[1]) : value.trim();
};
const token = (name, scope = root) => {
  const m = scope.match(new RegExp(`--${name}:\\s*([^;]+);`));
  return m ? resolve(m[1]) : null;
};
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

const light = (name) => token(name);
const darkTok = (name) => token(name, dark) ?? token(name);
const surfaces = { cream: "#efe9d7", navy: "#191e4e", raised: "#252a61", deep: "#102d2c" };

describe("semantic CTA tokens", () => {
  test("canonical pink is unchanged", () => {
    assert.equal(light("cta-bg"), "#ee3c78");
  });

  test("label text meets 4.5:1 in every state (16px labels)", () => {
    assert.ok(contrast(light("cta-fg"), light("cta-bg")) >= 4.5, "light default");
    assert.ok(contrast(light("cta-fg-hover"), light("cta-bg-hover")) >= 4.5, "light hover");
    assert.ok(contrast(light("cta-fg-active"), light("cta-bg-active")) >= 4.5, "light pressed");
    assert.ok(contrast(darkTok("cta-fg-hover"), darkTok("cta-bg-hover")) >= 4.5, "dark hover");
    assert.ok(contrast(darkTok("cta-fg-active"), darkTok("cta-bg-active")) >= 4.5, "dark pressed");
    assert.ok(contrast(light("on-pink"), light("cta-bg")) >= 4.5, "text on the pink band");
  });

  test("dark theme (October 29): white labels on #CE1252 with a canonical pink edge", () => {
    assert.equal(darkTok("cta-fg"), "#fafafa");
    assert.ok(contrast(darkTok("cta-fg"), darkTok("cta-bg")) >= 4.5, "dark default");
    assert.ok(contrast("#fafafa", "#ee3c78") < 4.5, "white on canonical pink would fail");
    assert.ok(contrast(darkTok("cta-edge"), surfaces.navy) >= 3, "pink edge on navy");
    assert.ok(contrast(darkTok("cta-outline-fg"), surfaces.navy) >= 4.5, "outline label on navy");
    assert.ok(contrast(darkTok("cta-outline-border"), surfaces.navy) >= 3, "outline edge on navy");
  });

  test("dark-green #102D2C alone would fail on pink, which is why it is not the label colour", () => {
    assert.ok(contrast("#102d2c", "#ee3c78") < 4.5);
    assert.notEqual(light("cta-fg"), "#102d2c");
  });

  test("buttons keep a 3:1 boundary against the surfaces they sit on", () => {
    for (const [name, surface] of Object.entries({ cream: surfaces.cream, navy: surfaces.navy, raised: surfaces.raised, deep: surfaces.deep })) {
      assert.ok(contrast(light("cta-bg"), surface) >= 3, `default pink on ${name}`);
    }
    // Where the darker hover pink loses its edge, a cream ring is drawn instead.
    assert.ok(contrast(light("cta-bg-hover"), surfaces.cream) >= 3, "light hover on cream");
    assert.ok(contrast(light("cta-bg-hover"), surfaces.deep) < 3, "hover pink on deep green needs the ring");
    assert.equal(darkTok("cta-hover-ring"), "#efe9d7");
    for (const surface of [surfaces.navy, surfaces.raised, surfaces.deep]) assert.ok(contrast(darkTok("cta-hover-ring"), surface) >= 3);
  });

  test("focus rings contrast with their surfaces in both themes", () => {
    assert.ok(contrast(light("cta-ring"), surfaces.cream) >= 3, "light ring on cream");
    assert.ok(contrast(light("cta-ring"), "#b8e0df") >= 3, "light ring on sky");
    assert.ok(contrast(darkTok("cta-ring"), surfaces.navy) >= 3, "dark ring on navy");
    assert.ok(contrast(darkTok("cta-ring"), surfaces.raised) >= 3, "dark ring on raised navy");
    assert.ok(/--cta-ring: var\(--color-cream\);[^}]*--cta-hover-ring: var\(--color-cream\)/.test(css), "deep-green light surfaces switch to cream rings");
  });
});

describe("October 29 coral scenes (/community)", () => {
  const feature = readFileSync(new URL("../src/components/venture/feature.module.css", import.meta.url), "utf8");
  const coral = palette["color-pink"];
  const onCoral = (feature.match(/--on-coral:\s*(#[0-9a-f]{6})/i) || [])[1];

  test("Moloch: deep navy text on coral meets 4.5:1; navy and indigo would not", () => {
    assert.equal(coral, "#ee3c78");
    assert.equal(onCoral, "#12163b");
    assert.ok(contrast(onCoral, coral) >= 4.5, `${contrast(onCoral, coral).toFixed(2)}:1`);
    assert.ok(contrast(palette["color-navy"], coral) < 4.5, "navy #191E4E is below 4.5:1 on coral");
    assert.ok(contrast(palette["color-indigo"], coral) < 3, "indigo #303675 is below 3:1 on coral");
  });

  test("Moloch CTA: white on deep navy, and the pill keeps a 3:1 edge on coral", () => {
    assert.ok(contrast(palette["color-white"], onCoral) >= 4.5);
    assert.ok(contrast(onCoral, coral) >= 3);
  });
});
