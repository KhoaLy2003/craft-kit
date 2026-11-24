# Step 3 — Plan

- **Gate**: `hard`
- **Produces**: `docs/PLAN.md` (Status `approved`)
- **Template**: `kit-lite/templates/PLAN.md`
- **Inputs**: `docs/BRIEF.md`, `docs/SPEC.md`

## Do

1. Dispatch a subagent (see `START.md` → Context) to draft `docs/PLAN.md`: tasks in dependency order, grouped by feature in build order. Each task is one line: an ID, what it delivers, whether it is **test-first** (core logic) or not, and the criteria it covers (`F1-AC1`), and the tasks it needs (`needs: T0`, or `needs: none`). Include a first task `scaffold` with the stack and commands from the brief. List environment variables the build needs.
2. Read the draft and check it against the spec: every criterion is covered by at least one task, no task has no criterion, and the order respects dependencies. Every task that reads data another task produces comes after that task and names it in `needs:`.
3. Mark tasks that can run in parallel (they touch different files and do not depend on each other). Everything else is sequential.
4. Show the plan: task count per feature, parallel groups, anything the plan adds that the spec did not ask for. Ask for approval. Apply changes and ask again.
5. On approval set Status to `approved`, set NOTES Status to `Step 4 Build — not started` and Next action to the first task, then continue to Step 4.

## Rules

- One line per task, at most 200 characters. Reasoning belongs in the spec or `docs/NOTES.md` → Decisions.
- No task for layout polish, docs or config unless a criterion needs it.
- The plan is temporary: Step 6 deletes it.

## Done when

Every criterion maps to a task, and the user approved the plan.
