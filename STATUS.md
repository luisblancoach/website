# STATUS

Snapshot: 2026-10-30, afternoon (-0300). **Release `07031e2` is committed, pushed and deployed to Vercel production:**
`dpl_Bz4p12G9bayZT3kdJo41U73PGpGM`, https://raidguild-venture-beyond-review.vercel.app. **The shared CTA system, the
numbered landing-page inventory, the builder module restored to the October 28 editorial grid on a flat
coral plane, the afternoon pass (page container, persistent top bar, Join hero title, Moloch title
with the sword mark, Hats and heading refinements), the final contact module's scene and profession
gallery, the night refinements (foam removed, creed, hero, random gallery, Hire SEO), the CTA icon and pill
system, and the final pass (logo restored, single outline, open form, clues in the footer, section
rhythm)** (sections "October 30" below). Nothing committed, pushed or deployed; the owner
reviews first; the release is now approved for external review.**

Previous snapshot, 2026-10-29, night (-0300). **Iteration 04** (Moloch title, Explore copy, builder layouts by
result count, Hats/Projects swap, CTA states) is committed on `feat/venture-beyond-integration` on top of
iteration 03 (`6ecb1c7`) and pushed to `fork/feat/venture-beyond-integration`. The fork has no Vercel Git
integration (no deployments or commit statuses on any commit), so the push created no preview; it was
then deployed manually as a preview (below).

**Preview of iteration 04 (latest):** `10e1fbf` deployed manually as a Vercel Preview (owner-approved):
`dpl_Hz6aoUMyBBgvCfBHk7sgq2JNNNW3`, https://raidguild-venture-beyond-review-g42gy6tbd.vercel.app (Vercel
login; no alias), clean `git archive`, `--build-env SHOW_REVIEW_FLAGS=false` for that deployment only.
`/clients` and `/community` 200 via `vercel curl`; Moloch title, Explore copy, order, builder tiers and CTA
tokens verified. Record: `~/Projects/raidguild-backups/2026-10-29/DEPLOY-vercel-review-10e1fbf.md`.

Deployments: Production review still release `2bf270d` (`dpl_HqkPYA55qh5V9QHFQpUxwWZ1xjko`,
https://raidguild-venture-beyond-review.vercel.app). Earlier preview of iteration 03 `6ecb1c7`:
`dpl_9RDNQZ5VNvT9hcjDtC5ANj5ho3G8`, https://raidguild-venture-beyond-review-72zh7hv5h.vercel.app (Vercel
login; deployed 2026-10-29 22:18 with `--build-env SHOW_REVIEW_FLAGS=false`, project env unchanged; record
`~/Projects/raidguild-backups/2026-10-29/DEPLOY-vercel-review-6ecb1c7.md`).

Left uncommitted on purpose (the owner's): `package.json` (`packageManager`), the 21 deleted legacy images,
`public/images/casestudies/clients.pdf`, `.DS_Store` files.

**Production verification:** anonymous requests to `/clients` and `/community` return 200; authenticated
`vercel curl` responses contain the new metadata, Moloch title and Join copy.

**Local server:** http://localhost:3017 is running (`bun run dev --port 3017`, restarted 2026-10-30
afternoon because it kept serving a stale narrative module); `/clients` and `/community` return 200.

**Next priority:** collect external feedback on the published October 30 release. The remaining local-only
files are intentionally excluded from the release: `package.json`, the 21 deleted legacy images,
`public/images/casestudies/clients.pdf`, and `.DS_Store` files.

Previous next priority was: release of the October 30 work (all uncommitted, sections below): commit, push and
Vercel publish once approved; the owner's new files it references must be committed with it
(`public/images/swords.svg`, `public/images/neo/join-*-{light,dark}.png`, `public/images/professions/`,
`public/images/icons/favicon-moloch.png`, the new `public/images/icons/*.svg` incl. `ico_telegram.svg`). Section reordering uses the numbered inventory below, in a later
iteration. Promoting iteration 04 to production still needs approval.

## Environment

| Item | Value |
|---|---|
| Directory | `/Users/louchi/Projects/raidguild-integration` (Git worktree of `~/Projects/raidguild-venture-beyond`) |
| Branch | `feat/venture-beyond-integration` (no upstream configured) |
| HEAD | `10e1fbf3cf2e7715794d89ac5301de61d9d3817d` "feat(venture): Moloch title, builder layouts and CTA states" (iteration 04), parent `6ecb1c7`. Pushed to `fork/feat/venture-beyond-integration`; preview-deployed. |
| Compared with `origin/main` (`b02d67b`) | 88 ahead, 1 behind |
| Other worktrees | `raidguild-venture-beyond` (`feat/tae-content-update`, `a195359`), `raidguild-tae-narrative` (`feat/tae-narrative-redesign`, `3385f41`), `raidguild-tae-review` (`feat/tae-review-content`, `a6418ea`) |
| Local server | http://localhost:3017 (`bun run dev --port 3017`, restarted 2026-10-30); `/clients`, `/community` 200, serving `10e1fbf` plus the uncommitted CTA system |

## References (keep them separate)

| | Approved visual baseline | Integrated release | Deployed review |
|---|---|---|---|
| **What** | October 23 Venture Beyond dual-audience iteration | October 28 Hire the DAO and Join the DAO refinements | Independent review deployment of the integrated release |
| **Commit** | `40f39109cb85` (2026-10-23 16:24 -0300) | `2bf270dc0280` (2026-10-28 22:23 -0300). Previous releases: `da9165b10a9b` (2026-10-28), `4a771d873e0f` (2026-10-27). | `2bf270dc0280` (clean `git archive` of the commit) |
| **Where** | `~/Projects/raid-guild/website`, branch `design/venture-beyond-iteration` | This worktree; https://github.com/luisblancoach/website/tree/feat/venture-beyond-integration | https://raidguild-venture-beyond-review.vercel.app |
| **Tags** | `checkpoint/oct23-iteration`, `backup/venture-beyond-oct23` | None for `2bf270d` or `da9165b` (not requested). Earlier: `release/review-4a771d8`, `release/review-b4c9e1e`. | none |
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

Source: `~/Projects/raidguild-backups/2026-10-28/DEPLOY-vercel-review-2bf270d.md`, which
follows the procedure in `DEPLOY-vercel-review-da9165b.md` (same folder).

