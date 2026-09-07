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
> - Features span multiple domains (e.g. frontend + backend) requiring different specialist agents
> - The feature set is likely to grow significantly after Phase 2 begins
> - More than ~15 Must features in the roadmap

---

## How to Read This Document

Each step is documented with:
- **Skill/Agent** — what to invoke
- **Trigger** — what causes this step to start
- **Inputs** — context/files this step reads
- **Outputs** — what you have by the end of this step
- **Gate** — `none` / `soft` / `hard` — see `kit/gate-management.md` for gate type definitions
- **Notes** — special handling

## Orchestrator Conventions

> Before starting any step, read `kit/phase-2-checklist.md` — the Single-Pass section for that step plus the Universal section at the top.

Read `kit/orchestrator-conventions.md` for the universal rules every orchestrating agent must follow: step banner format, time recording, PROJECT_ROOT requirement, file-write verification, gate summary protocol, and the fail-fast write instruction.

Read `kit/session-logging.md` for the session log schema and the Phase 2 Single-Pass starter template.

---

## Step 1 — Full-App Spec

- **Skill**: `brainstorming` skill (Architectural path)
- **Trigger**: `docs/roadmap.md` exists with all features `pending`; Phase 2 approach is `single-pass`
- **Inputs**: All Must features in `docs/roadmap.md`; `docs/architecture.md`; `docs/DESIGN.md`; `docs/constitution.md`
- **Output**: `docs/specs/spec.md` — one document, one `##` section per feature in roadmap build order
- **Gate**: `hard` — you review the complete spec and approve once before implementation starts
- **Gate Summary**: *"The full-app spec is ready — one section per feature with acceptance criteria and edge cases. This is the most consequential approval: a wrong assumption here propagates into every feature. Review each section before approving."*
- **Notes**:
  - The `brainstorming` skill runs in Architectural mode, scoped to the complete roadmap — not one feature. Its job is to resolve ambiguity across the full feature set before any code is written.
  - The spec is organised by feature: one `##` section per feature in build order. Each section contains: acceptance criteria, edge cases, non-goals for that feature, and how it connects to the features immediately before it.
  - During the hard gate, review section by section — but approve the document once, not per-feature. If a section is unclear, request revision before approving.
  - If review reveals a feature is more complex than its roadmap size estimate suggests, pause and resolve scope explicitly before approving. Do not start implementation against an ambiguous section.
  - Cross-feature interactions (where feature N depends on feature N-1's specific behaviour) must be made explicit in the relevant sections — not left implicit.
  - Do not invoke `writing-plans` from inside the skill. That is Step 2.

---

## Step 2 — Plan

- **Skill**: `writing-plans` skill
- **Trigger**: `docs/specs/spec.md` approved (Step 1 gate passed)
- **Inputs**: `docs/specs/spec.md`; `docs/architecture.md`; `docs/constitution.md`
- **Gate**: `hard` — the plan covers all features; a wrong assumption here propagates into every task downstream
- **Gate Summary**: *"The implementation plan is ready. Review the task summary above — once approved, implementation begins and covers all features in one pass."*
- **Notes**:
  - Tasks are sequenced by the roadmap's build order (dependency-driven), not MoSCoW priority. A data-layer task from an early feature comes before a UI task from a later feature if the UI depends on the data layer.
  - Tasks from different features may interleave where dependencies require it.
  - Identify the **dominant specialist** here: the single agent type that handles the majority of tasks. For a frontend-only app this is `frontend-developer`. If tasks genuinely split across two domains, this project is not a good fit for the single-pass track — switch to `phase-2-feature-dev.md`.
  - The plan must validate against `docs/architecture.md` and `docs/constitution.md` before it is finalised.
  - No specialist routing step (unlike the standard track). One specialist implements everything in Step 3.
  - **Gate behaviour:** Present a summary of the plan (task count, files created/modified, key interfaces, dominant specialist) and wait for explicit user approval before dispatching Step 3. The user may request changes to any task before approving.

---

## Step 3 — Implement

- **Skill/Agent**: Dominant specialist identified in Step 2 (e.g. `frontend-developer`)
- **Trigger**: `docs/specs/plan.md` finalised
- **Inputs**: `docs/specs/plan.md`; `docs/specs/spec.md`; `docs/constitution.md`
- **Output**: All feature code on a single branch (`feature/full-app` or `feature/<project-slug>`)
- **Gate**: `soft` — review progress at the midpoint (after roughly half the tasks) if working in an unfamiliar pattern
- **Notes**:
  - **Before dispatching the agent:** the orchestrator MUST create and switch to a feature branch (`git checkout -b feature/<project-slug>`) if it does not already exist. Include the branch name in the step banner. Implementation MUST NOT begin on `main`. If no git repo exists, that is a Phase 1 gap — stop and resolve it before proceeding.
  - One agent implements all tasks in plan order using `subagent-driven-development`. No per-task specialist routing. No per-task reviewer.
  - No commits during implementation. All changes accumulate on the feature branch until Step 6 (manual check) approval.
  - If a task reveals a spec gap or contradiction, pause and update `docs/specs/spec.md` before continuing. Do not guess and proceed.
  - If a foundational task (early in build order) fails or reveals blocking complexity that invalidates later tasks, stop and re-evaluate scope. Proceeding past a broken foundation wastes every subsequent task.
  - The agent must check every completed task against `docs/constitution.md` before moving to the next — violations caught here are cheaper than at code review.

---

## Step 4 — Converge

- **Agent**: Your general-purpose agent (spec-coverage analysis)
- **Trigger**: All implementation tasks complete; feature branch ready
- **Inputs**: `docs/specs/spec.md` (all features' acceptance criteria); full branch diff
- **Output**: Convergence report — COVERED / GAP per acceptance criterion across all features; empty gap list = converged
- **Gate**: `none` — loops until the gap list is empty; only then advances to Step 5
- **Notes**:
  - **Converge is distinct from code review.** It asks: *does the implementation attempt every acceptance criterion across every feature in the spec?* Not whether the code is well-written — that is Step 5.
  - For each acceptance criterion in each feature section of `docs/specs/spec.md`: find evidence in the branch diff. Mark COVERED if evidence exists; GAP if none is found.
  - Any GAP becomes an implementation task appended to `docs/specs/plan.md`. Dispatch the implementer for those gap tasks. Re-run Converge. Repeat until the gap list is empty.
  - A COVERED criterion is not a guarantee of correctness — only that an attempt was made. Correctness is verified by code review and E2E in Step 5.
  - Common gap sources: edge cases specified but not handled, error states documented but not coded, cross-feature interactions specified in the spec but not wired in the implementation.
  - When the gap list is empty, note "Converged" in the session log and proceed to Step 5.

## Step 5 — Code Review + E2E

- **Agents**: `code-reviewer` then `ui-ux-tester` (UI-heavy flows) and/or `qa-expert` (data/storage verification)
- **Trigger**: Step 4 converged (gap list empty)
- **Inputs**: Full branch diff; `docs/specs/spec.md`; `docs/constitution.md`; running application
- **Output**: All review findings fixed; all acceptance criteria verified against the running app
- **Gate**: `none` — runs to completion; every finding and every failing criterion is fixed before advancing
- **Notes**:
  - Dispatch `code-reviewer` first. It reviews the entire branch diff — all features, all files — against the spec and constitution in one pass. All findings are fixed before E2E begins. Do not run E2E against code with known review findings open.
  - E2E testing starts the real running application and walks through the **complete user flow as a real user would** — not feature by feature, but as a finished product. Every acceptance criterion across all features in `docs/specs/spec.md` must be exercised.
  - Pay particular attention to **cross-feature interactions** — features that work in isolation but break when combined. These are the failure mode most specific to single-pass development. Test these exhaustively. For shared interaction patterns (modal behavior, form validation, navigation) that repeat across features, test each pattern once — not once per feature.
  - Use `ui-ux-tester` for browser-driven UI verification; `qa-expert` for storage, data integrity, and non-UI flows (e.g. export file format, localStorage error handling). **Model:** `ui-ux-tester` is performing UI interaction verification, not implementation judgment — a lighter/faster model is appropriate.

---

## Step 6 — Manual Check

- **Who**: Human only — no agent or skill
- **Trigger**: Step 5 passes with no unresolved findings or failures
- **Inputs**: Running application with all features live
- **Output**: Human confirmation (no file output)
- **Gate**: `hard` — do not ship without explicit approval
- **Gate Summary**: *"All features are implemented, reviewed, and E2E tested. Please walk through the complete app as a real user — this is the last check before the code ships."*
- **Notes**:
  - Walk through the complete application as a real user — from first open (empty state) through every Must feature in natural usage order.
  - This is a product walkthrough, not a checklist execution. Use the app the way its target user would. Notice what feels wrong even if it passes every criterion.
  - Cross-feature interactions are the primary target: things that work in isolation but feel wrong when combined, flows that the spec described correctly but that interact badly in practice.
  - If anything is found: fix it, re-run the affected E2E flow in Step 5, then return here. Do not ship with known issues.

---

## Step 7 — Ship

- **Skill**: `finishing-a-development-branch` skill; your general-purpose agent (PR creation)
- **Trigger**: Step 6 gate approved
- **Inputs**: Feature branch; `docs/roadmap.md`
- **Output**: Committed branch; PR opened against main; all Must features in `docs/roadmap.md` marked `shipped`
- **Gate**: `none`
- **Notes**:
  - One commit covering all features. Commit message describes the complete scope (e.g. `feat: complete reading list MVP — F01 through F11`).
  - Push the branch and open a PR against main — do not merge directly.
  - Update `docs/roadmap.md`: set `Status` to `shipped` for every feature implemented in this pass.
  - Phase 2 is complete. If the roadmap gains new features later, use the standard loop (`phase-2-feature-dev.md`) for each subsequent feature — single-pass is for the initial complete build only.
  - **Spec persistence:** decide how specs will evolve when requirements change and record the decision in `docs/constitution.md`. See `kit/guides/evolving-specs.md` for the three models: flow-forward (feature directories are immutable history), flow-back (any artifact can be updated; team reconciles afterward), living spec (`spec.md` is the contract; plan/tasks are regenerated from it when it changes).

---

## Flow Diagram

```
All roadmap Must features known + single-pass declared in docs/roadmap.md
         │
         ▼
[1] Full-App Spec — one document, one section per feature  [hard gate]
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
[5] Code Review → fix all findings → E2E complete flow → fix all failures
         │
         ▼
[6] Manual Check — complete app walkthrough as a real user  [hard gate]
         │
         ▼
[7] Ship — one commit, one PR, all Must features → shipped
```

---

## Mid-Cycle Escape to Standard Loop

If, during this cycle, you discover:
- A feature is significantly more complex than estimated (L-sized in practice)
- A spec gap that requires substantially re-scoping a feature
- A mid-implementation technical decision that invalidates later features' specs
- The implementation reveals two genuinely independent domains that need different specialists

Stop the current cycle. Revise the spec for the affected features. Switch to `phase-2-feature-dev.md` for the remaining features, treating each remaining Must feature as an independent loop cycle.

Switching is not a failure — it is the correct response to discovered complexity.
