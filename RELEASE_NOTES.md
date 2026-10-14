## Highlights

- **Fixed backlog setup in Phase 1.** The roadmap step now fills the required project fields. Before, the backlog validator rejected the template and the render step failed.
- **Adding one feature works end to end.** The single-feature path now adds a release entry with the feature, so the backlog validates from pending through shipped.
- **Releases track their features.** A release moves to in progress when its first feature starts, and to shipped when its Must features are done.
- **Phase 3 writes only after you approve.** Nothing is added to the backlog until you approve the scope.
- **Safer shipping.** Ship opens the pull request first, then commits the updated backlog to the same pull request.
- **Bug fixes and resuming.** Bug fixes add a regression test and record their gate in the session log. Resuming a session restores the step as in progress.
- **New guides.** Phase 2 — Build, Phase 3 — Iterate, Adding a Single Feature, and Resuming in a New Session.

## Upgrading

No action is needed for existing projects. If you ran Phase 3 or added a feature by hand, check that `phase2_scope` in `docs/backlog.json` matches `Phase 2 Scope` in `docs/roadmap.md`, and that each new feature has a release entry.