| Item | Value |
|---|---|
| Deployed | 2026-10-29 01:25 UTC (2026-10-28 22:25 -0300), via Vercel CLI 65.2.0 (`npx` cache) |
| Project | `raidguild-venture-beyond-review` (scope `luisblancoachs-projects`) |
| Environment and ID | Vercel Production, `dpl_HqkPYA55qh5V9QHFQpUxwWZ1xjko` (https://raidguild-venture-beyond-review-qz9pi1ezj.vercel.app; per-deployment URLs require Vercel login) |
| Production URL | https://raidguild-venture-beyond-review.vercel.app (`/clients`, `/community`) |
| Release | `2bf270d`, from a clean `git archive` (`~/Projects/raidguild-backups/2026-10-28/deploy-2bf270d`) plus `.vercel/project.json` copied from the da9165b deploy (no `vercel link`, no `.env*` written). It excludes the uncommitted `packageManager` line, the 21 deleted legacy images (still in the repository and deployed), `clients.pdf` and the vertical Queen Raida image. |
| Build | Next.js 15.5.23 with Bun on Vercel; the exact release tree was installed, tested (71/71), type-checked and built locally first |
| Variables | `SHOW_REVIEW_FLAGS` (Production) only; no secrets |
| Rollback | Promote `dpl_DsHcdtCVBX6QNKNHSx4iwUaxyhxz` (22:16, same content, uncommitted source) or `dpl_HeuA2CyFgTtiAtvut1MrQB8ECkbR` (release `da9165b`), with `vercel promote` or Instant Rollback |
| Unavailable by design | Project inquiry form (HTTP 500) and `/chat` (503), because there are no secrets |

- `raidguild-venture-review` is a separate October 23 deployment, untouched (last updated
  2026-10-24).
- `raidguild.estudioblanco.org` has not been redirected to the new project. On 2026-10-28 04:23
  UTC it still returned 302 to `raidguild-website-redesign-production.up.railway.app`.
- Not changed: raidguild.org, Cloudflare, Railway and `origin`.

## October 30 (release pass): Guild CTA order; release candidate (uncommitted)

Decision record: `docs/venture-integration.md` ("release pass"). Files: `sections/GuildPrologue.tsx`,
`venture.module.css` (Guild CTA row).

Validation (dev server, final focused run before release):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 85/85; `bun run lint` 0 errors (1 old
  warning, `ThemeAnchor` in `HeaderJoin.tsx`).
- `gorder.mjs` (/community at 1440, 1100, 900 light/dark; 393, 375): Join the DAO left, Your Guild kit flush
  right (0 px from the row's right edge) on one row; stacked Join → Kit on phones; links unchanged; no
  overflow, no errors. `kit.mjs`: kit opens, Escape / close button close it, focus returns, reduced motion.
- Regression: builders audit 480 cards / 0 failures (dark rest #191E4E, selected #303674); wall height stable
  at all 12 route/width combinations; route titles and WebP share images served (150 / 111 KB, 200); form:
  no own heading, one-line description at 1920/1440, stepper, no duplicate step heading, picker and
  validation; Builders/People/Hats selection family and 115 px joint; scenes pinned (10 cases); form grows
  downward; wall slows on hover; both routes × 1440/393 × light/dark without overflow, broken images,
  failed requests, console errors or layout shift.
- Not run: the full CTA browser suite (`scratchpad/pw/cta.mjs`): its expectations describe the earlier
  system (pink edges, transparent outline pills, white hover labels) and would fail on deliberate changes;
  it needs rewriting before it can serve as a gate. Not verified: Safari/Firefox, physical devices,
  production build (`bun run build` not run in the worktree while dev runs).

Release notes for the commit: include the untracked files the code references (see "Working tree" below);
leave the owner's `package.json` change, the 21 deleted legacy images, `public/images/casestudies/clients.pdf`
and `.DS_Store` files out unless told otherwise.

## October 30 (metadata pass): share images, form intro, card colours, one card family (uncommitted)

Decision record: `docs/venture-integration.md` ("metadata pass"); images in `docs/asset-provenance.md`.
Files: `src/app/(venture)/{clients,community}/page.tsx`, new `public/images/venture/og/*.webp`,
`src/components/HireUs.tsx`, `sections/Stewardship.tsx`, `venture.module.css`.

Validation (dev server):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 85/85; lint 0 errors (old warning).
- Metadata (served HTML): each route has one title, description, og:title/description/url/image (+ width,
  height, type, alt) and twitter card/title/description/image; /clients → clients-queen-raida.webp,
  /community → community-moloch.webp; both 200 `image/webp` (150 / 111 KB); "/" unchanged.
- `audit-builders.mjs`: 480 cards, 0 failures; dark rest rgb(25, 30, 78) = #191E4E on all 240 dark cards,
  dark hover/focus rgb(48, 54, 116) = #303674. `stable.mjs`: stable at all 12 route/width combinations, no
  card outside the plane, no name truncated or under 13 px.
- `sel.mjs`: steward cards light hover/focus = cyan + 3 px navy edge; dark = #303674 + 3 px cream edge;
  focus ring; Builders → next 115 px on both routes.
- `dek2.mjs`: no form heading; description one line at 1920 (16 px) and 1440 (15.1 px), two lines at 1100
  and 393 (16 px).
- `final.mjs`, `wall.mjs`, `comp.mjs`, `grow.mjs`, `dd.mjs`, `sec2.mjs`: no overflow, broken images,
  errors or layout shift; wall slows on hover; scenes pinned; form grows downward; picker, stepper,
  validation, transparent secondaries and Join title unchanged.
- Screenshots `scratchpad/pw/now/fam.png`, `wd.png`, `inq-l.png`.

Open questions (new):
62. Social previews use WebP (as asked). Some platforms (notably LinkedIn) have rendered WebP og:images
    unreliably; a JPEG fallback of the same crop is a one-line change if needed.
63. The /community title, description and share title are drafted copy; confirm or replace.

## October 30 (panel-secondary pass): transparent in-panel secondaries, Join title rhythm (uncommitted)

Decision record: `docs/venture-integration.md` ("panel-secondary pass"). File: `venture.module.css`.

Validation (dev server):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 85/85; lint 0 errors (old warning).
- `sec2.mjs` ("Your Guild kit", "Enter Discord" at 1440 and 393 × light/dark; form Previous): background and
  icon disc transparent on the panel (bone #EFE9D7 / navy #191E4E and #252A61); label, edge and glyph the
  same at rest, hover, pressed and focus (navy light, cream dark); hover/pressed a 9% / 16% tint; focus
  ring; disabled .5. Join title one line: 47 px (1440), 30 px (393), Retalic 30 / 20 px lead.
- `audit-builders.mjs`: 480 cards, 0 failures; dark surface rgb(48, 54, 116) = #303674 on all 240 dark
  instances. `stable.mjs`: stable at all 12 route/width combinations. `final.mjs`, `comp.mjs`, `grow.mjs`,
  `guild.mjs`, `aboutyou.mjs`: no overflow, broken images, errors or layout shift; scenes pinned; form grows
  downward; Guild order unchanged; no duplicate step heading.
- Screenshots `scratchpad/pw/now/jtv.png` (title variants), `jt-both.png`, `jt-mob.png`.

## October 30 (wall-frame pass): #303674 cards, fixed wall height, adaptive tiles, shared selection (uncommitted)

Decision record: `docs/venture-integration.md` ("wall-frame pass"). Files: `src/components/TeamWall.tsx`
(`memberTileBody`), `src/components/ui/wizard.tsx` (step heading), `venture.module.css`,
`hats.module.css`.

Validation (dev server):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 85/85; lint 0 errors (old warning).
- `audit-builders.mjs`: 480 card instances (both routes × light/dark × 1440/393 × six tabs), 0 failures:
  every card a link with label; mark ≥ 24 px within 16 px of the top-right corner; avatar loaded; no
  truncated name, none under 13 px; contrast name ≥ 3, profession ≥ 4.5, mark ≥ 3; dark surface exactly
  rgb(48, 54, 116); one surface, edge, radius and colour set per theme; hover/focus marks 32–40 px.
- `stable.mjs` (both routes at 1440, 1100, 900, 768, 393, 375 × six tabs): module height and the next
  module's offset identical across tabs at every width; no card outside the plane; no truncation.
- `sel.mjs`: steward and Hats cards: hover/focus/selected = 3 px edge, surface unchanged, no transform, no
  dimming; focus ring; Escape clears; Builders→next gap 115 px on both routes.
- `aboutyou.mjs`: no duplicate step heading; stepper "About you"; first label 14 px under the stepper.
- `final.mjs`, `wall.mjs`, `comp.mjs`, `grow.mjs`, `dd.mjs`, `guild.mjs`: no overflow, broken images,
  errors or layout shift; wall 36 → 11 px/s on hover; scene pinned; form grows downward; picker, stepper,
  validation and Guild CTA order unchanged.
- Screenshots `scratchpad/pw/now/wd.png`, `wm.png`, `selh.png`, `ay-1440.png`.

## October 30 (normalization pass): one builder card component (uncommitted)

Decision record: `docs/venture-integration.md` ("normalization pass"). Files: `src/components/TeamWall.tsx`
(every card a link, `cardLink`), `src/lib/data/constants.ts` (`PORTAL_MEMBERS_URL`), `venture.module.css`
(card component block).

Validation (dev server):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 85/85; lint 0 errors (old warning).
- Builders audit `scratchpad/pw/audit-builders.mjs`: /clients and /community × light/dark × 1440/393 ×
  all six tabs (All builders, Frontend, Smart Contracts, UX/UI, Fullstack, Coordination): 480 card
  instances, 0 failures. Every card: a focusable `<a>` with href, aria-label and new tab; crossed-swords
  mark at 24 px; avatar loaded; name ≥ 3:1, profession ≥ 4.5:1, mark ≥ 3:1 on its surface; name clear of
  the mark; no overflow, no console errors. Hover and keyboard focus (two cards per tab): mark 32 px,
  contrast held, focus ring present. Properties identical across all cards of a theme, except the
  deliberate phone grid variant (stacked layout, 14 px padding, name fitted), which is the same in both
  themes.
- `wall.mjs`: 36 → 11 → 36 px/s (hover slows, never stops); count line screen-reader only.
- `final.mjs`, `comp.mjs` (10 cases), `grow.mjs`: no overflow, broken images, errors or layout shift; scene
  pinned; form grows downward with a fixed top.
- Screenshots: `scratchpad/pw/now/nn.png` (wall light/dark), `gs.png` (grids with a selected tile),
  `gs-m.png` (phone grid).

Open question: 61. Profile URLs for Aperion, Bitbeckers, Elco, Georgeh, Jip, Takekek, Ven and Vid (their
cards link to the Portal directory meanwhile).

## October 30 (CTA order pass): Guild CTA hierarchy, one builder-card surface (uncommitted)

Decision record: `docs/venture-integration.md` ("CTA order pass"). Files: `sections/GuildPrologue.tsx`,
`primitives/PillIcon.tsx` ("←"), `src/components/TeamWall.tsx` (card mark), `venture.module.css`.

Validation (dev server):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 85/85; lint 0 errors (old warning).
- `guild.mjs` (/community 1440 and 393 × light/dark): order = Your Guild kit (secondary, 56 px), Join the DAO
  (primary, 56 px), Enter Discord (link with Discord mark, 44 px), Read the handbook, Questions? Ask Queen
  Raida. `kit.mjs`: kit opens, Escape and the close button close it, focus returns to the kit pill, reduced
  motion respected, no overflow.
- `cards.mjs` (/clients 1440 light, /community 1440 dark, /clients 393 dark, /community 393 light × all six
  categories): one background, one name colour, one profession colour, one radius, one edge per view; every
  linked card's mark is the crossed swords at 24 px, 10 px from the top-right corner; selected (keyboard
  focus) = same surface, navy name, #CE1252 profession, 32 px navy mark, 3 px navy edge; selector-to-plane
  gap 48 px desktop / 40 px phones; no overflow, no errors.
- `wall.mjs`: still 36 → 11 → 36 px/s with hover; count line screen-reader only.
- `final.mjs`, `grow.mjs`, `comp.mjs` (10 cases), `dd.mjs`: no overflow, broken images, errors or layout
  shift; form top fixed while it grows; scene pinned with figures in place (scene and gallery positions
  unchanged in this pass); picker, stepper and validation as before.
- Screenshots `scratchpad/pw/now/gt.png`, `g-393d.png`.

## October 30 (form pass): channel picker, bone panel, stepper, coral logo sword (uncommitted)

Decision record: `docs/venture-integration.md` ("form pass"). Files: `src/components/HireUs.tsx`,
`src/components/ui/wizard.tsx`, `src/app/globals.css` (picker menu), `venture.module.css` (panel, fields,
stepper, logo), new `public/images/icons/ico_telegram.svg` (provenance recorded).

Validation (dev server):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 85/85; lint 0 errors (old warning).
- `dd.mjs` (/clients 1440 and 393 × light/dark): empty Next marks 3 fields invalid and stays on step 1; the
  picker opens by keyboard, menu bone/navy edge (light) or navy/cream edge (dark), 2 options at 44 px with
  their marks; stepper states current/next → done/current → done/done/current; no percentage left; no
  overflow, errors or failed requests. `dd2.mjs`: Telegram chosen by mouse (paper-plane mark in the trigger),
  Discord chosen back by keyboard (Enter, ArrowUp, Enter).
- `dl.mjs`: "Enter Discord" = "Explore our work" in both themes; logo swords coral on bone and navy.
- `final.mjs`, `grow.mjs`, `comp.mjs` (10 cases), `wall.mjs`: no overflow, broken images, errors or layout
  shift; form top fixed while it grows; scene pinned; wall slows on hover; corner swords present.
- Screenshots: `scratchpad/pw/now/form1.png`, `ddstep.png`, `disc.png`, `logo2.png`.

## October 30 (wall pass): Builders wall, Moloch title, white panel, ground alignment (uncommitted)

Decision record: `docs/venture-integration.md` ("wall pass"). Files: `src/components/TeamWall.tsx`,
`sections/BuilderNetwork.tsx`, `venture.module.css` (cards, panel, scene shift), `feature.module.css`
(Moloch title).

Validation (dev server):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 85/85; lint 0 errors (old warning).
- `wall.mjs`: wall speed 36–37 px/s, 11 px/s while hovered, 36 after leaving (/clients light, /community
  dark at 1440); every linked card's icon is the up-right sword at 10/10 px from the top-right corner (wall
  and a 4-card category grid), no text arrows; selected card (keyboard focus) white / navy name / #CE1252
  profession in both themes; count line present only as screen-reader text.
- `mol.mjs`: Moloch lead cream; MOLOCH 73 px vs Raida's 52 px at 1440, about 51 px at 393 and 49 px at 375;
  mark on the same line; no overflow.
- `ground.mjs` before/after (Hire and Join × Light and Dark at 1440; 393 Hire light, Join dark): screenshots
  `scratchpad/pw/now/gb-d.png` → `ga-d.png`, `gb-m.png` → `ga-m.png`.
- `comp.mjs`, `grow.mjs`, `final.mjs`: scene pinned and gallery fixed in all samples; form grows downward;
  both routes × 1440/393 × light/dark without overflow, broken images, failed requests, errors or layout
  shift.

Open question 60 (dark-phone builder names) is resolved by the shared cyan card surface (CTA order pass).

## October 30 (hover pass): calm hover and pressed states (uncommitted)

Decision record: `docs/venture-integration.md` ("hover pass"). Files: `venture.module.css` (tokens, pills,
form buttons, chips, reduced motion), `audience.module.css` (builder filters), `ArtifactGallery.module.css`
(Explore filters, detail actions), `showcase.module.css` (arrows), `tests/cta-contrast.test.mjs`.

Validation (dev server):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 85/85; lint 0 errors.
- `hover.mjs` (13 controls × light/dark at 1440: hero primary/secondary, Ask our AI CTO, Moloch, Guild kit,
  Guild secondary, builder filter, Join primary, Discuss your project, creed, form Next, Hire/Join and
  Day/Night options): label, edge, glyph colour, width, height, radius, weight and tracking identical at
  rest, hover and pressed; labels never turn white; primary fill constant, secondary bone/navy one step
  deeper, chips tinted; focus ring present. The builder filter's focus check was not applicable (unselected
  filters are not Tab stops; the row uses arrow keys).
- `states.mjs` sheet `scratchpad/pw/now/states-sheet5.png`.
- `rm.mjs`: reduced motion: no lift, no sword nudge, no transition; touch (393): a tap leaves no hover.
- `final.mjs` (both routes × 1440/393 × light/dark): no overflow, broken images, failed requests, console
  errors or layout shift.

## October 30 (composition pass 2): figures on the art's ground, Dark primary = selected tab (uncommitted)

Decision record: `docs/venture-integration.md` ("composition pass 2"). Files: `venture.module.css` (stage,
gallery coordinates, dark tokens), `sections/ContactScene.tsx` (vertical cut ≤ 600 px),
`tests/cta-contrast.test.mjs`.

Validation (dev server):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 84/84; lint 0 errors.
- `comp.mjs` (10 cases incl. form steps 1–3, 1920/1440/900/393/375, both routes, both themes): stage pinned
  at 0 with the art's height (630 at 1440, 770 at 1920, 394 at 900, 590 at 393); gallery box constant
  relative to the stage in every scroll sample; phones: panel starts at the figures' feet (550 vs 583 on
  /community 393); one-line heading; no overflow, no errors. Screenshots `scratchpad/pw/now/compd2.png`,
  `compm2.png`, compared with the owner's join-horizontal / join-vertical mockups.
- `states.mjs` (10 CTAs × 2 themes incl. Ask our AI CTO): dark primaries rest coral / navy label / cream edge
  / navy disc; all states; sheet `scratchpad/pw/now/states-sheet4.png`; tab bar `now/tabs-dark.png`.
- `final.mjs`, `grow.mjs`, `wheel.mjs`: no overflow, broken images, failed requests, errors or layout shift;
  form grows downward with a fixed top; wheel scrolls through and past the section.
- Open question 58 (cream label contrast) is resolved by the navy label.

## October 30 (composition pass): pinned scene + gallery, Dark primary, sword variation, showcase CTA (uncommitted)

Decision record: `docs/venture-integration.md` ("composition pass"). Files: `sections/ContactScene.tsx`
(children on the stage, `ContactGallerySlot`), `sections/{GuildInquiry,JoinCTA,Hero,Creed}.tsx`,
`primitives/PillIcon.tsx` (`↘`, `pathGlyph`), `venture.module.css`, `showcase.module.css`,
`tests/cta-contrast.test.mjs`.

Validation (dev server):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 84/84; lint 0 errors.
- `comp.mjs` (10 cases: /clients 1440 light step 1, 1440 dark step 3, 900 light step 2, 1920 dark, 393
  light/dark; /community 1440 light/dark, 393 dark, 375 light), sampled at 0/35/70/100% of the section: the
  stage stays at 0, the gallery keeps the same box relative to the stage in every sample (1440: 100,198 /
  584×612; 393: 24,96 / 345×426), only the form moves; correct scene per theme/viewport; viewport covered
  while pinned; heading one line (45/37/29 px); no overflow, no errors.
