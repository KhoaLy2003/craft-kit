# Phase 1 · Step 7 — Tech Stack and Architecture Decision

- **Agent/Skill**: `research-analyst` agent (analysis and recommendation); human makes the final decision
- **Trigger**: Step 6 gate approved
- **Inputs**: `docs/tech-options.md`, `docs/DESIGN.md`, `docs/roadmap.md`
- **Outputs**: `docs/architecture.md` — final stack choice, high-level architecture, reasoning tied to roadmap complexity
- **Template**: `templates/07-architecture.md`
- **Gate**: `hard` — the stack choice is irreversible once Phase 2 begins; changing it mid-build discards all implementation work
- **Gate Summary**: *"The recommended stack is [X]. This is the technology your app will be built with. Review the reasoning and confirm before we write the architecture document."*
- **Notes**:
  - **Two-stage process — do not collapse into one:**
    1. **Analysis stage:** The `research-analyst` reads `docs/tech-options.md` and the roadmap's actual scope (feature count, sizes, domains). It produces a **recommendation summary in chat** — two or three candidate stacks ranked with tradeoffs, one clearly recommended. This is a chat message, not a document. The agent must not write `docs/architecture.md` yet and must not set `Status: approved` on anything.
    2. **Confirmation stage:** The orchestrator presents the recommendation and waits for the human to explicitly confirm or choose a different option. Only after the human says which stack to use does the agent write `docs/architecture.md` with `Status: approved`.
  - **The user must name the stack.** A response of "looks good" or "proceed" is sufficient confirmation — but the orchestrator must have surfaced the specific stack name in its gate message so the user knows what they are confirming. Do not treat a non-response or a generic "continue" as implicit approval.
  - The document must explicitly reference why the roadmap's scope/complexity justifies the choice. The "Complexity deliberately avoided for MVP scope" section is required — name what was deliberately NOT adopted. Consult the open questions from `docs/tech-options.md` Section 5 here.
  - `docs/architecture.md` starts as `Status: draft` when written; the orchestrator sets it to `Status: approved` in the file only after human confirmation at this gate.
