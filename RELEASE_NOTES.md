<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

## Resume any workflow in a new session

- Leaving a workflow mid-way (Phase 1, 2, 3, Bug Fix, Admin or Adopt) and coming back in a new chat now works without a handover: send `Start using kit/START.md.` and it finds the unfinished step and prints the exact prompt to resume.
- Resume continues at the first unfinished step. Finished steps are never re-run, a step whose document is still a draft is picked up and asks for your approval again, and a step whose approved document is already on disk is marked complete.
- Every workflow now offers a "hand over" checkpoint after its hard gates, Adopt included.
