# Task → Specialist Agent Rubric

> **Agent-facing reference.** Written for the AI; you do not need to read it to use the kit. To know what to say, see [What to Say to the AI](/guides/what-to-say).

Used in **Phase 2, Step 2 — Plan**. For each task the plan picks the best-fitting agent and skills among those **installed on this machine**, and says why. The kit never assumes a name: its default is the role **general-purpose agent** (see [Resolving the agent](#resolving-the-agent)). Every task gets a `Specialist:` line: `<agent>` or `<agent> + <skill>[, <skill>]`, where `<agent>` is `general-purpose` or an installed agent's exact name.

---

## Discovering what is installed

1. The skill and agent lists in the harness context (name and description) are the inventory.
2. A list missing from context: read the harness's skill and agent folders, in the project and the home directory (for example `.claude/skills/`, `.claude/agents/`, `.agents/skills/`), taking each `SKILL.md` or agent file's name and description.
3. Nothing found: every task is `general-purpose` with no skill; say so in the Step 2 summary.

Only installed names count, and the description, not the name alone, decides fit.

---

## Choosing per task

In order:

1. **Required rows** (table below): the signal makes the skill mandatory. Not installed: keep the task on its agent without it and tell the user at the gate which skill to install.
2. **Agent**: an installed agent whose description clearly fits the task's domain (frontend, mobile, database, …) beats `general-purpose`. No clear fit: `general-purpose`. Reviewer, research and planning agents never take an implementation task.
3. **Skills**: at most 2 installed skills whose description matches what the task does (for example test-first work, debugging a failure, verifying before claiming done). Each needs a one-line reason in the plan's `Used for`. No match: none; fewer is better.
4. **Never choose** a skill a kit step already loads (`writing-plans`, `brainstorming`, `subagent-driven-development`, `dispatching-parallel-agents`, `finishing-a-development-branch`, the Step 4 review skills), or one that runs its own plan, review, commit or branch workflow: the kit's steps own those.

The user approves or changes every choice at the Step 2 gate (D1).

---

## Required rows

| Task involves... | Specialist line | Skill |
|---|---|---|
| UI visual quality: "visual quality", "design upgrade", "polish", "premium UI" | `<agent> + design-taste-frontend` | `design-taste-frontend` (**required** for these signals) |
| Diagrams: entity-relationship, architecture, screen flow, data flow, sequence | `<agent> + archify` | `archify` (**required** for the HTML render; see `kit/guides/diagrams.md`) |
| Admin site screens under `admin/` | `<agent>` | none required; build from the screen contracts in `kit/guides/admin-checklist.md` and `docs/DESIGN.md` |

Review skills are loaded by Step 4 itself (`kit/steps/phase-2/p2-04-review.md`); the plan's Skills and Agents table lists them as later-step skills.

Every UI dispatch follows the Design dispatch contract in `kit/orchestrator-conventions.md`, whichever agent takes it.

---

## Resolving the agent

`general-purpose` is a role, not a harness name. Step 2 (Rule 1) maps it to what this harness offers and states the result in its summary; Step 3 dispatches to it.

1. The harness's general-purpose subagent, whatever it is called (`task`, `general-purpose`, `worker`, …).
2. No named agent, but the harness can start a subagent from a prompt: use that, with no agent name.
3. The harness cannot dispatch subagents at all: say so at the Step 2 gate and follow conventions rule 15 (run inline, with the user's agreement).

Never invent an agent or skill name the harness does not list.

---

## Annotation Format

```markdown
### Task 2: Polish the login form
**Specialist:** general-purpose + design-taste-frontend
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
