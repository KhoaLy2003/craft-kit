# Changelog

All notable changes to this kit are recorded here. Newest entry first.
Each entry notes what changed, which file(s), and what round or discussion prompted it.

---
<!-- insert new changelog below this comment -->

## [Unreleased]

---

## [0.0.15] - 2026-09-23

**Summary:** Design Sprint — batch all-feature spec and design pass to eliminate per-feature designer waits

**Summary:** Design Sprint — batch all-feature spec and design pass before implementation; eliminates per-feature designer waits in multi-feature products.

### Added

- **`kit/phase-2-design-sprint.md`** — new top-level orchestration file. Run once, before any feature implementation, when 2+ features need designer-provided screens. Two steps: DS-1 loops every pending feature from `docs/roadmap.md` and runs Step 1 (Brainstorm & Spec) for each (hard gate per feature; features with an existing `docs/specs/<slug>/spec.md` are skipped); DS-2 (Batch Screen Design) reads all feature specs, emits one combined designer handoff message covering all features, accepts designs via file exports (Path A) or MCP-connected design tool (Path B), validates per-feature coverage, and closes a single hard gate once all features pass. After the sprint, implementation runs via `kit/phase-2-feature-dev.md` on any feature in any order.
- **`kit/steps/phase-2/p2-ds-batch-design.md`** — step file for Design Sprint DS-2. Follows the eight-section template. Phase A builds a combined required-screen list across all features, skipping those already covered in `docs/designs/<slug>/`. Phase B prints one batch designer handoff message (no file created). Phase C selects Path A (file exports) or Path B (MCP). Path A/B execution and manifest logic match `p2-01b-screen-design.md` but operate across all features; manifests written per feature at `docs/designs/<feature-slug>/design-manifest.json`. Phase D hard gate covers all features together. Exception handling includes multi-file design sets, partial designer deliveries, and MCP failures with Path A fallback.

### Changed

- **`kit/phase-2-feature-dev.md`** — added Design Sprint callout in the header prerequisites block. Added "Skip Detection" section before the steps table: if `docs/specs/<slug>/spec.md` exists, Step 1 is skipped (log: `artifact_exists`); if `docs/designs/<slug>/` contains at least one file or a `design-manifest.json`, Step 1b is skipped. Skip column added to the steps table. Flow diagram updated to show the conditional skip branches at Steps 1 and 1b.
---

---

## [0.0.14] - 2026-09-23

---

---

## [0.0.13] - 2026-09-21

**Summary:** Screen design step 1b — spec-to-designer bridge and per-screen visual contract for Phase 2

**Summary:** User-provided screen design step (Step 1b) — Phase 2 now bridges spec to designer with a printed handoff message, accepts designs back via file exports or any MCP-connected design tool, validates coverage, and gives the frontend-developer agent a precise per-screen visual contract at implement time.

### Added

- **`kit/steps/phase-2/p2sp-01b-screen-design.md`** — new Single-Pass step inserted between Step 1 (Full-App Spec) and Step 2 (Plan). Four phases: (A) identify required screens from `docs/specs/spec.md` and any `docs/specs/*/screens/*.md` files; (B) print a designer handoff message to the terminal listing existing files to share (`docs/DESIGN.md` + screen files), required screen names, and artboard/file naming convention — no new document is created; (C) path selection — user replies "files" (Path A) or "mcp" (Path B); (D) hard gate after coverage passes. Path A: user places PNG/JPG/WebP/PDF/HTML in `docs/designs/<feature-slug>/`; orchestrator validates file per screen; DESIGN.md-fallback recorded in session log for any explicitly skipped screens. Path B: user provides design file URL and tool name (Figma, Sketch, Penpot, or any MCP-connected tool); orchestrator verifies MCP connection, checks each artboard is readable, resolves file-fallbacks for unreadable artboards, writes `docs/designs/<feature-slug>/design-manifest.json` (`design_url`, `design_tool`, per-screen `status: "mcp" | "file_fallback" | "design_md_fallback"`). MCP failure after one retry falls back to Path A. Skip condition: all features have one simple screen covered by `docs/preview/`. Session log records `design_path`, `design_url`, `design_tool`.
- **`kit/steps/phase-2/p2-01b-screen-design.md`** — same step scoped to one feature (Standard Loop). Handoff message references `docs/specs/<feature-slug>/screens/*.md`. Path B offers to reuse the design file URL from a previous feature cycle. Manifest written at `docs/designs/<feature-slug>/design-manifest.json`. Each feature cycle runs this step independently.

