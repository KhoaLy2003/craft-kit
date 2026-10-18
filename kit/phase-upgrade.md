# Project Upgrade — bring an existing project up to the current kit's documents

> **Single entry point for existing projects** built on an older kit version or without Phase 1. It checks which documents the current kit expects but the project lacks, then runs the matching one-time module for each, in order. New projects never run it: Phase 1 writes every document from the start.

Universal rules (banner, gates, PROJECT_ROOT, fail-fast writes, file verification) are in `kit/orchestrator-conventions.md`. Each module keeps its own limitations, gates, and completion criteria; read the module file before running it.

## How to start

Send this to your AI, from the project root:

```text
Run the project upgrade using kit/phase-upgrade.md.
```

## Steps

1. **Detect.** For each row of the registry below, evaluate the *Needed when* condition against the project's `docs/` folder. Show the user the result as a table: document, needed or up to date, module.
2. **Confirm.** Ask the user which needed modules to run now. Default: all, in registry order. A module the user skips stays pending; the preflight of the workflow that needs it will ask again.
3. **Run.** Execute each chosen module in order, to completion, before starting the next. Each module has its own hard gate; the upgrade adds none.
4. **Report.** List what was created, what was skipped, and any item left `unknown`.

If nothing is needed, say so and end.

## Registry

Order matters: a later module may read what an earlier one writes.

| # | Document | Needed when | Module |
|---|---|---|---|
| 1 | `docs/backlog.json` (+ `backlog.html`) | `docs/roadmap.md` exists and `docs/backlog.json` does not | `kit/phase-roadmap-migrate.md` |
| 2 | `docs/data-model.md`, `docs/flows.md` | `docs/architecture.md` exists and either file is missing | `kit/phase-docs-backfill.md` |
| 3 | `.test-accounts.json` | the project has test credentials (`.env` keys, `docs/E2E-TESTS.md` credential table, or a seed script that creates users) and `.test-accounts.json` does not exist | `kit/phase-test-accounts-backfill.md` |

## Adding a document in a future kit version

1. Write the module file (copy the shape of `kit/phase-docs-backfill.md`: Limitations, How to start, Steps with one hard review gate, Completion criteria, Exceptions).
2. Add one row to the registry above, after any module whose output it reads.
3. Add the module to `docs-site/.vitepress/config.ts` and `kit/CHANGELOG.md`. The CLI hint, the Phase 1 note, and the Phase 2 preflight need no change; they point here.

A new check inside the CLI's post-install hint may be added only if the condition is a file-existence test, and it must reuse the single hint line.
