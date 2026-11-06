# Phase 2 · Step 4 — Review

## Overview

- **Purpose**: One review pass that checks every acceptance criterion for coverage and the whole diff for quality, security, and compliance; fix every critical and important finding and every gap, and log the minor ones.
- **Agent/Skill**: general-purpose agent loading `code-review-and-quality`, `security-and-hardening`, `performance-optimization`; `code-simplification` for fixes
- **Model**: `balanced`
- **Gate**: `none` — advances only when the latest review has zero open critical or important findings and zero GAP rows.
- **Inputs**: full diff of the feature branch against its base; the spec; `docs/constitution.md`; `docs/architecture.md`; `docs/data-model.md`; `docs/flows.md`
- **Outputs**: findings and coverage gaps fixed on the branch; gap tasks appended to the plan
- **Template**: none

## Scope

- **In**: acceptance-criteria coverage; code quality, security, architectural and constitutional compliance.
- **Out**: E2E behavior (Step 5); whether a criterion is *correct* — COVERED means an attempt exists in the diff, not that it works.
- **Boundary**: critical and important findings and GAPs are never deferred; minor findings are logged, not fixed.

## Rules

Work in this order.

1. **Review dispatch.** One dispatch to the general-purpose agent, loading `code-review-and-quality`, `security-and-hardening`, and `performance-optimization`, with the full branch diff, spec, constitution, and architecture (`scope: all`: all features in one pass). Ask for:

   ```markdown
   ## Coverage
   | AC ID | COVERED / GAP | Evidence (function, component, validation logic, test) |
   ## Findings
   | Severity | File | Finding |
   ## NFR compliance
   <unmet targets from the applicable `docs/roadmap.md` NFR rows and the plan's `NFR:` tasks, or `NFR compliance: none`>
   ```

   Findings also cover schema, migrations, routes, or navigation diverging from `docs/data-model.md` or `docs/flows.md` as amended by the spec's `## Data & Flow Impact`.

   | Reviewer prefix | Severity |
   |---|---|
   | `Critical:` | critical |
   | none | important |
   | `Optional:` `Consider:` `Nit:` | minor |
   | `FYI` | not a finding |

2. **Fix dispatch.** Append each GAP to the plan as a task. Fix every critical and important finding and implement every gap task in one implementer dispatch (specialists per the rubric), also loading `code-simplification` for readability findings; it must not change behavior. **Minor findings are not fixed:** add one row each to `docs/known-issues.md` (from `kit/templates/known-issues.md`; create it if missing), record only the count in the session log (`minor findings deferred: N`), and list them under Known limitations in the PR (Step 7).
3. **Re-review loop.** Re-review the fix diff and the COVERED criteria the fixes touched, until zero critical or important findings and zero GAPs.

   | Roadmap size | Re-review | Verification Commands |
   |---|---|---|
   | S | one round, no re-review of the fix diff | must pass on the fix diff |
   | other | at most 3 rounds | pass on the final fix diff |

   After round 3 (or the S round), list what remains and ask the user: continue, accept as known (add each to `docs/known-issues.md` with Status `accepted`), or stop.
4. **Record divergences.** Constitution disagreements are called out, never silently fixed. Where the implementation decided something the plan or spec did not cover, record it; otherwise fix the code.

   | Decided by the implementation | Record in |
   |---|---|
   | Behavior the spec missed | the spec: `Status` to `draft`, show the edit, `approved` only on explicit confirmation |
   | Data-model or flow change | the spec's `## Data & Flow Impact` |
   | New dependency, service, or env variable | the plan's `## Architecture Impact`, and the variable into `ENV_SETUP.md` and `.env.example` |

   Ship merges both Impact sections into the shared docs.

## Completion Criteria

"Done" means the latest review output, read in full, shows:

- [ ] Zero GAP rows, and zero open critical or important findings after the last re-review (minor ones logged for the PR)
- [ ] `NFR compliance` reported; every applicable NFR met or its finding fixed
- [ ] Any constitution disagreement raised and resolved; any decision the spec missed recorded
- [ ] Verification Commands from `docs/constitution.md` pass on the final fix diff; only `pre-existing` failures remain, each listed in the session log (Definition of Done step 2)

## Transitions

- **Next**: Step 5 — E2E (a handover seam; see `kit/guides/session-handover.md`)

## References

- `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization` skills
- `kit/task-agent-rubric.md`