### Changed

- **`kit/phase-2-single-pass.md`** — Step 1b row added to the steps table between Steps 1 and 2; flow diagram updated with `[1b] Screen Design — user provides design files, coverage validated [hard gate]`.
- **`kit/phase-2-feature-dev.md`** — same additions.
- **`kit/steps/phase-2/p2sp-01-full-app-spec.md`** — Transition Rules → Next Step updated: points to Step 1b when any feature has 2+ non-trivial screens, or Step 2 when the skip condition applies.
- **`kit/steps/phase-2/p2-01-spec.md`** — same update for the single-feature case.
- **`kit/steps/phase-2/p2sp-03-implement.md`** — `docs/designs/` added to Inputs. Design system contract execution rule rewritten: per-screen reference resolved from `design-manifest.json` if present (`status: "mcp"` → agent queries artboard via MCP; `status: "file_fallback"` → image file as input; `status: "design_md_fallback"` → DESIGN.md + preview/ only); no manifest → image file lookup with DESIGN.md fallback; step skipped → DESIGN.md + preview/ for all screens.
- **`kit/steps/phase-2/p2-04-implement.md`** — `docs/designs/<feature-slug>/` added to Inputs; same manifest-based design contract rule applied.
- **`kit/orchestrator-conventions.md`** — Rule 10 extended: screen-specific file from `docs/designs/` must be included in frontend dispatch brief when it exists, in addition to the mandatory `docs/DESIGN.md` + `docs/preview/`.
- **`kit/task-agent-rubric.md`** — both `frontend-developer` routing rows updated to include the screen-specific `docs/designs/` file alongside `docs/DESIGN.md` and `docs/preview/`.

---

## [0.0.12] - 2026-09-20

**Summary:** Mobile stack coverage — D6 expanded with Expo and Flutter options, Push Notifications and OTA Updates additions, and principle-driven pre-flight toolchain check.

### Added

- **`kit/stack-catalog.md`** — D6 (Mobile-first / cross-platform) expanded from a brief note into a full two-option entry. Option A covers Expo / React Native: swap/keep/drop decisions (NativeWind replaces Tailwind, Supabase Auth JS replaces NextAuth), minimum local toolchain (Node ≥18, npm, git, Expo CLI), platform toolchain per target (Android Studio + ADB / Xcode ≥15), iOS-requires-macOS constraint, EAS Build vs Expo Go decision guidance, and account prerequisites. Option B covers Flutter: full-platform-swap warning (Dart replaces TypeScript entirely), keep/drop list, toolchain (`flutter doctor` covers the full check in one pass), platform toolchain per target, and backend pairing guidance.
- **`kit/stack-catalog.md` — Push Notifications section** (Section 3 addition). Expo Push Notifications (recommended for Expo; EAS-managed delivery to APNs + FCM; `expo-notifications` SDK) and Firebase Cloud Messaging / APNs direct (for Flutter via `firebase_messaging`, or bare React Native needing full delivery control).
- **`kit/stack-catalog.md` — Over-the-Air Updates section** (Section 3 addition). Expo EAS Update: ships JS bundle fixes to installed apps without App Store / Play Store review; stable limitation note that native code changes require a full store release.

### Changed

