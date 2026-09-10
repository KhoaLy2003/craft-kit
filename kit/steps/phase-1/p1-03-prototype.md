# Phase 1 · Step 3 — Interactive Prototype

## Overview

- **Purpose**: Build a working prototype to test UX assumptions and validate core user interactions before significant development effort is committed.
- **Agent/Skill**: General-purpose agent (journey-map.md + prototype-brief.md); `frontend-developer` agent (interactive HTML)
- **Trigger**: Step 2 complete or skipped.
- **Inputs**:
  - `docs/idea-brief.md`
  - `docs/market-notes.md` *(if Step 2 was run)*
  - `kit/resource/interactive-prototype-process.md` *(reference — agents must read this before building)*
- **Outputs**:
  - `docs/prototype/journey-map.md` — one persona, one scenario, end-to-end journey
  - `docs/prototype/prototype-brief.md` — screens, interactions, mock data, state coverage, faked parts
  - Playable HTML prototype (no real backend; opens as `file://`)
- **Template**: `templates/04a-journey-map.md`, `templates/04b-prototype-brief.md`
- **Gate**: `hard` — the prototype must be walkable and every review question answered before advancing.

## Scope

### In Scope

- Defining one persona and one end-to-end user scenario in `journey-map.md`.
- Specifying all screens, interactions, mock data, state coverage, and faked parts in `prototype-brief.md`.
- Implementing the prototype as HTML + CSS + JavaScript with mock data (no real backend).
- **User flows**: for each flow — where the user starts, what action they take, what comes next, what the expected result is, what happens when they cancel or encounter an error.
- **Realistic mock data**: plausible names, amounts, dates — not "Member name", "Item 1", "Lorem ipsum". Mock data must resemble real user situations closely enough to generate meaningful feedback. Pre-populate lists where it helps users evaluate the workflow.
- **State coverage**: the happy path AND the empty state (what does the screen look like before any data exists?), at least one validation/error state (what happens when the user submits with missing or invalid input?), and the success state after completing a key action.
- **Faked parts documented**: every hardcoded value, simulated behavior, and missing backend connection listed explicitly in `prototype-brief.md`.

### Out of Scope

- Brand colors — neutral grays, blacks, and whites only.
- Icons and typography personality.
- Visual polish: rounded corners for aesthetics, box shadows, gradients, animations.
- Production-quality component design or spacing systems.
- Any work performed by a visual design agent (that belongs to Step 4).

### Scope Boundary

> The prototype answers one question: *"Are we building the right product, and does the proposed workflow actually work for the people who will use it?"* It is a learning and validation tool, not a commitment to the final implementation. Prototype code is temporary and disposable.

## Execution Rules

- **Priority hierarchy (in order):** Flow → Function → Usability → Data → Visual Polish. A prototype that shows the right flow with ugly styling is more valuable than a beautiful prototype that doesn't cover the real workflow.
- **Agent routing:** Do NOT use a visual design agent for this step. Use your general-purpose agent for the journey map and prototype brief. Use `frontend-developer` for the HTML.
- **Dispatch order:**
  1. Dispatch your general-purpose agent for `journey-map.md` and `prototype-brief.md`. Include the fail-fast write instruction (see `kit/orchestrator-conventions.md` item 6).
  2. After both files are verified on disk, dispatch `frontend-developer` for the HTML prototype, passing `prototype-brief.md` as its spec. Include the fail-fast write instruction in this dispatch as well.
- Agents must read `kit/resource/interactive-prototype-process.md` before building.

## Artifact Rules

- **Artifact**: `docs/prototype/` folder
- The folder must contain: `journey-map.md`, `prototype-brief.md`, and the playable HTML prototype file(s).
- The HTML prototype must open as `file://` with no server required.
- Every hardcoded value, simulated behavior, and missing backend connection must be listed explicitly in `prototype-brief.md` — not left ambiguous.
- The Definition of Done checklist inside `prototype-brief.md` must be fully checked before the review gate.
- **Status / approval condition**: The prototype advances when the hard-gate review is passed — all review questions answered, every screen reachable by clicking, and the Definition of Done checklist fully checked.

### CSS Fidelity Rules

CSS is **required** for structural clarity — a prototype with no CSS is often harder to use than the final product and fails the "sufficient visual consistency to avoid confusion" criterion (see `kit/resource/interactive-prototype-process.md` Section 6).

**Use CSS for:**
- Basic layout: readable max-width, margin, padding so content isn't wall-to-wall.
- Section grouping: borders or whitespace to distinguish screen areas and form groups.
- Visual hierarchy: consistent heading sizes, body text readable without effort.
- Interactive clarity: buttons look clickable, inputs look fillable, errors are visually distinct.
- State feedback: completed/done items clearly marked (e.g. strikethrough + muted color).

**Do NOT use CSS for:**
- Brand colors — use neutral grays, blacks, and whites only.
- Typography personality — use `font-family: system-ui, sans-serif` only.
- Visual polish: rounded corners for aesthetics, box shadows, gradients, animations, icons.
- Production-quality component design or spacing systems.

**The test:** a new user who has never seen the product should be able to open the prototype, understand what each screen is for, and complete a task without asking for help. If raw browser defaults achieve that — fine. If they don't — add structural CSS until they do. Stop before it looks designed.

## Completion Criteria

The step is considered complete when:

- [ ] `docs/prototype/journey-map.md` exists and covers one persona and one end-to-end scenario.
- [ ] `docs/prototype/prototype-brief.md` exists with all screens, interactions, mock data, state coverage, and faked parts documented.
- [ ] The HTML prototype is playable as `file://` and every screen in the journey map is reachable by clicking.
- [ ] The Definition of Done checklist in `prototype-brief.md` is fully checked.
- [ ] All hard-gate review questions have been walked through and answered.

## Transition Rules

### Before Advancing

- Open `docs/prototype/` entry screen in any browser as `file://`.
- Walk every flow in `docs/prototype/journey-map.md` Section 4 using the review questions below.
- **Review questions (focus on product behavior, not appearance):**
  - *Requirements:* Does this solve the problem described in `idea-brief.md`? Is anything missing or unnecessary? Is any behavior different from what was expected?
  - *User flow:* Can you complete each task without instruction? Is the sequence of actions logical? Is any step confusing or unnecessary?
  - *States:* Does the empty state make sense? Do validation errors explain what went wrong? Does success feel complete?
  - *Edge cases:* What happens with no data? What happens when input is invalid? Are important error paths represented?

### Next Step

- **Default**: Step 4 — Product Design
- **Optional skip**: No
- **User decision required**: Yes — user must review the prototype and confirm the hard gate before advancing.

### Transition Record

- **Record**: `docs/<project>/phase-1-session.md`
- **Values**: `complete` / `skipped`

## Exceptions / Special Cases

- If the user skips Step 2 (Market Research), use only `docs/idea-brief.md` as input — `docs/market-notes.md` will not exist.
- Prototype code is intentionally disposable. Do not refactor or optimize it for longevity.

## References

- `kit/resource/interactive-prototype-process.md`
- `templates/04a-journey-map.md`
- `templates/04b-prototype-brief.md`
- `kit/orchestrator-conventions.md` (item 6 — fail-fast write instruction)
- `frontend-developer` agent
