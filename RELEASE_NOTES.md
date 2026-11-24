<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

Lite kit fixes from issues #91–#94:

- The audit recorder now works in projects whose package.json sets "type": "module" (for example Vite apps).
- Setup checks the three audit hooks and smoke-tests the recorder before the first question.
- Specs record the data each feature needs, and approved specs change only through a logged amendment.
- Build uses the best-fitting agent and does not reach the gate without a review.
- Ship lands the work without renaming branches, and records where the plan was before it is deleted.
- Your own instructions take precedence over kit rules where they conflict.
