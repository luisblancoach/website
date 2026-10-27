# AGENTS.md — RaidGuild Session Continuity Protocol v1.0

Rules for every agent session (Claude, Codex or any other) in this repository.
`CLAUDE.md` imports this file. The current state lives in `STATUS.md`, and
milestones live in `CHANGELOG.md`.

## Sources of truth

Refer to these documents; do not copy them here or rewrite them.

| Document | Holds | Rule |
|---|---|---|
| `STATUS.md` | Current state, references, next priority, open questions | Read at start; update at close |
| `CHANGELOG.md` | Verified milestones with dates and commits | Append milestones only |
| `HANDOFF.md` | Original Venture Beyond handoff (Figma, blockers, parity table) | Historical; never rewrite |
| `docs/venture-integration.md` | Integration decisions made after the handoff | Record new decisions here, append-only |
| `docs/asset-provenance.md` | Artwork source, checksums and approval | Update when artwork changes |
| `docs/pr-review-workflow.md` | How to handle PR review threads | Follow it for review feedback |

`.gitignore` ignores `docs/`. The files above were force-added. A new file under `docs/` needs
`git add -f` and the user's approval before it can be versioned.

## Session start (mandatory, before any edit)

1. **Verify the location.** Run the commands below and compare the output with the
   "Expected environment" in `STATUS.md`:

   ```bash
   pwd
   git rev-parse --show-toplevel
   git branch --show-current
   git log -1 --format='%H %ad %s' --date=iso
   git status --short --branch
   git worktree list
   ```

   - The absolute directory must be the integration worktree, not one of the other worktrees.
   - The branch and HEAD must match `STATUS.md`. If HEAD has moved, find out why before going on.
   - Read every uncommitted change and leave it alone. Never discard work you did not create.

2. **Verify the approved visual baseline.** Before any visual or editorial work:

   ```bash
   git rev-parse 'checkpoint/oct23-iteration^{commit}'   # expect 40f39109cb858b2e73a25911de44302599b646db
   git -C ~/Projects/raid-guild/website log -1 --format='%H %s'
   git -C ~/Projects/raid-guild/website branch --show-current   # expect design/venture-beyond-iteration
   ```

   If the reference cannot be found or does not match, stop and ask. Do not rebuild a
   baseline from memory, screenshots or this branch.

   That checkout's working tree may contain uncommitted changes (see `STATUS.md`).
   Compare only against the exact commit, using a clean, isolated worktree or a
   `git archive` export. Never reset, clean, stash or discard changes in that checkout.

3. **Read `STATUS.md`** in full and the most recent `CHANGELOG.md` entries.

4. **Report before editing.** Give the directory, branch, HEAD, uncommitted changes,
   baseline check result and the next priority from `STATUS.md`. Wait for confirmation
   when the session's instructions ask for it, or when anything does not match.

## During the session

- **No commits, pushes, tags, merges, rebases or deploys** without explicit approval in the
  current session. Approval given for one action does not cover the next one.
- **Do not change** branches, remotes or deployment configuration (`.vercel/`, Vercel
  project settings, Railway) unless the task explicitly asks for it.
- **Shared Git state.** The worktrees share refs, tags and the stash. Never run a bare
  `git stash` or `git stash pop`. Prefer a temporary WIP commit, if one is approved.
- **Secrets.** Never print, copy or commit `.env*` files, tokens or Vercel/Railway
  project IDs. Use `env.sample` for variable names.
- **Package manager.** The project uses bun (`bun.lock`, `bun.lockb`). Do not run yarn or
  npm installs that rewrite lockfiles or `package.json`.
- **Scope.** Change only what the task needs. Raise unrelated problems in `STATUS.md`
  under open questions instead of fixing them on the side.

## Passing checks is not parity

`bun run test`, `tsc --noEmit`, `bun run lint` and `bun run build` prove technical health
only. They do **not** prove visual or editorial parity with the approved October 23 reference.

- Claim visual parity only after a side-by-side comparison with the reference. Record the
  route, viewport width, theme (light/dark) and audience for each comparison.
- Claim editorial parity only after checking the copy against its approved source. Use
  `bun run review:claims` for the open narrative flags.
- When a comparison was not done, write "not verified". Never write "matches".

## Session close (mandatory)

1. **Update `STATUS.md`:**
   - the date, HEAD, and the branch and worktree state at close
   - what changed, with file paths and commits if any were approved
   - the checks that were run and their actual results, failures included
   - what was compared against the October 23 reference, and what was not
   - the next priority and any new open questions
2. **Update `CHANGELOG.md`** only for a verified milestone: a release tag, a phase
   checkpoint or an approved deliverable. Give the date and commit. Put uncommitted work
   under "Unreleased".
3. **Record decisions** in `docs/venture-integration.md`, and artwork changes in
   `docs/asset-provenance.md`.
4. **Report to the user:** the files changed (`git status --short`), anything left
   uncommitted and why, and any step that was skipped.
5. Leave the worktree in a state the next session can verify against `STATUS.md`.
