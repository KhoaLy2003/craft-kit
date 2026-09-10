# Phase 2 · Step 1 — Brainstorm & Spec

## Overview

- **Purpose**: Write detailed acceptance criteria and edge cases for the feature; resolve ambiguity before implementation begins.
- **Skill/Agent**: `brainstorming` skill
- **Model**: `opus`
- **Trigger**: Orchestrator selects the next `pending` feature from `docs/roadmap.md`
- **Inputs**:
  - `docs/roadmap.md` (feature entry)
  - `docs/constitution.md`
  - `docs/architecture.md`
  - `docs/DESIGN.md`
- **Outputs**:
  - `docs/specs/<feature-slug>/spec.md` — acceptance criteria, edge cases, UI behavior, non-goals, open questions resolved
- **Gate**: `hard` — the `brainstorming` skill has a built-in user approval gate on the written spec; the orchestrator does not advance until the user explicitly approves

## Scope

### In Scope

- Clarifying questions to resolve feature ambiguity
- Proposed approaches and design sections
- Acceptance criteria, edge cases, UI behavior, and non-goals for the single selected feature
- Compliance check against `docs/constitution.md`
- User review and explicit approval of the written spec

### Out of Scope

- Implementation planning — that is Step 2
- Technical or architectural decisions — the spec describes behavior, not implementation
- Batching multiple features together — one spec per feature cycle

### Scope Boundary

> The spec covers exactly one feature from the roadmap entry. If brainstorming reveals the feature is larger than estimated, flag this and re-agree scope before proceeding — do not silently expand.

## Execution Rules

- Invoke the `brainstorming` skill. It handles the full loop: clarifying questions → proposed approaches → design sections → written spec → user review.
- The spec must check compliance against `docs/constitution.md` before it is presented to the user.
- Do not invoke `writing-plans` from inside this skill — that is the next step.
- The orchestrator does not advance until the user explicitly approves the spec.

## Artifact Rules

- **Artifact**: `docs/specs/<feature-slug>/spec.md`
- The skill writes the spec as its terminal output. Do not create it manually outside the skill.
- **Status / approval condition**: The hard gate requires explicit user approval of the spec before the orchestrator advances.

## Completion Criteria

The step is considered complete when:

- [ ] `docs/specs/<feature-slug>/spec.md` exists and contains acceptance criteria, edge cases, UI behavior, non-goals, and resolved open questions
- [ ] The spec is scoped to a single feature
- [ ] The spec has been checked against `docs/constitution.md`
- [ ] The user has explicitly approved the spec

## Transition Rules

### Before Advancing

- The user must have explicitly approved the written spec.
- Gate summary: *"The spec for [feature name] is done — acceptance criteria, edge cases, and non-goals are defined. Does this correctly describe the feature as you want it built?"*

### Next Step

- **Default**: Step 2 — Plan
- **Optional skip**: No
- **User decision required**: Yes — explicit approval required at the hard gate

### Transition Record

- **Record**: session log (per `kit/session-logging.md`)
- **Values**: `complete`

## Exceptions / Special Cases

- If brainstorming reveals the feature is larger than the roadmap estimate, halt and re-agree scope with the user before writing the spec. Do not silently expand scope.

## References

- `brainstorming` skill
- `docs/constitution.md`
- `docs/architecture.md`
- `docs/DESIGN.md`
