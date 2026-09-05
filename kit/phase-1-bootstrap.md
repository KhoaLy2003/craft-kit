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

> **Before starting any step, read `kit/phase-1-checklist.md` — the section for that step plus the Universal section at the top. The checklist is the authoritative pre-step reference; the step notes below provide detail and context.**

At the start of every step, the orchestrating agent MUST:
1. Emit a step banner before doing any work
2. Record the wall-clock start time and current `budget.spent()` value — get the time by running `new Date().toLocaleTimeString()` via `eval(js)` at the exact moment the step starts; do not estimate or leave as `—`
3. Include `PROJECT_ROOT: <absolute path to project folder>` in the context of every dispatched subagent task — subagents resolve file paths relative to the workspace root, not the project folder, and will write outputs to the wrong location without an explicit path
4. After every subagent task that writes files, verify the file exists at the expected path before marking the step `complete` in the session log. If the file is absent, recover content from `agent://<id>` and write it directly — do not trust the agent's reported status alone
5. At every `hard` gate, before waiting for human approval, emit a one-sentence **Gate Summary** — the most important thing the human needs to know about what they're reviewing. Format: `> **Gate:** [one sentence]`. This gives non-technical users a clear decision point without requiring them to read the full artifact first.
6. **Fail-fast write instruction (include verbatim in every subagent dispatch that produces a file):** *"If any file write fails on the first attempt, stop immediately. Do not try alternative write methods (REPL, base64, PowerShell, hub start, etc.). Yield the complete file content as your final result and notify the orchestrator via `hub`. The orchestrator handles file recovery from `agent://`."* This prevents subagents from spending 20+ minutes on write-retry spirals.

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
  - **After Step 1 completes, before advancing:** present the user with a choice — *"Step 2 (Market Research) validates demand and finds competitive risks. Recommended if you haven't externally validated this idea yet. Skip it only if you already have evidence or are building for yourself. Proceed with Step 2 or skip to Step 3?"* Record the decision in the session log (`complete` or `skipped`). **This choice is required even if the kickoff says "run all steps."** The kickoff controls which steps are skippable; it does not replace per-step gate conversations. The only exception: if the kickoff explicitly pre-answers this specific question (e.g. "proceed with Step 2"), the orchestrator may advance — but must still surface that decision in chat before dispatching.

---

## Step 2 — Market Research *(optional)*

- **Agent/Skill**: `market-researcher` agent
- **Optional**: yes — see Step 1 Notes for when to skip
- **Trigger**: User chooses to run this step after Step 1 completes
- **Inputs**: `docs/idea-brief.md`
- **Outputs**: `docs/market-notes.md`
- **Template**: `templates/02-market-notes.md`
- **Gate**: `hard` — first checkpoint on whether the idea is worth pursuing
- **Gate Summary**: *"Market research is done. The main finding is [one sentence from the Conclusions section]. This is your proceed / pivot / stop decision."*
- **Notes**:
  - Present findings neutrally — include competing products and reasons the idea might not work. The "Reasons This Might Not Work" section must not be skipped or tokenistic.
  - Gate outcome is a three-way choice: proceed / pivot / stop. If the decision is to stop or pivot, the rest of Phase 1 does not run.
  - **Model:** this step is read-heavy synthesis, not implementation judgment — a lighter/faster model is appropriate for the `market-researcher` dispatch.
  - If Step 2 is skipped: mark as `skipped` in the session log and advance to Step 3. Downstream steps that list `docs/market-notes.md` as an input proceed without it.

---

## Step 3 — Technical Research for Tech Stack

- **Agent/Skill**: `research-analyst` agent (broad landscape); `librarian` agent (specific library deep-dives, source-verified)
- **Trigger**: Step 2 complete or skipped
- **Inputs**: `docs/idea-brief.md`; `docs/market-notes.md` *(if Step 2 was run)*
- **Outputs**: `docs/tech-options.md` — candidate options with tradeoffs; NOT a final decision
- **Template**: `templates/03-tech-options.md`
- **Gate**: `none`
- **Notes**: Explicitly exploratory — do not commit to a stack here. The final decision happens in Step 7, after prototype and roadmap exist. Surface at least 2–3 viable options with pros/cons.

  **Step 1 — read the stack catalog first.** Before doing any web searches, read `kit/stack-catalog.md`. This file contains pre-researched entries for the most common web stacks (React+Supabase, Next.js+Upstash, SvelteKit+PocketBase, Firebase, Convex, Neon, etc.) with stable architectural facts already filled in. Use catalog entries directly for any option the project's requirements map to — skip web searches for those stacks except to spot-check volatile facts (pricing, free-tier limits) if the entry's `Last verified` date is more than 3 months old.

  **Step 2 — web-search only for unknowns or volatile facts.** If the project requires a stack not in the catalog, or needs a time-sensitive fact (e.g., current free-tier limits, deprecation status), dispatch `research-analyst` for that specific gap. Dispatch `librarian` only if a specific library needs source-verified capability confirmation. The open questions in Section 5 of the template feed directly into Step 7 — do not skip them.

  **Model:** research synthesis, not implementation — a lighter/faster model is appropriate for both `research-analyst` and `librarian` dispatches here.

  **Fail-fast write:** include the fail-fast write instruction (Orchestrator Convention item 6) verbatim in any subagent dispatch for this step.

