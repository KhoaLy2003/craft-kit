# Phase 2 — Feature Development

> **Run this cycle for every feature in `roadmap.md`, including the very first MVP feature.**
> Every feature goes through the full cycle independently — never batch multiple features together.
>
> Prerequisites: Phase 1 complete, OR an existing project with `constitution.md` in place.

---

## How to Read This Document

Each step is documented with:
- **Skill/Agent** — what to invoke
- **Trigger** — what causes this step to start
- **Inputs** — context/files this step reads
- **Outputs** — what you have by the end of this step (not necessarily a structured file — the superpowers skills produce their own internal artifacts; this describes the *result* from your perspective)
- **Gate** — `none` / `soft` / `hard`
- **Notes** — special handling, gaps to watch for

## Orchestrator Announcement Convention

At the start of every step, the orchestrating agent MUST:
1. Emit a step banner before doing any work
2. Record the wall-clock start time and current `budget.spent()` value — get the time by running `new Date().toLocaleTimeString()` via `eval(js)` at the exact moment the step starts; do not estimate or leave as `—`
3. Include `PROJECT_ROOT: <absolute path to project folder>` in the context of every dispatched subagent task — subagents resolve file paths relative to the workspace root, not the project folder, and will write outputs to the wrong location without an explicit path
4. After every subagent task that writes files, verify the file exists at the expected path before marking the step `complete`. If absent, recover from `agent://<id>` and write directly

```
---
Phase 2 · Step N — [Step Name]  |  Feature: [feature-slug]
Skill / Agent: [name]  |  Gate: [none / soft / hard]
Started: HH:MM  |  Credits at start: NNNN
---
```

At the end of every step, update `phase-2-session.md` with duration and credit delta before advancing.

## Session Log

The orchestrator maintains a `phase-2-session.md` file at the project root for each feature cycle. Created at Step 1, updated after every step.

```markdown
# Phase 2 Session Log — [feature-slug]

| Step | Name | Skill / Agent | Status | Started | Duration | Credits | Output |
|---|---|---|---|---|---|---|---|
| 1 | Brainstorm & Spec | `brainstorming` | complete | 10:00 | 18 min | 290 | `specs/[slug]/spec.md` |
| 2 | Plan | `writing-plans` | complete | 10:18 | 4 min | 180 | `specs/[slug]/plan.md` |
| 3 | Assign Specialists | manual / `task` | in progress | 10:22 | — | — | — |
...
```

- **Started** — local wall-clock time at step start (HH:MM)
- **Duration** — wall-clock minutes from step start to log update
- **Credits** — `budget.spent()` delta between step start and end (OMP credits; check dashboard for USD equivalent)
- **Output** — file produced; `—` if step is not yet complete

Status values: `pending` · `in progress` · `complete` · `skipped` · `blocked`

The session log is the user's single source of truth for what ran, how long it took, and what it cost. It does not replace the gate outputs — it points to them.
---

## Step 1 — Brainstorm and Spec

- **Skill**: `/skill:brainstorming`
- **Trigger**: Orchestrator selects the next `pending` feature from `docs/roadmap.md`
- **Inputs**: The feature's entry in `docs/roadmap.md`; `docs/constitution.md`; `docs/architecture.md`; `docs/design-system.md`
- **Output**: `specs/<feature-slug>/spec.md` — acceptance criteria, edge cases, UI behavior, non-goals, open questions resolved
- **Gate**: `hard` — the `brainstorming` skill has a built-in user approval gate on the written spec; the orchestrator does not advance until the user explicitly approves
- **Notes**:
  - The `brainstorming` skill handles the full loop: clarifying questions → proposed approaches → design sections → written spec → user review.
  - Scope must stay within the feature's roadmap entry. If brainstorming reveals the feature is larger than the estimate, flag this and re-agree scope before proceeding — do not silently expand.
  - The spec is a single feature, never multiple features batched together.
  - The spec must check compliance against `docs/constitution.md`.
  - When the user approves, the terminal state is `specs/<feature-slug>/spec.md`. Do not invoke `writing-plans` from inside the skill — that is the next step.

---

## Step 2 — Plan

