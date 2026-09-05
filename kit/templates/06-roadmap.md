# roadmap.md — Output Template for Step 6: Roadmap Generation

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `idea-brief.md`, `market-notes.md`, `prototype/`, `DESIGN.md`
- **Phase 2 Track**: `standard` | `single-pass` <!-- decided at Step 6 gate; see phase-1-bootstrap.md Step 6 Notes for criteria -->

> Product-scope decision, not a technical one. Do not assume any specific tech stack when writing this. The orchestrator reads this file to select the next feature for Phase 2 — keep the `Status` column accurate.

---

## 1. Core User Flow

<!-- The single most important end-to-end flow the MVP must support — usually maps to the primary journey mapped in journey-map.md. Every "Must have" feature below should trace back to a step in this flow. -->

-

---

## 2. Feature List

<!--
One row per feature. Priority uses MoSCoW:
- Must  — MVP is not viable without this
- Should — important but MVP can launch without it
- Could — nice to have, first candidate to cut
- Won't (this round) — explicitly deferred, not forgotten

Size is rough: S / M / L. Status starts as "pending" and is updated by the
orchestrator to "in-progress" / "shipped" as Phase 2 runs.
-->

| ID | Feature | Priority | Size | Depends on | Status |
|---|---|---|---|---|---|
| F01 | | Must | | | pending |
| F02 | | Must | | | pending |
| F03 | | Should | | | pending |
| F04 | | Could | | | pending |

---

## 3. Build Order

<!-- Not the same as priority — this is the sequence Phase 2 will actually process, accounting for dependencies. Usually Must-have features in dependency order, then Should, then Could. -->

1. F01 —
2. F02 —
3.

---

## 4. Explicitly Deferred (Won't this round)

<!-- Features considered but intentionally excluded from this MVP. Keeps them from being silently forgotten or re-litigated later. -->

| Feature | Why deferred |
|---|---|
| | |

---

## 5. Assumptions & Risks

<!-- What has to be true for this roadmap's scope to be right-sized? E.g. "assumes single-user only, no team/collaboration features needed for MVP" -->

-

---

## Gate Checklist (before proceeding to Step 7 — Architecture)

- [ ] Every "Must have" feature traces back to the Core User Flow
- [ ] No tech-stack assumptions embedded in feature descriptions
- [ ] Build order accounts for dependencies, not just priority
- [ ] Deferred features are captured, not silently dropped
- [ ] Phase 2 Track declared (`standard` or `single-pass`) based on the criteria in phase-1-bootstrap.md Step 6 Notes
