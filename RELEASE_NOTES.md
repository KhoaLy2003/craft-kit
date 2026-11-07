<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs, this file resets automatically. -->

## Admin sites go through Maintenance

- **No separate admin workflow.** Admin features now run through the Maintenance workflow and Phase 2, like any other feature. Maintenance intake loads one reference, the admin checklist, which covers the admin shell, scope and security rules.
- **The admin shell comes first.** Each admin module depends on the shell feature, and the backlog validator refuses a module that has started before its shell has shipped.
- **Stricter backlog check for every project.** A feature cannot be in progress or shipped while a feature it depends on is still unshipped.
- The docs site's admin guide and *What to Say* table use the Maintenance prompt.
