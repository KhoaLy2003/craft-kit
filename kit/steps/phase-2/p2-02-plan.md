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

- Invoke `writing-plans` with the spec, architecture, and constitution. Its self-review loop (placeholder scan, spec coverage, type consistency) must finish before the gate.
- Order tasks by dependency (build order), never by MoSCoW priority. `scope: all` interleaves tasks across features where dependencies require it.
- No placeholders: every task names exact files, interfaces, test steps, and implementation steps.
- Every task carries one `Specialist:` line chosen with `kit/task-agent-rubric.md`. A task spanning two domains is split first, per the rubric.
- Mark parallel groups in the format the rubric defines. Step 3 dispatches from these marks and does not re-decide them.
- Every task that creates or alters a table, collection, route, or screen names the entity or screen from the docs it implements; schema tasks must match `docs/data-model.md` field-for-field.
- Features from a Phase 3 release: tasks that create or alter a Shared Surface item exist only in the plan of its owner feature; every other plan consumes the owner's contract from `design.md` and `docs/data-model.md` and carries no migration or schema task for it.
- **NFR tasks.** For each NFR the spec marks applicable, the plan includes the tasks that deliver or verify it (a rate limit, an index, an accessibility scan) and marks each with `NFR: <category, row>`; an applicable NFR with no task is a plan gap. The plan refers to the roadmap table and does not copy it.
- Validate the plan against `docs/architecture.md` and `docs/constitution.md` before presenting it.
- **Architecture Impact.** Every plan ends with `## Architecture Impact`: new dependencies, external services, auth/model changes, route groups, or environment variables introduced, or the literal line `none`. After the user accepts the plan, apply the amendments to `docs/architecture.md` (keep `Status: approved`, refresh `Last updated`), and add each new environment variable to `ENV_SETUP.md` (one `### KEY_NAME` section) and `.env.example` (one line, descriptive placeholder; never a value). Re-render the architecture diagram per `kit/orchestrator-conventions.md` rule 8 only if the system overview changed.
- **Scope check (`scope: all` only):** count the plan's tasks per **domain**, using the definition in `kit/steps/phase-1/p1-04-roadmap.md` (a distinct area needing a different specialist skill or a separate deployable concern). The frontend/backend split of a normal UI + API app is one domain and does not trigger this check. If a second domain holds ≥ 20% of the tasks, tell the user the plan outgrew `scope: all` and recommend `scope: feature`, labelled **experimental — not yet validated**; staying on `scope: all` is a valid answer. Ask the user; never switch on your own. If the user confirms, set `Phase 2 Scope: feature` in `docs/roadmap.md` and `phase2_scope` to `feature` in `docs/backlog.json`, then follow the mid-cycle escape in `kit/phase-2.md`.
- Present the summary — task count, files, key decisions, specialist split, parallel groups. After significant requested changes, re-run the self-review loop before advancing.

## Completion Criteria

- [ ] Plan file exists with all tasks, each with exactly one `Specialist:` line
- [ ] Parallel groups marked
- [ ] Every NFR the spec marks applicable has at least one task marked `NFR:`
- [ ] Validated against `docs/architecture.md` and `docs/constitution.md`; self-review loop complete
- [ ] Validated against `docs/data-model.md` and `docs/flows.md`
- [ ] Plan ends with `## Architecture Impact`; amendments applied to `docs/architecture.md`, `ENV_SETUP.md`, `.env.example`
- [ ] Summary presented and requested changes incorporated

## Transitions

- **Next**: Step 3 — Implement

## References

- `writing-plans` skill
- `kit/task-agent-rubric.md`