- `states.mjs` (9 CTAs × 2 themes incl. "Discuss your project"): rest/hover/pressed/focus/disabled; dark
  primary rest cream label + cream edge; sheet `scratchpad/pw/now/states-sheet3.png`.
- `final.mjs` (both routes × 1440/393 × light/dark): no overflow, broken images, failed requests, console
  errors, layout shift; no rim, no clues near the form, footer clues present, correct scenes.
- `grow.mjs`: form open, step 2 keeps the top fixed (1440, 393).
- Not run: full CTA browser suite (expectations predate this system). Not verified: Safari/Firefox, devices.

Open questions (new):
58. Dark primary labels: cream on coral is 3.1:1 (below AA 4.5:1). Keep (owner's choice) or use ink labels?
59. The swords' curved crossguard is the strongest shape at 24–28 px; the right/diagonal swords read
    correctly zoomed, but confirm at real size.

## October 30 (final pass, later): pinned contact scene, one-line inquiry heading (uncommitted)

Decision record: `docs/venture-integration.md` ("final pass, later"). Files: `sections/ContactScene.tsx`
(stage wrapper), `sections/GuildInquiry.tsx` (stray class), `venture.module.css` (scene block, sticky
gallery, heading).

- Scene pinned (sticky stage, one viewport tall) behind the inquiry form and the Join panel; released at the
  section's end; no nested scroll. Desktop gallery pinned with it. Heading "YOU'RE BUILDING" on one line.

Validation (dev server):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 83/83; lint 0 errors.
- `pin.mjs`, scrolling 0–100% of the section and past it: /clients 1440 light step 1 and dark step 3, 1100
  light step 2, 393 dark step 1 and light step 3; /community 1440 dark and 393 light. Stage stays at 0
  (full viewport height) while the form moves up (about 230 px on desktop, about 760 px on phones), then
  leaves with the section; desktop gallery holds at the section padding; heading one line (45 / 36 / 29 px);
  no overflow, no errors. Join at 1440×900 has no travel (it fits the viewport).
- `kb.mjs`, `wheel.mjs`: gallery held while typing; PageDown and the wheel scroll through and past the
  section to the page end without stalls.
- `final.mjs` (both routes × 1440/393 × light/dark): no overflow, broken images, failed requests, console
  errors or layout shift; correct scenes.
- Screenshots mid-scroll: `scratchpad/pw/now/pin-desk.png`, `pin-mob.png`.
- Not verified: Safari/Firefox (sticky inside `overflow: clip` needs Safari 16+), devices.

Open question: 57. The Join heading "INTO THE GUILD." still wraps on phones; apply the same one-line rule?

## October 30 (final pass): logo restored, single outline, form open, clues moved, rhythm (uncommitted)

Decision record: `docs/venture-integration.md` ("October 30, 2026 (final pass)").

- **Logo:** late-night coral/navy logo reverted; the approved bar pill restored, one size larger
  (`venture.module.css`, "Persistent logo").
- **CTAs:** inner rim removed everywhere; one navy outline per CTA.
- **Inquiry:** open by default on /clients (audience routes), no trigger or close link, grows downward
  (`sections/GuildInquiry.tsx`).
- **Clues:** signal and walker moved to the footer on the audience routes (`shell/SiteFooter.tsx`,
  `sections/Creed.tsx`); hunt directions made location-neutral (`UnchartedHunt.tsx`, `PortalOverlay.tsx`).
- **Rhythm:** `--section-space` on every content module; desktop modules at least a viewport tall.
- Already in place and re-verified, unchanged: Builders flat/no particles/Oct 28 layouts, hero copy and cream
  TOGETHER, creed BUILD. highlight, randomized gallery with transmission, theme/viewport scenes, Hire SEO,
  sword/destination icons, page container gutters.

Validation (dev server, 2026-10-30, final pass):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 83/83; lint 0 errors (old warning).
- `final.mjs`, /clients and /community × 1440/393 × light/dark: no overflow, broken images, failed
  requests, console errors, layout shift (0); no inner rim on any pill; no clue in the inquiry, Join or creed;
  4 clue controls in the footer; correct scene per theme/viewport; no foam, no dots, no text arrows.
- `grow.mjs`: form open on load, no trigger/close/Back controls; Next to step 2 keeps the section and form
  top unchanged (1440 and 393); no errors.
- `secs.mjs`: content modules 115/115 px padding at 1440, 72/72 at 393; desktop modules ≥ 900 px at 900 high.
- `states.mjs`: 16 CTA captures (8 CTAs × 2 themes) with rest/hover/pressed/focus/disabled; sheet
  `scratchpad/pw/now/states-sheet2.png`.
- `logo.mjs`: logo at 1440/393/375 × light/dark: contained pill, "RaidGuild home", href "/", focus ring
  shown; bar fits at 375.
- Not run: the full CTA browser suite (its expectations predate the navy edge and opaque secondaries).
  Not verified: Safari/Firefox, devices; favicon tab not re-checked this pass.

## October 30 (late night): CTA icons, primary/secondary pills, creed highlight, logo (uncommitted)

Decision record: `docs/venture-integration.md` ("October 30, 2026 (late night)"); icons:
`docs/asset-provenance.md`.

- **Icons:** `src/components/venture/primitives/PillIcon.tsx` (new). Sword right / down / up-right by action;
  Discord, Portal (Join's "Create your Portal profile"), handbook (Moloch CTA), RaidGuild logo (Raida,
  showcase, Services). Guild kit toggle: right/left swords. Theme switch: new sun/dark icons. Types:
  `Action.icon` gains "portal", `ImmersiveContent.cta.icon` ("logo" | "handbook").
- **Primary:** coral, navy edge, inner rim, ink label, navy disc + white glyph. **Secondary:** opaque cream
  (light) / navy (dark), contrasting edge and label, navy disc + white glyph. One set of hover, pressed,
  focus, disabled for both.
- **Creed:** "BUILD." on a coral rectangle with cream type.
- **Logo:** larger and contained: navy pill + white sword (light), coral pill + navy sword (dark).
- Files: `primitives/PillIcon.tsx`, `sections/{Hero,GuildPrologue,JoinCTA,ImmersiveFeature,Creed}.tsx`,
  `src/lib/narrative/{types,community}.ts`, `venture.module.css`, `tests/cta-contrast.test.mjs` (rewritten for
  the new system), docs.

Validation (dev server, 2026-10-30 late night):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 83/83.
- CTA states (`scratchpad/pw/states.mjs`, 1440, ×2 crops in `scratchpad/pw/st/`, sheet
  `scratchpad/pw/now/states-sheet.png`): hero primary/secondary on both routes, Moloch secondary, Join
  primary/secondary, creed primary, light and dark. Rest as specified; hover #CE1252 + white; pressed
  #A80E44 + white; focus 3 px dark-green ring + cream halo; disabled .5, not-allowed, no lift; all 56 px;
  glyphs as mapped. Secondaries stay opaque over the hero artwork in both themes.
- Health (`final.mjs`, both routes × 1440/393 × light/dark): no overflow, broken images, failed requests,
  console errors or layout shift; correct scene per theme/viewport; no foam, no dots; no text arrows left in
  any pill icon; creed highlight coral with cream type. Top bar fits at 375 (logo 8–66, switch 77–281,
  theme 287–367). "/" renders without errors.
- Favicon: still linked on every route as `/favicon.ico?favicon.141b0878.ico`; the tab itself was not
  re-checked visually.
- Not run: the full CTA browser suite (its expectations still describe the transparent outline and pink
  edge; it needs updating before it can pass). Not verified: Safari/Firefox, devices.

Open questions (new):
55. The sword arrows' curved crossguard can read as an arrowhead at small sizes (the right sword can look
    like "←"). They follow the supplied files; confirm, or supply a variant with a clearer tip.
56. `public/images/icons/arrow-rleft-down.svg` is spelled as supplied (not `arrow-left-down.svg`).

## October 30 (night): Ideas heading, no foam, creed, hero, random gallery, Hire SEO (uncommitted)

Decision record: `docs/venture-integration.md` ("October 30, 2026 (night)").

1. **Ideas into Working Systems**: second line on one line on both routes (`services.module.css`): 52 px at
   1440 in a 600 px column, about 40 px at 1100, 30 px on phones (container units).
2. **Builder foam removed** (CSS block and `BuilderNetwork.tsx` wrapper); no particles anywhere.
3. **Creed**: "build." cream, weight 400, no highlight, both themes.
4. **Join hero**: "Find your people." / "Build something together." on three lines, "TOGETHER." large and
   cream; 88 px desktop (ends at 717 px at 1440, inside the copy column); phones within the gutters.
5. **Gallery**: shuffled order without repeats; about 1.3 s hologram transmission (channel split, flicker,
   figure-masked scanlines); pauses, reduced motion and the hidden status unchanged; no dots.
6. **Hire SEO**: title, Open Graph/Twitter title and description from the brief; share image and site name
   restated; og:url /clients; noindex kept. /community untouched.

Files: `src/components/venture/{services.module.css,venture.module.css}`,
`sections/{BuilderNetwork,ContactScene}.tsx`, `src/lib/narrative/community.ts`, `tests/narrative.test.mjs`,
`src/app/(venture)/clients/page.tsx`, docs.

Validation (dev server, 2026-10-30 night):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 82/82.
- `scratchpad/pw/final.mjs`, /clients and /community × 1440/393 × light/dark (8 runs, full-page scroll): no
  overflow, no broken images, no failed requests, no console errors, layout-shift score 0; scene loaded =
  horizontal-light, horizontal-dark, vertical-light, vertical-dark as expected and nothing else; no foam
  element; no dots; creed "build." rgb(239,233,215) at 400 on a transparent background.
- Gallery (`holo.mjs`): transmission frames captured at 1440 light/dark and 393 light/dark; the gallery box
  never changed size; after each change the image is back to the plain foot fade with no filter; three visits
  gave three different orders (0135241, 0321542, 0135423), no immediate repeats.
- Heading and title extents measured (`em.mjs`, `title.mjs`); metadata checked in the served HTML (no
  duplicate og tags; og:image 200).
- Not run: the full CTA suite (not requested). Not verified: Safari/Firefox, devices, social-card previews.

## October 30 (evening): contact module refinement, dark scenes and favicon (uncommitted)

Decision record: `docs/venture-integration.md` ("October 30, 2026 (evening)"); assets:
`docs/asset-provenance.md`.

- **Scenes by theme and viewport:** light/desktop `join-horizontal-light.png`, light/phone
  `join-vertical-light.png`, dark/desktop `join-horizontal-dark.png`, dark/phone `join-vertical-dark.png`
  (`contactScenes` in `src/lib/data/illustrations.ts`). No light art behind Dark.
- **Animation:** 9 s per group, staggered opacity crossfade (out 1.6 s; in 2.4 s after 0.4 s), no slide or
  scale; pauses on hover anywhere in the module, focus in the module, off screen, hidden tab; reduced
  motion: still.
- **Pagination:** dots removed; screen-reader-only status.
- **Light:** scene unchanged; faint cream veil behind the panel (desktop) and a soft panel shadow.
- **Phones:** about 56 px of landscape above the group at 393.
- **Favicon:** `src/app/favicon.ico` rebuilt from `public/images/icons/favicon-moloch.png` (16/32/36 px).
- Files: `sections/ContactScene.tsx`, `venture.module.css` (contact block), `src/lib/data/illustrations.ts`,
  `src/app/favicon.ico`, docs. Form, validation, submission, copy, CTAs, route differences unchanged.

Validation (dev server, 2026-10-30 evening):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 82/82.
- Scene requests (Playwright, `scratchpad/pw/scene.mjs`): /clients and /community at 1440 light load only
  horizontal-light; at 393 dark only vertical-dark; Night → Day at 1440 adds horizontal-light only after the
  switch; 1440 light → 393 → Night → 1440 loads vertical-light, vertical-dark, horizontal-dark in turn, each
  only when shown. No failed requests, broken images, console errors or overflow.
- Gallery (`gallery2.mjs`, `gallery3.mjs`), /clients and /community at 1440 light and 393 dark: first change
  between 8 and 10 s; transitions as specified; held on hover over the panel, on focus in the module, in a
  hidden tab and off screen; no visible dots; status text present; reduced motion: no change in 11 s, 0 s
  transition. Gallery starts 101–112 px into the module (desktop) and 105 px (phones, with the new room).