- **`kit/steps/phase-1/p1-08-scaffold.md`** — pre-flight toolchain check (Execution Rule 1) rewritten from three hardcoded stack-specific tables to a principle-driven approach: read the chosen stack from `docs/architecture.md`, cross-reference the `Minimum local toolchain` and `Requires:` fields in `kit/stack-catalog.md` (Section 1 for baseline, D6 for mobile), and run `<tool> --version` for each identified tool. `git` is always checked first regardless of stack. Eliminates the need to maintain per-stack check tables in the step file as new stacks are added. Rule 1.5 updated to include Expo EAS in the account prerequisites list. Two new Exceptions added: iOS-requires-macOS (Windows/Linux users must use EAS Build or a remote Mac; proceed Android-only locally), and Android emulator not started (`adb --version` passing ≠ emulator running; prompt user to create and start an AVD if `adb devices` is empty at smoke-test time).


---

## [0.0.11] - 2026-09-20

**Summary:** Platform handling — Step 1 scope gate, Step 3 multi-platform prototype scoping, kickoff template refactor

**Summary:** Platform handling — gap fix for platform constraint across Step 1, Step 3, and kickoff template; multi-platform prototype scoping.

### Changed

- **`kit/steps/phase-1/p1-01-ideation.md`** — "Platform selection (web / mobile / desktop)" added to Out of Scope list. Scope Boundary extended: if the user names a platform, record it verbatim in Known Constraints as a preliminary signal only; Step 6 is the gate where platform is evaluated and the human explicitly confirms it.
- **`kit/steps/phase-1/p1-03-prototype.md`** — new "Platform acknowledgment" Execution Rule (first action). Reads `docs/idea-brief.md` Known Constraints and applies four cases: (1) no platform declared — proceed silently; (2) web only — proceed silently; (3) single non-web platform — emit acknowledgment that HTML prototype does not commit to that platform; (4) multiple platforms declared — identify the primary, build prototype for primary only, note deferred platforms in `prototype-brief.md` under a "Deferred Platforms" heading. Viewport rules added: mobile → `max-width: 390px` + large touch targets; desktop → `max-width: 1280px`; web default — unconstrained.
- **`kit/templates/phase-1-kickoff.md`** — refactored for clarity. Header comment rewritten as a two-option guide (Option A: AI-assisted fill; Option B: self-fill). "What You Already Have" checkbox section removed. "Hard Constraints" section retained (renamed from "Constraints"); examples tightened. New "Market Research — Step 2" section added with explicit run/skip decision field. "Existing Context" section added (replaces "Other existing assets"). Section comments trimmed throughout.

---

---

## [0.0.10] - 2026-09-19

**Summary:** Provider-agnostic model tiers — capability tiers replace Anthropic model names; AI-driven MODELS.md setup for any provider

**Summary:** Provider-agnostic model configuration — capability tiers replace hardcoded Anthropic model names; AI-driven setup writes `docs/MODELS.md` for any provider.

### Added

- **`kit/setup-models.md`** — new file. Orchestrator-internal instructions, not a user-facing prompt. When `docs/MODELS.md` is absent, the orchestrator reads this file and runs the setup conversation automatically — the user never references it directly. The AI identifies its own provider and available models, maps them to the three capability tiers (`capable` / `balanced` / `fast`), writes `docs/MODELS.md`, and waits for user confirmation. No hardcoded model names in the kit; the AI running the session is the authority on what it has access to.
- **`kit/templates/MODELS.md`** — new blank schema template. Fields: provider, setup date, one model per tier, optional per-step override table. Copied to `docs/MODELS.md` by setup; editable at any time.

### Changed

