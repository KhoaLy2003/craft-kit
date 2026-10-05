# prototype-brief.md

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `idea-brief.md`, `journey-map.md`, `DESIGN.md`

> This brief is the spec for the HTML prototype (`docs/preview/`). It documents intent, coverage, and fidelity choices so nothing is left ambiguous.
>
> **Core question the prototype must answer:** *"Are we building the right product, and does the proposed workflow actually work for the people who will use it?"*
>
> **Fidelity rule:** structure and flow first. Every visual value (color, font, spacing, radius, shadow) comes from `docs/DESIGN.md`; invent none. If it is so bare the flow is hard to follow, add just enough structure to make it clear.

---

## 1. What This Prototype Covers

<!-- From journey-map.md Section 4: the flow(s) being made clickable. -->

-

---

## 2. Screens and Interactions

<!-- Each screen/interaction in the order a user meets it. Structure only: labeled boxes, inputs, buttons, navigation. Visual values come from DESIGN.md at build time. -->

| Screen | Purpose | Key interactions | File |
|---|---|---|---|
| | | | |
| | | | |

---

## 3. State Coverage

<!-- Which states each screen represents. Minimum: happy path + empty state + at least one error/validation state. -->

| Screen | Empty state | Error / validation state | Success state | Notes |
|---|---|---|---|---|
| | | | | |
| | | | | |

---

## 4. Mock Data

<!-- Plausible, real-feeling names, amounts, dates. Never "Item 1", "User A", or Lorem ipsum. Pre-populated data should resemble real user situations closely enough to generate meaningful feedback. -->

-

---

## 5. Playable Prototype Notes

- **Entry point** (which file to open first):
- **What's clickable** (each interactive element and what it does):
- **What's deliberately faked** (hardcoded data, simulated logic, no backend, no persistence):
- **Deferred platforms** (only if the idea targets several platforms: name the secondary ones; they are out of scope for this prototype):

---

## 6. Assumptions Being Tested

<!-- One assumption per line, tied to the highest-risk pain points in journey-map.md. -->

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
- [ ] Main user flows are complete — each has a start point, action, result, and cancel/error path
- [ ] Realistic mock data used — no placeholder text like "Item 1" or "Member name"
- [ ] Empty state is represented on relevant screens
- [ ] At least one validation or error state is demonstrable
- [ ] Success state is represented after completing a key action
- [ ] All faked / hardcoded elements are listed in Section 5
- [ ] Prototype opens as `file://` with no console errors
- [ ] CSS serves structural clarity (layout, grouping, hierarchy, error visibility) and every visual value comes from `docs/DESIGN.md`
- [ ] Known limitations and assumptions are documented
- [ ] Prototype is ready for review using the review questions in the Prototype & Design step
