# Step 5 — Verify

- **Gate**: `hard`
- **Produces**: a Status for every criterion in `docs/SPEC.md`, then the user's approval to ship
- **Inputs**: `docs/BRIEF.md` (Commands), `docs/SPEC.md`, the feature branch

## Do

1. Dispatch a subagent to verify from a clean start. Clean means: `git status --porcelain` is empty; installed dependencies and build output are deleted (or the subagent works in a fresh clone of the feature branch). Then the install and test commands from the brief run from scratch, and the app or CLI starts fresh. The subagent walks every criterion in `docs/SPEC.md` through the real interface (browser, real requests, real commands; no mocks), sets each criterion's Status in the spec to `PASS`, `FAIL` or `BLOCKED` (with the reason), and returns one table row per criterion, plus at most 10 lines of notes. A flow between two features gets its own check from `## Interactions`.
2. Read the Status column yourself. For each `FAIL`: fix it (a new dispatch, `fix:` commit) and re-run only the affected criteria. A `FAIL` that is a spec problem goes to Step 2 (see "Amend an approved spec" there), not to a silent change. For each `BLOCKED` (no credentials, missing service): list it under `## Open issues` in `docs/NOTES.md`. Never report it as passing.
3. **Audit trail** (only if the audit hooks are installed). Count the `**Tag:** (missing)` lines in today's file under `docs/audit/`. Any count above 0 is a reply that skipped its `[audit]` line: list it under `## Open issues`.
4. **Manual check (main session).** Tell the user how to start the app, with the command for their platform (on Windows, the line that works in PowerShell or Git Bash; add a Windows row to the brief's Commands table if it differs). Give a short walk-through in usage order, from the empty state through every feature. Ask them to try it and approve. A problem they find goes to Step 2 (Amend), and the walk-through repeats for what changed.
5. Gate summary: `<N> of <N> criteria PASS`, open issues, and that the manual check is done. Ask for approval to ship.
6. On approval set NOTES Status to `Step 6 Ship — not started`, then continue to Step 6.

## Rules

- Verification uses the commands recorded in the brief. If a command is missing or wrong, fix the brief and say so.
- Do not move to the manual check while any criterion is `FAIL`.

## Done when

No criterion is `FAIL`, every `BLOCKED` one is listed, and the user approved shipping.
