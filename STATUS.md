# STATUS

Snapshot: 2026-10-28. The Hire the DAO iteration is implemented and validated locally,
including the marquee interaction refinement, the approved Services sentence and the
scale corrections. Uncommitted, not deployed, awaiting review.

## Environment

| Item | Value |
|---|---|
| Directory | `/Users/louchi/Projects/raidguild-integration` (Git worktree of `~/Projects/raidguild-venture-beyond`) |
| Branch | `feat/venture-beyond-integration` (no upstream configured) |
| HEAD | `2abc26f87740fc09679950e51d67a26d46783f6b` ("docs: establish RaidGuild session continuity protocol"), also at `fork/feat/venture-beyond-integration` |
| Compared with `origin/main` (`b02d67b`) | 82 ahead, 1 behind |
| Other worktrees | `raidguild-venture-beyond` (`feat/tae-content-update`), `raidguild-tae-narrative`, `raidguild-tae-review` |

## References (keep them separate)

| | Approved visual baseline | Integrated release | Deployed review |
|---|---|---|---|
| **What** | October 23 Venture Beyond dual-audience iteration | Integration branch release for review | Independent review deployment of the integrated release |
| **Commit** | `40f39109cb85` (2026-10-23 16:24 -0300) | `4a771d873e0f` (2026-10-27 01:05 -0300) | `4a771d873e0f` (clean `git archive` of the tag) |
| **Where** | `~/Projects/raid-guild/website`, branch `design/venture-beyond-iteration` | This worktree | https://raidguild-venture-beyond-review.vercel.app |
| **Tags** | `checkpoint/oct23-iteration`, `backup/venture-beyond-oct23` | `release/review-4a771d8` (previous candidate `release/review-b4c9e1e`) | none |
| **In this branch's history** | No; its compositions were ported in separately (B3.x commits) | Yes | Yes (same commit) |

### Approved visual baseline

- Compare only against the exact commit `40f3910`, using a clean, isolated worktree or a
  `git archive` export.
- Its checkout has uncommitted artwork changes:
  - a modified `public/images/queen-raida/queen-raida-reference.png`
  - an untracked `queen_raida_reference_vertical.png`
- **Never reset, clean, stash or discard changes in that checkout.**
- The **October 27 Hire the DAO designs** supersede this baseline for the `/clients` hero,
  ticker, client showcase and Services only:
  - `~/Desktop/Hire DAO Dekstop.png`
  - `~/Desktop/Hire DAO Mobile.png`
- The before-state is the Vercel captures of 2026-10-27 15:27 and 15:31 in `~/Downloads`
  (`screencapture-raidguild-venture-beyond-review-vercel-app-clients-*`).
- **The design files are not 1:1 with CSS pixels.** Measured against elements whose CSS size
  is fixed (the hero CTA pill, the nav pill and the audience switch):
  - The desktop design is a ~1600 px-wide layout at 1.8 image px per CSS px (2880 px wide).
  - The mobile design is a ~393 px layout at ~1.62 image px per CSS px (measured on its
    CTA pills), on a 714 px canvas. It is not internally consistent: its headings and body
    copy extend across the full canvas, which would imply about 441 px. Mobile sizes are
    calibrated to the 393 px reading and capped to fit the screen.
  - Measure future comparisons at those scales.

### Deployed review

Source: `~/Projects/raidguild-backups/2026-10-27/DEPLOY-vercel-review-4a771d8.md`.

| Item | Value |
|---|---|
| Deployed | 2026-10-27, about 04:25 UTC, via Vercel CLI |
| Project | `raidguild-venture-beyond-review` (scope `luisblancoachs-projects`) |
| Environment and ID | Vercel Production, `dpl_2PQiaWtMuRVojKoLXuYgAD4cmgSa` |
| Build | Next.js 15.5.23 with Bun (`bun install --frozen-lockfile`, `bun run build`), from a clean archive of `release/review-4a771d8` |
| Variables | `SHOW_REVIEW_FLAGS=false` only; no secrets |
| Unavailable by design | Project inquiry form (HTTP 500) and `/chat` (503), because there are no secrets |

- **Availability:** HTTP 200 on `/`, `/clients` and `/community` (2026-10-27 21:28 UTC).
  `/clients` loaded in the browser on 2026-10-28. These checks show the pages are reachable,
  not which deployment is active.
- `raidguild-venture-review` is a separate October 23 deployment. Do not confuse the two.
- `raidguild.estudioblanco.org` has not been redirected to the new project. On 2026-10-27 it
  still returned 302 to Railway.

## Current work: Hire the DAO iteration (uncommitted)

