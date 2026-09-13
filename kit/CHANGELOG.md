# Changelog

All notable changes to this kit are recorded here. Newest entry first.
Each entry notes what changed, which file(s), and what round or discussion prompted it.

---
<!-- insert new changelog below this comment -->

## [0.0.6] - 2026-09-13

**Summary:** User-feedback round — git workflow, language enforcement, file-first review, market research inspiration, backend-developer agent, stack catalog expansion, and single-pass specialist gap fix.

### Added

- **`kit/guides/interactive-prototype-process.md`** — moved from `kit/resource/` into the `guides/` folder so it is included in user installs. `kit/resource/` retains dev-only files (`DESIGN.md`, `step-specification-template.md`).
- **`kit/stack-catalog.md`** — new "Third-Party Services" section with full entries for Clerk (auth), NextAuth.js / Auth.js v5 (auth), Cloudinary (media storage + transforms), Cloudflare R2 (object storage), and AWS S3 (object storage). Quick Reference table extended with a second sub-table.
- **`bin/cli.js`** — `backend-developer` added to `REQUIRED_AGENTS` alongside `frontend-developer` (path: `categories/01-core-development/backend-developer.md`). Appears in manual install instructions and interactive download automatically.
- **`bin/cli.js`** — version stamp written to `<kit-dir>/.craft-kit-version` after every successful install. On `--force` re-install the CLI reads the previous stamp and, when the version differs, emits an upgrade summary (`v0.0.5 › v0.0.6`) plus a direct link to the CHANGELOG instead of the plain "Kit installed" message.

### Changed

- **`kit/orchestrator-conventions.md`** — Rule 8: all AI-generated output must be in English regardless of user's language; exception for product-targeted UI copy only. Rule 9: write every artifact to disk first, then share the file path for review — never print document content in the terminal. During clarifying Q&A, print only the questions, not any draft content.
- **`kit/steps/phase-1/p1-01-ideation.md`** — git init added as the first action of Phase 1; kickoff input path changed to `phase-1-kickoff.md` (project root); Rule to move kickoff into `docs/` after `docs/idea-brief.md` is written; Q&A contract updated to "questions → answers → write file → user opens and reviews → approval"; Rule 4 explicitly states to print only questions during Q&A, no draft content alongside them.
- **`kit/steps/phase-1/p1-02-market-research.md`** — purpose expanded from "validate demand and identify risks" to "discover inspiration and validate demand"; model downgraded from `sonnet` to `haiku`; Scope and Execution Rules extended to require Section 5 (Feature Inspirations) populated with at least 2-3 concrete entries; gate summary now surfaces top inspirations alongside the proceed/pivot/stop decision.
- **`kit/steps/phase-1/p1-03-prototype.md`** and **`kit/phase-1-checklist.md`** — all references to `kit/resource/interactive-prototype-process.md` updated to `kit/guides/interactive-prototype-process.md`; checklist BLOCK instruction updated to file-first review contract.
- **`kit/steps/phase-1/p1-05-roadmap.md`** — Scope and Execution Rules updated: feature inspirations from `market-notes.md` Section 5 must be explicitly evaluated and placed in a MoSCoW tier or rejected with a one-line reason; cannot be silently ignored.
- **`kit/steps/phase-1/p1-08-scaffold.md`** — Phase 1 closeout sequence added: run `/init` to generate `AGENTS.md` (same command across all AI providers), then single `git add -A && git commit` capturing all Phase 1 output. Git repo check simplified — Step 1 now owns `git init`.
- **`kit/phase-1-bootstrap.md`** — output checklist extended with `docs/phase-1-kickoff.md`, `AGENTS.md`, and single-commit verification.
- **`kit/steps/phase-2/p2sp-01-full-app-spec.md`** — Execution Rule updated: write spec to disk first, then ask user to open and review each section before approving.
- **`kit/templates/02-market-notes.md`** — Section 5 (Feature Inspirations) added; existing sections renumbered (Reasons This Might Not Work → 6, Conclusions → 7); gate checklist updated to require inspirations populated.
- **`kit/task-agent-rubric.md`** — `backend-developer` added to Quick Reference table; routing rows for API endpoints, database schema, business logic, and auth now point to `backend-developer` unconditionally. Split-task example updated.
- **`kit/phase-2-single-pass.md`** — "When NOT to use" condition tightened: disqualifier is now a roughly equal domain split (≥30% each), not the presence of any cross-domain task. A small number of out-of-domain tasks (config, migrations, one API route) does not disqualify the single-pass track.
- **`kit/steps/phase-2/p2sp-02-plan.md`** — Plan step now annotates every task with a `Specialist:` field using `kit/task-agent-rubric.md`. Dominant specialist defined as the agent on ≥80% of tasks. Minority tasks (those assigned to a different specialist) collected into a **Minority Tasks** section in `plan.md` with task number, specialist, and dependency position. If minority tasks exceed ~20% of total, the hard gate raises a track-switch recommendation. `kit/task-agent-rubric.md` added to Inputs and References.
- **`kit/steps/phase-2/p2sp-03-implement.md`** — Implement step now dispatches minority tasks to their designated specialist as targeted single-task subagents at the dependency position recorded in `plan.md`; dominant specialist stream is unchanged. In Scope and Execution Rules updated to reflect both dispatch paths.

