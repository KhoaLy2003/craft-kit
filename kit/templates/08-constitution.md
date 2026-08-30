# constitution.md — Output Template for Step 8: Constitution / AI Working Guideline

## Metadata

- **Project**:
- **Version**: 1.0.0
- **Ratified**: <!-- YYYY-MM-DD, original adoption date -->
- **Last amended**: <!-- YYYY-MM-DD, same as ratified date if this is the first version -->
- **Based on**: `architecture.md`, `design-system.md`, `roadmap.md`

> Read by every step in Phase 2. Every principle below must be concrete enough to change at least one downstream plan or diff — remove any principle that wouldn't alter a decision if deleted. Personal workflow preferences (branching habits, PR etiquette) do not belong here; this file only contains rules that shape code and architecture output.

---

## Principles

<!--
One block per principle. Each principle needs:
- A short, specific name (not "Code Quality" — name the actual rule)
- MUST rules: non-negotiable
- SHOULD rules: strong default, can be overridden with justification
- Rationale: why this matters for THIS project specifically, not generic best practice

Avoid vague principles ("code should be clean"). Use measurable criteria
("functions must be under 50 lines", "no `any` types except documented cases").
Add or remove principle blocks as needed — there is no fixed count.
-->

### Principle 1: <!-- e.g. "Type Safety" -->

**MUST**:
-

**SHOULD**:
-

**Rationale**:

---

### Principle 2: <!-- e.g. "Testing Standard" -->

**MUST**:
-

**SHOULD**:
-

**Rationale**:

---

### Principle 3: <!-- e.g. "Architectural Boundaries" — tie back to architecture.md's chosen structure -->

**MUST**:
-

**SHOULD**:
-

**Rationale**:

---

### Principle 4: <!-- e.g. "Error Handling" -->

**MUST**:
-

**SHOULD**:
-

**Rationale**:

<!-- Continue adding principles as needed. Common categories to consider:
naming conventions, dependency management, security baseline, performance
budget, accessibility baseline, commit/PR granularity for AI-generated code. -->

---

## Additional Constraints

<!-- Anything not phrased as a principle but still binding: required tech stack elements from architecture.md, compliance requirements, deployment constraints. -->

-

---

## Governance

### Amendment Procedure

1. **Propose**: Open a pull request that changes this file. The PR description must state which principle is being added, removed, or changed and why — referencing a concrete case from recent development that motivated the change.
2. **Review**: At least one other contributor (or the project owner if solo) must review and explicitly approve the PR. Approving a constitution change is a higher bar than a code review — test the principle against recent plans or diffs to verify it would change real decisions.
3. **Ratify**: Merge the PR and update the `Version` and `Last amended` fields in the Metadata section above. Increment the version number using the Versioning Policy below.

### Versioning Policy

- **MAJOR**: Backward-incompatible principle removals or redefinitions
- **MINOR**: New principle added or materially expanded guidance
- **PATCH**: Clarifications, wording, typo fixes — no semantic change

### Compliance Review

<!-- How/when principles get checked against actual output — e.g. "code-review step in Phase 2 must flag any violation explicitly rather than silently fixing it" -->

-

---

## Gate Checklist (before proceeding to Step 9 — Scaffold)

- [ ] Every principle has at least one MUST rule stated in measurable terms
- [ ] Every principle would change a real decision if removed — none are decorative
- [ ] No personal workflow preferences included (those belong elsewhere)
- [ ] Governance section names a concrete amendment + versioning process
- [ ] Amendment Procedure steps are filled in, not left as blank bullets