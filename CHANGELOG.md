# Changelog

Verified milestones of the Venture Beyond redesign and integration. This is not a full
commit log: use `git log origin/main..feat/venture-beyond-integration` for that.
Dates are commit dates (UTC-3), and every commit is reachable in this repository.

## Unreleased

## 2026-11-09 · Tae's review applied `055cbb0` and Editorial Mode v0.3 `5f93262`, live as Worker version `8d6c86ce`

- `055cbb0` "content(agency): apply Tae's approved editorial review (change set 1f3373b71bc5)": the hero
  introduction and services card 5 rewritten exactly as Tae wrote them (KEEP recorded for reason 6), applied with
  `scripts/apply-editorial.mjs`. Owner-approved.
- `5f93262` "feat(editorial): full coverage of /agency and /community (v0.3)": 295 editable copy fields (274 on the
  page, 21 in the new Hidden text tab: alt text, screen-reader names, metadata); site chrome and page metadata
  moved verbatim into the narrative source; price changes and navigation/heading/accessibility removals are
  structural; CLI resolves repeated and shared texts by probing. Owner-approved.
- Live on workers.dev: Phase 4 checks 19/19, v0.3 acceptance 36/36, v0.2 regression 36/36, visitors 0 px
  against the public build, 0 errors in 984 load requests, static paths CPU max 19 ms. Pushed to `fork` only.
  `raidguild.estudioblanco.org` still redirects to Railway (route change pending approval).

## 2026-11-08 · Editorial Mode v0.2 `bb37620` (`release/editorial-v0.2`), live as Worker version `f8fd6838`

- `5e04f1a` "feat(editorial): operations, Preview and two-file export (v0.2)": REPLACE, SHORTEN, REMOVE (text,
  item or section; never an empty string) and KEEP, all reversible; structural removals flagged for separate
  approval; Preview; synchronized `raidguild-tae-editorial.md` / `.json` export (version 2, fingerprints, source
  revision, deterministic). `bb37620` "feat(editorial): apply-editorial CLI, dry run by default". Owner-approved.
  Live: v0.2 acceptance 36/36, ordinary visitors 8/8 at 0 px, 0 errors under load, static paths CPU p99 11 ms.
  Annotated tag `release/editorial-v0.2` → `bb37620`, pushed to `fork` only. Guide: `docs/editorial-guide-tae.md`.

## 2026-11-08 · Opt-in Editorial Mode `64d16d6`, live as Worker version `f57739de`

- Commit `64d16d6` "feat(editorial): opt-in Editorial Mode for production builds (?editorial=1)", owner-approved,
  deployed to the review Worker on workers.dev. `?editorial=1` is an interface switch, not authentication, and
  provides no privacy or access restriction; editing is browser-local. Live: editorial QA 36/36, ordinary visitors
  8/8 at 0 px against the approved build, 0 errors under load, static paths CPU p99 12 ms. Not pushed.

## 2026-11-08 · Static-first Cloudflare host `0ad287e`, live as Worker version `0c37e331`

- Commit `0ad287e` "build(cloudflare): static-first assets for the Workers Free CPU limit" (deploy kit only),
  owner-approved, built with the app tree of `8456bdb` (Night `a1114f0`, Louchi photo `8456bdb`) and deployed to the
  existing `raidguild-estudioblanco` Worker on workers.dev. Live: static paths at CPU p50 0 ms / p99 14 ms, 0 errors
  in 3 load rounds, `/agency` and `/community` 8/8 at 0 px against the approved build. Not pushed.

## 2026-11-07 · Night refinements `a1114f0` and Louchi photo `8456bdb`

- `a1114f0` "fix(night): dark-navy CTA edges and lighter gallery cards" (the November 6 owner request, until now
  under "Unreleased") and `8456bdb` "feat(people): new photo for Louchi, Brand Steward", owner-approved. Verified on
  isolated builds: Day unchanged (0 px), Night changes only the CTAs and gallery cards, the photo changes only its own
  boxes; text identical. Not pushed, not deployed.

## 2026-11-07 · Editorial Mode v0.1 `d1b6fa4` (`release/editorial-v0.1`)

- Commit `d1b6fa4` "feat(editorial): introduce inline visual copy editing v0.1", owner-approved after reviewing the
  local prototype; annotated tag `release/editorial-v0.1`. On top of `8469c95` (the Cloudflare kit). Inline editing of
  the copy of six sections (Agency hero, services gallery, Why RaidGuild; Community hero, capabilities gallery,
  Join) in local development only, with drafts in the browser, Original / Draft preview, a Changes panel
  (comments, individual revert, conflicts), JSON export and import and a Markdown export. New:
  `src/lib/editorial/`, `src/components/venture/editorial/`, `src/types/editorial.d.ts`,
  `tests/editorial.test.mjs`; changed: `primitives/Review.tsx`, `shell/VentureShell.tsx`,
  `tests/narrative.test.mjs` (imports the new tests).

  Verified on an isolated copy (HEAD plus these files only): tests 105/105, tsc, lint 0 errors, build. Production
  output byte-identical to the agency baseline; the 8-case pixel comparison against the clean baseline shows
  0 differing pixels; 16 + 10 behaviour checks pass with the mode off; 38 + 39 + 1 editor checks pass on the dev
  server. Not deployed (local development only by design).

