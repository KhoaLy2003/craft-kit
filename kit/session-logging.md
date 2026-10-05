# Session Logging

> One session log per phase. It records what ran and where the outputs are; it does not replace the artifacts it points to.
> Update it at each gate and at completion (`kit/orchestrator-conventions.md`), not after every step.

## Log files

| Phase | File | Layout |
|---|---|---|
| Phase 1 | `docs/phase-1-session.md` | one table |
| Phase 2 | `docs/phase-2-session.md` | one section per feature (`## <feature-slug>`); `scope: all` uses the project slug |
| Bug fix | `docs/bug-session.md` | one section per bug (`## <bug-slug>`) |
| Phase 3 | `docs/phase-3-session.md` | one section per release (`## <release-slug>`) |

## Format

Create the file at the phase's first step. The header carries the tier → model map copied from `docs/MODELS.md` (see "Model tiers" in `kit/phase-1-bootstrap.md`). The steps table is copied from the Steps table in the phase file, one row per step.

```markdown
# <Phase> Session Log — <project-name>

Models: capable = <model> · balanced = <model> · fast = <model>

| Step | Name | Agent | Status | Output |
|---|---|---|---|---|
| 1 | <Step name> | <agent / skill> | pending | — |
```

| Column | Record |
|---|---|
| Step / Name / Agent | Copied from the phase file's Steps table |
| Status | `pending` · `in progress` · `complete` · `skipped` · `blocked` |
| Output | Path of the file(s) produced; `—` until complete |

Add free-text notes under the table for skip reasons, `design_md_fallback` screens, and decisions made at gates. Add a `Started` / `Duration` column only if you want timing; none is required.

Skipped steps record the reason in the Output column (e.g. `skipped — artifact_exists`).
