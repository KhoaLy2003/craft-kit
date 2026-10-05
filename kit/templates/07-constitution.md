# constitution.md

## Metadata

- **Status**: `draft` | `approved`
- **Project**:
- **Version**: 1.0.0
- **Ratified**: <!-- YYYY-MM-DD, original adoption date -->
- **Last amended**: <!-- YYYY-MM-DD; same as Ratified for the first version -->
- **Based on**: `architecture.md`, `DESIGN.md`, `roadmap.md`

> Read by every Phase 2 step. Every principle must be concrete enough to change at least one downstream plan or diff; remove any that wouldn't. Personal workflow preferences (branching habits, PR etiquette) do not belong here, only rules that shape code and architecture output.

---

## Principles

<!--
One block per principle; there is no fixed count (3-5 is enough for a solo project). Each needs:
- A short, specific name (not "Code Quality": name the actual rule)
- MUST rules: non-negotiable, measurable ("functions under 50 lines", "no `any` except documented cases")
- SHOULD rules: strong defaults that can be overridden with justification
- Rationale: why this matters for THIS project, not generic best practice
Common categories: type safety, testing standard, architectural boundaries (tie to architecture.md), error handling, naming, dependency management, security baseline, accessibility baseline.
-->

### Principle 1: <!-- e.g. "Type Safety" -->

**MUST**:
-

**SHOULD**:
-

**Rationale**:

---

### Principle 2: <!-- e.g. "Architectural Boundaries" -->

**MUST**:
-

**SHOULD**:
-

**Rationale**:

---

## Additional Constraints

<!-- Binding rules not phrased as principles: required stack elements from architecture.md, compliance requirements, deployment constraints. -->

-

---

## Governance

### Amendment Procedure

<!-- Solo project: one line is enough, e.g. "Update this file directly and bump Version." Teams, use this process: -->

1. **Propose**: open a pull request changing this file; state which principle is added, removed, or changed and the concrete recent case that motivated it.
2. **Review**: another contributor (or the owner, if solo) approves. Test the principle against recent plans or diffs to verify it would change real decisions.
3. **Ratify**: merge, then update `Version` and `Last amended` per the Versioning Policy.

### Versioning Policy

- **MAJOR**: backward-incompatible principle removals or redefinitions
- **MINOR**: new principle added or materially expanded guidance
- **PATCH**: clarifications, wording, typo fixes with no semantic change

### Compliance Review

<!-- How and when principles are checked against actual output, e.g. "the Phase 2 review step flags any violation explicitly rather than silently fixing it". -->

-
