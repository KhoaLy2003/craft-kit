# Phase 1 · Step 3 — Prototype & Design

## Overview

- **Purpose**: Validate the product's flows and lock its visual language in one build: journey map and prototype brief → validated `DESIGN.md` → one HTML prototype that applies `DESIGN.md` → a single user approval.
- **Agent/Skill**: general-purpose agent (journey map and brief); the orchestrator builds the HTML directly, applying the `design-taste-frontend` skill. No visual design agent.
- **Model**: `balanced`
- **Trigger**: Step 2 complete or skipped.
- **Inputs**: `docs/idea-brief.md`; `docs/market-notes.md` *(if Step 2 ran)*; `docs/DESIGN.md` *(user-prepared, see Phase B)*.
- **Outputs**:
  - `docs/prototype/journey-map.md` — one persona, one scenario, end-to-end journey
  - `docs/prototype/prototype-brief.md` — screens, interactions, mock data, state coverage, faked parts
  - `docs/DESIGN.md` — user-provided, validated, never modified
  - `docs/preview/` — the HTML prototype (no real backend; opens as `file://`)
- **Template**: `templates/03a-journey-map.md`, `templates/03b-prototype-brief.md`, `templates/03c-design-system.md` (skeleton for a user who writes their own `DESIGN.md`)
- **Gate**: `hard` — one gate for flow and look together.
- **Optional reference**: `kit/guides/interactive-prototype-process.md` (background only; this file is authoritative).

## Scope

- **In**: one persona and scenario; all screens, interactions, mock data, state coverage, and faked parts; `DESIGN.md` validation; one HTML build applying it.
- **Out**: generating `DESIGN.md` (it must come from the user); editing the user's `DESIGN.md`; real backend, API, database, or auth; production-quality code.

> The prototype answers: *"Are we building the right product, and does the proposed workflow actually work for the people who will use it?"* It is a learning tool. Prototype code is disposable; do not refactor or optimise it.

## Execution Rules

### Phase A — Journey map and prototype brief

1. **Platform acknowledgment (first action).** Read `docs/idea-brief.md` Known Constraints and apply the matching case:
   - *None declared, or web only*: proceed silently.
   - *Single non-web platform* (mobile, iOS, Android, desktop): say *"Your idea brief notes [platform]. The prototype is HTML to validate flows; that does not commit you to a web product. Platform is confirmed in Step 6 (Architecture)."* Build for that viewport.
   - *Multiple platforms*: ask which is primary if not explicit, then say *"The prototype covers [primary] only; secondary platforms share the same flows and are deferred to Step 6."* Name the secondary platforms under **Deferred platforms** in `prototype-brief.md` Section 5.
2. **Viewport**: mobile → `max-width: 390px`, centered, touch targets ≥ 44px, no hover-only states; desktop → `max-width: 1280px`; web → default browser width.
3. **Priority order**: Flow → Function → Usability → Data → Visual polish.
4. Dispatch the general-purpose agent for `journey-map.md` and `prototype-brief.md` (include `PROJECT_ROOT` and the fail-fast write instruction per `kit/orchestrator-conventions.md`). Required content:
   - **Flows**: for each, where the user starts, the action, what comes next, the expected result, and what happens on cancel or error.
   - **Realistic mock data**: plausible names, amounts, dates; never "Item 1" or "Lorem ipsum". Pre-populate lists where it helps the user judge the workflow.
   - **State coverage**: happy path, empty state, at least one validation/error state, and the success state after a key action.
   - **Faked parts**: every hardcoded value, simulated behaviour, and missing backend connection listed in the brief.
5. Verify both files exist before continuing. Tell the user the paths; no separate approval is needed here.

### Phase B — DESIGN.md

