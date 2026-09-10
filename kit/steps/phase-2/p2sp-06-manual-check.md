# Phase 2 (Single-Pass) · Step 6 — Manual Check

## Overview

- **Purpose**: Human walkthrough of the complete product to verify all features work together as an integrated system.
- **Skill/Agent**: Human only — no agent or skill
- **Model**: none — human walkthrough only
- **Trigger**: Step 5b passes with no unresolved findings or failures
- **Inputs**:
  - Running application with all features live
- **Outputs**:
  - Human confirmation (no file output)
- **Template**: `none`
- **Gate**: `hard` — do not ship without explicit approval

## Scope

### In Scope

- Walking through the complete application as a real user — from first open (empty state) through every Must feature in natural usage order
- Noticing what feels wrong even if it passes every criterion
- Cross-feature interactions: things that work in isolation but feel wrong when combined, flows that the spec described correctly but that interact badly in practice

### Out of Scope

- Checklist execution — this is a product walkthrough, not a checklist run
- Agent participation — human only

### Scope Boundary

> If anything is found: fix it, re-run the affected E2E flow in Step 5b, then return here. Do not ship with known issues.

## Execution Rules

- No agent or skill is dispatched for this step — human only
- Walk through the complete application as a real user: from first open (empty state) through every Must feature in natural usage order
- Use the app the way its target user would; notice what feels wrong even if it passes every criterion
- Focus on cross-feature interactions as the primary target
- If any issue is found: fix it, re-run the affected E2E flow in Step 5b, then return to this step

## Artifact Rules

- **Artifact**: `none`
- **Status / approval condition**: Hard gate — human explicitly approves before Step 7 begins

## Completion Criteria

The step is considered complete when:

- [ ] Complete product walkthrough performed by the human
- [ ] All issues found fixed (with affected E2E flows re-run in Step 5b)
- [ ] Hard gate passed: human explicitly approves

## Transition Rules

### Before Advancing

- All issues discovered during walkthrough fixed and re-verified via Step 5b
- Hard gate passed — gate summary: *"All features are implemented, reviewed, and E2E tested. Please walk through the complete app as a real user — this is the last check before the code ships."*

### Next Step

- **Default**: Step 7 — Ship
- **Optional skip**: No
- **User decision required**: Yes — hard gate approval required

### Transition Record

- **Record**: `docs/<project>/phase-2-session.md`
- **Values**: `complete`

## Exceptions / Special Cases

- If an issue is found: fix it, re-run the affected E2E flow in Step 5b, then return to this step — do not ship with known issues

## References

- `kit/gate-management.md`
