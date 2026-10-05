# Phase 1 · Step 6 — Tech Stack & Architecture

## Overview

- **Purpose**: Evaluate technology options against the approved roadmap and document the confirmed architecture for Phase 2.
- **Agent/Skill**: `research-analyst` agent (research, analysis, recommendation); the human makes the final stack decision.
- **Model**: `capable` (a lighter model is fine for Stage 1 research)
- **Trigger**: Step 5 gate approved, or Step 5 skipped.
- **Inputs**: `docs/idea-brief.md`; `docs/market-notes.md` *(if Step 2 ran)*; `docs/DESIGN.md`; `docs/roadmap.md`; `kit/stack-catalog.md`.
- **Outputs**: `docs/architecture.md` — stack, high-level architecture, reasoning tied to the roadmap's scope.
- **Template**: `templates/06-architecture.md`
- **Gate**: `hard` — changing the stack mid-build discards implementation work.

## Scope

- **In**: catalog-first research; a full stack recommendation (baseline, deviations, additions) in chat; writing `docs/architecture.md` only after the stack is confirmed; justifying the stack against the roadmap, including what was deliberately not adopted.
- **Out**: writing the document before confirmation; `Status: approved` before confirmation; per-feature implementation design (Phase 2); exhaustive library research for stacks the catalog already covers.

## Execution Rules

Three stages. Never collapse them.

### Stage 1 — Research (catalog-first)

1. Read `kit/stack-catalog.md` before any web search. Follow its analysis protocol: start from the Canonical Baseline; apply a Deviation Trigger only when the roadmap's requirements match it; walk the Additions Catalog domain by domain and add only what the roadmap requires.
2. Web-search only for a required service or library missing from the catalog, or for a volatile fact (pricing, free-tier limits) whose `Last verified` date is over 3 months old.
3. Use a `librarian` agent only when a specific library needs source-verified confirmation.
4. Any subagent dispatch that writes a file follows the fail-fast write instruction in `kit/orchestrator-conventions.md`.

### Stage 2 — Analysis (chat only)

`research-analyst` posts the full proposed stack in chat (baseline layer, deviations applied, additions included) with a one-line rationale per non-baseline choice, naming the stack explicitly. This is a chat message: do not write `docs/architecture.md` or set any approval status.

### Stage 3 — Confirmation

1. Hard gate: *"The recommended stack is [X]. This is the technology your app will be built with. Review the reasoning and confirm before we write the architecture document."* Optionally add: *"Reply with the stack name plus 'defaults' to also accept the default constitution in Step 7 without a separate review."*
2. A reply counts only if it names the stack, or confirms a stack the gate message named. A generic "continue" without a named stack does not count; if the user is undecided, re-surface the recommendation and ask again.
3. Only then write `docs/architecture.md` from the template with `Status: draft`; the orchestrator sets `Status: approved` once the confirmation is recorded.

## Artifact Rules

- Must justify the stack with the roadmap's actual feature count, sizes, and domains, not generic best practice.
- Must include a "Complexity deliberately avoided for MVP scope" section naming what was not adopted and why.
- Consequences name real trade-offs (not only upsides); no unresolved "TBD" on core stack choices.

## Completion Criteria

- [ ] `kit/stack-catalog.md` was read before any web search; baseline, deviations, and additions were walked as described.
- [ ] The full proposed stack with rationale was surfaced in chat and the human named (or confirmed by name) the stack.
- [ ] `docs/architecture.md` exists, was written from the template after confirmation, and is `Status: approved`.

## Transition Rules

Next: Step 7 — Constitution.

## Exceptions / Special Cases

- The human rejects the proposal and names a technology not in the catalog: web-search it before writing the document; the three stages and the confirmation still apply.
- Step 2 was skipped: research proceeds without `docs/market-notes.md`; flag any competitive assumptions made.