- **All 23 step files** (`kit/steps/phase-1/p1-01` through `p1-08`; `kit/steps/phase-2/p2-01` through `p2-09` and `p2sp-01` through `p2sp-07`) — `Model:` field renamed from provider-specific values (`opus`, `sonnet`, `haiku`) to capability tiers (`capable`, `balanced`, `fast`). `none` retained for human-only steps (manual check). Tier definitions: `capable` = complex reasoning and irreversible decisions; `balanced` = implementation, planning, analysis; `fast` = mechanical tasks, routing, git operations.
- **`kit/orchestrator-conventions.md`** — new Rule 0 added before the existing numbered rules: before emitting the step banner, read `docs/MODELS.md`, resolve the step's tier to a model name (checking per-step overrides), and include it in the banner as `[tier → model-name]`. If `docs/MODELS.md` is absent, stop and run `kit/setup-models.md` first. Step banner format updated: `Model: [opus / sonnet / haiku]` → `Model: [tier → model-name]`.
- **`kit/phase-1-bootstrap.md`** — new "Model Setup" section added before Step 1. If `docs/MODELS.md` is absent, the orchestrator reads `kit/setup-models.md` and runs setup inline before doing any other work. User experience: say "Start Phase 1" — model setup happens automatically if needed, then Step 1 begins.
- **`kit/phase-1-checklist.md`** and **`kit/phase-2-checklist.md`** — new first item in Universal section: read `docs/MODELS.md` and resolve this step's tier to a model name before emitting the step banner. Step banner checklist item updated to include `[tier → model-name]` format.
- **`README.md`** — line 12 updated: removed "Works with Claude Code, Cursor, Gemini CLI, and any harness that supports multi-agent dispatch" (misleading); replaced with accurate provider-agnostic statement and reference to model setup. Required Skills table updated: added "Tier it runs on" column; skills note updated to clarify skills enhance consistency but are not hard requirements.

---

---

## [0.0.8] - 2026-09-18

**Summary:** Stack catalog rewrite, release notes separation, per-screen design brief template, kit/ gitignore

### Added

- **`kit/templates/spec-screen.md`** — new template for per-screen product documentation. Code-agnostic design brief covering Identity, Purpose, Access Control, Entry Points, Content & Data (displayed content / user actions / computed values), Layout & Structure (page structure / key UI elements / responsive behavior), Interactions, States (loading / empty / error / edge cases), Navigation Out, Design Notes, Acceptance Criteria, and Open Questions. Intended for features with 2+ non-trivial screens; filled copies live at `docs/specs/<feature-slug>/screens/<screen-name>.md`. Replaces the raw `TEMPLATE.md` that was ported from another project.
- **`RELEASE_NOTES.md`** — new file at repo root. User-facing release notes written here before triggering `release-trigger.yml`; becomes the GitHub release body. Automatically reset to a template comment after the release PR merges. Separates user-facing "what's new" from the technical file-level CHANGELOG.
- **`.github/workflows/release.yml`** — "Generate release notes" step rewritten: reads `RELEASE_NOTES.md` directly instead of awk-extracting from `kit/CHANGELOG.md`; commit-message fallback retained for when the file is empty.
- **`.github/workflows/release-trigger.yml`** — new "Reset RELEASE_NOTES.md for next release" step added after tag push; writes the template comment back to `RELEASE_NOTES.md`, commits, and pushes on the release branch so the reset lands via PR merge while the tag commit retains the release content.

### Changed

