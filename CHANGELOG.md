# Changelog

Verified milestones of the Venture Beyond redesign and integration. This is not a full
commit log: use `git log origin/main..feat/venture-beyond-integration` for that.
Dates are commit dates (UTC-3), and every commit is reachable in this repository.

## Unreleased

## 2026-10-29 · Iteration 03 commit (pushed to `fork/feat/venture-beyond-integration`, not deployed)

- Final visual refinement pass for `/clients` and `/community`: the hero curtain on both routes; the
  new /community order with Moloch after Queen Raida; the Hats Tree with branches, artwork-first cards
  and select-to-enlarge; one two-level heading scale; still builder lists in the wall's style; the
  coral creed highlight; one stroke around the Hire panel.
- Verified: `bun run test` 79/79, `tsc`, lint (0 errors), isolated production build, browser suite
  882/882 on the dev server and the production build. No preview: the fork has no Vercel Git
  integration. Not verified: Safari, Firefox, devices, screen readers.

## 2026-10-29 · Iteration 02 commit `a8ff16c` (pushed to `fork/feat/venture-beyond-integration`, not deployed manually)

- Design system normalization iteration 01, the Community visual refinement follow-up and iteration 02
  for `/clients` and `/community`: the owner's hero, Join and Projects copy; no hero parallax; one
  headline rule; Ubuntu H3s; the Guild kit expander; held Queen Raida and Moloch artwork; a two-column
  Hats Tree; one builder card system on a tilted coral band; CTA states, icons and 44 px targets;
  accordion contrast; the creed highlight; the owner's artwork in `public/images/venture/`.
- Verified: `bun run test` 79/79, `tsc`, lint (0 errors), isolated production build, browser suite
  712/712 on the dev server and on the production build. Not verified: Safari, Firefox, devices,
  screen readers.
- Documentation only (2026-10-29, committed with iteration 02): `STATUS.md` and this file reconciled with release
  `2bf270d`, including the corrections below.
- Design system normalization, iteration 01 (2026-10-29, committed with iteration 02): one hero scale
  and dark-theme button treatment for `/clients` and `/community`; `/community` reorganized (About
  RaidGuild restored from `f842d87`, Queen Raida and About Moloch as immersive features, the Hats
  Tree replacing "Keepers of the signal", the shared builder wall, Services and inquiry panel) with
  distinct dark scenes; seven placeholder PNGs for Moloch and the five featured hats.
- Community visual refinement follow-up (2026-10-29, committed with iteration 02): the owner's Queen
  Raida, Moloch and Hats artwork (desktop, rectangle and mobile cuts); Join headline on one line per
  segment; builder wall on a tilted coral band; coral-stroked Join panel; Moloch on coral with navy
  text; Hats Tree with the RaidGuild parent mark, less text and one link; Ubuntu H3s on /community.

## 2026-10-28 · Review release `2bf270d`

- `2bf270d`: the October 28 refinements, 30 files.
  - `/clients`: Tae's copy for all nine case studies; Daedalus links to ddls.co with the owner's
    new assets; review flags off in local development; "The Guild runs on owners, not employees.";
    the builder heading on the showcase scale, adaptive grids for 1–8 filtered builders, and a
    masonry wall at 36 px/s running edge to edge, each builder shown once; the inquiry form
    replacing its introduction in the light-blue module, compact and line-based; the hero curtain
    (4ffb591) restored; showcase rotation every 3 s with a crossfade; "Build with us"; a coral,
    taller mobile creed.
  - `/community`: "Join our community"; the Guild section "About Moloch" with the owner's
    Moloch, Hats Tree and stewardship copy, and links to DAO Roles and Hats Protocol.
- Deployed to Vercel Production in `raidguild-venture-beyond-review`, deployment
  `dpl_HqkPYA55qh5V9QHFQpUxwWZ1xjko` (https://raidguild-venture-beyond-review.vercel.app,
  `SHOW_REVIEW_FLAGS=false`), from a clean `git archive`, and verified in production. Source:
  `~/Projects/raidguild-backups/2026-10-28/DEPLOY-vercel-review-2bf270d.md`.
- Verified: release tree `bun run test` 71/71, `bunx tsc --noEmit`, `bun run build`; on the
  production URL the general (75/75), rotation and wall (66/66), October 28 (96/96) and marquee
  (40/40) suites, and the 1440 px pass of the Frame 122/123 suite (its other widths only on the
  identical local build). Not verified: form submission, Safari, Firefox, physical devices, screen
  readers.
