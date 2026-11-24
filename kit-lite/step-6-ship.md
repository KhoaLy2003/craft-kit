# Step 6 — Ship

- **Gate**: `hard`
- **Produces**: `README.md`, final `docs/NOTES.md`, the work merged, in a PR, or left on its branch as the user chooses
- **Inputs**: everything in `docs/`, the feature branch

## Do

1. Write `README.md` (about one page): what it is, how to run it, how to test it, the stack. Every command is copied from what was actually run in Step 5.
2. Finish `docs/NOTES.md`: Status `complete`, stack and key decisions, remaining open issues, the "Later" ideas. Delete finished task lists.
3. Keep a pointer to the plan. If `git log --oneline -- docs/PLAN.md` prints nothing, the plan was never committed: commit it first (`git add docs/PLAN.md`, then `git commit -m "docs: plan"`). Run `git rev-parse --short HEAD` and write `Plan: docs/PLAN.md last at <sha>, see git show <sha>:docs/PLAN.md` in `docs/NOTES.md` → Decisions. Only then delete `docs/PLAN.md`.
4. Commit `docs: readme, notes, remove plan`. `docs/BRIEF.md` and `docs/SPEC.md` stay.
5. Check the landing state before the gate. `git branch --show-current` must print `feature/<slug>`; `git status --porcelain` must be empty; `git remote -v` shows whether a remote exists; the base named in NOTES (`Base: <branch>`) must exist locally (`git rev-parse --verify <branch>`). If a check fails, stop and tell the user what is different.
6. **Gate.** Summarise in 3 to 5 lines: what was built, what was verified, what is open. Ask how to land the work, and wait: merge into the base branch, open a PR (only if `git remote -v` shows a remote), or leave it on `feature/<slug>`.
7. Do the chosen action only after the user's answer, with these commands:
   - Merge: `git switch <base>`, then `git merge --no-ff feature/<slug>`, then `git branch -d feature/<slug>`.
   - PR: `git push -u origin feature/<slug>`, then `gh pr create --base <base> --head feature/<slug>` with a title and a body taken from the README. If `gh` is not installed, give the user the base and branch names and the remote's compare URL instead.
   - Leave: nothing to run.
8. Report what was done and where (branch, commit, PR link).

## Rules

- Never push without the user's answer.
- Do not invent run or test commands. If a command was never run, it does not go in the README.
- Never rename, force or overwrite a branch (no `git branch -M`, no `--force`). If the base is not in NOTES, or `<branch>` does not exist, ask.
- No extra documents.
- Audit files in `docs/audit/` stay where they are: git-ignored, local to the machine, never committed or deleted by this step. The user may delete the folder at any time.

## Done when

`README.md` exists, `docs/NOTES.md` Status is `complete`, `docs/PLAN.md` is gone, and the work is where the user asked.
