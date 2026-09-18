# Phase 1 · Step 4 — Product Design

## Overview

- **Purpose**: Lock the visual language for the product. The user prepares a `DESIGN.md` file (their own or downloaded from a curated source), the orchestrator validates its quality, then builds a real HTML UI preview with mock data directly so the user can see and react to how their product will look before a line of production code is written.
- **Agent/Skill**: Orchestrator (direct — no subagent dispatch; applies `design-taste-frontend` skill for the UI preview)
- **Model**: `sonnet`
- **Trigger**: Step 3 hard gate passed — `docs/prototype/` exists and is walkable.
- **Inputs**:
  - `docs/prototype/prototype-brief.md` — screens, flows, mock data
  - `docs/prototype/journey-map.md` — persona and primary scenario
  - `docs/idea-brief.md` — product context
  - `docs/DESIGN.md` — **user-prepared; must be present and validated before building the preview**
- **Outputs**:
  - `docs/DESIGN.md` — user-provided design system file (validated, not modified)
  - `docs/preview/` — HTML + CDN Tailwind UI preview built directly by the orchestrator with mock data
- **Template**: `templates/05-design-system.md` (used as the quality checklist reference; not filled by an agent)
- **Gate**: `hard` — always. User must approve the design direction after reviewing the live UI preview before Step 5 begins.

## Scope

### In Scope

- Guiding the user to obtain and name a `DESIGN.md` file.
- Validating the quality of the user-provided `docs/DESIGN.md` against the checklist below.
- Building a real, runnable UI preview with mock data directly, applying the `design-taste-frontend` skill.
- Presenting the preview to the user and collecting feedback.
- Running the feedback loop (update DESIGN.md and rebuild preview) until the user approves.

### Out of Scope

- Generating `docs/DESIGN.md` from the prototype — the AI path is removed. The file must come from the user.
- Modifying the contents of the user-supplied `docs/DESIGN.md`.
- Real backend logic, API endpoints, database connections, or authentication in the preview.
- Visual polish or production code quality in the preview — it is a design validation artifact.
- Any work that belongs to Step 5 (Roadmap) or later.

### Scope Boundary

> Step 4 has one path: the user provides `docs/DESIGN.md`, the orchestrator validates it, then builds the UI preview directly applying the `design-taste-frontend` skill. There is no AI-generation path. The step does not advance until the user explicitly approves the preview at the hard gate.

## Execution Rules

### Phase A — Guide User to Prepare DESIGN.md

1. **Pre-step check:** After the Step 3 hard gate passes, immediately check whether `docs/DESIGN.md` already exists and has content.

2. **If `docs/DESIGN.md` is found and has content** — skip Phase A and go directly to Phase B (quality check). Do not prompt the user to provide the file again.

3. **If `docs/DESIGN.md` is not found** — present the following instruction to the user verbatim (substitute `<project-root>` with the actual path):

   > **Step 4 — Product Design**
   >
   > The prototype is approved. Before the UI preview can be built, you need to prepare a design system file.
   >
   > **What to do:**
   > Pick a design system from one of these free sources, download it, rename it `DESIGN.md`, and save it to `<project-root>/docs/DESIGN.md`.
   >
   > - **getdesign.md** — https://getdesign.md/design-md (73+ analyses of Stripe, Linear, Notion, Airbnb, and others; free download)
   > - **freedesignmd.com** — https://freedesignmd.com (121+ free design systems; no login, no paywall)
   >
   > Choose a design system whose visual personality fits your product. When the file is in place, reply "ready" and the kit will validate it and build your UI preview.

4. **Wait.** Do not proceed until the user confirms the file is ready ("ready", "done", "placed", or similar). This is a hard stop — Step 4 does not continue without user confirmation.

---

### Phase B — Quality Validation

Run this check directly (no agent needed). Read `docs/DESIGN.md` and verify each criterion:

