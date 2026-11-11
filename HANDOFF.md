# Venture Beyond — handoff

**Branch:** `handoff/venture-beyond-deekan`
**Base:** `origin/main` (`b02d67b`) · diverges at `b630790`
**Figma:** https://www.figma.com/design/ke8N6VpnO86zfjGiLp46m2/RaidGuild---Grimoire---Venture?node-id=0-1
Light frame `8:7` · Dark frame `117:3965` · both 1440×7759

The branch is your own `feat/venture-beyond-redesign` history (26 commits,
unchanged SHAs) plus six commits on top. Nothing has been pushed.

## Run it

```bash
bun install
PORT=3017 bun run dev
```

Two things are **not** in the repo and the build fails without the first:

1. **`public/fonts/grinder/{Grinder-Regular,Grinder-Italic,Grinder-Retalic}.woff2`**
   — held out pending a licence decision, see Blockers. `next/font/local`
   resolves these at build time, so `bun run build` fails until they are in
   place. Ask Luis for the files.
2. **`.env`** — copy `env.sample`. Only the contact/consultation API routes
   need it; the homepage renders without.

## What is done

Everything is measured against the final Figma target frames, not the
`CODE BASELINE` frame `1:2` (that frame is a snapshot of the *old* code and
several things exist only there — see Non-blocking).

**Typography.** Grinder Regular/Italic/Retalic are wired as real cuts and
scoped to `.site`, so the pre-redesign routes keep Mazius. The hero headline
used to fake the reverse-italic with `transform: skewX(8deg)`; it now uses the
actual Retalic cut. Body is Ubuntu 400 and mono is Ubuntu Mono 700, confirmed
against the Figma type specimens.

**Assets.** Hero light and dark play the Figma video fills; the manifesto
backdrop is the desert walking-machine scene; Contact ships the Druid
illustration; Louchi has a portrait. Icons are the native SVG exports, masked
with `currentColor`.

**Parity.** Every section height matches Figma at 1440:

| Section | px | Section | px |
|---|---|---|---|
| Hero | 897 | Active Spears | 1525 |
| Signal bar | 80 | Expeditions | 1338 |
| Guild + stats | 837 | Manifesto | 615 |
| Keepers | 802 | Contact | 881 |
| Team network | 444 | Footer | 402 |

Total content 7821 against Figma's 7820.74. (The frame's declared 7759 is
shorter than the sum of its own children — the footer overflows it in Figma.)

The Figma button component is implemented once as a reusable pill (56px tall,
100px radius, 40px icon container, 32px glyph) with filled and outlined
variants, used in the Guild, Team, Spears and Expeditions.

Section labels were audited individually — they are **not** uniform: Guild,
Keepers, Team and Spears are 24px italic magenta; Expeditions is the same in
Fresh Green; Manifesto is 24px upright in Light Blue; Contact is **16px**
upright in Fresh Green at 80%.

**Validation.** All 15 new assets return HTTP 200 from localhost. No broken
images. `tsc --noEmit` passes.

## Blockers

1. **Grinder rights and refined delivery — updated September 30, 2026.**
   Dekan reported that Louchi obtained rights for the font package and approved
   the refined fonts for use and publication after a local review. This is a
   user-provided rights confirmation, not an independent review of a licence;
   retain the actual licence or purchase record with the project's records.
   Louchi subsequently supplied `grinder-reloaded.zip` (SHA-256
   `9ca7786d4a92d0e79975d09404434349502bcbffadc191f79679a43b9b2684ae`).
   Each TTC contains all three family faces in a different order; face 0 is the
   intended cut named by that TTC (`Grinder`, `Grinder-Italic`, or
   `Grinder-Retalic`). A mapped-glyph and shaping comparison confirmed revised
   outlines in all three cuts plus advance changes in Regular and Italic.
   On September 30, face 0 of each TTC was converted losslessly with
   fontTools/Brotli to the corresponding active
   `public/fonts/Grinder-Refined-{Regular,Italic,Retalic}.woff2`. Their SHA-256
   values are `f0a18f1898aa4f5feda44c223d4ad4fa0ef2944a36d4b1eecd72d552eabb5172`,
   `11168b3ba10ed4a8ee8de1bc8db4c8d1ee301e9cd5b491de5e710044bf30eef1`,
   and `0beeaeca1d03fef9ea54813ffb0fb7566c3315a042af5784b06d40150cb81a99`
   respectively. The earlier non-refined WOFF2 files remain intact for
   reference; native Italic and Retalic faces are used without CSS skew. The
   font metadata does not itself provide licence terms.

2. **Two hero/manifesto videos are low-resolution.** `hero-light.mp4` is
   760×472 and `manifesto.mp4` is 760×324, both scaled ~1.9× to 1440. They look
   soft in motion; the posters are native resolution so first paint is sharp.
   Cause: Figma clamps video export to 4096px per side and the Light frame is
   7759 tall, so the whole-page render came out 760 wide. `hero-dark.mp4` is
   fine at 1440×934 because `Video / Dark` (`117:3325`) is a top-level node and
   exported natively.
   **Fix:** duplicate `Escena de viento 1` (`117:4889`) and the manifesto
   `Section` (`26:6542`) in Figma, drag the copies to the root of the canvas,
   and export each as MP4. Drop the two files in `public/videos/venture/` —
   no code change needed.

3. **`next build` has not been run.** It could not be run in the environment
   this work was done in (a Linux VM with a macOS `node_modules`, missing the
   Linux SWC binary). Please confirm a clean build.

## Known non-blocking issues

- **React hydration mismatch in the contact form.** Radix `FormLabel` /
  `FormControl` ids differ between server and client. **Pre-existing, not
  introduced by this work.** Visible in the console; does not affect layout.
- **14 Unicode arrows remain inside cards** — 5 on the steward cards, 5 in
  Active Spears, 4 in Expeditions. Section-level chrome was converted to the
  Figma pills; card interiors are a further pass.
- **Steward cards show `ST—01 ↗`.** Figma's card (`19:4245`) is portrait, role,
  name, project only — no index, no arrow. Left in place because removing
  visible content is a product decision.
- **Expeditions shows an `01 / 04` counter** that Figma does not have. The
  prev/next buttons were removed (they exist only in `CODE BASELINE`); the
  track still scrolls by drag and trackpad.
- **`ico-handbook.svg` is committed but unused.** Not an oversight — there is
  no `ico_handbook` instance anywhere in the Figma page; it is an orphan
  component. The Guild's handbook link does not exist in the target either.
- **`hero-dark-poster.png` is 5.1 MB** (2880×1866). Worth compressing or
  dropping to 1×.
- **Card interiors in Spears and Expeditions have not been measured** against
  Figma. The spec for the "Your edge problem" card is `117:2212`.
- **`hero-landmarks-v1.png` was removed** — it has no equivalent in the final
  target. `creed-moons-v1.png`, `creed-flyer-v1.png`,
  `project-ship-schematic-v1.webp` and the two `raidguild-panorama*` files are
  now unreferenced and can be deleted once you agree.

## A note on what was wrong before

Three things in the previous state were not "a video replaced by a still" but
simply the wrong artwork: the manifesto backdrop (moons + flyer, where Figma
has a desert walking machine), the Contact illustration (a ship schematic,
where Figma has a druid), and Louchi's portrait (rendered as the initials
`LO`, though the portrait does exist in Figma as an image fill on `19:4234`).
Worth knowing if you are reconciling against the earlier audit.
