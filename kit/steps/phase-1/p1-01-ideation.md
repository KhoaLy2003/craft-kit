# Phase 1 · Step 1 — Product Ideation

## Overview

- **Purpose**: Clarify the problem, target user, and solution hypothesis to define what you're building.
- **Agent/Skill**: `brainstorming` skill (Architectural path)
- **Trigger**: Starting a new project with no existing codebase.
- **Inputs**:
  - `docs/phase-1-kickoff.md` — user-filled project context (idea, target user, constraints, existing assets, steps to skip); fall back to conversational clarification if the file is absent or thin.
- **Outputs**:
  - `docs/idea-brief.md`
- **Template**: `templates/01-idea-brief.md`
- **Gate**: `none` — Step 2 skip/proceed decision is a transition gate surfaced after completion; see Transition Rules.

## Scope

### In Scope

- Clarifying what problem exists today.
- Identifying who experiences the problem.
- Identifying what existing alternatives people use.
- Defining what is explicitly out of scope for the product.
- Producing a clear problem statement, target user definition, and solution hypothesis.

### Out of Scope

- Tech stack selection — belongs to Step 6.
- Architecture decisions — belongs to Step 6.
- Component and UI design — belongs to Step 4.
- Data models — belongs to Step 6.

### Scope Boundary

> The brainstorming skill's Architectural path naturally drives toward tech stack options, data models, and component design. Stop the skill after the clarifying questions phase — as soon as the problem statement, target user, and solution hypothesis are clear enough to fill `idea-brief.md`. Entering those areas in Step 1 front-loads decisions that later steps exist to make deliberately, and makes those steps redundant.

## Execution Rules

1. Always use the Architectural path — there is no existing codebase, so this step is never Bounded.
2. Draw inputs from `docs/phase-1-kickoff.md` when present; fall back to conversational Q&A if the file is absent or thin.
3. Ask clarifying questions covering: what problem exists today, who experiences it, what existing alternatives people use, and what is explicitly out of scope. Stop there — do not continue into tech stack or architecture territory.
4. **Q&A must complete before writing the artifact.** The contract is: questions → answers → draft → user review → write. Do not write `docs/idea-brief.md` until all clarifying questions are answered and the user has reviewed the draft. Writing before Q&A completes produces an idea-brief that reflects assumptions, not answers — and requires rework.
5. Do not invoke `writing-plans` at any point during this step.

## Artifact Rules

- **Artifact**: `docs/idea-brief.md`
- Fill `templates/01-idea-brief.md` with answers gathered during Q&A.
- Save the result to `docs/idea-brief.md`.
- **Status / approval condition**: Set `Status: approved` only after the user confirms the draft.

## Completion Criteria

The step is considered complete when:

- [ ] All clarifying questions have been answered by the user.
- [ ] The user has reviewed the draft idea brief.
- [ ] `docs/idea-brief.md` is written and marked `Status: approved`.
- [ ] The user has been presented with the Step 2 skip/proceed choice and a decision has been recorded in the session log.

## Transition Rules

### Before Advancing

- `docs/idea-brief.md` must exist and be marked `Status: approved`.
- The Step 2 skip/proceed choice must be surfaced and recorded — **this choice is required even if the kickoff says "run all steps."** The kickoff controls which steps are skippable; it does not replace per-step gate conversations.
- Present the user with: *"Step 2 (Market Research) validates demand and finds competitive risks. Recommended if you haven't externally validated this idea yet. Skip it only if you already have evidence or are building for yourself. Proceed with Step 2 or skip to Step 3?"*

### Next Step

- **Default**: Step 2 — Market Research
- **Optional skip**: Yes — if the user already has market evidence or is building for themselves
- **User decision required**: Yes

### Transition Record

- **Record**: `docs/<project>/phase-1-session.md`
- **Values**: `complete` / `skipped`

## Exceptions / Special Cases

- If the kickoff file explicitly pre-answers the Step 2 skip question (e.g. "proceed with Step 2"), the orchestrator may advance without re-asking — but must still surface that decision in chat before dispatching Step 2 or Step 3.

## References

- `templates/01-idea-brief.md`
- `docs/phase-1-kickoff.md`
- `kit/steps/phase-1/p1-02-market-research.md`
- `brainstorming` skill
