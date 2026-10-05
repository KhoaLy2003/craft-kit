# Phase 2 · Step 1 — Spec

## Overview

- **Purpose**: Write acceptance criteria and edge cases; resolve ambiguity before planning.
- **Agent/Skill**: `brainstorming` skill (Architectural mode when `scope: all`)
- **Model**: `capable`
- **Gate**: `hard` — approval of the spec
- **Inputs**:
  - `docs/roadmap.md` (the feature entry, or all Must entries), `docs/constitution.md`, `docs/architecture.md`, `docs/DESIGN.md`
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

## Completion Criteria

- [ ] Spec file exists with acceptance criteria, edge cases, non-goals, and resolved open questions (`scope: all`: one section per Must feature in build order, cross-feature interactions explicit)
- [ ] Spec mode applied: behavior-only with a `## Screens` list when designs exist or are coming; full UI behavior otherwise
- [ ] Checked against `docs/constitution.md`
- [ ] User has explicitly approved

## Transitions

- **Next**: Step 2 — Plan
- **Gate summary**: *`scope: feature` — "The spec for [feature name] defines its acceptance criteria, edge cases, and non-goals. Approve it as the description of what gets built." `scope: all` — "The full-app spec has one section per feature. Approve it as the contract for all of them — a wrong assumption here propagates into every feature."*

## References

- `brainstorming` skill
- `kit/templates/spec-screen.md` — use only if no Phase 1 screen briefs exist and screens must be documented before Plan
