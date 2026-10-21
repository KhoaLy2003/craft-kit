# Phase 2 · Step 1 — Spec

## Overview

- **Purpose**: Write acceptance criteria and edge cases; resolve ambiguity before planning.
- **Agent/Skill**: `brainstorming` skill (Architectural mode when `scope: all`)
- **Model**: `capable`
- **Gate**: `hard` — approval of the spec
- **Inputs**:
  - `docs/backlog.json` (the feature entry, or all Must entries), `docs/roadmap.md` (build-order context), `docs/constitution.md`, `docs/architecture.md`, `docs/DESIGN.md`, `docs/data-model.md`, `docs/flows.md`
  - `docs/designs/<feature-slug>/` and `docs/specs/<feature-slug>/screens/*.md` — designs and briefs from Phase 1 Step 5 (including a re-entry for new features), if they exist
- **Outputs**:
  - `scope: feature` → `docs/specs/<feature-slug>/spec.md`
  - `scope: all` → `docs/specs/spec.md`, one `##` section per feature in build order
- **Template**: none

## Scope

- **In**: acceptance criteria with stable IDs, edge cases, non-goals, and UI behavior as the spec mode below dictates; constitution check; user approval.
- **Out**: implementation planning (Step 2); technical or architectural decisions — the spec describes behavior, not implementation; batching features under `scope: feature`.
- **Boundary**: the spec covers exactly the roadmap entry (entries) selected. If a feature is larger than estimated or a section stays ambiguous, flag it and re-agree scope before approval — never expand silently, never approve an ambiguous section.

## Rules

- Skipped when `kit/phase-2.md` skip detection applies.
- Invoke `brainstorming`; it runs clarifying questions → approaches → design sections → written spec. Do not invoke `writing-plans` from inside it — that is Step 2.
- Feature slug: the slug assigned in Phase 1 Step 5 (lowercase kebab-case of the roadmap feature name), so `docs/specs/<feature-slug>/` and `docs/designs/<feature-slug>/` line up. Derive it the same way if Step 5 was skipped or the feature is new.
- Each feature's spec (or section) holds acceptance criteria, edge cases, and non-goals. `scope: all` adds, per section, how the feature connects to the one before it, and makes every cross-feature interaction explicit.
- **Spec mode** — the one rule for UI content:
  - *Behavior-only* — when designs exist in `docs/designs/<feature-slug>/`, or a Step 5 re-entry will supply them after this spec: record only what the designs do not show (acceptance criteria, validation rules, data constraints, auth flows, error scenarios, edge cases). Do not describe layout or visuals. Include a `## Screens` list naming every screen the feature needs; when designs already exist, mark screens lacking a design file `undesigned` — they fall back to `docs/DESIGN.md` + `docs/preview/`.
  - *Full* — no designs and none planned: also write the UI behavior in full.
- If per-screen briefs exist in `docs/specs/<feature-slug>/screens/`, fill each brief's Acceptance criteria section (section 8) with that screen's criteria, using the same IDs as `spec.md`; `spec.md` stays the complete index.
- Check the spec against `docs/constitution.md` before presenting it.
- Write the spec to disk, give the user the path, and ask them to review there. `scope: all`: review section by section and approve the whole document once, not per feature.
- The spec's first lines carry `**Status:** draft | approved | cancelled`. Write `draft`; change it to `approved` only after the user's explicit approval; `cancelled` is set only by `kit/phase-3-iterate.md` "Change control" when the feature is dropped, and is treated as not approved by skip detection in `kit/phase-2.md`. Skip detection in `kit/phase-2.md` relies on this field.
- **Data & Flow Impact.** Every spec (or `scope: all` section) ends with `## Data & Flow Impact`: entities/fields added or changed (name, type, relationship), screens and transitions added or changed, or the literal line `none`. The user approves it with the spec. Immediately after approval, apply the described amendments to `docs/data-model.md` and `docs/flows.md` (keep `Status: approved`, refresh `Last updated`, extend the §4 matrix and the screen inventory). A spec that needs an entity or screen not in the docs without listing it is incomplete. When Skip detection finds the spec already approved, its impact section already exists: apply only the amendments for entities and screens absent from the docs (compare entities, fields, relationships, screens, and transitions against `data-model.md` and `flows.md`, not names only); never duplicate rows.
- **NFR applicable.** Every spec (or `scope: all` section) states which rows of `docs/roadmap.md` → Non-functional Requirements apply to it, by reference (category and row, for example `Performance row 1`), never by copying the target text; or the literal line `none`. Any NFR the feature needs but the table lacks is raised with the user before approval and added to the roadmap table, not buried in the spec.
- **Wave design (features from a Phase 3 release).** When the feature's release has an approved `docs/iterations/<release-slug>/design.md`, its entities, flows, and screens are already in `docs/data-model.md` and `docs/flows.md`. Then `## Data & Flow Impact` lists only the feature's slice of that design (for example `see design.md: entities Wishlist, WishlistItem; flow wishlist-add`) or `none beyond the wave design`, and the amendments step applies nothing. Anything the spec needs that the wave design lacks is not added here: stop, record it as a design change request, and return to `kit/phase-3-iterate.md` Step 4. Never edit an item the Shared Surface table assigns to another feature.
- When the amendments change a flow or the system overview, re-render only those diagrams per `kit/orchestrator-conventions.md` rule 8; an added or changed entity or relationship re-renders the ER diagram.
- Amendments that add or change an entity or relationship also update the `data-model.md` §2 `erDiagram` in the same edit (completion check (e) in `kit/steps/phase-1/p1-06-architecture.md`).

## Completion Criteria

- [ ] Spec file exists with acceptance criteria, edge cases, non-goals, and resolved open questions (`scope: all`: one section per Must feature in build order, cross-feature interactions explicit)
- [ ] Spec mode applied: behavior-only with a `## Screens` list when designs exist or are coming; full UI behavior otherwise
- [ ] Checked against `docs/constitution.md`
- [ ] User has explicitly approved and the spec's `Status` is `approved`
- [ ] Every spec section states `NFR applicable` by reference to the roadmap table, or `none`
- [ ] Every spec section ends with `## Data & Flow Impact`, and its amendments are applied to `docs/data-model.md` and `docs/flows.md`

## Transitions

- **Next**: Step 2 — Plan
- **Gate summary**: *`scope: feature` — "The spec for [feature name] defines its acceptance criteria, edge cases, and non-goals. Approve it as the description of what gets built." `scope: all` — "The full-app spec has one section per feature. Approve it as the contract for all of them — a wrong assumption here propagates into every feature."*

## References

- `brainstorming` skill
- `kit/templates/spec-screen.md` — use only if no Phase 1 screen briefs exist and screens must be documented before Plan
