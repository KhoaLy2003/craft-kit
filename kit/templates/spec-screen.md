# Screen: [Screen Name]

<!--
One file per distinct screen (page, modal, drawer, or named view state) of a feature with two or more
non-trivial screens, at:

    docs/specs/<feature-slug>/screens/<screen-name>.md

For a single-screen feature, describe the screen inside the feature spec instead.

Written at the PRODUCT level: code-agnostic, usable as a design brief. A designer, if present, designs
from this file; the frontend-developer agent reads it with docs/DESIGN.md to build the screen.

Full Screen Design fills sections 1, 2, 6, and 7 (and 3-5 where the prototype brief already answers them)
and leaves section 8 for the feature spec. Fill every section; for an inapplicable one write a line saying
why (e.g. "No data: static informational screen."). Remove this comment block before publishing.
-->

---

**Status:** draft | approved
**Last updated:** <!-- YYYY-MM-DD -->
**Based on:** <!-- e.g. docs/specs/<feature-slug>/spec.md, docs/prototype/prototype-brief.md -->

---

## 1. Identity

| Field | Value |
|---|---|
| **Screen name** | [e.g. "Dashboard", "New Project Form", "Delete Confirmation"] |
| **URL pattern** | [e.g. `/dashboard`, `/projects/:id/settings`, `modal — no own URL`] |
| **Feature(s)** | [feature slug(s) this screen belongs to, e.g. F03 — Dashboard] |
| **Who can access** | [e.g. "Authenticated users", "Admins only", "Public", "Owner of the resource"; add any secondary scoping in plain terms] |
| **On access failure** | [redirect, 403 page, inline message, modal close] |

---

## 2. Purpose

<!-- One paragraph: the single primary job this screen does, what the user arrives prepared to decide or do, and what state they leave in. Do not restate the headers below. -->

---

## 3. Entry and Exit

| Direction | Screen / event | Trigger |
|---|---|---|
| In | [previous screen, redirect, or deep link] | [what the user did or what happened] |
| Out | [destination screen / URL] | [what the user did to get there] |

---

## 4. Content and Data

<!-- WHAT is displayed, not how it is fetched. Include any business rule that changes what is shown, and any derived value with its rule (e.g. "Progress % = completed / total, rounded; 0% when empty"). -->

| # | Content | Notes / rules |
|---|---|---|
| 1 | [e.g. "List of projects, each with name, status badge, last-updated date"] | [e.g. "Archived items hidden unless the filter is active"] |

---

## 5. Interactions

<!-- Every interactive element, one row per user action, described as observable behavior. -->

| Element | Interaction | Result |
|---|---|---|
| [e.g. "New Item" button] | Click | [Opens the New Item form as an inline panel] |

---

## 6. Layout and Responsive Behavior

```
[Screen Name]
├── [Section / area name]
│   ├── [Element — what it contains or does]
│   └── [Element]
└── [Section / area name]
```

| Breakpoint (names from docs/DESIGN.md) | Layout change |
|---|---|
| [e.g. mobile] | [e.g. sidebar collapses to bottom navigation; table becomes stacked cards] |

<!-- Screen-specific design decisions that cannot be inferred from DESIGN.md (e.g. "exactly one primary CTA visible at a time", "destructive actions always need confirmation"). Do not repeat global tokens. -->

---

## 7. States

| State | Condition | What the user sees |
|---|---|---|
| Loading | [while content loads] | [skeleton rows, spinner, instant render from cache] |
| Empty | [e.g. no items yet] | [e.g. empty-state message with a primary CTA] |
| Error | [e.g. no permission; action failed] | [e.g. access-denied message with a link back; inline error under the field, entered values kept] |
| Edge case | [unusual but valid data] | [expected behavior] |

---

## 8. Acceptance Criteria

<!-- Concrete, testable. Reference spec AC codes where they exist; add screen-specific criteria for visual states the spec does not cover. -->

| ID | Criterion | Source |
|---|---|---|
| AC-XX.X | [Criterion text] | [spec / this doc] |
