# Verification Backfill — add Verification Commands to an existing constitution

> **Status: experimental — not yet validated in a test round.**
>
> **Use once per project** whose `docs/constitution.md` exists but has no `## Verification Commands` section (built on an older kit version, or adopted without it). New projects never run this: Phase 1 Step 7 fills the table and Step 8 verifies it.
>
> Output: a `## Verification Commands` section in `docs/constitution.md`, reviewed by you. Nothing else in `docs/` is touched except the constitution's `Last amended` date.

Universal rules (banner, gates, PROJECT_ROOT, fail-fast writes, file verification) are in `kit/orchestrator-conventions.md`.

## Limitations (read before running)

- **Commands are copied, never reconstructed.** Each command comes verbatim from `package.json` scripts, a Makefile, task-runner config, or CI config. A check with no source is `unknown`.
- **Nothing is invented.** Ambiguous or missing items are `unknown`; a step the language does not have is `n/a — <reason>`.
- **Side effects.** Commands that touch a database, the network, or a deployment are listed but not run without asking you.
- **Code beats docs.** When `AGENTS.md` or the README conflicts with the scripts, the conflict is reported to you, never silently resolved.

## How to start

Send this to your AI, from the project root:

```text
Run the verification backfill using kit/phase-verification-backfill.md.
```

What happens next: the AI reads the project's scripts and CI config, proposes the table, and shows you every row it could not confirm. Nothing is written until you approve.

What to have ready: `docs/constitution.md`.

## Steps

| # | Name | Gate | Model | Output |
|---|---|---|---|---|
| 1 | Preflight & locate | none | fast | Source file list shown to the user |
| 2 | Propose | none | balanced | Proposed Verification Commands table in chat |
| 3 | Review | hard | balanced | User decision per row |
| 4 | Write & verify | none | fast | `## Verification Commands` in `docs/constitution.md` |

## Step 1 — Preflight & locate

1. Stop if `docs/constitution.md` already has a `## Verification Commands` section. Require `docs/constitution.md`; if it is absent, stop and point to `kit/phase-adopt.md` (existing code with no kit documents) or the existing-projects guide on the docs site, `docs-site/guides/existing-projects.md`.
2. Locate the sources and show the user the list: `package.json` (or the stack's manifest: `pyproject.toml`, `Cargo.toml`, `pom.xml`, `go.mod`), `Makefile` or task-runner config, CI config (for example `.github/workflows/`, `.gitlab-ci.yml`), and the root `AGENTS.md` or README when they list commands.

## Step 2 — Propose

One read-only general-purpose agent dispatch carrying `PROJECT_ROOT`; it writes no files and returns the table in chat. Rows: Install, Build, Lint, Typecheck, Unit / integration tests, E2E, Start, CI, using the table shape in `kit/templates/07-constitution.md`. Per row:

- the command, copied verbatim, with its source file in Notes;
- status `unknown` (the AI has not run it), or `n/a — <reason>` when the stack has no such step;
- for the E2E row, the verification type (browser, API, CLI, or mobile);
- for the CI row, the pipeline or workflow name, or `n/a — no CI`.

List conflicts between sources (for example a README command that differs from the script) separately.

## Step 3 — Review (hard gate)

Show the table and every `unknown` row and conflict. Ask per row: **keep / correct / mark unknown**. After approval, offer to run the build, lint, typecheck, and test commands to promote their status to `verified`; run each only on a yes, and never run a command with side effects without an explicit answer for that command.

Gate summary: *"[N] of 8 verification commands were found in the project's scripts, [u] are unknown. Write this table into the constitution? [Yes / change a row]"*

## Step 4 — Write & verify

1. Add the `## Verification Commands` section from `kit/templates/07-constitution.md` to `docs/constitution.md`, before `## Governance` when present, with the approved rows. Set `Last amended` to today.
2. Re-read the file: the table separator row is present and no `<command>` placeholder remains.
3. If the project-root `AGENTS.md` has a Commands section that disagrees, tell the user; never overwrite a hand-written file.

## Completion criteria

- [ ] `docs/constitution.md` has `## Verification Commands` with all eight rows
- [ ] Every command has a source file or is `unknown` / `n/a — <reason>`
- [ ] The user approved at the Step 3 gate
- [ ] No invented commands

## Transition

Done. Return to the workflow that sent you here (`kit/phase-2.md` Docs preflight, `kit/phase-upgrade.md`, or `kit/phase-adopt.md`).

## Exceptions

- **No scripts at all:** write every row as `unknown` and say so; do not guess common commands.
- **Monorepo:** ask the user which app or package the table covers, or add one table per package with a heading each.
