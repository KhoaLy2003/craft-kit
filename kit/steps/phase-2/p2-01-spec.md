# Phase 2 · Step 1 — Spec

## Overview

- **Purpose**: Write acceptance criteria and edge cases; resolve ambiguity before planning.
- **Agent/Skill**: `brainstorming` skill (Architectural mode when `scope: all`)
- **Model**: `capable`
- **Gate**: `hard` — approval of the spec
- **Inputs**:
  - `docs/backlog.json` (the feature entry, or all Must entries), `docs/roadmap.md` (build-order context), `docs/constitution.md`, `docs/architecture.md`, `docs/DESIGN.md` *(visual interface only)*, `docs/data-model.md`, `docs/flows.md` (these are the **standard inputs**); `docs/known-issues.md` (open rows touching this feature's area), if it exists
  - `docs/specs/<feature-slug>/intake.md` (Maintenance fit check and `Depends on`), if it exists
  - `docs/designs/<feature-slug>/` and `docs/specs/<feature-slug>/screens/*.md` — designs and briefs from Phase 1 Step 5 (including a re-entry for new features), if they exist
- **Outputs**:
  - `scope: feature` → `docs/specs/<feature-slug>/spec.md`
  - `scope: all` → `docs/specs/spec.md`, one `##` section per feature in build order
- **Template**: `kit/templates/spec.md`

## Scope

- **In**: acceptance criteria with stable IDs, edge cases, non-goals, UI behavior per the spec mode below; constitution check; user approval.
- **Out**: implementation planning (Step 2); file, class, use-case, function, or migration names; batching features under `scope: feature`.
- **Boundary**: the spec covers exactly the selected roadmap entries. If a feature is larger than estimated or a section stays ambiguous, flag it and re-agree scope before approval; never expand silently.

## Rules

Skipped when `kit/phase-2.md` skip detection applies. Work in this order.

1. **Log first.** Before any question, create the unit's section in `docs/phase-2-session.md` with Step 1 `in progress` (`kit/session-logging.md`); the Entry guard in `kit/phase-2.md` checks it. No source file changes until the spec is `approved`.
2. **Brainstorm.** Invoke `brainstorming` (questions → approaches → design → written spec). Never invoke `writing-plans` from inside it.
3. **Write from the template** to the Outputs path (conventions rule 16). The feature slug is the Phase 1 Step 5 slug (kebab-case of the feature name), derived the same way if Step 5 was skipped or the feature is new. `scope: all`: one section per feature, each with "Connects to previous feature" and every cross-feature interaction explicit.
4. **Screen briefs.** If `docs/specs/<feature-slug>/screens/` has briefs, fill each one's Acceptance criteria section (section 8) with that screen's criteria, using the same IDs as `spec.md`.
5. **Self-check** against Completion Criteria and `docs/constitution.md`. A spec far over the template's size target usually carries design or implementation detail: move it to the plan, or split the feature and re-agree scope.
6. **Present and approve.** The user reviews the file on disk; `scope: all` is approved once, not per feature. `Status`: `draft` until explicit approval, then `approved`; `cancelled` only via `kit/guides/change-control.md` (skip detection treats it as not approved).

| Spec mode | Write |
|---|---|
| Designs exist in `docs/designs/<feature-slug>/`, or a Step 5 re-entry will supply them | *Behavior-only*: just what designs do not show (criteria, validation, data constraints, auth flows, errors, edge cases); no layout or visuals |
| No designs, none planned | *Full*: also write the UI behavior in full |
| No visual interface | *None*: write no UI behavior and no screens; the `## Screens` section says `n/a — no visual interface`. Entry-point behavior (inputs, outputs, errors) is covered by the acceptance criteria and edge cases |

- **NFR applicable**: reference rows of `docs/roadmap.md` → Non-functional Requirements. An NFR the table lacks is raised with the user before approval and added to the roadmap table.
- **Data & Flow Impact**: approved with the spec; a spec needing an unlisted entity or screen is incomplete.

## Completion Criteria

- [ ] Acceptance criteria, edge cases, non-goals, no open questions; spec mode applied; checked against the constitution
- [ ] Every section states `NFR applicable` and ends with `## Data & Flow Impact`
- [ ] User explicitly approved; `Status` is `approved`

## Transitions

- **Next**: Step 2 — Plan
- **Gate summary**: *"The spec for [feature | the full app, one section per feature] defines what gets built. Approve it as the contract; a wrong assumption here propagates into every feature."*

## References

- `brainstorming` skill
- `kit/templates/spec-screen.md` — use only if no Phase 1 screen briefs exist and screens must be documented before Plan
