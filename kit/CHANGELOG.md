# Changelog

All notable changes to this kit are recorded here. Newest entry first.
Each entry notes what changed, which file(s), and what round or discussion prompted it.

---
## 2026-09-10 — Renamed to CraftKit + Pre-Beta Fixes

### Changed
- **Kit renamed** from "Product Development Kit" to **CraftKit** (`craft-kit` npm package name).
  - `package.json` — `name`, `description`, `bin` key updated.
  - `bin/cli.js` — all user-facing strings and User-Agent updated.
  - `kit/README.md` — title and `npx` install commands updated.
- **`kit/orchestrator-conventions.md`** — step banner format updated to include `Model: [opus / sonnet / haiku]` alongside Skill/Agent and Gate.
- **`kit/README.md`** — beta validation note added to Standard Loop section: all five internal rounds used single-pass; standard loop step files are complete but not yet end-to-end validated.

### Fixed
- **`kit/session-logging.md`** Phase 1 template corrected to 8 steps; stale "Tech Research" row removed (step was eliminated in the Issue 26 refactor).
- **`kit/steps/phase-2/p2-07-e2e-testing.md`** and **`p2sp-05b-code-review-e2e.md`** — Issue 25 batch-fix E2E protocol applied: run all criteria first → mark PASS/FAIL/BLOCKED → batch FAILs to implementer → re-run complete suite. Was documented since Round 03 as "kit file update pending."

---

## 2026-09-10 — Model Metadata Added to All Step Files

### Added
- **`Model` field** in the Overview section of every step file — positioned after `Agent/Skill`, before `Trigger`. Values: `opus`, `sonnet`, or `haiku` (short names only); `none` for human-only steps.
  - `opus`: p1-01 (Ideation), p1-06 (Architecture), p2-01 (Spec), p2sp-01 (Full-App Spec), p2sp-02 (Plan) — irreversible hard-gate decisions.
  - `sonnet`: all implementation, planning, analysis, and review steps.
  - `haiku`: p2-03 (Assign Specialists), p2-09 (Ship), p2sp-07 (Ship) — mechanical routing and git/PR steps.
  - `none`: p2-08 and p2sp-06 (Manual Check) — human walkthrough; no agent dispatched.
- **`kit/resource/step-specification-template.md`** — `Model` field added after `Agent/Skill` with placeholder `{{MODEL_NAME}}`.

---


## 2026-09-10 — Step Template Refactor + Phase 2 Step File Extraction

### Added
- `kit/resource/step-specification-template.md` — canonical template for all step files; defines the eight standard sections (Overview, Scope, Execution Rules, Artifact Rules, Completion Criteria, Transition Rules, Exceptions / Special Cases, References)
- `kit/steps/phase-1/` — Phase 1 step files moved into dedicated subfolder
- `kit/steps/phase-2/` — 17 new standalone step files extracted from the Phase 2 orchestration files:
  - Standard Loop: `p2-01-spec.md` through `p2-09-ship.md` (9 files)
  - Single-Pass: `p2sp-01-full-app-spec.md` through `p2sp-07-ship.md` + `p2sp-05a-e2e-plan.md` / `p2sp-05b-code-review-e2e.md` (8 files)

### Changed
- **All step files** — refactored to the new eight-section template (Phase 1: `p1-01` through `p1-08`; Phase 2: all 17 extracted files; Bug Fix: inline in `phase-bug-fix.md`)
- **`kit/phase-2-feature-dev.md`** — slimmed to orchestration-only format (conventions + steps table + flow diagram + Notes on Skills); all step detail extracted to `kit/steps/phase-2/`
- **`kit/phase-2-single-pass.md`** — slimmed to orchestration-only format (conventions + steps table + flow diagram + Mid-Cycle Escape); all step detail extracted to `kit/steps/phase-2/`
- **`kit/phase-1-bootstrap.md`** — steps table gains a Description column
- **`kit/phase-bug-fix.md`** — three inline steps refactored to the new template; "How to Read" updated
- **`kit/templates/06-roadmap.md`** — fixed stale reference `p1-06-roadmap.md` → `p1-05-roadmap.md`
- **All cross-references** updated throughout kit and docs-site to reflect `kit/steps/phase-1/` and `kit/steps/phase-2/` paths
- **`docs-site/.vitepress/config.ts`** — 17 new step file rewrites; Phase 2 step groups added to sidebar
- **`docs-site/index.md`** — corrected Phase 1 step count ("nine" → "eight"); corrected Single-Pass step count (7 → 8)
- **`docs-site/reference/required-skills.md`** — corrected skill step references: `subagent-driven-development`, `dispatching-parallel-agents`, `design-taste-frontend` now correctly cite Step 4 (Implement), not Step 3

---


