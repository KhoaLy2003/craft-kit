# Existing Projects

Skip Phase 1. Phase 2 reads a small set of files on every run — if those files exist, it works regardless of how the project was started.

## Install the Kit

If you haven't already, install the kit in your project folder:

```bash
npx github:KhoaLy2003/craft-kit
```

This creates a `kit/` folder alongside your existing project. The templates referenced below are inside it.

---

## The Files Phase 2 Needs

Create a `docs/` folder at your project root and produce these files:

| File | Template | Priority |
|---|---|---|
| `docs/constitution.md` | `kit/templates/07-constitution.md` | **Start here.** Phase 2 cannot run without it. |
| `docs/architecture.md` | `kit/templates/06-architecture.md` | Documents your existing stack for plan validation. |
| `docs/DESIGN.md` | `kit/templates/03c-design-system.md` | Required for projects with UI. |
| `docs/roadmap.md` | `kit/templates/04-roadmap.md` | Lists features in MoSCoW priority with build order and Phase 2 scope. |
| `docs/MODELS.md` | `kit/templates/MODELS.md` | Maps your AI models to capability tiers. Run the "Model tiers" section of `kit/phase-1-bootstrap.md` to produce it. |

Phase 2 writes per-feature specs and plans into `docs/specs/` — no separate root-level `specs/` directory is needed.

---

## Constitution

**This file is required.** Phase 2 checks compliance against it on every step. Without a constitution, the agent has no ground truth to enforce.

What it must contain:
- **Naming conventions** — how files, variables, functions, and exports are named in this codebase
- **Type rules** — what's strictly typed, what's allowed to be `any`, where `unknown` is used
- **Testing standard** — what coverage level is required, what test framework is used, what kinds of tests exist
- **Architectural boundaries** — what lives where; what is allowed to import what
- **Formatting and lint** — which formatter, which linter, any rules with non-default config

Every principle must be concrete enough to change at least one plan or diff. Vague principles ("keep code clean") are dropped when the constitution is reviewed.

::: info Solo project?
For a solo developer on a small codebase, 3–5 concrete rules is enough. Amendment procedure can be: "update this file directly; no approval process needed."
:::

---

## Architecture

What it must contain:
- **Stack** — language, runtime, frameworks, key libraries (with versions if pinned)
- **Folder layout** — where source, tests, assets, config, and generated files live
- **Key architectural decisions** — any non-obvious choices the codebase has already made (e.g. "all state through Zustand, no prop drilling", "database access only through repository layer")
- **What is deliberately excluded** — things you chose not to adopt for the MVP

Phase 2 Step 2 (Plan) validates every task plan against this document. If the architecture isn't documented, plans drift from how the codebase is actually structured.

---

## Design System

Required for any project with a user interface.

What it must contain:
- **Design tokens** — colors, typography, spacing (named semantically: `color-primary`, not `blue-500`)
- **Component inventory** — what UI components exist and where they live
- **Patterns** — layout conventions, interaction patterns, state display (loading, error, empty)

If your project has a Figma file, a Storybook, or a style guide, extract from those. `kit/guides/design-reference.md` shows the expected format.

---

## Roadmap

What it must contain:
- **Feature list** with MoSCoW priority (Must / Should / Could / Won't)
- **Build order** — the sequence Phase 2 follows; accounts for dependencies, not just priority
- **`Phase 2 Scope: all | feature`** — choose using the rule in `kit/steps/phase-1/p1-04-roadmap.md`; `all` builds every Must feature in one cycle, `feature` runs one cycle per feature (experimental)
- **Status** for each feature — all start as `pending`

As Phase 2 runs, the orchestrator updates `Status` to `in-progress` and then `shipped`.

---

## Starting Phase 2

Once the files exist:

```text
Run Phase 2 using `kit/phase-2.md`.
```

The orchestrator reads `Phase 2 Scope` from the roadmap and runs either the single full-app cycle or the next `pending` feature.

---

## What You Don't Need

You don't need:
- `docs/idea-brief.md` — Phase 2 never reads it
- `docs/market-notes.md` — Phase 2 never reads it
- `docs/prototype/` — Phase 2 never reads it

Phase 2 reads `docs/constitution.md`, `docs/architecture.md`, `docs/roadmap.md`, `docs/MODELS.md`, and — for UI work — `docs/DESIGN.md` and `docs/preview/`. Nothing else from `docs/` is required.
