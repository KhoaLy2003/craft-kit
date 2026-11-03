# What's new

Session logs and the E2E doc no longer grow without limit.

- **Ship now archives each shipped feature.** Its session-log notes, E2E block and run-log rows move unchanged to `docs/archive/`, leaving a short stub and an Outcome line.
- **Existing projects can clean up.** Run the project upgrade (`kit/phase-upgrade.md`): a new Log Collapse module archives the features you already shipped, after you approve.
- **Lint warns early.** `lint-docs` now flags oversized session logs and E2E docs, uncollapsed shipped features, and long run-log rows. Warnings never block.
- **E2E doc is leaner.** The AC table gets an `Evidence` path column, and run-log rows are one line.
