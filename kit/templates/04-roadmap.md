# roadmap.md

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `idea-brief.md`, `market-notes.md`, `prototype/`, `DESIGN.md`
- **Phase 2 Scope**: `all` | `feature` <!-- recommended from the criteria in kit/steps/phase-1/p1-04-roadmap.md; confirmed by the user -->
- **Admin Site**: `yes` | `no` | `later` <!-- asked at Step 4; a hint for kit/phase-admin.md only. Never a feature row; not counted in the Phase 2 Scope criteria. -->

> Product-scope decision, not a technical one. Assume no tech stack. The orchestrator reads this file to pick the next feature for Phase 2, so keep the `Status` column accurate.

---

## 1. Core User Flow

<!-- The single most important end-to-end flow the MVP must support, usually the primary journey in journey-map.md. Every Must feature below traces back to a step in it. -->

-

---

## 2. Feature List

<!--
One row per feature. Priority uses MoSCoW:
- Must  — MVP is not viable without this
- Should — important but MVP can launch without it
- Could — nice to have, first candidate to cut
- Won't (this round) — explicitly deferred, not forgotten

Size is rough: S / M / L. Status starts "pending"; the orchestrator moves it to "in-progress" / "shipped" as Phase 2 runs.
-->

| ID | Feature | Priority | Size | Depends on | Status |
|---|---|---|---|---|---|
| F01 | | Must | | | pending |
| F02 | | Must | | | pending |
| F03 | | Should | | | pending |
| F04 | | Could | | | pending |

---

## 3. Build Order

<!-- The sequence Phase 2 actually processes, accounting for dependencies. Usually Must in dependency order, then Should, then Could. -->

1. F01 —
2. F02 —
3.

---

## 4. Explicitly Deferred (Won't this round)

<!-- Considered but intentionally excluded from this MVP. Keeps them from being forgotten or re-litigated. -->

| Feature | Why deferred |
|---|---|
| | |

---

## 5. Phase 2 Scope Decision

| Criterion | Score (`all` / `feature`) |
|---|---|
| Must feature count | |
| Feature sizes | |
| Domains | |
| Dependency structure | |
| Developers | |

**Recommendation and rationale** (one line):

---

## 6. Assumptions & Risks

<!-- What has to be true for this scope to be right-sized? E.g. "assumes single-user only, no collaboration for MVP". -->

-

<!-- Phase 3 appends `## Release <slug>` blocks below this line. Never edit shipped rows above. -->
