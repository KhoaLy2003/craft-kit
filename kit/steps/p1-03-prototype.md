# Phase 1 · Step 3 — Interactive Prototype

- **Agent/Skill**: Your general-purpose agent (journey map + prototype brief); `frontend-developer` agent (interactive HTML)
- **Trigger**: Step 2 complete or skipped
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

  **Agent routing:** Do NOT use a visual design agent for this step. Use your general-purpose agent for the journey map and prototype brief. Use `frontend-developer` for the HTML.

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

  **Dispatch order:** (1) Dispatch your general-purpose agent for `journey-map.md` and `prototype-brief.md`. (2) After both files are verified on disk, dispatch `frontend-developer` for the HTML prototype, passing the prototype-brief as its spec. Include the fail-fast write instruction (see `kit/orchestrator-conventions.md` item 6) in both dispatches.
