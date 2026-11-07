# Repository Guidelines

## Project Overview

**craft-kit** is an AI-agent orchestration workflow kit for building software products. It ships as an npx-installable CLI (`npx github:KhoaLy2003/craft-kit`) that copies a structured set of workflow scripts and templates into a target project directory, then guides an AI orchestrator through a repeatable phase-based development process.

The repo is the development and testing harness for that kit — not an application. It contains:
- `bin/cli.js` — the CLI installer
- `kit/` — the publishable workflow kit (read-only reference; never modified during a run)
- `testing/` — narrative end-to-end validation runs (5 rounds completed)
- `docs-site/` — VitePress public documentation site

`README.md` (repo root) is the only orientation doc; there is no `kit/README.md`.

---

## Architecture & Data Flow

### CLI Installer (`bin/cli.js`)

Single command, no subcommands. Execution order:

1. Parse `argv`. Unknown flags print usage and exit 1. Optional `[target-dir]` (default `./kit`)
2. Preflight the target: a file where a directory is needed fails with a one-line error; a non-empty target without `--force` exits 1
3. Copy every `kit/` file except `resource/` (dev-only) and the top-level `CHANGELOG.md` — pure file copy, zero network (only the optional skill installs in step 8 fetch unpinned code from GitHub via `npx skills add`)
4. With `--force` and a previous `<target>/.craft-kit-manifest.json`: delete files in the old manifest that the new kit no longer ships, then prune emptied directories. Files not in the manifest (user-added) are never touched, and manifest entries resolving outside the target are ignored. With no previous manifest, print a one-line note that renamed files from older versions may linger
5. Write `.craft-kit-version` and `.craft-kit-manifest.json` (sorted relative file list) on every install; print the upgrade message when `--force` crosses versions
6. If `--skip-setup`: print quick-start and exit
7. **Non-TTY** (CI / pipe): print Superpowers install instructions + `design-taste-frontend`, `archify` and the four review-skill commands, then quick-start
8. **TTY interactive**: same Superpowers text, then prompt for (a) `npx skills add design-taste-frontend` and `npx skills add archify` → `.agents/skills/`, (b) the four review skills (`code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization`) from addyosmani/agent-skills via `npx skills add`
9. Print quick-start with the relative kit path, led by "Not sure where to start? Say: Start using `<rel>/START.md`" (then Phase 1 = `phase-1-bootstrap.md`, existing project = `phase-2.md`, with the Adopt path `phase-adopt.md` for a codebase with no kit documents and the upgrade path `phase-upgrade.md`, bug fix = `phase-bug-fix.md`, admin site = `phase-admin.md`, developer onboarding = `phase-onboarding.md`). The post-install missing-docs hint also names the constitution's `Verification Commands` section

There is no harness detection; install instructions for every supported harness are always printed.

### Kit Workflow Phases

Owned by the phase files; this is the index only (`kit/START.md` routes between them).

| Workflow | Entry file | Steps / output |
|---|---|---|
| Phase 1 Bootstrap (once) | `kit/phase-1-bootstrap.md` | 8 steps → `docs/` foundation set, `docs/.craft-kit.json`, one commit, Phase 2 handoff prompt |
| Phase 2 Build | `kit/phase-2.md` | 7 steps, scope `all` (validated) or `feature` (experimental), set in `docs/roadmap.md` |
| Maintenance | `kit/phase-maintenance.md` | Choose feature or bug → bug: `kit/phase-bug-fix.md`; feature: intake + fit check → backlog/roadmap entry → Phase 2 `scope: feature` |
| Adopt / Upgrade | `kit/phase-adopt.md`, `kit/phase-upgrade.md` | existing code without kit docs / older projects; upgrade modules in `kit/phase-*-backfill.md` etc. |
| Bug Fix, Admin, Onboarding | `kit/phase-bug-fix.md`, `kit/phase-admin.md`, `kit/phase-onboarding.md` | see each file |

Everything except Phase 1 + Phase 2 `scope: all` is experimental. One session log per phase (`docs/phase-N-session.md`, `bug-session`, `admin-session`, `adopt-session`; format in `kit/session-logging.md`). START.md keeps none.

