# Phase 2 — Design Sprint

> **Use this when building Phase 3 releases or features added after Phase 1 that need screen
> designs before implementation begins.**
>
> Initial-build screens are produced in **Phase 1 Step 6 — Full Screen Design**. The Design
> Sprint is not part of the initial build; it serves new features that arrive without Phase 1
> designs attached.
>
> Run it once, covering all new features in the release, when 2 or more of those features need
> designer-provided screens and your designer is external or async.
>
> **When to use:**
> - 2+ new features in the Phase 3 release need screen designs
> - Your designer is external or async (Figma contractor, design agency, another team)
> - None of the new features have designs from Phase 1 Step 6 or a previous sprint
>
> **Prerequisites:** Phase 1 complete and the Phase 3 release block approved in
> `docs/roadmap.md` — `docs/constitution.md`, `docs/architecture.md`, and `docs/DESIGN.md`
> are all in place.
>
> **After this sprint:** use `kit/phase-2-feature-dev.md` for each feature, starting at
> Step 2 (Plan). Step 1 auto-skips when `docs/specs/<slug>/spec.md` already exists.

---

## Conventions

Read `kit/orchestrator-conventions.md` before executing: step banner format, time recording,
PROJECT_ROOT requirement, file-write verification, gate summary protocol, and fail-fast write
instruction.

Read `kit/session-logging.md` for the session log schema.

Before executing each step, read its step file — it is the authoritative source for that step's
inputs, outputs, rules, and completion criteria.

---

## Steps

| # | Name | Description | Gate | Step File |
|---|---|---|---|---|
| DS-1 | Spec All Features | Run Brainstorm & Spec for every pending feature in `docs/roadmap.md`, in roadmap order. Features that already have `docs/specs/<slug>/spec.md` are skipped. | `hard` per feature | `kit/steps/phase-2/p2-01-spec.md` |
| DS-2 | Batch Screen Design | Identify all required screens across all specced features; emit one combined handoff to the designer; accept and validate all designs in one pass. | `hard` (all features together) | `kit/steps/phase-2/p2-ds-batch-design.md` |

---

## Flow Diagram

```
Read docs/roadmap.md — collect pending features (status: pending)
              │
              ▼
[DS-1] For each pending feature (roadmap order):
  ├─ docs/specs/<slug>/spec.md exists? → skip (already specced)
  └─ Else: run p2-01-spec.md [hard gate per feature]
              │
              ▼
[DS-2] Batch Screen Design [hard gate — all features must pass]
  ├─ For each feature: check docs/designs/<slug>/ already covered? → skip
  ├─ Build combined required-screen list for remaining features
  ├─ Emit one batch designer handoff message
  ├─ Wait for designer delivery (files or MCP)
  └─ Validate coverage per feature — gate does not close until all pass
              │
              ▼
Sprint complete.
Every pending feature now has:
  docs/specs/<slug>/spec.md       ← acceptance criteria, edge cases, UI behavior
  docs/designs/<slug>/            ← validated screen files or design-manifest.json

Run kit/phase-2-feature-dev.md for each feature, starting at Step 2 (Plan).
Features may be implemented in any order.
```

---

## Execution Notes

### DS-1 — Feature ordering and hard gates

Run Step 1 (Brainstorm & Spec) for each pending feature **sequentially** — the brainstorming
skill requires focused context per feature. The hard gate fires after each feature's spec is
approved; do not batch multiple feature specs into one session or skip the user approval step.

Features that already have `docs/specs/<slug>/spec.md` are skipped silently. Record each skip
in the session log with `status: skipped, reason: spec_exists`.

### DS-2 — Single batch, one hard gate

DS-2 runs once after all pending features are specced. It reads every feature's spec, builds a
combined screen list, and emits a single designer handoff message covering all features. The
hard gate does not close until every feature's design coverage passes — no partial approvals.

Features that already have designs in `docs/designs/<slug>/` (files or a valid manifest) are
excluded from the batch and recorded as `status: skipped, reason: designs_exist`.

### Mixed state

The sprint handles partially-complete states safely:
- Some features specced, some not → DS-1 specs only the unspecced ones
- Some features designed, some not → DS-2 collects designs only for undesigned ones
- If all features already have specs and designs → both steps report nothing to do and exit;
  proceed directly to `kit/phase-2-feature-dev.md`

### Session logging

Record a DS-1 log entry per feature specced (wall-clock duration + credit delta) and a single
DS-2 entry for the entire batch design pass. Format per `kit/session-logging.md`.

---

## Notes on Skills

| Step | Skill / Agent | What it produces |
|---|---|---|
| DS-1 | `brainstorming` skill | `docs/specs/<slug>/spec.md` per feature |
| DS-2 | Orchestrator only — no agent dispatch | `docs/designs/<slug>/` files or `design-manifest.json` per feature |
