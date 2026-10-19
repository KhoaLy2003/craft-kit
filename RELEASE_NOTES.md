<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

**Code review now uses skills instead of a downloaded agent.** The installer no longer downloads the VoltAgent `code-reviewer` agent. It installs four skills from addyosmani/agent-skills instead (`code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization`), and Phase 2 Step 4 and Admin Step 4 run the review with your tool's general-purpose agent loading them.
