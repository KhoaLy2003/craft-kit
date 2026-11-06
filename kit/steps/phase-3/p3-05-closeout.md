# Phase 3 · Step 5 — Closeout

## Overview

- **Purpose**: Runs when Phase 2 reports the release complete (its Ship step marked the release `shipped`), or when the user ends the release early. It closes the loop so the next round starts from facts.
- **Agent/Skill**: orchestrator
- **Model**: `balanced`
- **Gate**: `soft`
- **Inputs**: the release block, `docs/backlog.json`, `docs/phase-2-session.md`, `discover.md`
- **Outputs**: Outcome section in the release block; leftover features resolved
- **Template**: none

## Rules

- List every feature of the release with its final status (`shipped`, `cancelled`, `deferred`, or `pending` stretch). Do not change a shipped feature.
- For each `pending` feature left (Should / Could stretch), the user chooses: keep it as `pending` in this release's record for a later round, or move it to `deferred` (append a `deferred` event, set `release: null`).
- **Known issues.** Read `docs/known-issues.md` (when it exists). Every `open` row gets the user's choice: fix it now (hand it to a Phase 2 or bug-fix run), or `accepted`. Nothing stays `open` past Closeout. Record the counts in the Outcome section.
- Add an **Outcome** section to the release block: the release goal against what shipped, shipped features with their PR references, cancelled features with reasons, and any feedback the user has since the release. Ask the user for that feedback; record "none" if there is none.
- Closing the release does not start the next one. Tell the user that new requirements start a new Phase 3 round with a new `<release-slug>`.
- Append the Closeout result to `docs/phase-3-session.md`.

## Completion Criteria

- [ ] Every feature in the release has a final status; no `in-progress` feature remains
- [ ] Outcome section present in the release block
- [ ] Leftover `pending` features resolved; no `open` row in `docs/known-issues.md`; render script exits 0

**Gate summary:** *"Release [slug]: [n] shipped, [c] cancelled, [d] deferred. Goal '[goal]' was [met | partly met | not met]. Anything left pending moves as you chose. Ready to close it?"*

## Transitions

- **Next**: Phase 3 complete (the release block records the outcome)
