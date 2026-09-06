# Phase 1 · Step 2 — Market Research *(optional)*

- **Agent/Skill**: `market-researcher` agent
- **Optional**: yes — see Step 1 Notes (`kit/steps/p1-01-ideation.md`) for when to skip
- **Trigger**: User chooses to run this step after Step 1 completes
- **Inputs**: `docs/idea-brief.md`
- **Outputs**: `docs/market-notes.md`
- **Template**: `templates/02-market-notes.md`
- **Gate**: `hard` — first checkpoint on whether the idea is worth pursuing
- **Gate Summary**: *"Market research is done. The main finding is [one sentence from the Conclusions section]. This is your proceed / pivot / stop decision."*
- **Notes**:
  - Present findings neutrally — include competing products and reasons the idea might not work. The "Reasons This Might Not Work" section must not be skipped or tokenistic.
  - Gate outcome is a three-way choice: proceed / pivot / stop. If the decision is to stop or pivot, the rest of Phase 1 does not run.
  - **Model:** this step is read-heavy synthesis, not implementation judgment — a lighter/faster model is appropriate for the `market-researcher` dispatch.
  - If Step 2 is skipped: mark as `skipped` in the session log and advance to Step 3. Downstream steps that list `docs/market-notes.md` as an input proceed without it.
