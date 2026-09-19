# Phase 2 (Single-Pass) · Step 2 — Plan

## Overview

- **Purpose**: Create an ordered implementation plan for all features with dependency-driven task sequencing and a dominant specialist identified.
- **Skill/Agent**: `writing-plans` skill
- **Model**: `capable`
- **Trigger**: `docs/specs/spec.md` approved (Step 1 gate passed)
- **Inputs**:
  - `docs/specs/spec.md`
  - `docs/architecture.md`
  - `docs/constitution.md`
  - `kit/task-agent-rubric.md`
- **Outputs**:
  - `docs/specs/plan.md` — full implementation plan, all tasks, dependency order
- **Template**: `none`
- **Gate**: `hard` — the plan covers all features; a wrong assumption here propagates into every task downstream

## Scope

### In Scope

- Sequencing tasks by the roadmap's build order (dependency-driven), not MoSCoW priority
- Identifying the dominant specialist: the single agent type that handles ≥80% of tasks
- Annotating every task in `plan.md` with a `Specialist:` field using `kit/task-agent-rubric.md`
- Flagging minority out-of-domain tasks (those not assigned to the dominant specialist) so Step 3 can delegate them explicitly
- Validating the plan against `docs/architecture.md` and `docs/constitution.md`
- Interleaving tasks from different features where dependencies require it

### Out of Scope

- Switching tracks at this step — if minority tasks exceed ~20% of total task count, raise this during the gate and switch to `phase-2-feature-dev.md`

### Scope Boundary

> If the identified dominant specialist reveals this project genuinely spans two domains at roughly equal weight (neither reaches ≥80%), this project is not a good fit for the single-pass track. Switch to `phase-2-feature-dev.md` at this point.

## Execution Rules

- Run the `writing-plans` skill with all Must features from `docs/specs/spec.md`
- Sequence tasks by dependency-driven build order, not MoSCoW priority — a data-layer task from an early feature comes before a UI task from a later feature if the UI depends on the data layer
- Annotate every task with a `Specialist:` line using `kit/task-agent-rubric.md`. Example:
  ```markdown
  ### Task 2: Build login form component
  **Specialist:** frontend-developer
  - Files: Create: src/components/LoginForm.tsx
  ```
- Identify the dominant specialist: the agent type annotated on ≥80% of tasks
- Flag minority tasks — those assigned to a different specialist — in a dedicated **Minority Tasks** section at the end of `plan.md`, listing each task number, its specialist, and its dependency position
- If minority tasks exceed ~20% of total task count, do not force a dominant specialist — raise this at the hard gate and recommend switching to `phase-2-feature-dev.md`
- Validate the plan against `docs/architecture.md` and `docs/constitution.md` before finalizing
- Present a summary of the plan (task count, files created/modified, key interfaces, dominant specialist, minority task list) and wait for explicit user approval before dispatching Step 3
- The user may request changes to any task before approving

## Artifact Rules

- **Artifact**: `docs/specs/plan.md`
- All tasks in dependency order across all features; every task annotated with `Specialist:`; dominant specialist declared at the top
- A **Minority Tasks** section lists any tasks not assigned to the dominant specialist
- **Status / approval condition**: Hard gate — user reviews plan summary and approves explicitly before Step 3 begins

## Completion Criteria

- [ ] `docs/specs/plan.md` exists with all features' tasks in dependency order
- [ ] Every task has a `Specialist:` annotation
- [ ] Dominant specialist declared (the agent annotated on ≥80% of tasks)
- [ ] Minority tasks identified and listed in a **Minority Tasks** section (may be empty)
- [ ] Minority task count ≤ ~20% of total task count, or gate raises a track-switch recommendation
- [ ] Plan validated against `docs/architecture.md` and `docs/constitution.md`
- [ ] Hard gate passed: user has reviewed and approved the plan

## Transition Rules

### Before Advancing

- Plan summary presented: task count, files created/modified, key interfaces, dominant specialist, minority task list
- Hard gate passed — gate summary: *"The implementation plan is ready. Review the task summary above — once approved, implementation begins and covers all features in one pass."*

### Next Step

- **Default**: Step 3 — Implement
- **Optional skip**: No
- **User decision required**: Yes — hard gate approval required

### Transition Record

- **Record**: `docs/<project>/phase-2-session.md`
- **Values**: `complete`

## Exceptions / Special Cases

- If tasks genuinely split across two domains at roughly equal weight, the project is not a good fit for single-pass — switch to `phase-2-feature-dev.md` rather than forcing a dominant specialist

## References

- `writing-plans` skill
- `kit/task-agent-rubric.md`
- `kit/gate-management.md`
- `phase-2-feature-dev.md` (fallback if domain split detected)
