# Repository Guidelines

## Project Overview

**craft-kit** is an AI-agent orchestration workflow kit, shipped as an npx-installable CLI (`npx github:KhoaLy2003/craft-kit`). The CLI copies workflow scripts and templates into a target project, then guides an AI orchestrator through a phase-based development process.

This repo is the development and test harness for the kit, not an application:
- `bin/cli.js` — the installer (CJS, whole implementation)
- `kit/` — the publishable kit (read-only reference; never modified during a run)
- `tests/` — `node:test` suites
- `testing/` — narrative E2E validation rounds (gitignored)
- `docs-site/` — VitePress docs; `srcDir: '..'` reads straight from `kit/`

`README.md` is the only orientation doc; there is no `kit/README.md`.

---

## Architecture & Data Flow

### CLI installer (`bin/cli.js`)

`node bin/cli.js [target-dir] [--force] [--skip-setup]` — default target `./kit`; `--help`/`-h` and `--version`/`-v` exit 0; unknown flags exit 1 with usage.

1. Preflight: a file where a directory is needed fails; a non-empty target without `--force` exits 1.
2. Copy every `kit/` file except `resource/` (dev-only) and top-level `CHANGELOG.md`. Pure file copy, no network.
3. With `--force` and an old `.craft-kit-manifest.json`: delete files the new kit no longer ships, prune emptied dirs. User-added files and manifest entries escaping the target are never touched. No old manifest → print a one-line "renamed files may linger" note.
4. Always write `.craft-kit-version` and `.craft-kit-manifest.json` (sorted relative paths); print an upgrade message when `--force` crosses versions.
5. `--skip-setup` skips only the setup block (banner, copy, manifest and quick-start still run). Otherwise non-TTY prints skill install instructions; TTY prompts (anything but `n` is yes) to run `npx skills add` for `design-taste-frontend`, `archify` and the four review skills. These are the only network calls (unpinned code from GitHub); failures print the manual command. Superpowers install text for every harness always prints; no harness detection.
6. Quick-start uses the relative install path and leads with "Start using `<rel>/START.md`", then lists per-workflow entry files. Separately, an "Existing project detected: missing …" hint (only when `docs/` is the target's parent) names missing docs, including the constitution's `Verification Commands` section.

### Kit workflows

`kit/START.md` routes between these; each phase file owns its steps.

| Workflow | Entry file | Notes |
|---|---|---|
| Phase 1 Bootstrap (once) | `kit/phase-1-bootstrap.md` | 8 steps → `docs/` foundation, `docs/.craft-kit.json`, one commit |
| Phase 2 Build | `kit/phase-2.md` | 7 steps; scope `all` (validated) or `feature` (experimental), set in `docs/roadmap.md` |
| Maintenance | `kit/phase-maintenance.md` | bug → `phase-bug-fix.md`; feature → intake + fit check → backlog/roadmap → Phase 2 `scope: feature`; admin features load `kit/guides/admin-checklist.md` |
| Adopt / Upgrade | `kit/phase-adopt.md`, `kit/phase-upgrade.md` | existing code without kit docs / older kit projects; upgrade modules in `kit/phase-*-backfill.md`, `phase-log-collapse.md` |
| Bug Fix, Onboarding | `kit/phase-bug-fix.md`, `kit/phase-onboarding.md` | |

Everything except Phase 1 and Phase 2 `scope: all` is experimental. One session log per phase (`docs/phase-N-session.md`, `bug-session`, `adopt-session`, `maintenance-session`; format in `kit/session-logging.md`); START.md keeps none.

### Gates

`none` auto-advances; `soft` presents a summary and advances unless the user objects; `hard` stops with a Gate Summary and waits for explicit approval (`kit/orchestrator-conventions.md` → Gates).

Hard gates: Phase 1 Steps 1, 3, 4, 5, 6; Phase 2 Steps 1, 6; Adopt Steps 2, 3, 4; Bug Fix Assess (Verify is soft, hard only when the symptom is UI-only); Maintenance Intake only when the feature does not fit; Onboarding Review.

---

## Lite kit

`kit-lite/` is a separate, deliberately tiny kit for small personal projects (`node bin/cli.js --lite`, default target `./kit-lite`): `START.md`, three step files (Idea `hard`, Build `none`, Wrap-up `soft`), `templates/BRIEF.md` and `NOTES.md`, and `audit/record.cjs` (CommonJS by extension so a project with `"type": "module"` can still run it). It shares nothing with `kit/` and is outside the kit-consistency drift lint and the docs site. `bin/lite.js` writes the project wiring: a marked workflow block in `CLAUDE.md` (and `AGENTS.md` when present), Claude Code hooks (`UserPromptSubmit`, `Stop`, `SessionEnd`; exec form with `${CLAUDE_PROJECT_DIR}`) in `.claude/settings.json` that run the recorder, and a `docs/audit/` `.gitignore` entry. `--no-hook` and `--no-audit` opt out. Its changes are recorded in `kit/CHANGELOG.md` like any kit change.

The two kits are released together (one `package.json` version, one `kit/CHANGELOG.md`; lite changes go under `[Unreleased]` there) but installed independently: a normal install or `--force` never touches `kit-lite/`, and `--lite` never touches `kit/`. The upgrade hint for lite names `--lite`.

**One project, one kit.** The installer refuses `--lite` in a project that already has the full kit, and the full install in a project that already has the lite kit; `--force` does not override it, and updating the same kit still works. Detection (`findOtherKit` in `bin/lite.js`) looks only at kit-specific signals under the project root (the working directory when the target is inside it, else the target's parent; `--lite` additionally requires the target to sit directly under the working directory, since its hook paths and wiring files are relative to it): a folder directly under it whose `.craft-kit-manifest.json` lists `phase-2.md` (full) or `step-1-idea.md` (lite), `docs/.craft-kit.json` (full), and the lite workflow block in `CLAUDE.md` / `AGENTS.md`. It deliberately does not scan deeper or the working directory, so other projects under a shared parent never block an install.

## Key Directories

| Path | Purpose |
|---|---|
| `kit/steps/phase-1/`, `kit/steps/phase-2/` | `p1-01-ideation.md` … `p1-08-scaffold.md`, `p2-01-spec.md` … `p2-07-ship.md` |
| `kit/templates/` | Output templates copied to `<project>/docs/`; **never edit during a run** |
| `kit/guides/` | On-demand detail (`conventions-detail.md`, `design-reference.md`, `session-handover.md`, `admin-checklist.md`, `change-control.md`, `diagrams.md`, `design-mcp.md`, `test-accounts.md`, `phase-2-feature-scope.md`); read only when a rule points there |
| `kit/scripts/` | `lint-docs.js`, `render-backlog.js`, `docs-index.js`, `view-docs.js`, and a `package.json` pinning them to CommonJS (keep it, or ESM projects break) |
| `kit/viewer/` | VitePress config (`config.mts`) and theme used by `view-docs.js`; ESM, copied into a per-project site folder on every run |
| `scripts/sync-kit.js` | Dev-only (not published): runs `bin/cli.js --force --skip-setup` in a test project so working-tree `kit/` or `kit-lite/` changes can be tried without a release; auto-detects the installed kit type and folder, `--lite` for a fresh lite install, `--watch` to re-sync on change |
| `kit/resource/` | `step-specification-template.md` — dev-only, not installed |
| `tests/fixtures/lint-docs/`, `tests/fixtures/viewer/` | Fixture projects for the docs lint and viewer tests |

---

## Development Commands

```bash
npm test                      # full suite; zero deps, no npm install needed
node bin/cli.js ./out --skip-setup   # run the CLI from the working tree

cd docs-site && npm run dev   # also: build, preview

# Try working-tree kit changes in a test project, no release needed (runs bin/cli.js --force --skip-setup there):
node scripts/sync-kit.js testing/round-06/my-app            # existing install: kit type and folder auto-detected
node scripts/sync-kit.js testing/round-06/my-app --lite     # fresh lite install (--no-hook / --no-audit pass through)
node scripts/sync-kit.js testing/round-06/my-app --watch    # re-sync on every change under kit/ or kit-lite/
```

CI runs the suite on ubuntu + windows × Node 18 + 22.

---

## Code Conventions & Patterns

- **Orchestrator rules live in one place**: `kit/orchestrator-conventions.md` (step banner, model tiers, PROJECT_ROOT injection, fail-fast writes, write verification, write-then-ask-for-review, English-only, session-log cadence, gates, frontend dispatch contract). Phase and step files point there; never restate.
- **Step banner** (orchestrator output, defined in `kit/orchestrator-conventions.md`): `## Step N — <Name> | Gate: <none|soft|hard> | Model: <tier>`; `| Model:` appears only when `docs/MODELS.md` maps tiers to different models.
- **Step files** follow `kit/resource/step-specification-template.md` (Overview, Scope, Rules, Artifacts, Completion Criteria, Transitions, optional Exceptions). Overview `Gate`/`Model` bullets must match the phase table.
- **Agent routing** (`kit/task-agent-rubric.md`): all tasks go to the general-purpose agent; review tasks also load the review skills; Phase 2 Step 2 assigns `Specialist:` per task and marks parallel groups.
- **Artifact header** (`draft` → `approved` at the phase's hard gate): `Status`, `Last updated`, `Based on`, as `**Status:** …` or `- **Status**: …` (lint accepts both). Variants: `07-constitution.md` uses `Last amended`; `08-scaffold-checklist.md` uses `not-started | in-progress | complete`. Exempt set: `NO_METADATA` in `tests/kit-consistency.test.mjs`.
- **Templates** are numbered by Phase 1 step (`01-idea-brief.md` … `08-scaffold-checklist.md`; letters for sub-documents, e.g. `03a-c`, `06b-d`). Phase 2 uses `spec.md`, `plan.md`, `e2e-tests.md`, `pr-description.md`; `spec-screen.md` belongs to Phase 1 Step 5. Full table: `docs-site/reference/templates.md`.
- **Upgrade registry**: `kit/phase-upgrade.md` lists one-time migration modules; add a row for every future migration.
- **New `kit/*.md` file**: also add it to `PAGES` (or `KIT_NOT_PUBLISHED`) in `docs-site/.vitepress/config.ts`, or the docs build throws.
- **Bug fix scope**: `assess.md` fixes in/out-of-scope files; reproduce first; if the symptom persists at Verify, return to Assess, never patch around it.
- **Changelog rule**: every `kit/` change goes in `kit/CHANGELOG.md` (newest-first, `[Unreleased]` until release) — the single source for kit file changes. `testing/testing-log.md` holds only test-round issues and lessons.

---

## Important Files

| File | Role |
|---|---|
| `bin/cli.js` | Installer |
| `kit/START.md` | Entry router (read-only); reuses the Detect step of `phase-upgrade.md` |
| `kit/orchestrator-conventions.md` | Universal rules and gate definitions |
| `kit/stack-catalog.md` | Architecture-step stack reference |
| `kit/scripts/lint-docs.js` | Read-only lint of top-level `docs/*.md`: `Status`, `Last updated`, stale `Based on` (approved files), `.craft-kit.json` schema; growth warnings only for `phase-2-session.md` and `E2E-TESTS.md` |
| `kit/scripts/render-backlog.js` + `kit/templates/backlog.{json,html}` | Backlog validator/renderer: `node scripts/render-backlog.js [project-root]` |
| `kit/scripts/docs-index.js`, `kit/scripts/view-docs.js` | Docs viewer: the index scans `docs/` into JSON; the viewer mirrors `docs/` (markdown plus allow-listed web files, never dotfiles or JSON) into `~/.craft-kit/viewer/sites/<name>-<hash>/`, generates overview/documents/backlog/artifacts pages, and runs or builds VitePress. Read-only on `docs/`; the only network call is a one-time `npm install` of VitePress and Mermaid into `~/.craft-kit/viewer/` (`CRAFT_KIT_HOME` overrides) |
| `docs-site/.vitepress/config.ts` | Nav, sidebar, srcExclude, rewrites (generated from one page table) |
| `testing/testing-log.md`, `testing/kit-testing-summary.md` | Open issues/lessons; closed-round scorecards |

---

## Runtime & Tooling

- Node.js ≥ 18, no Bun. npm only; lockfile only at `docs-site/package-lock.json` (root has zero deps).
- Root package is CJS (`require()`); docs-site is ESM; tests are `.mjs`. VitePress `^1.6.3`.
- The CLI has no `dependencies`; CI skips `npm install`.
- Published files: `kit/` and `bin/` (plus README/LICENSE). `docs-site/` and `testing/` are dev-only.
- `.gitignore` covers OS/editor files, `WATCHDOG.yml`, `supabase`, `testing/`. `AGENTS.md` is tracked. Only `testing/.gitignore`, `testing-log.md`, `kit-testing-summary.md` are tracked; new files there need `git add -f`.

### Release process

Normally automated: the manual `release-trigger.yml` workflow (from `main`, needs a non-empty `RELEASE_NOTES.md` and green checks) bumps `package.json`, promotes `[Unreleased]` in `kit/CHANGELOG.md`, commits, and pushes tag `vX.Y.Z`; `release.yml` then publishes the GitHub Release. Manual fallback: set `package.json` `version`, rename `## [Unreleased]` to `## [x.y.z] - YYYY-MM-DD`, `git tag vx.y.z && git push origin vx.y.z`. Tag before announcing: handoffs print `npx github:KhoaLy2003/craft-kit#v<kit_version>`. A test checks `package.json` version against the first released CHANGELOG heading. README, docs-site and the CLI's `--force` hint stay unpinned.

---

## Testing & QA

Zero deps. `tests/measure-reading-set.mjs` is a dev-only script, not part of `npm test`.

| File | Covers |
|---|---|
| `tests/cli.test.mjs` | Installer: flags, fresh install, `--force` manifest cleanup, `--skip-setup`, non-TTY output, quick-start paths, kit link integrity, release/verification contracts |
| `tests/kit-consistency.test.mjs` | Kit drift lint: step-file sections, Gate/Model bullets vs phase tables, the `Hard gates:` list in this file vs `Gate: hard` steps, no orphan steps/templates, template headers |
| `tests/lint-docs.test.mjs` | Shipped docs lint against `tests/fixtures/lint-docs/` |
| `tests/render-backlog.test.mjs` | Backlog script, run for real |
| `tests/view-docs.test.mjs` | Viewer index, mirror and generated pages via `--prepare`; install-over-older-kit path; real VitePress build only with `CRAFT_KIT_VIEWER_BUILD=1` |
| `tests/docs-site.test.mjs` | Hand-written docs pages: links, skill list, step counts |

- `cli.test.mjs` spawns the real CLI with `spawnSync` and `input: ''` (non-TTY, no prompts, no network) in temp dirs; path assertions there use `[/\\]` because CI runs Windows.
- `npm test` lists the seven files explicitly in `package.json`; a new `*.test.mjs` must be added there.
- `kit-lite.test.mjs` covers the lite kit: `--lite` install, the `CLAUDE.md` / `.claude/settings.json` / `.gitignore` wiring (idempotent, never clobbers user content), and `kit-lite/audit/record.cjs` fed sample hook payloads, including from a `"type": "module"` project.
- Keep the `Hard gates:` line above at column 0 and in sync with each step's `Gate:` bullet, or `kit-consistency` fails. `docs-site.test.mjs` hard-codes the 8 / 7 step counts.

### E2E validation rounds

`testing/round-NN/<project-slug>/` holds `docs/`, `src/`, and a generated Playwright `e2e-test.mjs` (chromium). Target: 100% pass before the Manual Check gate. Five rounds done (R01 PASS, R02 FAIL, R03–R05 PASS) on the single-pass track (now Phase 2 `scope: all`). Older issue references in `testing/` use pre-2026-10 step numbering.
