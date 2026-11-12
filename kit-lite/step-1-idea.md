# Step 1 — Idea

- **Gate**: `hard`
- **Produces**: `docs/BRIEF.md` (Status `approved`), `docs/NOTES.md`
- **Template**: `kit-lite/templates/BRIEF.md`

## Do

1. Read the user's first message. Ask only what it does not already answer, one question per message, at most 5. Cover, in this order:
   1. Who uses it (just me / a few people / public).
   2. The features they would actually use on day one (3 to 8, in build order). Park anything else under "Later".
   3. Stack. Offer a default that fits the idea and ask if they prefer another. Default for a plain web page: no build step, and it must start with one command (`npm start`) or open straight from disk; avoid ES modules unless a server is wanted, because they do not load from `file://`.
   4. Visual direction in one line (UI projects only). If the user has no preference, propose one in the brief instead of spending a question.
   5. What "done" looks like for the whole project. Propose it in the brief if the features already imply it.
2. Write `docs/BRIEF.md` from the template, including its `**Project done when:**` line. 3 to 8 features, in build order, each with a one-line "done when" that can be checked by running the app or a test. Create `docs/` if needed. Mark every choice you made for the user (stack, visual, done) so the approval question shows what they can change.
3. Show the brief and ask for approval. Apply requested changes and ask again.
4. On approval, set the brief's Status to `approved`, create `docs/NOTES.md` from `kit-lite/templates/NOTES.md` (Status `Step 2 Build — slice 0`, Next action `Scaffold the project, then slice 1`), and move to Step 2.

## Rules

- Keep the brief to about one page. No market research, personas, roadmap, risk list or architecture document.
- Features are small enough to finish in one slice. Split anything that is not.
- A "done when" that depends on the date or time ("today", "overdue", "this week") must say what happens the next day (for example: a "for today" mark expires at midnight). Ask if it is not obvious.
- More than 8 features, multiple users, or a real backend with persisted user data: warn once that this is beyond lite (see `START.md`).

## Done when

`docs/BRIEF.md` is approved by the user and `docs/NOTES.md` exists.
