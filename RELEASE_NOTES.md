<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

## Maintenance replaces Phase 3

- New **Maintenance** workflow (`kit/phase-maintenance.md`) for a shipped app. It asks one question: add a new feature or fix an existing bug?
- **Bug:** routes straight to the Bug Fix workflow.
- **Feature:** a short intake, then a fit check against your architecture, constitution, data model, flows and design. It stops for your approval only when the feature does not fit. It then registers the feature in `docs/backlog.json` and `docs/roadmap.md` and gives you the Phase 2 prompt.
- Much lighter than Phase 3: 3 steps instead of 5, no discovery brainstorm, no release-wide design, no closeout. About 40% less instruction text read per run.
- One feature per run. Phase 3 (Iterate) is removed; `START.md`, Adopt and the docs site now point to Maintenance. An existing `docs/phase-3-session.md` stays as history; new work logs to `docs/maintenance-session.md`.
