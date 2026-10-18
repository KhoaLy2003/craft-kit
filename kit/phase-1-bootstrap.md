# Phase 1 — Bootstrap

> **Run once per project, from raw idea to a ready-to-code codebase.**
> Existing project: skip this phase and start at `kit/phase-2.md` (run only "Model tiers" below if `docs/MODELS.md` is missing). If the project lacks documents this kit version expects (`docs/backlog.json`, `docs/data-model.md`, `docs/flows.md`), run `kit/phase-upgrade.md` first. To decide what to build next on a shipped product, use `kit/phase-3-iterate.md`.

Universal rules (step banner, gates, file verification, English-only, write-then-review) are in `kit/orchestrator-conventions.md`. In this phase, every subagent dispatch carries `PROJECT_ROOT` and, if it writes a file, the fail-fast write instruction; afterwards confirm each file exists on disk (conventions rules 1–3). Session log: `docs/phase-1-session.md` (`kit/session-logging.md`).

## Skills and agents pre-flight

Run once, before Model tiers. Check that each skill and agent below is available in this session (consult your platform's skill or agent list; if it has no list, try to load the skill by name). Skills and agents are per-tool add-ons: the kit uses them where they exist and falls back to the AI's general capability where they do not, except `design-taste-frontend`, which is required for visual-quality work, and `archify`, which is required for rendering diagrams (see `kit/task-agent-rubric.md` and `kit/orchestrator-conventions.md` rule 8). Where they live depends on your platform (often `.agents/` or a tool-specific skills folder, or a plugin). Full list and install notes: the site page *What You Need*.

| Needed in | Skills | Agent |
|---|---|---|
| Phase 1 | `brainstorming` (Step 1), `design-taste-frontend` (Step 3 prototype build), `archify` (Step 6 diagram render), `verification-before-completion` (every step) | none beyond the general-purpose agent |
| Phase 2 | `brainstorming`, `writing-plans`, `subagent-driven-development`, `dispatching-parallel-agents`, `using-git-worktrees`, `design-taste-frontend`, `archify` (diagram re-render after amendments), `requesting-code-review`, `finishing-a-development-branch`, `verification-before-completion` | `code-reviewer` (Step 4) |

If any skill or agent is missing: tell the user in one message which items are missing and name the step each one affects. Proceed with your closest built-in behavior for that step only after the user agrees; if they would rather install first, wait. Record what is missing and the user's decision in the session log. Phase 2 items may be checked again at the Phase 2 start.

## Model tiers

Resolve tiers once, before Step 1. If `docs/MODELS.md` exists with `Status: approved`, skip to step 4.

1. **Identify**: state your provider and every model available in this session, including alternatives the user can switch to (for example a faster or cheaper variant).
2. **Map** one model to each tier. Two or three tiers may share a model if only one is available.

   | Tier | Use for |
   |---|---|
   | `capable` | Your strongest model, where a wrong decision is expensive to reverse: Ideation, Architecture, Spec. |
   | `balanced` | Your standard workhorse: code generation, planning, analysis. Most of Phase 2. |
   | `fast` | Your cheapest or fastest: mechanical steps (Ship, git operations, routing). May equal `balanced`. |

3. **Write and confirm**: copy `kit/templates/MODELS.md` to `docs/MODELS.md` and fill in provider, today's date, and a model per tier; leave per-step overrides empty unless there is a reason. Read the file back in chat and ask *"This is how I have configured your models. Does it look right, or should I adjust a tier?"* Set `Status: approved` only after explicit confirmation.
4. **Copy the map into the log header**: whenever a session log is created (`docs/phase-1-session.md` here; each later phase creates its own), copy the tier → model map from `docs/MODELS.md` into its header, with any per-step override. Steps use the map from the log header and never re-read `docs/MODELS.md`.

Re-run (delete `docs/MODELS.md` and start fresh) when the provider or harness changes, the subscription adds models, or the cost/quality balance needs adjusting.

## Steps

Before each step, read its step file; it is authoritative for that step's inputs, outputs, and rules. Update the session log at each gate and at completion.

| Step | Name | Gate | Model | Agent | Output | Step file |
|---|---|---|---|---|---|---|
| 1 | Product Ideation | `soft` | capable | `brainstorming` | `docs/idea-brief.md` | `kit/steps/phase-1/p1-01-ideation.md` |
| 2 | Market Research *(optional; runs if the kickoff says run, or if you answer "run" to the one question Step 1 asks when the kickoff is blank)* | `soft` | fast | general-purpose agent | `docs/market-notes.md` | `kit/steps/phase-1/p1-02-market-research.md` |
| 3 | Prototype & Design | `hard` | balanced | general-purpose agent; orchestrator builds the HTML | `docs/prototype/`, `docs/DESIGN.md`, `docs/preview/` | `kit/steps/phase-1/p1-03-prototype-design.md` |
| 4 | Roadmap (also sets Phase 2 scope) | `hard` | balanced | general-purpose agent | `docs/roadmap.md`, `docs/backlog.json`, `docs/backlog.html` | `kit/steps/phase-1/p1-04-roadmap.md` |
| 5 | Full Screen Design *(skippable only when approved designs exist, or every feature has one simple screen already covered by `docs/preview/`)* | `hard` | balanced | orchestrator | `docs/specs/*/screens/`, `docs/designs/` | `kit/steps/phase-1/p1-05-screen-design.md` |
| 6 | Tech Stack, Architecture & Data | `hard` | capable | general-purpose agent | `docs/architecture.md`, `docs/data-model.md`, `docs/flows.md` | `kit/steps/phase-1/p1-06-architecture.md` |
| 7 | Constitution | `soft` | fast | general-purpose agent | `docs/constitution.md` | `kit/steps/phase-1/p1-07-constitution.md` |
| 8 | Scaffold | `none` | balanced | general-purpose agent | runnable codebase, `AGENTS.md`, one commit | `kit/steps/phase-1/p1-08-scaffold.md` |

## Phase 1 closeout

The single closeout checklist. Step 8 runs it; every item must pass before the Phase 1 commit and the handoff. Nothing else in the kit restates it.

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
- [ ] `AGENTS.md` at the project root with a meaningful project summary
- [ ] `kit/` and `.test-accounts.json` are in `.gitignore`, and `git log` shows the single Phase 1 commit capturing all of the above

## Phase handoff

After the closeout passes, **close this session and open a new one for Phase 2**. This session carries market-research debate, prototype feedback, and design discussion that Phase 2 does not need; carrying it forward raises per-message cost and lets stale Phase 1 reasoning leak in.

Before closing, emit this prompt to the user with every bracket filled: scope from `Phase 2 Scope` in `docs/roadmap.md`, project name from the kickoff file. The user copies it into a new session whose working directory is the project root:

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

The new session has no memory of Phase 1; these files are all it needs.

`kit/` is in `.gitignore`, so a fresh clone or a new machine does not have it. Before the handoff prompt works there, reinstall the kit in the project root (`npx github:KhoaLy2003/craft-kit`) so `kit/phase-2.md` exists. The `docs/` files are committed and travel with the repo.

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
