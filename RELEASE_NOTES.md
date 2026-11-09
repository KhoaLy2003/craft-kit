## Docs Viewer

Browse your project's `docs/` folder as a VitePress website with live reload and search.

**Usage:** `node kit/scripts/view-docs.js` runs a dev server that watches `docs/` for changes. Use `--build` to generate a static site for CI or deployment.

**Key features:**
- **Navigation:** Sidebar organized by document group; Specs nested by feature folder; full-text search
- **Reading experience:** Wider column (850px at 1440px), tables that scroll in their own box, status badges with metadata folded, Mermaid diagrams with expand button
- **Generated pages:** Overview, Documents list, Backlog board, Artifacts viewer
- **Safety:** Read-only mirror of `docs/` to `~/.craft-kit/viewer/sites/`; JSON, dotfiles, and non-web files never copied; HTML sanitized
- **Zero setup:** VitePress and Mermaid installed once into `~/.craft-kit/viewer/` (configurable via `CRAFT_KIT_HOME`); kit updates reach the viewer immediately

No document migration needed — the viewer works with existing docs. Documents without a `Status` header simply show no badge.

See `kit/START.md` quick start for entry point, or run `node kit/scripts/docs-index.js` to generate a JSON index that other tools can consume.