| Area | State |
|---|---|
| `/clients` hero | "Hard problems, / working products" (`oct27-design` source). Both lines are in the headline colour; the second line is larger. Supporting copy and CTAs are unchanged. |
| Guild ticker (`/`, `/clients`, `/community`) | SENIOR DEVS, SCOPED RAIDS, BUILT BY OWNERS replace MANY EDGES, ONCHAIN SYSTEMS, OPEN EXPERIMENTS (`GuildTicker.tsx`) |
| Client showcase | "What we've built for our clients": nine projects from `src/lib/data/caseStudies.ts`. Desktop has one looping marquee plus previous/next controls; mobile has two opposite marquees sharing one selection. |
| Marquee interaction | `primitives/LogoMarquee.tsx` drives one position from a frame loop. It writes the native scroll offset (whole px) plus a transform (the sub-pixel rest), at 64 px/s, over four copies of the logos that wrap by one set.<br>• Never pauses on hover.<br>• Trackpad, horizontal wheel, touch swipe and mouse drag scroll it; the automatic movement hands over and eases back in 0.9 s after the user stops.<br>• No wheel handler, so vertical wheel input and swipes scroll the page.<br>• A drag does not select; a click or tap does.<br>• Keyboard focus holds the strip still.<br>• Reduced motion turns automatic movement off but keeps scrolling and selection.<br>• It stops offscreen. |
| Case-study copy | DAOhaus, BrightID and Hypercerts keep their archive summaries (claims, as before). Livepeer and Pocket Network use Tae's text. Daedalus (`ddls.co`), Gitcoin, Problem and YieldNest show their name, screenshot and site link only. Ultimate Dominion and Gnosis are removed. |
| `/clients` Services | `sections/Services.tsx`: "What are you trying to ship?", the accordion with the foundry portrait (desktop) or horizontal cut (mobile), and "Discuss your project" on mobile. The second intro sentence is the owner-approved correction: "Owners, not vendors: we turn shared experience into focused offerings with end dates of their own." `/community` keeps `Capabilities.tsx` unchanged. |
| Scale corrections (approved) | Desktop: hero 58/73 px, "OUR CLIENTS" 52 px, project name 49 px, project title 33 px, logo buttons 190×73. Mobile: hero `min(34px, 8.4vw)`/`min(52px, 13.2vw)`, "OUR CLIENTS" 11.3vw, "TRYING TO SHIP?" 8.8vw, project name 44 px, logo buttons 210×81. Measured within about 1% of the design at 1600 px; on mobile, capped where the design text is wider than the screen. |
| Typography | Unchanged. The refined Grinder WOFF2 files stay. |

### Verification (2026-10-28, local production build)

- **Technical:**
  - `bun run test` 64/64.
  - `tsc --noEmit` passes.
  - `bun run lint`: 0 errors, 1 warning that predates this work (unused `ThemeAnchor`, `HeaderJoin.tsx`).
  - `bun run build` passes.
- **Marquee interaction (Playwright, 1440×900 and 393×852): 40/40 checks pass.** They cover:
  - automatic movement, in opposite directions on mobile;
  - no pause on hover;
  - horizontal wheel scrolls the strip, not the page;
  - no drift while the user scrolls, then movement resumes;
  - vertical wheel over the strip scrolls the page;
  - mouse drag scrolls and does not select;
  - clicking a moving logo selects it, and the outline shows in all four copies;
  - touch: horizontal swipe scrolls each mobile marquee, vertical swipe scrolls the page,
    a tap selects from either marquee, and the selection is shared;
  - keyboard focus is visible, holds the strip and stays in view; arrow keys work;
  - seamless wrap: at most 1.1 px per frame, including across a wrap, for automatic
    movement in both directions and for manual scrolling past a set boundary both ways;
  - reduced motion: no movement, but scrolling and selection work.
- **General (Playwright, 1440×900 and 375×812): 75/75 checks pass.** They cover:
  - headline, ticker on all three routes, and the showcase heading;
  - marquee count, loop width, and selection from every marquee;
  - previous/next, arrow keys, keyboard focus stopping motion, and nine reachable logos;
  - project copy, screenshots and new-tab links;
  - accordion, mobile-only CTA and per-width illustration;
  - reduced motion;
  - no overflow, broken images or failed requests; Grinder loaded;
  - no review flags or notes in production;
  - `/community` hero and capabilities unchanged.
- **Review build** (`SHOW_REVIEW_FLAGS=true`): flags render, including the Services sentence.
  Dark theme has no overflow at either width.
- **Not verified:**
  - Physical devices: real trackpad momentum, iOS and Android touch flings (including a fling
    that crosses a wrap, where Safari may stop momentum), and Magic Mouse gestures. Touch was
    tested with Chrome's synthesized gestures; trackpad with synthetic wheel events.
  - Safari and Firefox.
  - Screen readers.
  - Widths other than 375, 393, 1440 and 1600.

