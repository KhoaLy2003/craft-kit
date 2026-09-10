# Phase 1 · Step 5 — Roadmap Generation

## Overview

- **Purpose**: Prioritize features into Must/Should/Nice-to-Have tiers, establish the development build order, and select the Phase 2 execution track.
- **Agent/Skill**: General-purpose agent (drafts); human provides final product-scope decisions.
- **Model**: `sonnet`
- **Trigger**: Step 4 gate approved.
- **Inputs**:
  - `docs/idea-brief.md`
  - `docs/market-notes.md` *(if Step 2 was run)*
  - `docs/prototype/`
  - `docs/DESIGN.md`
- **Outputs**:
  - `docs/roadmap.md` — MoSCoW-prioritized feature list, build order, deferred features, and Phase 2 track decision.
- **Template**: `templates/06-roadmap.md`
- **Gate**: `hard` — product-scope decision requiring explicit human call.

## Scope

### In Scope

- MoSCoW prioritization of all identified features (Must / Should / Could / Won't).
- Establishing a dependency-aware build order for Must features.
- Capturing deferred features explicitly — they are not dropped.
- Evaluating the Phase 2 execution track (single-pass vs. standard loop) against the five criteria and recording the recommendation in `docs/roadmap.md`.

### Out of Scope

- Technical implementation decisions (deferred to Step 6 Architecture).
- Assigning features to specific sprints or milestones within Phase 2.
- Applying the Phase 2 track recommendation automatically — human confirmation is required.

### Scope Boundary

> This step ends once the human approves the prioritized feature list and the Phase 2 track recommendation. The orchestrator does not advance and does not apply the track until the human explicitly confirms.

## Execution Rules

- The general-purpose agent drafts the roadmap based on all available input documents. The human decides all priority and cut/keep calls — this is a product decision, not a technical one.
- All features start with `Status: pending`. The orchestrator updates status values as Phase 2 runs; do not set any feature to a non-pending status at this step.
- Build order must account for feature dependencies, not just MoSCoW tier. A lower-priority feature that is a dependency of a Must feature must be placed before it in the build order.
- Deferred features must be listed explicitly in a Deferred section. They must not be silently dropped from the document.
- **Phase 2 track decision** — evaluated once the roadmap draft is ready, before presenting to the human. Apply the five-criterion table:

  | Criterion | Single-pass (`phase-2-single-pass.md`) | Standard loop (`phase-2-feature-dev.md`) |
  |---|---|---|
  | Must feature count | ≤ 15 | Any |
  | Feature sizes | All S or M | Any L present |
  | Domains | One primary domain | Multiple domains |
  | Dependency structure | Tight chain — each feature builds on the previous | Independent parallel streams |
  | Developer | Solo | Team |

  If all five criteria point to single-pass, recommend single-pass. Any one criterion pointing to the standard loop overrides the rest — recommend standard loop. Record the recommendation and the criterion scores in `docs/roadmap.md` under a `Phase 2 Track` section. The human confirms the recommendation; it is not applied automatically.

## Artifact Rules

- **Artifact**: `docs/roadmap.md`
- Written from `templates/06-roadmap.md`.
- All features must have `Status: pending` at the time of writing.
- The `Phase 2 Track` section must include: the recommended track name, the five criterion scores that produced the recommendation, and a one-line rationale.
- **Status / approval condition**: `docs/roadmap.md` does not carry a document-level `Status` field. The gate is considered passed when the human explicitly approves the scope and the track recommendation in chat.

## Completion Criteria

The step is considered complete when:

- [ ] All identified features are listed and MoSCoW-prioritized.
- [ ] Build order reflects dependency chain, not priority alone.
- [ ] Deferred features are captured in a Deferred section.
- [ ] The Phase 2 track recommendation is written in `docs/roadmap.md` with criterion scores.
- [ ] The human has confirmed the feature scope and the Phase 2 track in chat.

## Transition Rules

### Before Advancing

- The feature list and build order must be human-approved before advancing.
- The Phase 2 track (single-pass or standard loop) must be confirmed — not just recommended.
- Gate summary message: *"The feature roadmap is set — [N] Must features in build order, [X] items explicitly deferred. Does this scope match what you want to ship for the MVP?"*

### Next Step

- **Default**: Step 6 — Tech Stack Research and Architecture Decision
- **Optional skip**: No
- **User decision required**: Yes — scope approval and Phase 2 track confirmation

### Transition Record

- **Record**: `docs/<project>/phase-1-session.md`
- **Values**: `complete` / `skipped`

## Exceptions / Special Cases

- If Step 2 (Market Research) was skipped, the roadmap is drafted without `docs/market-notes.md`. The agent should note this in the roadmap and flag any assumptions made about user priorities.
- If the five criteria produce a split result (some point single-pass, some point standard loop), the standard loop always wins — any one standard-loop criterion overrides.
- If the human wants to change scope after approving (e.g., mid-Step 6), return to this step and re-approve before proceeding.

## References

- `templates/06-roadmap.md`
- `kit/steps/phase-1/p1-04-design.md`
- `kit/steps/phase-1/p1-06-architecture.md`
- `phase-2-single-pass.md`
- `phase-2-feature-dev.md`
