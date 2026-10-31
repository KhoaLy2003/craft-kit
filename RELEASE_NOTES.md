<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->
## What's new

- **Agents no longer skip Phase 2:** after Adopt or Phase 3, a fresh session told "implement F15" used to code straight from the release design. The `AGENTS.md` that Phase 1 and Adopt write (and `CLAUDE.md` when present) now ends with a `## Workflow (craft-kit)` section that sends feature work to `kit/phase-2.md`, bugs to Bug Fix, and anything unclear to `START.md`.
- **Phase 2 entry guard:** no source file changes until the feature's spec is approved and its session-log section exists. "Implement all pending features" means one full cycle per feature under `scope: feature`.
- **Clearer handoffs:** Phase 3 now ends with "close this session and open a new one for Phase 2", a ready-to-paste prompt, and refuses to build in the same session. Adopt's closing note says Phase 3 comes first, because every baseline feature is already shipped. `START.md` routes "implement F12 / next feature / all pending".
- **Kit scripts work in ES-module projects:** `render-backlog.js` and `lint-docs.js` no longer fail with `require is not defined` when the project's `package.json` has `"type": "module"`.

If your project was set up with an earlier version, add the `## Workflow (craft-kit)` section from `kit/orchestrator-conventions.md` ("Project workflow block") to its `AGENTS.md`.

This release has not been through a full kit test round.
