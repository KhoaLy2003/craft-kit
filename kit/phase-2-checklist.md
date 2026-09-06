# Phase 2 — Pre-Step Checklist

> **Read the relevant section of this file before starting each step.**
> Universal items apply to every step in both tracks.
> Items marked **[HARD GATE]** require explicit user approval before advancing.
> Items marked **[SOFT GATE]** require presenting a summary and giving the user a chance to respond — not a silent advance.
> Items marked **[BLOCK]** must pass before the step proceeds.
> Items marked **[LOOP]** repeat until a condition is met before advancing.

---

## Universal — Every Step (Both Tracks)

- [ ] Emit step banner (step number, name, skill/agent, gate type, feature slug if standard loop)
- [ ] Record start time: run `new Date().toLocaleTimeString()` via `eval(js)`
- [ ] Record `budget.spent()` at step start
- [ ] Include `PROJECT_ROOT: <absolute path>` in every subagent dispatch
- [ ] After every subagent write: verify file exists on disk; recover from `agent://` if absent
- [ ] Update `phase-2-session.md` with duration and credit delta at step end
- [ ] **Do NOT commit after individual tasks** — all changes accumulate on the feature branch until Manual Check / Step 6 approval

---

## Single-Pass Track (`phase-2-single-pass.md`)

### Step 1 — Full-App Spec

- [ ] Inputs: all Must features in `docs/roadmap.md`; `docs/architecture.md`; `docs/DESIGN.md`; `docs/constitution.md`
- [ ] `brainstorming` skill in Architectural mode — scoped to the **complete roadmap**, not one feature
- [ ] One spec document: one `##` section per feature in roadmap build order
- [ ] Cross-feature interactions made explicit in the relevant sections — not left implicit
- [ ] Do **not** invoke `writing-plans` from inside the skill — that is Step 2
- **[HARD GATE]** Review spec section by section; approve the document once (not per-feature)
  Gate Summary: *"The full-app spec is ready — one section per feature. This is the most consequential approval: a wrong assumption here propagates into every feature."*
- [ ] If a section is unclear or a feature appears larger than estimated: resolve before approving — do not approve an ambiguous section

---

### Step 2 — Plan

- [ ] Inputs: `specs/full-app/spec.md`; `docs/architecture.md`; `docs/constitution.md`
- [ ] Identify **dominant specialist** — the single agent type handling the majority of tasks
- [ ] If tasks genuinely split across two domains: this project should use the standard loop — stop and reassess track
- [ ] Tasks sequenced by dependency order (build order), not MoSCoW priority
- [ ] Plan validates against `docs/architecture.md` and `docs/constitution.md` before finalising
- **[HARD GATE]** Present plan summary (task count, files, key interfaces, dominant specialist); wait for explicit user approval
  Gate Summary: *"The implementation plan is ready — once approved, implementation begins across all features in one pass."*
- [ ] User may request changes to any task before approving

---

### Step 3 — Implement

- **[BLOCK]** Create feature branch **before dispatching**: `git checkout -b feature/<project-slug>` — confirm branch exists; do **not** implement on `main`
- [ ] Branch name in step banner
- [ ] One specialist implements all tasks in plan order; no per-task routing
- [ ] If spec gap or contradiction discovered mid-task: **pause and update spec** before continuing — do not guess
- [ ] If a foundational task fails and invalidates later tasks: stop and re-evaluate scope before continuing
- [ ] Each completed task checked against `docs/constitution.md` before the next task begins

---

### Step 4 — Converge

- [ ] For each acceptance criterion in `specs/full-app/spec.md`: find evidence in the branch diff
  - COVERED: evidence exists (function, component, validation logic, test)
  - GAP: no evidence found
- **[LOOP]** Any GAP → append gap task to plan → implement → re-run Converge → repeat until zero gaps
- **[BLOCK]** Do not advance to Step 5 until the gap list is empty
- [ ] Note "Converged" in session log before advancing

---

### Step 5 — Code Review + E2E

- [ ] `code-reviewer` first — reviews entire branch diff against spec and constitution in one pass
- **[BLOCK]** All code-review findings fixed before E2E begins — do not run E2E with known open findings
- [ ] E2E on real running application; complete user flow from start to finish; every acceptance criterion exercised
- [ ] Cross-feature interactions tested exhaustively — the failure mode most specific to single-pass
- [ ] Shared interaction patterns (modal, form validation, navigation): test once per pattern, not once per criterion
- **[BLOCK]** E2E uses batch approach: run ALL steps first → mark each FAIL (independent) or BLOCKED (caused by prior failure) → batch all FAILs to implementer → **full re-run** after all fixes confirm zero regressions

---

### Step 6 — Manual Check

- **[HARD GATE]** Human walks the complete app as a real user — from empty state through every Must feature in natural order
  Gate Summary: *"All features are implemented, reviewed, and E2E tested. Please walk through the complete app as a real user — this is the last check before the code ships."*
- [ ] This is a product walkthrough, not a checklist execution — notice what feels wrong even if it passes every criterion
- [ ] If anything found: fix → re-run Step 5 affected flow → return here
- [ ] Do not ship with known issues

