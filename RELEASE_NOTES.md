<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

- Phase 2 Ship now deletes a feature's `plan.md` once it ships. Specs are kept as history; the plan's Architecture Impact is already merged into `docs/architecture.md`, so nothing durable is lost.
- Existing projects: `phase-upgrade.md` gains a step that finds plans of already shipped features and deletes them after one confirmation, flagging any Architecture Impact item that was never merged.
