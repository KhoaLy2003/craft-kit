# Phase 1 — Bootstrap

> **Run once per project, from raw idea to a ready-to-code codebase.**
> Existing project: start at `kit/phase-2.md` (run only "Model tiers" below if `docs/MODELS.md` is missing). No kit documents at all: `kit/phase-adopt.md` first. Missing documents this version expects (`docs/backlog.json`, `docs/data-model.md`, `docs/flows.md`): `kit/phase-upgrade.md` first. Add a feature or fix a bug on a shipped product: `kit/phase-maintenance.md`. Unsure: `kit/START.md` routes you.

Universal rules are in `kit/orchestrator-conventions.md` (every dispatch: rules 1–3). Session log: `docs/phase-1-session.md` (`kit/session-logging.md`).

**Resume and handover.** A new session on a project whose `docs/phase-1-session.md` has unfinished steps resumes per conventions rule 18 (`kit/START.md` prints the prompt); skip nothing the log marks `complete`. Seams: any step whose hard gate has just cleared (rule 19, `kit/guides/session-handover.md`; Phase 1 documents stay uncommitted until Step 8, so keep the same checkout).

## Skills and agents pre-flight

Run once, before Model tiers. Check each skill below is available (platform skill list, else try loading it by name). The kit falls back to the AI's general capability for a missing skill, except `design-taste-frontend` (required for visual-quality work) and `archify` (required for diagram rendering; see `kit/task-agent-rubric.md`, `kit/guides/diagrams.md`). Install notes: the site page *Skills & Agents*.

| Needed in | Skills | Agent |
|---|---|---|
| Phase 1 | `brainstorming` (Step 1), `design-taste-frontend` (Step 3 prototype build), `archify` (Step 6 diagram render), `verification-before-completion` (every step) | none beyond the general-purpose agent |
| Phase 2 | `brainstorming`, `writing-plans`, `subagent-driven-development`, `dispatching-parallel-agents`, `using-git-worktrees`, `design-taste-frontend`, `archify` (diagram re-render after amendments), `requesting-code-review`, `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization` (Step 4), `finishing-a-development-branch`, `verification-before-completion` | none beyond the general-purpose agent |

If any is missing: tell the user in one message which items and which step each affects. Use the closest built-in behavior only after the user agrees (else wait). Record the decision in the session log. Phase 2 items may be re-checked at its start.

## Model tiers

Resolve once, before Step 1. If `docs/MODELS.md` is `Status: approved`, skip to step 4.

1. **Identify**: state your provider and every model available, including ones the user can switch to.
2. **Map** one model to each tier. Two or three tiers may share a model if only one is available.

   | Tier | Use for |
   |---|---|
   | `capable` | Your strongest model, where a wrong decision is expensive to reverse: Ideation, Architecture, Spec. |
   | `balanced` | Your standard workhorse: code generation, planning, analysis. Most of Phase 2. |
   | `fast` | Your cheapest or fastest: mechanical steps (Ship, git operations, routing). May equal `balanced`. |

3. **Write and confirm**: copy `kit/templates/MODELS.md` to `docs/MODELS.md`, fill in provider, date, and a model per tier (overrides only with a reason), read it back in chat, and ask whether it looks right. Set `Status: approved` only after explicit confirmation.
4. **Copy the map into the log header** of every session log you create (conventions → Model tiers).

Re-run (delete `docs/MODELS.md`) when the provider, harness, or available models change.

## Steps

Read each step's file before running it; it is authoritative.

| Step | Name | Gate | Model | Agent | Output | Step file |
|---|---|---|---|---|---|---|
| 1 | Product Ideation: intake of whatever the user supplied (any documents or the optional kickoff form; none needs a template or a mode), asks only about gaps and conflicts; also fixes the Product Shape and the Process Plan | `hard` | capable | `brainstorming` | `docs/idea-brief.md` | `kit/steps/phase-1/p1-01-ideation.md` |
| 2 | Market Research *(optional; runs if any source or the kickoff says run, or if you answer "run" to the one question Step 1 asks when none says; blank with sources supplied means skip)* | `soft` | fast | general-purpose agent | `docs/market-notes.md` | `kit/steps/phase-1/p1-02-market-research.md` |
| 3 | Prototype & Design *(flow validation always runs; the `DESIGN.md` and HTML preview half is skipped when `Visual interface: no`)* | `hard` | balanced | general-purpose agent; orchestrator builds the HTML | `docs/prototype/`, `docs/DESIGN.md`, `docs/preview/` | `kit/steps/phase-1/p1-03-prototype-design.md` |
| 4 | Roadmap (also sets Phase 2 scope) | `hard` | balanced | general-purpose agent | `docs/roadmap.md`, `docs/backlog.json`, `docs/backlog.html` | `kit/steps/phase-1/p1-04-roadmap.md` |
| 5 | Full Screen Design *(skipped when `Visual interface: no`; otherwise skippable only when approved designs exist, or every feature has one simple screen already covered by `docs/preview/`)* | `hard` | balanced | orchestrator | `docs/specs/*/screens/`, `docs/designs/` | `kit/steps/phase-1/p1-05-screen-design.md` |
| 6 | Tech Stack, Architecture & Data | `hard` | capable | general-purpose agent | `docs/architecture.md`, `docs/data-model.md`, `docs/flows.md` | `kit/steps/phase-1/p1-06-architecture.md` |
| 7 | Constitution | `soft` | fast | general-purpose agent | `docs/constitution.md` | `kit/steps/phase-1/p1-07-constitution.md` |
| 8 | Scaffold | `none` | balanced | general-purpose agent | runnable codebase, `AGENTS.md`, one commit | `kit/steps/phase-1/p1-08-scaffold.md` |

**Process Plan.** Step 1 approves, in `docs/idea-brief.md`, a `keep` / `skip` / `adapt` row for every Step 2–8, derived from each step file's `Skip when` line and the Product Shape. Steps 4, 6, 7 and 8 are never skipped. A skipped step is logged `skipped (plan: <reason>)` in `docs/phase-1-session.md`, and its Gate is waived with it; never skip a step the plan keeps. Step 6 chooses the stack within the Product Shape.

## Closeout and handoff

Step 8 (`p1-08-scaffold.md`) holds the single closeout checklist and the Phase 2 handoff prompt.

## Flow

```
Ideation + Product Shape + Process Plan [hard] → Market Research [optional, soft]
    → Prototype & Design [hard; flow half only when no visual interface]
    → Roadmap [hard] → Full Screen Design [hard, skippable] → Architecture [hard]
    → Constitution [soft] → Scaffold → closeout checklist → one commit
                │
                ▼
Close Phase 1 session → Open new Phase 2 session
```
