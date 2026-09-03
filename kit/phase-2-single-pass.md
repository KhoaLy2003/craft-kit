# Phase 2 — Single-Pass (Small Projects)

> **Use this when the complete feature set is known at Phase 1 close, features are mostly S/M-sized, and there is one developer in one dominant domain.**
>
> All features are spec'd, planned, implemented, reviewed, tested, and shipped in a single cycle. No per-feature loop.
>
> Prerequisites: Phase 1 complete; `docs/roadmap.md` with all Must features `pending`; `phase-1-kickoff.md` Phase 2 approach set to `single-pass`.

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
- **Gate** — `none` / `soft` / `hard`
- **Notes** — special handling

## Orchestrator Announcement Convention

At the start of every step, the orchestrating agent MUST:
1. Emit a step banner before doing any work
2. Record the wall-clock start time and current `budget.spent()` value — get the time by running `new Date().toLocaleTimeString()` via `eval(js)` at the exact moment the step starts; do not estimate or leave as `—`
3. Include `PROJECT_ROOT: <absolute path to project folder>` in the context of every dispatched subagent task
4. After every subagent task that writes files, verify the file exists at the expected path before marking the step `complete`. If absent, recover from `agent://<id>` and write directly

```
---
Phase 2 (Single-Pass) · Step N — [Step Name]
Skill / Agent: [name]  |  Gate: [none / soft / hard]
Started: HH:MM  |  Credits at start: NNNN
---
```

At the end of every step, update `phase-2-session.md` with duration and credit delta before advancing.

## Session Log

The orchestrator creates `phase-2-session.md` at the project root at Step 1 and updates it after every step.

```markdown
# Phase 2 Session Log — Single-Pass

| Step | Name | Skill / Agent | Status | Started | Duration | Credits | Output |
|---|---|---|---|---|---|---|---|
| 1 | Full-App Spec | `brainstorming` | pending | — | — | — | — |
| 2 | Plan | `writing-plans` | pending | — | — | — | — |
| 3 | Implement | `<specialist>` | pending | — | — | — | — |
| 4 | Code Review + E2E | `code-reviewer` + `ui-ux-tester` | pending | — | — | — | — |
| 5 | Manual Check | human | pending | — | — | — | — |
| 6 | Ship | `finishing-a-development-branch` + `task` | pending | — | — | — | — |
```

- **Started** — local wall-clock time at step start (HH:MM)
- **Duration** — wall-clock minutes from step start to log update
- **Credits** — `budget.spent()` delta between step start and end
- **Output** — file or artifact produced; `—` if not yet complete

Status values: `pending` · `in progress` · `complete` · `blocked`

---

## Step 1 — Full-App Spec