1. If `docs/DESIGN.md` exists and has content, go straight to validation. Otherwise tell the user (substitute the real project path):

   > The prototype brief is ready. Before the prototype can be built, you need a design system file. Pick one from **getdesign.md** (https://getdesign.md/design-md, 73+ analyses of Stripe, Linear, Notion, Airbnb and others) or **freedesignmd.com** (https://freedesignmd.com, 121+ free design systems), download it, rename it `DESIGN.md`, and save it to `<project-root>/docs/DESIGN.md`. A custom file works too (`templates/03c-design-system.md`, format example in `kit/guides/design-reference.md`). Reply "ready" when it is in place.

   Wait for confirmation. If the user says it is placed but the file is missing, say so and wait; never assume another path.
2. **Validate** by reading the file (no agent):

   | # | Criterion | Pass condition |
   |---|---|---|
   | 1 | Overview / design personality | At least one paragraph on canvas, accent usage, shape language, and typographic tone |
   | 2 | Color tokens | At least 5 semantic tokens (e.g. `color-primary`, `color-background`) with hex/rgb values |
   | 3 | Typography scale | At least 3 levels with size, weight, and line-height; font family named |
   | 4 | Spacing system | Base unit stated and/or at least 4 spacing token values |
   | 5 | Core components | At least 3 components (e.g. Button, Input, Card) with tokens and states |
   | 6 | Responsive breakpoints | At least 2 breakpoints named with pixel widths |
   | 7 | Not a stub | At least 300 words |

   On any failure, name each failed criterion and why (e.g. "Color tokens (2): only 2 found, need 5 with values"), ask the user to fix or replace the file, and re-validate when they reply "ready".

### Phase C — Build the prototype once

Read `docs/DESIGN.md`, `docs/prototype/prototype-brief.md`, `docs/prototype/journey-map.md`, and `docs/idea-brief.md`. Build `docs/preview/` directly, with no subagent.

- **Stack**: one `docs/preview/index.html` with JS-driven screen switching (or one file per screen if screens are complex). HTML5 + CDN Tailwind (`<script src="https://cdn.tailwindcss.com">`) with an inline `tailwind.config` mapping the `DESIGN.md` color and font tokens; CSS custom properties in a `<style>` block for anything Tailwind cannot express; vanilla JS only; Phosphor Icons via CDN (`https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css`), never hand-rolled SVG; fonts via `<link>`; `https://picsum.photos/seed/{descriptive-seed}/{w}/{h}` for image placeholders. No build step.
- **Data**: only the mock data from `prototype-brief.md`; no API calls, fetch, or environment variables; treat the user as already logged in.
- **Screens**: every screen in the primary flow, the empty state and at least one error/validation state for the main interaction, and one navigation component consistent across all screens. If `prototype-brief.md` is ambiguous, take the most conservative reading and note it in a comment.
- **Fidelity**: map `DESIGN.md` tokens, typography, spacing, and component definitions exactly; invent no values. No three-equal-card rows, no AI-purple defaults, no Inter unless `DESIGN.md` specifies it, no centered layout unless the design system calls for it. Run the full `design-taste-frontend` pre-flight (zero em-dashes, color and shape consistency locks, button contrast, hero viewport fit, eyebrow count, section layout variety) before writing any file.
- **Verify**: `docs/preview/index.html` exists and its first 20 lines contain the Tailwind CDN script tag (not a stub). On a build error, report it and retry with a targeted fix; never advance with a broken prototype.

#### CSS Fidelity Rules

CSS is required for structural clarity: an unstyled prototype is often harder to use than the final product.

**Use CSS for:**
- Basic layout: readable max-width, margin, padding, so content is not wall-to-wall.
- Section grouping: borders or whitespace to separate screen areas and form groups.
- Visual hierarchy: consistent heading sizes; body text readable without effort.
- Interactive clarity: buttons look clickable, inputs look fillable, errors are visually distinct.
- State feedback: completed items clearly marked (for example strikethrough and muted color).

**Do not:**
- Use any color, font, spacing, radius, or shadow value that is not in `DESIGN.md`.
- Add decoration `DESIGN.md` does not call for (extra shadows, gradients, animation beyond state feedback).
- Build production-quality component systems.

**The test:** a new user who has never seen the product can open the prototype, understand what each screen is for, and complete a task without help. Add structural CSS until they can; stop before it is over-designed.

### Phase D — Review, feedback, and hard gate

1. Tell the user to open `docs/preview/index.html` (double-click or `open docs/preview/index.html`) and list the screens covered and the `DESIGN.md` tokens applied.
2. Walk every flow in `docs/prototype/journey-map.md` Section 4 with the review questions (product behaviour first, appearance second):
   - *Requirements*: Does this solve the problem in `idea-brief.md`? Is anything missing or unnecessary?
   - *User flow*: Can you complete each task without instruction? Is any step confusing or unnecessary?
   - *States*: Does the empty state make sense? Do validation errors explain what went wrong? Does success feel complete?
   - *Edge cases*: What happens with no data or invalid input? Are important error paths represented?
3. Feedback loop, repeated until the user approves (no iteration limit):
   - `DESIGN.md` changes (for example "the palette feels too cold"): ask the user to update the file and reply "ready"; re-validate (Phase B) and rebuild (Phase C).
   - Flow or layout changes: patch `prototype-brief.md` and `docs/preview/`, re-run the pre-flight and the on-disk check, and re-present. Log each item using the classification in `prototype-brief.md` Section 7.
4. Check every item of the Definition of Done in `docs/prototype/prototype-brief.md` (all 11).
5. Hard gate: *"The prototype applies your DESIGN.md and covers [N screens / flows]. Approving locks both the product flow and the visual direction; changing either later means rebuilding the prototype and may reopen the roadmap and architecture. Approve?"*

## Artifact Rules

- `docs/DESIGN.md` is accepted as-is after validation and never modified by the orchestrator or any agent.
- `docs/preview/` is a design-validation artifact, not production code.
- The step is not complete until the user explicitly approves at the Phase D gate.

## Completion Criteria

- [ ] `journey-map.md` covers one persona and one scenario (not a blended "average user"), with a pain point per phase where relevant and an explicit prototype scope.
- [ ] `prototype-brief.md` documents all screens, interactions, mock data, state coverage, and faked parts; its Definition of Done is fully checked.
- [ ] `docs/DESIGN.md` passed all 7 validation criteria.
- [ ] `docs/preview/index.html` exists, applies `DESIGN.md`, and every screen in the journey map is reachable by clicking.
- [ ] Review questions walked; user approved at the hard gate.

## Transition Rules

Next: Step 4 — Roadmap. If Step 2 was skipped, `docs/market-notes.md` does not exist; use `docs/idea-brief.md` only.