| # | Criterion | Pass condition |
|---|---|---|
| 1 | Overview / design personality | At least one paragraph describing canvas, accent usage, shape language, and typographic tone |
| 2 | Color tokens | At least 5 semantic color tokens (e.g. `color-primary`, `color-background`, `color-text-primary`) with hex/rgb values filled in |
| 3 | Typography scale | At least 3 levels defined with font size, weight, and line-height; font family named |
| 4 | Spacing system | Base unit stated AND/OR at least 4 spacing token values |
| 5 | Core components | At least 3 components listed (e.g. Button, Input, Card) with tokens and states |
| 6 | Responsive breakpoints | At least 2 breakpoints named with widths |
| 7 | Not a stub | File is at least 300 words |

**If all criteria pass** — proceed to Phase C.

**If one or more criteria fail** — report exactly which criteria failed with a short explanation, for example:

> `docs/DESIGN.md` is missing or incomplete in these areas:
> - **Color tokens (criterion 2):** Only 2 tokens found; need at least 5 with values.
> - **Typography scale (criterion 3):** Font family is not named.
>
> Please update the file (or choose a different one from the same sources) and reply "ready" when done.

Then wait. Re-run Phase B when the user confirms again.

---

### Phase C — UI Preview Build

Read `docs/DESIGN.md`, `docs/prototype/prototype-brief.md`, `docs/prototype/journey-map.md`, and `docs/idea-brief.md`. Build the preview directly — no subagent dispatch.

**Output location:** `docs/preview/` — one `index.html` with JS-driven screen switching (or one HTML file per screen if screens are complex). No build step. Opens as `file://`.

**Stack:**
- HTML5 + CDN Tailwind (`<script src="https://cdn.tailwindcss.com">`) with an inline `tailwind.config` block mapping DESIGN.md color and font tokens directly.
- CSS custom properties in a `<style>` block for any token not expressible as a Tailwind utility.
- Vanilla JS for screen switching, mock state (tabs, form validation feedback, empty/error/success states). No frameworks.
- Phosphor Icons via CDN (`<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/regular/style.css">`). Do not hand-roll SVG paths.
- Fonts via `<link>` from Google Fonts or a CDN — this is a design validation artifact, not a production build.

**Data constraints:**
- All data is the same hardcoded mock data from `docs/prototype/prototype-brief.md`. Do not invent new data.
- No API calls, no fetch/axios, no environment variables.
- Treat the user as already logged in — no authentication flow.

**Design fidelity — apply the design-taste-frontend skill:**
- Map DESIGN.md color tokens, typography, spacing, and component definitions exactly into the `tailwind.config` block and CSS custom properties. Do not invent values not present in DESIGN.md.
- No three-equal-card rows, no AI-purple defaults, no Inter unless DESIGN.md specifies it, no centered layout unless the design system calls for it.
- Apply the full pre-flight check from the design-taste-frontend skill before writing any file: zero em-dashes, color consistency lock, shape consistency lock, button contrast check, hero viewport fit, eyebrow count, section layout variety.
- Use `https://picsum.photos/seed/{descriptive-seed}/{w}/{h}` for any image placeholders needed.

**Screens to build:**
- Every screen in `docs/prototype/prototype-brief.md` under the primary user flow.
- The empty state and at least one error/validation state for the primary interaction.
- A navigation component matching the product's navigation structure, consistent across all screens.

After writing all files:

1. Verify `docs/preview/index.html` exists on disk.
2. Re-read the first 20 lines of `index.html` to confirm the CDN Tailwind script tag is present and the file is not a stub.
3. Report to the user: screens built, design tokens applied, and how to open the preview (`open docs/preview/index.html` or double-click).

---

### Phase D — Review and Feedback Loop

Present the preview results to the user and ask:

> **UI Preview is ready.**
>
> Open `docs/preview/index.html` in your browser (double-click, or `open docs/preview/index.html`).
>
> Screens covered: `<list from prototype-brief>`.
>
> Does this match the look and feel you want for your product? If yes, say "approved" to lock the design direction. If something is off, describe what you'd like changed.

**If the user approves** — proceed to Phase E (hard gate).

