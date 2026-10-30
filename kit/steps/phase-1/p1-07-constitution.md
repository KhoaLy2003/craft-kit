# Phase 1 · Step 7 — Constitution

## Overview

- **Purpose**: Establish the coding standards, architectural rules, and non-negotiable principles every agent follows in Phase 2.
- **Agent/Skill**: general-purpose agent (all project types; no specialist needed)
- **Model**: `fast`
- **Trigger**: `docs/architecture.md` exists and is `approved`.
- **Inputs**: `docs/architecture.md`; `docs/data-model.md` (the constitution's naming and database rules must agree with its Conventions section); `docs/DESIGN.md`; `docs/roadmap.md`.
- **Outputs**: `docs/constitution.md` (always this path: the Phase 2 preflight, the docs lint and the upgrade detection look for it; if the harness reads rules from the project root, Step 8's `AGENTS.md` points to it).
- **Template**: `templates/07-constitution.md`
- **Gate**: `soft` — present the summary; set approval when the user accepts. If the user accepted defaults at the Step 6 gate, set `Status: approved` on writing and still show the summary.

## Scope

- **In**: concrete coding standards (naming, structure, module boundaries, forbidden patterns); architectural rules derived from `docs/architecture.md`; an Amendment Procedure; depth sized to the project.
- **Out**: personal workflow preferences that do not change code or architecture output (except the `Spec Evolution` section Phase 2 Ship adds); roadmap decisions; deployment procedures; aspirational principles.

> Every principle must be concrete enough to change at least one downstream plan, diff, or agent output. If deleting a rule would change none, delete the rule.

## Execution Rules

1. Read `docs/architecture.md`, `docs/DESIGN.md`, and `docs/roadmap.md` before drafting.
2. Use `templates/07-constitution.md` as the scaffold. Apply the test above to every principle; rewrite or remove any that fail.
3. Fill the Amendment Procedure with a real process. For a solo developer with ≤ 15 S/M features it can be one line ("update this file directly") and the constitution can be minimal (3–5 rules).
4. Fill the `Verification Commands` table from the approved stack in `docs/architecture.md`: one command per row, status `planned`, `n/a — <reason>` where the stack has no such step. Step 8 runs each command and marks it `verified`.
5. **NFR mapping.** For every row of `docs/roadmap.md` → Non-functional Requirements with a measurable target, add a MUST to a principle or a row to Verification Commands, and list the pair in the template's `NFR Mapping` table. A row with no mapping is resolved before the file is written. Rows marked `n/a` need no mapping.
6. Write the file to disk, give the user its path, and present a short summary (principle count, the most consequential MUST rules).

## Artifact Rules

Write the file to `docs/constitution.md`. Set `Status: approved` after the user accepts.

## Completion Criteria

- [ ] Every principle states at least one MUST rule in measurable terms and would change a real decision if removed.
- [ ] No personal workflow preferences (the Ship-added `Spec Evolution` section is exempt).
- [ ] Amendment Procedure and versioning are filled in with an actionable process.
- [ ] `Verification Commands` table filled: every row has a command or `n/a — <reason>`, status `planned`.
- [ ] Every Non-functional Requirement with a measurable target is listed in `NFR Mapping` with a MUST or Verification Commands row.
- [ ] File saved at the correct path with `Status: approved`.

Gate summary: *"The working rules for all Phase 2 code are set; every AI agent on this project will follow them. Does anything need to change before we start building?"*

## Transition Rules

Next: Step 8 — Scaffold.
