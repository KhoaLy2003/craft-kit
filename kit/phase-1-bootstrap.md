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
- **Review** *(only on steps whose output requires an action to access)* — how to open or run the output before approving the gate

## Orchestrator Announcement Convention

At the start of every step, the orchestrating agent MUST:
1. Emit a step banner before doing any work
2. Record the wall-clock start time and current `budget.spent()` value — get the time by running `new Date().toLocaleTimeString()` via `eval(js)` at the exact moment the step starts; do not estimate or leave as `—`
3. Include `PROJECT_ROOT: <absolute path to project folder>` in the context of every dispatched subagent task — subagents resolve file paths relative to the workspace root, not the project folder, and will write outputs to the wrong location without an explicit path
4. After every subagent task that writes files, verify the file exists at the expected path before marking the step `complete` in the session log. If the file is absent, recover content from `agent://<id>` and write it directly — do not trust the agent's reported status alone

```
---
Phase 1 · Step N — [Step Name]
Skill / Agent: [name]  |  Gate: [none / soft / hard]
Started: HH:MM  |  Credits at start: NNNN
---
```

At the end of every step, update `phase-1-session.md` with duration and credit delta before advancing.

## Session Log

The orchestrator maintains a `phase-1-session.md` file at the project root throughout the run. It is created at the start of Step 1 and updated at the end of each step.

```markdown
# Phase 1 Session Log — [project-name]

| Step | Name | Skill / Agent | Status | Started | Duration | Credits | Output |
|---|---|---|---|---|---|---|---|
| 1 | Product Ideation | `brainstorming` (Architectural) | complete | 09:15 | 25 min | 340 | `docs/idea-brief.md` |
| 2 | Market Research | `market-researcher` | complete | 09:40 | 6 min | 820 | `docs/market-notes.md` |
| 3 | Tech Research | `research-analyst` + `librarian` | in progress | 09:46 | — | — | — |
...
```

- **Started** — local wall-clock time at step start (HH:MM)
- **Duration** — wall-clock minutes from step start to log update
- **Credits** — `budget.spent()` delta between step start and end (OMP credits; check dashboard for USD equivalent)
- **Output** — file produced; `—` if step is not yet complete

Status values: `pending` · `in progress` · `complete` · `skipped` · `blocked`

The session log is the user's single source of truth for what ran, how long it took, and what it cost. It does not replace the gate outputs — it points to them.
---

## Step 1 — Product Ideation

- **Agent/Skill**: `brainstorming` skill (Architectural path)
- **Trigger**: Starting a new project with no existing codebase
- **Inputs**: `phase-1-kickoff.md` (user-filled project context — idea, target user, constraints, existing assets, steps to skip); fall back to conversational clarification if the kickoff file is absent or thin
- **Outputs**: `docs/idea-brief.md`
- **Template**: `templates/01-idea-brief.md`
- **Gate**: `none`
- **Notes**:
  - Use the Architectural path — there is no existing codebase, so this is never Bounded.
  - **Scope boundary (critical):** The brainstorming skill's Architectural path naturally drives toward tech stack options, data models, and component design. Do NOT follow it there in Step 1. Stop the skill after the clarifying questions phase — as soon as the problem statement, target user, and solution hypothesis are clear enough to fill `idea-brief.md`. Tech stack belongs to Step 3. Architecture belongs to Step 7. Component and UI design belongs to Step 5. Entering those areas in Step 1 front-loads decisions that later steps exist to make deliberately, and makes those steps redundant.
  - Clarifying questions in Step 1 should cover: what problem exists today, who experiences it, what existing alternatives people use, and what's explicitly out of scope. Stop there.
  - Fill `templates/01-idea-brief.md`, save the output to `docs/idea-brief.md`, and mark Status as `approved` before advancing. Do not invoke `writing-plans`.

---

## Step 2 — Market Research for Inspiration

- **Agent/Skill**: `market-researcher` agent
- **Trigger**: `docs/idea-brief.md` exists and is `approved`
- **Inputs**: `docs/idea-brief.md`
- **Outputs**: `docs/market-notes.md`
- **Template**: `templates/02-market-notes.md`
- **Gate**: `hard` — first checkpoint on whether the idea is worth pursuing
- **Notes**: Present findings neutrally — include competing products and reasons the idea might not work. The "Reasons This Might Not Work" section must not be skipped or tokenistic. Gate outcome is a three-way choice: proceed / pivot / stop. If the decision is to stop or pivot, the rest of Phase 1 does not run.

---

## Step 3 — Technical Research for Tech Stack

