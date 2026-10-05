# Phase 1 · Step 1 — Product Ideation

## Overview

- **Purpose**: Clarify the problem, target user, and solution hypothesis.
- **Agent/Skill**: `brainstorming` skill (Architectural path)
- **Model**: `capable`
- **Trigger**: New project, no existing codebase.
- **Inputs**: `phase-1-kickoff.md` at the project root (idea, target user, constraints, Market Research run/skip decision). If absent or thin, fall back to conversational Q&A.
- **Outputs**: `docs/idea-brief.md`; the kickoff file moved to `docs/phase-1-kickoff.md`.
- **Template**: `templates/01-idea-brief.md`
- **Gate**: `none`

## Scope

- **In**: what problem exists today, who has it, what alternatives people use, what is out of scope.
- **Out**: tech stack, architecture, platform selection, data models (all Step 6); UI design (Step 3).

> The Architectural path drives toward stacks, data models, and components. Stop after the clarifying questions, as soon as the problem, target user, and solution hypothesis can fill the brief. Do not invoke `writing-plans`.

## Execution Rules

1. **Git first.** Before any Q&A or file write, confirm a repo exists (`git rev-parse --git-dir`); if not, `git init`. Make no commits: Phase 1 ends with a single commit (Step 8). Ensure `.gitignore` exists with `kit/` as an entry (the kit is a development tool, not application code); append it if missing.
2. Ask only clarifying questions: problem today, who has it, existing alternatives, what is out of scope. Print only the questions, never draft document content.
3. Sequence: questions → answers → write `docs/idea-brief.md` → user opens and reviews the file → approval. Writing before the answers produces a brief built on assumptions.
4. If the user names a target platform, record it verbatim under Known Constraints as a preliminary signal. Platform is decided in Step 6.
5. After the brief is written (this creates `docs/`), move `phase-1-kickoff.md` from the project root to `docs/phase-1-kickoff.md`.
6. **Market Research decision.** Honour the kickoff's "Market Research" run/skip decision and state it in one line. Only if the kickoff leaves it blank, ask once: *"Step 2 (Market Research) validates demand and finds competitive risks. Run it, or skip because you already have evidence or are building for yourself?"* Record the decision in the session log.

## Artifact Rules

- Fill `templates/01-idea-brief.md` from the Q&A and save as `docs/idea-brief.md`.
- Set `Status: approved` only after the user confirms the written file.

## Completion Criteria

- [ ] Git repository exists; `kit/` is in `.gitignore`.
- [ ] All clarifying questions answered.
- [ ] `docs/idea-brief.md` written and `Status: approved`. The problem is something users already have today (not hypothetical); at least one target user is concrete enough to picture; the solution stays a hypothesis; out-of-scope items are explicit.
- [ ] `phase-1-kickoff.md` moved to `docs/phase-1-kickoff.md`.
- [ ] Step 2 run/skip decision recorded.

## Transition Rules

Next: Step 2 if run, otherwise Step 3 (record Step 2 as `skipped`).
