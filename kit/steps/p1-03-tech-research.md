# Phase 1 · Step 3 — Technical Research for Tech Stack

- **Agent/Skill**: `research-analyst` agent (broad landscape); `librarian` agent (specific library deep-dives, source-verified)
- **Trigger**: Step 2 complete or skipped
- **Inputs**: `docs/idea-brief.md`; `docs/market-notes.md` *(if Step 2 was run)*
- **Outputs**: `docs/tech-options.md` — candidate options with tradeoffs; NOT a final decision
- **Template**: `templates/03-tech-options.md`
- **Gate**: `none`
- **Notes**: Explicitly exploratory — do not commit to a stack here. The final decision happens in Step 7, after prototype and roadmap exist. Surface at least 2–3 viable options with pros/cons.

  **Step 1 — read the stack catalog first.** Before doing any web searches, read `kit/stack-catalog.md`. This file contains pre-researched entries for the most common web stacks (React+Supabase, Next.js+Upstash, SvelteKit+PocketBase, Firebase, Convex, Neon, etc.) with stable architectural facts already filled in. Use catalog entries directly for any option the project's requirements map to — skip web searches for those stacks except to spot-check volatile facts (pricing, free-tier limits) if the entry's `Last verified` date is more than 3 months old.

  **Step 2 — web-search only for unknowns or volatile facts.** If the project requires a stack not in the catalog, or needs a time-sensitive fact (e.g., current free-tier limits, deprecation status), dispatch `research-analyst` for that specific gap. Dispatch `librarian` only if a specific library needs source-verified capability confirmation. The open questions in Section 5 of the template feed directly into Step 7 — do not skip them.

  **Model:** research synthesis, not implementation — a lighter/faster model is appropriate for both `research-analyst` and `librarian` dispatches here.

  **Fail-fast write:** include the fail-fast write instruction (see `kit/orchestrator-conventions.md` item 6) verbatim in any subagent dispatch for this step.
