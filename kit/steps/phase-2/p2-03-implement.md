# Phase 2 · Step 3 — Implement

## Overview

- **Purpose**: Implement every plan task on a feature branch, each dispatched to its specialist.
- **Agent/Skill**: `subagent-driven-development` (sequential chains), `dispatching-parallel-agents` (parallel groups); specialists per the plan
- **Model**: `balanced`
- **Gate**: `none`
- **Inputs**:
  - the plan and spec (`docs/specs/` or `docs/specs/<feature-slug>/`), `docs/constitution.md`
  - `docs/DESIGN.md`, `docs/preview/`, and `docs/designs/<feature-slug>/` (per feature, if it exists)
- **Outputs**: code on the feature branch
- **Template**: none

## Scope

- **In**: dispatching each task to its specialist; checking each task against the constitution.
- **Out**: re-deciding parallel groups or specialists (Step 2 did); spec coverage and code review (Step 4); commits (Step 7).
- **Boundary**: **BLOCK — create the branch before any code.** `git checkout -b feature/<slug>` if absent, and confirm it is checked out. `<slug>` is the feature slug (`scope: feature`) or project slug (`scope: all`); create it from `main`. If a `depends_on` feature is `shipped` but its PR is unmerged, ask the user to merge it or to branch from its branch (the PR then targets that branch). Never implement on `main`; no git repo is a Phase 1 gap, so stop. On creation, append a `started` event (`source: live`, `by: orchestrator`, `evidence`: branch name) to the feature in `docs/backlog.json` (`scope: all`: every Must feature built), set a `planned` release to `in-progress` in the same write, then run `node kit/scripts/render-backlog.js`.
- **Baseline**: after the branch exists and before any code, run the Verification Commands once (conventions → Definition of Done step 1) and log the results; failures that predate any change are `pre-existing`. Report any `unknown` command to the user.

## Rules

- Dispatch each task to its `Specialist:`. Sequential chains use `subagent-driven-development`; groups marked parallel in the plan use `dispatching-parallel-agents`.
- Every UI dispatch follows the Design dispatch contract (conventions); visual-quality tasks also use `design-taste-frontend` (rubric).
- Skip the skill's per-task and whole-branch review passes; Step 4 reviews the whole diff once.
- Check each completed task against `docs/constitution.md` before the next.
- Spec gap or contradiction mid-task: pause, set the spec `Status` to `draft`, show the user the edit, and restore `approved` only on explicit confirmation. Never guess.
- A token or component `docs/DESIGN.md` lacks: use the closest existing one, or add it to `docs/DESIGN.md` with the user's explicit approval; never invent undocumented values. `docs/preview/` is not regenerated.
- A foundational task fails or invalidates later tasks: stop and re-evaluate scope.
- No per-task commits (Ship, or a handover, commits). Log the branch name.
- Phase 3 release features: create `feature/<slug>` from `main` after the `design/<release-slug>` PR is merged (from `design/<release-slug>` if local-only) so the branch has the wave design. Start only after every feature in earlier Work Packages groups has `shipped`.

## Completion Criteria

- [ ] Every plan task implemented by its assigned specialist
- [ ] Baseline run recorded in the session log (`pre-existing` failures listed)
- [ ] All changes on `feature/<slug>`, none on `main`
- [ ] Each task checked against `docs/constitution.md`; no unresolved spec gaps

## Transitions

- **Next**: Step 4 — Review (a handover seam; see `kit/guides/session-handover.md`)

## References

- `subagent-driven-development`, `dispatching-parallel-agents`, `design-taste-frontend` skills
- `kit/task-agent-rubric.md`