- Screenshots: 1440 light and 393 dark on both routes, 393 light on /community: no overflow, no errors.
- Favicon: every route links `/favicon.ico?favicon.141b0878.ico` (`sizes="36x36"`, new hash, so caches
  refresh); served bytes match the new ICO; in Chrome after a hard refresh (Cmd+Shift+R, via the browser
  extension) the page links the new URL, which returns the new 3-image ICO. The tab strip itself could not
  be captured: **visual tab icon not verified by the agent**.
- Not run: the full CTA browser suite (not requested). Not verified: Safari/Firefox, devices.

Open questions (new):
54. The unlinked legacy icon files in `src/app` (`favicon.svg`, `favicon-96x96.png`, `apple-touch-icon.png`,
    `site.webmanifest` named "MyWebSite") are pre-existing; an Apple touch icon needs a larger source.

## October 30 (late afternoon): final contact module scene and profession gallery (uncommitted)

Brief: the owner's contact-module brief and mockups (`~/Desktop/Screenshot 2026-10-30 at 11.50.20 AM.png`
to `11.57.25 AM.png`). Decision record: `docs/venture-integration.md`; assets: `docs/asset-provenance.md`.

- **Assets integrated:** `neo/join-horizontal-light.png`, `neo/join-vertical-light.png`, the six
  `professions/*.png`. Not placed: `icons/favicon-moloch.png` (question 52).
- **Shared:** `sections/ContactScene.tsx` (`ContactScene`, `ProfessionGallery`) in `JoinCTA.tsx` and
  `GuildInquiry.tsx` (audience routes only). Data: `contactScenes`, `professions` in
  `src/lib/data/illustrations.ts`. Styles: end of `venture.module.css`.
- **Backgrounds:** horizontal cut above 760 px, vertical on phones; capped at 1760 px; cropped from the
  bottom. **Gradient:** scene foot fades over 42%, sides over 120 px when capped; groups fade over their
  lowest 14%; masks only, no added height, panel opaque.
- **Light / Dark:** light scenes in Light; Dark keeps the navy surface (no dimmed light art) until
  `join-horizontal-dark.png` / `join-vertical-dark.png` are added as `contactScenes.dark`.
- **Gallery:** opens on "Druid 2" (the former illustration), 7 s per group, 1.2 s crossfade; waits on
  hover, focus in the module, off screen, hidden tab; stops after a dot is chosen; one-tab-stop dots with
  arrows, 44 × 44 px; reduced motion: still, instant change.

Validation (dev server, 2026-10-30):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 82/82; `bun run lint` 0 errors (old warning).
- Playwright probe (`scratchpad/pw/gallery.mjs`), /community 1440 light and /clients 393 dark: rotation after
  7 s; held on hover, on focus in the module and with the tab hidden; dots 1 tab stop, 44 × 44, ArrowRight
  selects and announces; autoplay stops after a choice; alt names the group; no broken images, no failed
  requests, no overflow; the inquiry form still opens with focus moved (4 fields). Light loads only the
  horizontal scene at 1440; Dark loads no scene. Reduced motion: no rotation, no transition.
- Screenshots at 1440, 1920 and 393 in light and dark on both routes: no console errors, no overflow; the
  scene is contained at 1760 px at 1920. (One probe error came from the probe's own init script, not the site.)
- The probe found and the fix covers one defect: the gallery inherited `pointer-events: none` from the
  illustration class (hover pause and dot clicks did not work).
- Not run: the full CTA browser suite (not requested for this pass). Not verified: Safari/Firefox, devices.

Open questions (resolved in the evening pass): 52, the icon is now the site favicon; 53, phones now have
about 56 px of landscape above the group.

## October 30 (afternoon): page container, persistent bar, Join hero, Moloch, builder foam (uncommitted)

Brief: the owner's October 30 afternoon brief (16 items), Frames 132/133 (`~/Downloads/Frame 132.png`,
`Frame 133.png`) and the top-bar sketch (`~/Desktop/Screenshot 2026-10-30 at 10.58.21 AM.png`). The
`frontend-design` skill was not loaded in this session; existing tokens and components were used. Section
order unchanged on both routes.

What changed (decision record: `docs/venture-integration.md`, "October 30, 2026 (afternoon)"):

1. **Page container.** `--page-max: clamp(1240px, 78vw, 1500px)`, `--page-gutter: clamp(24px, 5.5vw,
   96px)`, `--page-inline` centres the column. Every section's first content line now starts at the same
   x on both routes: 211 px at 1920, 100 at 1440, 61 at 1100, 24 at 393 (measured; before: 88–476 at 1920,
   80–234 at 1440). The frames are about 1590 px captures scaled to 1920; the formula reproduces the
   owner's guides there (175 px). The hero copy keeps its own position (curtain art in the gutter).
2. **Persistent top bar** (both routes): sword logo → `/`, audience switch, Day/Night switch (two buttons
   in the audience switch's pill, coral when selected), pinned at 16 px on the page gutters; section nav
   scrolls with the header. Phones: logo disc and one theme switch (`role="switch"`), fitting at 375 px
   (logo 8–60, switch 77–281, theme 287–367). `ThemeSwitch` gained `segmented`; "/" keeps the celestial
   toggle.
3. **Shared CTA system**: unchanged from the morning pass; the new theme controls use the same chip
   states and focus ring.
4. **Join hero title**: "FIND YOUR PEOPLE / BUILD SOMETHING" (46 px desktop, about 30 px phones) and
   "TOGETHER" (94 px desktop, 56 px max phones) in pink; within the copy column (173–729 at 1440), no longer
   across the characters. `HeroContent.title.finale` (optional) added; /clients unchanged.
5. **Moloch**: "TOGETHER WE SLAY / MOLOCH" + `public/images/swords.svg` inline (owner's file; the brief says
   `sword.svg`), no "+". Art direction and bottom crop were already shared with Queen Raida.
6. Order unchanged. 7. **Guild Kit** verified, not changed. 8. **Raida/Moloch** copy now on the page
   column; image logic unchanged (shared component).
9. **Hats**: click outside the role cards clears the selection; "Stewards." 21 px / 800 with a 4 px coral
   rule. Layout, tree, cards and typography already matched the brief.
10. **Builders**: plane capped at 1760 px (`--page-wide`), centred, corners round only when capped; grid and
    still wall on the page column; coral foam (blurred forms and bubbles) behind the plane edges; the crew
    illustration added to /community. Angle stays deferred (flat).
11–12. Explore and Join copy already matched the brief (verified, unchanged). 13. Creed "build." already
    coral with navy text in both themes (verified). 14. Heading first lines are weight 900 on every
    section (Explore and the Join/inquiry panels were 400).

Files: `src/components/venture/shell/{SiteHeader,ThemeSwitch}.tsx`, `sections/{Hero,HatsTree,
BuilderNetwork}.tsx`, `src/components/venture/{venture,audience,feature,hats,services,showcase}.module.css`,
`src/lib/narrative/{types,community}.ts`, `src/lib/data/illustrations.ts` (comment),
`src/app/(venture)/community/page.tsx`, `tests/narrative.test.mjs`, `docs/venture-integration.md`,
`docs/asset-provenance.md`, `STATUS.md`. Uses the owner's untracked `public/images/swords.svg`.

Validation (2026-10-30 afternoon, dev server):
- `bunx tsc --noEmit --incremental false` passes; `bun run test` 82/82; `bun run lint` 0 errors (old
  `ThemeAnchor` warning).
- Focused checks at 1440 and 393, light and dark, per change (Playwright, system Chrome): top bar
  positions and theme switching (both controls, `aria-pressed`/`aria-checked`), bar pinned after scroll,
  two-tone focus ring and Tab order (skip, logo, Hire, Join, Day, Night, nav), phone menu open/Escape;
  section edges at 1920/1440/1100/393; hero title line extents at 375–1920; Guild Kit open/Escape/close and
  focus return (also reduced motion); builder plane fit in every category (54 states incl. 1920: plane =
  content + 28 px, cards on the column, no overflow; 24 reduced-motion states: still wall, scrollable
  strip, same fit).
- Full CTA suite once at the end (`scratchpad/pw/cta.mjs`, run 4): **1084/1084** at 1600, 1440, 393 and 375
  px, both routes, both themes (no overflow, no broken images, no console errors, 44 px targets, pill
  geometry, hover/pressed/focus/disabled, identical across themes, reduced motion). Its theme-control rows
  now probe the Day/Night switch (desktop).
- Comparison matrix produced: `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/4717b022-d4f9-4cde-9670-71d41c82afce/scratchpad/pw/cta-matrix-1440.png`
  (39 rows, Light/Dark × rest/hover/focus/pressed; HTML beside it as `matrix.html`).
- The dev server was restarted once: it kept serving a stale `community.ts` (old Moloch title) after edits.
- Not verified: parity with `40f3910` (not compared; these are new owner directions), Safari/Firefox,
  physical devices, screen readers, production build.

Open questions (new):
47. `public/images/swords.svg` is the owner's untracked file and is now referenced: commit it with this
    work (or rename to `sword.svg` as the brief says, then update `community.ts`).
48. Hero copy stays off the page column at 1440 (173 px vs 100 px) because of the curtain art; confirm.
49. "Find your path into the Guild" wraps to two lines at 393 (pre-existing).
50. Footer and /clients inquiry have content reaching the right edge at 393 (−49 px / 4 px, clipped,
    no page overflow; pre-existing, not changed).
51. Explore and Guild keep the Retalic face on their second heading line; the other sections use the italic
    display face. Unify if wanted.

## October 30 (later): builder module restored to the earlier behaviour (uncommitted)

Brief: the owner's recording `~/Desktop/Oct-30-2026 10-04-59.mp4` (16 s): the current light builder module
next to the earlier behaviour (dark), asking to restore the earlier one. Decisions in
`docs/venture-integration.md` (October 30, builders).

**Diagnosis.** The earlier behaviour is the October 28 editorial grid (`2bf270d`): 1–8 results render
`BuilderGrid` (`builderGrid.ts`, a 12 × 3 template per count, card shape by slot: feature, tall, wide,
compact; two columns below a 720 px container); 9+ render the flat three-course wall, moving when wider
than the screen. `a8ff16c` (iteration 02) deleted `builderGrid.ts` and the grid path, so every count became
masonry cards in centred, wrapping courses (iteration 04 tiers 1 / 2 / 3 courses), on a full-bleed coral
plane that `10e1fbf` tilted (`transform: rotate(-1deg)` on `.teamWall`, so plane and cards shared one
transform). Measured before the change: the plane's height already followed the courses (about 30 px above
and below in every category at 1024, 1280, 1440 and 393), so there was no stale height; what read as
empty coral was (a) short lists as small natural-width cards centred in a full-width band, (b) uneven wrapping
at mid widths (Smart Contracts 3 + 1 at 1024), (c) the tilt moving the band edges by up to about 13 px across
the screen, and (d) the recording, which crops a wider window. Root cause of the difference: the editorial
grid's removal in `a8ff16c`, not a height calculation.

**Change.**
- `src/components/venture/builderGrid.ts` restored byte for byte from `2bf270d`.
- `src/components/TeamWall.tsx`: the `BuilderGrid` path restored (1–8 results, masonry modules); 9+ keep the
  three-course masonry wall; the iteration 04 tiers (`data-tier`, 1/2-course rows) removed.
- `src/components/venture/venture.module.css`: the iteration 04 tier block replaced by the `2bf270d` grid
  rules (container query, slot shapes, name scaling) plus opaque tiles on the coral plane (cream / navy;
  hover cyan / #303675 as before). The coral plane is **flat** (tilt removed), wraps the grid or the wall,
  `height: auto` with 28 px above and below (the old 430 px and 340 px wall heights no longer apply); the grid
  keeps the section's content width inside the full-bleed plane; a moving wall still runs edge to edge.
- `tests/members.test.mjs`: the iteration 04 rows test replaced by the restored `2bf270d` grid tests.
- Angle: **removed.** The tilt leant the cards with the plane and made the slack around short lists read
  as uneven; the earlier behaviour is flat. The coral plane itself is kept, flat, hugging the content.
- Unchanged: section order, copy, assets, filters, wall speed (36 px/s), drag, CTA system.

**Validation (focused, dev server).** `bunx tsc --noEmit --incremental false` passes; `bun run test` 82/82;
`bun run lint` 0 errors (old warning). Probe `scratchpad/pw/builders.mjs`: /clients and /community, 1440 and
393, light and dark, all six categories (48 states): plane = content + 28 px above and below in every
state, no transform, no horizontal overflow, grid cards inside the content width (x 86–1354 at 1440, 24–369
at 393), no console errors; with reduced motion (48 states) no moving copy, same fit, no overflow.
Contact sheets: `scratchpad/pw/{clients-1440-light,community-1440-dark,clients-393-light,community-393-dark}.png`.
The full CTA browser suite was not rerun (as asked).

**Open.** (44) The brief's tiers say "5–8: two-row brick layout"; the restored earlier behaviour (the video)
uses the editorial 12 × 3 templates for 5–8 as well. Kept the video's behaviour; a two-row 5–8 variant is a
small follow-up if wanted. (45) On phones the moving wall's names render in a different face from desktop;
not changed in this pass (no diff touches it), not investigated. (46) At 1440 every 1–8 grid is the same
height (three content-sized rows, 348 px), as before.

## October 30: shared CTA system and landing-page inventory (uncommitted)

Brief: the owner's recording `~/Desktop/Oct-30-2026 09-27-22.mp4` (13 s, /community hero; it was not attached
to the message, this is the file of that time on the Desktop) shows the hero CTAs behaving differently in
Light and Dark. Measured before the change (1440, both routes):

