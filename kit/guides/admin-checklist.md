# Admin Site Checklist

Reference for administrator features. It is not a workflow: an admin feature goes through `kit/phase-maintenance.md` (intake, then register) and Phase 2 like any other feature. Maintenance intake loads this file when a feature is admin-tagged (it adds the admin area, its routes, or its audit log). Use the project's own stack and conventions from `docs/architecture.md` and `docs/constitution.md`; this file sets only the rules every admin area needs.

## 1. Sequencing

- Build the **admin shell** first as its own feature: sign-in, role-based navigation and route access, and audit logging. Every admin module feature lists it in `depends_on`, so no module starts before the shell ships (`render-backlog.js` enforces this).
- If the app has no role model or no login for admins, that is a prerequisite feature the shell depends on.
- Do not start an admin feature while an open branch changes the backend code it will touch.

## 2. Scope

Before the first admin feature, agree with the user:

- Which parts of the app admins manage (users, roles, settings, audit log, and any domain data such as orders or content). Each one must map to an existing entity or feature.
- Who may do what: a short list of roles and the actions each may take. Deny by default; a role gets only what is listed.
- What the feature changes in the main app: new routes, a role field, an audit table, or an admin login.

Record the agreed scope in the feature's `intake.md` or spec, not in a separate file.

## 3. Security rules

These apply to every admin route and action:

- **Every admin route checks authentication and authorization**, through one shared guard. A route that skips the guard is a defect.
- **Unauthenticated requests get `401`; authenticated requests without the permission get `403`.**
- **Every successful mutation writes one audit record** in the same transaction, with actor, action, target, time and request origin. Denied attempts and failed logins are audited too. Audit payloads never contain passwords, tokens or other secrets.
- **Admin credentials and tokens are never exposed to browser JavaScript or stored in local storage or URLs.** Prefer a server-side session or an httpOnly cookie.
- **List endpoints** accept only whitelisted sort and filter keys and cap the page size.
- **Login is rate-limited** per account and per source address.
- **Input is validated on the server**, and admin screens show server errors on the fields they belong to.

## 4. Shell checks (before any module)

Verify against the running app:

1. An admin signs in and sees only the menu items their role allows.
2. A non-admin cannot reach admin routes, and an admin without a given permission is refused that action.
3. A sample screen shows its loading, empty and error states.
4. One admin mutation writes one audit record.

Fix the shell before any module starts.

## 5. Review checklist

Phase 2 review of an admin feature checks the diff against sections 3 and 4 and the spec. Each item from section 3 must hold for every route and action the feature adds.

End-to-end tests cover the permission matrix (each role against each admin action, allowed and denied) and one happy path per module. Test accounts follow `kit/guides/test-accounts.md`.
