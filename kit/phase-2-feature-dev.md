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
- **Outputs** — what you have by the end of this step (not necessarily a structured file — the skills produce their own internal artifacts; this describes the *result* from your perspective)
- **Gate** — `none` / `soft` / `hard` — see `kit/gate-management.md` for gate type definitions
- **Notes** — special handling, gaps to watch for

## Orchestrator Conventions

> Before starting any step, read `kit/phase-2-checklist.md` — the Standard Loop section for that step plus the Universal section at the top.

Read `kit/orchestrator-conventions.md` for the universal rules every orchestrating agent must follow: step banner format, time recording, PROJECT_ROOT requirement, file-write verification, gate summary protocol, and the fail-fast write instruction.

Read `kit/session-logging.md` for the session log schema and the Phase 2 Standard Loop starter template.

---

## Step 1 — Brainstorm and Spec

- **Skill**: `brainstorming` skill
- **Trigger**: Orchestrator selects the next `pending` feature from `docs/roadmap.md`
- **Inputs**: The feature's entry in `docs/roadmap.md`; `docs/constitution.md`; `docs/architecture.md`; `docs/DESIGN.md`
- **Output**: `docs/specs/<feature-slug>/spec.md` — acceptance criteria, edge cases, UI behavior, non-goals, open questions resolved
- **Gate**: `hard` — the `brainstorming` skill has a built-in user approval gate on the written spec; the orchestrator does not advance until the user explicitly approves
- **Gate Summary**: *"The spec for [feature name] is done — acceptance criteria, edge cases, and non-goals are defined. Does this correctly describe the feature as you want it built?"*
- **Notes**:
  - The `brainstorming` skill handles the full loop: clarifying questions → proposed approaches → design sections → written spec → user review.
  - Scope must stay within the feature's roadmap entry. If brainstorming reveals the feature is larger than the estimate, flag this and re-agree scope before proceeding — do not silently expand.
  - The spec is a single feature, never multiple features batched together.
  - The spec must check compliance against `docs/constitution.md`.
  - When the user approves, the terminal state is `docs/specs/<feature-slug>/spec.md`. Do not invoke `writing-plans` from inside the skill — that is the next step.

---

## Step 2 — Plan

- **Skill**: `writing-plans` skill
- **Trigger**: `docs/specs/<feature-slug>/spec.md` exists and is approved (Step 1 gate passed)
- **Inputs**: `docs/specs/<feature-slug>/spec.md`; `docs/architecture.md`; `docs/constitution.md`
- **Output**: `docs/specs/<feature-slug>/plan.md` — ordered implementation plan with concrete tasks; each task has exact files, interfaces, test steps, and implementation steps; no placeholders
- **Gate**: `soft` — present a plan summary before advancing; do not dispatch Step 3 silently
- **Notes**:
  - The skill's self-review loop (placeholder scan, spec coverage, type consistency check) must complete before the plan is used in Step 3.
  - Tasks must be marked parallel vs. sequential based on file scope — this is what Step 3 uses to decide the dispatch strategy.
  - The plan must validate against `docs/architecture.md` and `docs/constitution.md` before it is finalized.
  - **Gate behaviour:** After the plan is written, present a summary (task count, files, key decisions, parallel groups identified) and give the user an opportunity to request changes before advancing to Step 3. A soft gate is not a silent advance — it is an advance with visibility.

---

## Step 3 — Assign Specialists

- **Who**: You (or your general-purpose agent reviewing the plan)
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

