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
3. Copy every `kit/` file except `resource/` (dev-only) and the top-level `CHANGELOG.md` — pure file copy, zero network
4. With `--force` and a previous `<target>/.craft-kit-manifest.json`: delete files in the old manifest that the new kit no longer ships, then prune emptied directories. Files not in the manifest (user-added) are never touched, and manifest entries resolving outside the target are ignored. With no previous manifest, print a one-line note that renamed files from older versions may linger
5. Write `.craft-kit-version` and `.craft-kit-manifest.json` (sorted relative file list) on every install; print the upgrade message when `--force` crosses versions
6. If `--skip-setup`: print quick-start and exit
7. **Non-TTY** (CI / pipe): print Superpowers install instructions + `design-taste-frontend` command + optional `evon:ui-ux` command + agent download instructions, then quick-start
8. **TTY interactive**: same Superpowers text, then prompt for (a) `npx skills add design-taste-frontend` → `.agents/skills/`, plus an optional `evon:ui-ux` install (admin site workflow), (b) download of 6 VoltAgent agent `.md` files to `.agents/agents/` (`httpsGet` has a 15 s timeout and a 5-redirect limit)
9. Print quick-start with the relative kit path (Phase 1 = `phase-1-bootstrap.md`, Phase 2 = `phase-2.md`, bug fix = `phase-bug-fix.md`, admin site = `phase-admin.md`)

There is no harness detection; install instructions for every supported harness are always printed.

### Kit Workflow Phases

```
Phase 1 (Bootstrap, once per project) — 8 steps
  1 Ideation → 2 Market Research → 3 Prototype & Design → 4 Roadmap →
  5 Full Screen Design → 6 Architecture → 7 Constitution → 8 Scaffold
  Output: docs/{idea-brief,market-notes,DESIGN,roadmap,architecture,constitution,
                scaffold-checklist,MODELS}.md; docs/prototype/, docs/preview/, docs/designs/
          docs/phase-1-session.md; one Phase 1 commit; Phase 2 handoff prompt

Phase 2 (Build) — one track, 7 steps, parameterised by scope
  1 Spec → 2 Plan → 3 Implement → 4 Review → 5 E2E → 6 Manual Check → 7 Ship
  scope all     = every Must feature in one cycle (validated)
  scope feature = one feature per cycle (experimental)
  Scope is decided in p1-04-roadmap.md (the only place the selection rule lives)
  and recorded as `Phase 2 Scope: all | feature` in docs/roadmap.md.
  Output: docs/specs/[<feature-slug>/]{spec,plan}.md + code on feature/<slug>
          docs/phase-2-session.md (one section per feature)

Other workflows (all experimental — not yet validated in a test round)
  Bug Fix: Assess → Fix → Verify         docs/specs/bugs/<bug-slug>/assess.md, fix/<bug-slug> → PR
  Phase 3: Discover → Prioritise → Handoff
  Admin Site: Scope → Spec & Plan → Implement → Review & E2E → Ship
              docs/admin/scope.md, docs/specs/admin/{spec,plan}.md, feature/admin → one PR (main-backend changes + admin/)
  Session Handover: guides/session-handover.md
```

Session logs, one per phase, never per project folder: `docs/phase-1-session.md`, `docs/phase-2-session.md`, `docs/bug-session.md`, `docs/phase-3-session.md`, `docs/admin-session.md`. Updated at gates and at completion, not after every step.

### Gate System

| Gate | Behavior |
|------|----------|
| `none` | Auto-advance |
| `soft` | Orchestrator presents summary; advances unless user objects |
| `hard` | Full stop — emit a Gate Summary naming the decision, wait for explicit approval |

Hard gates: Phase 1 Steps 3, 4, 5, 6; Phase 2 Steps 1, 6; Bug Fix Assess (Verify is soft, hard only when the symptom is UI-only); Phase 3 Prioritise; Admin Scope, Admin Ship. Full definition: `kit/orchestrator-conventions.md` → Gates.

---

## Key Directories

| Path | Purpose |
|------|---------|
| `bin/` | CLI entry point (`cli.js`) |
| `kit/` | Publishable workflow kit — orchestration scripts, templates, step files, guides |
| `kit/steps/phase-1/` | `p1-01-ideation.md` … `p1-08-scaffold.md` |
| `kit/steps/phase-2/` | `p2-01-spec.md` … `p2-07-ship.md` |
| `kit/templates/` | Fill-in output templates; copied to `<project>/docs/` — **never edit during a run** |
| `kit/guides/` | `design-reference.md`, `evolving-specs.md`, `interactive-prototype-process.md`, `session-handover.md` |
| `kit/guides/admin-blueprint.md` | Admin workflow's fixed stack, behavior contracts, module registry, backend conventions |
| `kit/resource/` | `step-specification-template.md` — dev-only, **not installed** |
| `testing/` | Narrative E2E validation rounds; each under `testing/round-NN/<project-slug>/` |
| `docs-site/` | VitePress site; `srcDir: '..'` reads directly from `kit/` |

