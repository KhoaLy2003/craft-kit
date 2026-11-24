# Step 2 — Spec

- **Gate**: `hard`
- **Produces**: `docs/SPEC.md` (Status `approved`)
- **Template**: `kit-lite/templates/SPEC.md`
- **Inputs**: `docs/BRIEF.md`

The spec is the contract Steps 4 and 5 are checked against. It says what each feature must do, not how it is built.

## Do

1. Dispatch a subagent (see `START.md` → Context) to draft `docs/SPEC.md` from the brief. It writes one `##` section per feature, in build order. Each section has 3 to 6 acceptance criteria with IDs (`F1-AC1`), each checkable by running the app or a test, plus the errors and edge cases the brief names. Cross-feature behavior goes in a short `## Interactions` section. Each feature also has a `**Needs data:**` line: which data it reads (for example, all files for a total), where it comes from and when it is loaded. Two features that disagree on when data loads are an open question, not two criteria.
2. The subagent returns open questions instead of guessing. Ask the user each one (one per message), put the answer into the spec, and re-dispatch only if a section must change.
3. Read the drafted file. Check that every brief feature has a section, every "done when" is covered by a criterion, and nothing contradicts the brief's out-of-scope list. Fix the file yourself for small gaps. Check the data needs too: every total, list, filter or stat names its data, and a criterion that defers loading agrees with the features that aggregate that data.
4. Show a summary: criteria count per feature, interactions, assumptions you made. Ask for approval. Apply changes and ask again.
5. On approval set Status to `approved`, set NOTES Status to `Step 3 Plan — not started`, then run the checkpoint in `START.md` → Context.

## Amend an approved spec

Problems found at Steps 4 or 5 come back here. The approved spec is never edited silently:
1. Set the spec's Status to `draft` and NOTES Status to `Step 2 Spec — amendment`.
2. Change the criterion and keep its ID, with `(amended YYYY-MM-DD: <what changed>)` in the text. A new criterion takes the next free number in its feature. A removed criterion stays in the table with Status `removed`, so an ID is never reused.
3. Add one line under `## Amendments` in the spec: `- YYYY-MM-DD F1-AC2: <change>, approved by the user`.
4. Get the user's approval of the change. Then set the spec back to `approved`. NOTES returns to Step 4 (rebuild the affected feature) or Step 5 (re-verify the affected criteria).

## Rules

- No implementation detail (libraries, file layout, function names). That belongs in the plan.
- A criterion that cannot be checked by running something is rewritten or dropped.
- Keep it short: about 20 lines per feature at most.

## Done when

Every brief feature has criteria with IDs, and the user approved the spec.
