<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

**Generated docs no longer go stale.** Every document the kit creates now either has an explicit update trigger or is deliberately frozen. Phase 2 plans end with an Architecture Impact section that updates `docs/architecture.md`, `ENV_SETUP.md`, and `.env.example`; Ship syncs your project `AGENTS.md`; bug fixes list a Docs impact and amend the data model, flows, spec, and E2E tests; spec edits re-apply their data and flow amendments; E2E feature blocks are edited in place when a spec changes.

**Safer edits to approved documents.** An approved spec edited mid-build drops back to `draft` until you confirm it, and `docs/DESIGN.md` changes only with your explicit approval. The constitution's `Spec Evolution` section is now an explicit exception to its no-workflow-rules scope.

**Migration.** Re-run the installer with `--force`.
