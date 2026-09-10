# Phase 2 (Single-Pass) · Step 5a — E2E Testing Plan

## Overview

- **Purpose**: Document test cases and provisioning requirements for external services before E2E testing begins.
- **Skill/Agent**: General-purpose agent
- **Trigger**: Step 4 (Converge) complete; zero gaps
- **Inputs**:
  - `docs/specs/spec.md`
  - Project architecture documentation (database, auth, external services)
- **Outputs**:
  - `docs/E2E-TESTS.md` — comprehensive test documentation mapping all acceptance criteria to test cases
- **Template**: `none`
- **Gate**: `hard` — user must review and approve the E2E testing plan before E2E testing begins

## Scope

### In Scope

- Mapping every acceptance criterion from `docs/specs/spec.md` to one or more test cases
- Documenting provisioning requirements for all external services (Supabase, Auth0, etc.)
- Documenting test data requirements, seed scripts, and troubleshooting guidance

### Out of Scope

- Running the E2E tests — that is Step 5b

### Scope Boundary

> E2E tests cannot run without provisioned external services. The plan must make this explicit before testing begins.

## Execution Rules

- Dispatch general-purpose agent to create `docs/E2E-TESTS.md`
- Map all acceptance criteria from `docs/specs/spec.md` to test cases
- For projects with external services, document provisioning requirements explicitly
- Reference `kit/guides/e2e-testing-plan.md` for Supabase provisioning workflow
- Present the completed plan to the user and wait for explicit approval before proceeding to Step 5b

## Artifact Rules

- **Artifact**: `docs/E2E-TESTS.md`
- All acceptance criteria mapped to test cases; provisioning requirements documented for all external services
- **Status / approval condition**: Hard gate — user reviews and approves before Step 5b begins

## Completion Criteria

The step is considered complete when:

- [ ] `docs/E2E-TESTS.md` exists with all acceptance criteria mapped to test cases
- [ ] Provisioning requirements documented for all external services
- [ ] Hard gate passed: user has reviewed and approved the plan

## Transition Rules

### Before Advancing

- All acceptance criteria mapped to test cases
- All external service provisioning requirements documented
- Hard gate passed — gate summary: *"E2E testing plan is ready — all acceptance criteria mapped to test cases. Review the plan and approve before E2E testing begins. This prevents running tests without a clear understanding of what's being tested and why."*

### Next Step

- **Default**: Step 5b — Code Review + E2E Testing
- **Optional skip**: No
- **User decision required**: Yes — hard gate approval required

### Transition Record

- **Record**: `docs/<project>/phase-2-session.md`
- **Values**: `complete`

## Exceptions / Special Cases

- For Supabase projects: follow the provisioning workflow in `kit/guides/e2e-testing-plan.md`
- Do not begin Step 5b until all external services are provisioned — E2E tests cannot run without them

## References

- `kit/guides/e2e-testing-plan.md`
- `docs/E2E-TESTS.md`
- `kit/gate-management.md`
