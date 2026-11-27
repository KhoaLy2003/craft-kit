<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

Ship checklist, so the agent stops forgetting docs and the changelog at Ship (full and lite kits):

- Each project gets its own ship checklist (`docs/ship-checklist.md`, or `docs/SHIP-CHECKLIST.md` in the lite kit), built from what the project actually has: changelog, README and docs, version, env example, migrations, CI, tracking. You review and edit it once.
- Ship checks every applicable item before commit, push and PR, shows pass / fixed / n/a / blocked with evidence, and stops on anything blocked or out of date. It never marks an item done without evidence.
- If a project has no checklist yet, Ship proposes one and asks you to approve it first.
- Existing full-kit projects: after updating the kit, run `Run the project upgrade using kit/phase-upgrade.md.` The new Ship Checklist Backfill module scans the project, proposes a checklist, and asks whether it is right or needs changes.
