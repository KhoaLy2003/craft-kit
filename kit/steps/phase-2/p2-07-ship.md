# Phase 2 · Step 7 — Ship

## Overview

- **Purpose**: Commit, push, open a pull request, and record the shipped features. Push and PR are outward-facing: they publish code beyond this machine.
- **Agent/Skill**: `finishing-a-development-branch` skill + general-purpose agent
- **Model**: `fast`
- **Gate**: `none`
- **Inputs**: the feature branch (changes uncommitted unless a handover committed some); `docs/backlog.json`
- **Outputs**:
  - committed branch; pushed branch and PR against the base branch (conventions rule 17; unless local-only) with a structured description
  - `shipped` event in `docs/backlog.json` per shipped feature; regenerated `docs/roadmap.md` table (`docs/backlog.html` is regenerated locally and git-ignored)
  - the unit collapsed in the session log and the E2E doc, its full text archived under `docs/archive/` (section 4, step 4); CI status reported to the user
- **Template**: `kit/templates/pr-description.md`

## Rules

Work in this order.

### 1. Before the commit

- **Impact merge (once per cycle).** Merge the unit's records into the shared docs, then keep each `Status: approved` and refresh `Last updated`:
  - spec `## Data & Flow Impact` → `docs/data-model.md` and `docs/flows.md` (extend the §4 matrix and screen inventory, update the §2 `erDiagram`). Compare fields, relationships, screens, and transitions, not just names; never duplicate rows. A wave-design feature has nothing to merge beyond its slice.
  - plan `## Architecture Impact` → `docs/architecture.md` (`ENV_SETUP.md` and `.env.example` were done at Step 2).
  - Re-render an HTML diagram (`kit/guides/diagrams.md`) only if the user asks; the Mermaid sources are always current.
- **AGENTS.md sync.** If this cycle amended `docs/architecture.md`, or changed the install, start, build, or test commands or the folder layout, update the matching lines of the project-root `AGENTS.md`. Take commands from `docs/constitution.md` → Verification Commands, and update that table first if a command changed.
- **Re-verify.** If code changed since the last Definition of Done run, run it again (conventions → Definition of Done step 3).
- **Docs lint** (conventions rule 11). Fix errors; show warnings; warnings never block. For a stale warning on a doc this cycle's Impact merge or review already covered, set its `**Reviewed against:**` date rather than editing the body. A growth warning for this unit's own section is expected now; the collapse in section 4 clears it.
- **Known issues.** Stage `docs/known-issues.md` when this cycle added rows. Mention the count of `open` rows in the PR's Known limitations; `scope: all` also asks the user to fix or accept each (Status `accepted`) before the commit.
- **Product changelog.** If the project has a root `CHANGELOG.md`, add one entry under Unreleased in its format; never create one.
- **Secrets.** Confirm `.env` and `.test-accounts.json` are git-ignored (`git ls-files .test-accounts.json` returns nothing). `docs/E2E-TESTS.md` and `docs/ENV_SETUP.md` hold names and ids only, never values.

### 2. Commit

Commit everything except secrets.

- `scope: feature`: one commit referencing the feature slug.
- `scope: all`: one commit for all features, with the full scope in the message (for example `feat: complete <project> MVP — F01 through FNN`).

### 3. Push and open the PR

- **Pre-flight.** `git remote -v`; check a remote exists, the user is authenticated (`git ls-remote <remote>` succeeds), and which PR route exists (tool, CLI, or web UI). **CI trigger check:** take `runs on PRs to:` from the constitution's CI row; when it is missing, read the `on:` triggers in `.github/workflows/*.yml` (or the CI config named in Verification Commands) and record the result there. If the base branch (conventions rule 17) is not matched by the `pull_request` triggers, tell the user once, before pushing, that CI will not run for this PR; the constitution note means later cycles do not repeat it. Name the remote URL and **get explicit confirmation before pushing**.
- **Local-only fallback.** If there is no remote, authentication fails, or the user declines:
  - commit on the feature branch; skip push and PR; record `local-only: not pushed` in the Outcome line
  - tell the user how to publish later (`git remote add origin <url>`, `git push -u origin <branch>`, open a PR)
  - append the `shipped` events with `evidence: local commit <short-sha>` and run the render script
