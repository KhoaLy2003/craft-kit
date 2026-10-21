# Project Upgrade — bring an existing project up to the current kit's documents

> **Single entry point for existing projects** built on an older kit version or without Phase 1. It checks which documents the current kit expects but the project lacks, then runs the matching one-time module for each, in order. New projects never run it: Phase 1 writes every document from the start.
>
> **Relation to Adopt.** `kit/phase-adopt.md` is for a codebase with no kit documents (it writes the constitution and architecture). This upgrade is for a project that already has kit documents from an older kit version. Onboarding (`kit/phase-onboarding.md`) produces a page for new developers once the documents are complete.

Universal rules (banner, gates, PROJECT_ROOT, fail-fast writes, file verification) are in `kit/orchestrator-conventions.md`. Each module keeps its own limitations, gates, and completion criteria; read the module file before running it.

## How to start

Send this to your AI, from the project root:

```text
Run the project upgrade using kit/phase-upgrade.md.
```

## Steps

0. **Version check.** Read `docs/.craft-kit.json` and `.craft-kit-version` in the installed kit directory. If the file is missing, or its `kit_version` is older than the installed version, say so (the missing or outdated record is expected on a project built on an older kit). If it is newer, warn that the installed kit is older than the one that produced the docs and suggest reinstalling with `--force`. Never block on this check.
1. **Detect.** For each row of the registry below, evaluate the *Needed when* condition against the project's `docs/` folder. Show the user the result as a table: document, needed or up to date, module.
2. **Confirm.** Ask the user which needed modules to run now. Default: all, in registry order. A module the user skips stays pending; the preflight of the workflow that needs it will ask again.
3. **Run.** Execute each chosen module in order, to completion, before starting the next. Each module has its own hard gate; the upgrade adds none.
4. **Report.** List what was created, what was skipped, and any item left `unknown`. Write `docs/.craft-kit.json` from `kit/templates/craft-kit.json` with `recorded_by: upgrade`, `kit_version` from `.craft-kit-version` in the installed kit directory, and `recorded_at` today (conventions rule 10). Then run `node kit/scripts/lint-docs.js` (conventions rule 11): fix errors, show warnings to the user. When the user wants to share the exact kit version, give the pinned command `npx github:KhoaLy2003/craft-kit#v<kit_version>`.

If nothing is needed, say so, write the version record from step 4 only if it is missing or older than the installed version, and end.

## Registry

Order matters: a later module may read what an earlier one writes.

| # | Document | Needed when | Module |
|---|---|---|---|
| 1 | `docs/backlog.json` (+ `backlog.html`) | `docs/roadmap.md` exists and `docs/backlog.json` does not | `kit/phase-roadmap-migrate.md` |
| 2 | `docs/data-model.md`, `docs/flows.md` | `docs/architecture.md` exists and either file is missing | `kit/phase-docs-backfill.md` |
| 3 | `.test-accounts.json` | the project has test credentials (`.env` keys, `docs/E2E-TESTS.md` credential table, or a seed script that creates users) and `.test-accounts.json` does not exist | `kit/phase-test-accounts-backfill.md` |
| 4 | `## Verification Commands` in `docs/constitution.md` | `docs/constitution.md` exists and lacks a `## Verification Commands` section | `kit/phase-verification-backfill.md` |

## Adding a document in a future kit version

1. Write the module file (copy the shape of `kit/phase-docs-backfill.md`: Limitations, How to start, Steps with one hard review gate, Completion criteria, Exceptions).
2. Add one row to the registry above, after any module whose output it reads.
3. Add the module to `docs-site/.vitepress/config.ts` and `kit/CHANGELOG.md`. The CLI hint, the Phase 1 note, and the Phase 2 preflight need no change; they point here.

A new check inside the CLI's post-install hint may be added only if the condition is a file-existence test, and it must reuse the single hint line.
