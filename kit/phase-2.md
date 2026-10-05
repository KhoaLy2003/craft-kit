# Phase 2 — Build

> **Status:** scope `feature` is experimental — not yet validated in a test round. Scope `all` is validated.
>
> One orchestration script for the whole build phase. The same 7 steps run in one of two scopes:
> - **`scope: all`** — every Must feature in `docs/roadmap.md` is specced, planned, built, reviewed, tested, and shipped in one cycle.
> - **`scope: feature`** — one feature per cycle, repeated in build order. Never batch features.
>
> Scope `all` is for the initial complete build only. Later releases run `scope: feature`.

**Prerequisites:** Phase 1 complete, or an existing project with `docs/constitution.md`, `docs/architecture.md`, and `docs/DESIGN.md` in place. `docs/roadmap.md` states `Phase 2 Scope: all | feature`; if the field is absent (existing project), apply the selection rule in `kit/steps/phase-1/p1-04-roadmap.md` and record the result in the roadmap before Step 1.

**Conventions:** read `kit/orchestrator-conventions.md` (banner, PROJECT_ROOT, write verification, fail-fast write instruction, gates, frontend dispatch) and `kit/session-logging.md` before starting. Each step file is the authoritative source for that step's inputs, outputs, rules, and completion criteria; read it before running the step.

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
| 4 | `code-reviewer` | Acceptance-criteria coverage verdict; all findings fixed |
| 5 | general-purpose agent, `ui-ux-tester` | `docs/E2E-TESTS.md`; test results |
| 6 | Human | Approval |
| 7 | `finishing-a-development-branch` + general-purpose agent | Commit, PR, roadmap updated |

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
| Skip Step 1 when | `docs/specs/spec.md` exists | `docs/specs/<feature-slug>/spec.md` exists (e.g. written before a Phase 1 Step 5 re-entry) |
| E2E | Cross-feature interactions tested exhaustively | The feature |
| Manual Check | Whole app, empty state through every Must feature in usage order | The feature |
| Ship | One commit, one PR; every Must feature `shipped` | One commit, one PR; this feature `shipped`; then the next `pending` feature restarts at Step 1 |
| Session log section | `## <project-slug>` | `## <feature-slug>`, one per feature |

**Skip detection.** When the Step 1 skip condition is met, record `skipped (spec exists)` in the session log and go to Step 2 without re-asking for approval — the gate was already passed. Exception: if the log marks Step 1 `in progress` for this unit, the spec was never approved; resume Step 1 instead.

**Feature loop (`scope: feature`).** Select the next `pending` feature in build order (dependency-driven, not MoSCoW). Run Steps 1–7. Start a new log section and repeat.

---

## Mid-Cycle Escape (`scope: all` → `feature`)

Stop the cycle if any of these surfaces:
- A feature is much more complex than estimated (L-sized in practice)
- A spec gap that substantially re-scopes a feature
- A technical decision that invalidates later features' specs
- A minority specialist ends up with a large share of the tasks (Step 2 checks this — see `p2-02-plan.md`), or two independent domains emerge during implementation

Revise the affected spec sections, set `Phase 2 Scope: feature` in `docs/roadmap.md`, and run each remaining Must feature as its own cycle from Step 1, seeding its spec from its section of `docs/specs/spec.md`. Switching is the correct response to discovered complexity, not a failure.

---

## Run State and Handover

- **Session log:** `docs/phase-2-session.md`, one section per feature (per the table above), created at Step 1; its header copies the tier→model map from `docs/MODELS.md` once. Update it at each gate and at completion, not after every step. Schema: `kit/session-logging.md`.
- **Handover:** one mechanism for the whole phase — `kit/guides/session-handover.md` (its `Unit` is the feature slug, or the project slug under `scope: all`; resume at the step recorded in the session log). Phase 2's clean seams are after Step 2 (Plan), Step 3 (Implement), and Step 4 (Review).
- **No per-task commits.** Changes accumulate on the feature branch; Ship commits them (a handover may commit earlier).