- **Skill**: `subagent-driven-development` skill (sequential tasks) or `dispatching-parallel-agents` skill (parallel groups identified in Step 3)
- **Trigger**: `plan.md` exists with `Specialist:` annotations (Step 3 complete)
- **Inputs**: `plan.md` with specialist annotations; `docs/specs/<feature-slug>/spec.md`; `docs/constitution.md`
- **Output**: Code changes on a feature branch
- **Gate**: `soft` — recommended: review the first 3–5 tasks before continuing unattended when working in an unfamiliar codebase pattern for the first time
- **Notes**:
  - Use `subagent-driven-development` for sequential task chains. It dispatches one implementer subagent per task, runs a task reviewer after each, and a final whole-branch review at the end. Use the `Specialist:` annotation from Step 3 to select the right agent for each task.
  - For groups marked `<!-- Parallel group -->` in `plan.md` (identified in Step 3), use `dispatching-parallel-agents` instead. Do not re-evaluate which tasks can parallelize here — that decision was made in Step 3.
  - Do not commit after individual tasks during implementation. Leave all changes uncommitted until the user has reviewed the complete feature and explicitly approves shipping.
  - **`design-taste-frontend` skill — required for UI tasks:** when dispatching `frontend-developer` for any task whose description contains signals from the second row of `task-agent-rubric.md` ("visual quality", "design upgrade", "polish", "no generic patterns", "premium UI"), include the `design-taste-frontend` skill in the dispatch. This is not optional — generic AI UI patterns are the most common quality failure in Phase 2 output.

---

## Step 5 — Converge

- **Agent**: Your general-purpose agent (spec-coverage analysis)
- **Trigger**: All tasks in `plan.md` complete; feature branch ready
- **Inputs**: `docs/specs/<feature-slug>/spec.md` (acceptance criteria list); full branch diff
- **Output**: Convergence report — COVERED / GAP per acceptance criterion; empty gap list = converged
- **Gate**: `none` — loops until the gap list is empty; only then advances to Step 6
- **Notes**:
  - **Converge is distinct from code review.** It asks one question: *does the implementation attempt every acceptance criterion in the spec?* Not whether the code is well-written — that is Step 6.
  - For each acceptance criterion in `spec.md`: find evidence in the branch diff (functions, tests, UI components, validation logic). Mark COVERED if evidence exists; GAP if none is found.
  - Any GAP becomes an implementation task appended to `plan.md`. Dispatch the implementer for those gap tasks only. Re-run Converge. Repeat until the gap list is empty.
  - A COVERED criterion is not a guarantee of correctness — only that an attempt was made. Correctness is verified by code review (Step 6) and E2E (Step 7).
  - Common gap sources: edge cases specified but not handled, error states documented but not coded, validation rules in spec but absent from implementation.
  - When the gap list is empty, note "Converged" in the session log and proceed.

## Step 6 — Code Review

- **Agent**: `code-reviewer`
- **Trigger**: Step 5 converged (gap list empty); feature branch ready
- **Inputs**: Full diff of the feature branch against base; `docs/specs/<feature-slug>/spec.md`; `docs/constitution.md`
- **Output**: Review findings; all issues fixed directly on the branch before advancing
- **Gate**: `none` — code review runs to completion; every finding is fixed immediately; there are no deferred findings at this stage
- **Notes**:
  - Dispatch the `code-reviewer` agent with the branch diff, spec, and constitution all as input.
  - Any finding — critical, important, or minor — is fixed in this step. Do not advance to E2E testing with known open issues.
  - Architectural disagreements with `docs/constitution.md` must be called out explicitly, not silently fixed.
  - If this step's review reveals a spec gap (something the spec did not cover but the implementation made a decision about), document the decision in the spec before advancing.

---

## Step 7 — End-to-End Testing

- **Agent**: `qa-expert` agent (test planning and execution); `ui-ux-tester` agent (for UI-heavy flows with browser interaction)
- **Trigger**: Step 6 complete with all issues resolved
- **Inputs**: Running application (started fresh for this test run); `docs/specs/<feature-slug>/spec.md` (acceptance criteria); real data scenarios
- **Output**: Test results; any failure triggers an immediate fix loop and re-run of this step before advancing
- **Gate**: `soft`
- **Notes**:
  - This is a full end-to-end test of the real, running application. Not unit tests. Not mocked data. Start the actual application.
  - Walk through the complete user flow from start to finish using real data and a real process — the same path a real user would take, not a happy-path shortcut.
  - Cover every acceptance criterion in the spec. **Test shared interaction patterns (modal behavior, form validation, navigation) once per pattern — not once per acceptance criterion.** Repeated identical flows add time without additional coverage.
  - Any failure found here is fixed immediately, and this step re-runs in full — do not carry failures forward to the manual check.
  - Use `qa-expert` for backend/API/data-flow testing. Use `ui-ux-tester` when the feature has a significant UI component and browser-driven interaction verification is needed. **Model:** `ui-ux-tester` is performing UI interaction verification, not implementation judgment — a lighter/faster model is appropriate.

