# Phase 2 · Step 2 — Plan

## Overview

- **Purpose**: Break the approved spec into ordered tasks, give each a specialist, and mark parallel groups.
- **Agent/Skill**: `writing-plans` skill
- **Model**: `balanced`
- **Gate**: `hard` — the specialist and parallel-group decisions set how Step 3 runs; approval is explicit, never by silence.
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

1. **Inventory the harness.** Discover the installed skills and agents per `kit/task-agent-rubric.md` → Discovering what is installed, and resolve the `general-purpose` role per Resolving the agent. State the counts and the resolved name in the summary. Never assume a name exists.
2. **Invoke `writing-plans`** with the spec, architecture, and constitution. Its self-review loop must finish before the gate.
3. **Write the plan** from `kit/templates/plan.md` to the Outputs path (conventions rule 16). Each task follows the template's task block; split a two-domain task first. Pick every task's agent and skills per the rubric → Choosing per task; the `## Skills and Agents` table repeats them with a reason, plus the skills later steps load.
4. **Validate** against `docs/architecture.md` and `docs/constitution.md`. Schema tasks match `docs/data-model.md` plus the spec's `## Data & Flow Impact`, field-for-field. Each applicable NFR gets a task that delivers or verifies it; an NFR with no task is a plan gap.
5. **Present** the Gate Summary: task count, files, installed skills and agents found, the agent and skills chosen per task with reasons, any installed candidate considered and rejected (one line), any required skill not installed, parallel groups. Then ask two decisions: `D1 Approve the agent and skill assignments as listed (default: yes)` and `D2 Approve the parallel groups (default: yes)`. Answers that change anything come back as plan edits; re-run the self-review loop after significant changes. Do not start Step 3 until the user replies.
6. **After the user accepts**, add each environment variable from `## Architecture Impact` to `ENV_SETUP.md` (one `### KEY_NAME` section) and `.env.example` (placeholder, never a value). Do not edit `docs/architecture.md` now: Ship merges the section (`p2-07-ship.md` → Impact merge).

These win over `writing-plans` defaults and any user-level setting:

| Skill default | This kit |
|---|---|
| `REQUIRED SUB-SKILL` banner, goal and tech-stack block | Metadata header only |
| Complete code in steps | **No code:** no function bodies, test bodies, or full files; a signature or type shape only, at most 12 lines per task. Code is written at Step 3 |
| Priority-based order | Dependency order, never MoSCoW (`scope: all` interleaves across features) |
| Free-form rationale, preamble, long decision notes | **One line per task field, at most 300 characters.** Longer reasoning belongs in the spec or `docs/architecture.md`; the field cites it. The 12-line cap counts lines, never a way to pack a paragraph into one |
| Extra sections | Only the template's sections. No preamble under the header, and no decision blocks added later (for example after Review): a decision that changes behavior goes into the spec, any other goes into the session log |

| Variant | Rule |
|---|---|
| `scope: all`, a second **domain** (`p1-04-roadmap.md`; UI + API is one) holds ≥ 20% of the tasks | Recommend `scope: feature` (**experimental — not yet validated**); staying is valid. Ask; never switch on your own. If confirmed, follow the Mid-Cycle Escape in `kit/guides/phase-2-feature-scope.md` |

## Completion Criteria

- [ ] Every task has `Specialist:` checked against the harness inventory; the `## Skills and Agents` table matches it; parallel groups marked; every applicable NFR has an `NFR:` task; no task field over 300 characters; no sections beyond the template's
- [ ] Validated; self-review loop complete; gate summary presented, D1 and D2 answered, changes incorporated
- [ ] `## Architecture Impact` present and its environment variables added to `ENV_SETUP.md` and `.env.example`

## Transitions

- **Next**: Step 3 — Implement

## References

- `writing-plans` skill
- `kit/task-agent-rubric.md`
