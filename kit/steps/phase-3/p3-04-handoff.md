# Phase 3 · Step 4 — Handoff

## Overview

- **Purpose**: Turn the approved design into work that developers can pick up independently, and publish the design so every branch starts from it.
- **Agent/Skill**: orchestrator
- **Model**: `balanced`
- **Gate**: `soft`
- **Inputs**: the release block (Build Order, Shared Surface, Impact), `design.md`, `docs/backlog.json`
- **Outputs**: Work Packages table in the release block; design commit; Phase 2 prompts
- **Template**: none

## Rules

- Add a **Work Packages** table to the release block: `Feature | Depends on | Owns (Shared Surface items) | Group | Branch`. A **group** is a set of features buildable at the same time: each depends only on earlier groups and none needs another's *code* (design, schema, and contracts are fixed in Step 3); a feature needing built code goes in a later group. Same-group features must not own the same Shared Surface item. Put one line under the table: "Build each feature with `kit/phase-2.md` (`scope: feature`, feature ID); `design.md` is an input to its Spec step, not a spec."
- Commit the design: branch `design/<release-slug>`, commit `design.md`, the amended foundation documents, the release block, and `docs/backlog.*`, then push and open a PR per the pre-flight, confirmation, and local-only fallback in `p2-07-ship.md`. Feature branches start from the base branch (conventions rule 17) after that PR merges (from `design/<release-slug>` if local-only).
- **Hand off; never build here.** Phase 3 writes no feature code and does not start Phase 2 in this session. Emit one handoff prompt per first-group feature (template below), then **close this session and open a new one for Phase 2**; each prompt can run in its own session, worktree, or developer. Emit a later group's prompts when the earlier groups have `shipped` and merged (or the later feature branches from the earlier one, `p2-03-implement.md`). Phase 2 reads the Work Packages table and `docs/backlog.json`; the prompt only points it there.
- If the user asks to implement a feature in this session, do not. Re-emit the prompt for it and explain that Phase 2 starts from Step 1 (Spec) in a new session (conventions rule 14).

```
Read these files before starting:
- docs/architecture.md
- docs/data-model.md
- docs/flows.md
- docs/constitution.md
- docs/roadmap.md
- docs/backlog.json
- docs/iterations/<release-slug>/design.md (only the `### [F-id]` entry under Feature slices, and the sections it lists)
- kit/phase-2.md

Then run Phase 2 (scope: feature) for [project-name], feature [F-id].
```

  `kit/` is git-ignored, so a fresh clone lacks it; there, first reinstall with `npx github:KhoaLy2003/craft-kit#v<kit_version>` (`<kit_version>` from `docs/.craft-kit.json`; substitute the real value in the prompt).
- **Design change requests.** If a Phase 2 cycle needs an entity, field, screen, or contract the wave design lacks, it stops and returns here: update `design.md` (including the Feature slices entries it affects), the foundation documents, the Shared Surface table, and the Amendment log; list the features using the changed items (they re-check their spec slice); get approval. Never patch a shared item inside one feature.

## Completion Criteria

- [ ] Work Packages table present, with a group for every feature and no shared owner within a group
- [ ] The design commit exists on `design/<release-slug>` (pushed and PR open, or the local-only fallback recorded)
- [ ] Phase 2 handoff prompts emitted for the first group; session log shows Step 4 `complete` (Phase 3 stays open until Step 5 Closeout)

## Transitions

- **Next**: Step 5 — Closeout
