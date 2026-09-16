# Task → Specialist Agent Rubric

This reference is used in **Phase 2, Step 3 — Assign Specialists**.
After `writing-plans` produces `plan.md`, read each task and annotate it with `Specialist: <agent-name>` using this table as a guide.

> Update this file to match the agents actually configured in your project.

---

## Primary Routing Table

| Task involves... | Signals in the task description | Use agent |
|---|---|---|
| React/Vue/Angular components, CSS, HTML, UI layout | "component", "page", "form", "style", "layout", "UI", "frontend" | `frontend-developer` — **always include `docs/DESIGN.md` + `docs/preview/` in the dispatch brief** (approved visual contract from Phase 1 Step 4) |
| UI visual quality, premium design, anti-generic patterns | "visual quality", "design upgrade", "polish", "no generic patterns", "premium UI" | `frontend-developer` + `design-taste-frontend` skill (**required** — include in every dispatch matching these signals; generic AI patterns are the default failure mode for UI tasks) — **also include `docs/DESIGN.md` + `docs/preview/`** |
| Visual design, icons, mockup implementation, accessibility | "design", "icon", "color", "typography", "accessibility", "a11y" | your general-purpose agent (or a dedicated visual design agent if available) |
| REST/GraphQL API endpoints, controllers, middleware | "endpoint", "route", "controller", "handler", "API" | `backend-developer` |
| Database schema, migrations, queries, ORM models | "schema", "migration", "model", "query", "table", "index" | `backend-developer` |
| Business logic, services, domain rules | "service", "logic", "rule", "calculation", "validation" | `backend-developer` |
| Authentication, authorization, sessions | "auth", "login", "JWT", "session", "permission", "role" | `backend-developer` |
| Infrastructure, CI/CD, environment config | "CI", "deploy", "env", "config", "Docker", "workflow" | your general-purpose agent |
| Tests (unit, integration) | "test", "spec", "assertion", "mock" | same agent as the code being tested |
| Multi-domain task crossing frontend + backend | task describes both UI and API work | **split the task first** |

---

## Splitting Multi-Domain Tasks

If a task touches both frontend and backend, it is two tasks being described as one.
Split before annotating. Example:

**Before split:**
```markdown
### Task 4: Build product listing feature
- Files: Create src/components/ProductList.tsx, src/api/products.ts
```

**After split:**
### Task 4a: Build product listing API endpoint
**Specialist:** `backend-developer`
- Files: Create: src/api/products.ts

### Task 4b: Build product listing UI component
**Specialist:** `frontend-developer`
- Files: Create: src/components/ProductList.tsx
- Depends on: Task 4a (consumes GET /api/products)
```

Splitting makes dependency explicit and enables parallel dispatch when the file scopes are disjoint.

---

## Parallel Dispatch Eligibility

After all tasks are annotated, identify groups that can run in parallel.
Tasks can run in parallel when:
1. Their file scopes do not overlap (no shared files)
2. Neither task depends on the output of the other

Common pattern: all `frontend-developer` tasks for a feature are often independent of each other. Same for all general-purpose-agent API tasks.

Mark parallel-eligible task groups in the plan before dispatching:
```markdown
<!-- Parallel group A: tasks 2, 3 — disjoint files, no dependency -->
```

Then use the `dispatching-parallel-agents` skill for each group, and `subagent-driven-development` skill for sequential chains.

---

## Available Agents Quick Reference

Update this section to match the agents actually configured in your harness. Replace any default names that differ from your harness configuration — particularly for the four harness-dependent roles in the second table.

**Specialist agents (install before starting):**

| Agent | Type | Good for |
|---|---|---|
| `frontend-developer` | Specialist | UI components, pages, CSS, state management; invoke the `design-taste-frontend` skill for premium new UI, `redesign-existing-projects` skill for existing UI upgrades |
| `backend-developer` | Specialist | REST/GraphQL APIs, business logic, database schemas, auth, middleware |
| `code-reviewer` | Review | Code review with spec and constitution compliance check |
| `ui-ux-tester` | Testing | Browser-driven UI/UX flow testing |
| `market-researcher` | Research | Market landscape, competitor analysis |
| `research-analyst` | Research | Technology and domain research, synthesis |
| `sonic` | Mechanical | Simple, repetitive, mechanical edits |