- **Agent/Skill**: `research-analyst` agent (broad landscape); `librarian` agent (specific library deep-dives, source-verified)
- **Trigger**: Step 2 gate approved
- **Inputs**: `docs/idea-brief.md`, `docs/market-notes.md`
- **Outputs**: `docs/tech-options.md` — candidate options with tradeoffs; NOT a final decision
- **Template**: `templates/03-tech-options.md`
- **Gate**: `none`
- **Notes**: Explicitly exploratory — do not commit to a stack here. The final decision happens in Step 7, after prototype and roadmap exist. Surface at least 2–3 viable options with pros/cons. Dispatch `research-analyst` for the broad landscape first; if a specific library needs source-verified capability confirmation, dispatch `librarian` in parallel. The open questions in Section 4 of the template feed directly into Step 7 — do not skip them.

---

## Step 4 — Prototype Mock (HTML)

- **Agent/Skill**: `designer` agent (journey map and wireframes); `frontend-developer` agent (interactive HTML)
- **Trigger**: `docs/tech-options.md` exists
- **Inputs**: `docs/idea-brief.md`, `docs/market-notes.md`
- **Outputs**: `docs/prototype/` folder containing:
  - `docs/prototype/journey-map.md` — one persona, one scenario, end-to-end journey
  - `docs/prototype/prototype-brief.md` — what the prototype covers, what's faked
  - Wireframe image/HTML files (screens in journey order)
  - Playable HTML prototype (no real backend)
- **Templates**: `templates/04a-journey-map.md`, `templates/04b-prototype-brief.md`
- **Gate**: `none`
- **Review**: Open `docs/prototype/index.html` in any browser (no server needed — works as `file://`). Walk the flow described in `docs/prototype/journey-map.md` Section 4: empty state → add an item → filter the list → edit an item → switch tabs. The prototype is ready to advance when every screen in the flow is reachable by clicking.
- **Notes**: Dispatch `designer` first for the journey map and wireframes. Once those are approved, dispatch `frontend-developer` to wire them into a clickable HTML prototype. Prioritize interactive fidelity over visual polish. Fake/hardcoded parts must be explicitly marked in `docs/prototype/prototype-brief.md` — not left ambiguous.

---

## Step 5 — Product Design

- **Agent/Skill**: `designer` agent (AI path only — skip if importing an existing `DESIGN.md`)
- **Trigger**: `docs/prototype/` folder exists and prototype is walkable
- **Inputs**:
  - Always: `docs/prototype/`, `docs/idea-brief.md`
  - Import path only: user-provided `DESIGN.md` (e.g. `samples/DESIGN.md` or equivalent)
- **Outputs**: `docs/design-system.md` + finalized mock screens inside `docs/prototype/`
- **Template**: `templates/05-design-system.md`
- **Gate**: `hard` — last checkpoint before scope and technical direction are locked in
- **Notes**:
  - **Import path**: If the user provides a `DESIGN.md`, skip the `designer` agent session. Read the imported file, extract and normalize its content into `design-system.md` using the Import Path extraction checklist in the template. Reconcile every component against `prototype/` — remove anything not present in the prototype. Set `Source: imported` in Metadata.
  - **AI path**: If no `DESIGN.md` is provided, dispatch the `designer` agent as normal to produce tokens, components, and finalized mocks from the prototype. Set `Source: ai-generated` in Metadata.
  - In both cases: tokens must be named semantically (`color-primary`, not `blue-500` or a brand name). Every component must trace back to the prototype. The Known Gaps section must not be left empty. The finalized mock reference must point to actual files.
  - Changing direction after this gate is significantly more expensive — the hard gate exists to enforce this.

---

## Step 6 — Roadmap Generation

- **Agent/Skill**: `task` agent (drafts); human provides final product-scope decisions
- **Trigger**: Step 5 gate approved
- **Inputs**: `docs/idea-brief.md`, `docs/market-notes.md`, `docs/prototype/`, `docs/design-system.md`
- **Outputs**: `docs/roadmap.md` — MoSCoW-prioritized feature list, build order, deferred features
- **Template**: `templates/06-roadmap.md`
- **Gate**: `hard` — product-scope decision requiring human call
- **Notes**:
  - This is a product decision, not a technical one. The `task` agent drafts based on inputs; the human decides priority and cut/keep calls. All features start with Status `pending` — the orchestrator updates this as Phase 2 runs. Build order accounts for dependencies, not just priority. Deferred features must be captured, not silently dropped.
  - **Phase 2 track decision (made at this gate, not before):** Once the roadmap is approved, the orchestrator evaluates the feature list and recommends a Phase 2 track. Record the decision in `docs/roadmap.md` under `Phase 2 Track`. The criteria:

    | Criterion | Single-pass (`phase-2-single-pass.md`) | Standard loop (`phase-2-feature-dev.md`) |
    |---|---|---|
    | Must feature count | ≤ 15 | Any |
    | Feature sizes | All S or M | Any L present |
    | Domains | One primary domain | Multiple domains |
    | Dependency structure | Tight chain — each feature builds on the previous | Independent parallel streams |
    | Developer | Solo | Team |

    If all five criteria point to single-pass, recommend it. Any one criterion pointing to the standard loop overrides the rest — recommend standard. The human confirms the recommendation; it is not applied automatically.

