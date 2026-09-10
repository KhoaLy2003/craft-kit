# Phase 2 (Single-Pass) · Step 2 — Plan

## Overview

- **Purpose**: Create an ordered implementation plan for all features with dependency-driven task sequencing and a dominant specialist identified.
- **Skill/Agent**: `writing-plans` skill
- **Trigger**: `docs/specs/spec.md` approved (Step 1 gate passed)
- **Inputs**:
  - `docs/specs/spec.md`
  - `docs/architecture.md`
  - `docs/constitution.md`
- **Outputs**:
  - `docs/specs/plan.md` — full implementation plan, all tasks, dependency order
- **Template**: `none`
- **Gate**: `hard` — the plan covers all features; a wrong assumption here propagates into every task downstream

## Scope

### In Scope

- Sequencing tasks by the roadmap's build order (dependency-driven), not MoSCoW priority
- Identifying the dominant specialist: the single agent type that handles the majority of tasks
- Validating the plan against `docs/architecture.md` and `docs/constitution.md`
- Interleaving tasks from different features where dependencies require it

### Out of Scope

- Specialist routing steps — there is no per-task specialist routing in single-pass; one specialist implements everything in Step 3
- Switching tracks at this step — if tasks genuinely split across two domains, raise this during the gate and switch to `phase-2-feature-dev.md`

### Scope Boundary

> If the identified dominant specialist reveals this project genuinely spans two domains (e.g. frontend + backend at roughly equal weight), this project is not a good fit for the single-pass track. Switch to `phase-2-feature-dev.md` at this point.

## Execution Rules

- Run the `writing-plans` skill with all Must features from `docs/specs/spec.md`
- Sequence tasks by dependency-driven build order, not MoSCoW priority — a data-layer task from an early feature comes before a UI task from a later feature if the UI depends on the data layer
- Identify the dominant specialist: the single agent type handling the majority of tasks
- Validate the plan against `docs/architecture.md` and `docs/constitution.md` before finalizing
- Present a summary of the plan (task count, files created/modified, key interfaces, dominant specialist) and wait for explicit user approval before dispatching Step 3
- The user may request changes to any task before approving

## Artifact Rules

- **Artifact**: `docs/specs/plan.md`
- All tasks in dependency order across all features; dominant specialist clearly identified
- **Status / approval condition**: Hard gate — user reviews plan summary and approves explicitly before Step 3 begins

## Completion Criteria

The step is considered complete when:

- [ ] `docs/specs/plan.md` exists with all features' tasks in dependency order
- [ ] Dominant specialist identified
- [ ] Plan validated against `docs/architecture.md` and `docs/constitution.md`
- [ ] Hard gate passed: user has reviewed and approved the plan

## Transition Rules

### Before Advancing

- Plan summary presented: task count, files created/modified, key interfaces, dominant specialist
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
- `kit/gate-management.md`
- `phase-2-feature-dev.md` (fallback if domain split detected)