- **Push and PR.** Push and open a PR against the base branch (no PR tool: give the user the branch name for the web UI). Never merge, never push to the base branch.
- **PR body.** Write it from `kit/templates/pr-description.md`; every section is filled; Known limitations lists the minor review findings deferred at Step 4.
  - **Migration and rollback**: required with schema tasks (what changes, how to roll back); else `none`.
  - New environment variable names only, never values.
  - Verification: the Definition of Done result and E2E count.

### 4. Record the shipped features

Push first: the PR reference is the shipped event's evidence. Then:

1. Append a `shipped` event (`at`, `evidence`: the PR reference, e.g. `PR #7`; `source` and `by` default to `live` and `orchestrator`) to each feature built. Under `scope: all` that is every Must feature built in this pass.
2. Set `status: shipped` on every release that has no `pending` or `in-progress` Must feature left and at least one `shipped` feature. Should and Could features not built stay `pending`; `cancelled` features never hold a release open.
3. Run `node kit/scripts/render-backlog.js`.
4. **Collapse the unit (mandatory).** Set every step row of the unit to `complete` or `skipped`, then:
   - **Session log.** Move the unit's whole section from `docs/phase-2-session.md` to `docs/archive/phase-2-session/<unit-slug>.md` (create the folder; text unchanged). In its place keep the `## <unit>` heading, the steps table with every Output cell reduced to a path, and one line: `Outcome: shipped, <PR ref>; <n> of <n> acceptance criteria PASS; <n> known issues. Archive: <path>`. A local-only ship writes `Outcome: local-only: not pushed, commit <sha>; ...`.
   - **E2E doc.** For each feature shipped, move its Section 3 block and its Section 8 rows to `docs/archive/e2e/<feature-slug>.md` and leave one line where the block was: `Shipped <PR ref>; <n> of <n> PASS; archived: <path>`. Under `scope: all` this covers every feature built.
   - Archived files are read only when a step names them (the restore rule in `p2-05-e2e.md`); resume, handover, review and E2E read the current unit only.
5. Run `node kit/scripts/lint-docs.js` again: no growth warning for this unit may remain.
6. Commit and push `docs/backlog.json`, `docs/roadmap.md`, the collapsed `docs/phase-2-session.md` and `docs/E2E-TESTS.md`, and `docs/archive/` to the same branch so the same PR carries them.

### 5. CI status

- With a CI row in Verification Commands or pipeline config, read the PR's check status **once** and report `passing`, `failing`, `pending`, or `not-checked` to the user (the unit is already collapsed; CI status is not written to the docs). Never wait indefinitely; for `pending`, ask the user. With no CI, remote, or tool, or when the trigger check found CI will not run for the PR base: `not-checked` (or `local-only: not pushed`), with the reason.
- `failing`: return to Step 4 **once per cycle** with the error output; the fix goes through review and the affected E2E scope reruns (`p2-05-e2e.md`); push to the same PR and check again. Still failing: ask the user; no second loop.

### 6. Other rules

- **No deploy.** Ship never deploys. If the PR's checks include a preview URL, report it.
- **Spec persistence (ask once).** If `docs/constitution.md` has no "Spec Evolution" section, ask how specs will evolve, record it there (models: `kit/guides/evolving-specs.md`), and set `Last amended` to today.

## Completion Criteria

- [ ] Committed; user-confirmed remote pushed and PR open with the PR template filled, or the local-only fallback recorded in the Outcome line
- [ ] CI status reported (a failing run returned to Step 4 at most once)
- [ ] `shipped` events with PR (or local commit) evidence for every feature built; releases closed per rule 4; render script exits 0
- [ ] Impact merge done; unit collapsed and archived (session log and E2E doc); spec persistence decision recorded; `AGENTS.md` and root `CHANGELOG.md` (if any) updated; lint-docs reports no errors and no growth warning for this unit
- [ ] `scope: feature` with `pending` features left: the user answered the next-step question; nothing started unprompted

## Transitions

### Next

**`scope: feature`, `pending` features left.** Select the next feature (feature loop in `kit/guides/phase-2-feature-scope.md`). Do not start it; this is a clean seam. Ask and wait:

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
