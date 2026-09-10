# Repository Guidelines

## Project Overview

**craft-kit** is an AI-agent orchestration workflow kit for building software products. It ships as an npx-installable CLI (`npx github:KhoaLy2003/craft-kit`) that copies a structured set of workflow scripts and templates into a target project directory, then guides an AI orchestrator through a repeatable phase-based development process.

The repo is the development and testing harness for that kit — not an application. It contains:
- `bin/cli.js` — the CLI installer
- `kit/` — the publishable workflow kit (read-only reference; never modified during a run)
- `testing/` — narrative end-to-end validation runs (5 rounds completed)
- `docs-site/` — VitePress public documentation site

---

## Architecture & Data Flow

### CLI Installer (`bin/cli.js`)

Single command, no subcommands. Execution order:

1. Parse `argv` for flags and optional `[target-dir]` (default: `./kit`)
2. Guard against overwriting a non-empty target without `--force`
3. `fs.cpSync(kit/, target, { recursive: true })` — pure file copy, zero network
4. If `--skip-setup`: print quick-start path and exit
5. Detect AI harness from homedir dotfiles: `.claude` → Claude Code, `.cursor` → Cursor, `.gemini` → Gemini CLI, `.config/hermes` → Hermes, `.github/copilot` → Copilot
6. **Non-TTY** (CI / pipe): print Superpowers install instructions + agent download instructions + quick-start, then exit
7. **TTY interactive**: prompt through (a) Superpowers `/plugin install`, (b) optional `npx skills add design-taste-frontend`, (c) optional download of 5 VoltAgent `.md` files to `~/.claude/agents/`
8. Print quick-start prompt with relative kit path

### Kit Workflow Phases

```
Phase 1 (Bootstrap, once per project)
  8 steps: Ideation → Market Research → Prototype → Design →
           Roadmap → Architecture → Constitution → Scaffold
  Output: docs/{idea-brief,market-notes,prototype/,DESIGN,roadmap,
                architecture,constitution,scaffold-checklist}.md
          docs/phase-1-session.md

Phase 2 — Standard Loop (one feature per cycle)
  9 steps per feature: Spec → Plan → Assign Specialists → Implement →
  Converge → Code Review → E2E Testing → Manual Check → Ship
  Output: docs/specs/<feature-slug>/spec.md + plan.md + code on feature branch

Phase 2 — Single-Pass (all Must features, one cycle)
  7 steps: Full App Spec → Plan → Implement → Converge →
           E2E Plan → Code Review + E2E → Ship
  Use when: <15 Must features, S/M-sized, single-domain, solo dev

Bug Fix Workflow (3 steps per bug)
  Assess (hard gate) → Fix → Verify (hard gate)
  Output: docs/specs/bugs/<bug-slug>/assess.md + fix/<bug-slug> branch → PR
```

### Gate System

| Gate | Behavior |
|------|----------|
| `none` | Auto-advance |
| `soft` | Orchestrator presents summary; advances unless user objects |
| `hard` | Full stop — emit Gate Summary, wait for explicit human approval |

Hard gates in Phase 1: Steps 2, 3, 4, 5, 6, 7. Hard gates in Phase 2 standard loop: Steps 1, 8. Hard gates in Phase 2 single-pass: Steps 1, 2, 5a, 6.

---

## Key Directories

| Path | Purpose |
|------|---------|
| `bin/` | CLI entry point (`cli.js`) |
| `kit/` | Publishable workflow kit — orchestration scripts, templates, step files, guides |
| `kit/steps/phase-1/` | Detailed step files `p1-01-ideation.md` through `p1-08-scaffold.md` |
| `kit/steps/phase-2/` | Standard loop `p2-01-spec.md` through `p2-09-ship.md`; single-pass `p2sp-01-*` through `p2sp-07-*` |
| `kit/templates/` | Fill-in output templates (numbered by Phase 1 step); copied to `<project>/docs/` — **never edit here** |
| `kit/guides/` | `evolving-specs.md`, `e2e-testing-plan.md` |
| `kit/resource/` | `DESIGN.md` (Airbnb design system reference), `step-specification-template.md`, `interactive-prototype-process.md` |
| `testing/` | Narrative E2E validation rounds; each under `testing/round-NN/<project-slug>/` |
| `docs-site/` | VitePress documentation site; `srcDir: '..'` reads directly from `kit/` |

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