- **`kit/steps/phase-1/p1-04-design.md`** — complete rewrite. AI generation path removed. Step now has five sequential phases: (A) guide user to provide `docs/DESIGN.md` from getdesign.md or freedesignmd.com with a hard stop until confirmed; (B) orchestrator-run quality validation against 7 criteria (overview, color tokens, typography scale, spacing, core components, responsive breakpoints, minimum file length) with specific failure reporting and re-validation loop; (C) orchestrator builds `docs/preview/` directly as HTML + CDN Tailwind (no subagent dispatch; design-taste-frontend skill pre-flight check applied before writing; mock data from prototype-brief.md; opens as `file://`); (D) review and feedback loop — DESIGN.md changes trigger re-validation and rebuild, preview-only fixes are applied directly, no iteration cap; (E) hard gate always. Overview Agent/Skill line updated to "Orchestrator (direct)".
- **`kit/phase-1-checklist.md`** — (1) Step 4 section replaced: removed old skip-entirely logic and AI chosen branch; new section has four BLOCK checkpoints: file-present check, 7-criterion quality validation checklist, UI preview artifact verification (`index.html` + CDN Tailwind tag), and feedback loop instructions; hard gate summary updated. (2) Step 6 Stage 1 checklist item updated from "surface 2–3 options" to "apply Deviation Triggers and walk Additions Catalog"; Stage 2 item updated to reflect "full proposed stack with per-deviation rationale"; Step 8 Requires lookup item updated to reference Section 1 baseline toolchain and per-addition `Requires:` fields.
- **`kit/templates/05-design-system.md`** — AI path language removed throughout. Title updated to Step 4. Introductory callout table (Import / AI paths) removed. Metadata `Source` field rewritten as a plain file-origin note. "Import Path — Extraction Checklist" section rewritten as a standalone "Validation Checklist" (no conditionals, no path references). Section 1 Design Overview comment simplified. Section 8 Finalized Mock Reference comment updated to reference `docs/preview/`. Gate Checklist updated: "Mock reflects finalized direction" item references `docs/preview/`; AI path orphan-component item replaced with a `docs/preview/` approval item.
- **`kit/phase-1-bootstrap.md`** — Step 4 row description updated from "Create a design system with visual language, components, and UI patterns for the product" to "User provides a DESIGN.md file; orchestrator validates it, then builds a live UI preview with mock data for review".
- **`kit/orchestrator-conventions.md`** — Rule 10 added: any `frontend-developer` subagent dispatch MUST include `docs/DESIGN.md` and `docs/preview/` as explicit inputs; explains consequence of omission (agent invents its own visual language).
- **`kit/task-agent-rubric.md`** — frontend-developer rows updated: both UI-layout and UI-quality rows now note that `docs/DESIGN.md` + `docs/preview/` must be included in every dispatch brief.
- **`kit/steps/phase-2/p2-04-implement.md`** — `docs/DESIGN.md` and `docs/preview/` added to Inputs; new Execution Rule: design system contract required for every frontend dispatch, not conditional on visual-quality signals.
- **`kit/steps/phase-2/p2sp-03-implement.md`** — same: `docs/DESIGN.md` and `docs/preview/` added to Inputs; design system contract execution rule added for both dominant and minority frontend dispatches.
- **`kit/stack-catalog.md`** — complete rewrite. Replaced the six-stack horizontal comparison model with a four-section structure: (1) Canonical Baseline Stack (Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui + Drizzle ORM + Supabase PostgreSQL + NextAuth.js v5 + Vercel); (2) Analysis Protocol — how Step 6 uses the file; (3) Deviation Triggers — six named triggers (D1 self-hosted, D2 heavy realtime, D3 pure SPA, D4 content-heavy/static, D5 document schema, D6 mobile-first) each naming exactly what to swap and what to keep; (4) Additions Catalog — ten problem domains (Auth upgrade, Realtime, Storage, Payments, Email, Search, Background Jobs, Analytics, CMS, AI/LLM) with recommended entries per domain, stability tags, free-tier facts, and guidance on when to add. Orchestrator now defaults to the baseline and layers in additions only when the project roadmap explicitly requires the capability.
- **`kit/steps/phase-2/p2-01-spec.md`** — Outputs section updated to list per-screen docs as an optional second artifact; `Template` field added pointing to `templates/spec-screen.md`; Completion Criteria gains a screen-docs checkbox; References gains `templates/spec-screen.md`.
- **`kit/steps/phase-2/p2sp-01-full-app-spec.md`** — same: Outputs, Template, Completion Criteria, and References updated to reflect optional per-screen companion documents.
- **`kit/steps/phase-1/p1-06-architecture.md`** — Stage 1 Execution Rules rewritten to follow the three-step catalog protocol (Baseline → Deviation Triggers → Additions Catalog); Scope updated from "surfacing 2–3 viable stack options" to "full stack recommendation (baseline + deviations + additions) with rationale"; Completion Criteria updated to match; Exceptions updated to reflect the new model.
- **`kit/steps/phase-1/p1-08-scaffold.md`** — pre-flight rule 2 updated to reference Section 1 baseline toolchain and each addition's `Requires:` field; stale PocketBase-specific row removed from the toolchain check table.
- **`kit/steps/phase-1/p1-01-ideation.md`** — Rule 1 (git init) extended: immediately after `git init`, create `.gitignore` at the project root with `kit/` as the first entry; if `.gitignore` already exists, append `kit/` only if not already present.
- **`kit/templates/09-scaffold-checklist.md`** — Section 1 `.gitignore` checklist item updated to require `kit/` entry present and note it must not be removed by the scaffold agent.

