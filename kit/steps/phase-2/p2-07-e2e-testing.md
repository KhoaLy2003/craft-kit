# Phase 2 · Step 7 — E2E Testing

## Overview

- **Purpose**: Test the complete user flow in a running application with real data and real scenarios.
- **Skill/Agent**: `ui-ux-tester` (browser-driven UI verification) + general-purpose agent (backend/API/data-flow testing)
- **Trigger**: Step 6 complete with all issues resolved
- **Inputs**:
  - Running application (started fresh for this test run)
  - `docs/specs/<feature-slug>/spec.md` (acceptance criteria)
  - Real data scenarios
- **Outputs**:
  - Test results; any failure triggers an immediate fix loop and re-run of this step before advancing
- **Gate**: `soft`

## Scope

### In Scope

- Full end-to-end test of the real, running application with real data
- Every acceptance criterion in the spec
- The complete user flow from start to finish
- Browser-driven UI verification via `ui-ux-tester`
- Backend, API, data integrity, error handling, and non-UI criteria via general-purpose agent

### Out of Scope

- Unit tests or mocked data
- Happy-path shortcuts — the test follows the same path a real user would take
- Carrying failures forward — any failure is fixed here before advancing

### Scope Boundary

> Test shared interaction patterns (modal behavior, form validation, navigation) once per pattern — not once per acceptance criterion. Repeated identical flows add time without additional coverage.

## Execution Rules

- Start the actual application fresh for this test run. Not unit tests. Not mocked data.
- Walk through the complete user flow from start to finish using real data and a real process.
- Cover every acceptance criterion in the spec.
- Test shared interaction patterns once per pattern — not once per acceptance criterion.
- Any failure found here is fixed immediately, and this step re-runs in full — do not carry failures forward to the manual check.
- Use `ui-ux-tester` for browser-driven UI verification.
- Use general-purpose agent for backend/API/data-flow testing (data integrity, error handling, non-UI acceptance criteria).
- **Model for `ui-ux-tester`:** this agent is performing UI interaction verification, not implementation judgment — a lighter/faster model is appropriate.

## Artifact Rules

- **Artifact**: none (test results are in-session output; failures are fixed inline on the branch)
- **Status / approval condition**: Soft gate — surface test pass confirmation before advancing to Step 8.

## Completion Criteria

The step is considered complete when:

- [ ] The application has been started fresh and tested end-to-end with real data
- [ ] Every acceptance criterion in the spec has been exercised
- [ ] No unresolved failures remain
- [ ] The step has re-run in full after any failure was fixed

## Transition Rules

### Before Advancing

- No unresolved failures may remain.
- If a failure was found and fixed, this step must re-run in full before advancing.
- Soft gate: confirm the test pass to the user before moving to Step 8.

### Next Step

- **Default**: Step 8 — Manual Double Check
- **Optional skip**: No
- **User decision required**: No (soft gate is visibility only)

### Transition Record

- **Record**: session log (per `kit/session-logging.md`)
- **Values**: `complete`

## Exceptions / Special Cases

- If a failure fix changes code that was already reviewed in Step 6, re-run code review on those specific changes before advancing to Step 8.

## References

- `ui-ux-tester` agent
- `docs/specs/<feature-slug>/spec.md`
