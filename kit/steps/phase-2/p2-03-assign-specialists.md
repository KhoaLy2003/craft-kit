# Phase 2 · Step 3 — Assign Specialists

## Overview

- **Purpose**: Match each task to the appropriate specialist agent based on domain and task type.
- **Skill/Agent**: you (the orchestrating agent), or general-purpose agent
- **Model**: `haiku`
- **Trigger**: `plan.md` finalized (Step 2 complete)
- **Inputs**:
  - `docs/specs/<feature-slug>/plan.md`
  - `kit/task-agent-rubric.md`
- **Outputs**:
  - `docs/specs/<feature-slug>/plan.md` updated — each task annotated with a `Specialist:` field naming the agent that should implement it
- **Gate**: `none`

## Scope

### In Scope

- Reading each task in `plan.md` and matching it to an agent using `task-agent-rubric.md`
- Splitting any task that spans multiple domains into two single-domain tasks before annotating
- Identifying which independent same-domain tasks are candidates for parallel dispatch in Step 4

### Out of Scope

- Re-evaluating which tasks can be parallelized beyond what Step 2 decided — the parallel/sequential marking from Step 2 is the source of truth
- Implementing any code

### Scope Boundary

> Every task in `plan.md` must have exactly one `Specialist:` annotation before this step is done. A task with two specialists is a task that is too large and must be split.

## Execution Rules

- Use `kit/task-agent-rubric.md` as the reference for matching task types to available agents.
- Add a `Specialist:` line to each task in `plan.md`. Example:

  ```markdown
  ### Task 2: Build login form component
  **Specialist:** frontend-developer
  - Files: Create: src/components/LoginForm.tsx
  ...
  ```

- If a task spans multiple domains (e.g., frontend + backend), split it into two tasks before annotating.
- Tasks with `Specialist: task` use the general-purpose agent — appropriate for infrastructure, config, or tasks that don't fit a clear domain.
- After all tasks are annotated, review the full set: tasks sharing a domain that are independent of each other are candidates for parallel dispatch in Step 4.

## Artifact Rules

- **Artifact**: `docs/specs/<feature-slug>/plan.md` (updated in place)
- Every task must have a `Specialist:` line. No task may be left unannotated.
- If any task was split, the two replacement tasks must each have a `Specialist:` line and must together cover the same scope as the original.
- **Status / approval condition**: `none` — no approval gate; proceed directly to Step 4.

## Completion Criteria

The step is considered complete when:

- [ ] Every task in `plan.md` has exactly one `Specialist:` annotation
- [ ] No task spans multiple domains (multi-domain tasks have been split)
- [ ] Parallel dispatch candidates have been identified for Step 4

## Transition Rules

### Before Advancing

- Verify every task in `plan.md` has a `Specialist:` line.
- No gate — advance immediately once all tasks are annotated.

### Next Step

- **Default**: Step 4 — Implement
- **Optional skip**: No
- **User decision required**: No

### Transition Record

- **Record**: session log (per `kit/session-logging.md`)
- **Values**: `complete`

## Exceptions / Special Cases

- If a task in `plan.md` cannot be cleanly matched to a single agent, prefer splitting the task over assigning two specialists.
- Tasks with `Specialist: task` indicate general-purpose work; these are not a fallback for unclassified tasks — use the rubric first.

## References

- `kit/task-agent-rubric.md`
