# Phase 1 · Step 6 — Tech Stack Research and Architecture Decision

## Overview

- **Purpose**: Evaluate technology options against the approved roadmap and document the confirmed system architecture for Phase 2 implementation.
- **Agent/Skill**: `research-analyst` agent (research, analysis, and recommendation); human makes the final stack decision.
- **Model**: `capable`
- **Trigger**: Step 5 gate approved.
- **Inputs**:
  - `docs/idea-brief.md`
  - `docs/market-notes.md` *(if Step 2 was run)*
  - `docs/DESIGN.md`
  - `docs/roadmap.md`
  - `kit/stack-catalog.md`
- **Outputs**:
  - `docs/architecture.md` — final stack choice, high-level architecture, reasoning tied to roadmap complexity.
- **Template**: `templates/07-architecture.md`
- **Gate**: `hard` — the stack choice is irreversible once Phase 2 begins; changing it mid-build discards all implementation work.

## Scope

### In Scope

- Catalog-first research: reading `kit/stack-catalog.md` — starting from the Canonical Baseline, applying Deviation Triggers against roadmap requirements, then walking the Additions Catalog domain by domain.
- Producing a full stack recommendation (baseline + any deviations + applicable additions) with rationale in chat (not a document).
- Writing `docs/architecture.md` only after the human explicitly names the confirmed stack.
- Documenting why the roadmap scope justifies the chosen stack, including what was deliberately not adopted for MVP.

### Out of Scope

- Writing `docs/architecture.md` before human confirmation — the document must not be created speculatively.
- Setting `Status: approved` on any artifact before the human confirmation at this gate.
- Detailed implementation design for individual features (covered in Phase 2 per-feature steps).
- Exhaustive library-level research for stacks already covered in `kit/stack-catalog.md`.

### Scope Boundary

> The step ends when `docs/architecture.md` exists with `Status: approved` and the human has confirmed the stack by name. The orchestrator must not advance to Step 7 before this file exists and is approved.

## Execution Rules

This step follows a strict three-stage process. Do not collapse the stages into one pass.

### Stage 1 — Research (catalog-first)

1. Read `kit/stack-catalog.md` before opening any web search or external source.
2. Apply the catalog's three-step analysis protocol:
   - **Baseline**: start from the Canonical Baseline Stack (Section 1).
   - **Deviations**: check each Deviation Trigger (Section 3) against the project's requirements from `docs/roadmap.md`. Apply only the triggers that match — do not apply deviations speculatively.
   - **Additions**: walk the Additions Catalog (Section 4) domain by domain. Add only what the roadmap explicitly requires.
3. Web-search only in these two cases: (a) a required service or library is not listed in the catalog, or (b) the catalog entry's `Last verified` date is more than 3 months old and the fact being checked is volatile (pricing, free-tier limits).
4. Use a dedicated `librarian` agent only if a specific library needs source-verified capability confirmation. The `research-analyst` handles most cases without delegation.
5. Use a lighter/faster model for this research stage.
6. Include the fail-fast write instruction from `kit/orchestrator-conventions.md` item 6 verbatim in any subagent dispatch for this step.

### Stage 2 — Analysis (chat only)

1. The `research-analyst` produces a **recommendation summary in chat**: the full proposed stack (baseline layer, any deviations applied, additions included) with a one-line rationale for each non-baseline choice.
2. This output is a chat message, not a document. Do not write `docs/architecture.md` at this stage. Do not set `Status: approved` on anything.
3. Use the full model for this stage and for the recommendation message.

### Stage 3 — Confirmation

1. The orchestrator presents the recommendation to the human and waits for an explicit response.
2. The human must name the stack. A response of "looks good" or "proceed" is acceptable confirmation — but only if the orchestrator's gate message surfaced the specific stack name so the human knows exactly what they are confirming. A generic "continue" without a named stack does not count as confirmation.
3. Only after the human confirms does the agent write `docs/architecture.md` from `templates/07-architecture.md` with `Status: draft`.
4. The orchestrator sets the file to `Status: approved` after the human's confirmation is received and recorded.

## Artifact Rules

- **Artifact**: `docs/architecture.md`
- Written from `templates/07-architecture.md`.
- Must not be created until Stage 3 (after human confirmation).
- Written initially as `Status: draft`; the orchestrator updates it to `Status: approved` upon human confirmation.
- Must include a section explaining why the roadmap's scope and complexity justify the chosen stack.
- Must include a section titled "Complexity deliberately avoided for MVP scope" that names what was deliberately not adopted and why.
- Must reference the roadmap's actual feature count, sizes, and domains as the rationale basis — not generic best-practice statements.
- **Status / approval condition**: Set `Status: approved` only after the human has confirmed the stack by name in chat.

## Completion Criteria

The step is considered complete when:

- [ ] `kit/stack-catalog.md` was read before any web search was performed.
- [ ] The Canonical Baseline was the starting point; Deviation Triggers were checked against roadmap requirements.
- [ ] Additions Catalog was walked domain by domain; only roadmap-required additions were included.
- [ ] The full proposed stack (baseline + deviations + additions) with rationale was surfaced in chat.
- [ ] The human explicitly named (or confirmed by name) the chosen stack.
- [ ] `docs/architecture.md` exists, was written from the template, and carries `Status: approved`.
- [ ] The document references the roadmap's complexity as justification and includes the "Complexity deliberately avoided for MVP scope" section.

## Transition Rules

### Before Advancing

- `docs/architecture.md` must exist with `Status: approved`.
- The human must have named the confirmed stack — implicit approval is not sufficient.
- Gate summary message: *"The recommended stack is [X]. This is the technology your app will be built with. Review the reasoning and confirm before we write the architecture document."*

### Next Step

- **Default**: Step 7 — Constitution
- **Optional skip**: No
- **User decision required**: Yes — explicit stack confirmation by name

### Transition Record

- **Record**: `docs/<project>/phase-1-session.md`
- **Values**: `complete` / `skipped`

## Exceptions / Special Cases

- If the human rejects the proposed stack and names a different technology not in the catalog, the agent must research that technology using web search before writing `docs/architecture.md`. The three-stage process still applies — confirmation must precede the document write.
- If Step 2 (Market Research) was skipped, the research stage proceeds without `docs/market-notes.md`; the agent should flag any competitive assumptions made.
- The gate is `hard`. If the human is undecided, the step must not advance. The orchestrator should re-surface the recommendation and ask again rather than defaulting or proceeding on silence.
- Model allocation: lighter/faster model for Stage 1 research; full model for Stage 2 analysis and the recommendation message.

## References

- `kit/stack-catalog.md`
- `templates/07-architecture.md`
- `kit/orchestrator-conventions.md` (item 6 — fail-fast write instruction)
- `kit/steps/phase-1/p1-05-roadmap.md`
- `kit/steps/phase-1/p1-07-constitution.md`
- `research-analyst` skill
- `librarian` skill
