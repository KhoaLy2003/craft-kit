<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

**Clearer skill requirements.** The Phase 1 pre-flight and the *What You Need* page now say plainly that `design-taste-frontend` is required for visual-quality work, while other skills and agents fall back to the AI's general capability when missing.

**Migration.** Re-run the installer with `--force`. Agents retired in 0.0.27 (`frontend-developer`, `backend-developer`, `market-researcher`, `research-analyst`, `ui-ux-tester`) are no longer used; any copies left in `.agents/agents/` can be deleted.