---

---

## [0.0.7] - 2026-09-14

**Summary:** Environment variable gate at Phase 1 close, context window management for single-pass, and E2E test plan template.

### Added

- **`kit/templates/e2e-tests.md`** — new fill-in template for `docs/E2E-TESTS.md`. Seven sections with fixed structure: Overview (totals), Prerequisites Checklist (credentials table, per-service rows), Test Coverage Map (one AC-ID table per feature), External Service Setup (provisioning checklist + verification command + troubleshooting per service), Test Data Requirements, Running the Tests (exact commands + expected output), and Troubleshooting (populated during Step 5b). Gate Checklist at the bottom. Replaces free-form generation from the guide.

### Changed

- **`kit/phase-2-single-pass.md`** — added "Context Window Management" section between Conventions and Steps. Includes a concrete trigger (estimated remaining credits below 20%, or session noticeably slower), a handoff checklist (session log, branch name, three key files on disk), and a copy-paste resume prompt for the new session. Positioned before Steps so the orchestrator sees it before beginning, not after Step 3 is already done.
- **`kit/steps/phase-2/p2sp-03-implement.md`** — added `Context window` entry to Transition Rules → Next Step, pointing to the Context Window Management section in `phase-2-single-pass.md`.
- **`kit/steps/phase-1/p1-08-scaffold.md`** — added Environment Variables Gate as execution rule 4 (between scaffold agent dispatch and smoke test). Gate: (1) reads `.env.example` for required keys; (2) writes `ENV_SETUP.md` to project root with one `### KEY_NAME` section per variable (what it is, where to get it, expected format) — guidance goes to a file, not the terminal; (3) directs user to open `ENV_SETUP.md` and fill `.env`, waits for confirmation; (4) validates every key is present and non-placeholder; blocks until valid. Added to Completion Criteria and Transition Rules / Before Advancing. Prior rules 4–5 renumbered to 5–6.
- **`kit/templates/09-scaffold-checklist.md`** — added Section 7 (Environment Variables) with five checkboxes: `ENV_SETUP.md` written, `.env.example` generated, user confirmation received, no placeholder values, app starts without env errors. Gate / Phase 1 Closeout updated to note Section 7 may be skipped for projects with no external services.
- **`kit/phase-1-bootstrap.md`** — Phase 1 Output Checklist: env item updated to name `ENV_SETUP.md` explicitly. Added hard gate callout after the checklist: Phase 2 session must not open if `.env` is missing, contains placeholder values, or causes startup errors; names the consequence (costly reruns of the full implementation phase).
- **`kit/steps/phase-2/p2sp-05a-e2e-plan.md`** — `Template` field changed from `none` to `kit/templates/e2e-tests.md`. Execution Rules rewritten: orchestrator copies the template to `docs/E2E-TESTS.md` first, then dispatches the agent to fill it — structure is no longer generated from scratch each run. Agent must map every AC ID from the spec; omissions require an explicit reason. Gate Checklist in the template verified before presenting to user. `kit/guides/e2e-testing-plan.md` retained as reference for Supabase-specific provisioning detail.

---

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


## [0.0.5] - 2026-09-11

### Changed

- **`bin/cli.js`** — `kit/resource/` excluded from user install; directory contains internal development files (`DESIGN.md`, `step-specification-template.md`, `interactive-prototype-process.md`) not needed by kit users.
- **`bin/cli.js`** — agent install path changed from `.claude/agents/` to `.agents/agents/`, co-locating agents alongside skills under a single provider-agnostic `.agents/` tree. Claude Code gate removed — all providers are prompted to download agents.

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
