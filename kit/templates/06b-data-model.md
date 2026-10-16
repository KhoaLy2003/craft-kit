# data-model.md

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `architecture.md`, `backlog.json`, `prototype/prototype-brief.md`, `specs/*/screens/*.md` *(if Step 5 ran)*
- **Diagrams**: <!-- link to docs/diagrams/data-model-erd.html, or `none` -->
- **Provenance**: `designed (Phase 1 Step 6)` | `backfilled from code on YYYY-MM-DD`

> The logical data model: what the product stores and how the pieces relate. Types are logical; the physical mapping (tables, columns, indexes) belongs to the Phase 2 plan. Every entity traces to a feature or screen; nothing is invented.

---

## 1. Conventions

<!-- Rules that apply to every entity. Logical types only: string, text, int, decimal, bool, date, timestamp, enum(...), json, ref(Entity).
Document-store stacks (stack-catalog D5): "entity" means collection; add an "Embedded / referenced" column to relationship tables. -->

- **ID strategy**:
- **Timestamps**: <!-- e.g. created_at / updated_at on every entity -->
- **Soft-delete policy**:
- **Tenancy / ownership rule**: <!-- who owns a row; how access is scoped -->
- **Naming**: <!-- entity singular PascalCase, field snake_case, etc. -->

---

## 2. Entity overview

<!-- Source = feature IDs when designed; file path when backfilled.
Label = `as-built` | `planned` | `unknown` (backfilled documents only; omit the column when designed). -->

| Entity | Purpose | Owner feature(s) | Source | Label |
|---|---|---|---|---|
| | | | | |

<!-- Required entity-relationship diagram. Every entity in the table above appears here, and every relationship in §3 appears as an edge with cardinality and a verb label.
Give each entity its key attributes only: PK, FK, unique fields, and fields that drive lifecycle or access (full field lists stay in §3).
More than 12 entities: split into one erDiagram per domain cluster, plus one overview with entity names only. -->

```mermaid
erDiagram
    %% e.g.
    %% USER ||--o{ ORDER : places
    %% USER {
    %%   string id PK
    %%   string email UK
    %% }
    %% ORDER {
    %%   string id PK
    %%   string user_id FK
    %%   enum status
    %% }
```

---

## 3. Entity detail

<!-- One block per entity. Copy the block below. Write `unknown` for Access or Lifecycle that cannot be determined. -->

### <Entity>

**Fields:**

| Field | Type | Required | Unique | Default | Notes |
|---|---|---|---|---|---|
| | | | | | |

**Relationships:**

| Target | Cardinality | On delete |
|---|---|---|
| | | |

**Access**: <!-- roles that may read / write -->

**Lifecycle**: <!-- state list and allowed transitions, or "no lifecycle" -->

---

## 4. Feature × Entity matrix

<!-- Rows = every Must and Should feature from backlog.json (ID + name). Columns = entities. Cells = subset of C R U D.
Rules: every feature touching persisted data has a row (or an explicit "no persisted data" note); every entity has at least one writer feature.
Backfilled without backlog.json: replace this whole section's content with the single line `no backlog.json; matrix not derivable`. -->

| Feature | <Entity 1> | <Entity 2> |
|---|---|---|
| | | |

---

## 5. Derived values and invariants

<!-- Computed values with their rule, and cross-entity constraints (e.g. "total = sum of line items"). -->

-

---

## 6. Retention, deletion, sensitive data

| Entity | Retention | Hard / soft delete | PII fields |
|---|---|---|---|
| | | | |

---

## 7. Open questions

<!-- Anything `unknown`, with the entity or field it affects. -->

-
