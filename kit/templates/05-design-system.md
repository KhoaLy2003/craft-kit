# design-system.md — Output Template for Step 5: Product Design

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `prototype/`, `idea-brief.md`

---

## 1. Design Tokens

<!-- The atomic values everything else is built from. Keep names semantic (e.g. "color-primary", not "blue-500") so they survive a future rebrand without renaming every usage. -->

### Color

| Token | Value | Usage |
|---|---|---|
| `color-primary` | | |
| `color-secondary` | | |
| `color-background` | | |
| `color-surface` | | |
| `color-text-primary` | | |
| `color-text-secondary` | | |
| `color-success` | | |
| `color-warning` | | |
| `color-danger` | | |

### Typography

| Token | Font / Size / Weight | Usage |
|---|---|---|
| `font-heading` | | |
| `font-body` | | |
| `font-caption` | | |

### Spacing

<!-- A consistent scale (e.g. 4/8/16/24/32/48px) prevents arbitrary spacing values creeping into implementation later. -->

| Token | Value |
|---|---|
| `space-xs` | |
| `space-sm` | |
| `space-md` | |
| `space-lg` | |
| `space-xl` | |

### Other tokens (radius, shadow, motion — add if relevant)

-

---

## 2. Core Components

<!-- List only the components actually needed for the MVP, based on the prototype. Not a full component library — just what this product uses. -->

| Component | Description | Tokens used | Notes |
|---|---|---|---|
| Button (primary) | | | |
| Button (secondary) | | | |
| Input field | | | |
| Card | | | |
| Navigation | | | |

<!-- Add rows as needed. Remove rows for components the prototype didn't need. -->

---

## 3. Layout Principles

<!-- High-level rules that apply across screens, not per-component -->

- **Grid / breakpoints**:
- **Responsive behavior** (mobile-first? desktop-first?):
- **Max content width**:

---

## 4. Voice & Tone (if relevant to UI copy)

- **Tone**: <!-- e.g. friendly, formal, playful -->
- **Things to avoid**:

---

## 5. Finalized Mock Reference

<!-- Pointer to the actual mock files/screens produced in this step -->

- **Mock location**:
- **Screens covered**:

---

## Gate Checklist (before proceeding to Step 6 — Roadmap Generation)

- [ ] Tokens are named semantically, not by raw value
- [ ] Every core component maps back to something used in the prototype
- [ ] Mock reflects the finalized direction — no unresolved open questions carried over from Step 4