---

## Step 7 — Tech Stack and Architecture Decision

- **Agent/Skill**: `research-analyst` agent (writes the document); human approves the decision
- **Trigger**: Step 6 gate approved
- **Inputs**: `docs/tech-options.md`, `docs/design-system.md`, `docs/roadmap.md`
- **Outputs**: `docs/architecture.md` — final stack choice, high-level architecture, reasoning tied to roadmap complexity
- **Template**: `templates/07-architecture.md`
- **Gate**: `none` (human review is embedded in the agent process; document marked `approved` when human signs off)
- **Notes**: The decision must explicitly reference why the roadmap's scope/complexity justifies the choice. The "Complexity deliberately avoided for MVP scope" section is required — name what was deliberately NOT adopted. Consult the open questions from `docs/tech-options.md` Section 5 here.

---

## Step 8 — Constitution / AI Working Guideline

- **Agent/Skill**: `task` agent
- **Trigger**: `docs/architecture.md` exists and is `approved`
- **Inputs**: `docs/architecture.md`, `docs/design-system.md`, `docs/roadmap.md`
- **Outputs**: `docs/constitution.md` (or `CLAUDE.md` / `AGENTS.md` at project root if required by the agent harness)
- **Template**: `templates/08-constitution.md`
- **Gate**: `hard` — every Phase 2 step runs under this document's authority
- **Notes**: Every principle must be concrete enough to change at least one downstream decision — reject any principle that wouldn't alter a plan or diff if removed. Do not include personal workflow preferences; this file contains only rules that shape code and architecture output. The Amendment Procedure in the template must be filled in — governance without a change process creates a frozen document no one can update.

---

## Step 9 — Scaffold and Convention Setup

- **Agent/Skill**: `task` agent (general); `frontend-developer` agent (if stack is primarily frontend)
- **Trigger**: Step 8 gate approved
- **Inputs**: `docs/architecture.md`, `docs/constitution.md`
- **Outputs**: Initialized, runnable codebase — repository structure, linter/formatter, test framework, basic CI, README
- **Template**: `templates/09-scaffold-checklist.md` (use as the completion checklist, not just reference — check items off as the agent completes them)
- **Gate**: `none` (the checklist's Phase 1 Closeout section serves as the gate)
- **Review**: Run the project's start command as documented in the generated `README.md`. Confirm the app launches with no errors and the smoke test passes. If the stack uses a dev server (e.g. `vite dev`, `npm run dev`), the browser should open to a working "hello world" state. If it's a static site, open `index.html` directly. A scaffold that cannot be started is not complete — do not close Phase 1 until this runs.
  - **Windows note**: `npm` and `npx` are `.cmd` wrappers and cannot be launched via `hub start` directly. Use `hub start` with `application: "node"` and `args: ["node_modules/vite/bin/vite.js"]` for Vite-based projects. On macOS/Linux, `npm run dev` works directly.
- **Notes**: Before running the scaffold agent, confirm a git repository exists at the project root (`git rev-parse --git-dir` returns successfully). If not, run `git init` and make an initial empty commit (`git commit --allow-empty -m "chore: init"`) before the agent starts — Phase 2 branch creation depends on a git repo being present. End state: a project that builds and runs with zero features implemented. A "hello world" level smoke test must pass before Phase 1 is closed. Every item in the scaffold checklist must be checked. After this step, Phase 2 can begin — the orchestrator reads `docs/roadmap.md` and selects the first `pending` feature in build order.

---

## Phase 1 Output Checklist

Before Phase 2 starts, verify all of these exist and are marked `approved`:

- [ ] `docs/idea-brief.md`
- [ ] `docs/market-notes.md`
- [ ] `docs/tech-options.md`
- [ ] `docs/prototype/` (journey-map.md + prototype-brief.md + walkable HTML)
- [ ] `docs/design-system.md`
- [ ] `docs/roadmap.md` (all features `pending`)
- [ ] `docs/architecture.md`
- [ ] `docs/constitution.md`
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
