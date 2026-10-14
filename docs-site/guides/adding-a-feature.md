# Adding a Single Feature

Use this when your app has already shipped and you know exactly one feature you want to add, and it fits the existing architecture. You skip the planning phase and go straight to building it with Phase 2, one feature per cycle.

If you are not sure what to build, or the feature may change the architecture, a service, the data model, auth, or the designs, use [Phase 3 — Iterate](/guides/phase-3-iterate) instead. Phase 3 checks those things before anything is built. This path does not.

> **Status: experimental.** Phase 2 `feature` scope has not been validated in a test round.

---

## Before You Start

Your project's `docs/` folder needs:

- `backlog.json` and `roadmap.md` from the original build
- `constitution.md`, `architecture.md`, and `DESIGN.md`
- The app shipped, or at least runnable

---

## Step 1 — Add a Release and the Feature to the Backlog

Ask your AI to add the feature. You describe it in plain words; the AI writes the entries. Each feature needs its own small release, so the release can be marked shipped when the feature ships. The two entries look like this:

```json
{
  "releases": [
    { "id": "r-csv-export", "name": "CSV export", "status": "planned" }
  ],
  "features": [
    {
      "id": "F12",
      "name": "Export habits to CSV",
      "priority": "Must",
      "size": "S",
      "status": "pending",
      "release": "r-csv-export",
      "depends_on": [],
      "events": [
        {
          "type": "created",
          "at": "2026-10-13T09:00:00Z",
          "source": "live",
          "by": "orchestrator",
          "note": "Added directly to the backlog"
        }
      ]
    }
  ]
}
```

- **`id`** of the feature continues from the highest existing ID. If the backlog ends at `F11`, the new feature is `F12`.
- **`release`** must match a release `id`. Use a short name for it, such as `r-csv-export`.
- **`name`** is the short title shown on the board. Keep it under 80 characters.
- **`depends_on`** lists the IDs of features this one needs first, or `[]`.

Then ask the AI to run:

```bash
node kit/scripts/render-backlog.js
```

The script checks the whole file before it writes anything. If it reports an error, nothing changed; the AI should fix the entry and run it again.

---

## Step 2 — Set the Phase 2 Scope to `feature`

Phase 2 builds one feature per cycle only when the scope is `feature`. That setting appears in two places, and both must say `feature`:

- `docs/roadmap.md`, in the metadata at the top: `Phase 2 Scope: feature`
- `docs/backlog.json`, the top-level `phase2_scope` field

If either says `all`, change it before you continue. With `all`, Phase 2 would try to build every Must feature in one cycle.

---

## Step 3 — Build It with Phase 2

Share `kit/phase-2.md` with your AI, then send:

```text
Run Phase 2 using kit/phase-2.md.
```

Phase 2 picks the next `pending` feature in build order, which is your new feature if nothing else is pending. It then runs one cycle:

| Step | What happens | Your part |
|---|---|---|
| 1. Spec | Writes the feature's spec | **Approve the spec** (hard gate) |
| 2. Plan | Splits the work into tasks | Nothing |
| 3. Implement | Builds on a new `feature/<slug>` branch | Nothing |
| 4. Review | Checks the code against the spec | Nothing |
| 5. E2E | Runs end-to-end tests | Nothing |
| 6. Manual Check | Asks you to walk through the feature | **Test it and confirm** (hard gate) |
| 7. Ship | Opens one pull request, records the shipped feature and release, and commits the update to the same PR | Review and merge the PR yourself |

The AI never merges to `main`.

When the cycle ends, the feature and its release are `shipped`. If no `pending` features are left, the AI offers the next step: [Phase 3](/guides/phase-3-iterate) to decide what to build next, or the bug-fix workflow for a reported problem.

---

## When Not to Use This Path

- The feature needs a new service, a database change, or a new login or permission model.
- The feature needs screens that have no designs. Phase 2 can build from `DESIGN.md` alone, but the result is less precise. Run the screen-design step first if layout matters.
- You have several ideas and need help choosing. Use Phase 3.
