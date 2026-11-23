<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

## Lite kit now follows the full build flow

The lite kit (`npx github:KhoaLy2003/craft-kit --lite`) has six short steps, each ending at your approval: Setup, Spec, Plan, Build, Verify, Ship.

- **Setup asks until your idea is clear.** There is no question limit; the AI keeps asking, one question at a time, until nothing important is a guess, then shows a brief for you to approve.
- **Spec and Plan before any code.** Each feature gets checkable acceptance criteria, and the plan maps every task to them.
- **Independent review and verification.** A fresh reviewer checks the build against the spec, and every criterion is run and marked PASS, FAIL or BLOCKED before you do a manual check.
- **Context stays small.** Subagents draft, build, review and verify; the AI suggests a new session after Setup and after Build, and `docs/NOTES.md` carries the state.

Existing lite projects: re-run `npx github:KhoaLy2003/craft-kit --lite --force` to update.
