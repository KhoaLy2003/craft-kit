# What You Need

For most users, getting started requires nothing beyond an AI assistant — ChatGPT, Claude, or any capable AI. Share the relevant phase file, fill in the kickoff form, and follow the steps in [Getting Started](/getting-started).

---

## If You Use a Multi-Agent Platform

Some AI platforms — such as Oh My Pi (OMP) — can run multiple specialized workers in parallel: one AI agent for design, one for market research, one for writing code, one for code review. The kit is built to use these when they are available, which speeds up the workflow significantly.

If your platform supports this kind of agent orchestration, the following skills and agents need to be available before Phase 1 begins. Your platform should check for missing ones automatically when Phase 1 starts.

---

## Skills

Skills are instruction sets that teach your AI platform how to do a specific task. Install a missing skill with `/skill:<name>` in your platform's session.

| Skill | Used in |
|---|---|
| `brainstorming` | Phase 1 Step 1 — product ideation; Phase 2 Step 1 — feature spec |
| `writing-plans` | Phase 2 Step 2 — implementation planning |
| `subagent-driven-development` | Phase 2 Step 4 — building features |
| `dispatching-parallel-agents` | Phase 2 Step 4 — parallel build tasks |
| `requesting-code-review` | Phase 2 Step 6 — code quality check |
| `finishing-a-development-branch` | Phase 2 Step 9 — shipping a feature |
| `using-git-worktrees` | Phase 2 — keeping features isolated during build |
| `verification-before-completion` | All phases — confirming files were created correctly |

---

## Agents

Agents are specialized AI workers. The kit routes tasks to the right one automatically — you never address them directly.

| Agent | Role | Used in |
|---|---|---|
| `task` | General-purpose work | Phase 1 Steps 6, 8, 9; Phase 2 backend and logic tasks |
| `scout` | Read-only investigation | Bug fix Step 1 |
| `designer` | Visual and UX decisions | Phase 1 Steps 4, 5 |
| `market-researcher` | Competitive research | Phase 1 Step 2 |
| `research-analyst` | Research and synthesis | Phase 1 Steps 3, 7 |
| `librarian` | Library and API deep-dives | Phase 1 Step 3 |
| `frontend-developer` | Writing UI and frontend code | Phase 1 Step 4; Phase 2 UI tasks |
| `code-reviewer` | Reviewing code for issues | Phase 2 Step 6 |
| `qa-expert` | Testing and quality checks | Phase 2 Step 7 |
| `ui-ux-tester` | Browser-driven UI testing | Phase 2 Step 7 (UI features) |

::: tip Different agent names?
If your platform uses different names for these agents, update `kit/task-agent-rubric.md` to match. That's the only file in the kit that references agent names directly.
:::

---

## Minimal Setup (Solo Builder, Small Project)

If you are building alone and your app has 15 or fewer features, you can use a smaller set:

**Skills:** `brainstorming`, `writing-plans`, `subagent-driven-development`, `verification-before-completion`

**Agents:** `task`, `scout`, `designer`, `research-analyst`, `librarian`, `frontend-developer`

**What you can leave out:**
- `market-researcher` — market research is optional; skip Phase 1 Step 2
- `qa-expert` / `ui-ux-tester` — walk through the app manually at the end instead
- `code-reviewer` — the main agent reviews its own work; note this in your working rules

If you leave out any agent, add a short note in `docs/constitution.md` so the AI knows to handle those steps differently.
