<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->
## What's new

- **E2E runs now leave evidence:** every Phase 2 Step 5 run and re-run saves the runner output, the HTML report, and failure traces or screenshots (non-browser projects: the request log) under `docs/e2e-runs/<date>/`. That folder is git-ignored; the committed `docs/E2E-TESTS.md` gets a new Section 8 Run Log with one row per run (date, command, scope, PASS / FAIL / BLOCKED counts, evidence path).
- **A defined closing report:** Step 5 ends with a summary of PASS counts (acceptance criteria and NFRs separately), per-feature counts, failures found with their fix and re-run result, excluded criteria with reasons, and the evidence path. It also reports a run that cannot start or a failure that survives the fix cycles.
- **Manual Check shows the evidence path** with the E2E results, so you can open the report before your walkthrough.

If your project already has `docs/E2E-TESTS.md`, add Section 8 (Run Log) from `kit/templates/e2e-tests.md`.

This release has not been through a full kit test round.