### Gate System

| Gate | Behavior |
|------|----------|
| `none` | Auto-advance |
| `soft` | Orchestrator presents summary; advances unless user objects |
| `hard` | Full stop — emit a Gate Summary naming the decision, wait for explicit approval |

Hard gates: Phase 1 Steps 3, 4, 5, 6; Phase 2 Steps 1, 6; Adopt Steps 2, 3, 4; Bug Fix Assess (Verify is soft, hard only when the symptom is UI-only); Maintenance Intake only when the feature does not fit; Admin Scope, Admin Ship; Onboarding Review. Full definition: `kit/orchestrator-conventions.md` → Gates.

---

## Key Directories

| Path | Purpose |
|------|---------|
| `bin/` | CLI entry point (`cli.js`) |
| `kit/` | Publishable workflow kit — orchestration scripts, templates, step files, guides |
| `kit/steps/phase-1/` | `p1-01-ideation.md` … `p1-08-scaffold.md` |
| `kit/steps/phase-2/` | `p2-01-spec.md` … `p2-07-ship.md` |
| `kit/guides/` (on-demand detail) | `conventions-detail.md` and the guides listed below; read only when a rule points there |
| `kit/templates/` | Fill-in output templates; copied to `<project>/docs/` — **never edit during a run** |
| `kit/guides/` | `design-reference.md`, `session-handover.md` |
| `kit/resource/` | `step-specification-template.md` — dev-only, **not installed** |
| `tests/` | `cli.test.mjs`, `render-backlog.test.mjs`, `kit-consistency.test.mjs`, `lint-docs.test.mjs`; `tests/fixtures/lint-docs/` holds the lint fixture projects |
| `testing/` | Narrative E2E validation rounds; each under `testing/round-NN/<project-slug>/` |
| `docs-site/` | VitePress site; `srcDir: '..'` reads directly from `kit/` |

---

## Development Commands

```bash
# Run the test suite (no npm install needed — zero external deps)
npm test

# Docs site
cd docs-site
npm run dev       # VitePress dev server (localhost)
npm run build     # Production build
npm run preview   # Preview built output

# Run the CLI from the working tree
node bin/cli.js [target-dir] [--force] [--skip-setup]
```

CI runs the test suite on ubuntu + windows × Node 18 + 22 with no `npm install` step.

---

## Code Conventions & Common Patterns

### Orchestrator Conventions (`kit/orchestrator-conventions.md`)

The single source for rules every orchestrating agent follows: step banner, model tiers, PROJECT_ROOT injection, fail-fast write instruction, write verification, write-file-then-ask-for-review, English-only, session-log cadence, gate definitions, and the frontend dispatch contract (DESIGN.md + design manifest). Phase and step files point there instead of restating them.

Banner (one line, defined only in that file):
```
## Step N — <Name> | Gate: <none|soft|hard> | Model: <tier>
```
`| Model: <tier>` is appended only when `docs/MODELS.md` maps tiers to different models (conventions → Step Banner).

### Step File Structure

Step files (`kit/steps/`) follow the skeleton in `kit/resource/step-specification-template.md`: Overview, Scope, Rules, Artifacts, Completion Criteria, Transitions, Exceptions (sections that carry no content are omitted). A step file's Overview carries `Gate` and `Model` bullets that must match the phase table; `tests/kit-consistency.test.mjs` checks this.

### Agent Routing (`kit/task-agent-rubric.md`)

Routing (`kit/task-agent-rubric.md`) sends all tasks to the general-purpose agent; review tasks also load `code-review-and-quality`, `security-and-hardening`, `performance-optimization` (and `code-simplification` for fixes); UI-quality and admin-screen tasks also use their skills. Phase 2 Step 2 (Plan) assigns `Specialist:` per task and marks parallel groups.

### Artifact Metadata Headers

Every generated artifact starts with:
```markdown
**Status:** draft | approved
**Last updated:** YYYY-MM-DD
**Based on:** <input files this artifact was derived from>
```

