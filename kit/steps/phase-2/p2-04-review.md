# Phase 2 · Step 4 — Review

## Overview

- **Purpose**: One review pass that checks every acceptance criterion for coverage and the whole diff for quality, security, and compliance; fix everything found.
- **Agent/Skill**: `code-reviewer` agent
- **Model**: `balanced`
- **Gate**: `none` — no human decision; the step advances only when its blocking condition clears: zero open findings and zero GAP rows in the latest review.
- **Inputs**: full diff of the feature branch against its base; the spec; `docs/constitution.md`; `docs/architecture.md`; `docs/data-model.md`; `docs/flows.md`
- **Outputs**: findings and coverage gaps fixed on the branch; gap tasks appended to the plan
- **Template**: none

## Scope

- **In**: acceptance-criteria coverage; code quality, security, architectural and constitutional compliance.
- **Out**: E2E behavior (Step 5); whether a criterion is *correct* — COVERED means an attempt exists in the diff, not that it works.
- **Boundary**: no finding is deferred. Do not advance with any open finding or GAP.

## Rules

- One `code-reviewer` dispatch with the full branch diff, spec, constitution, and architecture; `scope: all` reviews all features in the same pass. The brief asks for two outputs:
  - **Coverage** — for each acceptance criterion in the spec: COVERED (evidence in the diff: function, component, validation logic, test) or GAP (none found).
  - **Findings** — code quality, security, and architectural compliance, each rated critical / important / minor. Findings also include any divergence between migrations/schema code and `docs/data-model.md`, or between routes/navigation and `docs/flows.md`.
- Append each GAP to the plan as a task. Fix every finding of every severity and implement every gap task in one implementer dispatch, routed by specialist per the rubric.
- Re-run the reviewer on the fix diff, and on any COVERED criteria the fixes touched. Repeat until there are zero findings and zero GAPs.
- Disagreements with `docs/constitution.md` are called out explicitly, never silently fixed.
- If the review shows the implementation decided something the spec did not cover, record the decision in the spec before advancing. Set the spec `Status` to `draft`, show the user the edit, and restore `approved` only after their explicit confirmation; the step's gate otherwise does not change. For a data-model or flow divergence, apply the same direction: if the implementation decided something the spec missed, record it in the spec and amend the docs; otherwise fix the code. The same applies to `docs/architecture.md`: a dependency, service, or environment variable the implementation added that the plan's Architecture Impact did not list is recorded in the plan and amended into the docs (including `ENV_SETUP.md` and `.env.example`); otherwise fix the code.

## Completion Criteria

"Done" means the latest reviewer output, read in full, shows all of the following:

- [ ] Zero GAP rows: every acceptance criterion in the spec is COVERED
- [ ] Zero open findings of any severity (critical, important, minor), after the last reviewer re-run on the fix diff
- [ ] Any constitution disagreement raised and resolved
- [ ] Any decision the spec missed is recorded in the spec

## Transitions

- **Next**: Step 5 — E2E (a handover seam; see `kit/guides/session-handover.md`)

## References

- `code-reviewer` agent
- `kit/task-agent-rubric.md`