### Remaining visual differences (left unchanged by decision, 2026-10-28)

Final screenshots, including captures at the designs' own scale (`truescale-*.png`), are in
the session scratchpad
(`/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/final/`).

1. **Type and logo scale:** corrected; see the table above. At 1440 px the project title
   ("Automated protocol maintenance", 33 px) wraps onto two lines because the copy column is
   narrower than at 1600 px. Mobile body copy still reads smaller than the full-canvas mobile
   design.
2. **Hero spacing.** The design keeps the dek and CTAs where they sat under the old
   four-line headline, about 100 px lower than in the build.
3. **Hero height** follows the viewport (`min(860px, 100svh)`, minimum 680 px), as before.
4. **Hero CTA at 375 px** wraps onto two lines, the same as the live release. At 393 px, the
   design's width, it fits on one line.
5. **Snapshot frame.** The design shows DAOhaus inside a blue frame; snapshots render as
   supplied, with rounded corners.
6. **Services label** stays at the 19 px minimum for pink text (`--type-accent-label`).
7. **Services intro** is about 8% narrower (544 vs about 592 px), and the desktop foundry
   illustration is about 10% smaller.

## Working tree

- **Iteration files to commit (38):**
  - 14 modified: `CHANGELOG.md`, `STATUS.md`, `docs/asset-provenance.md`,
    `docs/venture-integration.md`, `src/app/(venture)/clients/page.tsx`,
    `src/components/venture/sections/{GuildTicker,Hero,PreviousWorks}.tsx`,
    `src/components/venture/venture.module.css`, `src/lib/data/illustrations.ts`,
    `src/lib/narrative/{clients,types}.ts` and `tests/{narrative,public-content}.test.mjs`.
  - 24 new: `src/components/venture/primitives/LogoMarquee.tsx`,
    `src/components/venture/sections/Services.tsx`,
    `src/components/venture/{showcase,services}.module.css`, `src/lib/data/caseStudies.ts`,
    `public/images/illustrations/ilus_horiz_002.png`, the 9
    `public/images/casestudies/custom_buttons/button_*.svg` and the 9
    `public/images/casestudies/snapshots/Snapshot_*.png`.
  - Re-check with `git status --short` before staging.
- **User changes, preserved; never stage them with this iteration:**
  - `package.json`: the `packageManager: yarn@1.22.22` line.
  - 21 manually deleted legacy images in `public/images/`: `cohort-*` (8),
    `expect-image-*` (4), `hire-image-*` (4) and `home-*` (5).
    - Only the unused components `HomeHero`, `CohortHero`, `HireUsSection`,
      `CohortProcessSection` and `CohortValueSection` reference them.
    - No route imports those components, so the build and the live routes are unaffected.
  - `public/images/queen-raida/queen_raida_reference_vertical.png`: untracked `/community`
    artwork, not used.
- **Never commit these local files:**
  - `public/images/casestudies/clients.pdf` (reference only)
  - `public/images/casestudies/.DS_Store`
  - `public/images/queen-raida/.DS_Store`

## Next actions

1. Review the marquee refinement and the scale corrections.
2. Commit the iteration files only, then deploy to `raidguild-venture-beyond-review` from a
   clean `git archive`, as for `4a771d8`, and record the new deployment here.
3. Record the team feedback on the deployed iteration here, with the reference it was given
   against.

## Open questions

1. **DAOhaus, BrightID and Hypercerts** keep their October 23 archive summaries. They render
   in production as before but remain claims pending scope and permission confirmation.
2. **Livepeer and Pocket Network** have no subtitle line. Is a title wanted?
3. **Grinder licence.**
   - The supplied `Grinder-121888642.zip` holds the original 306-glyph cuts, the same files
     as the unused `Grinder-*.woff2`. An earlier copy carried an "iFonts — Demo for Personal
     Use" note.
   - The served refined cuts rest on the user's rights confirmation in `HANDOFF.md`. Retain
     the purchase record.
4. **`package.json` `packageManager: yarn`** conflicts with bun. Who added it, and should it stay?
5. **`docs/venture-integration.md`** still states Afacad Flux "instead of the missing Grinder
   cuts" in its first entry. The October 28 entry records the refined Grinder cuts. Should the
   first entry be marked superseded?
6. **`HANDOFF.md` blockers** (low-resolution videos, an unconfirmed `next build`) predate later
   work and have not been rechecked.
7. **`raidguild.estudioblanco.org`:** when and how should it be redirected to
   `raidguild-venture-beyond-review`?
