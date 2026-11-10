# craft-kit lite: Start

For small, personal, practice projects. Goal: working output fast, with the least paper. Three steps, one hard gate.

Not for production work. If the project needs several users, a backend with real data, more than about 8 features, or production standards, stop and tell the user to use the full craft-kit (`npx github:KhoaLy2003/craft-kit`; for existing code, its `kit/phase-adopt.md`). Continue in lite only if the user insists.

## Detect (first match wins)

1. **Resume.** `docs/NOTES.md` exists and its `## Status` is not `complete`. Say `Resume <step> at <slice>`, read `docs/BRIEF.md` and `docs/NOTES.md`, and continue from `## Next action`. Ask nothing already answered there.
2. **Change to a finished project.** `docs/BRIEF.md` exists and `## Status` is `complete`. The user wants to add a feature or fix a bug.
   - Feature: append it to the brief's feature table, set Status to `Step 2`, and run one more slice (`step-2-build.md`). No new gate unless the stack changes.
   - Bug: reproduce with a failing test, fix, run it, commit.
3. **New project.** Neither file exists. Run `step-1-idea.md`.

## Steps

| # | Name | Gate | File | Produces |
|---|---|---|---|---|
| 1 | Idea | `hard` | `kit-lite/step-1-idea.md` | `docs/BRIEF.md` (approved) |
| 2 | Build | `none` | `kit-lite/step-2-build.md` | working code, one commit per slice, `docs/NOTES.md` |
| 3 | Wrap-up | `soft` | `kit-lite/step-3-wrapup.md` | `README.md`, final `docs/NOTES.md` |

`hard` stops and waits for an explicit yes. `soft` presents a summary and advances unless the user objects. `none` advances on its own.

Open each step with a banner: `## Step N — <Name> | Gate: <none|soft|hard>`.

## Rules

1. **No code before the brief is approved.** Nothing else is gated.
2. **One question per message**, at most 5 in Step 1. Prefer multiple choice. Propose a default when the user has no preference.
3. **Done means run.** A slice is done only after its tests pass and the app (or CLI) was started and the changed path was exercised. Say what you ran and saw.
4. **Tests for core logic only**: calculations, data handling, parsing, APIs. Test first for those. No tests for layout, config or glue.
5. **One git commit per slice**, message `feat: ...`, `fix: ...`, `chore: ...`. If the folder is not a git repo, run `git init` first.
6. **Few documents.** Only `docs/BRIEF.md`, `docs/NOTES.md` and `README.md`. Each stays about one page. Do not create specs, plans, logs, roadmaps or per-screen docs.
7. **Write, then verify.** After writing a file, confirm it exists and has the expected content before saying it is written.
8. **UI projects.** Build screens straight from the brief's visual line. If the `design-taste-frontend` skill is installed, use it. Do not write design documents.
9. **English only** in files and replies, unless the user asks otherwise.
10. **Do not ask for what files can tell.** Read `docs/` first.
