# Step 4 — Build

- **Gate**: `hard`
- **Produces**: working code on `feature/<slug>`, one commit per feature (or one at the gate, see Rules), review findings fixed, up-to-date `docs/NOTES.md`
- **Inputs**: `docs/BRIEF.md`, `docs/SPEC.md`, `docs/PLAN.md`

## Do

**Branch (before any code).** `git init` unless the folder is already inside a git work tree. Create `feature/<project-slug>` from the base branch and confirm it is checked out. Never build on the base branch. Record the base in `docs/NOTES.md` → Decisions as `Base: <branch> at <short sha>`; Step 6 lands the work on that branch.

**Implement.** Work through the plan in order, feature by feature.

1. Dispatch subagents for task groups (parallel groups together, sequential tasks one after another). Each is the installed agent that fits its tasks best (see `START.md` → Context). The brief to each lists its tasks, the criteria they cover, the commands from the brief, and the files it may touch. The main session does not write the code itself.
2. Core-logic tasks: the subagent writes the failing test, runs it, watches it fail, then implements until it passes. Layout, config and glue: no test.
3. After each task, the subagent starts the app or CLI and exercises the changed path, and reports what it ran and saw. Tests alone do not finish a task.
4. UI tasks: build from the brief's visual line; check a phone width and a desktop width for a web app.
5. When a feature's tasks are done, check its files yourself, then commit `feat: <what the feature does>` (unless the user forbids per-feature commits, see Rules). Tick the tasks in `docs/PLAN.md` and update `docs/NOTES.md` (Status, a specific Next action, decisions a later session would otherwise re-ask).

**Review.** When every feature is built, dispatch **one fresh subagent** that did not write the code. It reads the diff against the base branch, `docs/SPEC.md` and the brief, and returns:
- a table of every criterion with `covered` or `GAP`;
- findings, each marked `critical` (wrong behavior, data loss, security), `important` (likely bug, missing error handling, spec mismatch) or `minor`.

If the user's instructions forbid extra agents, the main session writes the same table and findings, and NOTES records that the review was done in the main session.

Fix every `GAP`, `critical` and `important` finding with a new subagent dispatch, commit `fix: ...` (or leave it for the gate commit, see Rules), and run the review again. At most 2 rounds; if findings remain, list them and ask the user: continue, accept as known, or stop. `minor` findings are not fixed: list them under `## Open issues` in `docs/NOTES.md`.

**Gate.** Show: features built, commits, review verdict (criteria covered N of N, findings fixed, minor deferred). Ask for approval to verify. Then run the checkpoint in `START.md` → Context; Build is a recommended seam for a new session.

**No review, no gate.** The gate does not open without the criteria table and the findings list in the summary. Skipping the review needs the user's explicit yes, and is logged under `## Open issues` in `docs/NOTES.md` with the reason.

## Rules

- A failing test is fixed, not deleted or skipped. If the fix needs a decision, record it in `## Decisions`.
- If something cannot be run (missing service, no credentials), say so and list it under `## Open issues`. Never report it as passing.
- New idea mid-build: add it to the brief's "Later" list unless the user asks for it now. A real change to what a feature does goes back to Step 2 for approval.
- Tests pass before the gate. Commits follow the feature boundary above. If the user forbids per-feature commits, commit once right after the gate approval, before Step 5.

## Done when

Every feature is built with its tests passing and was run once, the review shows no `GAP`, `critical` or `important` item left (or the user accepted them), and the user approved moving on.
