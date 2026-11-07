# Phase 2, `scope: feature`

> Read only when `Phase 2 Scope: feature` (experimental), under `scope: all` when the Mid-Cycle Escape below applies, or when Ship offers "add a feature".

**Feature loop.** Select a `pending` feature whose `depends_on` features are all `shipped`, in build order. Run Steps 1–7, then start a new log section and repeat.

## Mid-Cycle Escape (`scope: all` → `feature`)

Stop the cycle if any of these surfaces:
- A feature is much more complex than estimated (L-sized in practice)
- A spec gap that substantially re-scopes a feature
- A technical decision that invalidates later features' specs
- A second domain (a distinct area needing a different specialist skill or a separate deployable concern — definition in `p1-04-roadmap.md`; UI plus API is one domain) holds ≥ 20% of the plan's tasks (Step 2 checks this — see `p2-02-plan.md`), or two independent domains emerge during implementation

Revise the affected spec sections, then (after user confirmation) set `Phase 2 Scope: feature` in `docs/roadmap.md` and `phase2_scope` to `feature` in `docs/backlog.json`, and run each remaining Must feature from Step 1, seeding its spec from its section of `docs/specs/spec.md`.

**Parallel features.** Independent features (no `depends_on` link) may run at once in separate sessions, each on its own `feature/<feature-slug>` branch (per `p2-03-implement.md`) with no shared design. Never select a feature that is `in-progress` or whose log shows a step started. On merge conflicts in `docs/backlog.json`, `docs/phase-2-session.md`, or `docs/E2E-TESTS.md`, keep both sides' entries and re-run `node kit/scripts/render-backlog.js`; never discard an event.

## Adding one feature to a finished release

Use `kit/phase-maintenance.md`, which runs the fit check and does the following:

Append a release entry (`id`, `name`, `status: planned`) and the feature (`release` set to that id, status `pending`, a `created` event with `at`, `source`, `by`, `note`) to `docs/backlog.json`; run `node kit/scripts/render-backlog.js`; set `Phase 2 Scope` to `feature` in `docs/roadmap.md` and `phase2_scope` in `docs/backlog.json`; then run Phase 2 with `scope: feature`.
