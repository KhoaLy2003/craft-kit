# Phase 1 · Step 7 — Constitution / AI Working Guideline

## Overview

- **Purpose**: Establish coding standards, architectural rules, and non-negotiable principles that every AI agent and contributor must follow throughout the project.
- **Agent/Skill**: `general-purpose agent`
- **Trigger**: `docs/architecture.md` exists and is `approved`.
- **Inputs**:
  - `docs/architecture.md`
  - `docs/DESIGN.md`
  - `docs/roadmap.md`
- **Outputs**:
  - `docs/constitution.md` (or `CLAUDE.md` / `AGENTS.md` at project root if required by the agent harness)
- **Template**: `templates/08-constitution.md`
- **Gate**: `hard` — every Phase 2 step runs under this document's authority.

## Scope

### In Scope

- Defining concrete coding standards that directly shape code output (naming conventions, file structure, module boundaries, forbidden patterns).
- Defining architectural rules derived from `docs/architecture.md` (layer boundaries, data flow constraints, dependency direction).
- Establishing an Amendment Procedure so the document can be updated without requiring a full project restart.
- Tailoring the length and depth of the constitution to project size (minimal for solo/small projects, comprehensive for team projects).

### Out of Scope

- Personal workflow preferences that do not change code or architecture output.
- Feature planning or roadmap decisions (handled in Step 4 — Roadmap).
- Deployment or operations procedures (handled in Phase 2 or later).
- Vague aspirational principles that would not alter any plan or diff if removed.

### Scope Boundary

> Every principle written into this document must be concrete enough to change at least one downstream decision. If removing a rule would not alter a plan, a diff, or an agent's output, the rule does not belong here. Stop and verify each principle against this test before marking the step complete.

## Execution Rules

1. Read `docs/architecture.md`, `docs/DESIGN.md`, and `docs/roadmap.md` before drafting any rules.
2. Open `templates/08-constitution.md` and use it as the structural scaffold for the output document.
3. For each principle drafted, apply the concrete-enough test: would removing this rule change at least one downstream decision, plan, or diff? If not, remove or rewrite the principle until it does.
4. Fill in the Amendment Procedure section — a constitution without a change process becomes a frozen document that no one can update. Even a one-line procedure ("update this file directly") is sufficient for solo projects.
5. Do not include personal workflow preferences. This document contains only rules that shape code and architecture output.
6. Route to the general-purpose agent for all project types. No specialist agent is required for this step.

## Artifact Rules

- **Artifact**: `docs/constitution.md` (or `CLAUDE.md` / `AGENTS.md` at project root if the agent harness requires it)
- Place the output at the location the agent harness will read automatically; prefer `docs/constitution.md` unless the harness explicitly requires a root-level file.
- The Amendment Procedure section must be present and filled in with a real process — do not leave it blank or templated.
- **Status / approval condition**: Set `Status: approved` after the user reviews and confirms the working rules. The gate does not open until this status is set.

## Completion Criteria

The step is considered complete when:

- [ ] Every principle in the document is concrete enough to change at least one downstream decision.
- [ ] No personal workflow preferences are included — only rules that shape code and architecture.
- [ ] The Amendment Procedure section is filled in with a real, actionable process.
- [ ] The output file is saved at the correct path (`docs/constitution.md` or the harness-required location).
- [ ] `Status: approved` is set in the document after user review.

## Transition Rules

### Before Advancing

- The constitution file exists at the expected path and has `Status: approved`.
- All principles pass the concrete-enough test — no vague or aspirational rules remain.
- The Amendment Procedure is filled in.
- Gate summary: *"The working rules for all Phase 2 code are set. Every AI agent on this project will follow these principles. Does anything need to change before we start building?"*

### Next Step

- **Default**: Step 8 — Scaffold and Convention Setup
- **Optional skip**: No
- **User decision required**: Yes — user must confirm the constitution before the hard gate opens

### Transition Record

- **Record**: `docs/<project>/phase-1-session.md`
- **Values**: `complete` / `skipped`

## Exceptions / Special Cases

- **Solo / single-pass projects (solo developer, ≤ 15 S/M features):** The constitution can be minimal — 3–5 concrete rules rather than a comprehensive governance document. The Amendment Procedure can be as simple as "update this file directly; no approval process needed for a solo project." All Phase 2 references to `docs/constitution.md` still apply regardless of document length.
- **Agent harness override:** If the project's AI agent harness (e.g. Claude, Cursor, Continue) requires rules to live in `CLAUDE.md` or `AGENTS.md` at the project root rather than `docs/constitution.md`, place the file there. Update all downstream references accordingly.

## References

- `templates/08-constitution.md`
- `docs/architecture.md`
- `docs/DESIGN.md`
- `docs/roadmap.md`
