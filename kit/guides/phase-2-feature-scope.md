# Phase 2, `scope: feature`

> Read only when `Phase 2 Scope: feature` (experimental), or under `scope: all` when the Mid-Cycle Escape below applies.

**Feature loop.** Select a `pending` feature whose `depends_on` features are all `shipped`, in build order. For a Phase 3 release, also follow the release block's **Work Packages** table: a feature enters Step 3 only when every feature in the earlier groups has `shipped`. Run Steps 1–7, then start a new log section and repeat.

## Mid-Cycle Escape (`scope: all` → `feature`)

Stop the cycle if any of these surfaces:
- A feature is much more complex than estimated (L-sized in practice)
- A spec gap that substantially re-scopes a feature
- A technical decision that invalidates later features' specs
- A second domain (a distinct area needing a different specialist skill or a separate deployable concern — definition in `p1-04-roadmap.md`; UI plus API is one domain) holds ≥ 20% of the plan's tasks (Step 2 checks this — see `p2-02-plan.md`), or two independent domains emerge during implementation

Revise the affected spec sections, then (after user confirmation) set `Phase 2 Scope: feature` in `docs/roadmap.md` and `phase2_scope` to `feature` in `docs/backlog.json`, and run each remaining Must feature from Step 1, seeding its spec from its section of `docs/specs/spec.md`.

**Parallel features.** Features of the same group may run at once, each in its own session or worktree on its own `feature/<feature-slug>` branch (per `p2-03-implement.md`). Never select a feature that is `in-progress` or whose log shows a step started. Each cycle reads the wave design already applied to `docs/data-model.md`, `docs/flows.md`, and `docs/architecture.md`, never rewrites a Shared Surface item it does not own, and sends a missing entity, field, screen, or contract to `kit/phase-3-iterate.md` Step 4 ("Design change requests") instead of patching it. On merge conflicts in `docs/backlog.json`, `docs/phase-2-session.md`, or `docs/E2E-TESTS.md`, keep both sides' entries and re-run `node kit/scripts/render-backlog.js`; never discard an event.
