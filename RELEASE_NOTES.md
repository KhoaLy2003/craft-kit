## Highlights

- **Short feature titles.** A feature can now have a short title for the board and roadmap table, with the full text kept as a description. The description appears in the detail dialog when you click a card.
- **Long titles are flagged.** The renderer warns when a title is longer than 80 characters, so long text stops filling the roadmap table.
- **Guided title split in migration.** The roadmap migration proposes a short title for each long feature, keeps the original text unchanged, and writes nothing until you approve each title.

## Upgrading

Existing `backlog.json` files still work. Re-run `node kit/scripts/render-backlog.js` to see title warnings. Shorten or split those titles at your own pace.