---

## Step 8 — Manual Double Check

- **Who**: Human only — no agent or skill
- **Trigger**: Step 7 passes with no unresolved failures
- **Inputs**: Running application
- **Output**: Human confirmation (no file output)
- **Gate**: `hard` — orchestrator must not proceed without explicit approval
- **Gate Summary**: *"E2E testing passed and the feature is complete. Please walk through it yourself in the running app — this is the last check before the code ships."*
- **Notes**:
  - One additional full walkthrough of the feature in the running application — independent of the E2E test pass.
  - This is the final safety net before code ships. It exists because E2E tests verify acceptance criteria; a human check catches things the criteria did not anticipate.
  - If anything is found here: fix it, re-run Step 7, then return to this step.

---

## Step 9 — Ship

- **Skill**: `finishing-a-development-branch` skill (for branch finalization); your general-purpose agent (for PR creation)
- **Trigger**: Step 8 gate approved
- **Inputs**: Feature branch; `docs/roadmap.md`
- **Output**: Committed and pushed feature branch; pull request opened against the main branch; `docs/roadmap.md` feature status updated to `shipped`
- **Gate**: `none`
- **Notes**:
  - Commit all changes with a clear, descriptive commit message referencing the feature slug.
  - Push the feature branch to the remote.
  - Open a pull request to the main branch — do not merge directly; do not push to main.
  - Update `docs/roadmap.md` to set this feature's `Status` column to `shipped`.
  - After this step, the orchestrator selects the next `pending` feature from `docs/roadmap.md` (in build order) and restarts at Step 1.
  - **Spec persistence:** if this is the first feature shipped on this project, decide how specs will evolve when requirements change and record the decision in `docs/constitution.md`. See `kit/guides/evolving-specs.md` for the three models: flow-forward (feature directories are immutable history), flow-back (any artifact can be updated; team reconciles afterward), living spec (`spec.md` is the contract; plan/tasks are regenerated from it when it changes).

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
[5] Converge — spec coverage check → gap tasks → re-implement → repeat until converged
         │
         ▼
[6] Code Review → fix all findings → done
         │
         ▼
[7] E2E Testing (real app, real data, full flow) → fix failures → re-run
         │
         ▼
[8] Manual Double Check [hard gate]
         │
         ▼
[9] Ship (commit + push + PR to main + update roadmap.md)
         │
         ▼
Pull next pending feature from docs/roadmap.md ─────────────────┘
```

---

## Notes on Skills

This phase uses the following skills without modifying them. Each skill is invoked as-is; the workflow just sequences them and adds the specialist assignment step between planning and implementation.

| Step | Skill / Agent | What it produces (internal) |
|---|---|---|
| 1 | `brainstorming` | Spec document + user approval |
| 2 | `writing-plans` | Plan document with tasks |
| 3 | Kit step (you) | Specialist annotations on each task |
| 4 | `subagent-driven-development` / `dispatching-parallel-agents` | Code on feature branch |
| 5 | general-purpose agent | Convergence report; gap tasks appended to plan.md |
| 6 | `code-reviewer` | Review findings, all fixed inline |
| 7 | `qa-expert` / `ui-ux-tester` | Test results, failures fixed inline |
| 8 | Human | Approval gate |
| 9 | `finishing-a-development-branch` + general-purpose agent | Committed branch + PR |
