# craft-kit lite: Start

For small, personal, practice projects. Goal: a working result that does what the user meant, with the least paper. Six steps, each ends at a hard gate: the user approves before the next step starts.

Not for production work. If the project needs several users, a backend with real data, more than about 8 features, or production standards, stop and tell the user to use the full craft-kit (`npx github:KhoaLy2003/craft-kit`; for existing code, its `kit/phase-adopt.md`). Continue in lite only if the user insists.

## Detect (first match wins)

1. **Resume.** `docs/NOTES.md` exists and its `## Status` is not `complete`. Say `Resume step <N> <name>`, read `docs/BRIEF.md`, `docs/NOTES.md` and any `docs/SPEC.md` / `docs/PLAN.md`, and continue from `## Next action`. Ask nothing already answered there.
2. **Change to a finished project.** `docs/NOTES.md` exists and its `## Status` is `complete`.
   - Feature: add it to the brief's feature table, then run Steps 2 to 6 for that feature only.
   - Bug: reproduce with a failing test, fix, run it, commit. No gates.
3. **New project.** `docs/NOTES.md` does not exist (a `draft` brief means Step 1 was never approved: resume it). Run `kit-lite/step-1-setup.md`.

## Steps

| # | Name | Gate | File | Produces |
|---|---|---|---|---|
| 1 | Setup | `hard` | `kit-lite/step-1-setup.md` | `docs/BRIEF.md` (approved), `docs/NOTES.md` |
| 2 | Spec | `hard` | `kit-lite/step-2-spec.md` | `docs/SPEC.md` (approved) |
| 3 | Plan | `hard` | `kit-lite/step-3-plan.md` | `docs/PLAN.md` (approved, deleted at Step 6) |
| 4 | Build | `hard` | `kit-lite/step-4-build.md` | code on `feature/<slug>`, reviewed against the spec |
| 5 | Verify | `hard` | `kit-lite/step-5-verify.md` | test and run results, user's manual check |
| 6 | Ship | `hard` | `kit-lite/step-6-ship.md` | `README.md`, final `docs/NOTES.md`, `docs/SHIP-CHECKLIST.md` (approved), merge or PR |

`hard` stops with a short summary and waits for an explicit yes. Open each step with a banner: `## Step N — <Name> | Gate: hard`.

Templates: `kit-lite/templates/BRIEF.md`, `kit-lite/templates/SPEC.md`, `kit-lite/templates/PLAN.md`, `kit-lite/templates/NOTES.md`, `kit-lite/templates/SHIP-CHECKLIST.md`.

## Context

One session cannot carry all six steps. Two tools keep it small. Pick by what the work needs.

| Use | When | Why |
|---|---|---|
| **Subagent** | The work needs no answers from the user, its input is files and its output is files or a short report | The main session keeps only the summary. A fresh reader also gives an independent review |
| **New session** | The work is a long exchange with the user, or the main session is full of material the next step does not need | A clean start. State lives in `docs/`, so nothing is lost |

Where the harness has no subagents, every subagent below becomes a new-session offer.

**Choosing the agent.** Each subagent is the installed agent that fits its task best: a frontend or React specialist for UI work, a code reviewer for the review, the general-purpose agent when none fits. Name the agent in the dispatch.

**Per step:**

| Step | How |
|---|---|
| 1 Setup | Main session (long exchange with the user). Recommended seam: after approval |
| 2 Spec, 3 Plan | A subagent drafts from the files; the main session shows the draft and handles the gate |
| 4 Build | Subagents implement task groups; a separate fresh subagent reviews. Recommended seam: after approval |
| 5 Verify | A subagent runs tests and the app and returns a table; the manual check happens in the main session |
| 6 Ship | Main session |

**Subagent brief.** Self-contained: the task, exact file paths to read, the files it may write, the rules from this file that apply (done means run, tests for core logic), and what to return (a report of at most 15 lines). A subagent never asks the user; it returns open questions and the main session asks. After it returns, check the files it wrote, not only its report.

**Checkpoint.** After the user approves a step:
1. Update `docs/NOTES.md` (Status, Next action, decisions not yet in a file). Commit any code.
2. At a recommended seam, or when 3 or more steps have run in this session, or when the user says the session is long, offer one line, with your recommendation: `Step <N> done. Continue here, or open a new session? I recommend <choice> because <reason>.`
3. If the user opens a new session, give them one line to paste: `Resume craft-kit lite: read kit-lite/START.md.` Detection above does the rest. No other handover file.

At other gates, go straight on to the next step.

## Rules

The user's own instructions come first. Where a rule below conflicts with an instruction the user gave, in their own settings (for example a global `CLAUDE.md`) or in a message, follow the user's instruction, say in one line which rule it overrides, and record that in `docs/NOTES.md` → Decisions.

1. **No code before the brief, spec and plan are approved.**
2. **Clarity before speed in Step 1.** Ask as many questions as it takes, one per message, until nothing important is a guess. Propose a default when the user has no preference.
3. **Done means run.** A task is done only after its tests pass and the app (or CLI) was started and the changed path exercised. Say what you ran and saw.
4. **Tests for core logic only**: calculations, data handling, parsing, APIs. Test first for those. No tests for layout, config or glue.
5. **Git.** If the folder is not inside a git work tree (`git rev-parse --is-inside-work-tree` fails), run `git init` first. Work on `feature/<slug>`; one commit per feature, `feat: ...`, `fix: ...`, `chore: ...`. If the user forbids per-feature commits, commit once right after the Step 4 gate approval.
6. **Few documents.** Only `docs/BRIEF.md`, `docs/SPEC.md`, `docs/PLAN.md` (temporary), `docs/NOTES.md`, `docs/SHIP-CHECKLIST.md` (created at Step 6) and `README.md`. Each stays short. Do not create logs, roadmaps, per-screen docs or design documents.
7. **Write, then verify.** After writing a file, confirm it exists and has the expected content before saying it is written.
8. **UI projects.** Build screens from the brief's visual line. If the `design-taste-frontend` skill is installed, use it.
9. **English only** in files and replies, unless the user asks otherwise.
10. **Do not ask for what files can tell.** Read `docs/` first.
