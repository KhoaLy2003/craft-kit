# Admin Site Workflow

> **Experimental — not yet validated in a test round.** Use after Phase 2 has shipped, to build the administrator site (users, roles, audit log, settings, plus domain modules such as payments or contracts). The admin app uses the project's own stack; screen contracts and backend rules are fixed by the **Blueprint** at the end of this file. The workflow decides only *what* the admin site manages, then builds it.
>
> Prerequisites: a runnable application with Phase 2 shipped; `docs/architecture.md`, `docs/constitution.md`, `docs/DESIGN.md`, `docs/roadmap.md`; no open `feature/*` branch touching the backend areas the admin routes will use. If the roadmap says `Admin Site: no` but the app clearly needs oversight, proceed and note the mismatch in `scope.md`.

Universal rules: `kit/orchestrator-conventions.md`. Session log: `docs/admin-session.md`, one table (`kit/session-logging.md`).

**Resume and handover.** A session that finds `docs/admin-session.md` with unfinished steps resumes per conventions rule 18; `docs/admin/scope.md` with `Status: draft` means Step 1 is not approved. Seams: after the Scope gate or the shell checkpoint (rule 19, `kit/guides/session-handover.md`).

## Steps

| Step | Name | Gate | Model | Agent | Output |
|---|---|---|---|---|---|
| 1 | Scope | hard | capable | general-purpose agent (read-only) + user | `docs/admin/scope.md` |
| 2 | Spec & Plan | soft | balanced | orchestrator; `writing-plans` | `docs/specs/admin/spec.md`, `docs/specs/admin/plan.md` |
| 3 | Implement | none | balanced | specialists per `kit/task-agent-rubric.md` | code on `feature/admin` |
| 4 | Review & E2E | none | capable | general-purpose agent with `code-review-and-quality`, `security-and-hardening`; Playwright | findings fixed, E2E suite green |
| 5 | Ship | hard | balanced | orchestrator + user; `finishing-a-development-branch` | commit and PR |

---

## Step 1 — Scope | Gate: hard

Decide which modules the admin site manages, who can do what, and what the build will touch.

**Inputs:** `docs/architecture.md`, `docs/data-model.md`, `docs/specs/`, `docs/roadmap.md` (including `Admin Site`), the auth code, any payment, contract, upload, notification, or moderation code.

### Rules

- Create `docs/admin-session.md` first. Create `docs/admin/scope.md` with the standard metadata header (`Status: draft`, `Last updated`, `Based on`) and these sections. Fill Section 1 round by round; fill 2–5 once the module list is stable:
  1. **Modules** — table `Module | Source | Admin actions | Sensitivity | Status` (`proposed | kept | added by user | removed`), then the **Dashboard metrics** list (only these appear on the dashboard).
  2. **Roles & Permission Matrix** — one row per permission id `<module>:<action>`, one column per role, `✓` to grant; `super_admin` holds every permission.
  3. **Identity Model Check** — role model in the main app (`exists (where) | missing`), how admins authenticate (`credential login | OAuth-only | other`), consequence for the plan. A missing role model or credential login becomes task group 0 in Step 2.
  4. **Open-Branch Check** — open `feature/*` branches touching backend areas the admin routes will use, or `none`. If any, stop until they are merged.
  5. **Main-Codebase Impact** — `/api/admin/*` routes per module, the guard, the `admin_audit_log` table, any role field or credential login. State that the single PR changes the main app as well as adding `admin/`.
  6. **Review Rounds** — table `Round | Proposal summary | User edits | Agent review notes`.
- **Proposal.** Dispatch a general-purpose agent, read-only, to read the built app and propose modules (where entities and features live, not code). It also walks the baseline: users and roles, audit log, settings, dashboard, and "is there payment, contracts, uploads, notifications, moderation?". Each module names its source entity or feature, admin actions, and a sensitivity note; no source, no module.
- **User edit.** Write `scope.md`, give the path, and ask the user to add, change, or remove modules.
- **Re-review.** After each edit round run **one** agent re-review of the list (gaps, conflicts, dependencies such as "Contracts depends on Users, which you removed") with a final recommendation; record the round in Section 6. Repeat until the user explicitly approves the whole list.
- **On approval,** add the audit table and any role field to `docs/data-model.md`, an `## Admin Site` section to `docs/architecture.md` (the `admin/` app, routes, guard, audit log), `ADMIN_API_BASE_URL` to `admin/ENV_SETUP.md` and `admin/.env.example`, and any new main-backend variables to the root `ENV_SETUP.md` and `.env.example` (keep `Status: approved`, refresh `Last updated`).
- `Status: approved` and a refreshed `Last updated` on `scope.md` only after the user approves.