---

## Step 4 — Interactive Prototype

- **Agent/Skill**: `task` agent (journey map + prototype brief); `frontend-developer` agent (interactive HTML)
- **Trigger**: `docs/tech-options.md` exists
- **Inputs**: `docs/idea-brief.md`; `docs/market-notes.md` *(if Step 2 was run)*; `kit/resource/interactive-prototype-process.md` *(reference — agents must read this before building)*
- **Outputs**: `docs/prototype/` folder containing:
  - `docs/prototype/journey-map.md` — one persona, one scenario, end-to-end journey
  - `docs/prototype/prototype-brief.md` — screens, interactions, mock data, state coverage, faked parts
  - Playable HTML prototype (no real backend; opens as `file://`)
- **Templates**: `templates/04a-journey-map.md`, `templates/04b-prototype-brief.md`
- **Gate**: `none`
- **Review**: Open `docs/prototype/` entry screen in any browser as `file://`. Walk every flow in `docs/prototype/journey-map.md` Section 4 using the review questions below. The prototype is ready to advance when every screen in the flow is reachable by clicking and the Definition of Done checklist in `prototype-brief.md` is fully checked.

  **Review questions (run these before advancing — focus on product behavior, not appearance):**
  - *Requirements:* Does this solve the problem described in `idea-brief.md`? Is anything missing or unnecessary? Is any behavior different from what was expected?
  - *User flow:* Can you complete each task without instruction? Is the sequence of actions logical? Is any step confusing or unnecessary?
  - *States:* Does the empty state make sense? Do validation errors explain what went wrong? Does success feel complete?
  - *Edge cases:* What happens with no data? What happens when input is invalid? Are important error paths represented?

- **Notes**:

  **Purpose — validate before building.** The prototype answers one question before significant development effort is committed: *"Are we building the right product, and does the proposed workflow actually work for the people who will use it?"* It is a learning and validation tool, not a commitment to the final implementation. Prototype code is temporary and disposable. Reference: `kit/resource/interactive-prototype-process.md`.

  **Priority hierarchy (in order):** Flow → Function → Usability → Data → Visual Polish. A prototype that shows the right flow with ugly styling is more valuable than a beautiful prototype that doesn't cover the real workflow.

  **Agent routing:** Do NOT dispatch the `designer` agent. Use `task` for the journey map and prototype brief. Use `frontend-developer` for the HTML. Reserve `designer` for Step 5.

  **CSS and fidelity — simple, not confusing:**

  The process document (Section 4.3) lists HTML + **CSS** + JavaScript + Mock Data as the prototype implementation stack. CSS is **required** for structural clarity — a prototype with no CSS is often harder to use than the final product and fails the "sufficient visual consistency to avoid confusion" criterion (Section 6).

  **Use CSS for:**
  - Basic layout: readable max-width, margin, padding so content isn't wall-to-wall
  - Section grouping: borders or whitespace to distinguish screen areas and form groups
  - Visual hierarchy: consistent heading sizes, body text readable without effort
  - Interactive clarity: buttons look clickable, inputs look fillable, errors are visually distinct
  - State feedback: completed/done items clearly marked (e.g. strikethrough + muted color)

  **Do NOT use CSS for:**
  - Brand colors — use neutral grays, blacks, and whites only
  - Typography personality — use `font-family: system-ui, sans-serif` only
  - Visual polish: rounded corners for aesthetics, box shadows, gradients, animations, icons
  - Production-quality component design or spacing systems

  **The test:** a new user who has never seen the product should be able to open the prototype, understand what each screen is for, and complete a task without asking for help. If raw browser defaults achieve that — fine. If they don't — add structural CSS until they do. Stop before it looks designed.

  **What the prototype must cover:**
  - **User flows:** for each flow — where the user starts, what action they take, what comes next, what the expected result is, what happens when they cancel or encounter an error.
  - **Realistic mock data:** use plausible names, amounts, dates — not "Member name", "Item 1", "Lorem ipsum". Mock data should resemble real user situations closely enough to generate meaningful feedback. Pre-populate lists where it helps users evaluate the workflow.
  - **State coverage:** represent the happy path AND: the empty state (what does the screen look like before any data exists?), at least one validation/error state (what happens when the user submits with missing or invalid input?), and the success state after completing a key action.
  - **Faked parts documented:** every hardcoded value, simulated behavior, and missing backend connection must be listed explicitly in `prototype-brief.md` — not left ambiguous.

  **Dispatch order:** (1) Dispatch `task` agent for `journey-map.md` and `prototype-brief.md`. (2) After both files are verified on disk, dispatch `frontend-developer` for the HTML prototype, passing the prototype-brief as its spec. Include the fail-fast write instruction (Orchestrator Convention item 6) in both dispatches.

