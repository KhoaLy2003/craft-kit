# Phase 1 · Step 5 — Roadmap Generation

- **Agent/Skill**: Your general-purpose agent (drafts); human provides final product-scope decisions
- **Trigger**: Step 4 gate approved
- **Inputs**: `docs/idea-brief.md`; `docs/market-notes.md` *(if Step 2 was run)*; `docs/prototype/`; `docs/DESIGN.md`
- **Outputs**: `docs/roadmap.md` — MoSCoW-prioritized feature list, build order, deferred features
- **Template**: `templates/06-roadmap.md`
- **Gate**: `hard` — product-scope decision requiring human call
- **Gate Summary**: *"The feature roadmap is set — [N] Must features in build order, [X] items explicitly deferred. Does this scope match what you want to ship for the MVP?"*
- **Notes**:
  - This is a product decision, not a technical one. Your general-purpose agent drafts based on inputs; the human decides priority and cut/keep calls. All features start with Status `pending` — the orchestrator updates this as Phase 2 runs. Build order accounts for dependencies, not just priority. Deferred features must be captured, not silently dropped.
  - **Phase 2 track decision (made at this gate, not before):** Once the roadmap is approved, the orchestrator evaluates the feature list and recommends a Phase 2 track. Record the decision in `docs/roadmap.md` under `Phase 2 Track`. The criteria:

    | Criterion | Single-pass (`phase-2-single-pass.md`) | Standard loop (`phase-2-feature-dev.md`) |
    |---|---|---|
    | Must feature count | ≤ 15 | Any |
    | Feature sizes | All S or M | Any L present |
    | Domains | One primary domain | Multiple domains |
    | Dependency structure | Tight chain — each feature builds on the previous | Independent parallel streams |
    | Developer | Solo | Team |

    If all five criteria point to single-pass, recommend it. Any one criterion pointing to the standard loop overrides the rest — recommend standard. The human confirms the recommendation; it is not applied automatically.
