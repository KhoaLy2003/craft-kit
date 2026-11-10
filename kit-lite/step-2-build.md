# Step 2 — Build

- **Gate**: `none`
- **Produces**: working code, one commit per slice, an up-to-date `docs/NOTES.md`

## Do

**Scaffold (once, slice 0).** If there is no project yet: `git init` unless the folder is already inside a git work tree, create the project with the stack from the brief, add the test runner, and commit `chore: scaffold`. Verify the scaffold builds or starts before continuing.

**Then, for each feature in the brief's order, one slice:**

1. **Plan.** In `docs/NOTES.md` under `## Slices`, list 3 to 6 short tasks for this feature. No separate plan file.
2. **Test first for core logic.** Write the failing test, run it, watch it fail. Skip this for layout, config and glue.
3. **Implement** until the tests pass.
4. **Run it.** Start the app or CLI and exercise the changed path. Report what you ran and what you saw. Tests alone do not finish a slice.
5. **UI slices.** Build the screen from the brief's visual line. Check it at a phone width and a desktop width if it is a web app.
6. **Commit** `feat: <what the slice does>`. Fixes after the commit get their own `fix:` commit.
7. **Update `docs/NOTES.md`**: tick the slice with its commit hash, set `## Next action` to one specific thing, add any decision a later session would otherwise re-ask. Rewrite the file; do not append history. Keep it under about 40 lines.

When the last slice is done, move to Step 3.

## Rules

- A failing test is fixed, not deleted or skipped. If the fix needs a decision, record it in `## Decisions`.
- If something cannot be run (missing service, no credentials), say so plainly and list it under `## Open issues`. Never report it as passing.
- New idea mid-build: add it to the brief's "Later" list unless the user asks for it now.
- Do not start Step 3 with an uncommitted working tree or failing tests.

## Done when

Every feature in the brief is committed, its tests pass, and each was run once.
