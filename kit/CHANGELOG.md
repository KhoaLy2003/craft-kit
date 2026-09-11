# Changelog

All notable changes to this kit are recorded here. Newest entry first.
Each entry notes what changed, which file(s), and what round or discussion prompted it.

---
<!-- insert new changelog below this comment -->

## [Unreleased]

### Added

- **`bin/cli.js`** — figlet "Standard" ASCII art banner for `CRAFT-KIT` on installer start (bold cyan, generated offline with `npx figlet-cli`).
- **`bin/cli.js`** — full ANSI color UI: inline color helpers (`bold`, `dim`, `cyan`, `bCyan`, etc.) that no-op when stdout is not a TTY; numbered step sections; `✔`/`✖`/`↓` status symbols per agent download; colored quick-start with highlighted paths.

### Changed

- **`bin/cli.js`** — agent install path changed from `~/.claude/agents/` (global) to `.claude/agents/` relative to CWD (project-scoped); prompt and success messages updated accordingly.
- **`bin/cli.js`** — `shell: true` → `shell: process.platform === 'win32'` in `installTasteSkill()`, eliminating the DEP0190 deprecation warning on Unix.
- **`kit/CHANGELOG.md`** — restructured to Keep a Changelog v2 format: version-based `## [X.Y.Z] - YYYY-MM-DD` sections with `**Summary:**` lines; `## [Unreleased]` at top; existing date-title entries migrated into `[0.0.1]` and `[0.0.2]` blocks.
- **`.github/workflows/release-trigger.yml`** — added `summary` input (one-line release summary); CHANGELOG step now promotes `[Unreleased]` → versioned block with summary line and resets a fresh `[Unreleased]`, replacing the previous commit-message-scraping approach.

---

## [0.0.2] - 2026-09-10

**Summary:** Workflow fix — release pipeline stability on first release.

### Fixed

- **`.github/workflows/release.yml`** — pipefail guard and `grep` on first release; install command corrected.

---

## [0.0.1] - 2026-09-10

**Summary:** Kit renamed to CraftKit · Model metadata added to all step files · Phase 2 step file extraction + template refactor.

### Added

- **`Model` field** in the Overview section of every step file — positioned after `Agent/Skill`, before `Trigger`. Values: `opus`, `sonnet`, or `haiku`; `none` for human-only steps.
  - `opus`: p1-01 (Ideation), p1-06 (Architecture), p2-01 (Spec), p2sp-01 (Full-App Spec), p2sp-02 (Plan) — irreversible hard-gate decisions.
  - `sonnet`: all implementation, planning, analysis, and review steps.
  - `haiku`: p2-03 (Assign Specialists), p2-09 (Ship), p2sp-07 (Ship) — mechanical routing and git/PR steps.
  - `none`: p2-08 and p2sp-06 (Manual Check) — human walkthrough; no agent dispatched.
- **`kit/resource/step-specification-template.md`** — canonical template for all step files; defines the eight standard sections (Overview, Scope, Execution Rules, Artifact Rules, Completion Criteria, Transition Rules, Exceptions / Special Cases, References). `Model` field included after `Agent/Skill`.
- **`kit/steps/phase-1/`** — Phase 1 step files moved into dedicated subfolder.
- **`kit/steps/phase-2/`** — 17 new standalone step files extracted from the Phase 2 orchestration files:
  - Standard Loop: `p2-01-spec.md` through `p2-09-ship.md` (9 files)
  - Single-Pass: `p2sp-01-full-app-spec.md` through `p2sp-07-ship.md` + `p2sp-05a-e2e-plan.md` / `p2sp-05b-code-review-e2e.md` (8 files)

### Changed

- **Kit renamed** from "Product Development Kit" to **CraftKit** (`craft-kit` npm package name).
  - `package.json` — `name`, `description`, `bin` key updated.
  - `bin/cli.js` — all user-facing strings and User-Agent updated.
  - `kit/README.md` — title and `npx` install commands updated.
- **`kit/orchestrator-conventions.md`** — step banner format updated to include `Model: [opus / sonnet / haiku]` alongside Skill/Agent and Gate.
- **`kit/README.md`** — beta validation note added to Standard Loop section.
- **All step files** — refactored to the new eight-section template (Phase 1: `p1-01` through `p1-08`; Phase 2: all 17 extracted files; Bug Fix: inline in `phase-bug-fix.md`).
- **`kit/phase-2-feature-dev.md`** — slimmed to orchestration-only format; all step detail extracted to `kit/steps/phase-2/`.
- **`kit/phase-2-single-pass.md`** — slimmed to orchestration-only format; all step detail extracted to `kit/steps/phase-2/`.
- **`kit/phase-1-bootstrap.md`** — steps table gains a Description column.
- **`kit/phase-bug-fix.md`** — three inline steps refactored to the new template; "How to Read" updated.
- **`kit/templates/06-roadmap.md`** — fixed stale reference `p1-06-roadmap.md` → `p1-05-roadmap.md`.
- **All cross-references** updated throughout kit and docs-site to reflect `kit/steps/phase-1/` and `kit/steps/phase-2/` paths.
- **`docs-site/.vitepress/config.ts`** — 17 new step file rewrites; Phase 2 step groups added to sidebar.
- **`docs-site/index.md`** — corrected Phase 1 step count ("nine" → "eight"); corrected Single-Pass step count (7 → 8).
- **`docs-site/reference/required-skills.md`** — corrected skill step references now correctly cite Step 4 (Implement).

### Fixed

- **`kit/session-logging.md`** — Phase 1 template corrected to 8 steps; stale "Tech Research" row removed.
- **`kit/steps/phase-2/p2-07-e2e-testing.md`** and **`p2sp-05b-code-review-e2e.md`** — Issue 25 batch-fix E2E protocol applied: run all criteria first → mark PASS/FAIL/BLOCKED → batch FAILs to implementer → re-run complete suite.

---
