# Phase 1 · Step 2 — Market Research *(optional)*

## Overview

- **Purpose**: Discover inspiration from comparable products and validate market demand before committing to development.
- **Agent/Skill**: `market-researcher` agent
- **Model**: `haiku`
- **Trigger**: User chooses to run this step after Step 1 completes.
- **Inputs**:
  - `docs/idea-brief.md`
- **Outputs**:
  - `docs/market-notes.md`
- **Template**: `templates/02-market-notes.md`
- **Gate**: `hard` — first checkpoint on whether the idea is worth pursuing; outcome is a three-way choice: proceed / pivot / stop.

## Scope

### In Scope

- Validating market demand for the idea defined in `docs/idea-brief.md`.
- Identifying comparable products and existing alternatives — their strengths, weaknesses, and gaps.
- Surfacing feature inspirations: patterns, interactions, and capabilities from comparable products that the user's project does not yet have but should consider adding to raise its value.
- Surfacing reasons the idea might not work.
- Producing a neutral market findings document with substantive competitive analysis and a populated Feature Inspirations section.

### Out of Scope

- Implementation decisions — these belong to later steps.
- Making the pivot decision on behalf of the user — Step 2 surfaces the evidence; the user makes the call.

### Scope Boundary

> Present findings neutrally. This step produces evidence for the user's proceed / pivot / stop decision; it does not make that decision. The Feature Inspirations section is additive — it expands what the project could become, not a replacement for the user's original idea. The gate outcome belongs to the user.

## Execution Rules

1. Dispatch to the `market-researcher` agent using `docs/idea-brief.md` as the primary input.
2. Use a lighter/faster model for the `market-researcher` dispatch — this step is read-heavy synthesis, not implementation judgment.
3. The agent must populate all seven sections of `templates/02-market-notes.md`, including **Section 5 — Feature Inspirations**. This section must list at least 2-3 concrete features or patterns from comparable products, each with a clear rationale for why it is relevant to this project's target user. Vague entries ("better UX", "notifications") are not acceptable — name the specific feature and the specific user benefit.
4. The "Reasons This Might Not Work" section must not be skipped or tokenistic. Include genuine competitive risks and structural reasons the idea could fail.
5. Present findings neutrally — include competing products alongside supporting market evidence.
6. After delivering the findings, surface the gate decision: *"Market research is done. The main finding is [one sentence from the Conclusions section]. Feature inspirations to consider for the roadmap: [top 2-3 from Section 5]. This is your proceed / pivot / stop decision."*
7. If the user's decision is to stop or pivot, do not advance to Step 3 or any later Phase 1 step.

## Artifact Rules

- **Artifact**: `docs/market-notes.md`
- Fill all seven sections of `templates/02-market-notes.md` with market findings.
- The Feature Inspirations section must have at least 2-3 concrete entries with relevance rationale — leaving it blank or with placeholder rows fails this step.
- The "Reasons This Might Not Work" section must be substantive — not a placeholder or single-sentence dismissal.
- **Status / approval condition**: none — the user's proceed / pivot / stop decision replaces a status field.

## Completion Criteria

The step is considered complete when:
- [ ] `docs/market-notes.md` is written with all seven sections populated.
- [ ] Feature Inspirations section has at least 2-3 concrete entries with relevance rationale.
- [ ] The "Reasons This Might Not Work" section is substantive.
- [ ] The gate summary has been presented to the user, including the top feature inspirations.
- [ ] The user has made a proceed / pivot / stop decision.

## Transition Rules

### Before Advancing

- `docs/market-notes.md` must be complete and findings presented to the user.
- The gate decision must be collected before any next step is dispatched.
- Gate summary: *"Market research is done. The main finding is [one sentence from the Conclusions section]. Feature inspirations to consider: [top 2-3 from Section 5]. This is your proceed / pivot / stop decision."*
- If the decision is **pivot** or **stop**: halt Phase 1; do not advance to Step 3 or any later step.

### Next Step

- **Default**: Step 3 — Prototype (on proceed)
- **Optional skip**: No — if this step runs, the gate must be resolved before advancing
- **User decision required**: Yes — proceed / pivot / stop

### Transition Record

- **Record**: `docs/<project>/phase-1-session.md`
- **Values**: `complete` / `skipped`

## Exceptions / Special Cases

- If Step 2 was skipped at Step 1's transition: mark as `skipped` in the session log and advance directly to Step 3. Downstream steps that list `docs/market-notes.md` as an input proceed without it.
- If the gate outcome is pivot or stop: record the decision in the session log; the rest of Phase 1 does not run.

## References

- `templates/02-market-notes.md`
- `docs/idea-brief.md`
- `kit/steps/phase-1/p1-01-ideation.md` — skip criteria and transition decision
- `market-researcher` agent
