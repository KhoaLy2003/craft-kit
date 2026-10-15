<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

**Clearer setup.** Getting Started now covers the terminal, Node, Windows commands, how to share files with your AI, and the `DESIGN.md` you need before Phase 1 Step 3. A glossary explains Must, gate, scope, and domain in plain words.

**Safer Ship.** Ship checks for a git remote, authentication and a PR route before pushing, and falls back to a local-only commit. Test credentials live in `.env`; `E2E-TESTS.md` holds key names only.

**Fewer surprises.** Phase 1 checks required skills and agents at the start. "Domain" is defined, so a typical UI + API app stays on `scope: all`. Step 1 is a soft gate, handover edge cases are resolved, and tool-specific wording is now platform-neutral.

**Overview diagram.** A new big-picture diagram on the home page, in Getting Started and in the README. The unused prototype background guide is removed.

**Migration.** Re-run the installer with `--force`. Files you added yourself are never touched.
