# Task → Specialist Agent Rubric

Used in **Phase 2, Step 2 — Plan**. Give every task one `Specialist:` line using this table.

> Update this file to match the agents actually configured in your harness.

---

## Routing

| Task involves... | Specialist | Also use |
|---|---|---|
| Code review, spec and constitution compliance | `code-reviewer` | — |
| Everything else: frontend, backend, database, auth, infrastructure, tests, research, visual design | `task` (general-purpose agent) | — |
| UI visual quality: "visual quality", "design upgrade", "polish", "premium UI" | `task` | `design-taste-frontend` skill (**required** for these signals) |
| Admin site screens under `admin/` | `task` | `evon:ui-ux` skill when available (optional; see `kit/guides/admin-blueprint.md` §6) |

Every frontend dispatch follows the Frontend dispatch contract in `kit/orchestrator-conventions.md`.

---

## Annotation Format

```markdown
### Task 2: Build login form component
**Specialist:** task
- Files: Create: src/components/LoginForm.tsx
```

---

## Splitting Multi-Domain Tasks

A task that touches both frontend and backend may stay whole or be split. Split when the dependency between the two parts matters for ordering or parallel dispatch.

```markdown
### Task 4a: Build product listing API endpoint
**Specialist:** task
- Files: Create: src/api/products.ts

### Task 4b: Build product listing UI component
**Specialist:** task
- Files: Create: src/components/ProductList.tsx
- Depends on: Task 4a (consumes GET /api/products)
```

---

## Parallel Groups

Tasks can run in parallel when (1) their file scopes do not overlap and (2) neither depends on the other's output. Mark each group in the plan with one comment line:

```markdown
<!-- Parallel group A: tasks 2, 3 — disjoint files, no dependency -->
```

Step 3 dispatches each group with `dispatching-parallel-agents` and every sequential chain with `subagent-driven-development`; it does not re-decide the groups.
