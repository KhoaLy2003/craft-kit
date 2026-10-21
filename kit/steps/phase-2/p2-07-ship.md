# Phase 2 · Step 7 — Ship

## Overview

- **Purpose**: Commit, push, open a pull request, and record the shipped features. Push and PR are outward-facing: they publish code beyond this machine.
- **Agent/Skill**: `finishing-a-development-branch` skill + general-purpose agent
- **Model**: `fast`
- **Gate**: `none`
- **Inputs**: the feature branch (changes uncommitted unless a handover committed some); `docs/backlog.json`
- **Outputs**: committed branch; pushed branch and PR against `main` (unless local-only) with a structured description; `shipped` event in `docs/backlog.json` per shipped feature; regenerated `docs/backlog.html` and `docs/roadmap.md` table; CI status in the session log
- **Template**: `kit/templates/pr-description.md`

## Rules

- **AGENTS.md sync.** If this cycle amended `docs/architecture.md` or changed the install, start, build, or test commands or the folder layout, update the matching lines of the project-root `AGENTS.md` before committing; the commands come from `docs/constitution.md` → Verification Commands (update that table first if a command changed). If code changed since the last Definition of Done run (for example a fix from Manual Check), run the build, lint, typecheck, and test commands again before committing (`kit/orchestrator-conventions.md` → Definition of Done step 3).
- **Docs lint.** Before the commit, run `node kit/scripts/lint-docs.js` (`kit/orchestrator-conventions.md` rule 11). Errors (invalid `Status`, malformed `Last updated`) are fixed before committing; warnings are shown to the user and never block.
- **Product changelog.** If the project has a root `CHANGELOG.md`, add one entry under its Unreleased section in its existing format before committing. If there is none, do not create one.
- Commit everything except secrets: confirm `.env` and `.test-accounts.json` are git-ignored (`git ls-files .test-accounts.json` returns nothing) and `docs/E2E-TESTS.md` and `docs/ENV_SETUP.md` hold key names and account ids only, never values. `scope: feature`: one commit referencing the feature slug. `scope: all`: one commit covering all features, with the full scope in the message (for example `feat: complete <project> MVP — F01 through FNN`).
- **Pre-flight (before any push):** run `git remote -v`. Check that a remote exists, that the user is authenticated to it (for example a dry-run `git ls-remote <remote>` succeeds), and which PR route is available: your platform's or git host's PR tool or CLI, or the host's web UI. Then name the remote URL to the user and **get their explicit confirmation before pushing**.
- **Local-only fallback:** if there is no remote, authentication fails, or the user declines, commit on the feature branch, skip push and PR, record `local-only: not pushed` in the session log, and tell the user how to publish later (add a remote with `git remote add origin <url>`, then `git push -u origin <branch>` and open a PR from the host's web UI or CLI). Append the `shipped` events with `evidence: local commit <short-sha>` and run the render script; the PR reference can be added later.
- Push the branch and open a PR against `main`; if no PR tool or CLI is available, push and give the user the branch name to open the PR in the host's web UI. Never merge it and never push to `main`. Write the PR body from `kit/templates/pr-description.md`: every section is filled. **Migration and rollback** is required, never left empty, when the plan has schema tasks (what changes and how to roll it back); otherwise it says `none`. List new environment variable names only, never values. The Verification section reports the Definition of Done result and the E2E count.
- Push first, because the PR reference is the shipped event's evidence. Then append a `shipped` event (`source: live`, `by: orchestrator`, `evidence`: the PR reference, e.g. `PR #7`) to each feature built (`scope: all`: every Must feature built in this pass), set `status: shipped` on every release with no `pending` or `in-progress` Must feature left and at least one `shipped` feature (Should and Could features not built stay `pending`, and `cancelled` features never hold a release open), run `node kit/scripts/render-backlog.js`, and commit and push those files to the same branch so the same PR carries them.
- **CI status.** After the PR is open, if `docs/constitution.md` → Verification Commands has a CI row or the repo has pipeline config, read the PR's check status once with the harness's available tool and record `passing`, `failing`, `pending`, or `not-checked` in the session log. Never merge, and never wait indefinitely: check once after the push, then ask the user whether to wait for the pending checks. With no CI, no remote, or no tool to read checks, record `not-checked` (or `local-only: not pushed`) and finish.
  - `failing`: return to Step 4 once per cycle with the error output; the fix diff goes through review and the affected E2E scope is rerun (`kit/steps/phase-2/p2-05-e2e.md`), then push the fix to the same PR and check again. If CI still fails after that return, ask the user how to proceed; do not loop a second time.
- **No deploy.** Ship never deploys. If the PR's checks include a preview URL, report it to the user.
- **Spec persistence (ask once):** if `docs/constitution.md` has no "Spec Evolution" section, ask the user how specs will evolve and record the choice there — the three models are in `kit/guides/evolving-specs.md` — and set `Last amended` to today. Decide before starting another cycle.

## Completion Criteria

- [ ] All changes committed; remote confirmed by the user, branch pushed, and PR open against `main` with every section of the PR template filled — or the local-only fallback recorded in the session log
- [ ] CI status (`passing`, `failing`, `pending`, or `not-checked`) recorded in the session log; a failing run returned to Step 4 at most once, and a second failure was put to the user
- [ ] `docs/backlog.json` has a `shipped` event with PR (or local commit) evidence for every feature built; render script exits 0
- [ ] Every release with no `pending` or `in-progress` Must feature has `status: shipped` in `docs/backlog.json`
- [ ] Spec persistence decision recorded in `docs/constitution.md`
- [ ] Project-root `AGENTS.md` matches the commands and layout after this cycle
- [ ] `node kit/scripts/lint-docs.js` reports no errors before the commit; any warnings were shown to the user
- [ ] If a root `CHANGELOG.md` exists, it has an entry for this cycle under Unreleased

## Transitions

- **Next**:
  - `scope: feature` with `pending` features left: select the next feature under the feature loop in `kit/phase-2.md` (features of the same group may already be in flight in other sessions) and restart at Step 1.
  - Otherwise (`scope: all`, or no `pending` or `in-progress` features left): the release is complete. Tell the user and offer the next move — `kit/phase-3-iterate.md` Step 5 (Closeout) if the release came from a Phase 3 round, then a new Phase 3 round when new requirements arrive (works with or without ideas), or `kit/phase-bug-fix.md` for a reported defect. If the user already knows exactly one feature to add, append a release entry (`id`, `name`, `status: planned`) and the feature (`release` set to that id, status `pending`, a `created` event with `at`, `source`, `by`, `note`) to `docs/backlog.json`, run the render script, set `Phase 2 Scope` to `feature` in `docs/roadmap.md` and `phase2_scope` in `docs/backlog.json`, then run Phase 2 with `scope: feature`.

## References

- `finishing-a-development-branch` skill
- `kit/guides/evolving-specs.md`