# Install/update the CLI globally for local testing
npx . [target-dir] [--force] [--skip-setup]
```

CI runs the test suite across a 3×3 matrix (ubuntu/windows/macos × Node 18/20/22) with no `npm install` step.

---

## Code Conventions & Common Patterns

### Orchestrator Conventions (`kit/orchestrator-conventions.md`)

Every agent orchestrating a phase MUST:

1. **Step banner** — emit before every step:
   ```
   ## Step N — <Name>
   Skill/Agent: <name> | Gate: <type> | Started: <time> | Credits: <n>
   ```
2. **PROJECT_ROOT injection** — pass the absolute project path in every subagent dispatch; subagents cannot infer it
3. **Fail-fast write protocol** — every file-producing subagent dispatch includes: "stop immediately on first write failure, yield content, notify orchestrator via hub"
4. **File write verification** — after every subagent task, confirm the output file exists on disk; if missing, recover content from `agent://<id>` and write directly
5. **20-line preview** — read the first 20 lines of every written file before marking a step complete; catches truncation and unfilled placeholders
6. **Gate Summary** — one-sentence summary emitted immediately before every hard gate
7. **Session log update** — record wall-clock duration and credit delta at the end of every step

### Step File Structure

All step files (in `kit/steps/`) follow an 8-section template:
`Overview → Scope → Execution Rules → Artifact Rules → Completion Criteria → Transition Rules → Exceptions/Special Cases → References`

The canonical template is at `kit/resource/step-specification-template.md`.

### Agent Routing (`kit/task-agent-rubric.md`)

| Task signals | Agent |
|---|---|
| Component, page, form, style, layout, UI | `frontend-developer` |
| Visual quality, design system, icons | `design-taste-frontend` skill |
| API, DB schema, auth, business logic, infra | `general-purpose` |
| Tests | Same agent as the code under test |
| **Frontend + backend in one task** | **SPLIT before assigning** |

Parallel dispatch when file scopes are provably disjoint.

### Artifact Metadata Headers

Every generated artifact starts with:
```markdown
**Status:** draft | approved
**Last updated:** YYYY-MM-DD
**Based on:** <input files this artifact was derived from>
```

`draft` → `approved` at each phase's hard gate. Phases do not advance until status is `approved`.

### Template Numbering

Phase 1 templates are numbered by step:
```
phase-1-kickoff.md     — user-filled intake form
01-idea-brief.md       — Step 1 output
02-market-notes.md     — Step 2 output
04a-journey-map.md     — Step 4 output (a)
04b-prototype-brief.md — Step 4 output (b)
05-design-system.md    — Step 5 output (→ docs/DESIGN.md)
06-roadmap.md          — Step 6 output
07-architecture.md     — Step 7 output
08-constitution.md     — Step 8 output
09-scaffold-checklist.md
```

Templates are copied to `<project>/docs/` and filled there. Never edit `kit/templates/` directly.

### Bug Fix Scope Discipline

`assess.md` explicitly names in-scope and out-of-scope files. The fix must not touch anything outside that boundary. If the symptom persists at Verify, return to Assess — never patch around the symptom.

---

## Important Files

| File | Role |
|------|------|
| `bin/cli.js` | CLI entry point; entire installer implementation (~420 lines, CJS) |
| `kit/README.md` | Kit orientation and install instructions; start here |
| `kit/phase-1-bootstrap.md` | Phase 1 orchestration script (8 steps) |
| `kit/phase-2-feature-dev.md` | Phase 2 standard loop orchestration (9 steps/feature) |
| `kit/phase-2-single-pass.md` | Phase 2 single-pass orchestration (7 steps) |
| `kit/phase-bug-fix.md` | Bug fix workflow (3 steps) |
| `kit/orchestrator-conventions.md` | Universal rules every orchestrating agent MUST follow |
| `kit/task-agent-rubric.md` | Task type → specialist agent routing table |
| `kit/stack-catalog.md` | Pre-researched web stacks for Step 6 (Architecture); 6 entries, verified 2026-09-04 |
| `kit/gate-management.md` | Hard gate system reference |
| `kit/session-logging.md` | Session log format and conventions |
| `kit/CHANGELOG.md` | Kit change history, newest-first |
| `kit/guides/evolving-specs.md` | Post-ship spec evolution (flow-forward / flow-back / living spec) |
| `kit/guides/e2e-testing-plan.md` | E2E provisioning workflow (Supabase-focused) |
| `testing/testing-log.md` | Living issue tracker; log every kit change immediately |
| `testing/kit-testing-summary.md` | Closed-round scorecards |
| `testing/skill-agent-usage.md` | Per-skill/agent trigger tallies across rounds |
| `docs-site/.vitepress/config.ts` | VitePress nav, sidebar, srcExclude, URL rewrites |

