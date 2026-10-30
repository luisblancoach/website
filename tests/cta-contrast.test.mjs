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
const surfaces = { cream: "#efe9d7", navy: "#191e4e", raised: "#252a61", deep: "#102d2c" };

describe("shared CTA system (October 30): one behaviour in both themes", () => {
  const surfacesAll = { ...surfaces, sky: "#b8e0df", coral: "#ee3c78", deepNavy: "#12163b" };

  test("the dark theme redefines only the primary label and edge, the secondary surfaces and the hover shadow", () => {
    const names = [...dark.matchAll(/--(cta-[a-z-]+)\s*:/g)].map(([, name]) => name).sort();
    assert.deepEqual(names, ["cta-border", "cta-fg", "cta-hover-shadow", "cta-secondary-active-bg", "cta-secondary-bg", "cta-secondary-edge", "cta-secondary-fg", "cta-secondary-hover-bg"]);
  });

  test("dark primary: the selected tab's treatment, a deep navy label (4.5:1+) and one cream edge on coral", () => {
    const fg = token("cta-fg", dark), edge = token("cta-border", dark);
    assert.equal(fg, "#12163b");
    assert.equal(edge, palette["color-cream"]);
    assert.ok(contrast(fg, light("cta-bg")) >= 4.5, "navy label on coral");
    assert.ok(contrast(edge, surfaces.navy) >= 3, "cream edge on navy");
  });

  test("primary: canonical pink inside a deep navy edge", () => {
    assert.equal(light("cta-bg"), "#ee3c78");
    assert.equal(light("cta-border"), "#12163b");
    assert.ok(contrast(light("cta-border"), light("cta-bg")) >= 3, "the navy edge reads against the coral fill");
    assert.ok(contrast(light("cta-fg"), light("cta-bg")) >= 4.5, "rest: ink on pink");
    assert.ok(contrast(light("on-pink"), light("cta-bg")) >= 4.5, "text on the pink band");
    assert.ok(contrast("#fafafa", "#ee3c78") < 4.5, "why the label is dark: white fails on canonical pink");
  });

  test("hover and pressed keep the button itself: no colour switch, no white label", () => {
    for (const gone of ["cta-hover-bg", "cta-hover-fg", "cta-active-bg", "cta-active-fg"]) assert.equal(token(gone), null, `--${gone} is gone`);
    assert.match(css, /\.pill:not\(\[aria-disabled="true"\]\):hover \{ box-shadow: var\(--cta-hover-shadow\); transform: translateY\(-1px\); \}/);
    assert.match(css, /\.pillOutline:not\(\[aria-disabled="true"\]\):hover \{ background: var\(--cta-secondary-hover-bg\); \}/);
    assert.match(css, /\.pill:not\(\[aria-disabled="true"\]\):active \{ box-shadow: var\(--cta-active-inset\); transform: none; \}/);
  });

  test("why the primary does not darken: a darker coral drops the dark labels under 4.5:1", () => {
    assert.ok(contrast("#12163b", "#e8366f") < 4.5);
    assert.ok(contrast("#071c1d", "#e8366f") < 4.5);
  });

  test("secondary hover and pressed surfaces keep their labels well above 4.5:1", () => {
    assert.ok(contrast(light("cta-secondary-fg"), light("cta-secondary-hover-bg")) >= 4.5);
    assert.ok(contrast(light("cta-secondary-fg"), light("cta-secondary-active-bg")) >= 4.5);
    assert.ok(contrast(token("cta-secondary-fg", dark), token("cta-secondary-hover-bg", dark)) >= 4.5);
    assert.ok(contrast(token("cta-secondary-fg", dark), token("cta-secondary-active-bg", dark)) >= 4.5);
  });

  test("icon disc: a white glyph on deep navy, the disc set apart from the coral fill", () => {
    assert.equal(light("cta-icon-bg"), "#12163b");
    assert.ok(contrast(light("cta-icon-fg"), light("cta-icon-bg")) >= 4.5);
    assert.ok(contrast(light("cta-icon-bg"), light("cta-bg")) >= 3);
  });

  test("secondary: an opaque surface with a contrasting edge and label in both themes", () => {
    const pairs = [
      ["light", light("cta-secondary-bg"), light("cta-secondary-fg"), light("cta-secondary-edge")],
      ["dark", token("cta-secondary-bg", dark), token("cta-secondary-fg", dark), token("cta-secondary-edge", dark)],
    ];
    for (const [theme, bg, fg, edge] of pairs) {
      assert.match(bg, /^#[0-9a-f]{6}$/i, `${theme}: opaque surface`);
      assert.ok(contrast(fg, bg) >= 4.5, `${theme}: label`);
      assert.ok(contrast(edge, bg) >= 3, `${theme}: edge`);
    }
    assert.match(css, /\.pillOutline \{ background: var\(--cta-secondary-bg\); border-color: var\(--cta-secondary-edge\); box-shadow: none; color: var\(--cta-secondary-fg\); \}/);
  });

  test("the navy edge keeps 3:1 on the light surfaces it sits on (cream, light blue, coral)", () => {
    for (const name of ["cream", "sky", "coral"]) assert.ok(contrast(light("cta-border"), surfacesAll[name]) >= 3, `navy edge on ${name}`);
    assert.doesNotMatch(css, /--cta-border: var\(--color-dark-green\)/, "no dark-green edge exception any more");
  });

  test("the two-tone focus ring contrasts on every surface (one of its two colours reaches 3:1)", () => {
    const ring = light("cta-focus-ring"), halo = light("cta-focus-halo");
    for (const [name, surface] of Object.entries(surfacesAll)) {
      assert.ok(Math.max(contrast(ring, surface), contrast(halo, surface)) >= 3, `focus on ${name}`);
    }
    assert.ok(contrast(ring, halo) >= 3, "ring and halo stay distinct from each other");
  });

  test("disabled is dimmed but not invisible", () => {
    const op = Number(light("cta-disabled-opacity"));
    assert.ok(op >= 0.4 && op <= 0.6, String(op));
  });
});

describe("coral scene: Moloch (both themes)", () => {
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

  test("filled buttons on coral rest on deep navy with a white label and a navy edge", () => {
    assert.match(feature, /\.moloch \{ --cta-bg: var\(--on-coral\); --cta-fg: var\(--color-white, #fafafa\); --cta-border: var\(--on-coral\); \}/);
    assert.doesNotMatch(css, /\.creed \{ --cta-bg: #12163b/, "the creed CTA is a coral primary again in both themes");
    assert.ok(contrast(palette["color-white"], onCoral) >= 4.5, "white on deep navy");
    assert.ok(contrast(onCoral, coral) >= 3, "navy edge on coral");
  });
});
