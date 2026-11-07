# Skills & Agents

For most users, getting started requires nothing beyond an AI assistant. Follow [Getting Started](/getting-started); it also covers setup on Windows, macOS and Linux and how to prepare your `DESIGN.md`.

---

## What to install

| Need | Items | If missing |
|---|---|---|
| **Install before Phase 1** | `design-taste-frontend` (prototype and UI polish), `archify` (renders the project's diagrams as HTML) | The AI tells you which step is affected and continues with built-in behavior only after you agree |
| Recommended | The Superpowers plugin skills in the table below | The kit falls back to the AI's general capability |
| Recommended for review | `code-review-and-quality`, `security-and-hardening`, `performance-optimization`, `code-simplification` | Review is shallower |

Skills are instruction sets for a specific task. The kit uses them when they exist. They live in per-tool locations (a plugin, a skills folder such as `.agents/skills/`), which depends on your platform.

**Installer.** `npx github:KhoaLy2003/craft-kit` copies `kit/`, then prints install instructions for the plugin skills. In an interactive terminal it offers to install `design-taste-frontend`, `archify` and the four review skills (`npx skills add <name>`). Run it with `--skip-setup` to skip this. The paths it writes are in [Getting Started](/getting-started#what-the-installer-writes).

**Pre-flight.** When Phase 1 starts, the AI checks that the items below are available, using your platform's skill list. It tells you which are missing and which step each affects. The check is defined in `kit/phase-1-bootstrap.md` (*Skills and agents pre-flight*) and repeats for Phase 2.

---

## Skills {#skills}

| Skill | Used in |
|---|---|
| `brainstorming` | Phase 1 Step 1 (ideation); Phase 2 Step 1 (spec) |
| `writing-plans` | Phase 2 Step 2 (implementation planning); Admin planning |
| `subagent-driven-development` | Phase 2 Step 3 (building); Admin |
| `dispatching-parallel-agents` | Phase 2 Step 3 (parallel build tasks); Admin |
| `using-git-worktrees` | Admin (isolated `feature/admin` branch); listed in the Phase 2 pre-flight |
| `design-taste-frontend` | Phase 1 Step 3 (prototype build); Phase 2 Steps 2 and 3 (UI quality for new UI work) |
| `archify` | Phase 1 Step 6: renders the entity-relationship diagram plus a small, filtered set of others (system overview, large screen flows, core journeys; at most 6) to `docs/diagrams/*.html`. Phase 2 Step 1: re-renders those an amendment changed. Also used by Adopt. Needs Archify 3 or later for the ER type. Source: [tt-a1i/archify](https://github.com/tt-a1i/archify) |
| `requesting-code-review` | Listed in the Phase 2 pre-flight; not named by any step file |
| `code-review-and-quality` | Phase 2 Step 4 and Admin Step 4 (five-axis review). Source: [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) |
| `security-and-hardening` | Phase 2 Step 4 and Admin Step 4 (security axis) |
| `performance-optimization` | Phase 2 Step 4 (performance axis) |
| `code-simplification` | Phase 2 Step 4 (readability fixes without changing behavior) |
| `finishing-a-development-branch` | Phase 2 Step 7 (shipping); Admin |
| `verification-before-completion` | Phase 1 pre-flight (confirming files were created correctly) |

---

## Agents

The kit uses your platform's **general-purpose agent** for all tasks (implementation, review, research, UI, testing, infrastructure). You never address it directly.

::: tip Different agent names?
`kit/task-agent-rubric.md` is the only file that maps tasks to agent names. If your platform names the general-purpose agent differently, tell your AI at the start of the run. Editing the file works too, but `--force` updates overwrite it, so redo the edit after each update.
:::

---

## Minimal Setup (Solo Builder, Small Project)

**Skills:** `design-taste-frontend` and `archify` (the two required ones), plus `brainstorming`, `writing-plans`, `subagent-driven-development`.

**Agents:** the general-purpose agent handles all implementation and review.
