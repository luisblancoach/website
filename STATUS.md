# STATUS

Snapshot: 2026-10-28 (evening). The validated `/clients` iteration is deployed
to the independent Vercel review (`dpl_7Bm3eKJtSDLEHyeHRRPdHfU4Nx1N`). The Hire the DAO iteration is released as `da9165b` and deployed
to the independent Vercel review (`dpl_HeuA2CyFgTtiAtvut1MrQB8ECkbR`). The team's October 28
feedback, the follow-up interaction fixes, the Frame 122 refinements (hero curtain, showcase
spacing, adaptive builder results, two-state inquiry module, form hierarchy) and the Frame 123
refinements (builder heading scale, faster builder wall, compact line-based inquiry form), the
full-bleed builder wall, the automatic showcase rotation and the /community "Join the DAO" copy
(Join our community, About Moloch) are implemented locally and **uncommitted**, awaiting the owner's review at http://localhost:3017/clients.
Nothing was staged, committed or pushed. The `/clients` iteration was deployed from a clean temporary archive;
the worktree changes remain uncommitted.

## In progress: Join the DAO iteration

The community hero, navigation and creed primary CTAs now read “Join our community”. The Guild chapter
is now “About Moloch” and includes the supplied Moloch, Hats Tree and stewardship copy, with links to
the DAO Roles handbook and Hats Protocol. Its actions are “Explore the Hats Tree” and “Find your path
into the Guild”. Changes are uncommitted and not deployed.

Verification: `bun run test` 68/68, `bunx tsc --noEmit` passes, and `bun run build` passes with the
existing `HeaderJoin.tsx` unused-variable warning removed for this iteration. Visual parity against the
October 23 baseline is not verified because the referenced checkout is unavailable.

## Environment

| Item | Value |
|---|---|
| Directory | `/Users/louchi/Projects/raidguild-integration` (Git worktree of `~/Projects/raidguild-venture-beyond`) |
| Branch | `feat/venture-beyond-integration` (no upstream configured) |
| HEAD | The documentation closeout commit "docs: record the Hire the DAO review release", whose parent is the release `da9165b10a9b1347e932809ac4af984fde21f3c8`. Both are pushed to `fork/feat/venture-beyond-integration`. |
| Compared with `origin/main` (`b02d67b`) | 84 ahead, 1 behind |
| Other worktrees | `raidguild-venture-beyond` (`feat/tae-content-update`), `raidguild-tae-narrative`, `raidguild-tae-review` |

## References (keep them separate)

| | Approved visual baseline | Integrated release | Deployed review |
|---|---|---|---|
| **What** | October 23 Venture Beyond dual-audience iteration | Hire the DAO iteration (October 27 designs) | Independent review deployment of the integrated release |
| **Commit** | `40f39109cb85` (2026-10-23 16:24 -0300) | `da9165b10a9b` (2026-10-28). Previous release: `4a771d873e0f` (2026-10-27). | `da9165b10a9b` (clean `git archive` of the commit) |
| **Where** | `~/Projects/raid-guild/website`, branch `design/venture-beyond-iteration` | This worktree; https://github.com/luisblancoach/website/tree/feat/venture-beyond-integration | https://raidguild-venture-beyond-review.vercel.app |
| **Tags** | `checkpoint/oct23-iteration`, `backup/venture-beyond-oct23` | None for `da9165b` (not requested). Earlier: `release/review-4a771d8`, `release/review-b4c9e1e`. | none |
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

Source: `~/Projects/raidguild-backups/2026-10-28/DEPLOY-vercel-review-da9165b.md`, which
follows the procedure in `~/Projects/raidguild-backups/2026-10-27/DEPLOY-vercel-review-4a771d8.md`.