---

### Step 7 — Ship

- [ ] One commit covering all features; message describes complete scope (e.g. `feat: complete <project> MVP — F01 through FNN`)
- [ ] Push branch; open PR against `main` — **do not merge directly**
- [ ] `docs/roadmap.md`: set `Status: shipped` on every feature implemented in this pass
- [ ] If first feature shipped: record spec persistence decision in `docs/constitution.md` (see `kit/guides/evolving-specs.md`)
- [ ] Phase 2 complete — any future features use standard loop (`phase-2-feature-dev.md`), not single-pass

---

## Standard Loop Track (`phase-2-feature-dev.md`)

### Step 1 — Brainstorm and Spec

- [ ] Select the next `pending` feature from `docs/roadmap.md` in **build order** (dependency-driven, not MoSCoW priority)
- [ ] Inputs: feature's roadmap entry; `docs/constitution.md`; `docs/architecture.md`; `docs/DESIGN.md`
- [ ] `brainstorming` skill handles the full loop — spec is for **one feature only**, never batched
- [ ] Scope stays within the feature's roadmap entry; if larger than estimated, flag and re-agree scope **before** proceeding
- [ ] Spec checks compliance with `docs/constitution.md`
- [ ] Do **not** invoke `writing-plans` from inside the skill — that is Step 2
- **[HARD GATE]** `brainstorming` skill's built-in user approval gate on the written spec
  Gate Summary: *"The spec for [feature name] is done — acceptance criteria, edge cases, and non-goals defined. Does this correctly describe the feature as you want it built?"*

---

### Step 2 — Plan

- [ ] Inputs: `specs/<feature-slug>/spec.md`; `docs/architecture.md`; `docs/constitution.md`
- [ ] Tasks sequenced by dependency order (build order), not priority
- [ ] Tasks marked **parallel vs. sequential** by file scope — used by Step 4 to decide dispatch strategy
- [ ] Plan validates against `docs/architecture.md` and `docs/constitution.md` before finalising
- **[SOFT GATE]** Present plan summary (task count, files, key decisions, parallel groups); give user a chance to request changes before advancing to Step 3 — a soft gate is not a silent advance

---

### Step 3 — Assign Specialists

- [ ] Use `kit/task-agent-rubric.md` to annotate each task with `Specialist: <agent>`
- [ ] Multi-domain tasks (e.g. frontend + backend): **split into two tasks first**, then annotate each
- [ ] Identify parallel groups — tasks with non-overlapping file scopes that can run concurrently in Step 4
- [ ] A task with two specialists is a task that is too large — split it

---

### Step 4 — Implement

- [ ] Sequential task chains: `subagent-driven-development`
- [ ] Parallel groups (identified in Step 3): `dispatching-parallel-agents`
- [ ] Do not re-evaluate parallel groups here — that decision was made in Step 3
- [ ] Do **not** commit after individual tasks; leave all changes uncommitted until Step 8 approval

---

### Step 5 — Converge

- [ ] For each acceptance criterion in `specs/<feature-slug>/spec.md`: find evidence in the branch diff
  - COVERED: evidence exists
  - GAP: no evidence found
- **[LOOP]** Any GAP → append gap task to plan → dispatch implementer for gap tasks only → re-run Converge → repeat until zero gaps
- **[BLOCK]** Do not advance to Step 6 until the gap list is empty
- [ ] Note "Converged" in session log before advancing

---

### Step 6 — Code Review

- [ ] `code-reviewer` reviews the **entire branch diff** against `specs/<feature-slug>/spec.md` and `docs/constitution.md`
- **[BLOCK]** Every finding — critical, important, or minor — fixed before advancing; no deferred findings
- [ ] Architectural disagreements with `docs/constitution.md` called out explicitly, not silently fixed
- [ ] Spec gap discovered during review: document the implementation decision in the spec before advancing

---

### Step 7 — End-to-End Testing

- [ ] Real running application; real data; complete flow — not mocked, not unit tests
- [ ] Every acceptance criterion in `specs/<feature-slug>/spec.md` exercised
- [ ] Shared interaction patterns: test once per pattern
- **[BLOCK]** Any failure: fix immediately → full re-run of Step 7 (not partial)
- [ ] Use `qa-expert` for backend/data flows; `ui-ux-tester` for browser-driven UI verification

---

### Step 8 — Manual Double Check

- **[HARD GATE]** Human walks the feature in the running app — independent of the E2E test pass
  Gate Summary: *"E2E testing passed. Please walk through the feature yourself — this is the last check before the code ships."*
- [ ] If anything found: fix → re-run Step 7 → return here

---

### Step 9 — Ship

- [ ] Commit with clear message referencing the feature slug
- [ ] Push branch; open PR against `main` — **do not merge directly**
- [ ] `docs/roadmap.md`: this feature → `Status: shipped`
- [ ] If first feature shipped: record spec persistence decision in `docs/constitution.md`
- [ ] Select next `pending` feature from `docs/roadmap.md` in build order → restart at Step 1
