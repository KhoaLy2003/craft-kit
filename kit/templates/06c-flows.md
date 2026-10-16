# flows.md

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `architecture.md`, `data-model.md`, `prototype/prototype-brief.md`, `prototype/journey-map.md`, `specs/*/screens/*.md` *(if Step 5 ran)*
- **Diagrams**: <!-- links to docs/diagrams/flows-*.html, or `none` -->
- **Provenance**: `designed (Phase 1 Step 6)` | `backfilled from code on YYYY-MM-DD`

> How screens connect and how data moves between screens, features and services. Entity names must match `data-model.md`.

---

## 1. Screen inventory

<!-- Source = docs/specs/<slug>/screens/<name>.md, or the docs/prototype/prototype-brief.md row when Step 5 was skipped, or a file path when backfilled.
Label = `as-built` | `planned` | `unknown` (backfilled documents only; omit the column when designed).
"Feature" and "Who can access": write `unknown` when not determinable. -->

| Screen | URL pattern | Feature | Who can access | Source | Label |
|---|---|---|---|---|---|
| | | | | | |

---

## 2. Screen flow

<!-- One flowchart per role or area: nodes = screens, edges labelled with the trigger. -->

```mermaid
flowchart LR
    %% e.g. Login -->|submit| Dashboard
```

**Guards:**

| Screen | Condition | On failure (redirect / 403 / inline) |
|---|---|---|
| | | |

**Orphans and dead ends:**

<!-- Screens with no incoming edge (except entry points) or no outgoing edge, each justified, or `none`. -->

-

---

## 3. Data flow

<!-- One subsection per core flow: take each flow from docs/prototype/journey-map.md Section 4 and docs/roadmap.md §1 Core User Flow.
Backfilled: one subsection per screen group or API route/action found in the code.
Add a Mermaid sequenceDiagram only for flows that cross an external service. -->

### <Flow name>

| Step | Screen / trigger | Operation (read / write / call) | Entities touched | Result / next screen |
|---|---|---|---|---|
| 1 | | | | |

---

## 4. Cross-feature hand-offs

<!-- Data created in one feature and consumed in another. -->

| Producer feature | Entity | Consumer feature | Timing |
|---|---|---|---|
| | | | |

---

## 5. External integrations and events

<!-- From architecture.md §6. -->

| System | Direction | Data | Trigger | Failure behaviour |
|---|---|---|---|---|
| | | | | |

---

## 6. Open questions

-
