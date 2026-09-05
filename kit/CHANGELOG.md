# Changelog

All notable changes to this kit are recorded here. Newest entry first.
Each entry notes what changed, which file(s), and what round or discussion prompted it.

---

## 2026-09-04 (Round 02 — meal-planner)

### Changed
- **Step 7 gate: `none` → `hard`** (`phase-1-bootstrap.md`) — the architecture/stack decision now requires explicit user confirmation before `architecture.md` is written. Root cause of Round 02 failure: the `research-analyst` agent self-approved the stack choice (Vanilla JS) without the user ever seeing or confirming it. Fix introduces a two-stage process: (1) agent produces a **chat recommendation** with ranked options — no document written yet; (2) user confirms; (3) agent writes `architecture.md` as `Status: draft`; orchestrator updates to `approved`. The stack name must appear in the gate message so "looks good" is an informed confirmation, not a blind one. Issue 16.
- **Flow diagram updated** (`phase-1-bootstrap.md`) — Architecture now shown as `[hard gate]` alongside Constitution and Roadmap.

---

## 2026-09-03 (spec-kit review)

Inspired by reviewing the [GitHub spec-kit](https://github.com/github/spec-kit) reference implementation.

### Added
- **Converge step** (`phase-2-feature-dev.md` as Step 5, `phase-2-single-pass.md` as Step 4) — explicit spec-coverage verification after implementation, before code review. For each acceptance criterion in the spec, the agent checks whether the implementation contains evidence of it. Gaps become fix tasks; the step loops until the gap list is empty. Distinct from code review (quality) and E2E (runtime behavior).
- **`phase-bug-fix.md`** — new 3-step bug fix workflow: Assess (reproduce + diagnose root cause, hard gate) → Fix (scoped to the diagnosis) → Verify (original symptom gone, no regression, hard gate). Includes `bug-session.md` log schema and `assess.md` template.
- **`kit/guides/evolving-specs.md`** — documents the three spec persistence models: flow-forward (feature directories are immutable history), flow-back (any artifact can be edited; team reconciles), living spec (`spec.md` is the contract; plan/tasks regenerated from it). Includes guidance on choosing a model and when to run Converge for spec changes.
- **Spec persistence note** in Ship steps of both Phase 2 tracks — after shipping, the orchestrator prompts the user to declare their spec persistence model and record it in `docs/constitution.md`.

### Changed
- **Standard loop step count** (`phase-2-feature-dev.md`) — 8 → 9 steps. Code Review shifted to Step 6, E2E to Step 7, Manual Check to Step 8, Ship to Step 9.
- **Single-pass step count** (`phase-2-single-pass.md`) — 6 → 7 steps. Code Review + E2E shifted to Step 5, Manual Check to Step 6, Ship to Step 7.
- **Session log templates** — both phase files updated with new step rows.
- **Flow diagrams** — both phase files updated to show Converge in the sequence.
- **README** — contents table updated with new files; step counts and hard gate descriptions updated for both tracks.

---

## 2026-09-03

### Added
- **Gate summaries on all hard gates** (`phase-1-bootstrap.md`, `phase-2-feature-dev.md`, `phase-2-single-pass.md`) — orchestrator emits a one-sentence Gate Summary before each hard gate so non-technical users have a clear decision point without reading the full artifact. Prompted by Issue 1 (non-tech user experience).
- **Kickoff prerequisite check** (`README.md`) — orchestrator verifies all required skills and agents are available before starting Step 1; missing tools reported upfront, not mid-run. Prompted by Issue 2 (missing skills/agents).
- **Phase Handoff section** (`phase-1-bootstrap.md`) — instructs closing the Phase 1 session and opening a fresh Phase 2 session with only the four required artifacts. Reduces per-message cost and prevents stale Phase 1 context influencing Phase 2. Prompted by Issue 4.
- **Step 2 optional** (`phase-1-bootstrap.md`) — Market Research is now opt-in. After Step 1, orchestrator asks whether to proceed with Step 2 or skip to Step 3. Downstream steps that reference `docs/market-notes.md` proceed without it if skipped. Prompted by discussion.
- **DESIGN.md resource suggestions** (`phase-1-bootstrap.md` Step 5) — before the Step 5 hard gate, orchestrator presents two free DESIGN.md sources to the user: getdesign.md (73+ production site analyses) and freedesignmd.com (121+ free design systems). Prompted by discussion.
- **E2E scope guidance** (`phase-2-feature-dev.md` Step 6, `phase-2-single-pass.md` Step 4) — test shared interaction patterns once per pattern, not once per acceptance criterion; reserve exhaustive coverage for cross-feature interactions. Prompted by Issue 5 (speed/cost).
- **Open Issue 1 logged** (`testing/testing-log.md`) — no external flag to skip per-task review in `subagent-driven-development`; three options documented for future resolution.
- **CHANGELOG.md** — this file; tracks all kit changes going forward.

### Changed
- **Step 2 trigger** (`phase-1-bootstrap.md`) — changed from "Step 1 gate approved" to "user chooses to run this step after Step 1 completes".
- **Step 3 trigger and inputs** (`phase-1-bootstrap.md`) — trigger changed to "Step 2 complete or skipped"; `docs/market-notes.md` marked as optional input.
- **Step 4 inputs** (`phase-1-bootstrap.md`) — `docs/market-notes.md` marked as optional input.
- **Step 6 inputs** (`phase-1-bootstrap.md`) — `docs/market-notes.md` marked as optional input.
- **Phase 1 Output Checklist** (`phase-1-bootstrap.md`) — `docs/market-notes.md` item marked as skip-if-Step-2-was-skipped.
- **Flow Diagram** (`phase-1-bootstrap.md`) — Market Research shown as optional; Phase 2 handoff shown as close-session step.
- **Hard gates table** (`README.md`) — Step 2 marked as optional.
- **End state artifact list** (`README.md`) — `docs/market-notes.md` marked as conditional.
- **Constitution step** (`phase-1-bootstrap.md` Step 8) — added note: for single-pass (solo, ≤ 15 S/M features), the constitution can be 3–5 concrete rules rather than a comprehensive document; amendment procedure can be simplified. Prompted by Issue 3.
- **Lighter model guidance** (`phase-1-bootstrap.md` Steps 2 and 3, `phase-2-feature-dev.md` Step 6, `phase-2-single-pass.md` Step 4) — research-heavy and UI-verification steps flag that a lighter/faster model is appropriate for cost and speed. Prompted by Issue 5.
- **Step 5 Notes structure** (`phase-2-single-pass.md`) — restored full original notes block after gate summary insertion corrected ordering.

---

## 2026-09-02 — Round 01 Testing (reading-list project)

13 issues discovered and fixed during the first full Phase 1 + Phase 2 single-pass test run.

### Added
- **Orchestrator Announcement Convention** (`phase-1-bootstrap.md`, `phase-2-feature-dev.md`, `phase-2-single-pass.md`) — step banner, wall-clock timing via `eval(js)`, PROJECT_ROOT requirement, file-write verification. Issues 1, 3, 10.
- **Session Log schema** — Started / Duration / Credits columns in all three phase files. Issue 3.
- **`Review:` fields** for Step 4 (prototype) and Step 9 (scaffold smoke test) in `phase-1-bootstrap.md`. Issue 6.
- **`phase-2-single-pass.md`** — new single-pass Phase 2 track for small projects. Improvement 9.
- **`templates/phase-1-kickoff.md`** — kickoff template for new projects. Improvement 9.
- **`testing/testing-log.md`** — this testing log, tracking issues per round. Ongoing.
- **`git init` enforcement** in Step 9 Notes (`phase-1-bootstrap.md`). Issue 12.
- **Feature branch enforcement** in Step 3 Notes (`phase-2-single-pass.md`). Issue 13.

### Changed
- **All Phase 1 outputs** moved from project root to `docs/` subfolder across all phase files and templates. Issue 4.
- **Step 1 scope boundary** — explicit stopping condition added: do not enter tech stack, architecture, or component design in Step 1. Issue 2.
- **Subagent PROJECT_ROOT** — required field in every dispatched subagent task context. Issue 5.
- **File-write verification** — after every subagent task that writes files, orchestrator confirms file exists before marking step complete. Issue 7.
- **Windows npm workaround** — Step 9 Review notes `hub start` workaround for `.cmd` wrappers on Windows. Issue 8.
- **Phase 2 track decision** — moved from `phase-1-kickoff.md` to Step 6 (Roadmap) gate in `phase-1-bootstrap.md`; track evaluation criteria added. Correction to Improvement 9.
- **Step 2 Plan gate** in `phase-2-single-pass.md` — changed from `soft` to `hard`; gate behaviour note added. Issue 11.
- **Step 2 soft gate** in `phase-2-feature-dev.md` — strengthened with explicit note: soft gate is not a silent advance. Issue 11.
