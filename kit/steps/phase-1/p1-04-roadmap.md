# Phase 1 · Step 4 — Roadmap

## Overview

- **Purpose**: Prioritise features into Must / Should / Could / Won't, set the dependency-aware build order, and choose the Phase 2 scope.
- **Agent/Skill**: general-purpose agent drafts; the human makes every priority, cut/keep, and scope call.
- **Model**: `balanced`
- **Trigger**: Step 3 gate approved.
- **Inputs**: `docs/idea-brief.md`; `docs/market-notes.md` *(if Step 2 ran)*; `docs/prototype/`; `docs/DESIGN.md`.
- **Outputs**: `docs/roadmap.md` — feature list, build order, deferred features, `Phase 2 Scope`.
- **Template**: `templates/04-roadmap.md`
- **Gate**: `hard` — product-scope decision.

## Scope

- **In**: MoSCoW prioritisation; evaluating each market-research feature inspiration; build order; explicit deferrals; the Phase 2 scope recommendation.
- **Out**: technical decisions (Step 6); sprint or milestone assignment; applying the scope recommendation without human confirmation.

## Execution Rules

- **Feature inspirations**: for each entry in `docs/market-notes.md` Section 5, place it in a MoSCoW tier or mark it `Won't (out of scope)` with a one-line reason. None may be silently ignored. If Step 2 was skipped, say so in the roadmap and flag assumptions made about priorities.
- All features (original and inspirations) start `Status: pending`; Phase 2 updates status as features ship.
- **Build order** follows dependencies, not only tier: a lower-priority feature that a Must feature depends on comes first.
- **Deferred** features are listed in the Explicitly Deferred section, never dropped.
- **Phase 2 Scope** (`all` | `feature`) — the single selection rule for the kit, evaluated on the Must features once the draft is ready, before presenting it:

  | Criterion | `scope: all` (whole app in one cycle) | `scope: feature` (one feature per cycle) |
  |---|---|---|
  | Must feature count | ≤ 15 | > 15 |
  | Feature sizes | All S or M | Any L |
  | Domains | One primary domain; any other domain is < 20% of Must features | A second domain is ≥ 20% of Must features |
  | Dependency structure | Tight chain, each feature builds on the previous | Independent parallel streams |
  | Developers | Solo | Team |

  Recommend `all` only if all five criteria point to it; **any one criterion pointing to `feature` overrides the rest.** Write the recommendation, the five criterion scores, and a one-line rationale in the roadmap's `Phase 2 Scope` section. The human confirms; it is never applied automatically.

  **Mid-cycle escape:** if Phase 2 Plan (`kit/phase-2.md`) finds more than 20% of tasks going to a minority specialist under `scope: all`, it recommends switching to `scope: feature`. On user confirmation, update the `Phase 2 Scope` field in `docs/roadmap.md`.

## Artifact Rules

- Write `docs/roadmap.md` from the template; every feature `pending`.
- Keep the template's metadata block and section numbering (Phase 3 appends release blocks and reads Section 4).
- Set `Status: approved` when the human confirms scope and Phase 2 Scope at the gate.

## Completion Criteria

- [ ] All features listed and MoSCoW-prioritised; every Must feature traces to the Core User Flow; no tech-stack assumptions in feature descriptions.
- [ ] Build order reflects the dependency chain; deferred features captured.
- [ ] `Phase 2 Scope` written with criterion scores.
- [ ] Human confirmed the feature scope and `Phase 2 Scope`.

Gate summary: *"The feature roadmap is set: [N] Must features in build order, [X] items explicitly deferred, Phase 2 will run as scope [all|feature]. Does this scope match what you want to ship for the MVP?"*

## Transition Rules

Next: Step 5 — Full Screen Design. If scope changes after approval (for example during Step 6), return here and re-approve before continuing.
