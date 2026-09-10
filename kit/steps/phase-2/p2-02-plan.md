# Phase 2 · Step 2 — Plan

## Overview

- **Purpose**: Break the feature into ordered implementation tasks with exact files, interfaces, and test steps.
- **Skill/Agent**: `writing-plans` skill
- **Trigger**: `docs/specs/<feature-slug>/spec.md` exists and is approved (Step 1 gate passed)
- **Inputs**:
  - `docs/specs/<feature-slug>/spec.md`
  - `docs/architecture.md`
  - `docs/constitution.md`
- **Outputs**:
  - `docs/specs/<feature-slug>/plan.md` — ordered implementation plan with concrete tasks; each task has exact files, interfaces, test steps, and implementation steps; no placeholders
- **Gate**: `soft` — present a plan summary before advancing; do not dispatch Step 3 silently

## Scope

### In Scope

- Breaking the approved spec into ordered, concrete implementation tasks
- Marking each task as parallel or sequential based on file scope
- Validating the plan against `docs/architecture.md` and `docs/constitution.md`
- Running the skill's self-review loop: placeholder scan, spec coverage, type consistency check

### Out of Scope

- Assigning specialist agents to tasks — that is Step 3
- Implementing any code — that is Step 4

### Scope Boundary

> The plan covers exactly the feature described in `spec.md`. No tasks may be added for adjacent features or infrastructure not required by this feature.

## Execution Rules

- Invoke the `writing-plans` skill with the spec, architecture doc, and constitution as inputs.
- The skill's self-review loop (placeholder scan, spec coverage, type consistency check) must complete before the plan is used in Step 3.
- Tasks must be explicitly marked parallel vs. sequential based on file scope — Step 3 uses this to decide dispatch strategy.
- After the plan is written, validate it against `docs/architecture.md` and `docs/constitution.md` before finalizing.

## Artifact Rules

- **Artifact**: `docs/specs/<feature-slug>/plan.md`
- Each task must have: exact files, interfaces, test steps, and implementation steps. No placeholder content.
- Parallel groups must be marked with `<!-- Parallel group -->` in the plan so Step 3 and Step 4 can identify them.
- **Status / approval condition**: Soft gate — present a summary (task count, files, key decisions, parallel groups identified) and give the user an opportunity to request changes before advancing. A soft gate is not a silent advance.

## Completion Criteria

The step is considered complete when:

- [ ] `docs/specs/<feature-slug>/plan.md` exists with all tasks defined
- [ ] Each task has exact files, interfaces, test steps, and implementation steps — no placeholders
- [ ] Tasks are marked parallel vs. sequential
- [ ] The plan has been validated against `docs/architecture.md` and `docs/constitution.md`
- [ ] The self-review loop has completed
- [ ] A summary has been presented to the user and any requested changes have been incorporated

## Transition Rules

### Before Advancing

- The self-review loop must have completed without unresolved issues.
- Present the plan summary to the user; wait for acknowledgement or change requests before advancing.
- Gate summary: present task count, files touched, key decisions, and parallel groups identified.

### Next Step

- **Default**: Step 3 — Assign Specialists
- **Optional skip**: No
- **User decision required**: Yes — soft gate requires visibility; user must have seen the summary

### Transition Record

- **Record**: session log (per `kit/session-logging.md`)
- **Values**: `complete`

## Exceptions / Special Cases

- If the user requests significant changes after seeing the plan summary, re-run the self-review loop on the revised plan before advancing.

## References

- `writing-plans` skill
- `docs/specs/<feature-slug>/spec.md`
- `docs/architecture.md`
- `docs/constitution.md`
