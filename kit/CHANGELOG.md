# Changelog

All notable changes to this kit are recorded here. Newest entry first.
Each entry notes what changed, which file(s), and what round or discussion prompted it.

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


