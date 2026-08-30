# Phase 1 — Bootstrap

> **Run this once per project, from raw idea to a ready-to-code codebase.**
> On existing projects, skip this phase entirely and start directly at `phase-2-feature-dev.md`.

---

## How to Read This Document

Each step is documented with:
- **Agent/Skill** — what to invoke
- **Trigger** — what causes this step to start
- **Inputs** — context/files this step reads
- **Outputs** — file(s) this step produces; template shown where applicable
- **Gate** — `none` (auto-advance) / `soft` (advance with a summary shown) / `hard` (stop and wait for explicit human approval)
- **Notes** — special handling

---

## Step 1 — Product Ideation

- **Agent/Skill**: `brainstorming` skill (Architectural path)
- **Trigger**: Starting a new project with no existing codebase
- **Inputs**: User's raw idea or problem statement (conversational)
- **Outputs**: `idea-brief.md`
- **Template**: `templates/01-idea-brief.md`
- **Gate**: `none`
- **Notes**: Use the Architectural path — there is no existing codebase, so this is never Bounded. Focus clarifying questions on the problem and the audience; do not push toward implementation decisions yet. The brainstorming skill will explore the idea and produce a written output; stop before the skill's "Invoke writing-plans" terminal — this phase has its own sequence. Fill the template and mark Status as `approved` before advancing.

---

## Step 2 — Market Research for Inspiration

- **Agent/Skill**: `market-researcher` agent
- **Trigger**: `idea-brief.md` exists and is `approved`
- **Inputs**: `idea-brief.md`
- **Outputs**: `market-notes.md`
- **Template**: `templates/02-market-notes.md`
- **Gate**: `hard` — first checkpoint on whether the idea is worth pursuing
- **Notes**: Present findings neutrally — include competing products and reasons the idea might not work. The "Reasons This Might Not Work" section must not be skipped or tokenistic. Gate outcome is a three-way choice: proceed / pivot / stop. If the decision is to stop or pivot, the rest of Phase 1 does not run.

---

## Step 3 — Technical Research for Tech Stack

- **Agent/Skill**: `research-analyst` agent (broad landscape); `librarian` agent (specific library deep-dives, source-verified)
- **Trigger**: Step 2 gate approved
- **Inputs**: `idea-brief.md`, `market-notes.md`
- **Outputs**: `tech-options.md` — candidate options with tradeoffs; NOT a final decision
- **Template**: `templates/03-tech-options.md`
- **Gate**: `none`
- **Notes**: Explicitly exploratory — do not commit to a stack here. The final decision happens in Step 7, after prototype and roadmap exist. Surface at least 2–3 viable options with pros/cons. Dispatch `research-analyst` for the broad landscape first; if a specific library needs source-verified capability confirmation, dispatch `librarian` in parallel. The open questions in Section 4 of the template feed directly into Step 7 — do not skip them.

---

## Step 4 — Prototype Mock (HTML)

- **Agent/Skill**: `designer` agent (journey map and wireframes); `frontend-developer` agent (interactive HTML)
- **Trigger**: `tech-options.md` exists
- **Inputs**: `idea-brief.md`, `market-notes.md`
- **Outputs**: `prototype/` folder containing:
  - `journey-map.md` — one persona, one scenario, end-to-end journey
  - `prototype-brief.md` — what the prototype covers, what's faked
  - Wireframe image/HTML files (screens in journey order)
  - Playable HTML prototype (no real backend)
- **Templates**: `templates/04a-journey-map.md`, `templates/04b-prototype-brief.md`
- **Gate**: `none`
- **Notes**: Dispatch `designer` first for the journey map and wireframes. Once those are approved, dispatch `frontend-developer` to wire them into a clickable HTML prototype. Prioritize interactive fidelity over visual polish. Fake/hardcoded parts must be explicitly marked in `prototype-brief.md` — not left ambiguous.

---

## Step 5 — Product Design

- **Agent/Skill**: `designer` agent
- **Trigger**: `prototype/` folder exists and prototype is walkable
- **Inputs**: `prototype/`, `idea-brief.md`
- **Outputs**: `design-system.md` + finalized mock screens
- **Template**: `templates/05-design-system.md`
- **Gate**: `hard` — last checkpoint before scope and technical direction are locked in
- **Notes**: Changing direction after this point is significantly more expensive. All design tokens must be named semantically (e.g. `color-primary`, not `blue-500`). Every component in `design-system.md` must trace back to something used in the prototype — no speculative additions. The finalized mock reference section must point to actual files.

