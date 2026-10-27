# STATUS

Last updated: 2026-10-27 · Session continuity protocol v1.0 installed

## Expected environment

| Item | Value |
|---|---|
| Directory | `/Users/louchi/Projects/raidguild-integration` (Git worktree of `~/Projects/raidguild-venture-beyond`) |
| Branch | `feat/venture-beyond-integration` (no upstream configured; release `4a771d8` exists at `fork/feat/venture-beyond-integration`) |
| HEAD | The protocol commit `docs: establish RaidGuild session continuity protocol`, whose parent is `4a771d873e0f605eae03e2b53778bc360a6e0f98`. It has not been pushed. |
| Compared with `origin/main` (`b02d67b`) | 82 ahead (81 before the protocol commit), 1 behind (checked 2026-10-27) |
| Other worktrees | `raidguild-venture-beyond` (`feat/tae-content-update`), `raidguild-tae-narrative`, `raidguild-tae-review` |
| Known uncommitted changes | `package.json`: an unrelated `packageManager: yarn@1.22.22` line, kept on purpose and not to be staged |

## Three references (keep them separate)

| | Approved visual reference | Integrated release | Published review deployment |
|---|---|---|---|
| **What** | October 23 Venture Beyond dual-audience iteration | Integration branch release for review | Independent review deployment of the integrated release |
| **Commit** | `40f39109cb85` "fix: prevent builder profile cards from overlapping" (2026-10-23 16:24 -0300) | `4a771d873e0f` (2026-10-27 01:05 -0300) | `4a771d873e0f` (clean `git archive` of the tag) |
| **Where** | `~/Projects/raid-guild/website`, branch `design/venture-beyond-iteration` | This worktree | https://raidguild-venture-beyond-review.vercel.app (Vercel project `raidguild-venture-beyond-review`) |
| **Tags** | `checkpoint/oct23-iteration`, `backup/venture-beyond-oct23` | `release/review-4a771d8` (previous candidate: `release/review-b4c9e1e`) | none |
| **In this branch's history** | No. Its compositions were ported in separately (B3.x commits). | Yes | Yes (same commit) |

### Approved visual reference: protect it

- The approved reference is commit **`40f3910`**.
- Its checkout, `~/Projects/raid-guild/website`, **currently has uncommitted artwork changes**:
  a modified `public/images/queen-raida/queen-raida-reference.png` and an untracked
  `queen_raida_reference_vertical.png`. That checkout's working tree is therefore not the
  approved reference.
- Make visual comparisons only against the exact commit `40f3910`, using a clean, isolated
  worktree or a `git archive` export of that commit.
- **Never reset, clean, stash or discard changes in that checkout** to get the reference.

### Published review deployment

Recorded deployment. Source: `~/Projects/raidguild-backups/2026-10-27/DEPLOY-vercel-review-4a771d8.md`.

| Item | Value |
|---|---|
| Deployed | 2026-10-27, about 04:25 UTC, via Vercel CLI |
| Project | `raidguild-venture-beyond-review` (scope `luisblancoachs-projects`) |
| URL | https://raidguild-venture-beyond-review.vercel.app |
| Environment | Vercel Production |
| Deployment ID | `dpl_2PQiaWtMuRVojKoLXuYgAD4cmgSa` |
| Release | `4a771d8` (tag `release/review-4a771d8`), built from a clean archive. The uncommitted `packageManager` line is excluded. |
| Framework | Next.js 15.5.23 (`bun.lock`), built with Bun (`bun install --frozen-lockfile`, `bun run build`) |
| Variables | `SHOW_REVIEW_FLAGS=false`, so review flags are hidden. There are no other variables and no secrets. |
| Unavailable by design | The project inquiry form returns HTTP 500 because there are no secrets, and `/chat` returns 503 ("Queen Raida is not configured yet") |

Fresh availability check (2026-10-27 21:28 UTC):
- `/`, `/clients` and `/community` each returned HTTP 200 from Vercel `iad1`.
- This check confirms only that the pages are reachable. It does not confirm that the active
  deployment is still `dpl_2PQiaWtMuRVojKoLXuYgAD4cmgSa`; that comes from the report.

Do not confuse this project with **`raidguild-venture-review`**. That is a separate
October 23 deployment (raidguild-venture-review.vercel.app), linked from `~/Projects/raid-guild/website`.

The public review domain **`raidguild.estudioblanco.org` has not been redirected** to the new
project. On 2026-10-27 it still returned 302 to RaidGuild's Railway service.

## Parity status

- **Technical:** this session did not re-run `bun run test`, lint or build.
- **Visual parity of `4a771d8` with the October 23 reference:** not verified. The commits
  describe ports of the October 23 compositions (`e1098d6`, `9aa9bfc`, `ae03aae`). No recorded
  side-by-side comparison exists.
- **Editorial parity:** not verified. Run `bun run review:claims` to list the open narrative flags.

## Next priority

**New team feedback.** It will be provided in the next session, and its contents are not
recorded yet.
- Before starting, paste or link the feedback in this section.
- Say which of the three references it was given against. If it was given against a deployed
  URL, confirm which project and commit that URL serves.
- Do not infer the feedback's contents from earlier reviews, flags or handoff notes.

## Open questions

1. The `package.json` `packageManager: yarn` line conflicts with bun. Who added it, and should it stay?
2. `docs/venture-integration.md` says Afacad Flux is used "instead of the missing Grinder cuts". The code now loads `Grinder-Refined-*` (`src/lib/fonts.ts`), adopted in `2f4f9c0` and `877ba22`. The decision should be updated with an appended entry, not a rewrite.
3. Several blockers in `HANDOFF.md` (low-resolution videos, an unconfirmed `next build`) predate later work. Their current status has not been rechecked.
4. When and how should `raidguild.estudioblanco.org` be redirected to `raidguild-venture-beyond-review`?
