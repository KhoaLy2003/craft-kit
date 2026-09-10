# Phase 2 · Step 5 — Converge

## Overview

- **Purpose**: Verify the implementation covers every acceptance criterion; identify gaps and implement them.
- **Skill/Agent**: general-purpose agent
- **Trigger**: All tasks in `plan.md` complete; feature branch ready
- **Inputs**:
  - `docs/specs/<feature-slug>/spec.md` (acceptance criteria list)
  - Full branch diff
- **Outputs**:
  - Convergence report — COVERED / GAP per acceptance criterion; empty gap list = converged
- **Gate**: `none` — loops until the gap list is empty; only then advances to Step 6

## Scope

### In Scope

- Checking every acceptance criterion in `spec.md` against evidence in the branch diff
- Marking each criterion COVERED or GAP
- Dispatching gap tasks and re-running until the gap list is empty
- Logging "Converged" in the session log when the gap list reaches zero

### Out of Scope

- Code quality, security, or style — that is Step 6
- Correctness verification — COVERED means an attempt was made, not that the implementation is correct
- E2E behavior — that is Step 7

### Scope Boundary

> Converge asks exactly one question per criterion: *does the implementation attempt this criterion?* It does not evaluate whether the attempt is correct.

## Execution Rules

- For each acceptance criterion in `spec.md`: find evidence in the branch diff (functions, tests, UI components, validation logic). Mark COVERED if evidence exists; GAP if none is found.
- Any GAP becomes an implementation task appended to `plan.md`. Dispatch the implementer for those gap tasks only. Re-run Converge. Repeat until the gap list is empty.
- Common gap sources: edge cases specified but not handled, error states documented but not coded, validation rules in spec but absent from implementation.
- When the gap list is empty, note "Converged" in the session log and proceed.

## Artifact Rules

- **Artifact**: none (convergence report is an in-session output, not a persisted file)
- Gap tasks are appended to `plan.md` for traceability.
- **Status / approval condition**: `none` — no gate; the loop drives itself until the gap list is empty.

## Completion Criteria

The step is considered complete when:

- [ ] Every acceptance criterion in `spec.md` has been marked COVERED or GAP
- [ ] The gap list is empty (all GAPs have been implemented and re-checked)
- [ ] "Converged" has been noted in the session log

## Transition Rules

### Before Advancing

- The gap list must be empty. A non-empty gap list means this step loops — dispatch gap tasks, then re-run Converge.
- No gate — advance immediately once converged.

### Next Step

- **Default**: Step 6 — Code Review
- **Optional skip**: No
- **User decision required**: No

### Transition Record

- **Record**: session log (per `kit/session-logging.md`)
- **Values**: `complete`

## Exceptions / Special Cases

- A COVERED criterion is not a guarantee of correctness — only that an attempt was made. Correctness is verified by code review (Step 6) and E2E (Step 7).
- If a GAP task introduces new coverage that affects previously COVERED criteria, re-check those criteria.

## References

- `docs/specs/<feature-slug>/spec.md`
