<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->
## What's new

- **Lower token and credit use:** the kit files an agent reads across Phase 1 and Phase 2 are about 19% smaller, with the same workflow, gates, and outputs. Wording is tighter, and restated rules are replaced by pointers to the one place they live.
- **Rarely used rules load on demand:** diagram rendering, test-account handling, the Phase 2 `scope: feature` loop, Phase 3 change control, and the Step 5 design-tool (MCP) path now live in short guides under `guides/`. They are read only when a step needs them, so every other run skips them.
- **Lighter architecture step:** the stack catalog is now read selectively (baseline first, then only the deviation triggers and add-on domains your roadmap needs).
- **Phase 1 closeout moved into Scaffold:** the closeout checklist and the Phase 2 handoff prompt now sit in Step 8, the only step that uses them.
- **Audit fixes:** backlog validation rejects dependency cycles and malformed event dates, feature branches start from `main`, and the admin login rate-limit guidance is clearer.

This release has not been through a full kit test round. If an agent seems to skip a rule, check that it opened the matching `guides/` file, and report it.
