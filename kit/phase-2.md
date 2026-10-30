# Phase 2 — Build

> **Status:** scope `feature` is experimental — not yet validated in a test round. Scope `all` is validated.
>
> One script for the build phase; the same 7 steps run in one of two scopes (`all` is for the initial build; later releases may use `feature`, user-confirmed):
> - **`scope: all`** — every Must feature in `docs/backlog.json` is specced, planned, built, reviewed, tested, and shipped in one cycle.
> - **`scope: feature`** — one feature per cycle, repeated in build order. Never batch features.
>

**Prerequisites:** Phase 1 complete, or an existing project with `docs/constitution.md`, `docs/architecture.md`, `docs/data-model.md`, `docs/flows.md`, and `docs/DESIGN.md` in place. `docs/backlog.json` holds the features and their status; Phase 2 reads it to select `pending` features in build order (`docs/roadmap.md`). `docs/roadmap.md` states `Phase 2 Scope: all | feature`; if the field is absent (existing project), apply the selection rule in `kit/steps/phase-1/p1-04-roadmap.md` and record the result in the roadmap before Step 1. `scope: all` builds Must features only; Should features stay `pending` for a later cycle (their designs already exist, see `p1-05-screen-design.md`).

**Docs preflight (before Step 1 of every new unit).** If `docs/constitution.md` or `docs/architecture.md` is missing, stop, tell the user, and point to `kit/phase-adopt.md` (existing code with no kit documents) or Phase 1 (new product). If `docs/data-model.md` or `docs/flows.md` is missing or not `approved`, or `docs/constitution.md` lacks a `## Verification Commands` section, stop, tell the user, and run `kit/phase-upgrade.md`; proceed only after it completes. Exemption: a unit whose log shows Step 2 or later started finishes without them; upgrade before the next unit. **Version check (warn only):** compare `kit_version` in `docs/.craft-kit.json` with `.craft-kit-version` in the kit directory; missing or older → suggest `kit/phase-upgrade.md`; newer → suggest reinstalling with `--force`. **Docs lint** (conventions rule 11): fix errors before Step 1, show warnings, never block on them.

**Conventions:** read `kit/orchestrator-conventions.md` and `kit/session-logging.md` before starting. Each step file is authoritative for its step; read it before running the step.

---

## Steps

| # | Name | Gate | Model | Step file |
|---|---|---|---|---|
| 1 | Spec | `hard` | `capable` | `kit/steps/phase-2/p2-01-spec.md` |
| 2 | Plan | `soft` | `balanced` | `kit/steps/phase-2/p2-02-plan.md` |
| 3 | Implement | `none` | `balanced` | `kit/steps/phase-2/p2-03-implement.md` |
| 4 | Review | `none` | `balanced` | `kit/steps/phase-2/p2-04-review.md` |
| 5 | E2E | `soft` | `balanced` | `kit/steps/phase-2/p2-05-e2e.md` |
| 6 | Manual Check | `hard` | none (human) | `kit/steps/phase-2/p2-06-manual-check.md` |
| 7 | Ship | `none` | `fast` | `kit/steps/phase-2/p2-07-ship.md` |

| Step | Skill / Agent | Produces |
|---|---|---|
| 1 | `brainstorming` | `spec.md`, user approval |
| 2 | `writing-plans`; `kit/task-agent-rubric.md` | `plan.md` with `Specialist:` per task and parallel groups |
| 3 | `subagent-driven-development` / `dispatching-parallel-agents` | Code on the feature branch |
| 4 | general-purpose agent + `code-review-and-quality`, `security-and-hardening`, `performance-optimization`, `code-simplification` | Acceptance-criteria coverage verdict; all findings fixed |
| 5 | general-purpose agent | `docs/E2E-TESTS.md`; test results |
| 6 | Human | Approval |
| 7 | `finishing-a-development-branch` + general-purpose agent | Commit, PR, shipped events recorded |

```
[1] Spec ─hard→ [2] Plan ─soft→ [3] Implement → [4] Review → [5] E2E ─soft→ [6] Manual Check ─hard→ [7] Ship
                                                                 ▲                  │
                                                                 └── fix → re-run ──┘  (affected E2E scope only)
scope feature: Ship → next pending feature → [1]      scope all: Ship → Phase 2 complete
```

---

## Scope Differences

| | `scope: all` | `scope: feature` |
|---|---|---|
| Unit of work | All Must features, one cycle | One feature per cycle, in build order |
| Spec | `docs/specs/spec.md` — one `##` section per feature in build order; cross-feature interactions explicit; approved once | `docs/specs/<feature-slug>/spec.md` |
| Plan | `docs/specs/plan.md` — tasks in dependency order across features | `docs/specs/<feature-slug>/plan.md` |
| Branch (created in Step 3) | `feature/<project-slug>` | `feature/<feature-slug>` |
| Skip Step 1 when | `docs/specs/spec.md` exists and its Status is `approved` | `docs/specs/<feature-slug>/spec.md` exists and its Status is `approved` (e.g. written before a Phase 1 Step 5 re-entry) |
| E2E | Every interaction between two features has its own test case | The feature |
| Manual Check | Whole app, empty state through every Must feature in usage order | The feature |
| Ship | One commit, one PR; every Must feature `shipped` | One commit, one PR; this feature `shipped`; then the next `pending` feature restarts at Step 1 |
| Session log section | `## <project-slug>` | `## <feature-slug>`, one per feature |

**Skip detection.** If the spec exists **and** is `approved`, log `skipped (spec exists)` and go to Step 2 without re-asking. A `draft` spec, or a log marking Step 1 `in progress`, means it was never approved: resume Step 1.

**Under `scope: feature`**, read `kit/guides/phase-2-feature-scope.md` (feature loop, parallel features) before selecting a feature.

---

## Mid-Cycle Escape (`scope: all` → `feature`)

Stop the cycle if any of these surfaces:
- A feature is much more complex than estimated (L-sized in practice)
- A spec gap that substantially re-scopes a feature
- A technical decision that invalidates later features' specs
- A second domain (a distinct area needing a different specialist skill or a separate deployable concern — definition in `p1-04-roadmap.md`; UI plus API is one domain) holds ≥ 20% of the plan's tasks (Step 2 checks this — see `p2-02-plan.md`), or two independent domains emerge during implementation

Revise the affected spec sections, then (after user confirmation) set `Phase 2 Scope: feature` in `docs/roadmap.md` and `phase2_scope` to `feature` in `docs/backlog.json`, and run each remaining Must feature from Step 1, seeding its spec from its section of `docs/specs/spec.md`.

---

## Run State and Handover

- **Session log:** `docs/phase-2-session.md`, one section per feature (per the table above), created at Step 1 (schema and cadence: `kit/session-logging.md`).
- **Handover:** `kit/guides/session-handover.md` covers every pause inside Phase 2 (`Unit` = feature slug, or project slug under `scope: all`; resume at the step in the session log). The Phase 1 → Phase 2 handoff prompt is separate (`kit/phase-1-bootstrap.md`). Clean seams: after Step 2 (Plan), Step 3 (Implement), Step 4 (Review), and, under `scope: feature` with `pending` features left, Step 7 (Ship: Ship asks whether to start the next feature, hand over, or stop).
- **No per-task commits.** Changes accumulate on the feature branch; Ship commits them (a handover may commit earlier).
- **Shipped events:** Ship appends a `shipped` event per feature to `docs/backlog.json`; `docs/backlog.html` and the roadmap table are rendered from it.
