<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

**Data model and flows are now part of the kit.** Phase 1 Step 6 also produces `docs/data-model.md` (entities, relationships, an entity-relationship diagram, feature × entity matrix) and `docs/flows.md` (screen inventory, screen flow, data flow, cross-feature hand-offs). Phase 2 plans validate schema tasks against them, every spec lists its Data & Flow Impact, and review flags divergence between code and docs.

**Diagrams through Archify.** The installer now offers the `archify` skill. The kit renders a small, filtered set of interactive diagrams to `docs/diagrams/` (the ER diagram, system overview, large screen flows and core journeys; at most 7 per project). Everything else stays as Mermaid in the markdown. Entity-relationship rendering needs Archify 3 or later.

**Upgrading an existing project.** Run `Run the project upgrade using kit/phase-upgrade.md.` It detects which documents are missing (`backlog.json`, `data-model.md`, `flows.md`) and runs the roadmap migration and the new docs backfill, which reverse-engineers the data model and flows from your code and asks you to review every uncertain item. Phase 2 stops at a Docs preflight and points you there if the documents are missing. The installer prints the same hint when it detects an older project.

**Migration.** Re-run the installer with `--force`. Your `docs/` folder is never touched.
