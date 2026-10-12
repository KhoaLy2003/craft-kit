## Highlights

- **Feature status and dates are now recorded.** Features live in `docs/backlog.json`, and every status change is stored with a date: when a feature was created, started, shipped, or deferred. Phase 2 and Phase 3 add these events automatically, so the roadmap works as a reference after several releases.
- **Generated backlog board.** `docs/backlog.html` shows every release with features grouped by status. It is a static page that opens offline, with no install and no server. The feature table in `docs/roadmap.md` is generated from the same data.
- **Honest migration for existing projects.** Run the roadmap migration once: send your AI `Run the roadmap migration using kit/phase-roadmap-migrate.md.` It shows the dates it found in git history and asks you to confirm, correct, or mark each one unknown. It never invents dates, and unconfirmed dates are marked as unverified.

## Upgrading

If your project already has a hand-maintained roadmap table, run the migration before using Phase 2 Ship or Phase 3 Prioritise. Both now write to `docs/backlog.json`.
