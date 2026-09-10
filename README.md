# CraftKit

A reusable, agent-friendly workflow kit for crafting software products with AI coding agents.
Works with any multi-agent AI coding harness. Designed to be dropped into any project and used immediately.

---

## What This Kit Contains

| File | Purpose |
|---|---|
| `phase-1-bootstrap.md` | One-time setup workflow: from raw idea to a ready-to-code codebase |
| `phase-2-feature-dev.md` | Standard Phase 2: one feature per cycle, repeated — for M/L features or complex codebases |
| `phase-2-single-pass.md` | Single-pass Phase 2: all features in one cycle — for small apps with S/M features |
| `phase-bug-fix.md` | Bug fix workflow: Assess → Fix → Verify — for bugs against shipped features |
| `steps/phase-1/` | Step detail files for Phase 1 (`p1-01` through `p1-08`) — authoritative source for each step's inputs, rules, and completion criteria |
| `steps/phase-2/` | Step detail files for Phase 2 Standard Loop (`p2-01` through `p2-09`) and Single-Pass (`p2sp-01` through `p2sp-07`) |
| `task-agent-rubric.md` | Reference table for matching plan tasks to specialist agents |
| `templates/phase-1-kickoff.md` | **Start here for new projects** — copy to `docs/phase-1-kickoff.md` in your project root and fill it in before starting Phase 1 |
| `templates/` | Output templates for every Phase 1 artifact (filled by the agent, not you) |
| `resource/DESIGN.md` | Airbnb-style design system reference — use as the Step 4 import path source or format guide |
| `resource/step-specification-template.md` | Canonical template for all step files |
| `guides/evolving-specs.md` | How to handle spec and artifact changes after a feature ships |
| `CHANGELOG.md` | History of all kit changes |

---

## Two Phases, One Kit

### Phase 1 — Bootstrap (once per project)

Takes a raw idea through market research, prototype, design, roadmap, architecture, and working scaffold.
Produces the foundation files every Phase 2 cycle reads: `constitution.md`, `architecture.md`, `roadmap.md`, `DESIGN.md`.

Run this once when starting a new project. Skip it entirely on existing projects.

### Phase 2 — Feature Development (once per feature)

Takes one feature from `roadmap.md` through brainstorming, planning, implementation, review, testing, and shipping.
Powered by a set of workflow skills: `brainstorming` → `writing-plans` → `subagent-driven-development` / `dispatching-parallel-agents` → code review → E2E testing → ship.

Run this cycle for every feature — including the first MVP feature.

---

## How to Use This Kit

**Install the kit** in your project folder (requires Node.js 18+):

```bash
npx craft-kit
```

This creates a `kit/` directory with all the phase files, templates, guides, and step detail files. To update an existing install:

```bash
npx craft-kit --force
```

The phase files are orchestration scripts for the main orchestrating agent — you do not execute steps manually. You start a session, reference the phase file, and participate at the gates. The agent handles dispatching, artifact creation, and advancing between steps.

**Artifacts** (filled templates, specs, plans) land at your **project root**, not inside `kit/`. The kit folder is a reference — never edit files inside it.

---

### Phase 1 — New project

