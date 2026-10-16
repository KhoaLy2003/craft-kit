# What You Need

For most users, getting started requires nothing beyond an AI assistant. Share the relevant phase file, fill in the kickoff form, and follow the steps in [Getting Started](/getting-started), which also covers setup on Windows, macOS, and Linux and how to prepare your `DESIGN.md`.

---

## Skills and Agents

Some AI platforms can load *skills* (instruction sets for a specific task) and run specialist *agents* in parallel. The kit uses them when they exist and works from the AI's general capability when they do not, with two exceptions: `design-taste-frontend` is required for visual-quality work (prototype build, "polish", "premium UI" tasks), and `archify` is required for rendering the project's diagrams as interactive HTML. They live in per-tool locations (a plugin, a skills folder such as `.agents/skills/`, or an agents folder such as `.agents/agents/`); which one applies depends on your platform.

**Pre-flight.** When Phase 1 starts, the AI checks that the items below are available, using your platform's skill and agent list. If any are missing it tells you which ones and which step each affects, and continues with the closest built-in behavior only after you agree. You can also install them first and then continue. The check is defined in `kit/phase-1-bootstrap.md` (*Skills and agents pre-flight*).

**Installer.** `npx github:KhoaLy2003/craft-kit` copies `kit/`, then prints install instructions for the plugin skills and, in an interactive terminal, offers to install `design-taste-frontend`, `archify` and the `code-reviewer` agent. The full list of paths it writes is in [Getting Started](/getting-started#what-the-installer-writes).

---

## Skills

| Skill | Used in |
|---|---|
| `brainstorming` | Phase 1 Step 1 — ideation; Phase 2 Step 1 — spec |
| `writing-plans` | Phase 2 Step 2 — implementation planning |
| `subagent-driven-development` | Phase 2 Step 3 — building |
| `dispatching-parallel-agents` | Phase 2 Step 3 — parallel build tasks |
| `using-git-worktrees` | Phase 2 Step 3 — keeping the feature branch isolated |
| `design-taste-frontend` | Phase 1 Step 3 — prototype build; Phase 2 Step 3 — UI quality for new UI work |
| `archify` | Phase 1 Step 6 — renders the entity-relationship diagram plus a small, filtered set of other diagrams (system overview, large screen flows, core journeys; at most 6) to `docs/diagrams/*.html`; Phase 2 Step 1 — re-renders those an amendment changed. Needs Archify 3 or later for the ER type. Source: [tt-a1i/archify](https://github.com/tt-a1i/archify) |
| `requesting-code-review` | Phase 2 Step 4 — code quality check |
| `finishing-a-development-branch` | Phase 2 Step 7 — shipping |
| `verification-before-completion` | All phases — confirming files were created correctly |

---

## Agents

Agents are specialized AI workers. The kit uses two kinds: `code-reviewer` for review, and your platform's general-purpose agent for everything else. You never address them directly.

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
