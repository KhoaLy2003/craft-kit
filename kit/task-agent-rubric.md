# Task → Specialist Agent Rubric

> **Agent-facing reference.** Written for the AI; you do not need to read it to use the kit. To know what to say, see [What to Say to the AI](/guides/what-to-say).

Used in **Phase 2, Step 2 — Plan**. Every task runs on `task`, your platform's general-purpose agent (update this file if your harness names it differently). Write a `Specialist:` line only for a task that needs a skill from the table; a task without one defaults to `task`.

---

## Routing

| Task involves... | Specialist line | Skill |
|---|---|---|
| UI visual quality: "visual quality", "design upgrade", "polish", "premium UI" | `task + design-taste-frontend` | `design-taste-frontend` (**required** for these signals) |
| Diagrams: entity-relationship, architecture, screen flow, data flow, sequence | `task + archify` | `archify` (**required** for the HTML render; see `kit/guides/diagrams.md`) |
| Admin site screens under `admin/` | `task` | none; build from the screen contracts in `kit/guides/admin-checklist.md` and `docs/DESIGN.md` |

Everything else (frontend, backend, database, auth, infrastructure, tests, research) needs no `Specialist:` line. Review skills are loaded by Step 4 itself (`kit/steps/phase-2/p2-04-review.md`).

Every UI dispatch follows the Design dispatch contract in `kit/orchestrator-conventions.md`.

---

## Annotation Format

```markdown
### Task 2: Polish the login form
**Specialist:** task + design-taste-frontend
- Files: Modify: src/components/LoginForm.tsx
```

---

## Splitting Multi-Domain Tasks

A task that touches both frontend and backend may stay whole or be split. Split when the dependency between the two parts matters for ordering or parallel dispatch.

```markdown
### Task 4a: Build product listing API endpoint
- Files: Create: src/api/products.ts

### Task 4b: Build product listing UI component
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
