# Step 5 — Verify

- **Gate**: `hard`
- **Produces**: a Status for every criterion in `docs/SPEC.md`, then the user's approval to ship
- **Inputs**: `docs/BRIEF.md` (Commands), `docs/SPEC.md`, the feature branch

## Do

1. Dispatch a subagent to verify from a clean start: run the install and test commands from the brief, start the app or CLI fresh, and walk every criterion in `docs/SPEC.md` through the real interface (browser, real requests, real commands; no mocks). It sets each criterion's Status in the spec to `PASS`, `FAIL` or `BLOCKED` (with the reason) and returns a table of at most 15 lines. A flow between two features gets its own check from `## Interactions`.
2. Read the Status column yourself. For each `FAIL`: fix it (a new dispatch, `fix:` commit) and re-run only the affected criteria. For each `BLOCKED` (no credentials, missing service): list it under `## Open issues` in `docs/NOTES.md`. Never report it as passing.
3. **Manual check (main session).** Tell the user how to start the app and give a short walk-through in usage order, from the empty state through every feature. Ask them to try it and approve. A problem they find goes back through step 2, and the walk-through repeats for what changed.
4. Gate summary: `<N> of <N> criteria PASS`, open issues, and that the user's manual check is done. Ask for approval to ship.
5. On approval set NOTES Status to `Step 6 Ship — not started`, then continue to Step 6.

## Rules

- Verification uses the commands recorded in the brief. If a command is missing or wrong, fix the brief and say so.
- Do not move to the manual check while any criterion is `FAIL`.

## Done when

No criterion is `FAIL`, every `BLOCKED` one is listed, and the user approved shipping.
