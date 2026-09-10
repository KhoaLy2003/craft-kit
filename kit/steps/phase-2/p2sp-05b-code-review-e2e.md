# Phase 2 (Single-Pass) · Step 5b — Code Review + E2E Testing

## Overview

- **Purpose**: Review all code for quality and compliance, then test complete cross-feature user flows in the running application.
- **Skill/Agent**: `code-reviewer` agent; `ui-ux-tester` (UI flows); general-purpose agent (non-UI flows)
- **Trigger**: Step 5a (E2E Testing Plan) approved by user
- **Inputs**:
  - Full branch diff
  - `docs/specs/spec.md`
  - `docs/constitution.md`
  - Running application
- **Outputs**:
  - All review findings fixed; all acceptance criteria verified against the running app
- **Template**: `none`
- **Gate**: `none` — runs to completion; every finding and every failing criterion is fixed before advancing

## Scope

### In Scope

- Code review of the entire branch diff — all features, all files — against the spec and constitution in one pass
- Fixing all code review findings before E2E begins
- E2E testing: walking through the complete user flow as a real user would — not feature by feature, but as a finished product
- Exercising every acceptance criterion across all features in `docs/specs/spec.md`
- Testing cross-feature interactions exhaustively
- Testing each repeated interaction pattern (modal behavior, form validation, navigation) once — not once per feature

### Out of Scope

- Starting E2E before all code review findings are fixed

### Scope Boundary

> All code review findings must be fixed before E2E begins. Do not run E2E against code with known review findings open.

## Execution Rules

- Dispatch `code-reviewer` first; it reviews the entire branch diff against spec and constitution in one pass
- Fix all `code-reviewer` findings before dispatching E2E agents
- E2E: start the real running application and walk through the complete user flow as a real user would
- Every acceptance criterion across all features in `docs/specs/spec.md` must be exercised
- Pay particular attention to cross-feature interactions — features that work in isolation but break when combined; these are the failure mode most specific to single-pass development
- Use `ui-ux-tester` for browser-driven UI verification; use general-purpose agent for storage, data integrity, and non-UI flows (e.g. export file format, localStorage error handling)
- `ui-ux-tester` is performing UI interaction verification, not implementation judgment — a lighter/faster model is appropriate

## Artifact Rules

- **Artifact**: `none` (findings and fixes land in the branch; E2E results noted in session log)
- **Status / approval condition**: `none` — no user approval required; all findings must be fixed before advancing

## Completion Criteria

The step is considered complete when:

- [ ] All `code-reviewer` findings fixed
- [ ] Every acceptance criterion in `docs/specs/spec.md` exercised in the running application
- [ ] All failing criteria fixed and re-verified
- [ ] Cross-feature interactions tested

## Transition Rules

### Before Advancing

- Zero open code review findings
- All acceptance criteria verified in the running application
- All E2E failures fixed and re-verified

### Next Step

- **Default**: Step 6 — Manual Check
- **Optional skip**: No
- **User decision required**: No

### Transition Record

- **Record**: `docs/<project>/phase-2-session.md`
- **Values**: `complete`

## Exceptions / Special Cases

- For shared interaction patterns (modal behavior, form validation, navigation) that repeat across features, test each pattern once — not once per feature
- `ui-ux-tester` should use a lighter/faster model since it is performing interaction verification, not implementation judgment

## References

- `code-reviewer` agent
- `ui-ux-tester` agent
- `docs/E2E-TESTS.md`
- `docs/specs/spec.md`
- `docs/constitution.md`
