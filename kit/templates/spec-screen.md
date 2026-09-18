# Screen: [Screen Name]

<!--
WHEN TO USE THIS TEMPLATE
=========================
Create one instance of this file per distinct screen (page, modal, drawer, or named view state)
for any feature with two or more non-trivial screens. File per screen at:

    docs/specs/<feature-slug>/screens/<screen-name>.md

For a single-screen feature, inline screen description inside the feature spec instead.

This document is written at the PRODUCT level — code-agnostic, suitable as a design brief.
The frontend-developer agent reads this alongside docs/DESIGN.md to build each screen.
Designers, if present, follow this document to produce designs; developers follow those designs
to write code.

Fill every section. For genuinely inapplicable sections write one line explaining why
(e.g. "No data — static informational screen."). Never delete a section.

Metadata markers:
  [REQUIRED]       Must be filled before the document is considered complete.
  [IF APPLICABLE]  Fill only when relevant; otherwise write "N/A — <reason>".
  [OPTIONAL]       Context-dependent; omit only when it adds no clarity.

Remove this comment block before publishing.
-->

---

**Status:** draft | approved
**Last updated:** <!-- YYYY-MM-DD -->
**Based on:** <!-- e.g. docs/specs/<feature-slug>/spec.md, docs/prototype/prototype-brief.md -->

---

## 1. Identity

| Field | Value |
|---|---|
| **Screen name** | [Human-readable name, e.g. "Dashboard", "New Project Form", "Delete Confirmation"] |
| **URL pattern** | [e.g. `/dashboard`, `/projects/:id/settings`, `modal — no own URL`] |
| **Access tier** | [Who can open this screen, e.g. "Authenticated users", "Admins only", "Public / unauthenticated", "Owner of the resource"] |
| **Feature(s)** | [Feature slug(s) this screen belongs to, e.g. F03 — Dashboard, F09 — Filters] |

---

## 2. Purpose

<!--
One paragraph. Answer: what job does this screen do for the user, and why does it exist
at this point in the product? Avoid restating section headers below.
-->

[The single primary job this screen performs. What decision or action does the user arrive
prepared to make, and what state do they leave in?]

---

## 3. Access Control

| Attribute | Detail |
|---|---|
| **Who can access** | [e.g. "Any authenticated user", "Only the user who created the record", "Users with the admin role"] |
| **On auth failure** | [What happens if the user is not authenticated or lacks permission — redirect, 403 page, inline message, modal close] |
| **Additional scoping** | [Any secondary checks beyond the top-level role, described in plain terms — e.g. "User must be a member of the workspace that owns this resource." Write "None" if access is solely role-based.] |

---

## 4. Entry Points

<!--
Every legitimate path by which a user can arrive at this screen.
Include redirects on login, post-action navigations, and deep links.
-->

| Source | Trigger |
|---|---|
| [Previous screen or system event] | [What the user did / what event occurred] |
| … | … |

---

## 5. Content & Data

<!--
Describe WHAT is displayed — not how it is fetched.
Think: if you were briefing a designer, what information would they need to know exists on the screen?
-->

### 5.1 Displayed content

