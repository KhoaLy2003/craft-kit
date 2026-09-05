# prototype-brief.md — Output Template for Step 4: Interactive Prototype

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `idea-brief.md`, `journey-map.md`

> This brief is the spec for the HTML prototype. It documents intent, coverage, and fidelity choices so nothing is left ambiguous.
>
> **Core question this prototype must answer:** *"Are we building the right product, and does the proposed workflow actually work for the people who will use it?"*
>
> **Fidelity rule:** Simple, not confusing. No brand colors, no custom fonts, no visual polish. Minimal CSS for clarity is allowed (headings, fieldsets, recognizable buttons). If it looks like a finished product, strip it back. If it's so bare that the flow is hard to follow, add just enough structure to make it clear.

---

## 1. What This Prototype Covers

<!-- Pulled from journey-map.md Section 4 — the specific flow(s) being made clickable -->

-

---

## 2. Screens and Interactions

<!-- List each screen/interaction in the order a user encounters them.
     Describe structure only: labeled boxes, inputs, buttons, navigation arrows.
     No colors, fonts, or spacing decisions. -->

| Screen | Purpose | Key interactions | File |
|---|---|---|---|
| | | | |
| | | | |

---

## 3. State Coverage

<!-- For each screen, note which states are represented in the prototype.
     Minimum required: happy path + empty state + at least one error/validation state. -->

| Screen | Empty state | Error / validation state | Success state | Notes |
|---|---|---|---|---|
| | | | | |
| | | | | |

---

## 4. Mock Data

<!-- List the realistic mock data used in the prototype.
     Must be plausible — real-feeling names, amounts, dates. Not "Item 1", "User A", or Lorem ipsum.
     Pre-populated data should resemble actual user situations closely enough to generate meaningful feedback. -->

-

---

## 5. Playable Prototype Notes

- **Entry point** (which file to open first):
- **What's clickable** (list each interactive element and what it does):
- **What's deliberately faked** (hardcoded data, simulated logic, no real backend, no persistence):

---

## 6. Assumptions Being Tested

<!-- What does this prototype exist to validate? One assumption per line.
     Tie to the highest-risk items from journey-map.md pain points. -->

-

---

## 7. Feedback Log

<!-- Fill in as the prototype is reviewed. Classify each item:
     Requirement Change | Business Rule Change | User Flow Change | UI/UX Change | Missing Scenario | Technical Constraint | Out of Scope -->

| Date | Reviewer | Feedback | Classification | Action taken |
|---|---|---|---|---|
| | | | | |

---

## Definition of Done Checklist

- [ ] Key requirements from `idea-brief.md` are traceable to at least one screen or interaction
- [ ] Main user flows are complete — each flow has: start point, action, result, and cancel/error path
- [ ] Realistic mock data used — no placeholder text like "Item 1" or "Member name"
- [ ] Empty state is represented on relevant screens
- [ ] At least one validation or error state is demonstrable
- [ ] Success state is represented after completing a key action
- [ ] All faked / hardcoded elements are listed in Section 5
- [ ] Prototype opens as `file://` with no console errors
- [ ] CSS used for structural clarity (layout, grouping, hierarchy, error visibility) — not for brand colors, typography personality, or visual polish (shadows, gradients, animations)
- [ ] Known limitations and assumptions are documented
- [ ] Prototype is ready for review using the review questions in Step 4
