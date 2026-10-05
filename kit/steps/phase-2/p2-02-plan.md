# Phase 2 · Step 2 — Plan

## Overview

- **Purpose**: Break the approved spec into ordered tasks, give each a specialist, and mark parallel groups.
- **Agent/Skill**: `writing-plans` skill
- **Model**: `balanced`
- **Gate**: `soft` — plan summary
- **Inputs**:
  - the spec (`docs/specs/spec.md` or `docs/specs/<feature-slug>/spec.md`)
  - `docs/architecture.md`, `docs/constitution.md`
  - `kit/task-agent-rubric.md` — specialist routing, task splitting, and the parallel-group format
- **Outputs**:
  - `scope: feature` → `docs/specs/<feature-slug>/plan.md`
  - `scope: all` → `docs/specs/plan.md`
- **Template**: none

## Scope

- **In**: ordered tasks with exact files, interfaces, test steps, and implementation steps; one `Specialist:` per task; parallel groups; validation against architecture and constitution.
- **Out**: writing code (Step 3); tasks for features outside the spec.

## Rules

- Invoke `writing-plans` with the spec, architecture, and constitution. Its self-review loop (placeholder scan, spec coverage, type consistency) must finish before the gate.
- Order tasks by dependency (build order), never by MoSCoW priority. `scope: all` interleaves tasks across features where dependencies require it.
- No placeholders: every task names exact files, interfaces, test steps, and implementation steps.
- Every task carries one `Specialist:` line chosen with `kit/task-agent-rubric.md`. A task spanning two domains is split first, per the rubric.
- Mark parallel groups in the format the rubric defines. Step 3 dispatches from these marks and does not re-decide them.
- Validate the plan against `docs/architecture.md` and `docs/constitution.md` before presenting it.
- **Scope check (`scope: all` only):** if more than 20% of tasks go to a minority specialist, recommend switching to `scope: feature` (selection criteria: `kit/steps/phase-1/p1-04-roadmap.md`). If the user confirms, set `Phase 2 Scope: feature` in `docs/roadmap.md` and follow the mid-cycle escape in `kit/phase-2.md`.
- Present the summary — task count, files, key decisions, specialist split, parallel groups. After significant requested changes, re-run the self-review loop before advancing.

## Completion Criteria

- [ ] Plan file exists with all tasks, each with exactly one `Specialist:` line
- [ ] Parallel groups marked
- [ ] Validated against `docs/architecture.md` and `docs/constitution.md`; self-review loop complete
- [ ] Summary presented and requested changes incorporated

## Transitions

- **Next**: Step 3 — Implement

## References

- `writing-plans` skill
- `kit/task-agent-rubric.md`
