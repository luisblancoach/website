# Changelog

Verified milestones of the Venture Beyond redesign and integration. This is not a full
commit log: use `git log origin/main..feat/venture-beyond-integration` for that.
Dates are commit dates (UTC-3), and every commit is reachable in this repository.

## Unreleased

- Hire the DAO iteration from the October 27 designs: the `/clients` hero, the shared ticker
  copy, the nine-project client showcase with a scroll-driven logo marquee, and `/clients`
  Services with the owner-approved intro sentence. Sizes are calibrated to the 1600 px and
  393 px design layouts. Implemented and validated locally on 2026-10-28. Not committed and
  not deployed; pending review. See `STATUS.md`.
- `2abc26f`: session continuity protocol v1.0 (`AGENTS.md`, `STATUS.md`, `CHANGELOG.md`,
  `CLAUDE.md`). Committed and pushed to `fork/feat/venture-beyond-integration` on 2026-10-27.

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