`draft` → `approved` at each phase's hard gate.

### Templates

`kit/templates/` files are numbered by Phase 1 step (`01-idea-brief.md` … `08-scaffold-checklist.md`; letters for sub-documents, no template for Step 5). Phase 2 uses `spec.md`, `plan.md`, `spec-screen.md`, `e2e-tests.md`. The full table is `docs-site/reference/templates.md`.

### Bug Fix Scope Discipline

`assess.md` names in-scope and out-of-scope files; the fix must not touch anything outside that boundary. Reproduce first. If the symptom persists at Verify, return to Assess — never patch around it.

---

## Important Files

| File | Role |
|------|------|
| `bin/cli.js` | CLI entry point; entire installer implementation (CJS) |
| `kit/orchestrator-conventions.md` | Universal rules + gate definitions (absorbed `gate-management.md`) |
| `kit/phase-1-bootstrap.md` | Phase 1 orchestration, "Model tiers" section (absorbed `setup-models.md`) |
| `kit/phase-2.md` | Phase 2 orchestration, scope `all` / `feature` |
| `kit/START.md` | Entry router (read-only): Detect → workflow + prompt; reuses the Detect step of `phase-upgrade.md` |
| `kit/phase-adopt.md`, `kit/phase-upgrade.md` and the upgrade modules (`kit/phase-*-backfill.md`, `phase-log-collapse.md`) | Existing-project workflows. Upgrade is the registry of one-time modules: add a row there for every future migration. Adopt writes `docs/adopt-session.md`. Template exceptions to the metadata-header rule: `craft-kit.json`, `pr-description.md`, `adopt-survey.md` |
| `kit/phase-maintenance.md`, `kit/phase-bug-fix.md`, `kit/phase-admin.md`, `kit/phase-onboarding.md` | Other workflows. Maintenance writes `docs/maintenance-session.md` |
| `kit/scripts/lint-docs.js` | Read-only docs lint shipped with the kit: valid `Status`, `Last updated` format, `stale` warnings, `.craft-kit.json` schema, growth warnings for the session log and E2E doc (conventions rule 11) |
| `kit/scripts/render-backlog.js`, `kit/templates/backlog.json`, `kit/templates/backlog.html` | Backlog validator and renderer; JSON source and HTML template |
| `kit/task-agent-rubric.md` | Task type → specialist agent routing |
| `kit/stack-catalog.md` | Architecture-step stack reference: Canonical Baseline, Deviation Triggers, Additions Catalog |
| `kit/session-logging.md` | Session log format and conventions |
| `kit/CHANGELOG.md` | Kit change history, newest-first — **single source for kit file changes**; excluded from installs |
| `testing/testing-log.md` | Open issues and lessons from test rounds (not a file-change log) |
| `testing/kit-testing-summary.md` | Closed-round scorecards |
| `docs-site/.vitepress/config.ts` | VitePress nav, sidebar, srcExclude, URL rewrites (generated from one page table) |

---

## Runtime / Tooling Preferences

- **Runtime**: Node.js ≥ 18. No Bun dependency.
- **Package manager**: npm (lock file at `docs-site/package-lock.json`; no root lock file — root package has zero deps)
- **Module format**: Root package is CJS. `bin/cli.js` uses `require()`. Docs-site is ESM. Tests use `.mjs`.
- **Zero install-time dependencies**: the CLI ships with no `dependencies`; CI skips `npm install`.
- **Docs framework**: VitePress `^1.6.3`; `kit/` markdown is the source of truth for docs pages.
- **`.gitignore`**: ignores OS/editor files, `WATCHDOG.yml` (developer-local AI advisor config), `supabase`, and `testing/`.
- **`AGENTS.md` is not gitignored** — it is tracked and committed like any other file.
- **`testing/` is gitignored**: round projects are never tracked. Only `testing/.gitignore`, `testing-log.md`, and `kit-testing-summary.md` are tracked (already in the index; new files there need `git add -f`).

Published package files: `kit/` and `bin/` (`LICENSE` and `README.md` are included by npm automatically). The docs-site and testing directories are dev-only.

