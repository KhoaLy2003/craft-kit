<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

## Lite kit for small personal projects

`npx github:KhoaLy2003/craft-kit --lite` installs a much lighter workflow into `kit-lite/`: three steps (Idea, Build, Wrap-up), one approval gate (the brief), and about three documents. Say "I want to build ..." and the AI starts the workflow on its own, because the installer adds a workflow block to `CLAUDE.md` (and `AGENTS.md` if present).

- **Conversation audit (Claude Code):** hooks record your prompts and the AI's final replies to `docs/audit/<date>-<session>.md` (git-ignored). Opt out with `--no-hook` or `--no-audit`.
- **One kit per project:** `--lite` is refused where the full kit is installed, and the full install is refused where lite is installed. `--force` does not override this.
- **Independent updates:** same release and version as the full kit, but `--lite --force` updates only `kit-lite/`, and a normal install or `--force` never touches it.
- Read the new [Lite Kit guide](https://khoaly2003.github.io/craft-kit/guides/lite-kit) for details.
