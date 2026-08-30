# Task → Specialist Agent Rubric

This reference is used in **Phase 2, Step 3 — Assign Specialists**.
After `writing-plans` produces `plan.md`, read each task and annotate it with `Specialist: <agent-name>` using this table as a guide.

> Update this file to match the agents actually configured in your project. If you have a `backend-developer` agent, add it. If you don't have `ui-ux-tester`, remove it.

---

## Primary Routing Table

| Task involves... | Signals in the task description | Use agent |
|---|---|---|
| React/Vue/Angular components, CSS, HTML, UI layout | "component", "page", "form", "style", "layout", "UI", "frontend" | `frontend-developer` |
| Visual design, icons, mockup implementation, accessibility | "design", "icon", "color", "typography", "accessibility", "a11y" | `designer` |
| REST/GraphQL API endpoints, controllers, middleware | "endpoint", "route", "controller", "handler", "API" | `task` *(or a backend-developer agent if configured)* |
| Database schema, migrations, queries, ORM models | "schema", "migration", "model", "query", "table", "index" | `task` |
| Business logic, services, domain rules | "service", "logic", "rule", "calculation", "validation" | `task` |
| Authentication, authorization, sessions | "auth", "login", "JWT", "session", "permission", "role" | `task` |
| Infrastructure, CI/CD, environment config | "CI", "deploy", "env", "config", "Docker", "workflow" | `task` |
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
```markdown
### Task 4a: Build product listing API endpoint
**Specialist:** task
- Files: Create: src/api/products.ts

### Task 4b: Build product listing UI component
**Specialist:** frontend-developer
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

Common pattern: all `frontend-developer` tasks for a feature are often independent of each other. Same for all `task`-type API tasks.

Mark parallel-eligible task groups in the plan before dispatching:
```markdown
<!-- Parallel group A: tasks 2, 3 — disjoint files, no dependency -->
```

Then use `/skill:dispatching-parallel-agents` for each group, and `/skill:subagent-driven-development` for sequential chains.

---

## Available Agents Quick Reference

Update this section for your specific project setup:

| Agent | Type | Good for |
|---|---|---|
| `task` | General | Business logic, API, DB, config, anything without a better fit |
| `frontend-developer` | Specialist | UI components, pages, CSS, state management |
| `designer` | Specialist | Visual design, accessibility, icon/image assets |
| `code-reviewer` | Review | Code review with spec and constitution compliance check |
| `qa-expert` | Testing | Test planning, API/data-flow E2E testing |
| `ui-ux-tester` | Testing | Browser-driven UI/UX flow testing |
| `market-researcher` | Research | Market landscape, competitor analysis |
| `research-analyst` | Research | Technology and domain research, synthesis |
| `librarian` | Research | Source-verified library and API research |
| `scout` | Research | Read-only fast code investigation |
| `sonic` | Mechanical | Simple, repetitive, mechanical edits |
