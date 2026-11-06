# Phase 3 · Step 2 — Prioritise

## Overview

- **Purpose**: Choose, rank, and commit candidates as a new release in `docs/backlog.json`, with its `## Release <slug>` block in `docs/roadmap.md`. No subagent.
- **Agent/Skill**: orchestrator with the user (no subagent)
- **Model**: `capable`
- **Gate**: `hard`
- **Inputs**: `discover.md` (release goal, candidates), `docs/backlog.json`, `docs/roadmap.md`, `kit/templates/04-roadmap.md`
- **Outputs**: new release and features in `docs/backlog.json`; release block in `docs/roadmap.md`
- **Template**: `kit/templates/04-roadmap.md`

## Rules

- Present candidates as a table (impact, size, evidence, dependencies) with a recommended cut line. The orchestrator recommends; the user decides.
- Score impact vs. size against the release goal and assign MoSCoW. Only `Must` features are guaranteed this release; `Should` / `Could` are explicit stretch.
- Prefer a small release: beyond roughly 5 `Must` features or any `L` feature, propose splitting into two releases.
- **Append only, after approval.** Write nothing to `docs/backlog.json` until the scope is approved. Then append the release entry (`status: planned`) and its features (`pending`, a `created` event with `source: live`, `by: orchestrator`); never renumber, edit, or remove shipped features. IDs continue from the highest (`F11` → `F12`). Run `node kit/scripts/render-backlog.js`; never hand-edit the table.
- Add a `## Release <slug>` section to `docs/roadmap.md` (Build Order, Deferred with reasons, Impact prose). Replace any "all features are shipped" sentence in the roadmap's own Build Order section with a pointer to the new release block, so the roadmap never says nothing is left to build. Set top-level `Phase 2 Scope` and `phase2_scope` in `docs/backlog.json` to `feature` with the release; no second scope field in the block.
- Mark the block `draft` until approved; refresh `Last updated`; add `discover.md` to `Based on`; restore roadmap `Status: approved` only after approval.

## Completion Criteria

- [ ] Release entry and features exist in `docs/backlog.json` with IDs continuing the sequence; each feature traces to a candidate and the release goal
- [ ] Build order respects dependencies; unselected candidates are in Deferred with reasons
- [ ] Shipped features are unchanged in `docs/backlog.json`; the render script exits 0
- [ ] The user explicitly approved the scope

**Gate summary:** *"This release commits [N] features — [list] — to serve '[goal]'. [M] candidates are deferred. Do you approve this scope?"*

## Exceptions

- User wants everything: show the summed cost against the goal; if they insist, record the decision and split into sequential releases.
- Zero features selected: end Phase 3 as `complete` with no roadmap change; record the reason in the session log.
- The user later drops every feature of the release before any ships: set the release `status: cancelled` in `docs/backlog.json` and follow `kit/guides/change-control.md`.

## Transitions

- **Next**: Step 3 — Design (after explicit approval; a handover seam, `kit/guides/session-handover.md`)