- **Skill**: `/skill:brainstorming` (Architectural path)
- **Trigger**: `docs/roadmap.md` exists with all features `pending`; Phase 2 approach is `single-pass`
- **Inputs**: All Must features in `docs/roadmap.md`; `docs/architecture.md`; `docs/design-system.md`; `docs/constitution.md`
- **Output**: `specs/full-app/spec.md` — one document, one `##` section per feature in roadmap build order
- **Gate**: `hard` — you review the complete spec and approve once before implementation starts
- **Notes**:
  - The `brainstorming` skill runs in Architectural mode, scoped to the complete roadmap — not one feature. Its job is to resolve ambiguity across the full feature set before any code is written.
  - The spec is organised by feature: one `##` section per feature in build order. Each section contains: acceptance criteria, edge cases, non-goals for that feature, and how it connects to the features immediately before it.
  - During the hard gate, review section by section — but approve the document once, not per-feature. If a section is unclear, request revision before approving.
  - If review reveals a feature is more complex than its roadmap size estimate suggests, pause and resolve scope explicitly before approving. Do not start implementation against an ambiguous section.
  - Cross-feature interactions (where feature N depends on feature N-1's specific behaviour) must be made explicit in the relevant sections — not left implicit.
  - Do not invoke `writing-plans` from inside the skill. That is Step 2.

---

## Step 2 — Plan

- **Skill**: `/skill:writing-plans`
- **Trigger**: `specs/full-app/spec.md` approved (Step 1 gate passed)
- **Inputs**: `specs/full-app/spec.md`; `docs/architecture.md`; `docs/constitution.md`
- **Output**: `specs/full-app/plan.md` — ordered task list covering all features
- **Gate**: `hard` — the plan covers all features; a wrong assumption here propagates into every task downstream
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
- **Trigger**: `specs/full-app/plan.md` finalised
- **Inputs**: `specs/full-app/plan.md`; `specs/full-app/spec.md`; `docs/constitution.md`
- **Output**: All feature code on a single branch (`feature/full-app` or `feature/<project-slug>`)
- **Gate**: `soft` — review progress at the midpoint (after roughly half the tasks) if working in an unfamiliar pattern
- **Notes**:
  - **Before dispatching the agent:** the orchestrator MUST create and switch to a feature branch (`git checkout -b feature/<project-slug>`) if it does not already exist. Include the branch name in the step banner. Implementation MUST NOT begin on `main`. If no git repo exists, that is a Phase 1 gap — stop and resolve it before proceeding.
  - One agent implements all tasks in plan order using `subagent-driven-development`. No per-task specialist routing. No per-task reviewer.
  - No commits during implementation. All changes accumulate on the feature branch until Step 5 (manual check) approval.
  - If a task reveals a spec gap or contradiction, pause and update `specs/full-app/spec.md` before continuing. Do not guess and proceed.
  - If a foundational task (early in build order) fails or reveals blocking complexity that invalidates later tasks, stop and re-evaluate scope. Proceeding past a broken foundation wastes every subsequent task.
  - The agent must check every completed task against `docs/constitution.md` before moving to the next — violations caught here are cheaper than at code review.

---

## Step 4 — Code Review + E2E

- **Agents**: `code-reviewer` then `ui-ux-tester` (UI-heavy flows) and/or `qa-expert` (data/storage verification)
- **Trigger**: All tasks in `specs/full-app/plan.md` complete
- **Inputs**: Full branch diff; `specs/full-app/spec.md`; `docs/constitution.md`; running application
- **Output**: All review findings fixed; all acceptance criteria verified against the running app
- **Gate**: `none` — runs to completion; every finding and every failing criterion is fixed before advancing
- **Notes**:
  - Dispatch `code-reviewer` first. It reviews the entire branch diff — all features, all files — against the spec and constitution in one pass. All findings are fixed before E2E begins. Do not run E2E against code with known review findings open.
  - E2E testing starts the real running application and walks through the **complete user flow as a real user would** — not feature by feature, but as a finished product. Every acceptance criterion across all features in `specs/full-app/spec.md` must be exercised.
  - Pay particular attention to **cross-feature interactions** — features that work in isolation but break when combined. These are the failure mode most specific to single-pass development.
  - Any E2E failure triggers an immediate fix and a full re-run — not a partial re-run of only the failing criterion.
  - Use `ui-ux-tester` for browser-driven UI verification; `qa-expert` for storage, data integrity, and non-UI flows (e.g. export file format, localStorage error handling).

---

## Step 5 — Manual Check

- **Who**: Human only — no agent or skill
- **Trigger**: Step 4 passes with no unresolved findings or failures
- **Inputs**: Running application with all features live
- **Output**: Human confirmation (no file output)
- **Gate**: `hard` — do not ship without explicit approval
- **Notes**:
  - Walk through the complete application as a real user — from first open (empty state) through every Must feature in natural usage order.
  - This is a product walkthrough, not a checklist execution. Use the app the way its target user would. Notice what feels wrong even if it passes every criterion.
  - Cross-feature interactions are the primary target: things that work in isolation but feel wrong when combined, flows that the spec described correctly but that interact badly in practice.
  - If anything is found: fix it, re-run the affected E2E flow in Step 4, then return here. Do not ship with known issues.

---

## Step 6 — Ship

- **Skill**: `/skill:finishing-a-development-branch`; `task` agent (PR creation)
- **Trigger**: Step 5 gate approved
- **Inputs**: Feature branch; `docs/roadmap.md`
- **Output**: Committed branch; PR opened against main; all Must features in `docs/roadmap.md` marked `shipped`
- **Gate**: `none`
- **Notes**:
  - One commit covering all features. Commit message describes the complete scope (e.g. `feat: complete reading list MVP — F01 through F11`).
  - Push the branch and open a PR against main — do not merge directly.
  - Update `docs/roadmap.md`: set `Status` to `shipped` for every feature implemented in this pass.
  - Phase 2 is complete. If the roadmap gains new features later, use the standard loop (`phase-2-feature-dev.md`) for each subsequent feature — single-pass is for the initial complete build only.

---

## Flow Diagram

```
All roadmap Must features known + single-pass declared in phase-1-kickoff.md
         │
         ▼
[1] Full-App Spec — one document, one section per feature  [hard gate]
         │
         ▼
[2] Plan — all tasks, dependency order, dominant specialist identified
         │
         ▼
[3] Implement — one specialist, all tasks, one branch, no commits yet
         │
         ▼
[4] Code Review → fix all findings → E2E complete flow → fix all failures
         │
         ▼
[5] Manual Check — complete app walkthrough as a real user  [hard gate]
         │
         ▼
[6] Ship — one commit, one PR, all Must features → shipped
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
