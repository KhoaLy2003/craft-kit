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
- **Template**: `kit/templates/plan.md`

## Scope

- **In**: ordered tasks (files, signatures, key decisions, edge cases, test intent), `Specialist:` lines, parallel groups, validation against architecture and constitution.
- **Out**: writing code (Step 3); tasks for features outside the spec.

## Rules

Work in this order.

1. **Invoke `writing-plans`** with the spec, architecture, and constitution. Its self-review loop must finish before the gate.
2. **Write the plan** from `kit/templates/plan.md` to the Outputs path (conventions rule 16). Each task follows the template's task block; split a two-domain task first.
3. **Validate** against `docs/architecture.md` and `docs/constitution.md`. Schema tasks match `docs/data-model.md` plus the spec's `## Data & Flow Impact`, field-for-field. Each applicable NFR gets a task that delivers or verifies it; an NFR with no task is a plan gap.
4. **Present** the summary (task count, files, key decisions, specialist split, parallel groups). After significant changes, re-run the self-review loop.
5. **After the user accepts**, add each environment variable from `## Architecture Impact` to `ENV_SETUP.md` (one `### KEY_NAME` section) and `.env.example` (placeholder, never a value). Do not edit `docs/architecture.md` now: Ship merges the section (`p2-07-ship.md` → Impact merge).

These win over `writing-plans` defaults and any user-level setting:

| Skill default | This kit |
|---|---|
| `REQUIRED SUB-SKILL` banner, goal and tech-stack block | Metadata header only |
| Complete code in steps | **No code:** no function bodies, test bodies, or full files; a signature or type shape only, at most 12 lines per task. Code is written at Step 3 |
| Priority-based order | Dependency order, never MoSCoW (`scope: all` interleaves across features) |

| Variant | Rule |
|---|---|
| Phase 3 release feature | A task that creates or alters a Shared Surface item exists only in its owner feature's plan. Other plans consume the owner's contract from `design.md` (Feature slices entry and the sections it lists) and `docs/data-model.md`, with no migration or schema task for it |
| `scope: all`, a second **domain** (`p1-04-roadmap.md`; UI + API is one) holds ≥ 20% of the tasks | Recommend `scope: feature` (**experimental — not yet validated**); staying is valid. Ask; never switch on your own. If confirmed, follow the Mid-Cycle Escape in `kit/guides/phase-2-feature-scope.md` |

## Completion Criteria

- [ ] Every task needing a skill has `Specialist:`; parallel groups marked; every applicable NFR has an `NFR:` task
- [ ] Validated; self-review loop complete; summary presented and changes incorporated
- [ ] `## Architecture Impact` present and its environment variables added to `ENV_SETUP.md` and `.env.example`

## Transitions

- **Next**: Step 3 — Implement

## References

- `writing-plans` skill
- `kit/task-agent-rubric.md`
