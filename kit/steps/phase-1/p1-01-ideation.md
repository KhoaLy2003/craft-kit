# Phase 1 · Step 1 — Product Ideation

## Overview

- **Purpose**: Clarify the problem, target user, and solution hypothesis to define what you're building.
- **Agent/Skill**: `brainstorming` skill (Architectural path)
- **Model**: `capable`
- **Trigger**: Starting a new project with no existing codebase.
- **Inputs**:
  - `phase-1-kickoff.md` — user-filled project context at the project root (idea, target user, constraints, existing assets, steps to skip); fall back to conversational clarification if the file is absent or thin.
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

1. **Git repository initialization (first action in all of Phase 1):** Before any Q&A or file writes, confirm a git repository exists at the project root (`git rev-parse --git-dir`). If not, run `git init` immediately — this creates the baseline commit point for the single Phase 1 commit at closeout. Do not make any commits yet; the full Phase 1 commit happens at Phase 1 closeout (see `p1-08-scaffold.md`). Immediately after `git init` (or if a repo already exists but no `.gitignore` yet), create `.gitignore` at the project root and add `kit/` as the first entry — the kit folder is a development tool, not part of the application and must not be committed. If `.gitignore` already exists, append `kit/` only if it is not already present.
2. Always use the Architectural path — there is no existing codebase, so this step is never Bounded.
3. Draw inputs from `phase-1-kickoff.md` (project root) when present; fall back to conversational Q&A if the file is absent or thin.
4. Ask clarifying questions covering: what problem exists today, who experiences it, what existing alternatives people use, and what is explicitly out of scope. Stop there — do not continue into tech stack or architecture territory. **Print only the questions — do not include any draft document content alongside them.**
5. **Q&A must complete before writing the artifact.** The contract is: questions → answers → write file → user opens and reviews the file → approval. Do not print the idea-brief content in the terminal for review — write `docs/idea-brief.md` to disk first, then tell the user to open it and confirm. Writing before Q&A completes produces an idea-brief that reflects assumptions, not answers — and requires rework.
6. **After `docs/idea-brief.md` is written** (which creates the `docs/` folder), move `phase-1-kickoff.md` from the project root to `docs/phase-1-kickoff.md`. All Phase 1 documents, including the kickoff, live under `docs/`.
7. Do not invoke `writing-plans` at any point during this step.

## Artifact Rules

- **Artifact**: `docs/idea-brief.md`
- Fill `templates/01-idea-brief.md` with answers gathered during Q&A.
- Save the result to `docs/idea-brief.md`.
- **Status / approval condition**: Set `Status: approved` only after the user confirms the draft.

## Completion Criteria
The step is considered complete when:

- [ ] Git repository initialized at the project root.
- [ ] All clarifying questions have been answered by the user.
- [ ] The user has reviewed the draft idea brief.
- [ ] `docs/idea-brief.md` is written and marked `Status: approved`.
- [ ] `phase-1-kickoff.md` has been moved from project root to `docs/phase-1-kickoff.md`.
- [ ] The user has been presented with the Step 2 skip/proceed choice and a decision has been recorded in the session log.

## Transition Rules

### Before Advancing

- `docs/idea-brief.md` must exist and be marked `Status: approved`.
- `docs/phase-1-kickoff.md` must exist (moved from root).
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
