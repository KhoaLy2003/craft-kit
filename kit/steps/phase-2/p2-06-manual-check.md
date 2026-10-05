# Phase 2 · Step 6 — Manual Check

## Overview

- **Purpose**: A human uses the running application the way its target user would, to catch what automated tests did not anticipate.
- **Agent/Skill**: human only — no agent is dispatched
- **Model**: none
- **Gate**: `hard` — approval to ship
- **Inputs**: the running application
- **Outputs**: explicit human approval (no file)
- **Template**: none

## Rules

- Walk the app as a real user. `scope: feature`: the feature. `scope: all`: from first open (empty state) through every Must feature in natural usage order, paying most attention to cross-feature interactions.
- This is a product walkthrough, not a checklist run and not a repeat of E2E. Notice what feels wrong even if every criterion passes.
- If anything is found: fix it, re-run the affected E2E scope under the Step 5 rules, then return here for a fresh walkthrough. Do not ship with known issues.
- The orchestrator never self-approves.

## Completion Criteria

- [ ] Human has completed the walkthrough
- [ ] Every issue found is fixed and its E2E scope re-run
- [ ] Human has explicitly approved

## Transitions

- **Next**: Step 7 — Ship
- **Gate summary**: *"E2E passed [N/N]. Walk through [the feature | the complete app] yourself and approve shipping — this is the last check before the code ships."*
