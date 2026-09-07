# Session Logging

> Every orchestrated phase maintains a session log in `docs/`.
> The log is the user's single source of truth for what ran, how long it took, and what it cost.
> It does not replace gate outputs — it points to them.

---

## Column Definitions

| Column | What to record |
|---|---|
| **Step** | Step number |
| **Name** | Step name |
| **Skill / Agent** | Skill or agent invoked |
| **Status** | Current status (see status values below) |
| **Started** | Local wall-clock time at step start — `new Date().toLocaleTimeString()`, never estimated |
| **Duration** | Wall-clock minutes from step start to log update |
| **Credits** | Token or cost delta between step start and end, if your platform tracks it; leave `—` if not available |
| **Output** | File produced; `—` if step is not yet complete |

## Status Values

`pending` · `in progress` · `complete` · `skipped` · `blocked`

---

## Log Templates

### Phase 1

Create as `docs/phase-1-session.md` at Step 1 start. Update after every step.

```markdown
# Phase 1 Session Log — [project-name]

| Step | Name | Skill / Agent | Status | Started | Duration | Credits | Output |
|---|---|---|---|---|---|---|---|
| 1 | Product Ideation | `brainstorming` (Architectural) | pending | — | — | — | — |
| 2 | Market Research | `market-researcher` | pending | — | — | — | — |
| 3 | Tech Research | `research-analyst` + general-purpose agent | pending | — | — | — | — |
| 4 | Interactive Prototype | general-purpose agent + `frontend-developer` | pending | — | — | — | — |
| 5 | Product Design | general-purpose agent | pending | — | — | — | — |
| 6 | Roadmap Generation | general-purpose agent | pending | — | — | — | — |
| 7 | Tech Stack & Architecture | `research-analyst` | pending | — | — | — | — |
| 8 | Constitution | general-purpose agent | pending | — | — | — | — |
| 9 | Scaffold | general-purpose agent / `frontend-developer` | pending | — | — | — | — |
```

### Phase 2 — Standard Loop

Create as `docs/phase-2-session.md` at Step 1 start. One log per feature cycle.

```markdown
# Phase 2 Session Log — [feature-slug]

| Step | Name | Skill / Agent | Status | Started | Duration | Credits | Output |
|---|---|---|---|---|---|---|---|
| 1 | Brainstorm & Spec | `brainstorming` | pending | — | — | — | — |
| 2 | Plan | `writing-plans` | pending | — | — | — | — |
| 3 | Assign Specialists | manual / general-purpose agent | pending | — | — | — | — |
| 4 | Implement | `subagent-driven-development` | pending | — | — | — | — |
| 5 | Converge | general-purpose agent | pending | — | — | — | — |
| 6 | Code Review | `code-reviewer` | pending | — | — | — | — |
| 7 | E2E Testing | `ui-ux-tester` / general-purpose agent | pending | — | — | — | — |
| 8 | Manual Double Check | human | pending | — | — | — | — |
| 9 | Ship | `finishing-a-development-branch` + general-purpose agent | pending | — | — | — | — |
```

### Phase 2 — Single-Pass

Create as `docs/phase-2-session.md` at Step 1 start.

```markdown
# Phase 2 Session Log — Single-Pass

| Step | Name | Skill / Agent | Status | Started | Duration | Credits | Output |
|---|---|---|---|---|---|---|---|
| 1 | Full-App Spec | `brainstorming` | pending | — | — | — | — |
| 2 | Plan | `writing-plans` | pending | — | — | — | — |
| 3 | Implement | `<specialist>` | pending | — | — | — | — |
| 4 | Converge | general-purpose agent | pending | — | — | — | — |
| 5 | Code Review + E2E | `code-reviewer` + `ui-ux-tester` | pending | — | — | — | — |
| 6 | Manual Check | human | pending | — | — | — | — |
| 7 | Ship | `finishing-a-development-branch` + general-purpose agent | pending | — | — | — | — |
```

### Bug Fix

Create as `docs/bug-session.md` at Step 1 start.

The bug fix log omits the Credits column — fixes are short enough that per-step credit tracking adds overhead without insight.

```markdown
# Bug Fix Session — [bug-slug]

| Step | Name | Agent | Status | Started | Duration | Output |
|---|---|---|---|---|---|---|
| 1 | Assess | general-purpose agent + human | pending | — | — | — |
| 2 | Fix | specialist | pending | — | — | — |
| 3 | Verify | `ui-ux-tester` / general-purpose agent + human | pending | — | — | — |
```