---

## Step 6 — Roadmap Generation

- **Agent/Skill**: `task` agent (drafts); human provides final product-scope decisions
- **Trigger**: Step 5 gate approved
- **Inputs**: `idea-brief.md`, `market-notes.md`, `prototype/`, `design-system.md`
- **Outputs**: `roadmap.md` — MoSCoW-prioritized feature list, build order, deferred features
- **Template**: `templates/06-roadmap.md`
- **Gate**: `hard` — product-scope decision requiring human call
- **Notes**: This is a product decision, not a technical one. The `task` agent drafts based on inputs; the human decides priority and cut/keep calls. All features start with Status `pending` — the orchestrator updates this as Phase 2 runs. Build order accounts for dependencies, not just priority. Deferred features must be captured, not silently dropped.

---

## Step 7 — Tech Stack and Architecture Decision

- **Agent/Skill**: `research-analyst` agent (writes the document); human approves the decision
- **Trigger**: Step 6 gate approved
- **Inputs**: `tech-options.md`, `design-system.md`, `roadmap.md`
- **Outputs**: `architecture.md` — final stack choice, high-level architecture, reasoning tied to roadmap complexity
- **Template**: `templates/07-architecture.md`
- **Gate**: `none` (human review is embedded in the agent process; document marked `approved` when human signs off)
- **Notes**: The decision must explicitly reference why the roadmap's scope/complexity justifies the choice. The "Complexity deliberately avoided for MVP scope" section is required — name what was deliberately NOT adopted. Consult the open questions from `tech-options.md` Section 4 here.

---

## Step 8 — Constitution / AI Working Guideline

- **Agent/Skill**: `task` agent
- **Trigger**: `architecture.md` exists and is `approved`
- **Inputs**: `architecture.md`, `design-system.md`, `roadmap.md`
- **Outputs**: `constitution.md` (or `CLAUDE.md` / `AGENTS.md`)
- **Template**: `templates/08-constitution.md`
- **Gate**: `hard` — every Phase 2 step runs under this document's authority
- **Notes**: Every principle must be concrete enough to change at least one downstream decision — reject any principle that wouldn't alter a plan or diff if removed. Do not include personal workflow preferences; this file contains only rules that shape code and architecture output. The Amendment Procedure in the template must be filled in — governance without a change process creates a frozen document no one can update.

---

## Step 9 — Scaffold and Convention Setup

- **Agent/Skill**: `task` agent (general); `frontend-developer` agent (if stack is primarily frontend)
- **Trigger**: Step 8 gate approved
- **Inputs**: `architecture.md`, `constitution.md`
- **Outputs**: Initialized, runnable codebase — repository structure, linter/formatter, test framework, basic CI, README
- **Template**: `templates/09-scaffold-checklist.md` (use as the completion checklist, not just reference — check items off as the agent completes them)
- **Gate**: `none` (the checklist's Phase 1 Closeout section serves as the gate)
- **Notes**: End state: a project that builds and runs with zero features implemented. A "hello world" level smoke test must pass before Phase 1 is closed. Every item in the scaffold checklist must be checked. After this step, Phase 2 can begin — the orchestrator reads `roadmap.md` and selects the first `pending` feature in build order.

---

## Phase 1 Output Checklist

Before Phase 2 starts, verify all of these exist and are marked `approved`:

- [ ] `idea-brief.md`
- [ ] `market-notes.md`
- [ ] `tech-options.md`
- [ ] `prototype/` (journey-map.md + prototype-brief.md + walkable HTML)
- [ ] `design-system.md`
- [ ] `roadmap.md` (all features `pending`)
- [ ] `architecture.md`
- [ ] `constitution.md`
- [ ] Scaffold: project builds and runs, smoke test passes

---

## Flow Diagram

```
Ideation → Market Research [hard gate] → Tech Research → Prototype Mock → Product Design [hard gate]
    → Roadmap [hard gate] → Architecture → Constitution [hard gate] → Scaffold
                                                                           │
                                                                           ▼
                                                              Phase 2 begins (feature-dev)
```
