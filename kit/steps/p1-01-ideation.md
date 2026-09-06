# Phase 1 · Step 1 — Product Ideation

- **Agent/Skill**: `brainstorming` skill (Architectural path)
- **Trigger**: Starting a new project with no existing codebase
- **Inputs**: `phase-1-kickoff.md` (user-filled project context — idea, target user, constraints, existing assets, steps to skip); fall back to conversational clarification if the kickoff file is absent or thin
- **Outputs**: `docs/idea-brief.md`
- **Template**: `templates/01-idea-brief.md`
- **Gate**: `none`
- **Notes**:
  - Use the Architectural path — there is no existing codebase, so this is never Bounded.
  - **Scope boundary (critical):** The brainstorming skill's Architectural path naturally drives toward tech stack options, data models, and component design. Do NOT follow it there in Step 1. Stop the skill after the clarifying questions phase — as soon as the problem statement, target user, and solution hypothesis are clear enough to fill `idea-brief.md`. Tech stack belongs to Step 3. Architecture belongs to Step 7. Component and UI design belongs to Step 5. Entering those areas in Step 1 front-loads decisions that later steps exist to make deliberately, and makes those steps redundant.
  - Clarifying questions in Step 1 should cover: what problem exists today, who experiences it, what existing alternatives people use, and what's explicitly out of scope. Stop there.
  - Fill `templates/01-idea-brief.md`, save the output to `docs/idea-brief.md`, and mark Status as `approved` before advancing. Do not invoke `writing-plans`.
  - **After Step 1 completes, before advancing:** present the user with a choice — *"Step 2 (Market Research) validates demand and finds competitive risks. Recommended if you haven't externally validated this idea yet. Skip it only if you already have evidence or are building for yourself. Proceed with Step 2 or skip to Step 3?"* Record the decision in the session log (`complete` or `skipped`). **This choice is required even if the kickoff says "run all steps."** The kickoff controls which steps are skippable; it does not replace per-step gate conversations. The only exception: if the kickoff explicitly pre-answers this specific question (e.g. "proceed with Step 2"), the orchestrator may advance — but must still surface that decision in chat before dispatching.
