<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

## Leaner Adopt, fewer guides

- **Adopt is about 20% shorter and has 7 steps instead of 9.** MODELS.md is written with the backfill modules, and AGENTS.md at closeout. The three hard gates (architecture, constitution, baseline roadmap) and the "defaults" shortcut are unchanged.
- **Step 4 states only the Adopt-specific rules**; the backlog field values come from the validator and template instead of being repeated.
- **Changing a shipped feature** is now described in one place, Maintenance Step 1: a new name gets a new spec, the original name edits the existing spec in place. The separate *Evolving Specs* guide is gone.
- **Ship no longer asks "how will specs evolve"** and no longer adds a `Spec Evolution` section to the constitution. Existing constitutions that have it stay valid.
- Docs site: the *Adding a Single Feature* page is removed (use the Maintenance workflow), and a stale pointer to the retired roadmap-migrate module is fixed.
