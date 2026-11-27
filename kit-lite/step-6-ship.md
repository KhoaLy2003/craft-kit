# Step 6 — Ship

- **Gate**: `hard`
- **Produces**: `README.md`, final `docs/NOTES.md`, `docs/SHIP-CHECKLIST.md`, the work merged, in a PR, or left on its branch as the user chooses
- **Inputs**: everything in `docs/`, the feature branch

## Do

1. Write `README.md` (about one page): what it is, how to run it, how to test it, the stack. Every command is copied from what was actually run in Step 5.
2. Finish `docs/NOTES.md`: Status `complete`, stack and key decisions, remaining open issues, the "Later" ideas. Delete finished task lists.
3. Keep a pointer to the plan. If `git log --oneline -- docs/PLAN.md` prints nothing, the plan was never committed: commit it first (`git add docs/PLAN.md`, then `git commit -m "docs: plan"`). Run `git rev-parse --short HEAD` and write `Plan: docs/PLAN.md last at <sha>, see git show <sha>:docs/PLAN.md` in `docs/NOTES.md` → Decisions. Only then delete `docs/PLAN.md`.
4. **Ship checklist.** If `docs/SHIP-CHECKLIST.md` is missing, build it from `kit-lite/templates/SHIP-CHECKLIST.md`. Scan the project (`README.md`, `package.json` or the manifest, `CHANGELOG.md`, `.env.example`, CI config, `docs/`, `git log` style) and propose items in chat, each with its evidence. Ask the user to keep, correct or drop each item, and what they keep reminding the agent about. Write the file only after the answer, with `Status: approved`. Then run it: evaluate each applicable item, fix doc-type items inside the change, and show one table with `pass | fixed | n/a | blocked` and the evidence for each. An `unknown` item is shown as `blocked`; an item the user waived is shown as `waived (by user)`. Any `blocked` item, or stale item (its evidence path no longer exists), stops Ship before item 5: do not commit past it, do not push or merge. Ask the user right there to resolve or waive it, then continue; a waived item shows as `waived (by user)`.
5. Commit `docs: readme, notes, checklist, remove plan`. `docs/BRIEF.md` and `docs/SPEC.md` stay.
6. Check the landing state before the gate. `git branch --show-current` must print `feature/<slug>`; `git status --porcelain` must be empty; `git remote -v` shows whether a remote exists; the base named in NOTES (`Base: <branch>`) must exist locally (`git rev-parse --verify <branch>`). If a check fails, stop and tell the user what is different.
7. **Gate.** Summarise in 3 to 5 lines: what was built, what was verified, what is open, and any checklist item the user waived. Ask how to land the work, and wait: merge into the base branch, open a PR (only if `git remote -v` shows a remote), or leave it on `feature/<slug>`.
8. Do the chosen action only after the user's answer, with these commands:
   - Merge: `git switch <base>`, then `git merge --no-ff feature/<slug>`, then `git branch -d feature/<slug>`.
   - PR: `git push -u origin feature/<slug>`, then `gh pr create --base <base> --head feature/<slug>` with a title and a body taken from the README. If `gh` is not installed, give the user the base and branch names and the remote's compare URL instead.
   - Leave: nothing to run.
9. Report what was done and where (branch, commit, PR link).

## Rules

- Never push without the user's answer.
- Do not invent run or test commands. If a command was never run, it does not go in the README.
- Never rename, force or overwrite a branch (no `git branch -M`, no `--force`). If the base is not in NOTES, or `<branch>` does not exist, ask.
- Never mark a checklist item `pass` without evidence. An item with no evidence source is `unknown`, not invented.
- No git remote: PR items are `n/a — no remote`.
- If the user answers that there are no items, record that in `docs/SHIP-CHECKLIST.md` and do not ask again.
- No extra documents.
- Audit files in `docs/audit/` stay where they are: git-ignored, local to the machine, never committed or deleted by this step. The user may delete the folder at any time.

## Done when

`README.md` exists, `docs/NOTES.md` Status is `complete`, `docs/PLAN.md` is gone, every applicable checklist item is `pass`, `fixed`, or user-waived, and the work is where the user asked.
