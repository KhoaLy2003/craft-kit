# Phase 1 · Step 7 — Constitution

## Overview

- **Purpose**: Establish the coding standards, architectural rules, and non-negotiable principles every agent follows in Phase 2.
- **Agent/Skill**: general-purpose agent (all project types; no specialist needed)
- **Model**: `fast`
- **Trigger**: `docs/architecture.md` exists and is `approved`.
- **Inputs**: `docs/architecture.md`; `docs/DESIGN.md`; `docs/roadmap.md`.
- **Outputs**: `docs/constitution.md` (or `CLAUDE.md` / `AGENTS.md` at the project root if the agent harness requires rules there; update downstream references accordingly).
- **Template**: `templates/07-constitution.md`
- **Gate**: `soft` — present the summary; set approval when the user accepts. If the user accepted defaults at the Step 6 gate, set `Status: approved` on writing and still show the summary.

## Scope

- **In**: concrete coding standards (naming, structure, module boundaries, forbidden patterns); architectural rules derived from `docs/architecture.md`; an Amendment Procedure; depth sized to the project.
- **Out**: personal workflow preferences that do not change code or architecture output; roadmap decisions; deployment procedures; aspirational principles.

> Every principle must be concrete enough to change at least one downstream plan, diff, or agent output. If deleting a rule would change none, delete the rule.

## Execution Rules

1. Read `docs/architecture.md`, `docs/DESIGN.md`, and `docs/roadmap.md` before drafting.
2. Use `templates/07-constitution.md` as the scaffold. Apply the test above to every principle; rewrite or remove any that fail.
3. Fill the Amendment Procedure with a real process. For a solo developer with ≤ 15 S/M features it can be one line ("update this file directly") and the constitution can be minimal (3–5 rules).
4. Write the file to disk, give the user its path, and present a short summary (principle count, the most consequential MUST rules).

## Artifact Rules

Place the file where the harness reads it automatically; prefer `docs/constitution.md`. Set `Status: approved` after the user accepts.

## Completion Criteria

- [ ] Every principle states at least one MUST rule in measurable terms and would change a real decision if removed.
- [ ] No personal workflow preferences.
- [ ] Amendment Procedure and versioning are filled in with an actionable process.
- [ ] File saved at the correct path with `Status: approved`.

Gate summary: *"The working rules for all Phase 2 code are set; every AI agent on this project will follow them. Does anything need to change before we start building?"*

## Transition Rules

Next: Step 8 — Scaffold.
