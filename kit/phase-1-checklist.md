# Phase 1 — Pre-Step Checklist

> **Read the relevant section of this file before starting each step.**
> Universal items apply to every step. Step-specific items apply only to that step.
> Items marked **[HARD GATE]** require explicit user approval before advancing.
> Items marked **[BLOCK]** must pass before the step proceeds — stop and fix if they fail.

---

## Universal — Every Step

Run these at the start of **every** Phase 1 step, before doing anything else:

- [ ] Emit step banner (step number, name, skill/agent, gate type)
- [ ] Record start time: run `new Date().toLocaleTimeString()` via `eval(js)` — do not estimate or leave as `—`
- [ ] Record `budget.spent()` at step start
- [ ] Include `PROJECT_ROOT: <absolute path>` in every subagent dispatch
- [ ] Include **fail-fast write instruction** (see `kit/orchestrator-conventions.md` item 6) in every subagent dispatch that writes files
- [ ] After every subagent write: verify file exists on disk; recover from `agent://` and write directly if absent
- [ ] After every file write: read back the first 20 lines; confirm no missing table separator rows (`|---|`), no truncation, no placeholder text — see `kit/orchestrator-conventions.md` item 7
- [ ] Update `docs/phase-1-session.md` with duration and credit delta at step end before advancing

---

## Step 1 — Product Ideation

- [ ] Use brainstorming **Architectural path** (never Bounded — no existing codebase exists)
- [ ] Stop after clarifying questions — do **NOT** enter "propose approaches" or "present design" phases
- [ ] Clarifying questions cover: problem today, who has it, existing alternatives, what's out of scope — stop there
- [ ] `docs/idea-brief.md` written and `Status: approved` before advancing
- **[BLOCK]** Do not write `docs/idea-brief.md` until all clarifying questions are answered — questions → answers → write file → user opens and reviews the file → approval. Never print the full content in the terminal for review.
- **[HARD GATE]** After Step 1 completes, present the Step 2 choice in chat:
  *"Step 2 (Market Research) validates demand and finds competitive risks. Proceed or skip to Step 3 (Prototype)?"*
  Wait for the user's answer. **This is required even if the kickoff says "run all steps."**

---

## Step 2 — Market Research *(optional)*

- [ ] Only runs if user explicitly chose to proceed at the Step 1 gate
- [ ] If skipped: mark `skipped` in session log; advance directly to Step 3
- [ ] Present findings neutrally — include "Reasons This Might Not Work"; this section must not be skipped
- **[HARD GATE]** Present Gate Summary: *"Market research is done. The main finding is [one sentence]. This is your proceed / pivot / stop decision."* Wait for the three-way decision.
- [ ] If pivot or stop: do not advance to Step 3; Phase 1 does not continue

---

## Step 3 — Interactive Prototype

- [ ] Read `kit/guides/interactive-prototype-process.md` before dispatching anything
- [ ] Dispatch **your general-purpose agent** for journey map and prototype brief — **NOT** a visual design agent
- **[BLOCK]** Verify `docs/prototype/journey-map.md` and `docs/prototype/prototype-brief.md` exist on disk before dispatching `frontend-developer`
- [ ] HTML prototype: CSS **required** for structural clarity (layout, grouping, hierarchy, state visibility) — no brand colors, no visual polish
- **[BLOCK]** Verify all HTML files exist on disk after `frontend-developer` completes
- [ ] Walk review questions before advancing: requirements, user flow, states, edge cases (see `kit/steps/phase-1/p1-03-prototype.md`)
- **[BLOCK]** `prototype-brief.md` Definition of Done checklist: **all 11 items** must be checked before advancing

---

## Step 4 — Product Design

- **[MUST DO FIRST]** Check for an existing design file — in order:
  1. `docs/DESIGN.md` at `PROJECT_ROOT`
  2. `DESIGN.md` at `PROJECT_ROOT` (project root, not in docs/)
  3. Any path explicitly listed in the kickoff form under "Design file"

- **If ANY of the above is found and has content:**
  - **Skip Step 4 entirely — no user confirmation needed.** Copy the file to `docs/DESIGN.md` if it is not already there. Mark `complete` in session log. Advance to Step 5 immediately. No agent runs, no gate.
  - Rationale: the user already has a design file; asking them to confirm is redundant friction.