- **Skill**: `/skill:writing-plans`
- **Trigger**: `specs/<feature-slug>/spec.md` exists and is approved (Step 1 gate passed)
- **Inputs**: `specs/<feature-slug>/spec.md`; `docs/architecture.md`; `docs/constitution.md`
- **Output**: `specs/<feature-slug>/plan.md` — ordered implementation plan with concrete tasks; each task has exact files, interfaces, test steps, and implementation steps; no placeholders
- **Gate**: `soft` — present a plan summary before advancing; do not dispatch Step 3 silently
- **Notes**:
  - The skill's self-review loop (placeholder scan, spec coverage, type consistency check) must complete before the plan is used in Step 3.
  - Tasks must be marked parallel vs. sequential based on file scope — this is what Step 3 uses to decide the dispatch strategy.
  - The plan must validate against `docs/architecture.md` and `docs/constitution.md` before it is finalized.
  - **Gate behaviour:** After the plan is written, present a summary (task count, files, key decisions, parallel groups identified) and give the user an opportunity to request changes before advancing to Step 3. A soft gate is not a silent advance — it is an advance with visibility.

---

## Step 3 — Assign Specialists

- **Who**: You (or a `task` agent reviewing the plan)
- **Trigger**: `plan.md` finalized
- **Inputs**: `plan.md`; `task-agent-rubric.md` (this kit)
- **Output**: `plan.md` with each task annotated with `Specialist:` — the agent that should implement it
- **Gate**: `none`
- **Notes**:
  - This is the bridge between the plan and the implementation dispatch. `writing-plans` does not know which specialist agent to use for each task; this step fills that gap.
  - Use `task-agent-rubric.md` as a reference for matching task types to available agents.
  - Add a `Specialist:` line to each task in the plan. Example:

    ```markdown
    ### Task 2: Build login form component
    **Specialist:** frontend-developer
    - Files: Create: src/components/LoginForm.tsx
    ...
    ```

  - If a task spans multiple domains (e.g., frontend + backend), split it into two tasks before annotating. A task with two specialists is a task that is too large.
  - Tasks with `Specialist: task` use the general-purpose agent — appropriate for infrastructure, config, or tasks that don't fit a clear domain.
  - After annotation, review the full set: tasks sharing a domain that are independent of each other are candidates for parallel dispatch in Step 4.

---

## Step 4 — Implement

- **Skill**: `/skill:subagent-driven-development` (sequential tasks) or `/skill:dispatching-parallel-agents` (parallel groups identified in Step 3)
- **Trigger**: `plan.md` exists with `Specialist:` annotations (Step 3 complete)
- **Inputs**: `plan.md` with specialist annotations; `specs/<feature-slug>/spec.md`; `docs/constitution.md`
- **Output**: Code changes on a feature branch
- **Gate**: `soft` — recommended: review the first 3–5 tasks before continuing unattended when working in an unfamiliar codebase pattern for the first time
- **Notes**:
  - Use `subagent-driven-development` for sequential task chains. It dispatches one implementer subagent per task, runs a task reviewer after each, and a final whole-branch review at the end. Use the `Specialist:` annotation from Step 3 to select the right agent for each task.
  - For groups marked `<!-- Parallel group -->` in `plan.md` (identified in Step 3), use `dispatching-parallel-agents` instead. Do not re-evaluate which tasks can parallelize here — that decision was made in Step 3.
  - Do not commit after individual tasks during implementation. Leave all changes uncommitted until the user has reviewed the complete feature and explicitly approves shipping.
  - `subagent-driven-development` already includes a final whole-branch code review internally. Step 5 is an additional review on top of that — it covers spec compliance and constitution adherence with the full feature context.

---

## Step 5 — Code Review

- **Agent**: `code-reviewer`
- **Trigger**: All tasks in `plan.md` complete; feature branch ready
- **Inputs**: Full diff of the feature branch against base; `specs/<feature-slug>/spec.md`; `docs/constitution.md`
- **Output**: Review findings; all issues fixed directly on the branch before advancing
- **Gate**: `none` — code review runs to completion; every finding is fixed immediately; there are no deferred findings at this stage
- **Notes**:
  - Dispatch the `code-reviewer` agent with the branch diff, spec, and constitution all as input.
  - Any finding — critical, important, or minor — is fixed in this step. Do not advance to E2E testing with known open issues.
  - Architectural disagreements with `docs/constitution.md` must be called out explicitly, not silently fixed.
  - If this step's review reveals a spec gap (something the spec did not cover but the implementation made a decision about), document the decision in the spec before advancing.

