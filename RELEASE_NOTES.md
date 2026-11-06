<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

## Faster, cheaper workflows

- Agents read less at every step: the rules file re-read each step is about 20% shorter, and long detail now loads only when a rule points to it. Fewer tokens spent per run.
- Phase 3 (Iterate) is split into five step files like Phases 1 and 2, so each step loads only what it needs.
- Phase 2 step files are tighter, with spec and plan templates doing the formatting work.
- The Admin workflow is a single file and now follows your project's own stack instead of a fixed one.
- The old roadmap-migration module is retired (run it from release v0.0.46 if you still keep a hand-written roadmap table).
- The docs site is easier to follow: task-first sidebar, a summary box on every workflow page, new guides for bootstrap, bug fixes, the admin site, onboarding and what to say to the AI.
