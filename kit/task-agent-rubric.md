# Task → Specialist Agent Rubric

Used in **Phase 2, Step 2 — Plan**. After `writing-plans` produces the plan, read each task and give it one `Specialist:` line using this table.

> Update this file to match the agents actually configured in your harness.

---

## Annotation Format

One `Specialist:` line directly under the task heading. Use `task` for the general-purpose agent.

```markdown
### Task 2: Build login form component
**Specialist:** frontend-developer
- Files: Create: src/components/LoginForm.tsx
```

---

## Primary Routing Table

| Task involves... | Signals in the task description | Use agent |
|---|---|---|
| React/Vue/Angular components, CSS, HTML, UI layout | "component", "page", "form", "style", "layout", "UI", "frontend" | `frontend-developer` — dispatch per the Frontend dispatch contract in `kit/orchestrator-conventions.md` |
| UI visual quality, premium design, anti-generic patterns | "visual quality", "design upgrade", "polish", "no generic patterns", "premium UI" | `frontend-developer` + `design-taste-frontend` skill (**required** for tasks matching these signals; generic AI patterns are the default failure mode for UI work) |
| Admin site UI screens under `admin/` (shell, dashboard, list, detail, form, audit log, settings) | "admin site", "admin module", "admin screen" | `frontend-developer` + the `evon:ui-ux` skill when it is available (optional; see `kit/guides/admin-blueprint.md` §6) — dispatch per the Frontend dispatch contract; without the skill, `frontend-developer` builds from the blueprint archetypes |
| Visual design, icons, mockup implementation, accessibility | "design", "icon", "color", "typography", "accessibility", "a11y" | general-purpose agent (`task`), or a dedicated visual design agent if available |
| REST/GraphQL API endpoints, controllers, middleware | "endpoint", "route", "controller", "handler", "API" | `backend-developer` |
| Database schema, migrations, queries, ORM models | "schema", "migration", "model", "query", "table", "index" | `backend-developer` |
| Business logic, services, domain rules | "service", "logic", "rule", "calculation", "validation" | `backend-developer` |
| Authentication, authorization, sessions | "auth", "login", "JWT", "session", "permission", "role" | `backend-developer` |
| Infrastructure, CI/CD, environment config | "CI", "deploy", "env", "config", "Docker", "workflow" | general-purpose agent (`task`) |
| Tests (unit, integration) | "test", "spec", "assertion", "mock" | same agent as the code being tested |
| Multi-domain task crossing frontend + backend | task describes both UI and API work | **split the task first** |

`task` is not a fallback for unclassified work — use the table first.

---

## Splitting Multi-Domain Tasks

A task that touches both frontend and backend is two tasks described as one. Split before annotating; a task with two specialists is too large.

**Before:**
```markdown
### Task 4: Build product listing feature
- Files: Create src/components/ProductList.tsx, src/api/products.ts
```

**After:**
```markdown
### Task 4a: Build product listing API endpoint
**Specialist:** backend-developer
- Files: Create: src/api/products.ts

### Task 4b: Build product listing UI component
**Specialist:** frontend-developer
- Files: Create: src/components/ProductList.tsx
- Depends on: Task 4a (consumes GET /api/products)
```

Splitting makes the dependency explicit and enables parallel dispatch when file scopes are disjoint.

---

## Parallel Groups

Tasks can run in parallel when (1) their file scopes do not overlap and (2) neither depends on the other's output. Tasks of one specialist within a feature are often independent of each other.

Mark each group in the plan with one comment line:

```markdown
<!-- Parallel group A: tasks 2, 3 — disjoint files, no dependency -->
```

Step 3 dispatches each group with `dispatching-parallel-agents` and every sequential chain with `subagent-driven-development`; it does not re-decide the groups.

---

## Available Agents

Installed by the kit's CLI (six agents):

| Agent | Type | Good for |
|---|---|---|
| `frontend-developer` | Specialist | UI components, pages, CSS, state management; `design-taste-frontend` skill for premium new UI, `redesign-existing-projects` skill for upgrading existing UI |
| `backend-developer` | Specialist | REST/GraphQL APIs, business logic, database schemas, auth, middleware |
| `code-reviewer` | Review | Code review with spec and constitution compliance check |
| `ui-ux-tester` | Testing | Browser-driven UI/UX flow testing |
| `market-researcher` | Research | Market landscape, competitor analysis |
| `research-analyst` | Research | Technology and domain research, synthesis |

`sonic` (simple, repetitive, mechanical edits) is an optional harness-provided agent, not installed by the kit.
