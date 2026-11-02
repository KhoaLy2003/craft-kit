<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

## Adopt and Upgrade now document more of an existing codebase

- **Business context in Adopt.** The survey now records what the system does, the business transactions the code implements, and the domain terms it uses. Adopt checks the features it infers from routes against them and asks you about any mismatch.
- **Component type and dependencies.** The architecture's key components table gains `Type` and `Depends on` columns, filled from code (`unknown` when the code does not show it).
- **New API Backfill module.** `Run the API backfill using kit/phase-api-backfill.md.` reverse-engineers `docs/api.md` from your code: HTTP endpoints with request and response shapes, validation rules and access, plus the interfaces your modules expose to each other. You review every uncertain item before anything is written. Adopt runs it when the code exposes an API.
- **Existing projects hear about it.** After `--force` the installer reports a missing `docs/api.md` and points at the project upgrade. If there is no API, or you decline, the module records an `n/a` `docs/api.md` and the reminder stops.
