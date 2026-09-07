# DESIGN.md — Output Template for Step 5: Product Design

> **Step 5 has two paths — choose based on what you already have:**
>
> | Path | When to use | What runs |
> |---|---|---|
> | **Import** | You have an existing `DESIGN.md` | Agent extracts + normalizes it into this template; AI design session is skipped |
> | **AI** | No `DESIGN.md` yet | Your general-purpose agent (or a dedicated visual design agent) runs the full design session from the prototype |
>
> Both paths produce the same `docs/DESIGN.md` output and must pass the same gate before Step 6.

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Source**: `imported` | `ai-generated`
- **Based on**: <!-- `prototype/`, `idea-brief.md` (AI path) — or — name of imported file (import path) -->

---

## Import Path — Extraction Checklist

<!-- Skip this section entirely if using the AI path. -->
<!--
When a DESIGN.md is imported:
1. Read the imported file in full.
2. Use it as the source of truth for all sections below — do not invent or supplement from the prototype unless a section is genuinely absent.
3. Work through this checklist before marking Status as `approved`.
-->

- [ ] **Overview** — one-paragraph framing exists (canvas, accent color, shape language, type personality)
- [ ] **Color tokens** — extracted and renamed semantically if needed (e.g. `color-primary`, not `#ff385c` or `rausch`)
- [ ] **Typography scale** — sizes, weights, line-heights, and usage roles captured
- [ ] **Spacing system** — base unit and full token scale documented
- [ ] **Elevation** — shadow tiers (or explicit "no elevation" decision) documented
- [ ] **Core components** — listed with tokens they consume; any component not traceable to the prototype removed
- [ ] **Responsive breakpoints** — breakpoint names, widths, and key layout changes captured
- [ ] **Known gaps** — undocumented or unreliable sections from the imported file flagged explicitly
- [ ] **Reconcile against prototype** — every component kept here must map to something visible in `prototype/`

---

## 1. Design Overview

<!-- One paragraph: the visual personality of the product. Cover the canvas approach (light/dark/neutral), how the primary accent is used (everywhere vs. sparingly), the shape language (sharp / soft / pill), and the typographic tone (loud / quiet / editorial). This section is the "north star" — implementation decisions that feel ambiguous should check back against it.

Import path: pull from the Overview / Key Characteristics section of the imported file.
AI path: write after the designer finalizes direction. -->

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

<!-- Pointer to the actual mock files/screens produced in this step. Import path: mocks may come from the prototype unchanged; note that here. -->

- **Mock location**: <!-- e.g. `prototype/screens/` or link to design tool -->
- **Screens covered**: <!-- list screen names or flows -->

---

## Gate Checklist (before proceeding to Step 6 — Roadmap Generation)

- [ ] Tokens are named semantically, not by raw value or brand name
- [ ] Every core component maps back to something used in the prototype
- [ ] Mock reflects the finalized direction — no unresolved open questions carried over from Step 4
- [ ] Known gaps section is honest and complete (not empty)
- [ ] Import path only: reconciliation against prototype is complete; no orphaned components remain
