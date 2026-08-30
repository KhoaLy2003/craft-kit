# architecture.md — Output Template for Step 7: Tech Stack & Architecture Decision

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `tech-options.md`, `design-system.md`, `roadmap.md`

> This is the final decision. `tech-options.md` was exploratory — this document commits.

---

## 1. Context

<!-- The situation driving this decision. Pull from tech-options.md's requirements, plus roadmap.md's scope/complexity (feature count, sizes) as they affect the choice. -->

-

---

## 2. Decision

<!-- State the chosen stack clearly, in active voice. Not a comparison — the answer. -->

**Stack**:

**High-level architecture**: <!-- e.g. monolith, modular monolith, client-server with X API style -->

---

## 3. Options Considered

<!-- Pulled from tech-options.md. For each option NOT chosen, state why in one line. -->

| Option | Considered | Rejected because |
|---|---|---|
| | | |
| | | |

---

## 4. Reasoning

<!-- Why this decision fits the roadmap's actual scope. Explicitly avoid over-engineering: name what complexity was deliberately NOT adopted because the MVP doesn't need it yet. -->

-

**Complexity deliberately avoided for MVP scope**:

-

---

## 5. System Overview

<!-- A short structural description — components/layers and how they talk to each other. Diagram optional but encouraged (can be a simple text-based diagram). -->

```
<!-- e.g.
[Client] → [API Layer] → [Service Layer] → [Database]
-->
```

**Key components**:

| Component | Responsibility | Technology |
|---|---|---|
| | | |
| | | |

---

## 6. Data & Integration

- **Primary datastore**:
- **External integrations/APIs**:
- **Auth approach**:

---

## 7. Consequences

<!-- What this decision makes easier, and what it makes harder or constrains later. Both sides required. -->

**Easier**:

-

**Harder / constraints introduced**:

-

---

## 8. Risks & Unknowns

<!-- Anything not yet validated that this decision depends on -->

-

---

## Gate Checklist (before proceeding to Step 8 — Constitution)

- [ ] Decision is explicit and final, not left as a comparison
- [ ] Reasoning ties back to roadmap.md's actual scope, not generic best practice
- [ ] Consequences section names real tradeoffs, not just upsides
- [ ] No unresolved "TBD" on core stack choices