---

## Runtime / Tooling Preferences

- **Runtime**: Node.js ≥ 18. No Bun dependency.
- **Package manager**: npm (lock file at `docs-site/package-lock.json`; no root lock file — root package has zero deps)
- **Module format**: Root package is CJS (no `"type": "module"`). `bin/cli.js` uses `require()`/CommonJS. Docs-site is ESM (`"type": "module"`). Tests use `.mjs` (ES modules).
- **Zero install-time dependencies**: The CLI ships with no `dependencies` in `package.json`. CI explicitly skips `npm install`.
- **Docs framework**: VitePress `^1.6.3`. `srcDir: '..'` means `kit/` markdown files are the single source of truth for docs pages.
- **WATCHDOG.yml**: Developer-local AI advisor config (gitignored); uses `anthropic/claude-haiku-4-5:medium`.
- **AGENTS.md**: Gitignored — developer-local, never committed.

Published package files: `kit/` and `bin/`. The docs-site and testing directories are dev-only.

---

## Testing & QA

### Framework

`node:test` (built-in) with `node:assert/strict`. No external test libraries. Single test file: `tests/cli.test.mjs` (~340 lines, 8 describe blocks, ~35 test cases).

```bash
node --test tests/cli.test.mjs
```

### Test Strategy

All tests are **integration tests** — they spawn the real CLI as a subprocess via `spawnSync`:

```js
function run(args, { cwd, home } = {}) {
  return spawnSync('node', [CLI, ...args], {
    input: '',           // empty string → isTTY=false → non-interactive path
    env: { HOME, USERPROFILE, ...overrides },
    timeout: 15000,
  });
}
```

`input: ''` forces the non-TTY code path in every test (no interactive prompts exercised).

### Fixture Pattern

```js
function tempDir() {
  const dir = mkdtempSync(join(tmpdir(), 'pdk-test-'));
  process.on('exit', () => rmSync(dir, { recursive: true, force: true }));
  return dir;
}
```

Each test creates its own isolated `tempDir()`. No shared state between tests.

### Command Coverage

| Block | What is tested |
|---|---|
| `--help / -h` | Exit 0, prints `Usage`, lists all flags |
| `--version / -v` | Exit 0, matches `PKG.version` from `package.json` |
| `kit copy (fresh)` | Target dir created, key files present, default target is `./kit` |
| `kit copy (non-empty)` | Exit 1 without `--force`; succeeds with `--force` |
| `--skip-setup` | Prints quick-start; suppresses Superpowers and agent install output |
| Non-TTY full output | All install instructions + 5 agent names + quick-start present |
| Path interpolation | Quick-start paths use installed dir name, not hardcoded `kit/` |
| Harness detection | `.claude` → Claude Code, `.cursor` → Cursor, `.gemini` → Gemini CLI, empty home → no detection |

### Cross-Platform Notes

Path assertions use regex alternation for slash style: `/my-kit\/phase-1|my-kit\\phase-1/`.
CI runs all three platforms (ubuntu, windows, macos).

### E2E Testing (Kit Validation Rounds)

The kit itself is validated through narrative end-to-end test rounds:
```
testing/round-NN/<project-slug>/
  docs/                   # Phase artifacts
  src/                    # Built application source
  e2e-test.mjs            # Generated Playwright suite (chromium)
```

Target: 100% pass rate on the generated Playwright suite before the Manual Check gate.
Rounds completed: 5 (R01 PASS, R02 FAIL, R03–R05 PASS).

**Kit Change Logging Rule**: Every `kit/` change during a test round MUST be logged in `testing/testing-log.md` immediately — before proceeding. Log each fix when applied; never batch across steps.
