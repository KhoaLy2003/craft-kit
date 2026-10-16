<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

**Developer onboarding.** New experimental workflow for when someone joins your project. Say `Run developer onboarding using kit/phase-onboarding.md.` and the AI reads your README, setup scripts and docs, drafts the guide, and asks you to review every doubtful item at one gate. The result is `docs/ONBOARDING.html`: a single self-contained page with light and dark mode, side navigation, setup commands, environment variable names (never values), a repo map, conventions, and a first-week checklist. Re-run the same prompt to refresh it; earlier answers are carried over. Works for any project, with or without the rest of the kit.

**Migration.** Re-run the installer with `--force`.
