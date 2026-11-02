# api.md

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: <!-- the route, handler, schema, and interface files actually read, plus `architecture.md` and `data-model.md` when present -->
- **Provenance**: `backfilled from code on YYYY-MM-DD`

> The API surface of the system as built: the HTTP endpoints it exposes and the interfaces its modules expose to each other. Written by `kit/phase-api-backfill.md`; nothing is invented. Entity fields live in `data-model.md`; this document names an entity and links to it instead of repeating its fields. `Label` is `as-built` (found in code), `planned` (only in specs or the prototype), `undocumented` (in code, absent from existing docs), or `unknown` (ambiguous). `Source` is a file path with a line range.

---

## 1. Conventions

<!-- Rules that apply to every endpoint. Write `unknown` where the code does not show it. -->

- **Base path and versioning**:
- **Authentication**: <!-- scheme and where it is enforced (middleware, guard, decorator) -->
- **Request and response format**: <!-- e.g. JSON; envelope shape if any -->
- **Error format**: <!-- status codes used and the error body shape -->
- **Pagination, filtering, rate limits**:

---

## 2. Endpoint overview

<!-- One row per endpoint, route handler, or server action. Group by resource. -->

| Endpoint | Method | Path | Purpose | Auth | Source | Label |
|---|---|---|---|---|---|---|
| | | | | | | |

---

## 3. Endpoint detail

<!-- One block per endpoint. Copy the block below. Write `unknown` for anything the code does not show. Request and response fields name the validation rule found in the code (schema, DTO, decorator); do not infer rules. -->

### <Method> <path>

**Purpose**:

**Access**: <!-- roles or guards that may call it -->

**Request:**

| Field | Where (path / query / body / header) | Type | Required | Validation | Notes |
|---|---|---|---|---|---|
| | | | | | |

**Response:**

| Status | Body | Notes |
|---|---|---|
| | | |

**Entities touched**: <!-- names from data-model.md -->

---

## 4. Internal APIs

<!-- Interfaces, classes, or modules that other modules or packages call across a boundary (a service layer, repository, SDK client, shared library). Not every exported function: sample by directory and record what was not covered. -->

### <Interface or class name>

**Source**: <!-- file path -->

**Used by**: <!-- calling modules, or `unknown` -->

| Method | Parameters | Returns | Purpose |
|---|---|---|---|
| | | | |

---

## 5. Open questions

<!-- Every `unknown` and `planned` item, and every conflict with existing docs, with the endpoint or interface it affects. -->

-
