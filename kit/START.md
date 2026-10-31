# Start — route to the right workflow

> **Read-only router.** Inspects the project, asks at most three questions, and prints the workflow to run. It writes no files, dispatches no subagents, and runs no workflow step itself. It has no step banner and no session log.

Universal rules are in `kit/orchestrator-conventions.md`.

## How to start

Send this to your AI, from the project root: `Start using <install directory>/START.md.` The install directory is the one the CLI installed into (default `kit`); `kit/` in this file stands for it.

## Detect (first match wins)

1. **Resume.** `docs/handover.md` exists, or a `docs/*-session.md` shows a step `in progress`. Name the phase and follow `kit/guides/session-handover.md`.
2. **New product.** No source code and no `docs/`. Route to `kit/phase-1-bootstrap.md`. Ask one question: "Do you already have requirements documents (BRD, PRD, SRS, or tickets)?" If yes, tell the user to put them in `docs/requirements/` (exported to markdown, CSV or JSON for tickets) and set `Mode: requirements` and the sources in the kickoff's `Source Mode` section; the Phase 1 prompt is the same. If no, no further question.
3. **Existing code, no kit documents.** Source code exists and `docs/constitution.md` or `docs/architecture.md` is missing. Route to `kit/phase-adopt.md`.
4. **Older kit.** Run the Detect step of `kit/phase-upgrade.md` (read-only). If any module is needed, route to `kit/phase-upgrade.md`.
5. **Documents complete.** Ask: "What do you want to do?" and use the Intent table.

**Version gap (warning only).** Once Detect gets past rows 1–3, compare `kit_version` in `docs/.craft-kit.json` with `.craft-kit-version` in the installed kit directory. If the file is missing or the project's version is older, add one line to the output suggesting `kit/phase-upgrade.md`; if the project's version is newer, suggest reinstalling the kit with `--force`. Never block and never change the routing because of it.

## Intent (only when documents are complete)

| Intent | Workflow |
|---|---|
| A shipped feature is broken | `kit/phase-bug-fix.md` |
| One known feature to add | Direct path in `kit/phase-3-iterate.md`, then `kit/phase-2.md` with `scope: feature` |
| New requirements, decide what to build | `kit/phase-3-iterate.md` |
| Build or implement pending features (an ID, "the next feature", "all pending") | `kit/phase-2.md`, starting at Step 1 (Spec); never code straight from `docs/`. No `pending` features in `docs/backlog.json` (for example right after Adopt)? `kit/phase-3-iterate.md` first |
| Admin site | `kit/phase-admin.md` |
| A developer is joining | `kit/phase-onboarding.md` |

## Output

One block: **Workflow**, **Why** (the signal that matched), **Prompt** (the exact text to send), **Next** (what the first step will do). Gate: `soft` — the user may pick another workflow.

## Rules

- Prefer file signals over questions. Ask only what files cannot tell.
- Contradicting signals (for example an unfinished Phase 1 log next to a working app): ask, never guess.
- Never start the workflow yourself; the user sends the prompt.
