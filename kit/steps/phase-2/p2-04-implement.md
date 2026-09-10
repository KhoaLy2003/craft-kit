# Phase 2 · Step 4 — Implement

## Overview

- **Purpose**: Write code to implement all tasks; dispatch specialist agents for each domain.
- **Skill/Agent**: `subagent-driven-development` skill (sequential chains) or `dispatching-parallel-agents` skill (parallel groups identified in Step 3)
- **Model**: `sonnet`
- **Trigger**: `plan.md` exists with `Specialist:` annotations (Step 3 complete)
- **Inputs**:
  - `docs/specs/<feature-slug>/plan.md` with specialist annotations
  - `docs/specs/<feature-slug>/spec.md`
  - `docs/constitution.md`
- **Outputs**:
  - Code changes on a feature branch
- **Gate**: `soft` — recommended: review the first 3–5 tasks before continuing unattended when working in an unfamiliar codebase pattern for the first time

## Scope

### In Scope

- Dispatching specialist implementer subagents for each task per the `Specialist:` annotations
- Using parallel dispatch for groups marked `<!-- Parallel group -->` in `plan.md`
- Running the `design-taste-frontend` skill for UI tasks with visual quality signals

### Out of Scope

- Re-evaluating which tasks can be parallelized — that decision was made in Step 3
- Committing or pushing any code — that is Step 9
- Spec coverage verification — that is Step 5

### Scope Boundary

> Implementation ends when all tasks in `plan.md` have been dispatched and their changes are on the feature branch, uncommitted. No commits are made during implementation.

## Execution Rules

- Use `subagent-driven-development` for sequential task chains. It dispatches one implementer subagent per task, runs a task reviewer after each, and a final whole-branch review at the end. Use the `Specialist:` annotation from Step 3 to select the right agent for each task.
- For groups marked `<!-- Parallel group -->` in `plan.md`, use `dispatching-parallel-agents` instead. Do not re-evaluate which tasks can parallelize here — that decision was made in Step 3.
- Do not commit after individual tasks during implementation. Leave all changes uncommitted until the user has reviewed the complete feature and explicitly approves shipping.
- **`design-taste-frontend` skill — required for UI tasks:** when dispatching `frontend-developer` for any task whose description contains signals from the second row of `task-agent-rubric.md` ("visual quality", "design upgrade", "polish", "no generic patterns", "premium UI"), include the `design-taste-frontend` skill in the dispatch. This is not optional — generic AI UI patterns are the most common quality failure in Phase 2 output.

## Artifact Rules

- **Artifact**: Code changes on the feature branch (no structured document output)
- All task changes land on the feature branch. No intermediate commits per task.
- **Status / approval condition**: Soft gate — after the first 3–5 tasks in an unfamiliar codebase pattern, surface output for review before continuing unattended.

## Completion Criteria

The step is considered complete when:

- [ ] All tasks in `plan.md` have been implemented by their assigned specialist agents
- [ ] All changes are on the feature branch
- [ ] No changes have been committed
- [ ] The `design-taste-frontend` skill was used for any UI task with visual quality signals

## Transition Rules

### Before Advancing

- All tasks in `plan.md` must be implemented and changes on the branch.
- No commits made during implementation.
- Soft gate: if this is the first implementation pass on an unfamiliar codebase pattern, confirm the first batch of output with the user before continuing.

### Next Step

- **Default**: Step 5 — Converge
- **Optional skip**: No
- **User decision required**: No (except soft gate first-pass check)

### Transition Record

- **Record**: session log (per `kit/session-logging.md`)
- **Values**: `complete`

## Exceptions / Special Cases

- If `subagent-driven-development`'s built-in whole-branch review produces findings, fix them before advancing to Step 5 — do not carry them forward.

## References

- `subagent-driven-development` skill
- `dispatching-parallel-agents` skill
- `design-taste-frontend` skill
- `kit/task-agent-rubric.md`
