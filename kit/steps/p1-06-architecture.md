# Phase 1 · Step 6 — Tech Stack Research and Architecture Decision

- **Agent/Skill**: `research-analyst` agent (research, analysis, and recommendation); human makes the final decision
- **Trigger**: Step 5 gate approved
- **Inputs**: `docs/idea-brief.md`; `docs/market-notes.md` *(if Step 2 was run)*; `docs/DESIGN.md`; `docs/roadmap.md`; `kit/stack-catalog.md`
- **Outputs**: `docs/architecture.md` — final stack choice, high-level architecture, reasoning tied to roadmap complexity
- **Template**: `templates/07-architecture.md`
- **Gate**: `hard` — the stack choice is irreversible once Phase 2 begins; changing it mid-build discards all implementation work
- **Gate Summary**: *"The recommended stack is [X]. This is the technology your app will be built with. Review the reasoning and confirm before we write the architecture document."*
- **Notes**:
  - **Three-stage process — do not collapse into one:**
    1. **Research stage (catalog-first):** Read `kit/stack-catalog.md` before any web searches. Use catalog entries directly for any stack the project's requirements map to — skip web searches for those stacks except to spot-check volatile facts (pricing, free-tier limits) if the entry's `Last verified` date is more than 3 months old. Web-search only for stacks not in the catalog or for unknowns. Use a dedicated library research agent only if a specific library needs source-verified capability confirmation — your general-purpose agent handles most cases. Surface 2–3 viable options with pros/cons, informed by `docs/roadmap.md`'s actual feature count, sizes, and domains.
    2. **Analysis stage (chat only):** The `research-analyst` produces a **recommendation summary in chat** — two or three candidate stacks ranked with tradeoffs, one clearly recommended. This is a chat message, not a document. The agent must not write `docs/architecture.md` yet and must not set `Status: approved` on anything.
    3. **Confirmation stage:** The orchestrator presents the recommendation and waits for the human to explicitly confirm or choose a different option. Only after the human says which stack to use does the agent write `docs/architecture.md` with `Status: approved`.
  - **The user must name the stack.** A response of "looks good" or "proceed" is sufficient confirmation — but the orchestrator must have surfaced the specific stack name in its gate message so the user knows what they are confirming. Do not treat a non-response or a generic "continue" as implicit approval.
  - The document must explicitly reference why the roadmap's scope/complexity justifies the choice. The "Complexity deliberately avoided for MVP scope" section is required — name what was deliberately NOT adopted.
  - `docs/architecture.md` starts as `Status: draft` when written; the orchestrator sets it to `Status: approved` in the file only after human confirmation at this gate.
  - **Model:** A lighter/faster model is appropriate for the research stage. Reserve the full model for the analysis and recommendation.
  - **Fail-fast write:** include the fail-fast write instruction (see `kit/orchestrator-conventions.md` item 6) verbatim in any subagent dispatch for this step.
