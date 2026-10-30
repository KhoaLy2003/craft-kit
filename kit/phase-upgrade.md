# Project Upgrade — bring an existing project up to the current kit's documents

> **Single entry point for existing projects** built on an older kit version or without Phase 1: it finds the documents the current kit expects but the project lacks and runs the matching one-time module for each, in order. New projects never run it. A codebase with no kit documents at all uses `kit/phase-adopt.md` instead.

Universal rules: `kit/orchestrator-conventions.md`. Each module keeps its own limitations, gates, and completion criteria; read it before running.

## How to start

Send this to your AI, from the project root:

```text
Run the project upgrade using kit/phase-upgrade.md.
```

## Steps

0. **Version check.** Compare `docs/.craft-kit.json` with `.craft-kit-version` in the kit directory. Missing or older: say so (expected on an older project). Newer: warn that the installed kit is older than the one that produced the docs and suggest reinstalling with `--force`. Never block.
1. **Detect.** For each row of the registry below, evaluate the *Needed when* condition against the project's `docs/` folder. Show a table: document, needed or up to date, module.
2. **Confirm.** Ask which needed modules to run now (default all, in registry order). A skipped module stays pending; the preflight that needs it asks again.
3. **Run.** Run each chosen module to completion before the next. The upgrade adds no gate of its own.
4. **Report.** List what was created, skipped, or left `unknown`. Write `docs/.craft-kit.json` from `kit/templates/craft-kit.json` (`recorded_by: upgrade`, `kit_version` from `.craft-kit-version`, `recorded_at` today; conventions rule 10), then run `node kit/scripts/lint-docs.js` (rule 11). To share the exact version: `npx github:KhoaLy2003/craft-kit#v<kit_version>`.

If nothing is needed, say so, write the version record only if missing or older, and end.

## Registry

Order matters: a later module may read what an earlier one writes.

| # | Document | Needed when | Module |
|---|---|---|---|
| 1 | `docs/backlog.json` (+ `backlog.html`) | `docs/roadmap.md` exists and `docs/backlog.json` does not | `kit/phase-roadmap-migrate.md` |
| 2 | `docs/data-model.md`, `docs/flows.md` | `docs/architecture.md` exists and either file is missing | `kit/phase-docs-backfill.md` |
| 3 | `.test-accounts.json` | the project has test credentials (`.env` keys, `docs/E2E-TESTS.md` credential table, or a seed script that creates users) and `.test-accounts.json` does not exist | `kit/phase-test-accounts-backfill.md` |
| 4 | `## Verification Commands` in `docs/constitution.md` | `docs/constitution.md` exists and lacks a `## Verification Commands` section | `kit/phase-verification-backfill.md` |

## Adding a document in a future kit version

1. Write the module file (shape of `kit/phase-docs-backfill.md`: Limitations, How to start, Steps with one hard review gate, Completion criteria, Exceptions).
2. Add a registry row after any module whose output it reads.
3. Add it to `docs-site/.vitepress/config.ts` and `kit/CHANGELOG.md`. The CLI hint and preflights point here and need no change; a new CLI hint check must be a file-existence test reusing the single hint line.
