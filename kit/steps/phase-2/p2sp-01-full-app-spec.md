# Phase 2 (Single-Pass) · Step 1 — Full-App Spec

## Overview

- **Purpose**: Write acceptance criteria for all features in one comprehensive spec document, organized by feature.
- **Skill/Agent**: `brainstorming` skill (Architectural path)
- **Model**: `capable`
- **Trigger**: `docs/roadmap.md` exists with all features `pending`; Phase 2 approach is `single-pass`
- **Inputs**:
  - `docs/roadmap.md` — all Must features
  - `docs/architecture.md`
  - `docs/DESIGN.md`
  - `docs/constitution.md`
  - `docs/designs/<feature-slug>/` — screen designs from Phase 1 Step 6 or Design Sprint (per feature, if they exist)
  - `docs/specs/<feature-slug>/screens/*.md` — per-screen briefs from Phase 1 Step 6 (per feature, if they exist)
- **Outputs**:
  - `docs/specs/spec.md` — one document, one `##` section per feature in roadmap build order
- **Template**: none
- **Gate**: `hard` — you review the complete spec and approve once before implementation starts

## Scope

### In Scope

- Running the `brainstorming` skill in Architectural mode, scoped to the complete roadmap — not one feature
- Resolving ambiguity across the full feature set before any code is written
- Producing one `##` section per feature in build order, each containing: acceptance criteria, edge cases, non-goals for that feature, and how it connects to the features immediately before it
- Making cross-feature interactions (where feature N depends on feature N-1's specific behaviour) explicit in the relevant sections

### Out of Scope

- Invoking `writing-plans` from inside the skill — that is Step 2

### Scope Boundary

> The spec is scoped to all Must features in the complete roadmap. If review reveals a feature is more complex than its roadmap size estimate suggests, pause and resolve scope explicitly before approving. Do not start implementation against an ambiguous section.

## Execution Rules

- Run `brainstorming` skill in Architectural mode, scoped to the complete roadmap
- For each feature: if `docs/designs/<feature-slug>/` exists, it is the source of truth for the UI. The spec section for that feature records only behavior not visible in the designs: acceptance criteria, validation rules, data constraints, auth flows, error scenarios, and edge cases.
- If the spec discovers a screen for a feature that has no corresponding design file, list it under an "Undesigned screens" subsection of that feature's section. Implementation uses `docs/DESIGN.md` + `docs/preview/` as the fallback for those screens.
- If no `docs/designs/<feature-slug>/` exists for a feature, write the full spec section for it including UI behavior as today.
- Organize output as one document with one `##` section per feature in build order
- Each section must contain: acceptance criteria, edge cases, non-goals for that feature, and how it connects to the features immediately before it
- Cross-feature interactions must be made explicit in the relevant sections — not left implicit
- Write `docs/specs/spec.md` to disk as the final step of generation — do not print spec content in the terminal for review. Once written, tell the user the file path and ask them to open and review each section before approving.

## Artifact Rules

- **Artifact**: `docs/specs/spec.md`
- One document, one `##` section per feature in roadmap build order
- **Status / approval condition**: User reviews section by section and approves the document once — not per-feature. If a section is unclear, request revision before approving.

## Completion Criteria

The step is considered complete when:

- [ ] `docs/specs/spec.md` exists with one section per Must feature in build order
- [ ] For features with existing designs: sections are behavior-delta only; any screens with no design listed under "Undesigned screens"
- [ ] For features without designs: sections include full UI behavior description
- [ ] Every section contains acceptance criteria, edge cases, non-goals, and cross-feature connections
- [ ] All cross-feature interactions are explicit
- [ ] Hard gate passed: user has reviewed and approved the full document

## Transition Rules

### Before Advancing

- Every section reviewed; any unclear section revised and re-approved
- Scope of each feature confirmed against its roadmap size estimate
- Hard gate passed — gate summary: *"The full-app spec is ready — one section per feature with acceptance criteria and edge cases. This is the most consequential approval: a wrong assumption here propagates into every feature. Review each section before approving."*

### Next Step

- **Default**: Step 2 — Plan
- **Optional skip**: No
- **User decision required**: Yes — hard gate approval required

### Transition Record

- **Record**: `docs/<project>/phase-2-session.md`
- **Values**: `complete`

## Exceptions / Special Cases

- If review reveals a feature is more complex than its roadmap size estimate suggests, pause and resolve scope explicitly before approving
- If a section is unclear, request revision before approving — do not approve with outstanding ambiguity

## References

- `brainstorming` skill (Architectural path)
- `templates/spec-screen.md` — per-screen briefs are produced in Phase 1 Step 6 and placed at `docs/specs/<feature-slug>/screens/<screen-name>.md`; use this template only if no Phase 1 Step 6 designs exist for a feature and screens need to be documented before Step 2 (Plan)