---

## Step 6 — End-to-End Testing

- **Agent**: `qa-expert` agent (test planning and execution); `ui-ux-tester` agent (for UI-heavy flows with browser interaction)
- **Trigger**: Step 5 complete with all issues resolved
- **Inputs**: Running application (started fresh for this test run); `specs/<feature-slug>/spec.md` (acceptance criteria); real data scenarios
- **Output**: Test results; any failure triggers an immediate fix loop and re-run of this step before advancing
- **Gate**: `soft`
- **Notes**:
  - This is a full end-to-end test of the real, running application. Not unit tests. Not mocked data. Start the actual application.
  - Walk through the complete user flow from start to finish using real data and a real process — the same path a real user would take, not a happy-path shortcut.
  - Cover every acceptance criterion in the spec.
  - Any failure found here is fixed immediately, and this step re-runs in full — do not carry failures forward to the manual check.
  - Use `qa-expert` for backend/API/data-flow testing. Use `ui-ux-tester` when the feature has a significant UI component and browser-driven interaction verification is needed.

---

## Step 7 — Manual Double Check

- **Who**: Human only — no agent or skill
- **Trigger**: Step 6 passes with no unresolved failures
- **Inputs**: Running application
- **Output**: Human confirmation (no file output)
- **Gate**: `hard` — orchestrator must not proceed without explicit approval
- **Notes**:
  - One additional full walkthrough of the feature in the running application — independent of the E2E test pass.
  - This is the final safety net before code ships. It exists because E2E tests verify acceptance criteria; a human check catches things the criteria did not anticipate.
  - If anything is found here: fix it, re-run Step 6, then return to this step.

---

## Step 8 — Ship

- **Skill**: `/skill:finishing-a-development-branch` (for branch finalization); `task` agent (for PR creation)
- **Trigger**: Step 7 gate approved
- **Inputs**: Feature branch; `docs/roadmap.md`
- **Output**: Committed and pushed feature branch; pull request opened against the main branch; `docs/roadmap.md` feature status updated to `shipped`
- **Gate**: `none`
- **Notes**:
  - Commit all changes with a clear, descriptive commit message referencing the feature slug.
  - Push the feature branch to the remote.
  - Open a pull request to the main branch — do not merge directly; do not push to main.
  - Update `docs/roadmap.md` to set this feature's `Status` column to `shipped`.
  - After this step, the orchestrator selects the next `pending` feature from `docs/roadmap.md` (in build order) and restarts at Step 1.

---

## Flow Diagram

```
Pull next pending feature from docs/roadmap.md
         │
         ▼
[1] Brainstorm & Spec [hard gate]
         │
         ▼
[2] Plan
         │
         ▼
[3] Assign Specialists   ← kit-specific bridge step
         │
         ▼
[4] Implement (subagent-driven / parallel dispatch)
         │
         ▼
[5] Code Review → fix all findings → done
         │
         ▼
[6] E2E Testing (real app, real data, full flow) → fix failures → re-run
         │
         ▼
[7] Manual Double Check [hard gate]
         │
         ▼
[8] Ship (commit + push + PR to main + update roadmap.md)
         │
         ▼
Pull next pending feature from docs/roadmap.md ─────────────────┘
```

---

## Notes on Superpowers Skills

This phase uses the following skills without modifying them. Each skill is invoked as-is; the workflow just sequences them and adds the specialist assignment step between planning and implementation.

| Step | Skill / Agent | What it produces (internal) |
|---|---|---|
| 1 | `brainstorming` | Spec document + user approval |
| 2 | `writing-plans` | Plan document with tasks |
| 3 | Kit step (you) | Specialist annotations on each task |
| 4 | `subagent-driven-development` / `dispatching-parallel-agents` | Code on feature branch |
| 5 | `code-reviewer` | Review findings, all fixed inline |
| 6 | `qa-expert` / `ui-ux-tester` | Test results, failures fixed inline |
| 7 | Human | Approval gate |
| 8 | `finishing-a-development-branch` + `task` | Committed branch + PR |