**If the user gives feedback:**
- Assess whether the feedback requires a DESIGN.md change (e.g. "the colors feel too cold — I want a warmer palette") or a preview-only fix (e.g. "the nav is in the wrong order").
- For DESIGN.md changes: ask the user to update `docs/DESIGN.md` and reply "ready". Re-run Phase B (quality check) and Phase C (UI preview rebuild) with the updated file.
- For preview-only fixes: apply the `design-taste-frontend` skill and rebuild `docs/preview/` directly — same path as Phase C. Run the pre-flight check, apply only the described changes, re-verify `index.html` exists on disk, then re-present the updated preview.
- Repeat until the user approves. There is no maximum iteration count — continue until explicitly approved.

---

### Phase E — Hard Gate

Present the Gate Summary and wait for explicit approval before advancing:

> **Gate Summary — Step 4 Complete**
>
> The design direction is locked. The UI preview reflects the visual language, components, and flows your product will use. Changing direction after this point means updating DESIGN.md, rebuilding the preview, and potentially revisiting the architecture in Step 6.
>
> **Ready to advance to Step 5 — Roadmap?**

Do not advance until the user gives explicit approval.

## Artifact Rules

- **`docs/DESIGN.md`**: User-provided. Accepted as-is after passing Phase B validation. Never modified by the orchestrator or any agent.
- **`docs/preview/`**: Built directly by the orchestrator. HTML + CDN Tailwind files that open as `file://` with no build step. Not production code — a design validation artifact only.
- **Status / approval condition**: Step 4 is not complete until the user explicitly approves the preview at the hard gate (Phase E). No implicit advancement.

## Completion Criteria

The step is considered complete when:

- [ ] Phase A ran: `docs/DESIGN.md` was found or the user was guided to place it.
- [ ] Phase B ran: `docs/DESIGN.md` passed all 7 quality criteria.
- [ ] Phase C ran: orchestrator built `docs/preview/` directly; all screens from the primary flow are present and `index.html` confirmed on disk.
- [ ] Phase D ran: user reviewed the preview and explicitly approved the design direction.
- [ ] Phase E ran: hard gate presented and user confirmed advancement to Step 5.
- [ ] Step 4 marked `complete` in `docs/<project>/phase-1-session.md`.

## Transition Rules

### Before Advancing

- Confirm `docs/DESIGN.md` exists, has content, and passed Phase B validation.
- Confirm `docs/preview/index.html` exists on disk and contains the CDN Tailwind script tag.
- Present the Gate Summary (Phase E) and wait for explicit user approval.

### Next Step

- **Default**: Step 5 — Roadmap
- **Optional skip**: No
- **User decision required**: Yes — always. User must approve the design direction at Phase E before advancing.

### Transition Record

- **Record**: `docs/<project>/phase-1-session.md`
- **Values**: `complete` / `skipped`

## Exceptions / Special Cases

- If the user confirms the file is placed but `docs/DESIGN.md` is not found on disk, tell the user and wait. Do not assume a different path or proceed without confirmation.
- If the user wants to use their own custom `DESIGN.md` (not from the listed sources), that is allowed. Run Phase B validation on it the same way.
- If Phase C (UI preview build) fails due to a missing dependency or build error, report the exact error to the user and retry with a targeted fix. Do not advance past Phase C with a broken preview.
- If a screen from `prototype-brief.md` is ambiguous or has conflicting information, implement the most conservative interpretation and note the ambiguity in a comment — not guess silently.
- The feedback loop in Phase D has no hard iteration limit. Iterate until the user explicitly approves.

## References

- `templates/05-design-system.md` (quality checklist reference — not filled by an agent in this step)
- `docs/prototype/prototype-brief.md` (screens, flows, mock data for the preview)
- `docs/prototype/journey-map.md` (persona and scenario)
- `kit/orchestrator-conventions.md` (item 6 — fail-fast write instruction)
- `design-taste-frontend` skill
- https://getdesign.md/design-md (getdesign.md — 73+ free design system analyses)
- https://freedesignmd.com (freedesignmd.com — 121+ free design systems)