| Control | Light | Dark |
|---|---|---|
| Outline CTA, rest | cream fill, ink label, pink border | transparent, white label, cream border |
| Outline CTA, hover | canonical pink, ink label, no ring | canonical pink, ink label, cream ring |
| Filled CTA, hover | #CE1252, cream label, no ring | #CE1252, white label, cream ring |
| Join panel CTAs, hover | cream ring (local override) | cream ring |
| "Your Guild kit" | pink text on the surface (under 4.5:1) | same |
| "Explore all … discoveries" | 1 px outline, no hover | same |
| Explore filters | 24 px radius, 1 px border, pink edge on hover | same |
| Showcase arrows, Hats tree link | pink | pink |
| Theme toggle, hover | darker surface | no change |
| Form Back / Next | 6 px radius, body type; Back hover 8% tint (dark: cream tint) | |

### Landing-page inventory (numbered, English; order unchanged)

`00` is the shared site shell (fixed, not part of the section order). "Shared" means the same component on
both routes; the copy may differ by route.

**`/clients`, Hire the DAO** (`src/app/(venture)/clients/page.tsx`)

| # | Block | DOM anchor | Component | Shared with /community | Interactive controls |
|---|---|---|---|---|---|
| 00 | Site Header + persistent top bar | (none; `#site-navigation`) | `shell/SiteHeader.tsx`, `shell/AudienceSwitch.tsx`, `shell/ThemeSwitch.tsx` (`segmented`) | Yes (route nav items) | Pinned bar: sword logo (→ `/`), audience switch (2 links), Day/Night switch (2 buttons; one switch on phones). Scrolling header: nav links (Previous works, Services, Builders, Build with us), mobile menu button |
| 01 | Hero | `#top` | `sections/Hero.tsx` (`grouped curtain still`) | Yes (copy differs) | Filled pill "Tell us what you're building", outline pill "Explore our work ↓"; curtain on hover/scroll |
| 02 | Guild Ticker | (none) | `sections/GuildTicker.tsx` (`LoopBand`) | Yes, identical | None |
| 03 | Client Showcase ("What we've built for our clients") | `#case-studies` (`#featured-work`) | `sections/PreviousWorks.tsx` (`rotate`), `primitives/LogoMarquee.tsx` | No | 9 logo buttons ×4 copies in marquees, previous/next arrows (desktop), project site text link, compact filled pill "Discuss your project"; 3 s rotation |
| 04 | Services & Capabilities ("What are you trying to ship?") | `#spears` (`#services`, `#capabilities`) | `sections/Services.tsx` | Same module as /community 10 (different content) | 5 accordion disclosures; compact filled pill (phones only) |
| 05 | Builders Network ("A wide network of builders.") | `#team` | `sections/BuilderNetwork.tsx` (`masonry`), `TeamWall.tsx` | Yes | 6 filter tabs, text link "Build with the Guild →", 30 builder cards (links), drag on the moving wall |
| 06 | People Behind the Work ("The Guild runs on owners, not employees.") | `#stewards` | `sections/Stewardship.tsx` | No | 4 steward cards (links), "Explore all members ↗" |
| 07 | Guild Inquiry ("Begin a transmission" / "Tell us what you're building") | `#contact` (`#project-inquiry`) | `sections/GuildInquiry.tsx`, `HireUs.tsx`, `ui/wizard.tsx` | No | Inquiry bar (disclosure), 3-step form (fields, select, Back/Previous, Next/Complete), close link, hunt clue disclosures |
| 08 | RaidGuild Creed | (none) | `sections/Creed.tsx` | Yes (copy differs) | Filled pill; hunt "walker" disclosures |
| 09 | Footer | (none) | `shell/SiteFooter.tsx` | Yes, identical | Brand link, GitHub, X, Discord, Brand archive |

**`/community`, Join the DAO** (`src/app/(venture)/community/page.tsx`)

| # | Block | DOM anchor | Component | Shared with /clients | Interactive controls |
|---|---|---|---|---|---|
| 00 | Site Header + persistent top bar | (none; `#site-navigation`) | `shell/SiteHeader.tsx`, `AudienceSwitch.tsx`, `ThemeSwitch.tsx` | Yes (route nav items) | Same pinned bar as /clients 00; nav links (Membership, Queen Raida, Projects, Join our community ↗), mobile menu button |
| 01 | Hero ("Find your people / Build something / TOGETHER") | `#top` | `sections/Hero.tsx` (`grouped curtain still`, `title.finale`) | Yes (copy differs) | Filled pill "Explore the community →", outline pill "See what we're building ↓" |
| 02 | Guild Ticker | (none) | `sections/GuildTicker.tsx` | Yes, identical | None |
| 03 | About RaidGuild ("Builder-owned / member-governed") | `#guild` | `sections/GuildPrologue.tsx` (`kitExpander`) | No (also on `/`) | "See more ↗" disclosure, "Your Guild kit →" toggle and panel with close ×, filled "Join the DAO →", outline "Enter Discord", 2 text links |
| 04 | Queen Raida ("A scout for signal. A scribe for the Guild.") | `#raida` | `sections/ImmersiveFeature.tsx` (`tone="raida"`) | No | Filled pill "Ask our AI CTO" |
| 05 | About Moloch ("Together we slay / Moloch" + sword mark) | `#moloch` | `sections/ImmersiveFeature.tsx` (`tone="moloch"`) | No | Outline pill "Find your path into the Guild" (coral scene) |
| 06 | Projects & Experiments ("What happens when builders follow their curiosity.") | `#work` (`#uncharted`, `#gallery`) | `sections/WallOfCuriosities.tsx`, `ArtifactGallery.tsx` | No (also on `/`) | 5 filter chips, discovery cards (buttons), "Explore all … discoveries", detail view (back link, filled action) |
| 07 | Builders Network | `#team` | `sections/BuilderNetwork.tsx` (`masonry`) | Yes | Same as /clients 05 ("Meet the Guild on Portal ↗") |
| 08 | Hats Tree ("RaidGuild's Hats Tree") | `#hats` (`#stewards`) | `sections/HatsTree.tsx` | No | 5 role cards (buttons, `aria-pressed`), "Explore the Hats Tree ↗" |
| 09 | Join the DAO ("Your first step into the Guild.") | `#join` | `sections/JoinCTA.tsx` | No (shares the /clients panel surface) | Filled "Create your Portal profile →", outline "Enter Discord", membership guide link |
| 10 | Ideas into Working Systems | `#spears` (`#services`, `#capabilities`) | `sections/Services.tsx` (`practices`) | Same module as /clients 04 | 5 accordion disclosures, specialist practices disclosure, compact filled pill (phones only) |
| 11 | RaidGuild Creed | (none) | `sections/Creed.tsx` | Yes (copy differs) | Filled pill; hunt disclosures |
| 12 | Footer | (none) | `shell/SiteFooter.tsx` | Yes, identical | Same as /clients 09 |

Shared blocks: Header, Hero, Guild Ticker, Builders Network, Creed, Footer, and the Services module (with
different content). Route-specific: /clients Showcase, People, Inquiry; /community About RaidGuild, Queen
Raida, Moloch, Projects & Experiments, Hats Tree, Join. Note: `#stewards` is the People section on /clients
but an anchor inside the Hats Tree on /community.

### Button behaviour decision

One system for both routes, identical in Light and Dark (decision record: `docs/venture-integration.md`,
October 30). The dark theme block no longer redefines any `--cta-*` token.

| State | All variants | Detail |
|---|---|---|
| Rest | Filled: canonical pink #EE3C78, ink label #071C1D (4.66:1), pink edge. Outline: transparent, border and label in the surface's text colour. | Chips at rest are outline; selected or open chips are the filled rest |
| Hover | Deep coral #CE1252, white label #FAFAFA (5.25:1), edge kept, 2 px lift | Only under `(hover: hover)`: no stuck hover after a tap |
| Pressed | #A80E44, white label (7.16:1), inset shadow, no lift | Returns to rest on release |
| Focus | 3 px dark-green outline at 3 px offset over a 3 px cream halo | Same geometry and colours in both themes |
| Disabled | Opacity .5, not-allowed, no hover or lift | |

Hover model chosen: the "white text conversion" option on a fixed deep-coral surface, the existing dark
hover. Cream fill and cream outline were rejected: the light theme puts CTAs on cream and light-blue
surfaces, where both would disappear.

Contrast exceptions (by surface, documented in the CSS): (1) light-blue surfaces in the light theme (Join and
inquiry panels, Explore band): dark-green edge instead of pink (2.66:1); (2) coral scenes (Moloch in both
themes, the dark creed): filled buttons rest on deep navy #12163B with a white label, every edge navy.

Applied to: hero, section, compact and creed pills; the inquiry bar; form Back/Previous (outline) and
Next/Complete (filled), now pills in the compact pill type (mono 12 px caps); "Your Guild kit" (chip;
selected when open); the kit close ×; "Explore all … discoveries" (outline); builder and Explore filters
(chips, 100 px radius, 2 px border); the detail view's actions (filled) and back link; the audience switch
(chip; current = selected); the theme toggle; the showcase arrows (icon buttons in the surface colour). Text
links (builders, showcase site, handbook, membership guide, Hats tree, close inquiry): surface colour,
underline 1 → 2 px on hover. Accordions keep their coral row hover; their focus ring is the shared one.
Content cards (builder cards in the moving wall, Explore cards, logo marquee) keep their inset rings
because their containers clip.

Visible consequences to review: the light hero outline CTA is now transparent (was cream-filled); the
Moloch outline CTA is transparent with a navy border (was a filled navy pill); the dark creed CTA is
deep navy (was pink on the pink creed); the showcase arrows and Hats tree link are no longer pink.

### Files changed (uncommitted)

- `src/components/venture/venture.module.css`: tokens; the B3.1 block replaced by the shared system
  (pills, exceptions, inquiry bar, form buttons); form Back/Previous; old ring overrides removed; a closing
  section for chips, toggles, icon buttons, text links and focus.
- `src/components/venture/{audience,showcase,hats,services,feature}.module.css`, `src/components/ArtifactGallery.module.css`.
- `tests/cta-contrast.test.mjs`: rewritten for the shared tokens (dark block defines no `--cta-*`;
  labels, edges and two-tone focus on every surface; coral exceptions).
- `docs/venture-integration.md` (October 30 entry), `STATUS.md`.
- No TSX, copy, data, order or asset changes.

### Validation (2026-10-30, dev server http://localhost:3017)

- `bun run test` 81/81. `bunx tsc --noEmit --incremental false` passes. `bun run lint` 0 errors, the old
  `ThemeAnchor` warning.
- Browser suite `scratchpad/pw/cta.mjs` (Playwright, system Chrome), **1080/1080 on the dev server** (run 2, before the restart and before the builder change below). Covers /clients and
  /community at 1600, 1440, 393 and 375 px in light and dark: no horizontal overflow, no broken images, no
  console errors or failed requests, every visible link/button/disclosure ≥ 44 px; every pill 100 px radius,
  2 px border; filled rest pink + ink (navy + white on coral), outline transparent with border = label =
  surface colour; for 25 control classes plus form Back/Next and the kit close: hover = #CE1252 + white
  (desktop), pressed = #A80E44 + white and back to rest on release, text links thicken without turning
  pink, focus ring 3 px dark green + cream halo; on phones a tap leaves no hover; disabled (pill, filter,
  form button) at .5 and not-allowed with no hover; Tab from the top reaches both hero CTAs with a ring at
  every stop; hover, pressed and focus identical in Light and Dark for every class; reduced motion: colour
  change without lift or transition.
- Run 1 found two defects, fixed: the selected builder filter lost its focus halo (no semantic focus rule in
  `audience.module.css`), and the light theme toggle kept its hover surface after a tap on phones.
