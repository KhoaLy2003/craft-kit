# Phase 1 · Step 1 — Product Ideation

## Overview

- **Purpose**: Clarify the problem, target user, and solution hypothesis; in `requirements` mode, read the supplied requirements first (Requirements Intake) and ask only about gaps and conflicts.
- **Agent/Skill**: `brainstorming` skill (Architectural path)
- **Model**: `capable`
- **Trigger**: New project, no existing codebase. The kickoff's `Source Mode` is `idea` (default) or `requirements`.
- **Inputs**: the kickoff file `phase-1-kickoff.md` (project root or `docs/`; idea, target user, constraints, Source Mode, Market Research decision); in `requirements` mode also every listed source (`docs/requirements/` files or ticket IDs). Absent or thin: fall back to Q&A.
- **Outputs**: `docs/idea-brief.md`; the kickoff file moved to `docs/phase-1-kickoff.md`.
- **Template**: `templates/01-idea-brief.md`
- **Gate**: `soft` — summary after the written brief is reviewed; advance unless the user objects.

## Scope

- **In**: what problem exists today, who has it, what alternatives people use, what is out of scope.
- **Out**: tech stack, architecture, platform selection, data models (all Step 6); UI design (Step 3).

> Stop after the clarifying questions, once the problem, target user, and solution hypothesis can fill the brief; the Architectural path otherwise drifts to stacks and components. Do not invoke `writing-plans`.

## Execution Rules

1. **Git first.** Before any Q&A or file write, confirm a repo exists (`git rev-parse --git-dir`); if not, `git init`. Make no commits (Step 8 makes the only one). Apply conventions rule 9 (`.gitignore` with `kit/` and `.test-accounts.json`).
2. Ask only clarifying questions: problem today, who has it, existing alternatives, what is out of scope. Print only questions, no draft content.
3. Sequence: questions → answers → write `docs/idea-brief.md` → user reviews the file → approval.
4. If the user names a target platform, record it verbatim under Known Constraints as a preliminary signal. Platform is decided in Step 6.
5. After the brief is written, move `phase-1-kickoff.md` to `docs/phase-1-kickoff.md` (leave it if already there).
6. **Market Research decision.** Honour the kickoff's run/skip decision and state it in one line. If blank, ask once whether to run Step 2 (validates demand, finds competitive risks) or skip (evidence exists, or building for yourself). Log it. In `requirements` mode blank means `skip` (rule 7).
7. **Requirements mode.** If the kickoff says `Mode: requirements`, read every listed source before asking anything. Write `docs/idea-brief.md` with `Provenance: requirements`, a `Source Trace` (each statement mapped to source and location) and `Gaps and conflicts`. Ask only about those; never re-ask a stated fact. Market Research is `skip` unless the kickoff says `run`; log `skipped (requirements supplied)`.

## Artifact Rules

- Fill `templates/01-idea-brief.md` from the Q&A into `docs/idea-brief.md`; set `Status: approved` only after the user confirms the written file (rule 3).

## Completion Criteria

- [ ] Git repo and `.gitignore` entries in place (rule 9); questions answered (`requirements` mode: every `Gaps and conflicts` item resolved or listed under Open Questions).
- [ ] `docs/idea-brief.md` is `approved`: a problem users have today, a concrete target user, the solution as a hypothesis, explicit out-of-scope items. `requirements` mode: every statement is in `Source Trace`.
- [ ] Kickoff moved to `docs/phase-1-kickoff.md`; Step 2 run/skip decision recorded.

## Transition Rules

Next: Step 2 if run, otherwise Step 3 (record Step 2 as `skipped`).
