<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

## What's new

- **Phase 2 Plan now picks skills and agents for you.** Step 2 looks at the skills and agents installed on your machine and assigns the best fit to each task, with a one-line reason. It also tells you if a skill the kit requires (for example `design-taste-frontend` or `archify`) is not installed.
- **You approve the choices before any code is written.** Step 2 is now a hard gate with two questions: approve the agent and skill assignments, and approve the parallel groups. Reply with changes and the plan is updated; implementation starts only after you answer.
- **Works with any agent name.** The kit no longer assumes your platform calls its general-purpose agent `task`. If a planned agent or skill is missing later (for example on another machine), implementation falls back to the general-purpose agent and logs it.
- **Tighter plans.** Each task field is one line of at most 300 characters, and plans carry no preamble or extra sections, so they are easier to review at the gate.

## Upgrading

Re-run the installer with `--force`. Plans written before this release stay valid; run Step 2 again to get the new Skills and Agents table.
