# Session Logging

> One session log per phase. It records what ran and where the outputs are; it does not replace the artifacts it points to.
> Update it at each gate and at completion (`kit/orchestrator-conventions.md`), not after every step.

**Resuming:** to continue an unfinished log, send `Start using kit/START.md.` and then the prompt it prints (conventions rule 18).

## Log files

| Phase | File | Layout |
|---|---|---|
| Phase 1 | `docs/phase-1-session.md` | one table |
| Phase 2 | `docs/phase-2-session.md` | one section per feature (`## <feature-slug>`); `scope: all` uses the project slug |
| Bug fix | `docs/bug-session.md` | one section per bug (`## <bug-slug>`) |
| Maintenance | `docs/maintenance-session.md` | one section per feature (`## <feature-slug>`) |
| Adopt | `docs/adopt-session.md` | one table |

## Format

Create the file at the phase's first step. The header carries the tier → model map copied from `docs/MODELS.md` (see "Model tiers" in `kit/phase-1-bootstrap.md`). The steps table is copied from the Steps table in the phase file, one row per step.

```markdown
# <Phase> Session Log — <project-name>

Models: capable = <model> · balanced = <model> · fast = <model>   <!-- or `Model: <model>` when one model serves every tier -->

| Step | Name | Agent | Status | Output |
|---|---|---|---|---|
| 1 | <Step name> | <agent / skill> | pending | — |
```

| Column | Record |
|---|---|
| Step / Name / Agent | Copied from the phase file's Steps table |
| Status | `pending` · `in progress` · `complete` · `skipped` · `blocked` |
| Output | A path only (a file produced, or the PR once shipped); `—` until complete. Narrative goes to the destinations below, never into this cell |

Notes go under the table, one line each, at most 5 per unit: skip reasons, `design_md_fallback` screens, gate outcomes. Put a decision where it belongs, not in the log:

| Decision | Destination |
|---|---|
| Behavior (AC, edge case, non-goal) | the spec, edited in place (`kit/guides/change-control.md`) |
| Technical choice inside a feature | the plan task's key decisions, then the commit message |
| Cross-cutting (dependency, auth, route group, env var) | `## Architecture Impact` → `docs/architecture.md` |
| Not yet in any artifact at a handover | `docs/handover.md` |
| Minor finding or gap that ships open | `docs/known-issues.md` (one row; the log keeps only the count) |
| Incident (a rate-limited agent, a retry, a CI-trigger discovery, a repeated run) | the evidence folder (`docs/e2e-runs/<date>/`) for a test run, else `docs/known-issues.md` when it ships open; the log keeps at most a one-line note |

Never repeat what git history, `docs/backlog.json` events, or an artifact already holds.

**Collapse at ship (mandatory).** Phase 2 Ship (`kit/steps/phase-2/p2-07-ship.md`, section 4, which defines the stub format) archives a shipped unit's section, E2E block and Run Log rows, leaving a steps table with path-only Output cells and one `Outcome:` line. `docs/archive/` is never read automatically. Resume and handover read only the current unit's section. `node kit/scripts/lint-docs.js` warns on a shipped unit that still has notes, on more than 5 notes, on lines over 400 characters and on a log over 20 KB; existing projects clear those with `kit/phase-log-collapse.md`. Add a `Started` / `Duration` column only if you want timing; none is required.

Skipped steps record the reason in the Output column (e.g. `skipped — artifact_exists`).