### Completion criteria

- [ ] Every section of `scope.md` is filled; every module traces to a source
- [ ] Roles and permission matrix cover every module action
- [ ] Identity check and open-branch check recorded; no blocking open branch
- [ ] The user explicitly approved the whole list, roles, and impact

**Gate summary:** *"The admin site will manage [N] modules — [list] — for [roles]. It adds `/api/admin/*` routes, a guard, and an audit table to the main app[, and a role model / credential login]. Do you approve this scope?"*

### Exceptions

- Zero modules approved: end the workflow as `blocked` with the reason in the session log; make no code change.
- No `docs/` artifacts (app built outside the kit): dispatch a general-purpose agent to reverse-write minimal `architecture.md` and `constitution.md` from the codebase; get the user's approval of each before continuing.

---

## Step 2 — Spec & Plan | Gate: soft

Turn the approved scope into one spec and one plan for the whole admin site. No agent is dispatched for the spec; the orchestrator writes it.

**Inputs:** `docs/admin/scope.md`, the Blueprint below, `docs/architecture.md`, `docs/constitution.md`, `kit/task-agent-rubric.md`.

### Rules

- **Spec** (`docs/specs/admin/spec.md`, standard metadata header): per module — purpose, actions with their permissions and audit events, list columns and filters, and numbered acceptance criteria (`AC-<module>-<n>`), including at least one permission-denied criterion per role per mutating action. Reference Blueprint screens by name; do not restate them.
- **Plan** (`docs/specs/admin/plan.md`) via the `writing-plans` skill, with a `Specialist:` line only where a task needs a skill (`kit/task-agent-rubric.md`) and parallel groups marked as that file describes. Task groups, in order:
  - **Group 0 (only if Step 1 required it):** role-model migration and/or admin credential login in the main app.
  - **Group 1 — Shell:** the `admin/` app skeleton, proxy and middleware, the `/api/admin/*` guard, the `admin_audit_log` table, the module registry, and one empty example module. Backend tasks and frontend tasks are separate tasks.
  - **Groups 2…N:** one group per approved module.
- Split any task that mixes frontend and backend work before assigning a specialist.

### Completion criteria

- [ ] Spec has acceptance criteria for every module, including permission-denied cases
- [ ] Plan opens with group 0 (if required) then Shell, then one group per module; parallel groups marked
- [ ] Summary presented to the user

**Gate summary:** *"The plan has [N] tasks: Shell plus [M] modules[, group 0 first]. Anything to change before building?"*

---

## Step 3 — Implement | Gate: none

Build `feature/admin` from the plan.

### Rules

- Create `feature/admin` (`using-git-worktrees`, as Phase 2 Step 3). No commits until Step 5.
- Dispatch per the plan: chains with `subagent-driven-development`, parallel groups with `dispatching-parallel-agents`.
- **UI dispatches** follow the Design dispatch contract (admin screens have no `docs/designs/` entries); pass the matching Blueprint screen contract as the brief; visuals come from `docs/DESIGN.md`.
- **Shell checkpoint — mandatory before any module starts.** Verify, against the running application:
  1. an admin signs in and sees a role-filtered menu
  2. a non-admin cannot reach the admin API: non-admin login returns `403`; `/api/admin/*` with a non-admin token returns `401`; an admin whose role lacks the permission gets `403`
  3. the example module renders its empty, loading, and error states
  4. one mutation writes one `admin_audit_log` row

  If any check fails, fix the Shell before continuing. Modules build on a Shell that has passed.
- Group 0 (if present) completes before the Shell.

### Completion criteria

- [ ] Shell checkpoint passed (all four checks)
- [ ] Every task in the plan done; the application builds and starts
- [ ] Nothing committed

