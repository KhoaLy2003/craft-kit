# Phase 2 — Build

> **Status:** scope `feature` is experimental — not yet validated in a test round. Scope `all` is validated.
>
> One orchestration script for the whole build phase. The same 7 steps run in one of two scopes:
> - **`scope: all`** — every Must feature in `docs/backlog.json` is specced, planned, built, reviewed, tested, and shipped in one cycle.
> - **`scope: feature`** — one feature per cycle, repeated in build order. Never batch features.
>
> Scope `all` is for the initial complete build only. Later releases may run `scope: feature` (experimental, as noted above); the user confirms the choice.

**Prerequisites:** Phase 1 complete, or an existing project with `docs/constitution.md`, `docs/architecture.md`, `docs/data-model.md`, `docs/flows.md`, and `docs/DESIGN.md` in place (not sure which workflow fits an existing project? `kit/START.md` routes you). `docs/backlog.json` holds the features and their status; Phase 2 reads it to select `pending` features in build order (`docs/roadmap.md`). `docs/roadmap.md` states `Phase 2 Scope: all | feature`; if the field is absent (existing project), apply the selection rule in `kit/steps/phase-1/p1-04-roadmap.md` and record the result in the roadmap before Step 1. **Which features are built:** `scope: all` builds the Must features only; Should features stay `pending` and are built in a later cycle after the Must features ship. Phase 1 Step 5 designs Must and Should so those later cycles already have designs (rule: `kit/steps/phase-1/p1-05-screen-design.md`).

**Docs preflight (before Step 1 of every new unit).** If `docs/constitution.md` or `docs/architecture.md` is missing, stop, tell the user, and point to `kit/phase-adopt.md` (existing code with no kit documents) or Phase 1 (new product). If `docs/data-model.md` or `docs/flows.md` is missing or not `approved`, or `docs/constitution.md` lacks a `## Verification Commands` section, stop, tell the user, and run `kit/phase-upgrade.md`; proceed only after it completes. Exemption: a unit whose session log already shows Step 2 or later started finishes without them; run the upgrade before the next unit. **Version check (warn only, never block):** compare `kit_version` in `docs/.craft-kit.json` with `.craft-kit-version` in the installed kit directory. If the file is missing or the project's version is older, warn the user and suggest running `kit/phase-upgrade.md`; if the project's version is newer, suggest reinstalling the kit with `--force`. **Docs lint:** run `node kit/scripts/lint-docs.js` (conventions rule 11); fix errors before Step 1, show warnings (stale artifacts) to the user, never block on them.

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

**Skip detection.** When the Step 1 skip condition is met (the spec exists **and** its Status is `approved`), record `skipped (spec exists)` in the session log and go to Step 2 without re-asking for approval — the gate was already passed. If the spec exists with any other Status (`draft`), or the log marks Step 1 `in progress` for this unit, the spec was never approved; resume Step 1 instead.

**Feature loop (`scope: feature`).** Select a `pending` feature whose `depends_on` features are all `shipped`, in build order. For a Phase 3 release, also follow the release block's **Work Packages** table: a feature enters Step 3 only when every feature in the earlier groups has `shipped`. Run Steps 1–7, then start a new log section and repeat.

**Parallel features.** Features of the same group may be in flight at once, each in its own session, worktree, or developer's checkout, each on its own `feature/<feature-slug>` branch created per `kit/steps/phase-2/p2-03-implement.md`. Never select a feature that is `in-progress` or whose log section shows a step started. Each cycle reads the wave design already applied to `docs/data-model.md`, `docs/flows.md`, and `docs/architecture.md`, never rewrites a Shared Surface item it does not own, and sends a missing entity, field, screen, or contract to `kit/phase-3-iterate.md` Step 4 ("Design change requests") instead of patching it. When PRs touch `docs/backlog.json`, `docs/phase-2-session.md`, or `docs/E2E-TESTS.md` at once and the merge conflicts, keep both sides' entries and run `node kit/scripts/render-backlog.js` again; never discard an event.

---

## Mid-Cycle Escape (`scope: all` → `feature`)

Stop the cycle if any of these surfaces:
- A feature is much more complex than estimated (L-sized in practice)
- A spec gap that substantially re-scopes a feature
- A technical decision that invalidates later features' specs
- A second domain (a distinct area needing a different specialist skill or a separate deployable concern — definition in `p1-04-roadmap.md`; UI plus API is one domain) holds ≥ 20% of the plan's tasks (Step 2 checks this — see `p2-02-plan.md`), or two independent domains emerge during implementation

Revise the affected spec sections, set `Phase 2 Scope: feature` in `docs/roadmap.md` and `phase2_scope` to `feature` in `docs/backlog.json` (only after the user confirms; `scope: feature` is experimental), and run each remaining Must feature as its own cycle from Step 1, seeding its spec from its section of `docs/specs/spec.md`. Switching is the correct response to discovered complexity, not a failure.

---

## Run State and Handover

- **Session log:** `docs/phase-2-session.md`, one section per feature (per the table above), created at Step 1; its header copies the tier→model map from `docs/MODELS.md` once. Update it at each gate and at completion, not after every step. Schema: `kit/session-logging.md`.
- **Handover:** `kit/guides/session-handover.md` is the one mid-phase mechanism for every pause inside Phase 2 (its `Unit` is the feature slug, or the project slug under `scope: all`; resume at the step recorded in the session log). The one-time Phase 1 → Phase 2 handoff prompt is separate and is owned by `kit/phase-1-bootstrap.md`. Phase 2's clean seams are after Step 2 (Plan), Step 3 (Implement), Step 4 (Review), and, under `scope: feature` with `pending` features left, Step 7 (Ship: Ship asks whether to start the next feature, hand over, or stop).
- **No per-task commits.** Changes accumulate on the feature branch; Ship commits them (a handover may commit earlier).
- **Shipped events:** Ship appends a `shipped` event per feature to `docs/backlog.json`; `docs/backlog.html` and the roadmap table are rendered from it.
