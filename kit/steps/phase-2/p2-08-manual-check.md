# Phase 2 · Step 8 — Manual Double Check

## Overview

- **Purpose**: Human walkthrough of the feature to catch anything automated tests may have missed.
- **Skill/Agent**: Human only — no agent is dispatched
- **Model**: none — human walkthrough only
- **Trigger**: Step 7 passes with no unresolved failures
- **Inputs**:
  - Running application
- **Outputs**:
  - Human confirmation (no file output)
- **Gate**: `hard` — orchestrator must not proceed without explicit approval

## Scope

### In Scope

- One full walkthrough of the feature in the running application
- Anything the acceptance criteria did not anticipate

### Out of Scope

- Automated tooling — this step is human-only
- Re-running acceptance criteria already verified in Step 7 — this is an independent check, not a repeat

### Scope Boundary

> This step is independent of the E2E pass. Its purpose is to catch what criteria did not anticipate, not to re-verify what criteria already cover.

## Execution Rules

- The orchestrator presents the gate summary and waits for explicit human approval.
- If anything is found: fix it, re-run Step 7 in full, then return to this step.
- Do not advance to Step 9 without explicit human approval at this gate.

## Artifact Rules

- **Artifact**: none
- **Status / approval condition**: Hard gate — explicit human approval is required. The orchestrator must not self-approve.

## Completion Criteria

The step is considered complete when:

- [ ] A human has walked through the feature in the running application
- [ ] No issues were found, OR all issues found have been fixed and Step 7 has re-run
- [ ] The human has explicitly approved advancement to Step 9

## Transition Rules

### Before Advancing

- Explicit human approval is required.
- Gate summary: *"E2E testing passed and the feature is complete. Please walk through it yourself in the running app — this is the last check before the code ships."*

### Next Step

- **Default**: Step 9 — Ship
- **Optional skip**: No
- **User decision required**: Yes — explicit approval required at the hard gate

### Transition Record

- **Record**: session log (per `kit/session-logging.md`)
- **Values**: `complete`

## Exceptions / Special Cases

- If the human finds an issue: fix it on the branch, re-run Step 7, then return to this step for a fresh walkthrough. Do not skip the re-run of Step 7.

## References

- `kit/gate-management.md`