**Prerequisites:** an empty (or near-empty) repository; your agent harness configured with the skills and agents listed under [Required Skills and Agents](#required-skills-and-agents).

**Kickoff check:** before starting Step 1, the orchestrator MUST verify that every required skill and agent is available. Missing skills surface as errors mid-run, not upfront. Verify each skill is available in your harness and each agent can be dispatched successfully. Report any that are missing and stop — do not begin Phase 1 against an incomplete toolset.

**Before starting:**
Copy `kit/templates/phase-1-kickoff.md` to `docs/phase-1-kickoff.md` in your project root, then fill it in with your idea, target user, anything you already have (design files, tech preferences), and hard constraints. Rough notes are fine — the agent asks clarifying questions in Step 1.

**Start the session:**
> "Start Phase 1 using `docs/phase-1-kickoff.md`."

The agent reads your kickoff file and `kit/phase-1-bootstrap.md` together, then begins Step 1.

**What happens across the 8 steps:**

**Steps 1–2 — Ideation, Market Research**
Step 1 is a conversation: the agent asks clarifying questions about your idea and produces `idea-brief.md`. You review and approve it before anything else runs.

Step 2 dispatches the `market-researcher` agent and delivers a research report covering market size, direct competitors, and genuine reasons the idea might not work. This is the first hard gate — you decide whether to proceed, pivot, or stop. If you stop, the rest of Phase 1 does not run.

**Steps 3–4 — Prototype, Product Design**
Step 3 dispatches your general-purpose agent to produce a journey map and prototype brief, then `frontend-developer` to wire them into a clickable HTML prototype in `prototype/`. No real backend — faked data is explicitly documented.

Step 4 is the design system session. Two paths:
- **Import path** — if you already have a `DESIGN.md`, provide the path; the agent reads it and normalizes it into `docs/DESIGN.md`. The AI design session is skipped. See `resource/DESIGN.md` for the expected format.
- **AI path** — no existing design file; your general-purpose agent runs a design session from the prototype and produces tokens, components, and finalized mock screens.

Step 4 is a hard gate — design direction is locked here. Changing it after this point is expensive.

**Steps 5–6 — Roadmap, Architecture**
Step 5 is a product decision: the agent drafts a MoSCoW-prioritized feature list with build order; you decide what's in scope, what's deferred, and in what order Phase 2 runs. Hard gate — the orchestrator does not advance until you explicitly approve the feature list.

Step 6 picks the tech stack. First, the `research-analyst` reads `kit/stack-catalog.md` (catalog-first) and surfaces 2–3 viable options with tradeoffs informed by the roadmap's actual scope. Then it produces a ranked recommendation in chat — no document yet. You confirm the stack choice, and only then is `architecture.md` written. Hard gate — the stack choice is irreversible once Phase 2 begins.

**Steps 7–8 — Constitution, Scaffold**
Step 7 produces `constitution.md` — the governing principles for every AI agent that touches code on this project. Each principle must be concrete enough to change a real plan or diff. Hard gate — these rules apply to every Phase 2 session that follows.

Step 8 scaffolds the codebase: folder structure, linter, formatter, test framework, CI, README, and a smoke test. When the smoke test passes and every checklist item is checked, Phase 1 is closed.

**Phase 1 hard gates:**

| Step | What you receive | Your decision |
|---|---|---|
| Step 2 — Market Research *(optional)* | Research report with competitor map and "reasons this might not work" section | Proceed / Pivot / Stop — or skip Step 2 entirely if you already have external validation |
| Step 4 — Product Design | Design tokens, component list, finalized mock screens | Approve / Request changes |
| Step 5 — Roadmap | MoSCoW feature list with build order and deferred items | Approve / Reprioritize / Cut scope |
| Step 6 — Tech Stack & Architecture | Ranked stack recommendation with tradeoffs | Confirm stack choice |
| Step 7 — Constitution | Governing principles for AI-generated code | Approve / Refine principles |

**End state:** A running scaffold at "hello world" level, plus a `docs/` folder at your project root containing up to 7 approved artifacts:
`docs/idea-brief.md` · `docs/market-notes.md` *(if Step 2 was run)* · `docs/prototype/` · `docs/DESIGN.md` · `docs/roadmap.md` · `docs/architecture.md` · `docs/constitution.md`

---

### Phase 2 — Two tracks

Phase 2 has two tracks. The track is decided at the **Step 6 (Roadmap) gate** — once the feature list, sizes, and dependency structure are known — and recorded in `docs/roadmap.md`. You cannot make this decision upfront; the information doesn't exist until the roadmap is complete.

| Track | File | When to use |
|---|---|---|
| **Standard loop** | `phase-2-feature-dev.md` | One feature per cycle, repeated. Use for M/L features, complex codebases, multiple domains, or when the feature set may grow during development. |
| **Single-pass** | `phase-2-single-pass.md` | All features in one cycle. Use for small apps: S/M features, one developer, one domain, complete feature set known upfront, ≤ 15 Must features. |

---

### Standard loop — feature by feature
> **Beta note:** The standard loop has not yet been end-to-end validated. All five internal test rounds used the single-pass track. The step files are complete and the gate logic is correct, but the per-feature cycle has not been run. **Recommend single-pass for first-time users** unless the project clearly requires the standard loop (L-sized features, multiple domains, growing feature set).


Run this cycle once per feature, starting from the first pending feature in build order. Repeat until all features are shipped.

**Start each feature cycle:**
> "Pick the next `pending` feature from `docs/roadmap.md` (by build order) and run the Phase 2 cycle using `kit/phase-2-feature-dev.md`."

9 steps per feature: Brainstorm & Spec (hard gate) → Plan → Assign Specialists → Implement → Converge → Code Review → E2E Testing → Manual Check (hard gate) → Ship. The orchestrator then picks the next pending feature and repeats.

**Hard gates:** Step 1 (spec approval) and Step 8 (manual check before ship) — one pair per feature.

**Artifacts per feature:**
```
docs/specs/<feature-slug>/
  spec.md    ← approved spec
  plan.md    ← annotated task plan
```

---

### Single-pass — all features at once

Run this cycle once, covering all Must features in the roadmap in a single pass.

**Start the single-pass cycle:**
> "Run Phase 2 single-pass using `kit/phase-2-single-pass.md` for all Must features in `docs/roadmap.md`."

7 steps total: Full-App Spec (hard gate) → Plan (hard gate) → Implement → Converge → Code Review + E2E → Manual Check (hard gate) → Ship.

**Hard gates:** Step 1 (complete app spec approval), Step 2 (plan approval), and Step 6 (full app walkthrough before ship) — three gates total.

**Artifacts:**
```
docs/specs/
  spec.md    ← approved full-app spec (one section per feature)
  plan.md    ← complete task plan in dependency order
```

If mid-cycle you discover a feature is significantly more complex than estimated, the single-pass track has a defined escape: stop, revise the spec, and switch to the standard loop for remaining features.

---

### On an existing project

Skip Phase 1. Before running Phase 2 for the first time, create a `docs/` folder at your project root and produce these four files inside it — they are what Phase 2 reads on every feature:

| File | Template | Notes |
|---|---|---|
| `docs/constitution.md` | `templates/08-constitution.md` | **Start here.** Phase 2 cannot run without it. Document governing principles for AI-generated code: naming, types, testing standard, architectural boundaries tied to your stack. Be specific — vague principles ("code should be clean") are dropped by the gate checklist. |
| `docs/architecture.md` | `templates/07-architecture.md` | Document your existing stack, folder layout, and key architectural decisions. Phase 2 Step 2 (Plan) validates every task plan against this. If the architecture isn't documented, plans drift from how the codebase is actually structured. |
| `docs/DESIGN.md` | `templates/05-design-system.md` | Required for projects with UI. Use the import path if you have a design file (see `samples/DESIGN.md`); use the AI path or fill manually otherwise. Phase 2 Step 1 (Brainstorm) reads this for any UI-touching feature. |
| `docs/roadmap.md` | `templates/06-roadmap.md` | List the features you intend to build, in MoSCoW priority, with build order. Phase 2 reads this to select the next feature and updates `Status` as features ship. |

Phase 2 writes specs and plans into `docs/specs/` — no separate root-level `specs/` directory needed.

Once those files exist, start Phase 2 with the prompt above.

---

## Required Skills and Agents

This kit assumes the following are configured in your AI agent harness:

**Skills:**
- `brainstorming`
- `writing-plans`
- `subagent-driven-development`
- `dispatching-parallel-agents`
- `requesting-code-review`
- `finishing-a-development-branch`
- `using-git-worktrees`
- `verification-before-completion`
- `design-taste-frontend` — invoked inside `frontend-developer` dispatches for new UI work at Phase 2 implementation

**Agents — specialist (install before starting):**
- `market-researcher` — market analysis
- `research-analyst` — technology and domain research, synthesis
- `frontend-developer` — frontend implementation
- `code-reviewer` — code review
- `ui-ux-tester` — browser-driven UI/UX testing

> **If any skill or agent is missing or unverified:** resolve it before starting Phase 1. A missing agent discovered mid-run requires restarting from the step that needs it. The orchestrator checks availability at Phase 1 kickoff and reports any gaps.

---

## Kit Philosophy

- **One feature at a time.** Never batch multiple features into a single spec/plan/implement pass.
- **Skills run as-is.** This kit orchestrates existing skills — it does not modify or replace them.
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

To contribute, open a pull request against this repository with a clear description of what the change adds or fixes and why.
