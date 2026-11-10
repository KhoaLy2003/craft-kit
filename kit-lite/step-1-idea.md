# Step 1 — Idea

- **Gate**: `hard`
- **Produces**: `docs/BRIEF.md` (Status `approved`), `docs/NOTES.md`
- **Template**: `kit-lite/templates/BRIEF.md`

## Do

1. Read the user's first message. Ask only what it does not already answer, one question per message, at most 5. Cover, in this order:
   1. Who uses it (just me / a few people / public).
   2. The 3 to 5 features they would actually use on day one. Park anything else under "Later".
   3. Stack. Offer a default that fits the idea and ask if they prefer another.
   4. Visual direction in one line (UI projects only).
   5. What "done" looks like for the whole project.
2. Write `docs/BRIEF.md` from the template. 3 to 8 features, in build order, each with a one-line "done when" that can be checked by running the app or a test. Create `docs/` if needed.
3. Show the brief and ask for approval. Apply requested changes and ask again.
4. On approval, set the brief's Status to `approved`, create `docs/NOTES.md` from `kit-lite/templates/NOTES.md` (Status `Step 2 Build — slice 0`, Next action `Scaffold the project, then slice 1`), and move to Step 2.

## Rules

- Keep the brief to about one page. No market research, personas, roadmap, risk list or architecture document.
- Features are small enough to finish in one slice. Split anything that is not.
- More than 8 features, multiple users, or a real backend with persisted user data: warn once that this is beyond lite (see `START.md`).

## Done when

`docs/BRIEF.md` is approved by the user and `docs/NOTES.md` exists.