---

## Step 4 — Review & E2E | Gate: none

### Rules

- **Security review.** A general-purpose agent loading `code-review-and-quality` and `security-and-hardening` reviews the full branch diff against the spec, constitution, and the Blueprint's Backend rules, confirming each:
  1. every `/api/admin/` route except `POST /api/admin/auth/login` calls the guard
  2. deny by default: a role lacking a permission gets `403`
  3. every mutation except login writes an audit row in the same transaction; failed logins and `401`/`403` refusals write rows too; `payload` has no secrets
  4. the token is never in `localStorage`, `sessionStorage`, a JS-readable cookie, or a URL
  5. list endpoints whitelist `sort` and `filter` keys and cap `pageSize`
  6. the login route is rate-limited: repeated failures return `429`
  7. the proxy rejects `.` and `..` path segments, including URL-encoded ones
- **E2E.** Add an "Admin" feature block to `docs/E2E-TESTS.md` (from `kit/templates/e2e-tests.md` if absent). Playwright, written and run by a general-purpose agent, covers the permission matrix (each role × each module action, allowed and denied) plus one happy path per module; no exhaustive UI pass.
- Admin accounts follow `kit/guides/test-accounts.md`.
- Run every case first (PASS, FAIL, BLOCKED); fix nothing inline. Send all failures and findings to the implementer in one dispatch, have the reviewer check the fix diff, and re-run the affected scope only.

### Completion criteria

- [ ] Security checklist passed
- [ ] Every permission-matrix case and every module happy path PASS
- [ ] Fix diffs reviewed; affected scope re-run

---

## Step 5 — Ship | Gate: hard

Manual check by the user, then commit and open the PR.

### Rules

- **Manual check (the hard gate).** Start the main app and `admin/`; the user signs in as each role and walks the modules. Give account ids and URLs (read passwords from `.test-accounts.json` for them; never write them into docs). No commit before approval.
- After approval, use the `finishing-a-development-branch` skill: commit everything on `feature/admin` as `feat(admin): add admin site — <module list>`, push, and open one PR against the base branch (conventions rule 17) containing the main-backend changes and `admin/`. Never merge it and never push to the base branch.
- Update `docs/admin-session.md` to show every step complete, with the PR link.

### Completion criteria

- [ ] The user approved after walking through each role
- [ ] One commit, branch pushed, one PR open against the base branch
- [ ] `docs/admin-session.md` complete with the PR link

**Gate summary:** *"The admin site is built and tested: [N] modules, [R] roles, [E2E result]. Walk through it as each role. Do you approve committing and opening the PR?"*

---

## Blueprint

What each screen must do, and the security-critical backend behavior. How it looks comes from `docs/DESIGN.md`, which takes precedence over anything else.

### Stack and layout

| Topic | Rule |
|---|---|
| Location | `admin/` at the repository root: same repo, own `package.json`, own deploy |
| Stack | The project's web stack from `docs/architecture.md`; if none, the Canonical Baseline in `kit/stack-catalog.md`. Tests use Playwright |
| Data | No database or ORM. The admin app only calls `/api/admin/*` on the main backend, so business actions go through existing logic and every mutation is audited in one place |
| Token | A server-side proxy holds it in an httpOnly cookie; browser JavaScript never sees it |
| Proxy | Forwards `/api/proxy/<path>` to `${ADMIN_API_BASE_URL}/api/admin/<path>`. Rejects (`400`) any path segment that is `.` or `..` after URL-decoding |
| No server layer in the stack | Note it in `scope.md` and add one in the Shell group |
| Env | `ADMIN_API_BASE_URL` (main backend origin, no trailing slash) is the one admin variable |
| Backend changes | Guard, `/api/admin/*` routes, audit table, role field (if missing): inside the main app's existing structure, same PR |

### Screen contracts

Every screen implements four states: **loading**, **empty**, **error** (with retry), **no-permission**.

