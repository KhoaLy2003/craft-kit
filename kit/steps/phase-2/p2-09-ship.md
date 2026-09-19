# Phase 2 · Step 9 — Ship

## Overview

- **Purpose**: Commit, push the feature branch, and open a pull request; mark the feature as shipped.
- **Skill/Agent**: `finishing-a-development-branch` skill + general-purpose agent
- **Model**: `fast`
- **Trigger**: Step 8 gate approved
- **Inputs**:
  - Feature branch (all changes uncommitted)
  - `docs/roadmap.md`
- **Outputs**:
  - Committed and pushed feature branch
  - Pull request opened against the main branch
  - `docs/roadmap.md` feature status updated to `shipped`
- **Gate**: `none`

## Scope

### In Scope

- Committing all feature branch changes with a descriptive message referencing the feature slug
- Pushing the feature branch to the remote
- Opening a pull request to the main branch
- Updating `docs/roadmap.md` to set the feature's `Status` to `shipped`
- Recording the spec persistence decision in `docs/constitution.md` (first feature shipped only)

### Out of Scope

- Merging the PR — never merge directly; the PR is for review
- Pushing to main directly

### Scope Boundary

> The feature branch is pushed and a PR is opened. The orchestrator does not merge. After this step, the orchestrator restarts the cycle at Step 1 with the next `pending` feature.

## Execution Rules

- Commit all changes with a clear, descriptive commit message referencing the feature slug.
- Push the feature branch to the remote.
- Open a pull request to the main branch — do not merge directly; do not push to main.
- Update `docs/roadmap.md` to set this feature's `Status` column to `shipped`.
- After this step, the orchestrator selects the next `pending` feature from `docs/roadmap.md` (in build order) and restarts at Step 1.
- **Spec persistence (first feature only):** if this is the first feature shipped on this project, decide how specs will evolve when requirements change and record the decision in `docs/constitution.md`. See `kit/guides/evolving-specs.md` for the three models: flow-forward (feature directories are immutable history), flow-back (any artifact can be updated; team reconciles afterward), living spec (`spec.md` is the contract; plan/tasks are regenerated from it when it changes).

## Artifact Rules

- **Artifact**: committed feature branch + open pull request (no new document)
- `docs/roadmap.md` must be updated to `shipped` for this feature.
- **Status / approval condition**: `none` — no gate; advance once the PR is open and roadmap is updated.

## Completion Criteria

The step is considered complete when:

- [ ] All feature branch changes are committed with a descriptive commit message
- [ ] The feature branch is pushed to the remote
- [ ] A pull request is open against the main branch
- [ ] `docs/roadmap.md` shows `shipped` for this feature
- [ ] The spec persistence decision is recorded in `docs/constitution.md` (first feature only)

## Transition Rules

### Before Advancing

- The PR must be open and the roadmap updated before the cycle restarts.
- No gate — advance immediately once the PR is open.

### Next Step

- **Default**: Step 1 — Brainstorm & Spec (next `pending` feature from `docs/roadmap.md`)
- **Optional skip**: No
- **User decision required**: No

### Transition Record

- **Record**: session log (per `kit/session-logging.md`)
- **Values**: `complete`

## Exceptions / Special Cases

- If no further `pending` features exist in `docs/roadmap.md`, Phase 2 is complete. Notify the user and await further direction.
- The spec persistence decision (first feature only) must be made before restarting the cycle — it affects how all future spec artifacts are managed.

## References

- `finishing-a-development-branch` skill
- `docs/roadmap.md`
- `docs/constitution.md`
- `kit/guides/evolving-specs.md`
