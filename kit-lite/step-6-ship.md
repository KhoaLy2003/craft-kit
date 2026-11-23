# Step 6 — Ship

- **Gate**: `hard`
- **Produces**: `README.md`, final `docs/NOTES.md`, the work merged, in a PR, or left on its branch as the user chooses
- **Inputs**: everything in `docs/`, the feature branch

## Do

1. Write `README.md` (about one page): what it is, how to run it, how to test it, the stack. Every command is copied from what was actually run in Step 5.
2. Finish `docs/NOTES.md`: Status `complete`, stack and key decisions, remaining open issues, the "Later" ideas. Delete finished task lists.
3. Delete `docs/PLAN.md`; git history keeps it. `docs/BRIEF.md` and `docs/SPEC.md` stay.
4. Commit `docs: readme and notes`. The working tree is now clean.
5. **Gate.** Summarise in 3 to 5 lines: what was built, what was verified, what is open. Ask how to land the work and wait: merge into the base branch, open a PR (only if a remote exists), or leave it on `feature/<slug>`. Do the chosen action only after the user's answer. Never push without it.
6. Report what was done and where (branch, commit, PR link).

## Rules

- Do not invent run or test commands. If a command was never run, it does not go in the README.
- No extra documents.

## Done when

`README.md` exists, `docs/NOTES.md` Status is `complete`, `docs/PLAN.md` is gone, and the work is where the user asked.