| Screen | Must do |
|---|---|
| Shell | Menu built from the module registry, filtered by the session's permissions. A module the session cannot read is absent and its route shows no-permission. Topbar: admin, role, sign-out. Unauthenticated or expired → `/login`, keeping the original path |
| Dashboard | Cards for the metrics named in `docs/admin/scope.md` only, hidden without the module's `read` permission. Data from `GET /api/admin/dashboard`; a failing card shows its own error |
| List | Server-side pagination, sorting, search, filters; state in the URL (`page`, `sort`, `q`, `filter[...]`). Empty state tells "no records" from "no results for these filters". Row and bulk actions come from the registry, hidden without the permission |
| Detail | Read-only fields grouped by meaning; permission-gated actions; not-found state |
| Form | Validated on client and server; server errors map onto fields; submit disabled while pending; confirm on leaving with unsaved changes; on success return to the originating List with its URL state |
| Audit Log | Read-only List: filter by actor, event, date range; row detail shows `payload` |
| Settings | Grouped key-value forms; every save is audited; show who changed each group last, and when |
| Destructive action | `destructive: true` opens a confirmation naming the target and the verb; bulk shows the count; other actions never ask |

### Module registry

One declarative entry per module. The Shell renders menu and routes from it, so adding a module is adding an entry plus its screens.

| Field | Contents |
|---|---|
| `id` | kebab-case, unique |
| `label`, `route` | menu text, route path |
| `permission` | `<module>:read`; gates the menu item and the route |
| `list` | `endpoint`; `columns` (`key`, `label`, `sortable`); `filters` (`key`, `label`, `type` = `text` \| `select` \| `date-range`, `options`) |
| `actions[]` | `id`, `label`, `permission`, `scope` (`row` \| `bulk` \| `page`), `destructive`, `endpoint`, `audit` (event name, e.g. `user.suspended`) |

Permission ids are `<module>:<action>`, for example `users:read`, `users:suspend`.

### Backend rules

These live in the main app and are the security-critical part of the workflow.

#### Guard

One guard takes the required permission and protects every route under `/api/admin/` except login. A route that skips it is a defect.

| Situation | Response |
|---|---|
| No valid admin token | `401` |
| Valid token, role lacks the permission | `403` |
| `POST /api/admin/auth/login` | The only unauthenticated route |
| Repeated login failures, per account and per source address (e.g. 5 in 15 minutes) | `429` for 15 minutes |

#### RBAC

- Roles and permission sets are defined in one place in the backend, from the approved matrix in `scope.md`.
- Deny by default.
- `super_admin` holds every permission; no per-user overrides.
- The role is a field on the main app's user record. If there is none, `scope.md` records it and task group 0 adds it.

#### List endpoint

```text
GET /api/admin/<module>?page=1&pageSize=25&sort=<key>:<asc|desc>&q=<text>&filter[<key>]=<value>
→ { "items": [], "page": 1, "pageSize": 25, "total": 0 }
```

- `pageSize` is capped at 100.
- `sort` and `filter` keys are whitelisted per module; an unknown key returns `400`.

#### Audit record

Every successful mutation other than login writes one row to `admin_audit_log`, in the same transaction as the mutation. Failed logins and `401`/`403` refusals are also written (`auth.login_failed`, `access.denied`), never with the submitted password. The Audit Log screen reads this table.

| Column | Meaning |
|---|---|
| `id` | primary key |
| `occurred_at` | timestamp |
| `actor_id`, `actor_role` | who acted |
| `event` | the registry action's `audit` value |
| `target_type`, `target_id` | what was acted on |
| `payload` | JSON of the change; secrets redacted |
| `ip` | request origin address |

#### Token

- **Login:** `POST /api/admin/auth/login` with `{ "email", "password" }` checks the main app's existing credentials. `200 { "token", "expiresAt", "role", "permissions": [] }`; `401` bad credentials; `403` no admin role.
- **No credential login** in the main app (e.g. OAuth-only): `scope.md` records it and task group 0 adds one for admin accounts.
- **Lifetime:** signed, expires after 30 minutes, no refresh.
- **Cookie:** the proxy stores it as `admin_session`: `httpOnly`, `secure`, `sameSite=strict`, `path=/`, `maxAge` matching `expiresAt`.
- **Use:** the proxy sends `Authorization: Bearer <token>`; middleware redirects to `/login` when the cookie is missing or expired.
- **Never** in `localStorage`, `sessionStorage`, a JS-readable cookie, or a URL.
