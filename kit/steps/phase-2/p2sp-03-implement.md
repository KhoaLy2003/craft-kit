# Phase 2 (Single-Pass) · Step 3 — Implement

## Overview

- **Purpose**: Code all features in one pass using a single dominant specialist agent.
- **Skill/Agent**: Dominant specialist identified in Step 2
- **Trigger**: `docs/specs/plan.md` finalised (Step 2 gate passed)
- **Inputs**:
  - `docs/specs/plan.md`
  - `docs/specs/spec.md`
  - `docs/constitution.md`
- **Outputs**:
  - All feature code on a single branch (`feature/<project-slug>`)
- **Template**: `none`
- **Gate**: `soft` — review progress at the midpoint (after roughly half the tasks) if working in an unfamiliar pattern

## Scope

### In Scope

- One agent implementing all tasks in plan order using `subagent-driven-development`
- All changes accumulating on the feature branch

### Out of Scope

- Per-task specialist routing — no specialist switching during implementation
- Per-task reviewer — code review happens in Step 5b
- Commits during implementation — all changes accumulate until Step 6 approval

### Scope Boundary

> Implementation MUST NOT begin on `main`. If no git repo exists, that is a Phase 1 gap — stop and resolve it before proceeding. If a foundational task (early in build order) fails or reveals blocking complexity that invalidates later tasks, stop and re-evaluate scope.

## Execution Rules

- Before dispatching the agent: the orchestrator MUST create and switch to a feature branch (`git checkout -b feature/<project-slug>`) if it does not already exist; include the branch name in the step banner
- Dispatch the dominant specialist using `subagent-driven-development` to implement all tasks in plan order
- No per-task specialist routing; no per-task reviewer
- No commits during implementation — all changes accumulate on the feature branch until Step 6 approval
- If a task reveals a spec gap or contradiction, pause and update `docs/specs/spec.md` before continuing — do not guess and proceed
- If a foundational task fails or reveals blocking complexity that invalidates later tasks, stop and re-evaluate scope
- After every completed task, check the work against `docs/constitution.md` before moving to the next — violations caught here are cheaper than at code review

## Artifact Rules

- **Artifact**: All feature code on `feature/<project-slug>` branch
- No commits until Step 6 approval; branch name included in the step banner
- **Status / approval condition**: Soft gate — midpoint check if working in an unfamiliar pattern; not a required user approval

## Completion Criteria

The step is considered complete when:

- [ ] All tasks in `docs/specs/plan.md` implemented
- [ ] All changes on the feature branch (not `main`)
- [ ] Every completed task checked against `docs/constitution.md`
- [ ] No spec gaps or contradictions left unresolved

## Transition Rules

### Before Advancing

- All plan tasks complete with no unresolved spec gaps
- Feature branch exists with all changes accumulated (no commits)
- Soft gate (if triggered): midpoint check passed

### Next Step

- **Default**: Step 4 — Converge
- **Optional skip**: No
- **User decision required**: No (soft gate only if unfamiliar pattern)

### Transition Record

- **Record**: `docs/<project>/phase-2-session.md`
- **Values**: `complete`

## Exceptions / Special Cases

- If a spec gap or contradiction is found mid-implementation, pause, update `docs/specs/spec.md`, and resume — never guess and proceed
- If a foundational task fails and invalidates later tasks, stop the cycle and re-evaluate; proceeding past a broken foundation wastes every subsequent task

## References

- `subagent-driven-development` skill
- `docs/specs/plan.md`
- `docs/specs/spec.md`
- `docs/constitution.md`
- `kit/gate-management.md`
