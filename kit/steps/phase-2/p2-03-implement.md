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
- **Boundary**: **BLOCK — create the branch before any code.** `git checkout -b feature/<slug>` if it does not already exist, then confirm it is checked out. `<slug>` is the feature slug (`scope: feature`) or the project slug (`scope: all`). Never implement on `main`. If no git repository exists, that is a Phase 1 gap — stop and resolve it.

## Rules

- Dispatch each task to its `Specialist:`. Sequential chains use `subagent-driven-development`; groups marked parallel in the plan use `dispatching-parallel-agents`.
- Every `frontend-developer` dispatch follows the Frontend dispatch contract in `kit/orchestrator-conventions.md`. UI tasks with visual-quality signals also use `design-taste-frontend`, as the rubric requires.
- Skip the skill's per-task and whole-branch review passes — Step 4 reviews the whole diff once.
- Check each completed task against `docs/constitution.md` before starting the next.
- Spec gap or contradiction found mid-task: pause and update the spec before continuing — do not guess.
- A foundational task fails or reveals complexity that invalidates later tasks: stop and re-evaluate scope; do not build on a broken foundation.
- No per-task commits — commits happen at Ship, or at a session handover.
- Put the branch name in the session log.

## Completion Criteria

- [ ] Every plan task implemented by its assigned specialist
- [ ] All changes on `feature/<slug>`, none on `main`
- [ ] Each task checked against `docs/constitution.md`; no unresolved spec gaps

## Transitions

- **Next**: Step 4 — Review (a handover seam; see `kit/guides/session-handover.md`)

## References

- `subagent-driven-development`, `dispatching-parallel-agents`, `design-taste-frontend` skills
- `kit/task-agent-rubric.md`
