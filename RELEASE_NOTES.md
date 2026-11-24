<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

## What's new

- **Report a kit problem more completely.** `/report-kit-issue` now handles a problem that is both a bug and a missing feature (both labels), can merge new facts into an issue you already opened (after your approval), and can file a long report with many points: it re-checks each point against your installed kit, drops the ones already fixed, groups the rest, and asks for one approval round.
- **Install docs match the kit.** The full and lite install pages now list the `report-kit-issue` skill and the `.craft-kit-skills.json` file the installer writes. The lite guide mentions `/report-kit-issue`.
- **Fewer doc mismatches.** A new test fails if a shipped kit skill is missing from the install docs.