| # | Content | Notes |
|---|---|---|
| 1 | [e.g. "List of projects, each showing name, status badge, and last-updated date"] | [Any business rule affecting what's shown, e.g. "Archived items excluded unless filter is active"] |
| … | … | … |

### 5.2 User actions

<!--
Every write or trigger operation the user can initiate from this screen.
Describe outcomes in user-observable terms — no function names, no DB tables.
-->

| Action | What the user does | Outcome |
|---|---|---|
| [e.g. "Create item"] | [Fills form and submits] | [New item appears in the list; user lands on the detail screen] |
| … | … | … |

### 5.3 Computed / derived values

<!--
Values that are calculated from raw data before display.
Describe the rule, not the implementation.
If nothing is derived, write: "N/A — all values are displayed as stored."
-->

| Value | Rule |
|---|---|
| [e.g. Progress %] | [Completed items divided by total items, rounded to the nearest whole number. Shown as 0% when no items exist.] |
| … | … |

---

## 6. Layout & Structure

<!--
Describe the visual structure top-to-bottom. Reference named sections and UI patterns,
not CSS classes. This gives the developer and designer a spatial brief without prescribing
implementation.
-->

### 6.1 Page structure

```
[Screen Name]
├── [Section / area name]
│   ├── [Element — what it contains or does]
│   └── [Element]
├── [Section / area name]
│   └── [Element]
└── [Footer / auxiliary area, if any]
```

### 6.2 Key UI elements

<!--
Named elements that need explicit description — forms, tables, cards, panels.
Describe their content and role, not styling.
-->

| Element | Contains | Notes |
|---|---|---|
| [e.g. Item card] | [Name, status, last-updated, action menu] | [One card per item; card is clickable and navigates to the detail screen] |
| … | … | … |

### 6.3 Responsive behavior

<!--
[IF APPLICABLE]
Describe layout changes across breakpoints. Reference breakpoint names from docs/DESIGN.md.
If the layout is identical at all sizes, write "No layout changes — single-column at all breakpoints."
-->

| Breakpoint | Layout change |
|---|---|
| [e.g. mobile < 768 px] | [e.g. Sidebar collapses to a bottom navigation bar; table collapses to stacked cards] |
| [e.g. desktop ≥ 1280 px] | [e.g. Two-column layout; sidebar fixed; content scrollable] |
| … | … |

---

## 7. Interactions

<!--
Every interactive element on the screen. One row per user action.
Describe observable behavior — what the user sees happen — not implementation.
-->

| Element | Interaction | Result |
|---|---|---|
| [e.g. "New Item" button] | Click | [Opens the New Item form as an inline panel] |
| [e.g. Status filter] | Select value | [List filters in place; URL query param updated; no page reload] |
| … | … | … |

---

## 8. States

### 8.1 Loading

[How the screen behaves while content is loading — skeleton rows, spinner, instant render from cache, etc.]

### 8.2 Empty

| Condition | What the user sees |
|---|---|
| [e.g. No items yet] | [Centered empty-state illustration with message "Nothing here yet" and a primary CTA button] |
| … | … |

### 8.3 Error

| Error | Cause | What the user sees |
|---|---|---|
| [e.g. No permission] | [User navigates directly to a URL they do not own] | [Access denied message; no sensitive data exposed; link back to safe screen] |
| [e.g. Action failed] | [Server rejects a form submission] | [Inline error below the relevant field; form retains entered values] |
| … | … | … |

### 8.4 Edge cases

<!--
Unusual but valid data combinations that produce non-obvious UI.
Reference spec AC codes where applicable.
-->

| Condition | Expected behavior |
|---|---|
| [e.g. Item has no associated records] | [Count shows 0; no badge is displayed; action is still available] |
| … | … |

---

## 9. Navigation out

| Destination | Trigger |
|---|---|
| [Screen name / URL] | [What the user did to get there] |
| … | … |

---

## 10. Design notes

<!--
[IF APPLICABLE]
Screen-specific design decisions a designer or developer needs to know but cannot infer from
docs/DESIGN.md. Do not duplicate global tokens — only screen-level decisions.
-->

- [e.g. "Exactly one primary call-to-action visible at any time."]
- [e.g. "Destructive actions (delete, archive) always require a confirmation step before executing."]

---

## 11. Acceptance criteria

<!--
Concrete, testable criteria. Reference spec AC codes where they exist.
Add screen-specific criteria for visual states the spec does not address.
-->

| ID | Criterion | Source |
|---|---|---|
| AC-XX.X | [Criterion text] | [spec / this doc] |
| … | … | … |

---

## 12. Open questions

<!--
[OPTIONAL — remove section when all questions are resolved]
Unresolved product or design decisions that must be answered before implementation begins.
-->

- [ ] [Question]