---

## [Unreleased]

---

## [0.0.6] - 2026-09-13

---

---

## [0.0.5] - 2026-09-11

### Changed

- **`bin/cli.js`** — `kit/resource/` excluded from user install; directory contains internal development files (`DESIGN.md`, `step-specification-template.md`, `interactive-prototype-process.md`) not needed by kit users.
- **`bin/cli.js`** — agent install path changed from `.claude/agents/` to `.agents/agents/`, co-locating agents alongside skills under a single provider-agnostic `.agents/` tree. Claude Code gate removed — all providers are prompted to download agents.

---

---

## [0.0.4] - 2026-09-11

**Summary:** Docs-site visual redesign — brand identity, wider content, and diagram embed fixes.

### Added

- **`docs-site/public/favicon.svg`** — CK monogram favicon in copper brand color.
- **`docs-site/public/icons/`** — six hand-drawn SVG icons (phase-1, phase-2-standard, phase-2-single-pass, bug-fix, install, templates) replacing emoji in the homepage features section.
- **`docs-site/public/diagrams/`** — archify diagram HTML files promoted to static assets so they survive VitePress rebuilds and are served in dev mode.

### Changed

- **`docs-site/.vitepress/config.ts`** — `head[]` extended with Google Fonts preconnect + Outfit stylesheet, OG type/title/description meta, and Twitter card meta. `vite.publicDir` pinned to `docs-site/public/` so static assets resolve correctly when `srcDir: '..'`.
- **`docs-site/.vitepress/theme/custom.css`** — full rewrite: Outfit replaces Inter (`--vp-font-family-base`); copper brand palette for light (`#c26a17`) and dark (`#e8924a`) modes replacing VitePress default indigo; `scroll-behavior: smooth`; `.VPDoc .content-container { max-width: none }` lifts the 688 px content cap on all doc pages; `.VPDoc:not(.has-sidebar)` container and content caps also removed; `.grid-3` hover upgraded with tinted shadow and `translateY` lift.
- **`docs-site/index.md`** — six emoji feature icons replaced with `{ src: /icons/*.svg }` image objects; inline `<style>` block removed (styles live in `custom.css`).
- **`kit/phase-1-bootstrap.md`, `kit/phase-2-feature-dev.md`, `kit/phase-2-single-pass.md`, `kit/phase-bug-fix.md`** — diagram iframes updated with `?embed=1` (hides toolbar, removes internal scroll, maximises canvas) and viewport-relative height (`60vh`, `min-height: 480px`); caption updated to reflect embed-mode interaction.

---

## [0.0.3] - 2026-09-11

### Added

- **`bin/cli.js`** — figlet "Standard" ASCII art banner for `CRAFT-KIT` on installer start (bold cyan, generated offline with `npx figlet-cli`).
- **`bin/cli.js`** — full ANSI color UI: inline color helpers (`bold`, `dim`, `cyan`, `bCyan`, etc.) that no-op when stdout is not a TTY; numbered step sections; `✔`/`✖`/`↓` status symbols per agent download; colored quick-start with highlighted paths.

### Changed

- **`bin/cli.js`** — agent install path changed from `~/.claude/agents/` (global) to `.claude/agents/` relative to CWD (project-scoped); prompt and success messages updated accordingly.
- **`bin/cli.js`** — `shell: true` → `shell: process.platform === 'win32'` in `installTasteSkill()`, eliminating the DEP0190 deprecation warning on Unix.
- **`kit/CHANGELOG.md`** — restructured to Keep a Changelog v2 format: version-based `## [X.Y.Z] - YYYY-MM-DD` sections with `**Summary:**` lines; `## [Unreleased]` at top; existing date-title entries migrated into `[0.0.1]` and `[0.0.2]` blocks.
- **`.github/workflows/release-trigger.yml`** — added `summary` input (one-line release summary); CHANGELOG step now promotes `[Unreleased]` → versioned block with summary line and resets a fresh `[Unreleased]`, replacing the previous commit-message-scraping approach.

---

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
