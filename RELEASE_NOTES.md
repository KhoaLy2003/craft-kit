## Admin Site workflow (experimental)

Craft-kit can now build the administrator site for a project it has already built.

- **New workflow `phase-admin.md`:** run it after Phase 2. An agent reads your app and proposes what the admin site should manage; you add, change, or remove modules, and nothing proceeds until you approve the full list, the roles, and the permission matrix. Then it specs, builds, reviews, and ships the admin site in one PR.
- **Fixed, simple stack:** a thin Next.js admin app in `admin/` that only talks to `/api/admin/*` on your backend, so you make no stack decision. The blueprint defines the guard, roles, audit log, and token handling.
- **Phase 1 hint:** the roadmap step now asks whether the product will need an admin site (`yes | no | later`); it never counts as a feature.
- **Optional `evon:ui-ux` skill:** the installer offers it for building admin screens. The workflow works without it.

Status: experimental, not yet validated in a test round.
