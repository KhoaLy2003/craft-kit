# Phase 2 (Single-Pass) · Step 4 — Converge

## Overview

- **Purpose**: Verify the implementation covers all acceptance criteria across all features. Identify gaps and implement them.
- **Skill/Agent**: General-purpose agent (spec-coverage analysis)
- **Model**: `sonnet`
- **Trigger**: All implementation tasks complete; feature branch ready (Step 3 complete)
- **Inputs**:
  - `docs/specs/spec.md` — all features' acceptance criteria
  - Full branch diff
- **Outputs**:
  - Convergence report — COVERED / GAP per acceptance criterion across all features; empty gap list = converged
- **Template**: `none`
- **Gate**: `none` — loops until the gap list is empty; only then advances to Step 5

## Scope

### In Scope

- Checking whether the implementation attempts every acceptance criterion across every feature in the spec
- Finding evidence in the branch diff for each criterion: marking COVERED if evidence exists; marking GAP if none
- Appending any GAP as an implementation task to `docs/specs/plan.md` and dispatching the implementer
- Repeating until the gap list is empty

### Out of Scope

- Code quality judgment — that is Step 5b (code review)
- Correctness verification — a COVERED criterion is not a guarantee of correctness; correctness is verified in Step 5

### Scope Boundary

> Converge is distinct from code review. It asks only: does the implementation attempt every acceptance criterion across every feature in the spec? Not whether the code is well-written.

## Execution Rules

- For each acceptance criterion in each feature section of `docs/specs/spec.md`: find evidence in the branch diff
- Mark COVERED if evidence exists; mark GAP if none is found
- Any GAP becomes an implementation task appended to `docs/specs/plan.md`
- Dispatch the implementer for gap tasks, then re-run Converge
- Repeat until the gap list is empty
- When the gap list is empty, note "Converged" in the session log and proceed to Step 5

## Artifact Rules

- **Artifact**: `none` (convergence result recorded in session log)
- **Status / approval condition**: `none` — no user approval required; gate is internal (empty gap list)

## Completion Criteria

The step is considered complete when:

- [ ] Every acceptance criterion in `docs/specs/spec.md` marked COVERED
- [ ] Gap list is empty
- [ ] "Converged" noted in the session log

## Transition Rules

### Before Advancing

- Gap list confirmed empty
- All gap tasks implemented and re-checked

### Next Step

- **Default**: Step 5a — E2E Testing Plan
- **Optional skip**: No
- **User decision required**: No

### Transition Record

- **Record**: `docs/<project>/phase-2-session.md`
- **Values**: `complete`

## Exceptions / Special Cases

- Common gap sources: edge cases specified but not handled, error states documented but not coded, cross-feature interactions specified in the spec but not wired in the implementation
- A COVERED criterion is not a guarantee of correctness — only that an attempt was made; correctness is verified in Step 5

## References

- `docs/specs/spec.md`
- `docs/specs/plan.md`
