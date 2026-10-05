# Phase 2 · Step 7 — Ship

## Overview

- **Purpose**: Commit, push, open a pull request, and mark the shipped features.
- **Agent/Skill**: `finishing-a-development-branch` skill + general-purpose agent
- **Model**: `fast`
- **Gate**: `none`
- **Inputs**: the feature branch (changes uncommitted unless a handover committed some); `docs/roadmap.md`
- **Outputs**: committed and pushed branch; PR against `main`; `docs/roadmap.md` rows set to `Status: shipped`
- **Template**: none

## Rules

- Commit everything. `scope: feature`: one commit referencing the feature slug. `scope: all`: one commit covering all features, with the full scope in the message (for example `feat: complete <project> MVP — F01 through FNN`).
- Push the branch and open a PR against `main`. Never merge it and never push to `main`.
- Set `Status: shipped` in `docs/roadmap.md` for the feature (`scope: all`: every Must feature built in this pass).
- **Spec persistence (ask once):** if `docs/constitution.md` has no "Spec Evolution" section, ask the user how specs will evolve and record the choice there — the three models are in `kit/guides/evolving-specs.md`. Decide before starting another cycle.

## Completion Criteria

- [ ] All changes committed; branch pushed; PR open against `main`
- [ ] `docs/roadmap.md` shows `shipped` for every feature built
- [ ] Spec persistence decision recorded in `docs/constitution.md`

## Transitions

- **Next**:
  - `scope: feature` with `pending` features left: select the next one in build order and restart at Step 1.
  - Otherwise (`scope: all`, or no `pending` features left): the release is complete. Tell the user and offer the next move — `kit/phase-3-iterate.md` to decide what to build next (works with or without ideas), or `kit/phase-bug-fix.md` for a reported defect. If the user already knows exactly one feature to add, append it to `docs/roadmap.md` and run Phase 2 with `scope: feature`.

## References

- `finishing-a-development-branch` skill
- `kit/guides/evolving-specs.md`