## 2026-11-07 · Agency baseline `1b86fd6` (`checkpoint/agency-baseline`)

- Commit `1b86fd6` "feat(routes): move Hire the DAO from /clients to /agency" on `feat/venture-beyond-integration`
  (8 files, one of them the moved page), owner-approved:
  - `/agency` is the canonical Hire the DAO route;
  - `/clients/*` answers a permanent 308 to `/agency/*`;
  - the review-domain root and `?audience=hire` open `/agency`;
  - `/community`, the copy and the CSS are unchanged.
- Annotated tag `checkpoint/agency-baseline` → `1b86fd6`. Local only: not pushed, not deployed.
- Verified on a clean archive whose tree is identical to the commit: tests 93/93, tsc, lint 0 errors, build. The
  8-case pixel comparison against `7417113` (`/agency` and `/community`, Day and Night, 1440 and 390 px) shows
  0 differing pixels, and 16 behaviour checks pass.
- Owner hosting decision: an independent deployment on Cloudflare Workers for `raidguild.estudioblanco.org`
  (not deployed yet).

## 2026-11-04 · Baseline `7417113` merged upstream for Dekan's review

- Commit `7417113` "feat(venture): baseline for Dekan review" (32 files) on `feat/venture-beyond-integration`. It
  contains the November 3 iteration:
  - Figma pass, widows and tablet fits, outlined selectors;
  - client-facing /clients copy and "Why build with RaidGuild", chevron rows;
  - /community order and surfaces, Hats and steward flips, builder wall, category buttons;
  - the Projects Explorer replacing "Follow your curiosity" on /community.
- Pushed to `fork/feat/venture-beyond-integration` (first push of `04da57f` and `233777b`, including the Last Duel
  OTFs, owner-approved for the public repos).
- PR raid-guild/website#106 merged by dekanbro into `review/venture-beyond-redesign` as squash commit `7d0e878`
  (tree identical to `7417113`).
- Verified before push, on a clean archive: tsc, lint 0 errors, tests 91/91, production build, 10-case browser set
  and 24 Projects Explorer checks. Verified 2026-11-07: the Railway host
  (`raidguild-website-redesign-production.up.railway.app`) serves text identical to the `7417113` build.

## 2026-11-03 · `233777b` on the review project's Vercel Production

- Commit `233777b`: /community restructure, hero layer seam, "Works" nav label, and a host-scoped redirect of `/` to
  `/clients` for `raidguild.estudioblanco.org`.
- Deployed to Vercel Production of `raidguild-venture-beyond-review` as `dpl_8BmqYkt7ykpEw5NFZmgm2kKCiqdD`, aliased
  to https://raidguild-venture-beyond-review.vercel.app. This replaced release `07031e2`. Still the alias on 2026-11-07.
- Verified at the time: clean-copy tsc, tests 89/89, lint 0 errors, build, host redirect.
  `raidguild.estudioblanco.org` was added to the project, but its DNS still redirects to Railway.
- The same day, previews of uncommitted working trees: `dpl_Di9vK5qe5LQAgzu4aALNtYd6U8iK`, and
  `dpl_DaWdfzxANbXHjSGXbDctk3ej2sk2` (content later committed as `7417113`).

## 2026-11-02 · November 2 iteration `04da57f` (Vercel preview)

- Typography migration from Grinder to Last Duel, two-level display hierarchy, mobile pass, hero passes, services
  and member-benefit galleries, buyer and member FAQ.
- Vercel Preview `dpl_HvV74WQ9m3QJ2CmCTNJ61VrRJVYP` (review alias unchanged). Verified at the time: tsc, tests
  88/88, lint 0 errors, build.

## 2026-10-30 · Approved Venture Beyond release `07031e2`

- Published to Vercel Production in `raidguild-venture-beyond-review`, deployment
  `dpl_Bz4p12G9bayZT3kdJo41U73PGpGM` (`https://raidguild-venture-beyond-review.vercel.app`).
- `/clients` and `/community` return 200 publicly. The release includes the approved landing-page
  refinements, shared CTA system, pinned contact scenes, responsive profession gallery, normalized
  Builders/People/Hats cards, form stepper and dropdown updates, and route-specific sharing metadata.
- Verified before publish: `bun run test` 85/85, TypeScript, lint with one pre-existing warning, and
  production build. The deployment was created from a clean archive with `SHOW_REVIEW_FLAGS=false`.

## 2026-10-29 · Iteration 04 commit (pushed to `fork/feat/venture-beyond-integration`, not deployed)

- Moloch title with the RaidGuild logo; the owner's Explore description; display face kept for "The Guild
  runs on owners"; builder layouts by result count on one full-width coral plane; Hats Tree and Projects
  swapped on /community; canonical-pink resting CTAs with distinct hover and pressed states in both themes.
- Verified: `bun run test` 80/80, `tsc`, lint (0 errors), isolated production build, browser suite
  1112/1112 on the dev server and the production build. No Git preview (the fork has no Vercel Git
  integration). Not verified: Safari, Firefox, devices, screen readers.

## 2026-10-29 · Iteration 03 commit `6ecb1c7` (pushed; preview `dpl_9RDNQZ5VNvT9hcjDtC5ANj5ho3G8`, not production)

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
