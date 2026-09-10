# What You Need

For most users, getting started requires nothing beyond an AI assistant — ChatGPT, Claude, or any capable AI. Share the relevant phase file, fill in the kickoff form, and follow the steps in [Getting Started](/getting-started).

---

## If You Use a Multi-Agent Platform

Some AI platforms can run multiple specialized workers in parallel: one agent for market research, one for writing code, one for code review. The kit is built to use these when they are available, which speeds up the workflow significantly.

If your platform supports agent orchestration, the following skills and agents need to be available before Phase 1 begins. Your platform should check for missing ones automatically when Phase 1 starts.

---

## Skills

Skills are instruction sets that teach your AI platform how to do a specific task.

| Skill | Used in |
|---|---|
| `brainstorming` | Phase 1 Step 1 — product ideation; Phase 2 Step 1 — feature spec |
| `writing-plans` | Phase 2 Step 2 — implementation planning |
| `subagent-driven-development` | Phase 2 Step 4 — building features |
| `dispatching-parallel-agents` | Phase 2 Step 4 — parallel build tasks |
| `design-taste-frontend` | Phase 2 Step 4 — UI quality; invoked inside `frontend-developer` dispatches for new UI work |
| `requesting-code-review` | Phase 2 Step 6 — code quality check |
| `finishing-a-development-branch` | Phase 2 Step 9 — shipping a feature (standard loop) |
| `using-git-worktrees` | Phase 2 — keeping features isolated during build |
| `verification-before-completion` | All phases — confirming files were created correctly |

---

## Agents

Agents are specialized AI workers. The kit routes tasks to the right one automatically — you never address them directly.

| Agent | Role | Used in |
|---|---|---|
| `market-researcher` | Competitive research | Phase 1 Step 2 |
| `research-analyst` | Technology and domain research, synthesis | Phase 1 Step 6 |
| `frontend-developer` | UI components, pages, CSS, state management | Phase 1 Step 3; Phase 2 UI tasks |
| `code-reviewer` | Code review with spec and constitution compliance | Phase 2 Step 6 |
| `ui-ux-tester` | Browser-driven UI/UX flow testing | Phase 2 Step 7 (UI features) |

For all other tasks — business logic, backend, infrastructure, visual design — the kit uses your platform's **general-purpose agent**. No named agent is required for those roles.

::: tip Different agent names?
If your platform uses different names for these agents, update `kit/task-agent-rubric.md` to match. That's the only file in the kit that references agent names directly.
:::

---

## Minimal Setup (Solo Builder, Small Project)

If you are building alone and your app has 15 or fewer features, you can use a smaller set:

**Skills:** `brainstorming`, `writing-plans`, `subagent-driven-development`, `design-taste-frontend`, `verification-before-completion`

**Agents:** `research-analyst`, `frontend-developer`

**What you can leave out:**
- `market-researcher` — market research is optional; skip Phase 1 Step 2
- `code-reviewer` — your general-purpose agent handles review; note this in your constitution
- `ui-ux-tester` — walk through the app manually at the Manual Check gate instead

If you leave out any agent, add a short note in `docs/constitution.md` so the AI knows to handle those steps differently.
