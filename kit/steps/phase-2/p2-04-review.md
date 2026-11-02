# Phase 2 · Step 4 — Review

## Overview

- **Purpose**: One review pass that checks every acceptance criterion for coverage and the whole diff for quality, security, and compliance; fix every critical and important finding and every gap, and log the minor ones.
- **Agent/Skill**: general-purpose agent loading `code-review-and-quality`, `security-and-hardening`, `performance-optimization`; `code-simplification` for fixes
- **Model**: `balanced`
- **Gate**: `none` — no human decision; the step advances only when its blocking condition clears: zero open critical or important findings and zero GAP rows in the latest review.
- **Inputs**: full diff of the feature branch against its base; the spec; `docs/constitution.md`; `docs/architecture.md`; `docs/data-model.md`; `docs/flows.md`
- **Outputs**: findings and coverage gaps fixed on the branch; gap tasks appended to the plan
- **Template**: none

## Scope

- **In**: acceptance-criteria coverage; code quality, security, architectural and constitutional compliance.
- **Out**: E2E behavior (Step 5); whether a criterion is *correct* — COVERED means an attempt exists in the diff, not that it works.
- **Boundary**: no critical or important finding and no GAP is deferred. Minor findings are not fixed in this step; they are recorded (see Rules). Do not advance with any open critical or important finding or GAP.

## Rules

- One review dispatch to the general-purpose agent, loading `code-review-and-quality`, `security-and-hardening`, and `performance-optimization`, with the full branch diff, spec, constitution, and architecture (`scope: all`: all features in one pass). Two outputs:
  - **Coverage** — for each acceptance criterion in the spec: COVERED (evidence in the diff: function, component, validation logic, test) or GAP (none found).
  - **Findings** — code quality, security, and architectural compliance, each rated critical / important / minor. Severity map: `Critical:` → critical; unprefixed → important; `Optional:` / `Consider:` / `Nit:` → minor; `FYI` is not a finding. Also findings: schema/migrations diverging from `docs/data-model.md` as amended by the spec's `## Data & Flow Impact`, routes/navigation diverging from `docs/flows.md` as amended by it.
    - **NFR compliance** — check the diff against each applicable `docs/roadmap.md` NFR row (and the plan's `NFR:` tasks); an unmet measurable target is a finding. List `NFR compliance: none` when all are met or none applies.
- Append each GAP to the plan as a task. Fix every critical and important finding and implement every gap task in one implementer dispatch (specialists per the rubric), also loading `code-simplification` for readability findings; it must not change behavior. **Minor findings are not fixed:** record one line in the session log (`minor findings deferred: N`) and list them under Known limitations in the PR (Step 7).
- Re-review the fix diff and the COVERED criteria the fixes touched, until zero critical or important findings and zero GAPs, at most 3 rounds. Roadmap size S features get one round: no re-review of the fix diff, but the Verification Commands must pass on it. After round 3 (or the S round), list what remains and ask the user: continue, accept as known (log each), or stop.
- Constitution disagreements are called out, never silently fixed.
- If the implementation decided something the spec did not cover, record it in the spec before advancing (set `Status` to `draft`, show the edit, restore `approved` only on explicit confirmation). Same direction for data-model, flows, and architecture divergences (including a new dependency, service, or env variable missing from the plan's Architecture Impact, which also goes into `ENV_SETUP.md` and `.env.example`): if the implementation decided it, record it in the spec's `## Data & Flow Impact` or the plan's `## Architecture Impact` (Ship merges them into the shared docs); otherwise fix the code.

## Completion Criteria

"Done" means the latest review output, read in full, shows all of the following:

- [ ] Zero GAP rows: every acceptance criterion in the spec is COVERED
- [ ] Zero open critical or important findings, after the last review re-run on the fix diff (minor findings logged and listed for the PR)
- [ ] Any constitution disagreement raised and resolved
- [ ] `NFR compliance` reported in the Findings; every applicable NFR is met or its finding is fixed
- [ ] Build, lint, typecheck, and tests from `docs/constitution.md` → Verification Commands pass on the final fix diff; only `pre-existing` failures remain, each listed in the session log (Definition of Done step 2)
- [ ] Any decision the spec missed is recorded in the spec

## Transitions

- **Next**: Step 5 — E2E (a handover seam; see `kit/guides/session-handover.md`)

## References

- `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization` skills
- `kit/task-agent-rubric.md`
