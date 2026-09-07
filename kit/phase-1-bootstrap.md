# Phase 1 — Bootstrap

> **Run this once per project, from raw idea to a ready-to-code codebase.**
> On existing projects, skip this phase entirely and start directly at `phase-2-feature-dev.md`.

---

## Conventions

Read `kit/orchestrator-conventions.md` before starting any step — step banner format, time recording, PROJECT_ROOT requirement, file-write verification, gate summary protocol, and the fail-fast write instruction.

Read `kit/session-logging.md` for the Phase 1 session log schema and starter template.

---

## Steps

Before executing each step, read its step file. The step file is the authoritative source for that step's inputs, outputs, notes, and review instructions. Read `kit/phase-1-checklist.md` for the pre-step checklist (checklist section for the current step + Universal section at the top).

| # | Name | Gate | Step File |
|---|---|---|---|
| 1 | Product Ideation | `none` | `kit/steps/p1-01-ideation.md` |
| 2 | Market Research *(optional)* | `hard` | `kit/steps/p1-02-market-research.md` |
| 3 | Interactive Prototype | `none` | `kit/steps/p1-03-prototype.md` |
| 4 | Product Design | `hard` | `kit/steps/p1-04-design.md` |
| 5 | Roadmap Generation | `hard` | `kit/steps/p1-05-roadmap.md` |
| 6 | Tech Stack & Architecture | `hard` | `kit/steps/p1-06-architecture.md` |
| 7 | Constitution | `hard` | `kit/steps/p1-07-constitution.md` |
| 8 | Scaffold | `none` | `kit/steps/p1-08-scaffold.md` |

---

Before Phase 2 starts, verify all of these exist and are marked `approved`:

- [ ] `docs/idea-brief.md`
- [ ] `docs/market-notes.md` *(skip this check if Step 2 was skipped)*
- [ ] `docs/prototype/` (journey-map.md + prototype-brief.md + walkable HTML)
- [ ] `docs/DESIGN.md`
- [ ] `docs/roadmap.md` (all features `pending`)
- [ ] `docs/architecture.md`
- [ ] `docs/constitution.md`
- [ ] Scaffold: project builds and runs, smoke test passes

---

## Phase Handoff — Starting Phase 2 in a New Session

After the Phase 1 Output Checklist passes, **close this session** and open a new one for Phase 2.

**Why:** After 9 steps, this session carries a large context — market research deliberations, prototype feedback, design discussions — that is no longer relevant to Phase 2. Carrying it forward raises per-message cost and risks stale Phase 1 reasoning influencing Phase 2 decisions.

**How to start Phase 2:**
1. Open a new session with the working directory set to the project root.
2. Copy and paste the prompt below into the first message — fill in the two bracketed values, then send.

```
Read these four files before starting:
- docs/architecture.md
- docs/constitution.md
- docs/roadmap.md
- kit/phase-2-[single-pass OR feature-dev].md

Then run Phase 2 [single-pass OR standard loop] for [project-name].
```

> **Orchestrator note:** Before closing this session, emit this exact prompt to the user with the brackets already filled in — `single-pass` or `feature-dev` from `docs/roadmap.md` Phase 2 Track, and the project name from the kickoff file. The user should be able to copy it without editing anything.

The new session has no memory of Phase 1 deliberations — only the four files above matter from this point forward.

## Flow Diagram

```
Ideation → Market Research [optional, hard gate if run] → Prototype → Product Design [hard gate]
    → Roadmap [hard gate] → Architecture [hard gate] → Constitution [hard gate] → Scaffold
                                                                           │
                                                                           ▼
                                              Close Phase 1 session → Open new Phase 2 session
```
