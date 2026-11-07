# Change control — when a registered feature changes

> Read only when a feature is dropped, cancelled, or changed after Maintenance registered it (`kit/phase-maintenance.md`).

Applies at any point after Maintenance Step 3 registers the feature, including mid-build. Approved amendments do not guarantee a feature ships, so each must be reversible.

- **Decide on the backlog first.** Never delete a feature. To drop one, append a `cancelled` event (`by: user`, `note`: the reason; the validator rejects an empty note) and set `status: cancelled`; keep `release` so the history stays traceable. Run `node kit/scripts/render-backlog.js`.
- **Reverse its amendments.** Collect the feature's changes to foundation documents: anything its spec's `## Data & Flow Impact` or plan's `## Architecture Impact` added, and any approved amendment from its `intake.md`. Show the list; revert each item after approval. **Keep an item another non-cancelled feature also uses.** Refresh `Last updated` and re-render affected diagrams (`kit/guides/diagrams.md`).
- **Spec, plan, designs.** Leave `docs/specs/<feature-slug>/` and `docs/designs/<feature-slug>/` for the record; set the spec `Status` to `cancelled` (skip detection never treats it as approved; a revived feature re-approves at Step 1).
- **Code.** If `feature/<feature-slug>` exists, ask whether to discard or park it; never delete a branch unconfirmed.
- **Dependents.** If a non-cancelled feature `depends_on` a cancelled one, offer: drop it too, drop the dependency, or build the missing piece. Then update the Build Order and confirm it before Phase 2 picks the next `pending` feature.
- **Foundation work.** Cancel a foundation feature that only served the cancelled one; build no speculative schema or infrastructure.
- **New requirements mid-build.** Park them for a new Maintenance run (`kit/phase-maintenance.md`), unless they change an existing feature's behavior (`kit/guides/evolving-specs.md`).
- **Release status.** A release whose features are all cancelled gets `status: cancelled`. Otherwise Phase 2 Ship closes the release when no `Must` feature is `pending` or `in-progress`; cancelled features do not hold it open.
- Record every cancellation, the reverted items, and the branch decision in `docs/maintenance-session.md`.
