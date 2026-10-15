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
| `design-taste-frontend` | Phase 2 Step 3 — UI quality; invoked by the general-purpose agent for new UI work |
| `requesting-code-review` | Phase 2 Step 4 — code quality check |
| `finishing-a-development-branch` | Phase 2 Step 7 — shipping |
| `verification-before-completion` | All phases — confirming files were created correctly |

---

## Agents

Agents are specialized AI workers. The kit uses two: `code-reviewer` for review, and your platform's general-purpose agent for everything else. You never address them directly.

| Agent | Role | Used in |
|---|---|---|
| `code-reviewer` | Code review with spec and constitution compliance | Phase 2 Step 4 |

For all other tasks — implementation, research, UI, testing, infrastructure — the kit uses your platform's **general-purpose agent**.

::: tip Different agent names?
If your platform uses different names for these agents, update `kit/task-agent-rubric.md` to match. That's the only file in the kit that maps tasks to agent names.
:::

---

## Minimal Setup (Solo Builder, Small Project)

If you are building alone on a small app, you can use a smaller set:

**Skills:** `brainstorming`, `writing-plans`, `subagent-driven-development`, `design-taste-frontend`, `verification-before-completion`

**Agents:** the general-purpose agent handles all implementation; `code-reviewer` handles review.
