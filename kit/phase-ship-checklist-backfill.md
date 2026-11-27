# Ship Checklist Backfill — scan the project and propose its ship checklist

> **Status: experimental — not yet validated in a test round.**
>
> **Use once per project** whose `docs/.craft-kit.json` records a `kit_version` older than 0.0.61 and that has no `docs/ship-checklist.md`. Projects at 0.0.61 or newer get the checklist from Phase 2 Ship, which runs Steps 1–4 itself when the file is missing or `draft`.
>
> Output: `docs/ship-checklist.md` built from `kit/templates/ship-checklist.md`, reviewed by you. Nothing else in `docs/` is touched.

Universal rules: `kit/orchestrator-conventions.md`.

## Limitations (read before running)

- **Evidence only.** Every item comes from a file the scan read, or from you. An item the scan cannot settle is `unknown`; it is never guessed from common practice.
- **Shared rules** (nothing invented, code beats docs, monorepo): `kit/phase-upgrade.md` → Shared module rules. A category the project does not have is `n/a — <reason>`.
- **Read-only scan.** The scan runs no command with side effects; commands are listed as checks, not executed.
- **Conflicts.** When two sources disagree (for example the README names one changelog rule and the scripts another), report it to you.

## How to start

Send this to your AI, from the project root:

```text
Run the ship checklist backfill using kit/phase-ship-checklist-backfill.md.
```

What to have ready: `docs/.craft-kit.json` and `docs/constitution.md`.

## Steps

| # | Name | Gate | Model | Output |
|---|---|---|---|---|
| 1 | Preflight & locate | none | fast | Source file list shown to the user |
| 2 | Scan & propose | none | balanced | Proposed checklist items in chat |
| 3 | Review | hard | balanced | User decision per item |
| 4 | Write & verify | none | fast | `docs/ship-checklist.md` |

## Step 1 — Preflight & locate

1. Stop if `docs/ship-checklist.md` already has `**Status:** approved`. Require `docs/.craft-kit.json`; if it is absent, stop and point to `kit/phase-adopt.md` (existing code with no kit documents).
2. Locate the scan sources and show the user the list: root `CHANGELOG.md`; `README.md`, `AGENTS.md` and `docs/*.md` with their update conventions; the version field in `package.json` (or the stack's manifest) and any release workflow; `.env.example` or the config schema; migration folders or the ORM schema; `.github/workflows/` or the CI config and the constitution's Verification Commands; `docs/backlog.json` and issue templates; `.github/pull_request_template.md` or `kit/templates/pr-description.md`.

## Step 2 — Scan & propose

One read-only general-purpose agent dispatch carrying `PROJECT_ROOT`; it writes no files and returns the proposed items in chat only. Items are grouped by the template's categories (Docs, Changelog and version, Config and env, Data/migrations, Tests and CI, Tracking, PR/release). What each source yields:

- root `CHANGELOG.md`: a changelog item.
- `README.md`, `AGENTS.md`, `docs/*.md` and their update conventions: docs items, one per doc that tracks behavior (architecture, api, data-model, flows, roadmap).
- package or manifest version fields and the release workflow: a version item.
- `.env.example` or the config schema: an env item.
- migration folders or the ORM schema: a data item.
- `.github/workflows/` or CI config, and the constitution's Verification Commands: tests and CI items.
- `docs/backlog.json` and issue templates: tracking items.
- `.github/pull_request_template.md` or `kit/templates/pr-description.md`: PR items.

Each proposed item carries `Applies when`, `Check (evidence)` and `Source` (item format: `kit/templates/ship-checklist.md`). Anything the scan cannot settle is `unknown`; a category with no source is `n/a — <reason>`. List conflicts between sources separately.

## Step 3 — Review (hard gate)

Show the items grouped by category, with every `unknown` and conflict. Ask per item: **keep / correct / drop**. Then ask: "Anything to add?" and "Is there a rule you keep reminding the agent about?" and add each answer as an item with Source `user`.

Gate summary: *"[N] ship checklist items proposed from the project, [u] unknown. Write docs/ship-checklist.md? [Yes / change an item]"*

## Step 4 — Write & verify

1. Write `docs/ship-checklist.md` from `kit/templates/ship-checklist.md` with the approved rows, `**Status:** approved`, `**Last updated:**` today, and `**Based on:**` the scanned files.
2. Zero-item case: remove the empty category tables and keep only the "No items by user decision" note.
3. Re-read the file: no `<placeholder>` is left, and each `Check (evidence)` names an existing file or a runnable command.

## Completion criteria

- [ ] `docs/ship-checklist.md` is `approved` and holds every item the user kept, corrected or added
- [ ] Every item has `Applies when`, `Check (evidence)` and `Source`, or is `unknown` / `n/a — <reason>`

## Exceptions

- **No changelog, CI or docs at all:** mark those categories `n/a — <reason>`. A zero-item checklist is allowed when the user says so: write `**Status:** approved` with the note "No items by user decision". Ship records that and does not ask again.
- **Monorepo:** ask once which app or package the checklist covers, and scope items per package.
