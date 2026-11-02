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
- **Out**: implementation planning (Step 2); technical or architectural decisions — the spec describes behavior, not implementation: no file, class, use-case, function, or migration names (they belong in the plan); batching features under `scope: feature`.
- **Boundary**: the spec covers exactly the selected roadmap entries. If a feature is larger than estimated or a section stays ambiguous, flag it and re-agree scope before approval; never expand silently.

## Rules

- Skipped when `kit/phase-2.md` skip detection applies.
- First action, before any questions: create the unit's section in `docs/phase-2-session.md` with Step 1 `in progress` (`kit/session-logging.md`). This is the marker the Entry guard in `kit/phase-2.md` checks; no source file changes until the spec is `approved`.
- Invoke `brainstorming` (questions → approaches → design → written spec). Do not invoke `writing-plans` from inside it; that is Step 2. Write the spec to the Outputs path (conventions rule 16).
- Feature slug: the Phase 1 Step 5 slug (kebab-case of the feature name); derive it the same way if Step 5 was skipped or the feature is new.
- Each feature's spec (or section) holds acceptance criteria, edge cases, and non-goals. `scope: all` adds, per section, how the feature connects to the one before it, and makes every cross-feature interaction explicit.
- **Size target.** Keep a feature's spec near 8 KB and about 15 acceptance criteria for a size-M feature; scale with the roadmap estimate. A spec far over that is usually carrying design or implementation detail: move it to the plan, or split the feature and re-agree scope. Fold small decisions into the AC or edge case they affect; do not keep a separate decisions table, and write `Inputs` as a short list.
- **Spec mode** — the one rule for UI content:
  - *Behavior-only* — designs exist in `docs/designs/<feature-slug>/`, or a Step 5 re-entry will supply them: record only what designs do not show (acceptance criteria, validation, data constraints, auth flows, errors, edge cases); no layout or visuals. Include a `## Screens` list of every screen; mark screens lacking a design file `undesigned` (they fall back to `docs/DESIGN.md` + `docs/preview/`).
  - *Full* — no designs and none planned: also write the UI behavior in full.
- If per-screen briefs exist in `docs/specs/<feature-slug>/screens/`, fill each brief's Acceptance criteria section (section 8) with that screen's criteria, using the same IDs as `spec.md`; `spec.md` stays the complete index.
- Check the spec against `docs/constitution.md` before presenting it.
- Write the spec to disk and ask the user to review it there. `scope: all`: approve the whole document once, not per feature.
- Header `**Status:** draft | approved | cancelled`: write `draft`; `approved` only after explicit approval; `cancelled` only by `kit/guides/change-control.md` (skip detection in `kit/phase-2.md` reads this field and treats `cancelled` as not approved).
- **Data & Flow Impact.** Every spec (or `scope: all` section) ends with `## Data & Flow Impact`: entities/fields added or changed (name, type, relationship), screens and transitions added or changed, or the literal line `none`. The user approves it with the spec. **Do not edit `docs/data-model.md` or `docs/flows.md` now:** the section is the unit's record of the change, read by Plan and Review, and Ship merges it into both once (`p2-07-ship.md` → Impact merge). A spec needing an unlisted entity or screen is incomplete.
- **NFR applicable.** Every spec (or `scope: all` section) names the `docs/roadmap.md` → Non-functional Requirements rows that apply, by reference (e.g. `Performance row 1`, never the copied target), or the line `none`. An NFR the table lacks is raised with the user before approval and added to the roadmap table.
- **Wave design (features from a Phase 3 release).** When the release has an approved `docs/iterations/<release-slug>/design.md`, its entities, flows, and screens are already in `docs/data-model.md` and `docs/flows.md`. `## Data & Flow Impact` then lists only the feature's slice (e.g. `see design.md: entities Wishlist, WishlistItem; flow wishlist-add`) or `none beyond the wave design`, and nothing is applied. Anything missing from the wave design is a design change request: stop and return to `kit/phase-3-iterate.md` Step 4. Never edit an item the Shared Surface table assigns to another feature.
- Diagrams are not re-rendered in this step. The Ship merge updates the Mermaid sources (`data-model.md` §2 `erDiagram`, check (e) in `p1-06-architecture.md`) and re-renders an HTML diagram only when the user asks.

## Completion Criteria

- [ ] Spec has acceptance criteria, edge cases, non-goals, and no open questions (`scope: all`: a section per Must feature, interactions explicit); spec mode applied; checked against the constitution
- [ ] Every section states `NFR applicable` and ends with `## Data & Flow Impact` (merged into the shared docs at Ship, not now)
- [ ] User explicitly approved; `Status` is `approved`

## Transitions

- **Next**: Step 2 — Plan
- **Gate summary**: *"The spec for [feature | the full app, one section per feature] defines what gets built. Approve it as the contract; a wrong assumption here propagates into every feature."*

## References

- `brainstorming` skill
- `kit/templates/spec-screen.md` — use only if no Phase 1 screen briefs exist and screens must be documented before Plan