- Comparison matrix: **not produced.** The run on the restarted server (run 3), which was to capture
  the crops and assemble the matrix (`scratchpad/pw/compose.mjs`), was stopped when the builder
  iteration below started; its start had already removed run 2's crops. Rerun `node cta.mjs && node
  compose.mjs` in `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/4717b022-d4f9-4cde-9670-71d41c82afce/scratchpad/pw/`
  to produce `scratchpad/cta-matrix-1440.png`. The suite's per-class state values are in run 2's log
  (`scratchpad/pw/cta-run2.txt`); the state table above is what it verified.
- Not run: production build (not requested; dev server only). Not verified: Safari, Firefox, physical
  devices (touch was emulated), screen readers; visual parity with `40f3910` (not compared; these
  controls were superseded by later owner decisions).

### Remaining inconsistencies and open questions

38. **Moloch CTA**: now a transparent navy-outlined pill (the rule for outline CTAs). The owner had
    approved a filled navy pill there; if that look should stay, make the CTA `variant: "filled"` in
    `community.ts` (it would then rest navy with a white label under the coral exception).
39. **Dark creed CTA** is deep navy on the pink creed (was pink on pink, an invisible edge). Confirm.
40. **Accordion rows** (Services) keep a coral text hover rather than the button hover; they are
    disclosures, not buttons.
41. **Header nav links** keep their underline-grow hover; only their focus ring changed.
42. **Hats role cards, builder cards, Explore cards and logo buttons** keep their own hover (content cards);
    the logo buttons' and Hats cards' focus now use the shared ring.
43. **Form buttons** now use the compact pill type (uppercase mono); the labels' copy is unchanged.

Comparison matrix: produced in the afternoon run (see "October 30 (afternoon)" above).

## Design system normalization, iteration 01 (2026-10-29; committed with iteration 02)

References: the owner's October 29 captures of `/clients` and `/community`
(`~/Downloads/screencapture-localhost-3017-{clients,community}-2026-10-29-*.png`, light and dark) and
the Hats app screenshot of tree 1822 (`~/Desktop/Screenshot 2026-10-29 at 5.14.37 PM.png`). Decisions
are in `docs/venture-integration.md` (October 29 entry); the asset manifest is in
`docs/asset-provenance.md` ("Placeholder slots").

| Area | Change |
|---|---|
| Hero | One title scale for both routes (`.heroTitleLong`): lead `min(34px, 8.4vw)` / 46 / 58 px, second line `min(52px, 13.2vw)` / 58 / 73 px (the October 27 design). /community was 34–58 px on both lines. /community keeps its coral second line; /clients keeps its headline-colour line (`.heroTitlePlain`) and the curtain. Copy and video unchanged. |
| Buttons | Dark theme, both routes: white labels (`--color-white`, the brand's #FAFAFA); filled buttons on `#CE1252` (5.3:1; white on canonical pink is 3.8:1) with a canonical pink edge (`--cta-edge`, 4.2:1 on navy); hover adds the cream ring; outline buttons transparent with a cream edge (`--cta-outline-border`). The "Start a Guild inquiry" summary follows. Light theme unchanged. Heights, paddings, radii and icons were already shared (56/52 px pills; 44 px compact pills on /clients). |
| Builder network | /community uses the /clients implementation (`BuilderNetwork masonry`): masonry wall at 36 px/s, adaptive grids for 1–8 results, full bleed while moving, showcase-scale heading. Data, links, filters, reduced motion and the no-duplicates fix unchanged. No illustration added to /community. |
| Capabilities | /community renders "Ideas into working systems" with the shared `Services` module (same accordion, typography, spacing, foundry portrait/horizontal art), keeping its heading, intro, services, "Open a Guild inquiry" and the specialist practices disclosure (`Services practices`). `Capabilities.tsx` is no longer used by /community. |
| Join | `JoinCTA` sits on the /clients inquiry panel (`contactCyan`: light-blue in light, raised navy in dark). Copy, Portal and Discord actions and the membership guide unchanged; no inquiry form. |
| Order | hero → About RaidGuild (`#guild`) → Queen Raida (`#raida`) → Projects and Experiments (`#work`) → the Hats Tree (`#hats`, anchor `#stewards`) → builders (`#team`) → Join (`#join`) → About Moloch (`#moloch`) → ideas into working systems (`#spears`) → creed. Navigation anchors unchanged. |
| About RaidGuild | `communityGuild` restored verbatim from `f842d87` ("Builder-owned / member-governed", body, "See more", "Your Guild kit" with four benefits, the cohort requirement, "Join the DAO" / "Enter Discord", handbook and Queen Raida links). |
| Queen Raida / Moloch | New `sections/ImmersiveFeature.tsx` + `feature.module.css`: full-width art via `<picture>` (desktop horizontal, phones ≤ 700 px vertical, from `getImageProps`), copy below, showcase heading scale, one CTA. Queen Raida: approved heading and body (owner-approval), CTA "Ask our AI CTO" (existing), art `queen-raida-v2.png` / the owner's untracked vertical cut (falls back to the horizontal cut when missing). Moloch: the October 28 copy verbatim, CTA "Find your path into the Guild", placeholder art. Surfaces: Queen Raida `--scroll-100` (light) / `--surface-deep` #12163B (dark); Moloch `--moloch-600` in both themes with cream text and `--moloch-200` accents. No parallax: neither artwork has separated layers. The October 23 Queen Raida carousel is no longer rendered (copy kept). |
| Hats Tree | New `sections/HatsTree.tsx` + `hats.module.css`, data in `src/lib/data/hats.ts`: parent 1822 "RaidGuild Steward Admin" above the five featured roles (Knowledge, Infrastructure, Sync, Participation, Brand), tree connectors, the other four roles listed, a reference-snapshot caption, "Explore the Hats Tree" → https://app.hatsprotocol.xyz/trees/100/1822, DAO Roles and Hats Protocol links. Role cards are buttons (hover, focus, tap or click select; `aria-pressed`; details in a polite live region). Descriptions only for Brand and Sync Steward, quoted from the handbook's DAO Roles page (claims). No wearers or portraits. Dark green scene in both themes; vertical tree on phones. Replaces "Keepers of the signal" (steward roster no longer rendered on /community; still on /clients as People behind the work). The October 28 Hats Tree and stewardship copy moved here verbatim. |
| Dark scenes | /community: About navy, Queen Raida deep navy, Projects raised navy, Hats dark green, builders navy, Join deep navy with a raised panel, Moloch red, capabilities raised navy, creed pink; no two neighbours share a surface. |
| Creed | The coral "build." and the taller mobile creed now apply to both routes. |

Files (uncommitted):
- Modified: `src/app/(venture)/community/page.tsx`, `src/components/venture/{venture,audience,services}.module.css`,
  `src/components/venture/sections/{BuilderNetwork,JoinCTA,Services}.tsx`, `src/lib/data/illustrations.ts`,
  `src/lib/narrative/{community,types}.ts`, `tests/{narrative,cta-contrast}.test.mjs`,
  `docs/{asset-provenance,venture-integration}.md`, `STATUS.md`, `CHANGELOG.md`.
- New: `src/components/venture/sections/{ImmersiveFeature,HatsTree}.tsx`,
  `src/components/venture/{feature,hats}.module.css`, `src/lib/data/hats.ts`, and the seven placeholder
  PNGs in `public/images/venture/entities/` and `public/images/venture/hats/`.

### Verification of iteration 01 (2026-10-29)

- `bun run test` 78/78 (new: About restored, Moloch and Queen Raida copy, Hats content and links,
  tree structure, hat PNG size and transparency, Moloch slot sizes, dark CTA contrast).
  `bunx tsc --noEmit` passes. Lint: 0 errors, the old `ThemeAnchor` warning.
- `SHOW_REVIEW_FLAGS=false bun run build` passes in an isolated copy (no `.env*`); served on 3018
  and stopped afterwards; 0 review ids in `/community`.
- Browser suite (`ds01.mjs`, Playwright): 396/396 on the dev server and on the production build:
  both routes at 1600, 1440, 393 and 375 px in light and dark: shared hero scale, filled-button
  contrast ≥ 4.5:1, white dark-theme labels, light buttons unchanged, every builder filter unique with
  the right count and one accessible copy, adaptive grids, full-bleed masonry wall, no overflow, no
  broken images or failed requests, no console errors; on /community: section order, About restored,
  Queen Raida and Moloch art switching horizontal/vertical, full width, copy below, approved copy,
  Hats parent, five roles in order, four more, connectors, tree link, snapshot label, no wearers,
  capabilities on the Services module, Join panel and actions, distinct dark scenes, Moloch red,
  navigation targets; Hats keyboard focus, hover (desktop) and tap (phone), wall 36 px/s, reduced
  motion (still wall, no transitions); /clients curtain, rotation and inquiry states unchanged.
- Screenshots (side by side, both routes, light and dark, 1440 and 393; full pages at all four widths):
  `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/ds01/final/`.