### Release process

Every version cut in `kit/CHANGELOG.md` needs matching state in three places: (1) set `version` in `package.json`; (2) turn `## [Unreleased]` into `## [x.y.z] - YYYY-MM-DD`; (3) create and push the git tag `vx.y.z` (`git tag vx.y.z && git push origin vx.y.z`). The Phase 1, Adopt, and Upgrade handoffs print `npx github:KhoaLy2003/craft-kit#v<kit_version>`, which only works once the tag exists, so tag before announcing a release. Check the command with `#` on Windows PowerShell and cmd. A test asserts that `package.json` `version` equals the first released version in the CHANGELOG; the tag is checked by hand. README, docs-site, and the CLI's `--force` hint stay unpinned.

---

## Testing & QA

### Framework

`node:test` with `node:assert/strict`. No external libraries. Five files: `tests/docs-site.test.mjs` (hand-written docs-site pages: links, skill list, step counts), `tests/cli.test.mjs` (installer), `tests/render-backlog.test.mjs` (backlog validator and renderer, run against the real script), `tests/kit-consistency.test.mjs` (the kit's own drift lint), and `tests/lint-docs.test.mjs` (the shipped docs lint, run against fixtures in `tests/fixtures/lint-docs/`).

### Test Strategy

CLI tests spawn the real CLI via `spawnSync` with `input: ''` (piped stdin → non-TTY path; no prompts, no network). Each test gets an isolated `tempDir()`.

| Block | What is tested |
|---|---|
| flags | `--help`/`-h`, `--version`/`-v`, unknown flag → exit 1 with usage |
| fresh install | Key files present; default `./kit`; installed tree == `kit/` minus `resource/` and `CHANGELOG.md`; version stamp + sorted manifest |
| non-empty target | Exit 1 without `--force`; `--force` installs; stale manifest files removed, emptied dirs pruned, user files kept; manifest path escape ignored; no-manifest note; file-as-target fails cleanly |
| `--skip-setup` | Quick-start only, no setup instructions |
| non-TTY output | Setup instructions printed; install commands for the four review skills; no agent download |
| quick start paths | Use the installed dir name, not a hardcoded `kit/`; lead with the START.md line; print the Adopt path |
| kit link integrity | Backticked / markdown-link `.md` references to kit files in `kit/**/*.md` (excluding `CHANGELOG.md`, `resource/`) and `README.md` all resolve |
| release and verification contracts | `package.json` version == first released CHANGELOG version; template 07 has `## Verification Commands`; `phase-upgrade.md` registry row #4 names an existing module; the install hint reports a constitution without that section |
| kit consistency (`kit-consistency.test.mjs`) | Step files have Overview, Completion Criteria, Transitions; Gate and Model bullets in Overview match the phase tables; the `Hard gates:` list in this file matches `Gate: hard` steps; no orphan step files or templates; template metadata headers (exceptions listed in the test) |
| docs lint (`lint-docs.test.mjs`) | Valid headers pass; invalid `Status`, malformed date → exit 1; stale `Based on` → warning, exit 0 |

### Cross-Platform Notes

Path assertions use `[/\\]`. CI runs ubuntu and windows.

### E2E Testing (Kit Validation Rounds)

The kit itself is validated through narrative end-to-end rounds:
```
testing/round-NN/<project-slug>/
  docs/                   # Phase artifacts
  src/                    # Built application source
  e2e-test.mjs            # Generated Playwright suite (chromium)
```

Target: 100% pass rate on the generated Playwright suite before the Manual Check gate. Rounds completed: 5 (R01 PASS, R02 FAIL, R03–R05 PASS), all on the single-pass track (now Phase 2 `scope: all`). The 2026-10 refactor renumbered steps, so older issue references in `testing/` use the old numbering.

**Kit Change Logging Rule**: every `kit/` change is recorded in `kit/CHANGELOG.md` (newest-first, `[Unreleased]` until a release) — that is the single source for which kit files changed. `testing/testing-log.md` records only issues found in test rounds and the lessons from them; do not duplicate file-change tables there.
