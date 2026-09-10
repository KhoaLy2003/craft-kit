# Phase 2 · Step 6 — Code Review

## Overview

- **Purpose**: Review code quality, security, and compliance with architecture and constitutional rules.
- **Skill/Agent**: `code-reviewer` agent
- **Trigger**: Step 5 converged (gap list empty); feature branch ready
- **Inputs**:
  - Full diff of the feature branch against base
  - `docs/specs/<feature-slug>/spec.md`
  - `docs/constitution.md`
- **Outputs**:
  - Review findings; all issues fixed directly on the branch before advancing
- **Gate**: `none` — code review runs to completion; every finding is fixed immediately; there are no deferred findings at this stage

## Scope

### In Scope

- Code quality, security vulnerabilities, and architectural compliance
- Explicit callout of any disagreement with `docs/constitution.md`
- Documenting any spec gap the review reveals before advancing

### Out of Scope

- Spec coverage — that was Step 5
- E2E behavior — that is Step 7
- Deferring any finding to a later step

### Scope Boundary

> Every finding from code review is fixed before advancing. There are no deferred findings at this stage.

## Execution Rules

- Dispatch the `code-reviewer` agent with the branch diff, spec, and constitution all as input.
- Any finding — critical, important, or minor — is fixed in this step. Do not advance to E2E testing with known open issues.
- Architectural disagreements with `docs/constitution.md` must be called out explicitly, not silently fixed.
- If this step's review reveals a spec gap (something the spec did not cover but the implementation made a decision about), document the decision in the spec before advancing.

## Artifact Rules

- **Artifact**: none (findings are fixed inline on the branch; no separate review document required)
- If a spec gap is discovered, update `docs/specs/<feature-slug>/spec.md` to document the implementation decision before advancing.
- **Status / approval condition**: `none` — no gate; advance once all findings are fixed.

## Completion Criteria

The step is considered complete when:

- [ ] The `code-reviewer` agent has reviewed the full branch diff
- [ ] Every finding has been fixed on the branch
- [ ] Any architectural disagreement with `docs/constitution.md` has been explicitly called out (and resolved)
- [ ] Any spec gap discovered has been documented in `spec.md`

## Transition Rules

### Before Advancing

- All findings must be fixed. No finding may be deferred.
- Any spec gaps discovered here must be recorded in `spec.md`.

### Next Step

- **Default**: Step 7 — E2E Testing
- **Optional skip**: No
- **User decision required**: No

### Transition Record

- **Record**: session log (per `kit/session-logging.md`)
- **Values**: `complete`

## Exceptions / Special Cases

- If fixing a finding reveals a new gap in the spec, document it in `spec.md` and assess whether it creates a new GAP in the Converge sense — if so, loop back through Step 5 before advancing.

## References

- `code-reviewer` agent
- `docs/constitution.md`
