# Phase 2 — Single-Pass (Small Projects)

> **Use this when the complete feature set is known at Phase 1 close, features are mostly S/M-sized, and there is one developer in one dominant domain.**
>
> All features are spec'd, planned, implemented, reviewed, tested, and shipped in a single cycle. No per-feature loop.
>
> Prerequisites: Phase 1 complete; `docs/roadmap.md` with all Must features `pending`; `docs/phase-1-kickoff.md` Phase 2 approach set to `single-pass`.

---

> **When NOT to use this track — use `phase-2-feature-dev.md` instead:**
> - Any feature is L-sized or its complexity is unknown upfront
> - The codebase is shared with multiple developers
> - The implementation is split roughly equally across multiple domains — if frontend and backend each account for ≥30% of tasks, use `phase-2-feature-dev.md`. A small number of out-of-domain tasks (config, migrations, one API route) does not disqualify single-pass.
> - The feature set is likely to grow significantly after Phase 2 begins
> - More than ~15 Must features in the roadmap

---

## Conventions

See `kit/orchestrator-conventions.md` for universal rules every orchestrating agent must follow: step banner format, time recording, PROJECT_ROOT requirement, file-write verification, gate summary protocol, and the fail-fast write instruction.

See `kit/phase-2-checklist.md` for the Single-Pass section checklists and the Universal section at the top — read the relevant section before each step.

See `kit/session-logging.md` for the session log schema and the Phase 2 Single-Pass starter template.

Before executing each step, read its step file — it is the authoritative source for that step's inputs, outputs, rules, and completion criteria.

## Context Window Management

Single-pass accumulates a full-app spec, an implementation plan, and complete multi-feature code in one session — the heaviest context load in the kit. By the time Step 3 completes, the session is often near or past a comfortable context limit.

**Trigger — open a new session before Step 4 if any of the following are true:**
- Estimated remaining credits are below 20% of the session budget
- The session is responding noticeably slower than at the start
- The session cannot accurately summarize the Step 2 plan without re-reading it

**Handoff checklist — complete before closing the session:**

1. Session log `docs/phase-2-session.md` updated — Step 3 marked `complete`, wall-clock duration and credit delta recorded.
2. Feature branch name confirmed (e.g. `feature/<project-slug>`).
3. Confirm these files exist on disk:
   - `docs/specs/spec.md`
   - `docs/specs/plan.md`
   - `docs/constitution.md`
   - All implementation code accumulated on `feature/<project-slug>` (no commits required yet)

**Resume entry — paste this as the opening message of the new session:**

```
Continue Phase 2 Single-Pass from Step 4 — Converge.

Project root: <absolute path>
Feature branch: feature/<project-slug>
Session log: docs/phase-2-session.md

Read these files before starting Step 4:
- docs/specs/spec.md
- docs/specs/plan.md
- docs/constitution.md

Steps 1–3 are complete. Proceed through Steps 4, 5a, 5b, 6, and 7 per kit/phase-2-single-pass.md.
```

Steps 4–7 (Converge → E2E Plan → Code Review + E2E → Manual Check → Ship) form a coherent review-and-ship sequence that fits in a fresh context.

## Steps

| # | Name | Description | Gate | Step File |
|---|------|-------------|------|-----------|
| 1 | Full-App Spec | Write acceptance criteria for all features in one comprehensive spec document, organized by feature. | `hard` | `kit/steps/phase-2/p2sp-01-full-app-spec.md` |
| 1b | Screen Design | User provides design files for all required screens across all features; orchestrator validates coverage before planning begins. | `hard` | `kit/steps/phase-2/p2sp-01b-screen-design.md` |
| 2 | Plan | Create an ordered implementation plan for all features with dependency-driven task sequencing and a dominant specialist identified. | `hard` | `kit/steps/phase-2/p2sp-02-plan.md` |
| 3 | Implement | Code all features in one pass using a single dominant specialist agent. | `soft` | `kit/steps/phase-2/p2sp-03-implement.md` |
| 4 | Converge | Verify the implementation covers all acceptance criteria across all features. Identify gaps and implement them. | `none` | `kit/steps/phase-2/p2sp-04-converge.md` |
| 5a | E2E Testing Plan | Document test cases and provisioning requirements for external services before E2E testing begins. | `hard` | `kit/steps/phase-2/p2sp-05a-e2e-plan.md` |
| 5b | Code Review + E2E Testing | Review all code for quality and compliance, then test complete cross-feature user flows in the running application. | `none` | `kit/steps/phase-2/p2sp-05b-code-review-e2e.md` |
| 6 | Manual Check | Human walkthrough of the complete product to verify all features work together as an integrated system. | `hard` | `kit/steps/phase-2/p2sp-06-manual-check.md` |
| 7 | Ship | Commit all changes, push the branch, and open a pull request. Mark all features as shipped. | `none` | `kit/steps/phase-2/p2sp-07-ship.md` |


## Flow Diagram

```
All roadmap Must features known + single-pass declared in docs/roadmap.md
         │
         ▼
[1] Full-App Spec — one document, one section per feature  [hard gate]
         │
         ▼
[1b] Screen Design — user provides design files, coverage validated  [hard gate]
         │
         ▼
[2] Plan — all tasks, dependency order, dominant specialist identified  [hard gate]
         │
         ▼
[3] Implement — one specialist, all tasks, one branch, no commits yet
         │
         ▼
[4] Converge — spec coverage check → gap tasks → re-implement → repeat until converged
         │
         ▼
[5a] E2E Testing Plan — document all test cases, provisioning requirements  [hard gate]
         │
         ▼
[5b] Code Review → fix all findings → E2E complete flow → fix all failures
         │
         ▼
[6] Manual Check — complete app walkthrough as a real user  [hard gate]
         │
         ▼
[7] Ship — one commit, one PR, all Must features → shipped
```

<div style="margin:24px 0;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.12);">
  <iframe src="/craft-kit/diagrams/phase-2-single-pass.html?embed=1" width="100%" style="border:none;display:block;height:60vh;min-height:480px;" title="Phase 2 Single Pass — interactive flow diagram"></iframe>
</div>
<p style="margin-top:8px;font-size:0.85em;color:var(--vp-c-text-2);">Pan and zoom to explore. <a href="/craft-kit/diagrams/phase-2-single-pass.html" target="_blank" rel="noopener">Open full screen ↗</a></p>

---

## Mid-Cycle Escape to Standard Loop

If, during this cycle, you discover:
- A feature is significantly more complex than estimated (L-sized in practice)
- A spec gap that requires substantially re-scoping a feature
- A mid-implementation technical decision that invalidates later features' specs
- The implementation reveals two genuinely independent domains that need different specialists

Stop the current cycle. Revise the spec for the affected features. Switch to `phase-2-feature-dev.md` for the remaining features, treating each remaining Must feature as an independent loop cycle.

Switching is not a failure — it is the correct response to discovered complexity.
