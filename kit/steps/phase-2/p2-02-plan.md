# Phase 2 · Step 2 — Plan

## Overview

- **Purpose**: Break the approved spec into ordered tasks, give each a specialist, and mark parallel groups.
- **Agent/Skill**: `writing-plans` skill
- **Model**: `balanced`
- **Gate**: `soft` — plan summary
- **Inputs**:
  - the spec (`docs/specs/spec.md` or `docs/specs/<feature-slug>/spec.md`)
  - `docs/architecture.md`, `docs/constitution.md`, `docs/data-model.md`, `docs/flows.md`
  - `kit/task-agent-rubric.md` — specialist routing, task splitting, and the parallel-group format
- **Outputs**:
  - `scope: feature` → `docs/specs/<feature-slug>/plan.md`
  - `scope: all` → `docs/specs/plan.md`
- **Template**: none

## Scope

- **In**: ordered tasks with exact files, interfaces, test steps, and implementation steps; one `Specialist:` per task; parallel groups; validation against architecture and constitution.
- **Out**: writing code (Step 3); tasks for features outside the spec.

## Rules

- Invoke `writing-plans` with the spec, architecture, and constitution; its self-review loop must finish before the gate.
- Order tasks by dependency, never MoSCoW (`scope: all` interleaves across features as needed).
- No placeholders: every task names exact files, interfaces, test steps, and implementation steps.
- One `Specialist:` line per task (`kit/task-agent-rubric.md`); split a two-domain task first.
- Mark parallel groups in the rubric's format; Step 3 dispatches from them.
- Every task that creates or alters a table, collection, route, or screen names the entity or screen from the docs it implements; schema tasks must match `docs/data-model.md` field-for-field.
- Features from a Phase 3 release: tasks that create or alter a Shared Surface item exist only in the plan of its owner feature; every other plan consumes the owner's contract from `design.md` and `docs/data-model.md` and carries no migration or schema task for it.
- **NFR tasks.** Each applicable NFR gets tasks that deliver or verify it (a rate limit, an index, an accessibility scan), marked `NFR: <category, row>`; an NFR with no task is a plan gap. Refer to the roadmap table, never copy it.
- Validate the plan against `docs/architecture.md` and `docs/constitution.md` before presenting it.
- **Architecture Impact.** Every plan ends with `## Architecture Impact`: new dependencies, external services, auth/model changes, route groups, or environment variables introduced, or the literal line `none`. After the user accepts the plan, apply the amendments to `docs/architecture.md` (keep `Status: approved`, refresh `Last updated`) and add each new environment variable to `ENV_SETUP.md` (one `### KEY_NAME` section) and `.env.example` (placeholder, never a value). Re-render the architecture diagram (`kit/guides/diagrams.md`) only if the system overview changed.
- **Scope check (`scope: all` only):** count tasks per **domain** (definition in `p1-04-roadmap.md`; UI + API is one domain). If a second domain holds ≥ 20% of the tasks, tell the user the plan outgrew `scope: all` and recommend `scope: feature` (**experimental — not yet validated**); staying is valid. Ask; never switch on your own. If confirmed, follow the mid-cycle escape in `kit/phase-2.md`.
- Present the summary (task count, files, key decisions, specialist split, parallel groups). After significant changes, re-run the self-review loop.

## Completion Criteria

- [ ] Every task has one `Specialist:`; parallel groups marked; every applicable NFR has an `NFR:` task
- [ ] Validated against architecture, constitution, data model, and flows; self-review loop complete
- [ ] `## Architecture Impact` present and its amendments applied (`docs/architecture.md`, `ENV_SETUP.md`, `.env.example`)
- [ ] Summary presented and requested changes incorporated

## Transitions

- **Next**: Step 3 — Implement

## References

- `writing-plans` skill
- `kit/task-agent-rubric.md`