- Not verified: Safari, Firefox, physical devices, screen readers; live Hats data (the app is
  client-rendered; the tree is labelled a snapshot); visual parity with `40f3910` (not compared:
  these modules are new or superseded by the owner's later references).

## Released: October 28 refinements (`2bf270d`)

The sections below ("Contents: October 28 feedback", "Interaction fixes", "Frame 122", "Frame 123",
"Full-bleed wall and showcase rotation", "/community: Join the DAO iteration") describe what this
release contains, written while the work was in progress; all of it is committed in `2bf270d` and
deployed. Where they say "uncommitted", read "committed in `2bf270d`".

### Verification summary

| Check | Result |
|---|---|
| Release tree before committing (clean export) | `bun run test` 71/71; `bunx tsc --noEmit` passes; `bun run build` passes; 0 review ids in the prerendered `/clients` and `/community` pages |
| Lint | 0 errors, 1 warning (`ThemeAnchor` unused, `HeaderJoin.tsx:78`), present before this work |
| Production URL, browser suites | general 75/75, rotation and full-bleed wall 66/66, October 28 96/96, marquee 40/40; Frame 122/123 suite: the full 1440 px pass (61 checks) ran, one failure caused by a local DNS outage, which also stopped the run |
| Frame 122/123 suite at 1024, 393 and 375 px | 365/365 on the identical local production build; **not run on production** |
| Not verified | form submission (no backend secrets), Safari, Firefox, physical devices (touch was emulated), screen readers, visual parity of the new `/community` Guild copy |

### Verification of the published review (2026-10-28 22:26–23:40 -0300, production URL)

- `/`, `/clients`, `/community` HTTP 200; release markers present ("Build with us", Tae's Daedalus
  copy, "The Guild runs on owners", "Join our community", "About Moloch", "DAO Roles"); no review
  ids or notes in the HTML.
- New Daedalus button (MD5 `97089d2b…`) and screenshot 200; `clients.pdf` 404; ddls.co, the DAO
  Roles page, join-the-guild, Hats Protocol and Portal join respond 200.
- Browser suites against the production URL: general 75/75, rotation and full-bleed wall 66/66,
  October 28 96/96, marquee 40/40. The Frame 122/123 suite ran its full 1440 px pass, 61 checks,
  all passing except one that failed only because this machine lost DNS mid-run
  (`ERR_NAME_NOT_RESOLVED`), which also stopped the run; its 1024, 393 and 375 px passes were not
  run on production (they passed 365/365 on the identical local production build). Two suites
  needed a longer page-load wait on production (slow image responses from this connection).
- Not verified: form submission (no backend), Safari, Firefox, physical devices, screen readers.

## Contents: October 28 feedback (released in `2bf270d`)

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

Files in `2bf270d` (listed while uncommitted):
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

- HEAD: the iteration 04 commit (parent `6ecb1c7`, iteration 03; then `a8ff16c`, iteration 02; then
  `2bf270d`), pushed to `fork/feat/venture-beyond-integration`. `a8ff16c`
  It contains the documentation reconciliation, iteration 01, the Community follow-up, iteration 02, the
  owner's artwork in `public/images/venture/` (12 PNGs, approved for commit on 2026-10-29) and the deletion
  of `public/images/queen-raida/queen-raida-v2.png` (the owner removed it; nothing references it).
- **Owner's changes, preserved and still uncommitted:**
  - `package.json`: the `packageManager: yarn@1.22.22` line.
  - 21 manually deleted legacy images in `public/images/`: `cohort-*` (8), `expect-image-*` (4),
    `hire-image-*` (4) and `home-*` (5). Still in the repository and in the deployed archive;
    only unused components reference them.
- **Never commit these local files:** `public/images/casestudies/clients.pdf`; `.DS_Store` files.
- Do not run `bun run build` in this worktree while `bun run dev` is running; build in a copy
  (the dev server and the build share `.next`).

## Next actions

1. **Owner review** of iteration 04 at http://localhost:3017 (no Git preview exists for the fork). Any
   deploy needs explicit approval (AGENTS.md).
2. Answer the open questions below, especially those about `/community` (21–24) and the
   copy confirmations (1, 2, 19).
3. Decide on a documentation commit for this reconciliation, and on `release/review-2bf270d`
   (and `release/review-da9165b`) tags.
4. Physical-device checks: trackpad momentum, iOS and Android, Safari and Firefox, a screen reader.
5. Optional: rerun the Frame 122/123 suite on production for 1024, 393 and 375 px.

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
8. **Release tags:** should `da9165b` and `2bf270d` get `release/review-*` tags, like the earlier
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
25. **Iteration 01 decisions:** (a) the dark filled-button pink is #CE1252, not canonical pink,
    so white labels pass 4.5:1; (b) /community keeps its coral hero line; (c) the October 23 Queen
    Raida carousel and the steward roster are no longer shown on /community; (d) "About RaidGuild"
    restores "Join the DAO" / "Enter Discord" and the four Guild-kit benefits verbatim, though the
    main CTA now reads "Join our community"; (e) Moloch uses Moloch red, not coral (coral fails
    body-text contrast); (f) the new labels "[ Queen Raida ]", "Featured roles", "Also in the tree",
    the snapshot caption and "DAO Roles ↗" are flagged as wording; (g) "Find your path into the
    Guild" wraps onto two lines in its pill at 393 px; (h) Projects and Experiments keeps its own
    heading scale. (Follow-up update: (b) superseded, the hero is now all white; (e) superseded, Moloch is
    coral with navy text; "Also in the tree" and "DAO Roles ↗" are no longer used.)
26. **Hats role descriptions:** no longer shown (the detail panel was removed in the follow-up).
    If they return: the handbook calls infrastructure "Infrastructure Maestro" and knowledge
    "Handbook Steward"; confirm the mapping first.
27. **Follow-up interpretations (2026-10-29):** (a) "Moloch Coral" read as the site's coral #EE3C78
    (it matches the Moloch artwork); no token of that name exists. (b) "Lilac/blue" text on coral is
    deep navy #12163B: navy and indigo fail contrast on coral. (c) The coral background on the builder
    network is a tilted band behind the masonry, not the whole section (so the heading and filters keep
    their contrast). (d) "The Participation Steward detail" read as the role detail panel below the
    tree (it showed whichever role was selected); the "Stewards." intro paragraph is kept. Confirm, or
    remove that paragraph too. (e) With no detail panel, the hat cards are no longer interactive.
28. **Join headline size on phones:** keeping "SERIOUS WEB3 BUILDERS" on one line makes it about
    23 px at 393 px (the Hire headline is 33 / 52 px and wraps "WORKING PRODUCTS" onto two lines below
    about 420 px). Accept the smaller headline, shorten the copy, or allow the wrap?
29. **Rights for the new artwork** in `public/images/venture/` were not stated; the earlier approval
    covered `queen-raida-v2.png`. Confirm public use. (The owner approved committing it on 2026-10-29.)
30. **Headline size on phones:** keeping each segment on one line makes the Join headline 16 / 20 px and
    the Hire headline 23.5 / 29.5 px at 393 px. Accept, shorten the copy, or allow a wrap on phones?
31. **"Explore the community →"** keeps the Portal join destination of the old primary CTA. Should it go
    elsewhere (for example the Portal home or an in-page section)?
32. **Builders:** short categories now use the masonry cards instead of the October 28 editorial grid;
    confirm that the grid can go for good.
33. **Guild kit on /clients:** the Guild module is not on /clients, so the expander exists only on
    /community. The H3, CTA, accordion, creed, builder and panel changes apply to both routes.
34. **Hero curtain on /community:** the owner's note was read as "Join should part its side panels like
    Hire" (light and dark already matched). Confirm, or describe the dark-theme motion meant.
35. **Hats selection** has no detail panel (removed in the follow-up); it only enlarges the card. Should a
    selected hat show anything else?
36. **Dark CTA labels:** resting filled buttons now use the ink label on canonical pink in dark too (white
    on canonical pink is 3.8:1); labels turn white on hover and press. Confirm this replaces the
    iteration 01 "white labels in dark" decision.
37. **Builder layouts:** short categories (≤ 8) never move; on phones they stack one card per line. The
    9+ tier still moves when wider than the screen (All builders everywhere, Coordination on phones).
44–46. **Builder module (October 30, later):** see the builder section (5–8 layout, phone wall face, grid
    height).
38–43. **Shared CTA system (October 30):** see "Remaining inconsistencies and open questions" in the October 30
    section (Moloch CTA variant, dark creed CTA, accordion and nav hovers, content cards, form button type).

## Iteration 04: Moloch title, builder layouts, CTA states (2026-10-29, committed with this note)

References: the owner's brief and the full-page captures of the iteration 03 preview
(`~/Downloads/screencapture-raidguild-venture-beyond-review-72zh7hv5h-vercel-app-*-2026-10-29-22_2*.png`,
unannotated). Decisions in `docs/venture-integration.md` (iteration 04 entry).

| Area | Change |
|---|---|
| About Moloch | Title "Together we slay" / "Moloch +" followed by the supplied `raidguild.png` (alt "RaidGuild"; its square is the coral #EE3C78, so only the swords show on the scene); 34 / 52 hierarchy kept. Body and CTA unchanged. |
| Explore | Description: "Games, tools, digital experiences, and field notes from Guild members. Explore what they made, how they approached it, and what they learned." (owner); filters, cards, interactions unchanged. |
| Typography | "The Guild runs on owners, / not employees." (/clients) keeps its display face (Grinder) via an override of the H3 Ubuntu rule; other supporting H3s and Hats labels stay Ubuntu. |
| Builders, both routes | One continuous full-width coral plane in every category, tilted 1°, its height following the courses (no empty container). Layout by result count (`data-tier`): 1–2 and 3–4 one course, 5–8 two courses (second staggered from 760 px), 9+ three courses (the moving wall when wider than the screen). Up to 8 results always sit still, wrap and centre inside the screen (phones stack them). Same cards, avatars, spacing, hover/focus. |
| /community order | About → Queen Raida → Moloch → Projects (Explore) → builders → Hats Tree → Join → Ideas → creed (Hats and Explore swapped). Dark: Join's scene is now navy so it differs from the deep-navy Hats Tree before it. |
| CTAs, both routes and themes | Filled buttons rest on the canonical pink #EE3C78 with the ink label (dark previously rested on #CE1252, the light hover colour); hover #CE1252 (light: cream label, dark: white label, cream ring); pressed #A80E44 (both). Outline, focus and disabled states verified. |

Incident during the session (fixed before commit): a CSS edit that replaced the builder-wall block also
deleted the blocks after it in `venture.module.css` (the H3 Ubuntu rule, the shared headline fit, the
Guild kit styles, the creed highlight). The suite caught it; they were restored from `6ecb1c7` and the full
diff against HEAD was reviewed.

Files: `src/app/(venture)/community/page.tsx`, `src/components/TeamWall.tsx`,
`src/components/venture/sections/ImmersiveFeature.tsx`, `src/components/venture/{venture,feature}.module.css`,
`src/lib/narrative/{community,types}.ts`, `tests/{narrative,cta-contrast}.test.mjs`, `STATUS.md`,
`CHANGELOG.md`, `docs/venture-integration.md`.

### Verification of iteration 04 (2026-10-29)

- `bun run test` 80/80; `bunx tsc --noEmit --incremental false` passes; `bun run lint` 0 errors (the old
  `ThemeAnchor` warning).
- Isolated production build (`scratchpad/build-ds03`, no `.env*`) passes; 0 review ids; served on 3018, stopped.
- Browser suite `scratchpad/pw/ds05.mjs` (ds04 plus this pass): **1112/1112 on the dev server and on the
  production build.** Adds: section order with the swap; anchors #guild, #raida, #work, #team, #hats,
  #stewards, #join scroll to their sections (1440, 393); Moloch title text, logo loaded with alt, hierarchy;
  Explore description; "Guild runs on owners" in Grinder, other H3s Ubuntu; every builder category's tier,
  full-width plane hugging its content (within 40 px), up to 8 results still and inside the screen with one
  accessible copy; filled CTAs rest on canonical pink everywhere; filled rest/hover/pressed colours and
  label contrast, outline hover, keyboard focus ring and disabled state on both routes in both themes. The
  plane-height allowance was widened from 24 to 40 px after phones measured 2 px over (82 px of padding
  around the courses); no layout change.
- Screenshots (production build): `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/ds05/final/`.
- Not verified: Safari, Firefox, physical devices, screen readers; parity with `40f3910`.

## Iteration 03: final visual refinement pass (2026-10-29, `6ecb1c7`, preview-deployed)

References: the owner's brief, the note "el parallax de la versión light no está desplazando los paneles
laterales; usar misma transición que dark", and `~/Desktop/Screenshot 2026-10-29 at 9.36.04 PM.png`
(Fullstack: the band as a plain container of stretched cards). The owner chose where the two unlisted
sections go (Projects after Builders; Ideas into Working Systems after Join). Decisions are in
`docs/venture-integration.md` (iteration 03 entry).

| Area | Change |
|---|---|
| Hero side panels | Measured: light and dark already behaved identically; the panels parted only on /clients (the curtain) and never on /community. Read as "Join should part its panels like Hire": /community now uses the same curtain (`Hero curtain still`), same distances and timing, both themes. Layer parallax stays off. |
| /community order | About RaidGuild → Queen Raida → About Moloch → Hats Tree → Builders → Projects & Experiments → Join → Ideas into Working Systems → creed. Dark neighbours stay distinct. |
| Hats Tree | Left: label, title, intro, and the stewards paragraph set apart (coral rule, "Stewards." in coral, 17 px). Right: the RaidGuild mark (88 px) with five curved SVG branches to the roles (no single trunk line). Cards read artwork, name, ID (Ubuntu). Cards are buttons again (`aria-pressed`): hover highlights; click, tap or keyboard focus selects (scale 1.1, 1.04 on phones), siblings dim to 62%; clicking again or Escape clears; reduced motion keeps the state without zoom. Phones: vertical tree with a rail and rounded stubs. |
| Headings | One two-level scale on both routes: 34 / 52 px desktop, 20 / ≤ 40 px phones (Projects, Services, Hats, Moloch, Queen Raida, builders); Guild 34 / 44 px (so "MEMBER-GOVERNED" holds one line when the kit opens); panel headings (Hire inquiry, Join) 30 / 46 px, second line on its own row. Every two-line heading's second line is ≥ 1.2× its first. |
| Builders | Short categories keep the wall's look: natural-width cards (never stretched), staggered brick rows, centred with auto margins (a wider list can't be cut off), on the same coral band tilted −1° with its rows and cards. |
| Creed | "build." on a coral highlight with deep navy type (#12163B), both themes. |
| Panels | The Hire panel is two stacked blocks; one coral stroke now wraps both (and the inquiry alone when the form is open). This fixes the iteration 02 stroke that framed only the introduction. Join unchanged (30 / 46 heading). |
| Themes | Light uses green, coral, cream and light blue only; no navy/night section surface in light (tested). |

Files: `src/app/(venture)/community/page.tsx`, `src/components/venture/sections/HatsTree.tsx`,
`src/components/venture/{hats,venture,services,feature,audience}.module.css`, `STATUS.md`,
`CHANGELOG.md`, `docs/venture-integration.md`.

### Verification of iteration 03 (2026-10-29)

- `bun run test` 79/79; `bunx tsc --noEmit --incremental false` passes; `bun run lint` 0 errors (the old
  `ThemeAnchor` warning).
- Isolated production build (`scratchpad/build-ds03`, no `.env*`) passes; 0 review ids; served on 3018, stopped.
- Browser suite `scratchpad/pw/ds04.mjs` (ds03 plus this pass): **882/882 on the production build and
  882/882 on the dev server.** Adds: section order with Moloch after Queen Raida; coral creed highlight;
  every two-line heading ≥ 1.2×; no navy surfaces in light; still builder lists unstretched and not cut
  off; Hats cards artwork → name → ID, five `aria-pressed` buttons, coral "Stewards", five branches meeting
  the parent and the cards; Hats hover highlight, click/tap select with zoom and dimmed siblings, no
  overflow, toggle off, keyboard focus selection with a ring, Tab moves it, Escape clears, reduced motion
  without zoom (1440 light, 1600 dark, 393 dark, 375 light); hero panels part on hover and scroll on both
  routes in both themes; Join heading 30 / 46. Suite bugs fixed while writing it (a stretch heuristic, the
  card text order) were in the tests, not the page.
- Screenshots (production build): `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/ds04/final/` (`side-by-side-{light,dark}-{1440,393}.png`, full pages).
- Not verified: Safari, Firefox, physical devices, screen readers; parity with `40f3910`.

## Iteration 02: October 29 evening brief (2026-10-29, `a8ff16c`)

References: the owner's brief and the three Desktop captures of that evening
(`~/Desktop/Screenshot 2026-10-29 at 6.22.58 PM.png`, the Guild kit; `8.20.25 PM`, the builder band in the
Coordination filter; `8.38.17 PM`, the Join panel with review markers on its heading, body and actions).
Decisions are in `docs/venture-integration.md` (iteration 02 entry). Applied to both routes wherever the
module is shared.

| Area | Change |
|---|---|
| Hero, /community | Owner copy: eyebrow "[ THE GUILD ]", "Find your people." / "Build something together.", the new subtitle ("builder owned community" in bold), "Explore the community →" (Portal join, unchanged destination) and "See what we’re building ↓" (#work). |
| Hero, both routes | No parallax: `Hero still` turns off the pointer and scroll layer motion and the copy fade (the /clients curtain stays). One headline rule: the second line scales to its space (≤ 73 px), the first at 58:73, each on one line at every width; `--title-fit` holds each route's measured line width. Phones: Join 16 / 20 px, Hire 23.5 / 29.5 px at 393 px (Hire previously wrapped "WORKING PRODUCTS"). Eyebrow 17 px bold with a shadow. |
| H3 | Ubuntu on both routes, including h3 em, never Grinder or Retalic (`!important`, since module rules are more specific). Hat labels Ubuntu. "The Guild runs on owners" (/clients) is now Ubuntu. |
| Guild kit, /community | `GuildPrologue kitExpander`: a "Your Guild kit →" button (`aria-expanded`, `aria-controls`). Desktop: the kit panel slides in from the right in its own grid column and pushes the illustration and text left. Phones: it opens below the text. Closed it is hidden and `inert`; Escape (anywhere) or its close button closes it and returns focus to the toggle; no animation with reduced motion. Not shared with /clients (the module is /community only); "/" keeps the inline kit. |
| Queen Raida, Moloch | Desktop cut confirmed on desktop, mobile on phones, rectangle on tablets and squarer monitors. Artwork held to `min(58svh, 600px)` (phones 72svh), cropped from the bottom (`object-position: top`); copy 28–44 px below it. No parallax: the files are single flattened images. |
| Hats Tree | Desktop: title, both texts and the tree link on the left, a smaller tree on the right (96 px RaidGuild mark, five compact cards); one column below 961 px, a vertical tree on phones. The "Explore the roles…" line was removed; one link remains. |
| Builders, both routes | One card system for every category: the editorial grid for short lists (`builderGrid.ts`, Frame 122) is removed; all categories use the masonry cards (short lists one or two per row, still). Every category runs on the coral band, tilted −1° together with its rows and cards (no counter-rotation). |
| CTAs | Dark filled buttons: hover #E0185E and pressed #A80E44, distinct from the resting #CE1252 (hover previously equalled rest). Equivalent actions share icons: Portal actions → (hero, Guild "Join the DAO", Join, creed on /community), in-page ↓ (creed on /clients). Every visible link, button and disclosure is ≥ 44 px tall (brand, socials, handbook links, "See more", footnote links). |
| Expandable rows | Services accordion (both routes): titles 700 at full contrast; descriptions at 82% of the text colour (≥ 7:1). |
| Creed, both routes | "build." preselected: indigo #303675 highlight with cream type (9:1), no shadow. |
| Join, /community | Owner copy: "Your first step / into the Guild." (Grinder, regular weight, not italic), new subtitle, "Create your Portal profile →". The rounded coral-stroked panel now frames the /clients inquiry panel too. |
| Projects heading | "What happens when builders / follow their curiosity." (owner); nav label and anchor unchanged. |

Files: `src/app/(venture)/{clients,community}/page.tsx`, `src/components/TeamWall.tsx`,
`src/components/ArtifactGallery.module.css`, `src/components/venture/builderGrid.ts` (deleted),
`src/components/venture/sections/{Hero,GuildPrologue,JoinCTA,Creed,HatsTree}.tsx`,
`src/components/venture/{venture,hats,feature,services}.module.css`, `src/lib/narrative/{community,types}.ts`,
`tests/{narrative,members}.test.mjs`, `STATUS.md`, `CHANGELOG.md`, `docs/venture-integration.md`.

### Verification of iteration 02 (2026-10-29)

- `bun run test` 79/79 (copy tests updated to the brief; builder-grid tests replaced by a masonry test).
  `bunx tsc --noEmit --incremental false` passes. `bun run lint`: 0 errors, the old `ThemeAnchor` warning.
- `SHOW_REVIEW_FLAGS=false bun run build` passes in an isolated copy (`scratchpad/build-ds03`, fresh
  `bun install --frozen-lockfile`, no `.env*`); 0 review ids in `/clients` and `/community`; served on 3018, stopped.
- Browser suite `scratchpad/pw/ds03.mjs`: **712/712 on the dev server and 712/712 on the production build.**
  Both routes at 1600, 1440, 393, 375 px, light and dark: hero copy and CTAs, one-line headlines inside the
  screen, no parallax on scroll or pointer, eyebrow weight, filled-button contrast, 44 px targets for every
  visible link/button/disclosure, all H3 in Ubuntu, accordion title/description contrast, creed highlight and
  CTA icon, every builder category (counts, uniqueness, one accessible copy, same masonry cards and heights,
  coral band at −1° with no counter-rotation, card contrast), no overflow, no broken images or failed
  requests, no console errors, audience switch (fixed, `aria-current`, 44 px, in view at the bottom), coral
  panel stroke on both routes; /community: section order, art cuts and heights, gap to copy, Moloch contrast,
  Projects heading, Hats composition, parent mark, order, Ubuntu labels, single link, scenes, connectors, Join
  copy and Grinder Regular, link contrast. Guild kit at 1600/1440/393/375: closed and inert, Enter opens it
  (desktop from the right with the image and text moving left; phones below the text, no overflow), Escape
  and the close button close it and return focus, reduced motion without animation. Art direction at
  1024×768, 1280×1024, 820×1180, 1920×1080, 1600×900, 700 px. Keyboard reach of the switch, CTA rest vs hover
  and focus rings, wall speed, reduced motion on both routes; /clients curtain, rotation and inquiry.
  While writing the suite, its own bugs (a CSS-module selector, a colour parser, rotated card heights,
  object-position format, a missing `.copy` class in `hats.module.css`) were fixed; one real defect found:
  Escape did not close the kit after a click on its text (fixed with a document listener).
- Screenshots (production build): `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/ds03/final/` (`side-by-side-{light,dark}-{1440,393}.png` and full
  pages). The session scratchpad was wiped once during the day: the iteration 01 and follow-up screenshots
  and scripts listed in older sections below no longer exist.
- Not verified: Safari, Firefox, physical devices, screen readers; visual parity with `40f3910` (superseded
  modules); the attached captures were compared by eye only.

## Community visual refinement follow-up (2026-10-29; committed with iteration 02)

Two passes on the owner's brief of the evening of October 29. A first pass (another session, about
18:48) changed `HatsTree.tsx`, `hats.module.css` and `venture.module.css` and left 3 tests failing
(75/78) without a browser check. This session (second pass) completed it and corrected it; decisions
are in `docs/venture-integration.md` (follow-up entry), artwork in `docs/asset-provenance.md`.

**Owner's working-tree changes found at the start** (left untouched): `public/images/queen-raida/`
removed (tracked `queen-raida-v2.png` deleted, untracked vertical cut gone); new untracked artwork in
`public/images/venture/entities/{queen-raida,moloch}/` (desktop, rectangle, mobile) and
`public/images/venture/hats/` (five 600 × 600 hats plus `raidguild.png`), replacing the iteration 01
placeholders (which no longer exist). `.DS_Store` files are also in `public/images/venture/`.

| Area | Change |
|---|---|
| Hero (/community) | Both segments white and on one line at every width; the second line scales to its space (≤ 73 px), the first at 58:73. 393 px: 18.5 / 23.3 px (was 33 / 52 px with the line clipped). /clients unchanged. |
| Queen Raida, Moloch | Owner's cuts via `<picture>`: mobile ≤ 700 px, rectangle at ≤ 1199 px or aspect ≤ 3:2, desktop otherwise. Missing-file fallback removed. The dormant October 23 carousel's artwork reference points to `queen-rectangle.png` (the old file was deleted). |
| Builder wall | Masonry on a coral (#EE3C78) band tilted −1°, wall counter-rotated +1° (level cards); opaque cards (cream / navy); section keeps its surface; band clipped, no overflow. Replaces the first pass's whole-section Moloch red and net-zero ±0.6° tilt. |
| Join | 2 px coral stroke, 28 px radius (first pass). Membership-guide link dark green on the light panel (was cream on light blue). |
| Moloch | Coral background, deep navy #12163B text (4.6:1), navy pill CTA with a white label. |
| Hats Tree | `raidguild.png` parent node with connectors to the five roles; removed "Also in the tree", the role detail panel, the pill CTA and the DAO Roles / GitHub links; one link "Explore the Hats Tree ↗" to tree 1822; cards are a plain list (no buttons); "Stewards." intro paragraph restored (approved copy, removed by the first pass). Deep navy in dark (no green), dark green in light. |
| H3 | Ubuntu on /community (first pass applied it to both routes; now scoped). |
| Audience switch | Unchanged; verified fixed, `aria-current`, 44 px targets, keyboard focus ring. |

Files touched in this follow-up: `src/app/(venture)/community/page.tsx`,
`src/components/venture/sections/{HatsTree,ImmersiveFeature}.tsx`,
`src/components/venture/{hats,feature,venture}.module.css`, `src/lib/data/{hats,illustrations}.ts`,
`src/lib/narrative/{community,types}.ts`, `tests/{narrative,public-content,cta-contrast}.test.mjs`,
`docs/{asset-provenance,venture-integration}.md`, `STATUS.md`, `CHANGELOG.md`.

### Verification (2026-10-29, this session)

- `bun run test`: 80/80 (artwork contract updated to the owner's files and sizes; Hats single link;
  new coral-scene contrast tests). `bunx tsc --noEmit --incremental false`: passes. `bun run lint`:
  0 errors, the old `ThemeAnchor` warning (`HeaderJoin.tsx:78`).
- `SHOW_REVIEW_FLAGS=false bun run build` passes in an isolated copy (`scratchpad/build-ds01`, no
  `.env*`); 0 review ids in the prerendered `/community`; served on 3018, then stopped.
- Browser suite `scratchpad/pw/ds02.mjs` (Playwright, system Chrome): production build 476/476. Dev
  server: first run 475/476, one real failure, a transient `net::ERR_CONNECTION_RESET` at
  `/community` 1600 light while full-page captures ran against 3018; rerun alone 476/476. A first-run
  test bug (/clients panel border read as style rather than width) was fixed in the suite, not the page.
  Covers /clients and /community at 1600, 1440, 393, 375 px in light and dark: Join headline one line
  per segment, white, inside the screen; /clients headline unchanged; filled-button contrast; builder
  filters and counts; coral band, tilt angles, level cards, card contrast; no overflow, broken images,
  failed requests or console errors; audience switch fixed, `aria-current`, ≥ 44 px, in view at the
  page bottom; section order; artwork cuts, full width, copy below, alt text; Moloch coral and navy
  text ≥ 4.5:1, CTA contrast; Hats parent mark, five roles in order, removed elements absent, exactly
  one link to tree 1822, intro and snapshot, scene colours, connectors meeting; all H3 Ubuntu; Join
  stroke, radius and link contrast; distinct dark scenes with no green. Also: rectangle cut at
  1024 × 768, 1280 × 1024, 820 × 1180 and 701 px, desktop cut at 1920 × 1080, mobile at 700 px; keyboard
  reach and focus rings on the switch and the Hats link (1440, 393); wall 36 px/s; reduced motion
  (still wall, band kept); /clients curtain, rotation and inquiry unchanged.
- Screenshots (production build): `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/ds02/final/` (side by side `side-by-side-{light,dark}-{1440,393}.png`,
  full pages per route). Before-state captures of the first pass: `/private/tmp/claude-501/-Users-louchi-Projects-raidguild-integration/afb6ffad-2e28-42d6-b989-2be86bcb321f/scratchpad/ds02/before/`.
- Not verified: Safari, Firefox, physical devices, screen readers, 1600 px screenshots (suite only),
  visual parity with `40f3910` (these modules are new or superseded by later owner references).