---

## Step 5 — Product Design

- **Agent/Skill**: `designer` agent (AI path only — skipped entirely if `docs/DESIGN.md` already exists)
- **Trigger**: `docs/prototype/` folder exists and prototype is walkable
- **Inputs**:
  - Always: `docs/prototype/`, `docs/idea-brief.md`
  - Import path only: `docs/DESIGN.md` (user's downloaded file saved at the standard location)
- **Outputs**: `docs/DESIGN.md` + finalized mock screens inside `docs/prototype/`
- **Template**: `templates/05-design-system.md`
- **Gate**: `hard` — last checkpoint before scope and technical direction are locked in
- **Gate Summary**: *"The design direction is set — colors, typography, and components are locked. Changing direction after this is expensive. Does this match what you want the product to look and feel like?"*
- **Notes**:

  **Pre-step check — run before doing anything else:**

  1. Check whether `docs/DESIGN.md` already exists at the project root (glob or bash check). Also check the kickoff form for a referenced design file.

  2. **If `docs/DESIGN.md` is found and has content → skip Step 5 entirely.**
     Mark Step 5 as `complete` in the session log. The file is used as-is in Steps 6, 7, and 8. Advance immediately to Step 6. Do not run any agent.

  3. **If no `docs/DESIGN.md` is found** → present the two free sources and tell the user where to save one:
     *"No `DESIGN.md` found. You can (a) download one and save it to `docs/DESIGN.md` in the project folder, or (b) let the AI designer create one from the prototype."*
     - **getdesign.md** — https://getdesign.md/design-md (73+ analyses of Stripe, Linear, Notion, etc.; free to download)
     - **freedesignmd.com** — https://freedesignmd.com (121+ free design systems; no login, no paywall)
     - Download chosen → user saves to `docs/DESIGN.md`; user confirms ("downloaded" or similar). Orchestrator checks file exists and has content — do not ask for the path. If found: mark Step 5 complete and advance to Step 6. If not found: tell the user and wait.
     - AI chosen → dispatch the `designer` agent to produce tokens, components, and finalized mocks from the prototype. Set `Source: ai-generated`. Write to `docs/DESIGN.md`.

  **Hard gate applies only on the AI path** — when the designer agent produces the design, present the Gate Summary and wait for approval before advancing. On the import path (DESIGN.md already exists or downloaded), the gate is satisfied by the user having chosen to use that file; no additional approval needed.

---

## Step 6 — Roadmap Generation

- **Agent/Skill**: `task` agent (drafts); human provides final product-scope decisions
- **Trigger**: Step 5 gate approved
- **Inputs**: `docs/idea-brief.md`; `docs/market-notes.md` *(if Step 2 was run)*; `docs/prototype/`; `docs/DESIGN.md`
- **Outputs**: `docs/roadmap.md` — MoSCoW-prioritized feature list, build order, deferred features
- **Template**: `templates/06-roadmap.md`
- **Gate**: `hard` — product-scope decision requiring human call
- **Gate Summary**: *"The feature roadmap is set — [N] Must features in build order, [X] items explicitly deferred. Does this scope match what you want to ship for the MVP?"*
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

- **Agent/Skill**: `research-analyst` agent (analysis and recommendation); human makes the final decision
- **Trigger**: Step 6 gate approved
- **Inputs**: `docs/tech-options.md`, `docs/DESIGN.md`, `docs/roadmap.md`
- **Outputs**: `docs/architecture.md` — final stack choice, high-level architecture, reasoning tied to roadmap complexity
- **Template**: `templates/07-architecture.md`
- **Gate**: `hard` — the stack choice is irreversible once Phase 2 begins; changing it mid-build discards all implementation work
- **Gate Summary**: *"The recommended stack is [X]. This is the technology your app will be built with. Review the reasoning and confirm before we write the architecture document."*
- **Notes**:
  - **Two-stage process — do not collapse into one:**
    1. **Analysis stage:** The `research-analyst` reads `docs/tech-options.md` and the roadmap's actual scope (feature count, sizes, domains). It produces a **recommendation summary in chat** — two or three candidate stacks ranked with tradeoffs, one clearly recommended. This is a chat message, not a document. The agent must not write `docs/architecture.md` yet and must not set `Status: approved` on anything.
    2. **Confirmation stage:** The orchestrator presents the recommendation and waits for the human to explicitly confirm or choose a different option. Only after the human says which stack to use does the agent write `docs/architecture.md` with `Status: approved`.
  - **The user must name the stack.** A response of "looks good" or "proceed" is sufficient confirmation — but the orchestrator must have surfaced the specific stack name in its gate message so the user knows what they are confirming. Do not treat a non-response or a generic "continue" as implicit approval.
  - The document must explicitly reference why the roadmap's scope/complexity justifies the choice. The "Complexity deliberately avoided for MVP scope" section is required — name what was deliberately NOT adopted. Consult the open questions from `docs/tech-options.md` Section 5 here.
  - `docs/architecture.md` starts as `Status: draft` when written; the orchestrator sets it to `Status: approved` in the file only after human confirmation at this gate.
---

## Step 8 — Constitution / AI Working Guideline

- **Agent/Skill**: `task` agent
- **Trigger**: `docs/architecture.md` exists and is `approved`
- **Inputs**: `docs/architecture.md`, `docs/DESIGN.md`, `docs/roadmap.md`
- **Outputs**: `docs/constitution.md` (or `CLAUDE.md` / `AGENTS.md` at project root if required by the agent harness)
- **Template**: `templates/08-constitution.md`
- **Gate**: `hard` — every Phase 2 step runs under this document's authority
- **Gate Summary**: *"The working rules for all Phase 2 code are set. Every AI agent on this project will follow these principles. Does anything need to change before we start building?"*
- **Notes**:
  - Every principle must be concrete enough to change at least one downstream decision — reject any principle that wouldn't alter a plan or diff if removed. Do not include personal workflow preferences; this file contains only rules that shape code and architecture output. The Amendment Procedure in the template must be filled in — governance without a change process creates a frozen document no one can update.
  - **For single-pass projects (solo developer, ≤ 15 S/M features):** the constitution can be minimal — 3–5 concrete rules rather than a comprehensive governance document. The amendment procedure section can be simple ("update this file directly; no approval process needed for a solo project"). All Phase 2 references to `docs/constitution.md` still apply.

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
- **Notes**:

  **Pre-flight environment check — run this BEFORE dispatching the scaffold agent.** A scaffold that starts with missing tooling will fail mid-run and leave the project in a partial state. Check once; fix before proceeding.

  1. **Read the stack** from `docs/architecture.md` (Section: Stack Choice or equivalent).
  2. **Look up `Requires`** for that stack in `kit/stack-catalog.md`. If the stack is not in the catalog, identify its toolchain from the architecture doc.
  3. **Run each check via `bash`**:

     | Tool | Check command | Pass condition | Install URL if missing |
     |---|---|---|---|
     | Node.js | `node --version` | Output starts with `v18`, `v20`, `v22`, or higher | https://nodejs.org |
     | npm | `npm --version` | Any output (comes with Node) | (reinstall Node) |
     | git | `git --version` | Any output | https://git-scm.com |
     | PocketBase *(SvelteKit+PocketBase only)* | `ls backend/pocketbase` or equivalent | Binary present | https://pocketbase.io/docs/#installation — download the binary for the target OS and place it at `backend/pocketbase` |

  4. **If any check fails:** stop. Output the exact install URL(s) and ask the user to install and confirm before proceeding. Do not dispatch the scaffold agent until all checks pass.
  5. **Account prerequisites** (hosted stacks only): If the chosen stack requires an account (Supabase, Convex, Neon, Firebase), confirm the user has already created the project on that platform and has the required keys/URLs. If not, pause and link them to the sign-up page. The scaffold agent needs these credentials to configure environment variables — it cannot retrieve them itself.

  **Git repo check:** After the pre-flight passes, confirm a git repository exists at the project root (`git rev-parse --git-dir` returns successfully). If not, run `git init` and make an initial empty commit (`git commit --allow-empty -m "chore: init"`) before the agent starts — Phase 2 branch creation depends on a git repo being present.

  **End state:** a project that builds and runs with zero features implemented. A "hello world" level smoke test must pass before Phase 1 is closed. Every item in the scaffold checklist must be checked. After this step, Phase 2 can begin — the orchestrator reads `docs/roadmap.md` and selects the first `pending` feature in build order.

---

## Phase 1 Output Checklist

Before Phase 2 starts, verify all of these exist and are marked `approved`:

- [ ] `docs/idea-brief.md`
- [ ] `docs/market-notes.md` *(skip this check if Step 2 was skipped)*
- [ ] `docs/tech-options.md`
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
1. Open a new OMP session with the working directory set to the project root.
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
Ideation → Market Research [optional, hard gate if run] → Tech Research → Prototype Mock → Product Design [hard gate]
    → Roadmap [hard gate] → Architecture [hard gate] → Constitution [hard gate] → Scaffold
                                                                           │
                                                                           ▼
                                              Close Phase 1 session → Open new Phase 2 session
```