- Earlier the same evening, `dpl_7Bm3eKJtSDLEHyeHRRPdHfU4Nx1N` (21:28) and
  `dpl_DsHcdtCVBX6QNKNHSx4iwUaxyhxz` (22:16) were deployed outside this session from an
  uncommitted working tree; `dpl_HqkPYA…` superseded both.
- Corrections to the documentation committed in `2bf270d`: its `STATUS.md` said the
  `HeaderJoin.tsx` lint warning was removed (it was not; `bun run lint` still reports the unused
  `ThemeAnchor`) and that the October 23 reference checkout was unavailable (it is available at
  `40f3910`); its `STATUS.md` named `dpl_7Bm3…` as the review; and its `CHANGELOG.md` listed this
  work as uncommitted and not deployed. Corrected in the uncommitted documentation update.

## 2026-10-28 · Review release `da9165b`

- `da9165b`: Hire the DAO iteration from the October 27 designs.
  - The `/clients` hero ("Hard problems, working products") and the shared ticker copy.
  - The nine-project client showcase with a scroll-driven logo marquee.
  - `/clients` Services with the owner-approved intro sentence.
  - Sizes calibrated to the 1600 px and 393 px design layouts.
- Deployed to Vercel Production in `raidguild-venture-beyond-review`, deployment
  `dpl_HeuA2CyFgTtiAtvut1MrQB8ECkbR` (https://raidguild-venture-beyond-review.vercel.app,
  `SHOW_REVIEW_FLAGS=false`), from a clean `git archive`, and verified in production.
  Source: `~/Projects/raidguild-backups/2026-10-28/DEPLOY-vercel-review-da9165b.md`.
- `2abc26f` (2026-10-27): session continuity protocol v1.0 (`AGENTS.md`, `STATUS.md`,
  `CHANGELOG.md`, `CLAUDE.md`). Committed and pushed to `fork/feat/venture-beyond-integration`.

## 2026-10-27 · Review release `4a771d8`

- `4a771d8` deployed to Vercel Production in the new project `raidguild-venture-beyond-review`
  (https://raidguild-venture-beyond-review.vercel.app, `SHOW_REVIEW_FLAGS=false`). Source:
  `~/Projects/raidguild-backups/2026-10-27/DEPLOY-vercel-review-4a771d8.md`.
- `4a771d8`: production pages no longer include review notes or pending narrative entries.
  Tag `release/review-4a771d8`.
- `b4c9e1e`: approved Queen Raida artwork shipped and asset provenance recorded
  (`docs/asset-provenance.md`). Tag `release/review-b4c9e1e`, the previous release candidate.
- `c955cd1`: Join panel, approved illustrations and updated Queen Raida art.

## 2026-10-26 · Integration onto the shared shell

- `57fdf4d`: Phase 1. The homepage was split into a shared shell with `/clients` and
  `/community` routes, and theme was made independent of audience. Tag `checkpoint/phase-1`.
- `3385f41`: Phase 2. Community narrative, a narrative data layer and content review flags.
  Tag `checkpoint/phase-2`.
- `e1098d6`, `49c2075`, `c45d141`, `71d8025`: October 23 audience switch ported, readable type
  and surfaces (B2), CTA states (B3.1), structured narrative content (B3.2). Tag `checkpoint/b3.2`.
- `9aa9bfc`, `ae03aae`: October 23 compositions recovered on the audience routes; B3.4 visual refinements.

## 2026-10-23 · Approved visual reference (separate branch)

- `40f3910`: tip of the October 23 dual-audience iteration on `design/venture-beyond-iteration`
  (`~/Projects/raid-guild/website`). It is not an ancestor of the integration branch. Tags
  `checkpoint/oct23-iteration` and `backup/venture-beyond-oct23` were created on 2026-10-26.

## 2026-09-09 to 2026-10-09 · Handoff and review branch

- `a195359` (2026-09-09): Figma design handoff notes (`HANDOFF.md`).
- `e8ca7b7` (2026-09-09): handoff merged with the local Venture Beyond experiments.
- `2f4f9c0` (2026-09-22): refined Grinder fonts adopted. `877ba22` (2026-09-30): updated Grinder validated (#105).
- `a6418ea` (2026-10-09): Queen Raida chat and member benefits. This is the tip of
  `origin/review/venture-beyond-redesign`.

## 2026-08-07 · Redesign begins

- `f48eb23`: homepage redesigned with the parallax expedition experience.