---

## Development Commands

```bash
# Run the test suite (no npm install needed — zero external deps)
node --test tests/cli.test.mjs

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

### Step File Structure

Step files (`kit/steps/`) follow the 8-section skeleton in `kit/resource/step-specification-template.md` (`Overview → Scope → Execution Rules → Artifact Rules → Completion Criteria → Transition Rules → Exceptions → References`). Sections that carry no content are shortened or omitted.

### Agent Routing (`kit/task-agent-rubric.md`)

Routing table maps task signals to `frontend-developer`, `backend-developer`, the `design-taste-frontend` skill, or the general-purpose agent; tests go to the same agent as the code under test; a task that mixes frontend and backend is split before assignment. Phase 2 Step 2 (Plan) assigns `Specialist:` per task and marks parallel groups.

### Artifact Metadata Headers

Every generated artifact starts with:
```markdown
**Status:** draft | approved
**Last updated:** YYYY-MM-DD
**Based on:** <input files this artifact was derived from>
```

`draft` → `approved` at each phase's hard gate.

### Template Numbering

Phase 1 templates follow the Phase 1 steps (no template for Step 5 — it uses `spec-screen.md`):
```
phase-1-kickoff.md     — user-filled intake form
01-idea-brief.md       — Step 1
02-market-notes.md     — Step 2
03a-journey-map.md     — Step 3 (→ docs/prototype/journey-map.md)
03b-prototype-brief.md — Step 3 (→ docs/prototype/prototype-brief.md)
03c-design-system.md   — Step 3 (→ docs/DESIGN.md)
04-roadmap.md          — Step 4
spec-screen.md         — Step 5 / Phase 2 specs (per-screen)
06-architecture.md     — Step 6
07-constitution.md     — Step 7
08-scaffold-checklist.md — Step 8
MODELS.md              — model tier map (→ docs/MODELS.md)
e2e-tests.md           — Phase 2 Step 5 (→ docs/E2E-TESTS.md)
admin-scope.md         — Admin Step 1 (→ docs/admin/scope.md)
```

### Bug Fix Scope Discipline

`assess.md` names in-scope and out-of-scope files; the fix must not touch anything outside that boundary. Reproduce first. If the symptom persists at Verify, return to Assess — never patch around it.

---

## Important Files

| File | Role |
|------|------|
| `bin/cli.js` | CLI entry point; entire installer implementation (~415 lines, CJS) |
| `kit/orchestrator-conventions.md` | Universal rules + gate definitions (absorbed `gate-management.md`) |
| `kit/phase-1-bootstrap.md` | Phase 1 orchestration, "Model tiers" section (absorbed `setup-models.md`), single closeout checklist, Phase 2 handoff |
| `kit/phase-2.md` | Phase 2 orchestration, scope `all` / `feature` |
| `kit/phase-3-iterate.md`, `kit/phase-bug-fix.md`, `kit/phase-admin.md` | Other workflows |
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

---

## Testing & QA

### Framework

`node:test` with `node:assert/strict`. No external libraries. Single file: `tests/cli.test.mjs` (7 describe blocks, 19 tests).

### Test Strategy

CLI tests spawn the real CLI via `spawnSync` with `input: ''` (piped stdin → non-TTY path; no prompts, no network). Each test gets an isolated `tempDir()`.

| Block | What is tested |
|---|---|
| flags | `--help`/`-h`, `--version`/`-v`, unknown flag → exit 1 with usage |
| fresh install | Key files present; default `./kit`; installed tree == `kit/` minus `resource/` and `CHANGELOG.md`; version stamp + sorted manifest |
| non-empty target | Exit 1 without `--force`; `--force` installs; stale manifest files removed, emptied dirs pruned, user files kept; manifest path escape ignored; no-manifest note; file-as-target fails cleanly |
| `--skip-setup` | Quick-start only, no setup instructions |
| non-TTY output | Setup instructions printed; exactly six required agents |
| quick start paths | Use the installed dir name, not a hardcoded `kit/` |
| kit link integrity | Backticked / markdown-link `.md` references to kit files in `kit/**/*.md` (excluding `CHANGELOG.md`, `resource/`) and `README.md` all resolve |

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
