# Product Development Kit

A reusable, agent-friendly workflow kit for building software products with AI coding agents.
Built on top of the [Oh My Pi](https://omp.dev) superpowers skill set. Designed to be dropped into any project and used immediately.

---

## What This Kit Contains

| File | Purpose |
|---|---|
| `phase-1-bootstrap.md` | One-time setup workflow: from raw idea to a ready-to-code codebase |
| `phase-2-feature-dev.md` | Repeating workflow: from feature selection to shipped code |
| `task-agent-rubric.md` | Reference table for matching plan tasks to specialist agents |
| `templates/` | Fill-in-the-blank output templates for every Phase 1 artifact |

---

## Two Phases, One Kit

### Phase 1 — Bootstrap (once per project)

Takes a raw idea through market research, prototype, design, roadmap, architecture, and working scaffold.
Produces the foundation files every Phase 2 cycle reads: `constitution.md`, `architecture.md`, `roadmap.md`, `design-system.md`.

Run this once when starting a new project. Skip it entirely on existing projects.

### Phase 2 — Feature Development (once per feature)

Takes one feature from `roadmap.md` through brainstorming, planning, implementation, review, testing, and shipping.
Powered by the superpowers skill set: `brainstorming` → `writing-plans` → `subagent-driven-development` / `dispatching-parallel-agents` → code review → E2E testing → ship.

Run this cycle for every feature — including the first MVP feature.

---

## How to Use This Kit

### On a new project

1. Copy this `kit/` directory into your project root.
2. Work through `phase-1-bootstrap.md` step by step. Each step names the agent or skill to invoke and the output template to fill.
3. After Phase 1, your project has: a running scaffold, `constitution.md`, `roadmap.md`, and all supporting artifacts.
4. Switch to `phase-2-feature-dev.md` for every feature from this point on.

### On an existing project

1. Copy this `kit/` directory into your project root.
2. Skip Phase 1 entirely — your project already has a codebase.
3. If you don't yet have a `constitution.md`, create one using `templates/08-constitution.md` before running Phase 2 for the first time. It is the source of truth Phase 2 checks against.
4. Start Phase 2 at Step 1 (Brainstorm & Spec) for each feature.

---

## Required Skills and Agents

This kit assumes the following are configured in your AI agent harness:

**Skills (superpowers):**
- `brainstorming`
- `writing-plans`
- `subagent-driven-development`
- `dispatching-parallel-agents`
- `requesting-code-review`
- `finishing-a-development-branch`
- `using-git-worktrees`
- `verification-before-completion`

**Agents:**
- `task` — general-purpose (bundled)
- `scout` — read-only research (bundled)
- `designer` — UI/UX design (bundled)
- `market-researcher` — market analysis
- `research-analyst` — research and synthesis
- `librarian` — library/API research (bundled)
- `frontend-developer` — frontend implementation
- `code-reviewer` — code review
- `qa-expert` — test planning and execution
- `ui-ux-tester` — UI/UX flow testing

> If your setup uses different agent names, update `task-agent-rubric.md` to match.

---

## Kit Philosophy

- **One feature at a time.** Never batch multiple features into a single spec/plan/implement pass.
- **Skills run as-is.** This kit orchestrates existing superpowers skills — it does not modify or replace them.
- **Templates are fill-in forms.** Each Phase 1 step has a corresponding template in `templates/`. Copy the template into your project and fill it in; do not edit the kit template itself.
- **Constitution first.** Every Phase 2 step checks compliance against `constitution.md`. If there is no constitution, Phase 2 has no ground truth to check against.
- **Human gates are real gates.** Steps marked `hard gate` require explicit human approval before the orchestrator continues — they are not suggestions.

---

## Contributing

This kit is open source. Contributions welcome:

- **New templates** — for steps that don't yet have an output template
- **Agent rubric entries** — mapping new task types to specialist agents
- **Phase workflows** — alternative workflows for specific contexts (mobile, API-only, etc.)
- **Fixes** — corrections to any step's gate logic, agent assignment, or output description

See `CONTRIBUTING.md` for contribution guidelines.
