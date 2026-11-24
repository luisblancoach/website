import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

// Venture Beyond replaced Last Duel on November 24, 2026 (see src/lib/fonts.ts).
// These checks keep the restricted Last Duel files and references out of the
// shipped site, and pin the open Venture Beyond files to the brand system's.
const root = fileURLToPath(new URL("..", import.meta.url));
const read = (path) => readFileSync(join(root, path), "utf8");
const walk = (dir) =>
  readdirSync(join(root, dir)).flatMap((name) => {
    const path = join(dir, name);
    return statSync(join(root, path)).isDirectory() ? walk(path) : [path];
  });

const vbDir = "public/fonts/venture-beyond";
const sources = walk("src").filter((path) => /\.(css|tsx?|mjs)$/.test(path));

describe("display typography: Venture Beyond", () => {
  test("no Last Duel / Eurostile binaries are shipped", () => {
    const fonts = walk("public").filter((path) => /\.(otf|ttf|woff2?)$/i.test(path));
    assert.deepEqual(fonts.filter((path) => /last.?duel|eurostile/i.test(path)), []);
  });

  test("no source file loads Last Duel or its CSS variables", () => {
    const offenders = sources.filter((path) => /--font-last-duel|lastDuel\b|LastDuel-[A-Za-z0-9]+\.otf/.test(read(path)));
    assert.deepEqual(offenders, []);
  });

  test("the Venture Beyond web fonts match the brand system's checksums", () => {
    const sums = read(`${vbDir}/SHA256SUMS`).trim().split("\n").map((line) => line.split(/\s+/));
    assert.equal(sums.length, 3);
    for (const [hash, file] of sums) {
      const actual = createHash("sha256").update(readFileSync(join(root, vbDir, file))).digest("hex");
      assert.equal(actual, hash, file);
    }
  });

  test("the OFL licence ships with the fonts", () => {
    const ofl = read(`${vbDir}/OFL.txt`);
    assert.match(ofl, /SIL OPEN FONT LICENSE Version 1\.1/);
    assert.match(ofl, /Archivo Project Authors/);
  });

  test("venture-beyond.css registers Upright + Italic and a separate Retalic family, all Extended", () => {
    const css = read("src/app/venture-beyond.css");
    const faces = [...css.matchAll(/@font-face\s*{([^}]*)}/g)].map(([, body]) => body);
    const face = (file) => faces.find((body) => body.includes(`/fonts/venture-beyond/${file}`));
    assert.match(face("VentureBeyond-Latin.woff2"), /font-family: "Venture Beyond";[\s\S]*font-style: normal;/);
    assert.match(face("VentureBeyond-Italic-Latin.woff2"), /font-family: "Venture Beyond";[\s\S]*font-style: italic;/);
    assert.match(face("VentureBeyond-Retalic-Latin.woff2"), /font-family: "Venture Beyond Retalic";[\s\S]*font-style: normal;/);
    for (const body of faces) {
      assert.match(body, /font-weight: 100 900;/);
      assert.match(body, /font-stretch: 125%;/);
      assert.match(body, /size-adjust: 105\.4%;/);
    }
    assert.equal(faces.length, 3);
    assert.match(css, /--font-venture-beyond: "Venture Beyond";/);
    assert.match(css, /--font-venture-beyond-retalic: "Venture Beyond Retalic"/);
    const layout = read("src/app/layout.tsx");
    assert.match(layout, /import "\.\/venture-beyond\.css";/);
    for (const file of ["VentureBeyond-Latin.woff2", "VentureBeyond-Italic-Latin.woff2", "VentureBeyond-Retalic-Latin.woff2"]) {
      assert.ok(layout.includes(`rel="preload" href="/fonts/venture-beyond/${file}"`), `preload ${file}`);
    }
  });

  test("no italic or bold is synthesized where native faces exist", () => {
    const offenders = sources.filter((path) => /font-synthesis:\s*(style|weight|[^;]*\b(style|weight)\b)/.test(read(path)));
    assert.deepEqual(offenders, []);
  });

  test("approved hero lockup: Extended Black Retalic over Extended Black Italic", () => {
    const css = read("src/components/venture/venture.module.css");
    const top = css.slice(css.indexOf("/* Top lines:"), css.indexOf("/* Bottom lines:"));
    const bottom = css.slice(css.indexOf("/* Bottom lines:"), css.indexOf("}", css.indexOf("/* Bottom lines:")));
    assert.match(top, /var\(--font-venture-beyond-retalic\)/);
    assert.match(top, /font-weight: 900/);
    assert.match(bottom, /var\(--font-venture-beyond\)/);
    assert.match(bottom, /font-style: italic/);
    assert.match(bottom, /font-synthesis: none/);
    assert.match(bottom, /font-weight: 900/);
  });
});
