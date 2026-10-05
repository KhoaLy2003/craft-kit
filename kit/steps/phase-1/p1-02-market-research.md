# Phase 1 · Step 2 — Market Research *(optional)*

## Overview

- **Purpose**: Validate demand, map comparable products, and surface feature inspirations before committing to development.
- **Agent/Skill**: `market-researcher` agent
- **Model**: `fast` (read-heavy synthesis, not implementation judgment)
- **Trigger**: Step 1 recorded "run" (from the kickoff or the user).
- **Inputs**: `docs/idea-brief.md`
- **Outputs**: `docs/market-notes.md`
- **Template**: `templates/02-market-notes.md`
- **Gate**: `soft` — present findings with the named proceed / pivot / stop decision; advance unless the user chooses pivot or stop.

## Scope

- **In**: comparable products and alternatives, trends, gaps, feature inspirations, reasons the idea might not work.
- **Out**: making the pivot decision for the user, implementation decisions.

> Present findings neutrally: evidence for the user's decision, not a decision. Feature Inspirations expand what the project could become; they do not replace the user's idea.

## Execution Rules

1. Dispatch `market-researcher` with `docs/idea-brief.md` as the primary input.
2. All seven sections of the template must be populated:
   - Comparable Products lists at least 2–3 products or alternatives.
   - **Feature Inspirations** lists at least 2–3 concrete features or patterns, each naming the feature, the product it comes from, and the specific benefit to this project's target user. "Better UX" or "notifications" is not an entry.
   - **Reasons This Might Not Work** is substantive: genuine competitive risks and structural reasons the idea could fail.
   - Differentiation Angle is honest. If no honest angle exists, say so.
3. Gate summary: *"Market research is done. The main finding is [one sentence from Conclusions]. Feature inspirations for the roadmap: [top 2–3 from Section 5]. Continuing to Step 3 unless you choose pivot or stop."*
4. On **pivot** or **stop**: record the decision in the session log and halt Phase 1; do not start Step 3.

## Artifact Rules

`docs/market-notes.md` is written from the template. It carries no approval status; the user's proceed / pivot / stop decision replaces it.

## Completion Criteria

- [ ] `docs/market-notes.md` has all seven sections populated, meeting the minimums above.
- [ ] Gate summary presented, including the top feature inspirations.
- [ ] Proceed / pivot / stop decision recorded.

## Transition Rules

Next: Step 3. If this step was skipped, record `skipped` in the session log; later steps proceed without `docs/market-notes.md` and the roadmap notes that no feature inspirations exist.
