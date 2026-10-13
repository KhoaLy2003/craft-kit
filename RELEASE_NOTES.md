## Highlights

- **Readable backlog board.** Each card now shows only the essentials: ID, priority, size, a short title, and the created, started, and shipped dates. Click a card to see the full title, release, dependencies, and the complete history with evidence.
- **Safer migration of existing projects.** When several features were changed in the same git commit, the migration no longer gives them all the same date. Those dates now stay unknown unless you confirm each one, and the board warns when many features share one timestamp.
- **Consistent generated files.** The roadmap table keeps your file's line endings, so it no longer mixes Windows and Unix line endings.

## Upgrading

If you already migrated a project, re-run `node kit/scripts/render-backlog.js` to refresh `backlog.html`. Check any warnings it prints about shared timestamps.
