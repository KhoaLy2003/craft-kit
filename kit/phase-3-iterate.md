# Phase 3 — Iterate

> **Status:** experimental — not yet validated in a test round.
>
> **Use after a release has shipped, when new requirements arrive, or to improve the product on your own evidence or ideas.** It runs again for every new batch. Output: a new release in `docs/backlog.json`, a release block in `docs/roadmap.md`, and **one approved design for the whole wave** (data model, flows, architecture, screens, shared data points), split into work packages that Phase 2 builds, possibly in parallel (`kit/phase-2.md`, `scope: feature`). Phase 3 never writes feature code.
>
> Prerequisites: a shipped (or runnable) application; `docs/backlog.json`, `docs/roadmap.md`, `docs/constitution.md`, `docs/architecture.md`, `docs/data-model.md`, `docs/flows.md`, `docs/DESIGN.md`. A missing data-model or flows document: see "Docs preflight" in `kit/phase-2.md`.

Universal rules: `kit/orchestrator-conventions.md`. Session log: `docs/phase-3-session.md`, one section per release (`kit/session-logging.md`). Agree `<release-slug>` (e.g. `r2-growth`) before Step 1; it names `docs/iterations/<release-slug>/`.

**Resume and handover.** A session that finds the release's section in `docs/phase-3-session.md` with unfinished steps resumes per conventions rule 18; the release slug is the Unit. Seams: after any hard gate (rule 19, `kit/guides/session-handover.md`).

## Steps


| Step | Name | Gate | Model | Agent | Output | Step file |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Discover | soft | capable | `brainstorming` | `docs/iterations/<release-slug>/discover.md` | `kit/steps/phase-3/p3-01-discover.md` |
| 2 | Prioritise | hard | capable | orchestrator with the user | new release and features in `docs/backlog.json`; release block in `docs/roadmap.md` | `kit/steps/phase-3/p3-02-prioritise.md` |
| 3 | Design | hard | capable | orchestrator; general-purpose agents (one per document); Phase 1 Step 5 re-entry for screens | `docs/iterations/<release-slug>/design.md`; amended foundation documents; Shared Surface table and Amendment log in the release block | `kit/steps/phase-3/p3-03-design.md` |
| 4 | Handoff | soft | balanced | orchestrator | Work Packages table in the release block; design commit; Phase 2 prompts | `kit/steps/phase-3/p3-04-handoff.md` |
| 5 | Closeout | soft | balanced | orchestrator | outcome section in the release block; leftover features resolved | `kit/steps/phase-3/p3-05-closeout.md` |

Read only the step file you are running, with `kit/orchestrator-conventions.md`. Each step file is authoritative for its step.

## When to Use Phase 3


| Situation                                               | Use                                                                                                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Something shipped is broken                             | `kit/phase-bug-fix.md`                                                                                                                      |
| One shipped feature needs different behavior            | `kit/guides/evolving-specs.md`, then `kit/phase-2.md`                                                                                       |
| One known new feature that fits the architecture        | Direct path: add a `planned` release entry and the feature (`pending`, `release` set to that entry) to `docs/backlog.json`, run `node kit/scripts/render-backlog.js`, set Phase 2 Scope to `feature`, then `kit/phase-2.md`. Impact is not checked. |
| Need to decide **what** to build next                   | **This phase**                                                                                                                              |
| Core idea, audience, or stack has fundamentally changed | New project: `kit/phase-1-bootstrap.md`                                                                                                     |

---

## Change control — when scope changes after Step 2

When a feature is dropped, cancelled, or changed after the Prioritise gate (including mid-build), read and follow `kit/guides/change-control.md`.

---

## Output Checklist

- [ ] `docs/iterations/<release-slug>/discover.md` and `design.md`
- [ ] `docs/backlog.json` updated and rendered; `docs/roadmap.md`: approved release block with Impact, Shared Surface, Amendment log, Work Packages, and (after Closeout) Outcome section
- [ ] Foundation documents amended once, from the approved wave design, with every applied item logged against its feature
- [ ] `docs/phase-3-session.md` shows all five steps complete