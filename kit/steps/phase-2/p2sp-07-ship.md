# Phase 2 (Single-Pass) · Step 7 — Ship

## Overview

- **Purpose**: Commit all changes, push the branch, and open a pull request. Mark all features as shipped.
- **Skill/Agent**: `finishing-a-development-branch` skill; general-purpose agent (PR creation)
- **Model**: `fast`
- **Trigger**: Step 6 gate approved
- **Inputs**:
  - Feature branch
  - `docs/roadmap.md`
- **Outputs**:
  - Committed branch
  - PR opened against `main`
  - All Must features in `docs/roadmap.md` marked `shipped`
- **Template**: `none`
- **Gate**: `none`

## Scope

### In Scope

- One commit covering all features
- Pushing the branch and opening a PR against `main`
- Updating `docs/roadmap.md`: setting `Status` to `shipped` for every feature implemented in this pass
- Making the spec persistence decision and recording it in `docs/constitution.md`

### Out of Scope

- Merging directly to `main` — PR only
- Using single-pass for subsequent features — subsequent features use `phase-2-feature-dev.md`

### Scope Boundary

> Single-pass is for the initial complete build only. If the roadmap gains new features after this step, use `phase-2-feature-dev.md` for each subsequent feature — never re-enter the single-pass track for incremental additions.

## Execution Rules

- Run `finishing-a-development-branch` skill to create one commit covering all features
- Commit message describes the complete scope (e.g. `feat: complete reading list MVP — F01 through F11`)
- Push the branch and open a PR against `main` — do not merge directly
- Update `docs/roadmap.md`: set `Status` to `shipped` for every feature implemented in this pass
- Make the spec persistence decision and record it in `docs/constitution.md`

## Artifact Rules

- **Artifact**: Committed branch; PR opened against `main`
- `docs/roadmap.md` updated with all shipped features
- Spec persistence decision recorded in `docs/constitution.md`
- **Status / approval condition**: `none` — no gate; this step runs to completion after Step 6 approval

## Completion Criteria

The step is considered complete when:

- [ ] One commit made covering all features
- [ ] Branch pushed and PR opened against `main`
- [ ] All Must features in `docs/roadmap.md` marked `shipped`
- [ ] Spec persistence decision recorded in `docs/constitution.md`

## Transition Rules

### Before Advancing

- PR opened (not merged) against `main`
- All features marked `shipped` in `docs/roadmap.md`
- Spec persistence decision recorded in `docs/constitution.md`

### Next Step

- **Default**: Phase 2 complete — subsequent features use `phase-2-feature-dev.md`
- **Optional skip**: No
- **User decision required**: No

### Transition Record

- **Record**: `docs/<project>/phase-2-session.md`
- **Values**: `complete`

## Exceptions / Special Cases

- **Spec persistence options** (record chosen model in `docs/constitution.md`): flow-forward (feature directories are immutable history), flow-back (any artifact can be updated; team reconciles afterward), living spec (`spec.md` is the contract; plan/tasks are regenerated from it when it changes). See `kit/guides/evolving-specs.md` for details.
- Single-pass is for the initial complete build only — subsequent features use `phase-2-feature-dev.md`

## References

- `finishing-a-development-branch` skill
- `docs/roadmap.md`
- `docs/constitution.md`
- `kit/guides/evolving-specs.md`
- `phase-2-feature-dev.md`