| Item | Value |
|---|---|
| Deployed | 2026-10-28 04:18 UTC, via Vercel CLI 65.2.0 (`npx` cache; the 4a771d8 deploy used 65.4.0) |
| Project | `raidguild-venture-beyond-review` (scope `luisblancoachs-projects`) |
| Environment and ID | Vercel Production, `dpl_HeuA2CyFgTtiAtvut1MrQB8ECkbR` (https://raidguild-venture-beyond-review-ia727ffql.vercel.app; per-deployment URLs require Vercel login) |
| Production URL | https://raidguild-venture-beyond-review.vercel.app |
| Release | `da9165b`, from a clean `git archive` (`~/Projects/raidguild-backups/2026-10-28/deploy-da9165b`). It excludes the uncommitted `packageManager` line, `clients.pdf` and the vertical Queen Raida image. The `.env.local` that `vercel link` wrote (an OIDC token) was deleted before upload. |
| Build | Next.js 15.5.23 with Bun (`bun install --frozen-lockfile`, `bun run build`) on Vercel; the same archive was built and tested locally first |
| Variables | `SHOW_REVIEW_FLAGS` only (Production and Preview), value `false`; no secrets |
| Rollback | Promote `dpl_2PQiaWtMuRVojKoLXuYgAD4cmgSa` (release `4a771d8`, deployed 2026-10-27 04:25 UTC), for example with `vercel promote` or a rollback in the Vercel dashboard |
| Unavailable by design | Project inquiry form (HTTP 500) and `/chat` (503), because there are no secrets |

- `raidguild-venture-review` is a separate October 23 deployment, untouched (last updated
  2026-10-24).
- `raidguild.estudioblanco.org` has not been redirected to the new project. On 2026-10-28 04:23
  UTC it still returned 302 to `raidguild-website-redesign-production.up.railway.app`.
- Not changed: raidguild.org, Cloudflare, Railway and `origin`.

## In progress: October 28 feedback (uncommitted, not deployed)

Against the deployed review (`dpl_HeuA2CyFgTtiAtvut1MrQB8ECkbR`, release `da9165b`). References:
`~/Downloads/Frame 120.png` (desktop, 3840 px wide, a 1600 px layout at 2.4×) and
`~/Downloads/Frame 121.png` (mobile, 940 px wide, a 393 px layout at about 2.39×). Decisions are
in `docs/venture-integration.md` (October 28 feedback entry).

| Area | Change |
|---|---|
| Dotted boxes | Root cause: the narrative review flags (orange = claim, purple = wording) and the "13 claims · 13 wording" panel rendered on every local dev server (`NODE_ENV !== "production"`). `reviewFlagsEnabled` now returns false in development unless `SHOW_REVIEW_FLAGS=true`; previews and Railway unchanged. Focus outlines unchanged. |
| Case studies | All nine descriptions are Tae's copy (`tae-brief`); the October 23 archive titles and summaries for DAOhaus, BrightID and Hypercerts are removed, so no project has a title line. Daedalus, Problem, Gitcoin and YieldNest now have descriptions. Livepeer and Pocket unchanged. |
| Daedalus | Link `https://ddls.co` (was `https://ddls.co/`). Logo button and screenshot replaced by the owner in `public/` (byte-identical to `~/Desktop/RG/casestudies/`; MD5s in `docs/asset-provenance.md`). Name stays "Daedalus". |
| People behind the work | Heading "The Guild runs on owners, / not employees." (owner-approval), showcase hierarchy: 34/46 px desktop, `min(22px, 5.6vw)`/`min(34px, 8.6vw)` mobile, coral label, centred on mobile. Intro "These are some of the builders shipping the work. The full network is deeper." transcribed from both frames (flagged as wording until confirmed). Mobile: two columns, the fifth card centred. Members link and data unchanged. |
| Builder network | Illustration up to 450 px (was 360) on desktop, `min(340px, 92%)` (was 280) on mobile. Wall in masonry rows (`TeamWall masonry`): three rows, card width follows each name and title, no truncation; rows balanced by estimated length, cards grow to equal row length so the loop seam stays aligned. Three rows on mobile (was two). Filters, links, drag and motion unchanged. |
| Inquiry | `GuildInquiry surface="cyan"`: panel on `--color-cyan` (#B8E0DF, sampled from the frames) in the light theme with dark-green text, focus ring and hunt clue; dark theme unchanged. Illustration enlarged (`clamp(420px, 40vw, 640px)` desktop, `min(470px, 120vw)` mobile). |
| Creed | "build." coral at every width in the light theme (was dark green below 1000 px); mobile section at least 600 px tall (was about 430). |
| Scope | People, wall, inquiry and creed changes are /clients only. /community and / unchanged (checked: no masonry, people section as before). |

### Interaction fixes (2026-10-28, after the owner's local review)

| Issue | Root cause and change |
|---|---|
| P0 duplicated builders when filtering | Not the data or React keys: `TeamWall` always rendered a second, aria-hidden copy of the cards for the seamless loop, so short filtered lists (UX/UI: Suede, Vika, Chiali) showed every card twice. The loop copy now renders only while one copy is wider than the wall and motion is allowed (measured with a ResizeObserver); short lists sit still and show each builder once. The first copy is the only one in the accessibility tree and tab order. `masonryRows` moved to `lib/data/memberCategories.ts`. Applies to every `TeamWall` (also /community and /), since it is a bug fix. |
| P0 inquiry form opened as a separate dark section | `.contactExpanded` moved the disclosure out of the panel to full width with the dark form shell. With `surface="cyan"` the disclosure stays in the panel column; the panel grows to hold the form, whose shell sits on the panel surface (dark-green text, fields, step pills; errors in `--moloch-600`, 5.6:1; the "About you" heading in the existing `#c92662`, 3.7:1 large text). Desktop: the illustration stays beside the form (sticky). Reveal: 0.32 s fade, off with reduced motion. The form (HireUs, three steps, validation, progress, submission) is unchanged. Closing: the same "Start a Guild inquiry / Close the inquiry ↑" disclosure; values are kept. Dark theme: same layout on its own surface. |
| P1 navigation copy | `clientsNav.cta` is "Build with us" (owner-approval), same `project-inquiry` destination; desktop and the mobile menu share it. Hero CTA, inquiry heading and creed keep "Tell us what you're building". |
| P1 hero parallax | **Not implemented; decision needed.** Measured on a clean export of `40f3910` (port 3019) and this branch at 1440 and 393 px: identical motion. The October 23 approved hero has no layered depth either: the foreground halves move with the page and, from 1000 px, a later rule replaces their transform, so `--neo-fore-y` has no effect; `--neo-curtain-open` and `--neo-track-*` are consumed by the CSS but never set. Historical sources: (1) **`f48eb23`…`dbfa5b5` (2026-08-07 to 08-12, Dekan Brown)**: pointer and scroll parallax over separate painted layers (`sky-citadel.png`, `raidguild-panorama.png`, `hero-foreground.png`, all still in `public/images/neo/`), replaced by the video backdrop in `1557d1b` (2026-09-09). (2) **`4ffb591` (2026-08-19) to `5d8a82d^`**: the "curtain": `.heroExploring` set `--neo-curtain-open` (152 px, or `clamp(160px, 13vw, 250px)` from 1000 px) so the two foreground halves parted when hovering the title or the hero waypoints ("HOVER TO LOOK BEYOND"), removed in `5d8a82d` (2026-09-25, "Prepare venture beyond redesign for review") with the waypoints. Both can be recovered from history with their assets, but neither is in the approved baseline, and each brings UI that was removed (waypoints, hover prompt) or replaces the approved video backdrop. |

### Frame 122 refinements (2026-10-28, `~/Desktop/Frame 122.png`, a 1600 px layout at 2.4×)

| Area | Change |
|---|---|
| Hero curtain | Owner chose the August 19 – September 25 curtain (`4ffb591`, removed in `5d8a82d`). Historical behaviour (from `5d8a82d^:src/components/HomeExperience.{tsx,module.css}`): `.heroExploring` set `--neo-curtain-open` (152 px; `clamp(160px, 13vw, 250px)` from 1000 px), opening in 0.8 s and closing in 1.4 s on `cubic-bezier(.16,.76,.18,1)`, triggered by hovering or focusing the title or the waypoints, released 2.2 s after the pointer left. Restored on /clients only (`Hero curtain`): same distances, easing, timing and 2.2 s release; triggers are the title hover (fine pointer) and keyboard focus in the hero copy, plus scroll (opens progressively over the first 45% of the hero height), answering "make this layer react on parallax". Adaptations: no waypoints or "Hover to look beyond"; the copy no longer shifts (`--neo-track-title-x` not restored); touch screens, which had no foreground transform at all, get the curtain only, at `min(64px, 16vw)` on phones. Video, headline, CTAs and navigation unchanged; at rest every transform is as before. Reduced motion: nothing moves. Why it had looked static: the touch rule removed the transforms, the scroll offsets are clamped to hero height minus viewport (about 1 px since the hero became viewport-height), and nothing set the curtain variables after 5d8a82d. |
| Previous Works spacing | Frame 122 marks the space between the ticker and the heading. Section top `clamp(80px, 7vw, 104px)` (was 48 px; the section rhythm), heading to showcase `clamp(44px, 4vw, 64px)` (was 36). Mobile 72 px and 36 px (were 56 and 28). |
| Builder results | `builderGrid.ts` + `TeamWall` (`masonry`, /clients): 1–8 results render as an editorial grid that fills the wall's area: 12 × 3 on containers ≥ 720 px (container query), two columns below. Templates per count: 1 one feature card; 2 two feature cards; 3–4 asymmetric (a tall card, a wide card, compact cards); 5–8 denser mixes. Shapes set the composition (feature: large avatar beside; tall: avatar above; wide/compact: avatar beside). Names size to the card width and their own length (container units, minimum 14 px), roles wrap; nothing is clipped. Each builder appears once; links, filters, keyboard focus kept. 9+ results keep the moving wall; a wall that fits without moving now fills the width (Coordination at 1440). Real data has no 1- or 2-result category, so those layouts are covered by unit tests only. /community and / unchanged. |
| Begin a transmission | Two exclusive states (`surface="cyan"`): A shows the label, title, description, signal clue and "Start a Guild inquiry"; B hides all of it and shows the form in the same module (same width, position and background; height follows the form). The summary click sets state directly, so both never show in the same frame. Close ("Close the inquiry ↑", existing copy) and Back on step 1 return to A; Previous on later steps goes back a step; values are kept (the form stays mounted). Focus moves into the form on open (also from "Build with us") and back to the button on close. The 0.32 s fade is off with reduced motion. The form coordinates row is not shown in this module. |
| Form hierarchy | Close bar on top; heading 26–34 px (was about 58) over its supporting line in body type, then a divider; compact outlined stepper with a coral progress bar (site colours, was the shadcn card with the moloch bar); current step filled dark green; step title 22 px (was about 38); labels 15 px semibold; fields filled cream with a border and rounded corners (were underlines); Back/Previous outlined on the left, Next on the right. `ui/wizard.tsx` gains an optional `onExit` (Back on step 1) and `aria-current="step"`; `HireUs` passes `onExit` through. No fields, validation or submission changed. |

### Frame 123 refinements (2026-10-28, `~/Desktop/Frame 123.png`, a 1600 px layout at 1.8×)

| Area | Change |
|---|---|
| Builder heading | Was 64 px weight 400 on both lines, second line in Grinder Retalic. Now the showcase heading scale: lead 34 px weight 900, letter-spacing .01em, line-height 1.05; coral line 52 px Grinder italic 400. Mobile: lead 20 px, coral line `clamp(30px, 10.2vw, 48px)` (40 px at 393; "Of builders." is a letter longer than "Our clients"). Wording and colours unchanged. /clients only (`audience.module.css`). |
| Builder wall speed | Full moving wall 18 → 36 px/s on /clients (`TeamWall speed`, `BuilderNetwork` `WALL_SPEED_CLIENTS`); /community and / stay at 18. Measured 36.0 px/s at 1440 and 393, at most 1 px per frame, seamless across the loop seam. Adaptive grids (1–8 results) do not move. Reduced motion: still. |
| Form proportions | State B module 985 → about 700 px tall at 1440 (introduction state about 575). Module padding `clamp(20px, 2.6vw, 40px)` top; close bar 18 px below; wizard gap 14 px; buttons 44 px. |
| Form typography | Heading "Tell us about your project" 34 → 24 px on one line (Frame 123: "make it smaller"); the October 23 line "Three steps: introduce yourself, … before sending." removed (Frame 123: "remove this"); stepper title 13 px mono caps over a 13 px step name, 4 px coral bar; step pills 13 px; step title 18 px (was 22); labels 14 px semibold. |
| Stepper and pills | On the brand's lightest neutral `--scroll-100` (#F9F7E7) for Frame 123's "use white" (there is no pure white token); no borders; the current pill dark green with cream text. |
| Fields | Line-based: no fill, no side borders, a 1.5 px dark-green underline (55%), 44 px minimum height, textarea 84 px. Focus: coral underline, thickened. Invalid: `--moloch-600` underline; error text unchanged (moloch-600, 5.6:1). No field, validation or submission change. |

Frame 123 notes not covered by the brief, **not implemented** (open questions 17–18): "REMOVE THIS" on the
People section's "Explore all members ↗" link, and "MAKE GUTTER" beside the bottom-right of the
builder wall. No handwritten note asks for a faster wall; the speed change follows the brief.

### Full-bleed wall and showcase rotation (2026-10-28, after Frame 123)

| Area | Change |
|---|---|
| Builder wall | While it moves, the /clients wall runs edge to edge (`TeamWall bleed`, `data-bleed`): `margin-inline: calc(50% - 50vw)`, `width: 100vw`, the edge fade mask removed; the section's `overflow: hidden` clips it, so the page never scrolls sideways. The gaps between cards are unchanged (18 px desktop, 12 px mobile): "make gutter" read as the spacing between cards, per the owner. Heading, description, filters and count stay on the content grid. Whether the wall moves is judged against the section's full width, so it cannot flip between widths. Static lists (adaptive grids; Coordination at desktop widths, where it fits without moving) keep the content width. 36 px/s, seamless loop, dragging, filters and accessibility unchanged. /community unchanged (mask kept, no bleed). |
| Showcase rotation | `PreviousWorks rotate` (/clients): next project every 3 s, looping through all nine; the outgoing screenshot fades out over the incoming one (0.45 s) and the name and description fade in (0.35 s); the selected logo follows in every marquee. Manual selection (logos, previous/next, arrow keys) restarts the 3 s interval. Pauses while the mouse is over the showcase, while keyboard focus (`:focus-visible`) is inside it, while it is less than 35% on screen and while the tab is hidden; never runs with reduced motion (manual selection then switches without fades). Rotation changes are not announced (`aria-live="off"`); manual ones are (`polite`). The logo marquees keep their own movement and manual scrolling. Descriptions, links and assets unchanged. |

### /community: Join the DAO iteration (2026-10-28)

- The copy was already in the working tree when this session started it: `src/lib/narrative/community.ts`
  was edited at 21:45 outside this session (no other agent session was active on this worktree).
  Kept verbatim, as owner-supplied:
  - main CTA "Join our community" (hero, navigation and creed), destination unchanged
    (`https://portal.raidguild.org/join`);
  - Guild section: title "About / Moloch"; body (Moloch as coordination failure); disclosure
    "RaidGuild's Hats Tree" (roles, Hats Protocol, budgets and authority); "Stewardship" with
    "Stewards"; the requirement line "Explore the roles, responsibilities and paths that help the
    Guild coordinate."; CTAs "Explore the Hats Tree" (DAO Roles handbook page) and "Find your path
    into the Guild" (`membership/join-the-guild`); link "Hats Protocol ↗" (GitHub repository).
  - The long texts stay review-flagged claims (notes ask to confirm the lore, Hats assignments and
    steward roles); production renders them, as for other claims.
- This session added: the "DAO Roles ↗" link (wording flag) beside "Hats Protocol ↗", as the brief
  asks for links to both; the Guild mark instead of the Discord icon on "Find your path into the
  Guild" (a handbook link); a single Guild-kit entry now spans both columns
  (`.guildBenefits dl > div:only-child`, only /community has one entry); three narrative tests.
- Not changed: the separate Join section ("Join / the DAO", buttons "Join the DAO" and "Enter
  Discord"), /clients, assets, deploy configuration.
- Checks: `bun run test` 71/71, `bunx tsc --noEmit` passes, lint 0 errors (1 old warning),
  `bun run build` passes (run in an isolated copy so the dev server's `.next` is untouched).
  Production build: general 75/75 (includes /community hero and capabilities), rotation and bleed
  66/66 (includes /community), Frame 122/123 365/365, marquee 40/40; /community at 1440 and 393:
  no overflow, no console errors. Screenshots (local and the published review, before/after):
  `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/join/`.

Changed files (all uncommitted):
- Code and data: `src/lib/narrative/types.ts`, `src/lib/narrative/clients.ts`,
  `src/lib/narrative/shared.ts`, `src/lib/data/caseStudies.ts`, `src/components/TeamWall.tsx`,
  `src/components/venture/sections/BuilderNetwork.tsx`,
  `src/components/venture/sections/GuildInquiry.tsx`, `src/components/venture/primitives/Review.tsx`
  (comments), `src/components/venture/venture.module.css`, `src/components/venture/audience.module.css`,
  `src/app/(venture)/clients/page.tsx`, `src/app/(venture)/community/page.tsx` (comment),
  `src/lib/data/memberCategories.ts` (`masonryRows`), `src/components/venture/builderGrid.ts` (new),
  `src/components/venture/sections/Hero.tsx`, `src/components/venture/showcase.module.css`,
  `src/components/venture/shell/VentureShell.tsx`, `src/components/HireUs.tsx`,
  `src/components/ui/wizard.tsx`. Frame 123 touched `audience.module.css`, `TeamWall.tsx`,
  `BuilderNetwork.tsx`, `HireUs.tsx` and `venture.module.css` again. The full-bleed wall and the
  rotation touched `TeamWall.tsx`, `BuilderNetwork.tsx`, `venture.module.css`,
  `sections/PreviousWorks.tsx`, `showcase.module.css` and `src/app/(venture)/clients/page.tsx`.
- Tests: `tests/narrative.test.mjs`, `tests/public-content.test.mjs`, `tests/members.test.mjs`.
- Assets (owner-supplied, not by the agent): `public/images/casestudies/custom_buttons/button_daedalus.svg`,
  `public/images/casestudies/snapshots/Snapshot_daedalus.png`.
- Docs: `STATUS.md`, `CHANGELOG.md`, `docs/venture-integration.md`, `docs/asset-provenance.md`.

### Verification of the full-bleed wall and rotation (2026-10-28)

- `bun run test` 68/68. `tsc --noEmit` passes. Lint: 0 errors, the same 1 old warning.
- `SHOW_REVIEW_FLAGS=false bun run build` passes (isolated copy, no `.env*`), served on 3018 and
  stopped afterwards.
- Browser suites on the production build: rotation and bleed suite 66/66 (also on the dev
  server); Frame 122/123 suite 365/365; October 28 suite 96/96; general 75/75; marquee 40/40. The
  October 28 and general suites read the showcase screenshot as `#featured-work img`, which now
  also matches the hidden outgoing image during a crossfade; both now read the visible one.
- The rotation suite covers, at 1440 and 393 px: DAOhaus first; changes every 3 s in order
  (measured 2.85–3.4 s); a full loop of nine back to DAOhaus; crossfade and copy fade; the
  selected logo in sync; no announcements during rotation, announcements on manual choice; the
  logo marquee still moving; manual selection restarting the interval (no change within 2.4 s,
  a change by 3.5 s); hover pause and resume; keyboard focus pause, keyboard Next, resume on
  blur; no rotation offscreen; reduced motion still, with manual selection and no fades; no
  overflow or errors. The wall checks, at 1600, 1440, 393 and 375 px: edge to edge, no mask,
  cards crossing the viewport edge, gaps 18/12 px, heading and filters on the content grid, no
  page scroll, 36 px/s, dragging (desktop), filtered grids at the content width; /community
  unchanged.
- Screenshots: `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/rot/final/`.
- Not verified: Safari, Firefox, physical devices, screen readers; with classic (non-overlay)
  scrollbars, `100vw` includes the scrollbar, so about half its width is clipped off each side.

### Verification of the Frame 123 refinements (2026-10-28)

- `bun run test` 68/68. `tsc --noEmit` passes. Lint: 0 errors, the same 1 old warning.
- `SHOW_REVIEW_FLAGS=false bun run build` passes (isolated copy, no `.env*`), served on 3018
  and stopped afterwards.
- Browser suites on the production build: Frame 122/123 suite 365/365 (also on the dev server;
  new: builder heading equal to the showcase heading, wall 31–41 px/s, a seamless wrap across the
  loop seam, the "Three steps" line gone, compact module height, line-based fields with coral
  focus and moloch error underlines, the stepper and pills on scroll-100, steps 1 → 2 → 3 with
  Complete offered but not pressed, Previous keeping values), October 28 suite 96/96, general
  75/75, marquee 40/40. Wall speed probe: /clients 36.0 px/s, /community 18.0 px/s.
- Screenshots (1440 and 393 px, 2× pixels):
  `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/f123/final/`.
- Not verified: form submission (no backend), Safari, Firefox, physical devices, screen readers.

### Verification of the Frame 122 refinements (2026-10-28)

- `bun run test` 68/68 (new: every adaptive template covers its grid exactly once for 1–8
  results, wide and narrow; the agreed compositions; categories map to grid or wall).
  `tsc --noEmit` passes. Lint: 0 errors, the same 1 old warning.
- `SHOW_REVIEW_FLAGS=false bun run build` passes (isolated copy, no `.env*`), served on 3018
  and stopped afterwards.
- Browser suites on the production build: Frame 122 suite 315/315 (also on the dev server),
  October 28 suite 96/96 (two checks updated for the grid and the Close control), general 75/75,
  marquee 40/40. The earlier interaction suite (`p0.mjs`) is superseded by the Frame 122 suite,
  which carries its checks forward. The Frame 122 suite covers, at 1440, 1024, 393 and 375 px
  (reduced motion at 1440 and 393): curtain closed at rest, opening on title hover, holding then
  closing, opening on scroll (≤ 64 px on phones) and closing on return, nothing moving with
  reduced motion, video and headline kept, no waypoint prompt; showcase spacing; every filter
  (unique, count matches, grid filling the area with mixed proportions, legible, unclipped,
  links; wall without duplicates; a fitting wall full width); keyboard focus on cards; inquiry
  state A/B exclusive in every animation frame (mouse and keyboard), same module, focus moves,
  Close, Back, Previous, values kept, hierarchy sizes and contrast, Back left / Next right,
  "Build with us" opening state B; no overflow or console errors; /community and / unchanged.
- Screenshots (1440 and 393 px):
  `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/f122/final/`.
- Not verified: form submission (no backend secrets; not attempted), Safari, Firefox, physical
  devices (the touch curtain was tested with emulated touch), screen readers.

### Verification of the interaction fixes (2026-10-28)

- `bun run test` 66/66 (new: masonry rows hold each filtered builder exactly once for every
  category; filter counts 30/5/4/3/6/12; nav CTA "Build with us" to `project-inquiry`).
  `tsc --noEmit` passes. Lint: 0 errors, the same 1 old warning.
- `SHOW_REVIEW_FLAGS=false bun run build` passes (isolated copy, no `.env*`), served on port
  3018 and stopped afterwards.
- Browser suites, production build: interaction regression suite 190/190 (also on the dev
  server); October 28 suite 96/96; general 75/75; marquee 40/40. The interaction suite covers,
  at 1440 and 393 px with and without reduced motion:
  - every filter: unique builders matching the count, nobody on screen twice, one copy in the
    accessibility tree, the loop copy never focusable, no loop copy for short lists or with
    reduced motion, the full wall still looping, profile links kept;
  - one inquiry module and one form; collapsed and expanded states; the form inside the
    light-blue module, no dark section, the module growing; reveal animation off with reduced
    motion; focus on the disclosure; validation message readable (≥ 4.5:1); Next to step 2
    (67%), Previous back with values kept; closing returns to the initial panel; reopening
    keeps values;
  - navigation "Build with us" (desktop and mobile menu), its destination, opening the
    embedded inquiry with focus; the other "Tell us what you're building" uses unchanged;
  - hero (unchanged, October 23 behaviour): layers respond to scroll and pointer, still with
    reduced motion; no overflow, no console errors;
  - /community (no masonry, unique results) and the / member wall.
- Before/after screenshots:
  `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/oct28/before-p0/`
  and `.../oct28/after-p0/` (the "before" nav capture already shows the new label; the deployed
  review shows the old one).
- Not verified: form submission (the review has no backend secrets; not attempted), Safari,
  Firefox, physical devices, screen readers.

### Verification of the October 28 feedback (2026-10-28)

- `bun run test` 64/64. `tsc --noEmit` passes. `bun run lint`: 0 errors, the same 1 old warning.
- `SHOW_REVIEW_FLAGS=false bun run build` passes, built in an isolated copy of the working tree
  (scratchpad `build-oct28`, no `.env*`) so the running dev server was not disturbed, and served
  on port 3018 for the browser suites (stopped afterwards).
- Browser suites (Playwright, system Chrome), production build and dev server both:
  - general 75/75 (two Daedalus checks updated for the new copy and link);
  - marquee interaction 40/40;
  - new October 28 suite 96/96 at 1600, 1440, 393 and 375 px: no review flags, panel or
    dotted boxes; all nine descriptions and no title lines; Daedalus link and assets; people
    heading, intro, five cards, two columns on mobile, no sideways scroll; masonry three equal
    rows, varied card lengths, no truncation, wall moving, filters working; inquiry light blue
    with dark text, enlarged illustration, form opens; creed coral, mobile ≥ 600 px; no
    overflow, console errors or failed requests; dark theme inquiry unchanged; /community
    without masonry.
- Visual comparison with Frame 120 / Frame 121 at their own scale (1600 and 393 px), annotations
  excluded: people heading, wall, inquiry panel and creed follow the references. Screenshots:
  `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/oct28/final/`.
  Differences that remain: the inquiry panel is about 600 × 640 px at 1600 (reference about
  634 × 619); the desktop illustration's visible artwork is about 505 px tall (reference about
  575). Not compared against the October 23 baseline (superseded for these sections by the
  owner's references). Not verified: Safari, Firefox, physical devices, screen readers.

## Released: Hire the DAO iteration (`da9165b`)

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

### Verification of the published review (2026-10-28, production URL)

- Version identity on `/clients`: release-only content is present ("Hard problems,", "What
  we've built for", the approved Services sentence, the new asset paths). Superseded content
  is absent ("Turn complex technology", Ultimate Dominion, the original design sentence,
  MANY EDGES).
- `/`, `/clients` and `/community` return HTTP 200 at 1440 and 375 px with no console errors.
- All 19 new assets return 200; `clients.pdf` returns 404 (not published). All nine external
  project links respond 200.
- No review notes, statuses or flags in the production HTML, and none in the static chunks
  (checked on the local build of the same archive).
- General suite 75/75 and marquee interaction suite 40/40 pass against the production URL.

### Verification before release (2026-10-28, local production build)

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

- The release `da9165b` contains exactly the 38 approved files. The documentation closeout
  commit changes only `STATUS.md` and `CHANGELOG.md`.
- **October 28 feedback**: uncommitted; see "In progress" above.
- **User changes, preserved and still uncommitted:**
  - `package.json`: the `packageManager: yarn@1.22.22` line.
  - 21 manually deleted legacy images in `public/images/`: `cohort-*` (8),
    `expect-image-*` (4), `hire-image-*` (4) and `home-*` (5).
    - They are still in the repository and in the deployed archive.
    - Only the unused components `HomeHero`, `CohortHero`, `HireUsSection`,
      `CohortProcessSection` and `CohortValueSection` reference them.
  - `public/images/queen-raida/queen_raida_reference_vertical.png`: untracked `/community`
    artwork, not used.
- **Never commit these local files:**
  - `public/images/casestudies/clients.pdf` (reference only)
  - `public/images/casestudies/.DS_Store` and `public/images/queen-raida/.DS_Store` (gitignored)

## Next actions

1. Owner review of the October 28 feedback and interaction fixes at
   http://localhost:3017/clients (dev server on port 3017, started this session with
   `bun run dev --port 3017`), and a decision on the hero parallax (open question 13).
2. On approval: commit the files listed under "In progress" (not `package.json`, the 21
   legacy deletions, `clients.pdf` or the vertical Queen Raida image), push to the fork, and
   deploy a clean archive to `raidguild-venture-beyond-review` as for `da9165b`.
3. Physical-device checks: trackpad momentum, iOS and Android touch flings, Safari and
   Firefox, and a screen reader on the marquee.

## Open questions

1. **Case-study titles.** The archive titles ("Automated protocol maintenance", "Social identity
   systems", "Tools for public goods funding") were removed with their summaries, so all nine
   projects read name → Tae's description. Restore them, or supply new titles?
2. **People intro** "These are some of the builders shipping the work. The full network is
   deeper." is transcribed from Frame 120/121. Confirm the wording (flagged as wording).
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
8. **Release tag:** should `da9165b` get a `release/review-da9165b` tag, like the earlier
   review releases?
9. **Problem** is displayed as "Problem"; Tae's copy says "Problem Media". Rename the project?
10. **/community** shares the builder wall, people section and creed. Apply the masonry wall,
    coral "build." and taller mobile creed there too?
11. **Daedalus on /community** (`lib/data/venture.ts` partners) still links to `https://ddls.co/`
    with its own description; left unchanged.
12. **Review flags locally** now need `SHOW_REVIEW_FLAGS=true bun run dev --port 3017`. Keep
    this default?
13. **Hero curtain** (resolved 2026-10-28: the owner chose the August 19 curtain; restored on
    /clients). Open: is the full historical distance (about 187 px at 1440) right, should
    scroll open it too (the adaptation for "react on parallax"), and should /community and /
    get it?
14. **Inquiry form on the light-blue surface**: two colours were chosen for contrast on cyan:
    `--moloch-600` for field errors and the existing `#c92662` for the step headings. Confirm.
15. **Showcase spacing:** the brief said "between the heading and the showcase"; Frame 122's
    note sits between the ticker and the heading. Both gaps were increased; confirm the balance.
16. **Inquiry coordinates** ("Your project starts here · Contact · Project · Requirements") are
    no longer shown in the /clients module (they were inside the area Frame 122 marks to
    disappear). Keep them hidden?
17. **"Explore all members ↗"** (People behind the work, /clients): Frame 123 marks it "remove
    this"; the brief does not, and the previous round asked to keep the links. Remove it?
18. **"Make gutter"** (resolved 2026-10-28): the owner reads it as the spacing between cards; the
    wall now runs edge to edge and the card gaps are unchanged.
19. **Inquiry form copy** comes from the October 23 iteration (`40f3910`, via `9aa9bfc`), not
    Tae's brief or the narrative layer: "Tell us about your project", the step names, labels and
    placeholders. The "Three steps" line is removed per Frame 123; the rest is unchanged. The step
    name now appears three times (stepper, pill, step title). Approve the copy, or reduce the
    repetition?
20. **Showcase rotation interval**: 3 s, as asked, includes a 0.45 s crossfade; the longer
    descriptions (DAOhaus, BrightID) take longer than 3 s to read, so hover or focus pauses it.
    Keep 3 s?
21. **Join the DAO copy source**: this session could not see the owner's message with the approved
    Moloch copy; it kept the text already in `community.ts`. Confirm it is verbatim.
22. **Handbook domain**: "Explore the Hats Tree" and "DAO Roles ↗" point to
    `rg-handbook-nextra.vercel.app/dao-operations/dao-roles` (a Vercel domain); the official
    `handbook.raidguild.org/docs/dao-operations/dao-roles` also answers 200. "Explore the Hats Tree"
    goes to the DAO Roles page rather than a Hats tree view, and "Hats Protocol ↗" to the GitHub
    repository (hatsprotocol.xyz is the product site). Confirm the destinations.
23. **/community Join section** still reads "Join / the DAO" with "Join the DAO" and "Enter
    Discord". Align it with "Join our community"?
24. **Guild CTAs on desktop** now stack (the longer labels no longer fit side by side, as "Join the
    DAO" and "Enter Discord" did).
