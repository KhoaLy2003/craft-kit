# Step 2 — Spec

- **Gate**: `hard`
- **Produces**: `docs/SPEC.md` (Status `approved`)
- **Template**: `kit-lite/templates/SPEC.md`
- **Inputs**: `docs/BRIEF.md`

The spec is the contract Steps 4 and 5 are checked against. It says what each feature must do, not how it is built.

## Do

1. Dispatch a subagent (see `START.md` → Context) to draft `docs/SPEC.md` from the brief. It writes one `##` section per feature, in build order. Each section has 3 to 6 acceptance criteria with IDs (`F1-AC1`), each checkable by running the app or a test, plus the errors and edge cases the brief names. Cross-feature behavior goes in a short `## Interactions` section.
2. The subagent returns open questions instead of guessing. Ask the user each one (one per message), put the answer into the spec, and re-dispatch only if a section must change.
3. Read the drafted file. Check that every brief feature has a section, every "done when" is covered by a criterion, and nothing contradicts the brief's out-of-scope list. Fix the file yourself for small gaps.
4. Show a summary: criteria count per feature, interactions, assumptions you made. Ask for approval. Apply changes and ask again.
5. On approval set Status to `approved`, set NOTES Status to `Step 3 Plan — not started`, then run the checkpoint in `START.md` → Context.

## Rules

- No implementation detail (libraries, file layout, function names). That belongs in the plan.
- A criterion that cannot be checked by running something is rewritten or dropped.
- Keep it short: about 20 lines per feature at most.

## Done when

Every brief feature has criteria with IDs, and the user approved the spec.
