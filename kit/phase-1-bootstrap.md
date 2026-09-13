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


| #   | Name                          | Description | Gate   | Step File                            |
| --- | ----------------------------- | ----------- | ------ | ------------------------------------ |
| 1   | Product Ideation              | Clarify the problem, target user, and solution hypothesis. Define what you're building. | `none` | `kit/steps/phase-1/p1-01-ideation.md`        |
| 2   | Market Research *(optional)*  | Validate market demand and identify competitive risks before committing to development. | `hard` | `kit/steps/phase-1/p1-02-market-research.md` |
| 3   | Interactive Prototype         | Build a working prototype to test UX assumptions and validate core user interactions. | `hard` | `kit/steps/phase-1/p1-03-prototype.md`       |
| 4   | Product Design                | Create a design system with visual language, components, and UI patterns for the product. | `hard` | `kit/steps/phase-1/p1-04-design.md`          |
| 5   | Roadmap Generation            | Prioritize features into Must/Should/Nice-to-Have and determine the development build order. | `hard` | `kit/steps/phase-1/p1-05-roadmap.md`         |
| 6   | Tech Stack &amp; Architecture | Evaluate technology options and document the system architecture for Phase 2 implementation. | `hard` | `kit/steps/phase-1/p1-06-architecture.md`    |
| 7   | Constitution                  | Establish coding standards, architectural rules, and non-negotiable principles for the project. | `hard` | `kit/steps/phase-1/p1-07-constitution.md`    |
| 8   | Scaffold                      | Generate initial project structure, build setup, and verify the development environment works. | `none` | `kit/steps/phase-1/p1-08-scaffold.md`        |


---

Before Phase 2 starts, verify all of these exist and are marked `approved`:

- [ ] `docs/phase-1-kickoff.md` *(moved from project root after docs/ was created in Step 1)*
- [ ] `docs/idea-brief.md`
- [ ] `docs/market-notes.md` *(skip this check if Step 2 was skipped)*
- [ ] `docs/prototype/` (journey-map.md + prototype-brief.md + walkable HTML)
- [ ] `docs/DESIGN.md`
- [ ] `docs/roadmap.md` (all features `pending`)
- [ ] `docs/architecture.md`
- [ ] `docs/constitution.md`
- [ ] Scaffold: project builds and runs, smoke test passes
- [ ] `AGENTS.md` at project root
- [ ] Single Phase 1 commit in `git log` — all of the above captured in one commit
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

<div style="margin:24px 0;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.12);">
  <iframe src="/craft-kit/diagrams/phase-1-bootstrap.html?embed=1" width="100%" style="border:none;display:block;height:60vh;min-height:480px;" title="Phase 1 Bootstrap — interactive flow diagram"></iframe>
</div>
<p style="margin-top:8px;font-size:0.85em;color:var(--vp-c-text-2);">Pan and zoom to explore. <a href="/craft-kit/diagrams/phase-1-bootstrap.html" target="_blank" rel="noopener">Open full screen ↗</a></p>

