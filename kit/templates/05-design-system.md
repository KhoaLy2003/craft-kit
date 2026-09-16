# DESIGN.md — Output Template for Step 4: Product Design

This file is filled in by the user. The orchestrator validates it against the quality checklist in `kit/steps/phase-1/p1-04-design.md` Phase B before dispatching the UI preview build. Fill in every section; leave none blank.

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Source**: <!-- name of the design system file downloaded (e.g. "Linear design system from getdesign.md") -->
- **Based on**: <!-- file origin and date downloaded -->
---

## Validation Checklist

Work through this checklist before notifying the orchestrator that the file is ready. The orchestrator will re-check these same criteria automatically.

- [ ] **Overview** — one-paragraph framing exists (canvas, accent color, shape language, type personality)
- [ ] **Color tokens** — at least 5 semantic tokens (e.g. `color-primary`, `color-background`, `color-text-primary`) with hex/rgb values filled in; names are semantic, not raw values or brand names
- [ ] **Typography scale** — at least 3 levels defined with font size, weight, and line-height; font family named
- [ ] **Spacing system** — base unit stated AND/OR at least 4 spacing token values
- [ ] **Elevation** — shadow tiers (or explicit "no elevation" decision) documented
- [ ] **Core components** — at least 3 components listed with tokens they consume and their interactive states; every component must map to something visible in `docs/prototype/`
- [ ] **Responsive breakpoints** — at least 2 breakpoints named with pixel widths
- [ ] **Known gaps** — undocumented or unreliable sections flagged explicitly (section must not be empty)
- [ ] **File length** — at least 300 words (not a stub)

---

## 1. Design Overview

<!-- One paragraph: the visual personality of the product. Cover the canvas approach (light/dark/neutral), how the primary accent is used (everywhere vs. sparingly), the shape language (sharp / soft / pill), and the typographic tone (loud / quiet / editorial). This section is the "north star" — implementation decisions that feel ambiguous should check back against it. Pull from the Overview / Key Characteristics section of your source file. -->

---

## 2. Design Tokens

<!-- The atomic values everything else is built from. Keep names semantic (e.g. `color-primary`, not `blue-500`) so they survive a future rebrand without renaming every usage. -->

### Color

| Token | Value | Usage |
|---|---|---|
| `color-primary` | | |
| `color-primary-active` | | |
| `color-primary-disabled` | | |
| `color-background` | | |
| `color-surface` | | |
| `color-surface-soft` | | |
| `color-text-primary` | | |
| `color-text-secondary` | | |
| `color-text-muted` | | |
| `color-border` | | |
| `color-success` | | |
| `color-warning` | | |
| `color-danger` | | |
| `color-on-primary` | | |

<!-- Add sub-brand or semantic variants as needed. Remove rows not used in the product. -->

### Typography

| Token | Font / Size / Weight / Line-height | Usage |
|---|---|---|
| `font-display-xl` | | |
| `font-display-lg` | | |
| `font-display-md` | | |
| `font-title` | | |
| `font-body` | | |
| `font-body-sm` | | |
| `font-caption` | | |
| `font-button` | | |

<!-- Add or remove rows to match actual scale. Note the font family and fallback stack below. -->

**Font family**: <!-- e.g. "Inter, -apple-system, system-ui, sans-serif" -->

**Typographic philosophy**: <!-- brief note on weight/size strategy — e.g. "modest weights; photography carries visual hierarchy" -->

### Spacing

<!-- A consistent scale prevents arbitrary spacing values creeping in during implementation. -->

| Token | Value | Primary usage |
|---|---|---|
| `space-xxs` | | |
| `space-xs` | | |
| `space-sm` | | |
| `space-md` | | |
| `space-lg` | | |
| `space-xl` | | |
| `space-xxl` | | |
| `space-section` | | |

**Base unit**: <!-- e.g. 4px or 8px -->

### Shape (radius)

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | | |
| `radius-md` | | |
| `radius-lg` | | |
| `radius-full` | | |

---

## 3. Elevation

<!-- Document the shadow tiers, or explicitly state there are none. Restraint here is a design decision — "one shadow tier or flat" is a valid and complete answer. -->

| Tier | Definition | Used on |
|---|---|---|
| Flat | no shadow | |
| Raised | | |
| Modal | | |

<!-- Add or remove tiers. If there is only one shadow in the system, one row is correct. -->

---

## 4. Core Components

<!-- List only the components needed for the MVP, traced directly to the prototype. Not a component library — just what this product uses. Include the primary tokens each component consumes. -->

| Component | Description | Tokens used | States |
|---|---|---|---|
| Button (primary) | | | default, hover, active, disabled |
| Button (secondary) | | | |
| Input field | | | default, focus, error |
| Card | | | default, hover |
| Navigation | | | |

<!-- Add rows as needed. Remove rows for components the prototype didn't need. -->

---

## 5. Layout Principles

<!-- High-level rules that apply across screens, not per-component. -->

- **Grid / breakpoints**: <!-- column count and gutter at each breakpoint -->
- **Max content width**: <!-- e.g. 1280px editorial, 1080px listing pages -->
- **Responsive approach**: <!-- mobile-first / desktop-first -->
- **Whitespace philosophy**: <!-- e.g. "generous section padding, compressed card gutters" -->

### Responsive Breakpoints

| Name | Width | Key layout changes |
|---|---|---|
| Mobile | | |
| Tablet | | |
| Desktop | | |
| Wide | | |

<!-- Document actual breakpoints only — remove rows that don't have distinct behavior. -->

---

## 6. Voice & Tone

<!-- Optional — fill only if the product has explicit UI copy guidelines. Leave blank or remove section if not applicable. -->

- **Tone**: <!-- e.g. friendly, formal, playful -->
- **Things to avoid**: <!-- e.g. passive voice, jargon, filler words -->

---

## 7. Known Gaps

<!-- Required section. Document what is intentionally NOT covered — hover states, loading/skeleton states, dark mode, error states, etc. A short honest list here prevents scope creep during implementation. Import path: carry over the "Known Gaps" section from the imported file and add any gaps introduced by reconciling with the prototype. -->

-
-

---

## 8. Finalized Mock Reference

<!-- Pointer to the UI preview built by `frontend-developer` in Step 4 Phase C, and the prototype screens it was based on. -->

- **Mock location**: <!-- e.g. `prototype/screens/` or link to design tool -->
- **Screens covered**: <!-- list screen names or flows -->

---

## Gate Checklist (before proceeding to Step 5 — Roadmap Generation)

- [ ] Tokens are named semantically, not by raw value or brand name
- [ ] Every core component maps back to something visible in `docs/prototype/`
- [ ] Known gaps section is honest and complete (not empty)
- [ ] Reconciliation against prototype is complete; no orphaned components remain
- [ ] UI preview (`docs/preview/`) reflects this design system; user has reviewed and approved it
