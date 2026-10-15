# Phase 2 · Step 7 — Ship

## Overview

- **Purpose**: Commit, push, open a pull request, and record the shipped features. Push and PR are outward-facing: they publish code beyond this machine.
- **Agent/Skill**: `finishing-a-development-branch` skill + general-purpose agent
- **Model**: `fast`
- **Gate**: `none`
- **Inputs**: the feature branch (changes uncommitted unless a handover committed some); `docs/backlog.json`
- **Outputs**: committed branch; pushed branch and PR against `main` (unless local-only); `shipped` event in `docs/backlog.json` per shipped feature; regenerated `docs/backlog.html` and `docs/roadmap.md` table
- **Template**: none

## Rules

- Commit everything except secrets: confirm `.env` is git-ignored and `docs/E2E-TESTS.md` and `docs/ENV_SETUP.md` hold key names only, never values. `scope: feature`: one commit referencing the feature slug. `scope: all`: one commit covering all features, with the full scope in the message (for example `feat: complete <project> MVP — F01 through FNN`).
- **Pre-flight (before any push):** run `git remote -v`. Check that a remote exists, that the user is authenticated to it (for example a dry-run `git ls-remote <remote>` succeeds), and which PR route is available: your platform's or git host's PR tool or CLI, or the host's web UI. Then name the remote URL to the user and **get their explicit confirmation before pushing**.
- **Local-only fallback:** if there is no remote, authentication fails, or the user declines, commit on the feature branch, skip push and PR, record `local-only: not pushed` in the session log, and tell the user how to publish later (add a remote with `git remote add origin <url>`, then `git push -u origin <branch>` and open a PR from the host's web UI or CLI). Append the `shipped` events with `evidence: local commit <short-sha>` and run the render script; the PR reference can be added later.
- Push the branch and open a PR against `main`; if no PR tool or CLI is available, push and give the user the branch name to open the PR in the host's web UI. Never merge it and never push to `main`.
- Push first, because the PR reference is the shipped event's evidence. Then append a `shipped` event (`source: live`, `by: orchestrator`, `evidence`: the PR reference, e.g. `PR #7`) to each feature built (`scope: all`: every Must feature built in this pass), set `status: shipped` on every release with no `pending` or `in-progress` Must feature left (Should and Could features not built stay `pending` and do not hold a release open), run `node kit/scripts/render-backlog.js`, and commit and push those files to the same branch so the same PR carries them.
- **Spec persistence (ask once):** if `docs/constitution.md` has no "Spec Evolution" section, ask the user how specs will evolve and record the choice there — the three models are in `kit/guides/evolving-specs.md`. Decide before starting another cycle.

## Completion Criteria

- [ ] All changes committed; remote confirmed by the user, branch pushed, and PR open against `main` — or the local-only fallback recorded in the session log
- [ ] `docs/backlog.json` has a `shipped` event with PR (or local commit) evidence for every feature built; render script exits 0
- [ ] Every release with no `pending` or `in-progress` Must feature has `status: shipped` in `docs/backlog.json`
- [ ] Spec persistence decision recorded in `docs/constitution.md`

## Transitions

- **Next**:
  - `scope: feature` with `pending` features left: select the next one in build order and restart at Step 1.
  - Otherwise (`scope: all`, or no `pending` features left): the release is complete. Tell the user and offer the next move — `kit/phase-3-iterate.md` to decide what to build next (works with or without ideas), or `kit/phase-bug-fix.md` for a reported defect. If the user already knows exactly one feature to add, append a release entry (`id`, `name`, `status: planned`) and the feature (`release` set to that id, status `pending`, a `created` event with `at`, `source`, `by`, `note`) to `docs/backlog.json`, run the render script, set `Phase 2 Scope` to `feature` in `docs/roadmap.md` and `phase2_scope` in `docs/backlog.json`, then run Phase 2 with `scope: feature`.

## References

- `finishing-a-development-branch` skill
- `kit/guides/evolving-specs.md`