- **If no design file is found anywhere:**
  - Present sources: **getdesign.md** (https://getdesign.md/design-md) · **freedesignmd.com** (https://freedesignmd.com)
  - Tell user: *"Save the downloaded file to `docs/DESIGN.md` in the project folder, then say 'downloaded'."*
  - After user confirms download: check `docs/DESIGN.md` exists and has content automatically — do not ask for path
    - Found → mark Step 4 complete, advance to Step 5. No agent runs.
    - Not found → tell user; wait for them to confirm placement before checking again
  - AI chosen → dispatch your general-purpose agent (or a dedicated visual design agent if available); write output to `docs/DESIGN.md`
    - **[HARD GATE]** Gate Summary: *"The design direction is set — colors, typography, and components are locked. Does this match what you want?"*
---

## Step 5 — Roadmap Generation

- [ ] Your general-purpose agent drafts; human makes all priority and cut/keep decisions
- [ ] Build order accounts for dependencies, not just priority
- [ ] Deferred features explicitly listed — not silently dropped
- [ ] All features start with `Status: pending`
- **[HARD GATE]** Gate Summary: *"[N] Must features in build order, [X] items explicitly deferred. Does this scope match what you want to ship?"*
- [ ] **At this gate**: evaluate Phase 2 track using the 5-criteria table (feature count, sizes, domains, dependency structure, developer count); present recommendation; wait for user confirmation
- [ ] Record confirmed Phase 2 Track in `docs/roadmap.md`

---

## Step 6 — Tech Stack Research and Architecture Decision

> **Critical: three stages. Do not collapse into one.**

- **Stage 1 — Research (catalog-first):**
  - [ ] Read `kit/stack-catalog.md` **first** — before any web searches
  - [ ] Web-search only for stacks not in the catalog, or for volatile facts (pricing/limits) with `Last verified` >3 months old
  - [ ] Surface 2–3 viable options with pros/cons, informed by roadmap scope
- **Stage 2 — Analysis (chat only):**
  - [ ] `research-analyst` produces a ranked recommendation **in chat** — two or three stacks with tradeoffs, one clearly recommended
  - [ ] **No document written yet** — `docs/architecture.md` must not exist at this stage
  - [ ] Stack name explicitly stated in the chat recommendation
- **[HARD GATE — Stage 3 — Confirmation]:**
  - Gate Summary: *"The recommended stack is [X]. Review the reasoning and confirm before we write the architecture document."*
  - Wait for the user to name the stack. "Looks good" or "proceed" counts **only if the stack name was surfaced** in the gate message.
  - **Only after confirmation**: write `docs/architecture.md` with `Status: draft`; orchestrator sets `Status: approved` in the file
- [ ] Document explicitly references why roadmap scope justifies the stack choice
- [ ] "Complexity deliberately avoided for MVP scope" section present and filled

---

## Step 7 — Constitution / AI Working Guideline

- [ ] Every principle concrete enough to change at least one downstream decision — reject any that wouldn't alter a diff
- [ ] No personal workflow preferences — only rules that shape code and architecture output
- [ ] Amendment Procedure section filled (not left empty)
- [ ] Solo/≤15 features: constitution may be minimal (3–5 rules); amendment procedure may be simple
- **[HARD GATE]** Gate Summary: *"The working rules for all Phase 2 code are set. Does anything need to change before we start building?"*

---

## Step 8 — Scaffold and Convention Setup

**Pre-flight checks — run ALL of these before dispatching the scaffold agent:**

- **[BLOCK]** Read stack from `docs/architecture.md`
- **[BLOCK]** Look up `Requires` in `kit/stack-catalog.md` for that stack
- **[BLOCK]** Run bash checks:
  - `node --version` — must start with v18, v20, v22 or higher
  - `npm --version` — any output
  - `git --version` — any output
  - If any fails: stop, output install URL, wait for user confirmation
- **[BLOCK]** Hosted stacks (Supabase, Convex, Neon, Firebase): confirm account created and credentials available before dispatch
- **[BLOCK]** Git: `git rev-parse --git-dir` — if no repo: run `git init` + `git commit --allow-empty -m "chore: init"` before dispatching

**After scaffold agent completes:**

- [ ] Smoke test: app launches with no errors; browser shows working "hello world" state
- [ ] Windows note: use `hub start` with `application: "node"` and `args: ["node_modules/vite/bin/vite.js"]` for Vite projects
- [ ] Every item in `templates/09-scaffold-checklist.md` checked off

---

## Phase 1 Close

Before closing the session:

- **[BLOCK]** Phase 1 Output Checklist — verify all items exist and are `approved`:
  - [ ] `docs/idea-brief.md`
  - [ ] `docs/market-notes.md` *(skip if Step 2 was skipped)*
  - [ ] `docs/prototype/` (journey-map.md + prototype-brief.md + walkable HTML)
  - [ ] `docs/DESIGN.md`
  - [ ] `docs/roadmap.md` (all features `pending`)
  - [ ] `docs/architecture.md`
  - [ ] `docs/constitution.md`
  - [ ] Scaffold: app builds and runs, smoke test passes
- [ ] Emit Phase 2 handoff prompt with brackets filled in — user should be able to copy without editing
