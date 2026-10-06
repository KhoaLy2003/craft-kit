# What You Need

For most users, getting started requires nothing beyond an AI assistant — ChatGPT, Claude, or any capable AI. Share the relevant phase file, fill in the kickoff form, and follow the steps in [Getting Started](/getting-started).

---

## If You Use a Multi-Agent Platform

Some AI platforms can run multiple specialized workers in parallel: one agent for market research, one for writing code, one for code review. The kit is built to use these when they are available, which speeds up the workflow significantly.

If your platform supports agent orchestration, the following skills and agents need to be available before Phase 1 begins. Your platform should check for missing ones automatically when Phase 1 starts. `npx github:KhoaLy2003/craft-kit` prints (or, interactively, runs) the install steps for all of them.

---

## Skills

Skills are instruction sets that teach your AI platform how to do a specific task.

| Skill | Used in |
|---|---|
| `brainstorming` | Phase 1 Step 1 — ideation; Phase 2 Step 1 — spec |
| `writing-plans` | Phase 2 Step 2 — implementation planning |
| `subagent-driven-development` | Phase 2 Step 3 — building |
| `dispatching-parallel-agents` | Phase 2 Step 3 — parallel build tasks |
| `using-git-worktrees` | Phase 2 Step 3 — keeping the feature branch isolated |
| `design-taste-frontend` | Phase 2 Step 3 — UI quality; invoked inside `frontend-developer` dispatches for new UI work |
| `evon:ui-ux` *(optional)* | Admin Site workflow Step 3 — admin screens; without it `frontend-developer` builds them from the admin blueprint |
| `requesting-code-review` | Phase 2 Step 4 — code quality check |
| `finishing-a-development-branch` | Phase 2 Step 7 — shipping |
| `verification-before-completion` | All phases — confirming files were created correctly |

---

## Agents

Agents are specialized AI workers. The kit routes tasks to the right one automatically — you never address them directly.

| Agent | Role | Used in |
|---|---|---|
| `market-researcher` | Competitive research | Phase 1 Step 2 |
| `research-analyst` | Technology and domain research, synthesis | Phase 1 Step 6 |
| `frontend-developer` | UI components, pages, CSS, state management | Phase 1 Step 3; Phase 2 Step 3 UI tasks |
| `backend-developer` | APIs, data layer, business logic | Phase 2 Step 3 backend tasks |
| `code-reviewer` | Code review with spec and constitution compliance | Phase 2 Step 4 |
| `ui-ux-tester` | Browser-driven UI/UX flow testing | Phase 2 Step 5 (UI features) |

For other tasks — infrastructure, visual design — the kit uses your platform's **general-purpose agent**.

::: tip Different agent names?
If your platform uses different names for these agents, update `kit/task-agent-rubric.md` to match. That's the only file in the kit that maps tasks to agent names.
:::

---

## Minimal Setup (Solo Builder, Small Project)

If you are building alone on a small app, you can use a smaller set:

**Skills:** `brainstorming`, `writing-plans`, `subagent-driven-development`, `design-taste-frontend`, `verification-before-completion`

**Agents:** `research-analyst`, `frontend-developer`, `backend-developer`

**What you can leave out:**
- `market-researcher` — market research is optional; skip Phase 1 Step 2
- `code-reviewer` — your general-purpose agent handles review; note this in your constitution
- `ui-ux-tester` — walk through the app manually at the Manual Check gate instead

If you leave out any agent, add a short note in `docs/constitution.md` so the AI knows to handle those steps differently.
