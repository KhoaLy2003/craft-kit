# Phase 2 · Step 7 — Ship

## Overview

- **Purpose**: Commit, push, open a pull request, and record the shipped features. Push and PR are outward-facing: they publish code beyond this machine.
- **Agent/Skill**: `finishing-a-development-branch` skill + general-purpose agent
- **Model**: `fast`
- **Gate**: `none`
- **Inputs**: the feature branch (changes uncommitted unless a handover committed some); `docs/backlog.json`
- **Outputs**:
  - committed branch; pushed branch and PR against `main` (unless local-only) with a structured description
  - `shipped` event in `docs/backlog.json` per shipped feature; regenerated `docs/backlog.html` and `docs/roadmap.md` table
  - CI status in the session log
- **Template**: `kit/templates/pr-description.md`

## Rules

Work in this order.

### 1. Before the commit

- **AGENTS.md sync.** If this cycle amended `docs/architecture.md`, or changed the install, start, build, or test commands or the folder layout, update the matching lines of the project-root `AGENTS.md`. Take commands from `docs/constitution.md` → Verification Commands, and update that table first if a command changed.
- **Re-verify.** If code changed since the last Definition of Done run, run it again (conventions → Definition of Done step 3).
- **Docs lint** (conventions rule 11). Fix errors; show warnings; warnings never block.
- **Product changelog.** If the project has a root `CHANGELOG.md`, add one entry under Unreleased in its format; never create one.
- **Secrets.** Confirm `.env` and `.test-accounts.json` are git-ignored (`git ls-files .test-accounts.json` returns nothing). `docs/E2E-TESTS.md` and `docs/ENV_SETUP.md` hold names and ids only, never values.

### 2. Commit

Commit everything except secrets.

- `scope: feature`: one commit referencing the feature slug.
- `scope: all`: one commit for all features, with the full scope in the message (for example `feat: complete <project> MVP — F01 through FNN`).

### 3. Push and open the PR

- **Pre-flight.** `git remote -v`; check a remote exists, the user is authenticated (`git ls-remote <remote>` succeeds), and which PR route exists (tool, CLI, or web UI). Name the remote URL and **get explicit confirmation before pushing**.
- **Local-only fallback.** If there is no remote, authentication fails, or the user declines:
  - commit on the feature branch; skip push and PR; log `local-only: not pushed`
  - tell the user how to publish later (`git remote add origin <url>`, `git push -u origin <branch>`, open a PR)
  - append the `shipped` events with `evidence: local commit <short-sha>` and run the render script
- **Push and PR.** Push and open a PR against `main` (no PR tool: give the user the branch name for the web UI). Never merge, never push to `main`.
- **PR body.** Write it from `kit/templates/pr-description.md`; every section is filled.
  - **Migration and rollback**: required with schema tasks (what changes, how to roll back); else `none`.
  - New environment variable names only, never values.
  - Verification: the Definition of Done result and E2E count.

### 4. Record the shipped features

Push first: the PR reference is the shipped event's evidence. Then:

1. Append a `shipped` event (`source: live`, `by: orchestrator`, `evidence`: the PR reference, e.g. `PR #7`) to each feature built. Under `scope: all` that is every Must feature built in this pass.
2. Set `status: shipped` on every release that has no `pending` or `in-progress` Must feature left and at least one `shipped` feature. Should and Could features not built stay `pending`; `cancelled` features never hold a release open.
3. Run `node kit/scripts/render-backlog.js`.
4. Commit and push these files to the same branch so the same PR carries them.

### 5. CI status

- With a CI row in Verification Commands or pipeline config, read the PR's check status **once** and log `passing`, `failing`, `pending`, or `not-checked`. Never wait indefinitely; for `pending`, ask the user. With no CI, remote, or tool: `not-checked` (or `local-only: not pushed`).
- `failing`: return to Step 4 **once per cycle** with the error output; the fix goes through review and the affected E2E scope reruns (`p2-05-e2e.md`); push to the same PR and check again. Still failing: ask the user; no second loop.

### 6. Other rules

- **No deploy.** Ship never deploys. If the PR's checks include a preview URL, report it.
- **Spec persistence (ask once).** If `docs/constitution.md` has no "Spec Evolution" section, ask how specs will evolve, record it there (models: `kit/guides/evolving-specs.md`), and set `Last amended` to today.

## Completion Criteria

- [ ] All changes committed; remote confirmed by the user, branch pushed, and PR open against `main` with every section of the PR template filled — or the local-only fallback recorded in the session log
- [ ] CI status (`passing`, `failing`, `pending`, or `not-checked`) recorded in the session log; a failing run returned to Step 4 at most once, and a second failure was put to the user
- [ ] `docs/backlog.json` has a `shipped` event with PR (or local commit) evidence for every feature built; render script exits 0
- [ ] Every release with no `pending` or `in-progress` Must feature has `status: shipped` in `docs/backlog.json`
- [ ] Spec persistence decision recorded in `docs/constitution.md`
- [ ] Project-root `AGENTS.md` matches the commands and layout after this cycle
- [ ] `node kit/scripts/lint-docs.js` reports no errors before the commit; any warnings were shown to the user
- [ ] If a root `CHANGELOG.md` exists, it has an entry for this cycle under Unreleased
- [ ] `scope: feature` with `pending` features left: the user was asked what to do next (see Transitions) and answered; no next feature was started unprompted

## Transitions

### Next

**`scope: feature`, `pending` features left.** Select the next feature (feature loop in `kit/phase-2.md`). Do not start it; this is a clean seam. Ask and wait:

> **Feature [slug] is shipped.** Next in build order is [next-slug] — [one-line name]. Reply **"start"** to begin Step 1 here (if its dependency's PR is not merged, Step 3 will ask you to merge it or branch from it), **"hand over"** to continue in a new session, name a different `pending` feature (its `depends_on` must be `shipped`), or **"stop"** to end here.

| Reply | Action |
|---|---|
| `start` | Restart at Step 1 for the next feature. |
| `hand over` | Write `docs/handover.md` per `kit/guides/session-handover.md`: Phase 2, Unit `<next-slug>`, Step 1 — Spec. |
| a feature name | Check its `depends_on` are all `shipped`, then restart at Step 1 for it. |
| `stop` | End here; leave the backlog as is. |

**Otherwise** (`scope: all`, or none left). The release is complete; offer:

- `kit/phase-3-iterate.md` Step 5 (Closeout), if the release came from a Phase 3 round
- a new Phase 3 round, when new requirements arrive (works with or without ideas)
- `kit/phase-bug-fix.md`, for a reported defect
- one known feature to add: append a release entry (`id`, `name`, `status: planned`) and the feature (`release` set to that id, status `pending`, a `created` event with `at`, `source`, `by`, `note`) to `docs/backlog.json`; run the render script; set `Phase 2 Scope` to `feature` in `docs/roadmap.md` and `phase2_scope` in `docs/backlog.json`; then run Phase 2 with `scope: feature`

## References

- `finishing-a-development-branch` skill
- `kit/guides/evolving-specs.md`
