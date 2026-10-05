# Phase 2 · Step 4 — Review

## Overview

- **Purpose**: One review pass that checks every acceptance criterion for coverage and the whole diff for quality, security, and compliance; fix everything found.
- **Agent/Skill**: `code-reviewer` agent
- **Model**: `balanced`
- **Gate**: `none`
- **Inputs**: full diff of the feature branch against its base; the spec; `docs/constitution.md`; `docs/architecture.md`
- **Outputs**: findings and coverage gaps fixed on the branch; gap tasks appended to the plan
- **Template**: none

## Scope

- **In**: acceptance-criteria coverage; code quality, security, architectural and constitutional compliance.
- **Out**: E2E behavior (Step 5); whether a criterion is *correct* — COVERED means an attempt exists in the diff, not that it works.
- **Boundary**: no finding is deferred. Do not advance with any open finding or GAP.

## Rules

- One `code-reviewer` dispatch with the full branch diff, spec, constitution, and architecture; `scope: all` reviews all features in the same pass. The brief asks for two outputs:
  - **Coverage** — for each acceptance criterion in the spec: COVERED (evidence in the diff: function, component, validation logic, test) or GAP (none found).
  - **Findings** — code quality, security, and architectural compliance, each rated critical / important / minor.
- Append each GAP to the plan as a task. Fix every finding of every severity and implement every gap task in one implementer dispatch, routed by specialist per the rubric.
- Re-run the reviewer on the fix diff, and on any COVERED criteria the fixes touched. Repeat until there are zero findings and zero GAPs.
- Disagreements with `docs/constitution.md` are called out explicitly, never silently fixed.
- If the review shows the implementation decided something the spec did not cover, record the decision in the spec before advancing.

## Completion Criteria

- [ ] Every acceptance criterion marked COVERED
- [ ] Every finding fixed; any constitution disagreement raised and resolved
- [ ] Any decision the spec missed is recorded in the spec

## Transitions

- **Next**: Step 5 — E2E (a handover seam; see `kit/guides/session-handover.md`)

## References

- `code-reviewer` agent
- `kit/task-agent-rubric.md`
