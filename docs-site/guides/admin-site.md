# Building an Admin Site

Use this workflow after Phase 2 has shipped, when your product needs an administrator site: managing users and roles, an audit log, settings, and modules for things like payments or content.

It is experimental: not yet validated in a test round. The stack and layout are fixed (see [Admin Blueprint](/guides/admin-blueprint)); this workflow decides **what** the admin site manages, then builds it.

It needs a running app with Phase 2 shipped, and no open `feature/*` branch that touches the backend areas the admin will use.

---

## Starting

```text
Build the admin site using kit/phase-admin.md.
```

In Phase 1 the roadmap records whether you expect an admin site (`yes`, `no` or `later`). It is only a hint. You can run this workflow either way.

---

## The Five Steps

| Step | What the AI does | Your part |
|---|---|---|
| 1. Scope | Reads your app and proposes the modules the admin site should manage, the roles, and who can do what | **Edit the module list, then approve it** (hard gate) |
| 2. Spec & Plan | Writes one spec with acceptance criteria per module, and a plan: the shell first, then one group per module | Read the summary. It continues unless you object |
| 3. Implement | Builds on `feature/admin`. Before any module starts, it proves the shell works: sign-in, role-filtered menu, blocked non-admins, one audited action | Nothing |
| 4. Review & E2E | Reviews the whole branch for security, then runs end-to-end tests for each role against each module action | Nothing |
| 5. Ship | Starts the app and the admin site, then waits for you | **Sign in as each role, walk through the modules, and approve** (hard gate). Then it commits and opens one pull request |

---

## The Decisions That Matter

**Scope (Step 1).** Every proposed module points to something real in your app (an entity or a feature). Add what is missing, remove what you do not want, and the AI re-checks for conflicts (for example, "Contracts depends on Users, which you removed"). You are approving three things at once:

- the list of modules
- the roles and what each can do
- the **impact on your main app**: the admin site adds `/api/admin/*` routes, an access guard and an audit table to your backend, and may add a role field or an admin login. The pull request changes the main app as well as adding `admin/`.

**Ship (Step 5).** Walk through the site as *each* role, not only as an admin. The aim is to see that a role cannot reach what it should not. The AI gives you the accounts and URLs. Passwords come from your git-ignored `.test-accounts.json`.

---

## What You Get

| You get | Where |
|---|---|
| The approved scope: modules, roles, permission matrix, impact | `docs/admin/scope.md` |
| Spec and plan | `docs/specs/admin/spec.md`, `docs/specs/admin/plan.md` |
| The admin site and the backend changes | `admin/` and your backend, on `feature/admin` |
| An "Admin" block in the end-to-end tests | `docs/E2E-TESTS.md` |
| One pull request | Never merged for you |
| A log | `docs/admin-session.md` |

The data model and architecture documents are updated at the Scope approval with the audit table, any role field, and an "Admin Site" section.

---

## When Something Goes Wrong

- **You want a different stack.** The stack is fixed by the blueprint. This workflow does not support another one.
- **You approve zero modules.** The workflow ends as blocked, with no code changes.
- **Another feature branch is open on the backend.** The AI stops until it is merged, so the two do not collide.
- **The app was built without the kit.** The AI writes minimal architecture and constitution documents from your code first, and asks you to approve each.
- **A shell check fails.** The AI fixes the shell before building any module.

---

## Reference

The files the AI follows, shown in full: [Admin Site Workflow](/phases/admin) and [Admin Blueprint](/guides/admin-blueprint).
