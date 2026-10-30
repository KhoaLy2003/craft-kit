# Phase 1 — Bootstrap

> **Run once per project, from raw idea to a ready-to-code codebase.**
> Existing project: start at `kit/phase-2.md` (run only "Model tiers" below if `docs/MODELS.md` is missing). No kit documents at all: `kit/phase-adopt.md` first. Missing documents this version expects (`docs/backlog.json`, `docs/data-model.md`, `docs/flows.md`): `kit/phase-upgrade.md` first. What to build next on a shipped product: `kit/phase-3-iterate.md`. Unsure: `kit/START.md` routes you.

Universal rules are in `kit/orchestrator-conventions.md` (every dispatch: rules 1–3). Session log: `docs/phase-1-session.md` (`kit/session-logging.md`).

## Skills and agents pre-flight

Run once, before Model tiers. Check each skill below is available (platform skill list, else try loading it by name). The kit falls back to the AI's general capability for a missing skill, except `design-taste-frontend` (required for visual-quality work) and `archify` (required for diagram rendering; see `kit/task-agent-rubric.md`, conventions rule 8). Install notes: the site page *What You Need*.

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
| 1 | Product Ideation *(kickoff `Mode: idea`)* or Requirements Intake *(kickoff `Mode: requirements`: reads the supplied BRD, PRD, SRS or tickets first and asks only about gaps and conflicts)* | `soft` | capable | `brainstorming` | `docs/idea-brief.md` | `kit/steps/phase-1/p1-01-ideation.md` |
| 2 | Market Research *(optional; runs if the kickoff says run, or if you answer "run" to the one question Step 1 asks when the kickoff is blank; in requirements mode a blank decision means skip)* | `soft` | fast | general-purpose agent | `docs/market-notes.md` | `kit/steps/phase-1/p1-02-market-research.md` |
| 3 | Prototype & Design | `hard` | balanced | general-purpose agent; orchestrator builds the HTML | `docs/prototype/`, `docs/DESIGN.md`, `docs/preview/` | `kit/steps/phase-1/p1-03-prototype-design.md` |
| 4 | Roadmap (also sets Phase 2 scope) | `hard` | balanced | general-purpose agent | `docs/roadmap.md`, `docs/backlog.json`, `docs/backlog.html` | `kit/steps/phase-1/p1-04-roadmap.md` |
| 5 | Full Screen Design *(skippable only when approved designs exist, or every feature has one simple screen already covered by `docs/preview/`)* | `hard` | balanced | orchestrator | `docs/specs/*/screens/`, `docs/designs/` | `kit/steps/phase-1/p1-05-screen-design.md` |
| 6 | Tech Stack, Architecture & Data | `hard` | capable | general-purpose agent | `docs/architecture.md`, `docs/data-model.md`, `docs/flows.md` | `kit/steps/phase-1/p1-06-architecture.md` |
| 7 | Constitution | `soft` | fast | general-purpose agent | `docs/constitution.md` | `kit/steps/phase-1/p1-07-constitution.md` |
| 8 | Scaffold | `none` | balanced | general-purpose agent | runnable codebase, `AGENTS.md`, one commit | `kit/steps/phase-1/p1-08-scaffold.md` |

## Phase 1 closeout

The single closeout checklist. Step 8 runs it; every item must pass before the Phase 1 commit and handoff.

- [ ] `docs/MODELS.md` is `approved`; `docs/phase-1-session.md` shows every step `complete` or `skipped`
- [ ] `docs/phase-1-kickoff.md`
- [ ] `docs/idea-brief.md` is `approved`
- [ ] `docs/market-notes.md` *(skip if Step 2 was skipped)*
- [ ] `docs/prototype/` (journey-map.md and prototype-brief.md, Definition of Done checked), `docs/DESIGN.md`, and `docs/preview/index.html` (the approved prototype)
- [ ] `docs/roadmap.md` is `approved`, `Phase 2 Scope` recorded; `docs/backlog.json` validates (all features `pending`) and `docs/backlog.html` is rendered
- [ ] `docs/specs/*/screens/*.md` and `docs/designs/` *(skip if Step 5 was skipped)*
- [ ] `docs/architecture.md`, `docs/data-model.md`, `docs/flows.md` and `docs/constitution.md` are `approved`
- [ ] Scaffold: every item in `kit/templates/08-scaffold-checklist.md` is checked; the app builds and runs; the smoke test passes
- [ ] `ENV_SETUP.md` at the project root, and `.env` valid with no placeholders and a clean start *(skip if no environment variables)*
- [ ] `docs/.craft-kit.json` written from `kit/templates/craft-kit.json` with `recorded_by: phase-1` and `kit_version` copied from `.craft-kit-version` in the installed kit directory (conventions rule 10)
- [ ] `AGENTS.md` at the project root with a meaningful project summary
- [ ] `kit/` and `.test-accounts.json` are in `.gitignore`, and `git log` shows the single Phase 1 commit capturing all of the above

## Phase handoff

After the closeout passes, **close this session and open a new one for Phase 2** (this one carries Phase 1 debate that raises cost and leaks stale reasoning). Emit this prompt with every bracket filled (scope from `Phase 2 Scope` in `docs/roadmap.md`, name from the kickoff); the user pastes it into a new session at the project root:

```
Read these files before starting:
- docs/architecture.md
- docs/data-model.md
- docs/flows.md
- docs/constitution.md
- docs/roadmap.md
- docs/backlog.json
- docs/MODELS.md
- kit/phase-2.md

Then run Phase 2 (scope: [all | feature]) for [project-name].
```

`kit/` is git-ignored, so a fresh clone lacks it. There, first reinstall with the pinned command `npx github:KhoaLy2003/craft-kit#v<kit_version>` (`<kit_version>` from `docs/.craft-kit.json`; substitute the real value in the prompt). `docs/` is committed and travels with the repo.

## Flow

```
Ideation → Market Research [optional, soft] → Prototype & Design [hard]
    → Roadmap [hard] → Full Screen Design [hard, skippable] → Architecture [hard]
    → Constitution [soft] → Scaffold → closeout checklist → one commit
                │
                ▼
Close Phase 1 session → Open new Phase 2 session
```

<div style="margin:24px 0;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.12);">
  <iframe src="/craft-kit/diagrams/phase-1-bootstrap.html?embed=1" width="100%" style="border:none;display:block;height:60vh;min-height:480px;" title="Phase 1 Bootstrap — interactive flow diagram"></iframe>
</div>
<p style="margin-top:8px;font-size:0.85em;color:var(--vp-c-text-2);">Pan and zoom to explore. <a href="/craft-kit/diagrams/phase-1-bootstrap.html" target="_blank" rel="noopener">Open full screen ↗</a></p>
