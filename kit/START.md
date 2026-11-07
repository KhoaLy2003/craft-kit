# Start — route to the right workflow

> **Read-only router.** Inspects the project, asks at most three questions, and prints the workflow to run. It writes no files, dispatches no subagents, and runs no workflow step itself. It has no step banner and no session log.

Universal rules are in `kit/orchestrator-conventions.md`.

## How to start

Send this to your AI, from the project root: `Start using <install directory>/START.md.` The install directory is the one the CLI installed into (default `kit`); `kit/` in this file stands for it.

## Detect (first match wins)

1. **Resume.** Either signal, read-only:
   - `docs/handover.md` exists. Name its phase, unit and step; the prompt is the Resumption Prompt at its end (`kit/guides/session-handover.md`).
   - A `docs/*-session.md` (Phase 1, Phase 2, Maintenance, bug fix, admin, adopt) has a unit with a step that is not `complete` or `skipped`: `in progress`, `blocked`, or `pending` after a `complete` step. A unit collapsed to an `Outcome:` line is finished. If the log shows no such step but the next step's artifact is `draft`, that step is the one to resume. Name the workflow file, the unit and the first unfinished step, and print: `Resume <workflow> (<phase file>) for <unit>, per kit/orchestrator-conventions.md rule 18.`

   Several unfinished logs: list each and ask which to resume.
2. **New product.** No source code and no `docs/`. Route to `kit/phase-1-bootstrap.md`. Ask one question: "Do you already have requirements documents (BRD, PRD, SRS, or tickets)?" If yes, tell the user to put them in `docs/requirements/` (exported to markdown, CSV or JSON for tickets) and set `Mode: requirements` and the sources in the kickoff's `Source Mode` section; the Phase 1 prompt is the same. If no, no further question.
3. **Existing code, no kit documents.** Source code exists and `docs/constitution.md` or `docs/architecture.md` is missing. Route to `kit/phase-adopt.md`.
4. **Older kit.** Run the Detect step of `kit/phase-upgrade.md` (read-only). If any module is needed, route to `kit/phase-upgrade.md`.
5. **Documents complete.** Ask: "What do you want to do?" and use the Intent table.

**Version gap (warning only).** Once Detect gets past rows 1–3, compare `kit_version` in `docs/.craft-kit.json` with `.craft-kit-version` in the installed kit directory. If `acknowledged_version` in that file equals the installed version, say nothing. Otherwise, if the file is missing or the project's version is older, add one line to the output suggesting `kit/phase-upgrade.md`; if the project's version is newer, suggest reinstalling the kit with `--force`. Never block and never change the routing because of it. START.md never writes the file.

## Intent (only when documents are complete)

| Intent | Workflow |
|---|---|
| A shipped feature is broken | `kit/phase-bug-fix.md` |
| Add a new feature, or unsure whether to add one or fix a bug | `kit/phase-maintenance.md` (asks feature or bug, then routes) |
| Build or implement pending features (an ID, "the next feature", "all pending") | `kit/phase-2.md`, starting at Step 1 (Spec); never code straight from `docs/`. No `pending` features in `docs/backlog.json` (for example right after Adopt)? `kit/phase-maintenance.md` first |
| Admin site | `kit/phase-admin.md` |
| A developer is joining | `kit/phase-onboarding.md` |

## Output

One block: **Workflow**, **Why** (the signal that matched), **Prompt** (the exact text to send), **Next** (what the first step will do). Gate: `soft` — the user may pick another workflow.

## Rules

- Prefer file signals over questions. Ask only what files cannot tell.
- Contradicting signals (for example an unfinished Phase 1 log next to a working app): ask, never guess.
- Never start the workflow yourself; the user sends the prompt.
