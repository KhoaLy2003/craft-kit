# Building an Admin Site

Use this when your product needs an administrator site: managing users and roles, an audit log, settings, and modules for things like payments or content.

It is experimental: not yet validated in a test round. Admin features are not a separate workflow. They run through the [Maintenance workflow](/phases/phase-maintenance) and then Phase 2, like any other feature. Maintenance intake loads `kit/guides/admin-checklist.md` for any admin-tagged feature; that checklist holds the sequencing, scope and security rules.

It needs a running app with Phase 2 shipped, and no open `feature/*` branch that touches the backend areas the admin will use.

---

## Starting

```text
Run Maintenance using kit/phase-maintenance.md.
```

Choose "add a new feature", then describe the admin feature you want. In Phase 1 the roadmap records whether you expect an admin site (`yes`, `no` or `later`). It is only a hint.

---

## How It Runs

1. **Intake.** Maintenance intake marks the feature as admin and reads the admin checklist. The AI proposes the modules, roles and permissions the admin needs and records the agreed scope in the feature's `intake.md`. You review and approve it at the intake gate, including the impact on your main app: new admin routes, an access guard and an audit log.
2. **Admin Shell first.** The first admin feature is the `Admin Shell`: sign-in, role-filtered menu, blocked non-admins, one audited action. Every module feature depends on it, and `render-backlog` rejects a module that starts before the Shell has shipped.
3. **Phase 2.** Each admin feature is then built, reviewed and shipped through Phase 2 like any other feature.

At Ship, walk through the site as *each* role, not only as an admin, to see that a role cannot reach what it should not. Passwords come from your git-ignored `.test-accounts.json`.

---

## What You Get

| You get | Where |
|---|---|
| The agreed scope: modules, roles, permissions, impact | `intake.md` in the feature's spec folder |
| The admin code and the backend changes | your repository, as backlog features |
| An "Admin" block in the end-to-end tests | `docs/E2E-TESTS.md` |

---

## When Something Goes Wrong

- **You approve zero modules.** The work ends as blocked, with no code changes.
- **Another feature branch is open on the backend.** The AI stops until it is merged.
