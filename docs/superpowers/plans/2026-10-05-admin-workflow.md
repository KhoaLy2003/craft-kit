# Admin Site Workflow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an experimental Admin Site workflow (`kit/phase-admin.md`) to craft-kit, with its blueprint, scope template, Phase 1 roadmap hint, optional `evon:ui-ux` install, and all docs wiring.

**Architecture:** The kit is markdown plus one CLI. The workflow is a single Phase-3-style file with five inline steps. A guide (`kit/guides/admin-blueprint.md`) holds the fixed stack, per-archetype behavior contracts, module-registry contract, and backend conventions. A template (`kit/templates/admin-scope.md`) is the Step 1 artifact. The CLI gains one optional skill install; one metadata line in the roadmap template carries the Phase 1 hint.

**Tech Stack:** Markdown, Node.js ≥ 18 CJS (`bin/cli.js`), `node:test` (`tests/cli.test.mjs`), VitePress (`docs-site/.vitepress/config.ts`).

**Spec:** `docs/superpowers/specs/2026-10-05-admin-workflow-design.md`

## Global Constraints

- Admin app: Next.js (App Router) + TypeScript + Tailwind v4 + shadcn/ui, deployed on Vercel; lives in `admin/` of the same repo; **no database, no ORM**; only calls `/api/admin/*` on the main backend. Auth: no auth library; httpOnly cookie held by the admin app's server layer. Tests: Playwright.
- Thin-Next rule: data screens are client-rendered; server side only for the proxy and auth middleware; no server components for data screens.
- Workflow: 5 steps, 2 hard gates (Step 1 Scope, Step 5 Ship); models: Scope `capable`, Spec & Plan `balanced`, Implement `balanced`, Review & E2E `capable`, Ship `balanced`.
- `Admin Site: yes | no | later` is **never a feature row** and is **excluded from every Phase 2 Scope criterion**.
- `evon:ui-ux` is a recommended **optional** skill; every step must work without it (fallback: `frontend-developer`).
- Kit conventions: English only; banner `## Step N — <Name> | Gate: <none|soft|hard>`; artifacts carry `Status` / `Last updated` / `Based on`; every kit change is logged in `kit/CHANGELOG.md` under `[Unreleased]`; never edit files under `kit/templates/` during a project run (this plan edits them as kit development).
- Any new backticked `.md` reference to a kit file must resolve (`tests/cli.test.mjs` "kit link integrity"; `docs/` paths are exempt).
- The docs-site build throws if a kit `.md` outside `templates/` and `resource/` has no page entry.

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `kit/guides/admin-blueprint.md` | Create | Fixed stack, layout, archetype behavior contracts, module registry, backend conventions, visuals precedence |
| `kit/templates/admin-scope.md` | Create | Step 1 artifact template (`docs/admin/scope.md`) |
| `kit/phase-admin.md` | Create | The workflow: steps, gates, rules, completion criteria |
| `kit/templates/04-roadmap.md` | Modify | `Admin Site` metadata line |
| `kit/steps/phase-1/p1-04-roadmap.md` | Modify | Rule + completion criterion for the hint |
| `kit/task-agent-rubric.md` | Modify | Admin UI routing row |
| `kit/session-logging.md` | Modify | `docs/admin-session.md` row |
| `bin/cli.js` | Modify | Optional `evon:ui-ux` install (TTY + non-TTY), admin quick-start line, generalised skill installer |
| `tests/cli.test.mjs` | Modify | Assert new quick-start path and evon command |
| `docs-site/.vitepress/config.ts` | Modify | Page table entries (workflow + blueprint) |
| `docs-site/reference/templates.md`, `docs-site/reference/required-skills.md` | Modify | New template row; optional skill row |
| `README.md`, `AGENTS.md`, `kit/CHANGELOG.md` | Modify | Workflow lists, gates, file lists, changelog |
| `docs/superpowers/specs/2026-10-05-admin-workflow-design.md` | Modify | Two corrections found while planning (Task 3) |

Order matters: Tasks 1 and 2 create files that Task 3 references, so Task 3's link check passes.

---

### Task 1: Admin blueprint guide

**Files:**
- Create: `kit/guides/admin-blueprint.md`
- Modify: `docs-site/.vitepress/config.ts` (the `GUIDES` array, after the `design-reference` entry)

**Interfaces:**
- Produces (later tasks reference these exact names): file path `kit/guides/admin-blueprint.md`; sections `§1 Fixed stack`, `§3 Screen archetypes`, `§4 Module registry`, `§5 Backend conventions`, `§6 Visuals`; permission id format `<module>:<action>`; the TypeScript type `AdminModule`; login endpoint `POST /api/admin/auth/login`; cookie name `admin_session`.

- [ ] **Step 1: Create the working branch**

```bash
git checkout -b feature/admin-workflow
```

Expected: `Switched to a new branch 'feature/admin-workflow'`.

- [ ] **Step 2: Write `kit/guides/admin-blueprint.md`**

````markdown
# Admin Blueprint

> Fixed stack, behavior contracts, and backend conventions for the admin site built by `kit/phase-admin.md`. The agent builds from this file and makes **no per-project stack decision**. This file defines **what each screen must do**; how it looks comes from `docs/DESIGN.md` (§6).

---

## 1. Fixed stack

| Layer | Choice |
|---|---|
| App | Next.js (App Router), TypeScript, deployed on Vercel |
| UI | Tailwind CSS v4 + shadcn/ui; shadcn data-table (TanStack Table); react-hook-form + zod |
| Charts | shadcn charts, only if the approved scope includes a chart |
| Data | None. The admin app has no database and no ORM |
| Auth | No auth library. The admin app's server layer proxies to the main backend and keeps a short-lived token in an httpOnly cookie; `middleware` blocks unauthenticated routes |
| Tests | Playwright |

**Why Next.js, not a Vite SPA:** the admin token must never live in browser JavaScript. A thin Next.js server layer (route handler) is the proxy that holds it. A SPA would need a browser-held token, or cross-origin cookie configuration on the main backend that varies by main stack.

**Thin-Next rule:** data screens are client-rendered. The server side exists only for the proxy and the auth middleware. Do not use server components for data screens: everything behind a login gains nothing from SSR or SEO.

**The admin app never touches the database.** It only calls `/api/admin/*` on the main backend, so business actions (refunds, suspensions) go through the existing business logic and every mutation is audited in one place.

## 2. Repository layout

- The admin app lives in `admin/` at the repository root, in the same repo as the main app. It has its own `package.json` and its own Vercel project (root directory `admin/`).
- One environment variable: `ADMIN_API_BASE_URL` (origin of the main backend, no trailing slash). Document it in `ENV_SETUP.md` and `.env.example` of `admin/`.
- Proxy route: `admin/app/api/proxy/[...path]/route.ts` forwards `/api/proxy/<path>` to `${ADMIN_API_BASE_URL}/api/admin/<path>`.
- Backend additions (guard, `/api/admin/*` routes, audit table, role field if missing) are made inside the main app's existing structure and ship in the same PR.

## 3. Screen archetypes — behavior contract

Every archetype implements the four states: **loading**, **empty**, **error** (with retry), and **no-permission**. Visual treatment is not specified here (§6).

### Shell
- The sidebar menu is built from the module registry (§4), filtered by the session's permissions. A module the session cannot read is absent from the menu and its route returns the no-permission state.
- Topbar shows the signed-in admin, their role, and a sign-out action; breadcrumb reflects the route.
- Not signed in → redirect to `/login`. Expired session → redirect to `/login` with the original path kept for return.
- Below the `lg` breakpoint the sidebar becomes a drawer closed by overlay click, link click, and Escape.

### Dashboard
- One screen of summary cards for the metrics named in `docs/admin/scope.md` only; no unlisted metrics.
- Each card is hidden when the session lacks the module's `read` permission.
- Data comes from `GET /api/admin/dashboard`; a failing card shows its own error state without blanking the page.

### List
- Pagination, sorting, search, and filters are **server-side** per §5.3. State lives in the URL (`page`, `sort`, `q`, `filter[...]`) so reload and back work.
- Search input is debounced 300 ms. The empty state distinguishes "no records" from "no results for these filters".
- Row actions and bulk actions come from the registry and are hidden when the session lacks the action's permission. Bulk actions show the selected count.
- A row opens Detail when the module defines one.

### Detail
- Read-only fields grouped by meaning; actions gated by permission; unknown id shows a not-found state.

### Form
- react-hook-form + zod. Server validation errors map back onto fields. Submit is disabled while pending. Leaving with unsaved changes asks for confirmation. On success show a toast and return to the originating List with its URL state preserved.

### Audit Log
- A List with no actions: filter by actor, event, and date range; row detail shows `payload`. Read-only.

### Settings
- Grouped key-value forms. Every save is a mutation and is audited. Show who changed each group last, and when.

### Destructive confirmation
- Any action with `destructive: true` opens a confirmation dialog that names the target and the verb; the confirm button is labeled with that verb. Bulk shows the count. Non-destructive actions never ask for confirmation.

## 4. Module registry

One declarative entry per module. The Shell renders menu and routes from the registry; adding a module is adding an entry plus its screens. Permission ids have the form `<module>:<action>` (for example `users:read`, `users:suspend`).

```ts
type AdminModule = {
  id: string                     // kebab-case, unique, e.g. "users"
  label: string                  // menu text
  route: string                  // e.g. "/users"
  permission: string             // e.g. "users:read" — gates the menu item and the route
  list: {
    endpoint: string             // e.g. "/users" (proxied to /api/admin/users)
    columns: { key: string; label: string; sortable?: boolean }[]
    filters: { key: string; label: string; type: 'text' | 'select' | 'date-range'; options?: string[] }[]
  }
  actions: {
    id: string                   // e.g. "suspend"
    label: string
    permission: string           // e.g. "users:suspend"
    scope: 'row' | 'bulk' | 'page'
    destructive: boolean         // true → confirmation dialog required
    endpoint: string             // e.g. "POST /users/:id/suspend"
    audit: string                // audit event emitted, e.g. "user.suspended"
  }[]
}
```

## 5. Backend conventions

These live in the main app. They are the security-critical part of the workflow and are specified exactly.

### 5.1 Guard
Every route under `/api/admin/` except the login route (§5.5) passes through one guard that takes the required permission. No valid admin token → `401`. Valid token whose role lacks the permission → `403`. `POST /api/admin/auth/login` is the only unauthenticated route. A route under `/api/admin/` other than the login route that does not call the guard is a defect.

### 5.2 RBAC
- Roles and their permission sets are defined in **one place** in the backend. Permissions come from the approved matrix in `docs/admin/scope.md`.
- Deny by default: a permission not granted to the role is refused.
- `super_admin` holds every permission. There are no per-user permission overrides.
- The role is a field on the user record of the main app. If the app has no role model, `docs/admin/scope.md` records it and the plan's task group 0 adds it.

### 5.3 List endpoint contract
`GET /api/admin/<module>?page=1&pageSize=25&sort=<key>:<asc|desc>&q=<text>&filter[<key>]=<value>`

Response: `{ "items": [], "page": 1, "pageSize": 25, "total": 0 }`.

`pageSize` is capped at 100. `sort` keys and `filter` keys are whitelisted per module; an unknown key returns `400`.

### 5.4 Audit record
Every successful mutation under `/api/admin/` writes one row to `admin_audit_log`, in the same transaction as the mutation:

| Column | Meaning |
|---|---|
| `id` | primary key |
| `occurred_at` | timestamp |
| `actor_id`, `actor_role` | who acted |
| `event` | the registry action's `audit` value, e.g. `user.suspended` |
| `target_type`, `target_id` | what was acted on |
| `payload` | JSON of the change; secrets and credentials are redacted |
| `ip` | request origin address |

Only successful mutations are audited. The Audit Log screen reads this table.

### 5.5 Token handling
- `POST /api/admin/auth/login` with `{ "email", "password" }` verifies against the main app's existing user credentials. Responses: `200 { "token", "expiresAt", "role", "permissions": [] }`; `401` bad credentials; `403` account has no admin role. If the main app has no credential login (for example OAuth-only), `docs/admin/scope.md` records it and task group 0 adds one for admin accounts.
- The token is signed and expires after 30 minutes. There is no refresh: expiry means sign in again.
- The admin app's route handler stores it in the cookie `admin_session`: `httpOnly`, `secure`, `sameSite=strict`, `path=/`, `maxAge` matching `expiresAt`. The browser never sees the token.
- The proxy reads the cookie and calls the main backend with `Authorization: Bearer <token>`. `middleware` redirects to `/login` when the cookie is missing or expired.
- The token is never written to `localStorage`, `sessionStorage`, a JS-readable cookie, or a URL.

## 6. Visuals

`docs/DESIGN.md` tokens take precedence over anything else. When the `evon:ui-ux` skill is available (`.agents/skills/ui-ux/` exists, or the session lists `ui-ux` / `evon:ui-ux`), admin screens are built with it in its "just build it" mode: the archetype contracts in §3 are the brief, its brief-approval and wireframe stops are **not** used (this workflow's gates are the only gates), and its probe output is passed to Step 4's review. When the skill is not available, `frontend-developer` builds the screens from §3 and `docs/DESIGN.md`.
````

- [ ] **Step 3: Add the page-table entry**

In `docs-site/.vitepress/config.ts`, in the `GUIDES` array, add after the `design-reference` line:

```ts
  kit('guides/admin-blueprint',             'guides/admin-blueprint',            'Admin Blueprint'),
```

- [ ] **Step 4: Verify the link check and the docs build**

Run: `node --test tests/cli.test.mjs`
Expected: all tests PASS (the new file's backticked references resolve; the installed-tree test includes the new file).

Run: `cd docs-site && npm run build`
Expected: build completes with no "kit files with no docs mapping" error.

- [ ] **Step 5: Commit**

```bash
git add kit/guides/admin-blueprint.md docs-site/.vitepress/config.ts
git commit -m "feat(kit): add admin blueprint guide"
```

---

### Task 2: Admin scope template

**Files:**
- Create: `kit/templates/admin-scope.md`
- Modify: `docs-site/reference/templates.md` (the Templates table, after the `e2e-tests.md` row)

**Interfaces:**
- Consumes: `kit/guides/admin-blueprint.md` (Task 1) — permission id format.
- Produces: template path `kit/templates/admin-scope.md`; output `docs/admin/scope.md`; sections `1. Modules`, `2. Roles & Permission Matrix`, `3. Identity Model Check`, `4. Open-Branch Check`, `5. Main-Codebase Impact`, `6. Review Rounds`. `kit/phase-admin.md` (Task 3) fills exactly these.

- [ ] **Step 1: Write `kit/templates/admin-scope.md`**

````markdown
# admin-scope.md

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `architecture.md`, `roadmap.md`, `constitution.md`, the built codebase

> Product-scope decision for the admin site. Stack, layout, and conventions are fixed by `kit/guides/admin-blueprint.md`; do not restate them here. `Status` becomes `approved` only when the user approves every section at the Step 1 gate.

---

## 1. Modules

<!--
One row per module the admin site manages. Status: proposed | kept | added by user | removed.
Source: the entity or feature in the built app the module traces to. A module with no source is not a module.
Baseline prompts the proposing agent walked: users and roles, audit log, settings, dashboard; payment? contracts? uploads? notifications? moderation?
-->

| Module | Source | Admin actions | Sensitivity | Status |
|---|---|---|---|---|
| | | | | proposed |

**Dashboard metrics** (only these appear on the dashboard):

-

---

## 2. Roles & Permission Matrix

<!-- Permission ids are `<module>:<action>` (blueprint §4). One column per role; `super_admin` always holds every permission. Mark a cell `✓` to grant. -->

| Permission | super_admin | |
|---|---|---|
| | ✓ | |

---

## 3. Identity Model Check

- **Role model in the main app:** <!-- exists (where) | missing -->
- **How admins authenticate:** <!-- existing credential login | OAuth-only | other -->
- **Consequence for the plan:** <!-- e.g. "Role model missing: task group 0 is a schema migration adding it, before any admin feature." Or "No consequence." -->

---

## 4. Open-Branch Check

<!-- List any open feature/* branch touching the backend areas the admin routes will use. If any exist, stop: finish or merge them first. -->

- **Open branches touching shared backend:** <!-- none | list -->

---

## 5. Main-Codebase Impact

<!-- What the single PR will add to the main app: the /api/admin/* routes per module, the guard, the admin_audit_log table, and the role field / credential login if Section 3 says so. -->

-

---

## 6. Review Rounds

<!-- One row per proposal / user-edit / agent-review round, until the user approves the whole list. -->

| Round | Proposal summary | User edits | Agent review notes |
|---|---|---|---|
| 1 | | | |
````

- [ ] **Step 2: Add the docs-site templates row**

In `docs-site/reference/templates.md`, after the line starting `| \`templates/e2e-tests.md\``, add:

```markdown
| `templates/admin-scope.md` | `docs/admin/scope.md` | Agent | Admin workflow Step 1 |
```

- [ ] **Step 3: Verify**

Run: `node --test tests/cli.test.mjs`
Expected: all tests PASS.

- [ ] **Step 4: Commit**

```bash
git add kit/templates/admin-scope.md docs-site/reference/templates.md
git commit -m "feat(kit): add admin scope template"
```

---

### Task 3: The workflow file, session log row, and spec corrections

**Files:**
- Create: `kit/phase-admin.md`
- Modify: `kit/session-logging.md` (Log files table)
- Modify: `docs-site/.vitepress/config.ts` (the `PHASES` array)
- Modify: `docs/superpowers/specs/2026-10-05-admin-workflow-design.md` (two corrections)

**Interfaces:**
- Consumes: `kit/guides/admin-blueprint.md` (§1, §3, §5, §6), `kit/templates/admin-scope.md` (section names), `kit/templates/e2e-tests.md`.
- Produces: file `kit/phase-admin.md`; session log `docs/admin-session.md`; branch `feature/admin`; artifacts `docs/admin/scope.md`, `docs/specs/admin/spec.md`, `docs/specs/admin/plan.md`.

- [ ] **Step 1: Write `kit/phase-admin.md`**

````markdown
# Admin Site Workflow

> **Status:** experimental — not yet validated in a test round.
>
> **Use after Phase 2 has shipped, to build the administrator site (users, roles, audit log, settings, plus domain modules such as payments or contracts) for the built application.** Stack, layout, and conventions are fixed by `kit/guides/admin-blueprint.md`; this workflow decides only *what* the admin site manages, then builds it.
>
> Prerequisites: a runnable application with Phase 2 shipped; `docs/architecture.md`, `docs/constitution.md`, `docs/DESIGN.md`, `docs/roadmap.md`; no open `feature/*` branch touching the backend areas the admin routes will use.

Universal rules (banner, gates, PROJECT_ROOT, fail-fast writes, file verification, frontend dispatch) are in `kit/orchestrator-conventions.md`. Session log: `docs/admin-session.md`, one table (`kit/session-logging.md`).

## Steps

| Step | Name | Gate | Model | Agent | Output |
|---|---|---|---|---|---|
| 1 | Scope | hard | capable | general-purpose agent (read-only) + user | `docs/admin/scope.md` |
| 2 | Spec & Plan | soft | balanced | orchestrator; `writing-plans` | `docs/specs/admin/spec.md`, `docs/specs/admin/plan.md` |
| 3 | Implement | none | balanced | specialists per `kit/task-agent-rubric.md` | code on `feature/admin` |
| 4 | Review & E2E | none | capable | `code-reviewer`; general-purpose agent | findings fixed, E2E suite green |
| 5 | Ship | hard | balanced | orchestrator + user; `finishing-a-development-branch` | commit and PR |

## When to Use

| Situation | Use |
|---|---|
| The built app needs an administrator site | **This workflow** |
| Phase 2 has not shipped | Finish `kit/phase-2.md` first |
| Something shipped is broken | `kit/phase-bug-fix.md` |
| Decide what to build next in the product itself | `kit/phase-3-iterate.md` |
| The roadmap says `Admin Site: no` but the app clearly needs oversight | Proceed; note the mismatch in `scope.md` |

---

## Step 1 — Scope | Gate: hard

Decide which modules the admin site manages, who can do what, and what the build will touch.

**Inputs:** `docs/architecture.md`, the data model, `docs/specs/`, `docs/roadmap.md` (including `Admin Site`), the auth code, any payment, contract, upload, notification, or moderation code. **Template:** `kit/templates/admin-scope.md`.

### Rules

- Create `docs/admin-session.md` first. Copy `kit/templates/admin-scope.md` to `docs/admin/scope.md` and fill it round by round.
- **Proposal.** Dispatch a general-purpose agent, read-only, to read the built application and propose modules. Ask where entities and features live, not for code. The agent also walks this baseline prompt list so common modules are not silently missed: users and roles, audit log, settings, dashboard; and "is there payment, contracts, uploads, notifications, moderation?". Every proposed module names its source entity or feature, its admin actions, and a sensitivity note. A module with no source is not proposed.
- **User edit.** Write `scope.md` to disk, give the user the path, and ask them to open it and add, change, or remove modules.
- **Re-review.** After each edit round, run **one** agent re-review of the edited list: flag gaps, conflicts, and dependencies (for example "Contracts depends on Users, which you removed") and issue a final recommendation. Record the round in Section 6.
- **Loop.** Repeat user edit and re-review until the user explicitly approves the whole list. Nothing advances before that.
- **Roles and permissions.** Once the module list is stable, fill Section 2: the roles and a permission matrix using ids of the form `<module>:<action>`.
- **Identity check.** Fill Section 3: whether the main app has a role model, and how admins would authenticate (existing credential login, OAuth-only, other). Record the plan consequence: a missing role model or credential login becomes task group 0 in Step 2.
- **Open-branch check.** Fill Section 4. If a `feature/*` branch touches the backend areas the admin routes will use, stop: finish or merge it first.
- **Main-codebase impact.** Fill Section 5: the `/api/admin/*` routes per module, the guard, the `admin_audit_log` table, and any role field or credential login. State plainly that the single PR will change the main application as well as add `admin/`.
- `Status: approved` and a refreshed `Last updated` only after the user approves.

### Completion criteria

- [ ] Every section of `scope.md` is filled; every module traces to a source
- [ ] Roles and permission matrix cover every module action
- [ ] Identity check and open-branch check recorded; no blocking open branch
- [ ] The user explicitly approved the whole list, roles, and impact

**Gate summary:** *"The admin site will manage [N] modules — [list] — for [roles]. It adds `/api/admin/*` routes, a guard, and an audit table to the main app[, and a role model / credential login]. Do you approve this scope?"*

### Exceptions

- Zero modules approved: end the workflow as `blocked` with the reason in the session log; make no code change.
- The user wants a different stack: the stack is fixed by `kit/guides/admin-blueprint.md`. Say so; do not run this workflow for a different stack.
- No `docs/` artifacts (app built outside the kit): dispatch a general-purpose agent to reverse-write minimal `architecture.md` and `constitution.md` from the codebase; get the user's approval of each before continuing.

---

## Step 2 — Spec & Plan | Gate: soft

Turn the approved scope into one spec and one plan for the whole admin site. No agent is dispatched for the spec; the orchestrator writes it.

**Inputs:** `docs/admin/scope.md`, `kit/guides/admin-blueprint.md`, `docs/architecture.md`, `docs/constitution.md`, `kit/task-agent-rubric.md`.

### Rules

- **Spec** (`docs/specs/admin/spec.md`, standard metadata header): per module — purpose, actions with their permissions and audit events, list columns and filters, and numbered acceptance criteria (`AC-<module>-<n>`), including at least one permission-denied criterion per role per mutating action. Reference blueprint archetypes by name; do not restate them.
- **Plan** (`docs/specs/admin/plan.md`) via the `writing-plans` skill, with one `Specialist:` line per task from `kit/task-agent-rubric.md` and parallel groups marked as that file describes. Task groups, in order:
  - **Group 0 (only if Step 1 required it):** role-model migration and/or admin credential login in the main app.
  - **Group 1 — Shell:** the `admin/` app skeleton, proxy and middleware, the `/api/admin/*` guard, the `admin_audit_log` table, the module registry, and one empty example module. Backend tasks and frontend tasks are separate tasks.
  - **Groups 2…N:** one group per approved module.
- Split any task that mixes frontend and backend work before assigning a specialist.

### Completion criteria

- [ ] Spec has acceptance criteria for every module, including permission-denied cases
- [ ] Plan opens with group 0 (if required) then Shell, then one group per module; every task has a `Specialist:`
- [ ] Summary presented to the user

**Gate summary:** *"The plan has [N] tasks: Shell plus [M] modules[, group 0 first]. Anything to change before building?"*

---

## Step 3 — Implement | Gate: none

Build `feature/admin` from the plan.

### Rules

- Create the branch `feature/admin`, using `using-git-worktrees` as in Phase 2 Step 3. Do not commit until Step 5.
- Dispatch per the plan: sequential chains with `subagent-driven-development`, parallel groups with `dispatching-parallel-agents`. Follow the universal dispatch rules in `kit/orchestrator-conventions.md` (PROJECT_ROOT, fail-fast write, verify every write).
- **Frontend dispatches** follow the Frontend dispatch contract: include `docs/DESIGN.md` and `docs/preview/`; admin screens have no `docs/designs/` entries. Pass the matching archetype contract from `kit/guides/admin-blueprint.md` §3 as the brief, and apply blueprint §6: use the `evon:ui-ux` skill in its "just build it" mode when it is available, never its brief-approval or wireframe stops.
- **Shell checkpoint — mandatory before any module starts.** Verify, against the running application:
  1. an admin signs in and sees a role-filtered menu
  2. a signed-in non-admin receives `403` from `/api/admin/*`
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

- **Security review.** Dispatch `code-reviewer` over the full branch diff with this checklist, in addition to its normal spec and constitution check:
  1. every route under `/api/admin/` except `POST /api/admin/auth/login` calls the guard; the login route is the only unauthenticated one
  2. deny by default: a role lacking a permission is refused (`403`)
  3. every mutation writes an audit row in the same transaction
  4. the token is never in `localStorage`, `sessionStorage`, a JS-readable cookie, or a URL
  5. list endpoints whitelist `sort` and `filter` keys and cap `pageSize`
  6. audit `payload` carries no secrets or credentials
- **E2E.** Add an "Admin" feature block to `docs/E2E-TESTS.md` (copy `kit/templates/e2e-tests.md` first if the file does not exist). Playwright covers the permission matrix — each role × each module action, allowed and denied — plus one happy path per module. A general-purpose agent writes and runs it; do not run the exhaustive UI pass.
- Run every case first and mark PASS, FAIL, or BLOCKED. Fix nothing inline. Send all failures and review findings to the implementer in one dispatch, have the reviewer check the fix diff, and re-run only the affected scope.

### Completion criteria

- [ ] Security checklist passed
- [ ] Every permission-matrix case and every module happy path PASS
- [ ] Fix diffs reviewed; affected scope re-run

---

## Step 5 — Ship | Gate: hard

Manual check by the user, then commit and open the PR.

### Rules

- **Manual check (the hard gate).** Start the main app and `admin/`. Ask the user to sign in as each role and walk through the modules. Give the credentials and URLs; do not commit before they approve.
- After approval, use the `finishing-a-development-branch` skill: commit everything on `feature/admin` as `feat(admin): add admin site — <module list>`, push, and open one PR against `main` containing the main-backend changes and `admin/`. Never merge it and never push to `main`.
- Update `docs/admin-session.md` to show every step complete, with the PR link.

### Completion criteria

- [ ] The user approved after walking through each role
- [ ] One commit, branch pushed, one PR open against `main`
- [ ] `docs/admin-session.md` complete with the PR link

**Gate summary:** *"The admin site is built and tested: [N] modules, [R] roles, [E2E result]. Walk through it as each role. Do you approve committing and opening the PR?"*

---

## Output Checklist

- [ ] `docs/admin/scope.md` (`Status: approved`)
- [ ] `docs/specs/admin/spec.md` and `docs/specs/admin/plan.md`
- [ ] `admin/` app and the main-backend admin changes on `feature/admin`
- [ ] `docs/E2E-TESTS.md` with the Admin block, all PASS
- [ ] `docs/admin-session.md` shows all five steps complete
````

- [ ] **Step 2: Add the session-log row**

In `kit/session-logging.md`, in the Log files table, after the `| Phase 3 |` row add:

```markdown
| Admin site | `docs/admin-session.md` | one table |
```

- [ ] **Step 3: Add the page-table entry**

In `docs-site/.vitepress/config.ts`, in the `PHASES` array, after the `phase-3-iterate` line add:

```ts
  kit('phase-admin',            'phases/admin',          'Admin Site Workflow'),
```

- [ ] **Step 4: Correct the spec**

In `docs/superpowers/specs/2026-10-05-admin-workflow-design.md`:
- In the Step table row for Step 4, change `` `reviewer`; Playwright `` to `` `code-reviewer`; Playwright `` (the kit's agent is `code-reviewer`).
- In "Step 4 — Review & E2E", change the bullet "`reviewer` runs a short security checklist: guard on every `/api/admin/*` route, deny by default, ..." to "`code-reviewer` runs a short security checklist: guard on every `/api/admin/*` route except the unauthenticated login route, deny by default, ...".
- In Step 1's `scope.md` bullet "**Identity model check:** whether the main app has a role or identity model. If it does not, ..." append: " It also records how admins authenticate (existing credential login, OAuth-only, other); a missing credential login likewise becomes part of task group 0."

- [ ] **Step 5: Verify**

Run: `node --test tests/cli.test.mjs`
Expected: all tests PASS (every backticked kit reference in `phase-admin.md` resolves; `docs/` paths are exempt).

Run: `cd docs-site && npm run build`
Expected: build completes, no unmapped-file error.

- [ ] **Step 6: Commit**

```bash
git add kit/phase-admin.md kit/session-logging.md docs-site/.vitepress/config.ts docs/superpowers/specs/2026-10-05-admin-workflow-design.md
git commit -m "feat(kit): add admin site workflow"
```

---

### Task 4: Phase 1 roadmap hint

**Files:**
- Modify: `kit/templates/04-roadmap.md` (metadata block)
- Modify: `kit/steps/phase-1/p1-04-roadmap.md` (Execution Rules, Completion Criteria)

**Interfaces:**
- Consumes: `kit/phase-admin.md` (Task 3).
- Produces: roadmap metadata field `Admin Site` with values `yes` | `no` | `later`, read by `kit/phase-admin.md` Step 1.

- [ ] **Step 1: Add the metadata line**

In `kit/templates/04-roadmap.md`, directly after the line starting `- **Phase 2 Scope**:` add:

```markdown
- **Admin Site**: `yes` | `no` | `later` <!-- asked at Step 4; a hint for kit/phase-admin.md only. Never a feature row; not counted in the Phase 2 Scope criteria. -->
```

- [ ] **Step 2: Add the rule**

In `kit/steps/phase-1/p1-04-roadmap.md`, directly before the `## Artifact Rules` heading (after the `**Mid-cycle escape:**` paragraph), add:

```markdown
- **Admin Site** (`yes` | `no` | `later`): ask once, before presenting the draft: "Will this product need an administrator site (to manage users, content, payments, and so on)?" Record the answer in the roadmap metadata. It is a hint for `kit/phase-admin.md`, which runs after Phase 2. It is **never a feature row** and is **excluded from every Phase 2 Scope criterion**: counting it would inflate the Must count or the domain split and could flip the scope to `feature`. `no` and `later` need no further work in Phase 1.
```

- [ ] **Step 3: Add the completion criterion**

In the same file's `## Completion Criteria` list, after the `Phase 2 Scope` item, add:

```markdown
- [ ] `Admin Site` answered and recorded in the roadmap metadata; no admin feature row added.
```

- [ ] **Step 4: Verify**

Run: `node --test tests/cli.test.mjs`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add kit/templates/04-roadmap.md kit/steps/phase-1/p1-04-roadmap.md
git commit -m "feat(kit): add Admin Site hint to roadmap step"
```

---

### Task 5: Agent rubric routing

**Files:**
- Modify: `kit/task-agent-rubric.md` (Primary Routing Table)

**Interfaces:**
- Consumes: `kit/guides/admin-blueprint.md` §6.

- [ ] **Step 1: Add the routing row**

In `kit/task-agent-rubric.md`, in the Primary Routing Table, directly after the row beginning `| UI visual quality, premium design`, add:

```markdown
| Admin site UI screens under `admin/` (shell, dashboard, list, detail, form, audit log, settings) | "admin site", "admin module", "admin screen" | `frontend-developer` + the `evon:ui-ux` skill when it is available (optional; see `kit/guides/admin-blueprint.md` §6) — dispatch per the Frontend dispatch contract; without the skill, `frontend-developer` builds from the blueprint archetypes |
```

- [ ] **Step 2: Verify**

Run: `node --test tests/cli.test.mjs`
Expected: all tests PASS.

- [ ] **Step 3: Commit**

```bash
git add kit/task-agent-rubric.md
git commit -m "feat(kit): route admin UI tasks in the agent rubric"
```

---

### Task 6: CLI — optional evon:ui-ux install and admin quick-start

**Files:**
- Modify: `tests/cli.test.mjs` (lines near 111, 228-236, 252)
- Modify: `bin/cli.js` (header comment ~lines 37-51, `installTasteSkill` ~98, `printQuickStart` ~220, `interactiveSetup` ~277-287, non-TTY block ~407-408)

**Interfaces:**
- Produces: constants `EVON_SKILL_REPO`, `EVON_SKILL_NAME`, `EVON_SKILL_CMD`; function `installSkill(repo, name)` replacing `installTasteSkill()` (clean cutover: its one caller is updated).

- [ ] **Step 1: Write the failing assertions**

In `tests/cli.test.mjs`:

1. In the `installs the orchestration files, steps and templates` test, change the file list to include `phase-admin.md`:

```js
    for (const f of ['phase-1-bootstrap.md', 'phase-2.md', 'phase-bug-fix.md', 'phase-admin.md', 'orchestrator-conventions.md']) {
```

2. In the non-TTY test (`prints Superpowers, design-taste-frontend and agent instructions, then the quick start`), add after the `taste-skill` assertion:

```js
    assert.match(stdout, /npx skills add .*evondev\/evondevKit.*ui-ux/)
```

3. In `use the installed directory, not a hardcoded "kit/" prefix`, change the file list:

```js
    for (const f of ['phase-1-bootstrap.md', 'phase-2.md', 'phase-bug-fix.md', 'phase-admin.md']) {
```

- [ ] **Step 2: Run to verify failure**

Run: `node --test tests/cli.test.mjs`
Expected: FAIL in the non-TTY test (no evon command) and in the quick-start paths test (no `phase-admin.md` in output). The fresh-install test passes because Task 3 already created the file.

- [ ] **Step 3: Implement**

In `bin/cli.js`:

a. Update the dependency-sources comment (lines ~42-43) and add the constants after `TASTE_SKILL_CMD`:

```js
// Skills (2 via npx): design-taste-frontend https://github.com/Leonxlnx/taste-skill,
//                     evon:ui-ux (optional, admin site workflow) https://github.com/evondev/evondevKit
//   → installed via `npx skills add` (cross-harness).
```

```js
const EVON_SKILL_REPO  = 'https://github.com/evondev/evondevKit'
const EVON_SKILL_NAME  = 'ui-ux'
const EVON_SKILL_CMD   = `npx skills add ${EVON_SKILL_REPO} --skill "${EVON_SKILL_NAME}" --yes`
```

b. Replace `installTasteSkill` with a generic installer:

```js
function installSkill (repo, name) {
  // shell: true is required on Windows (npx resolves to npx.cmd).
  // On Unix it triggers DEP0190 because args are concatenated, not escaped.
  const result = spawnSync(
    'npx',
    ['skills', 'add', repo, '--skill', name, '--yes'],
    { stdio: 'inherit', shell: process.platform === 'win32' }
  )
  return result.status === 0
}
```

c. In `printQuickStart`, after the Bug fix block add:

```js
  ${SYM.dot} ${bold('Admin site')}  ${dim('(after Phase 2 has shipped)')}
    Share  ${yellow(rel + '/phase-admin.md')}  and say:  ${yellow('"Build the admin site using ' + rel + '/phase-admin.md."')}

```

d. In `interactiveSetup`, rename the section and call the generic installer, then add the optional prompt:

```js
  section(2, 'Design skills', '(installed via npx)')
  if (await yes('Install design-taste-frontend now via npx?')) {
    console.log('')
    if (installSkill(TASTE_SKILL_REPO, TASTE_SKILL_NAME)) {
      console.log(`\n  ${SYM.check}  ${bGreen('design-taste-frontend')} installed.\n`)
    } else {
      console.log(`\n  ${SYM.cross}  Install failed. Run manually:\n     ${dim(TASTE_SKILL_CMD)}\n`)
    }
  } else {
    console.log(`\n  Skipped. Run when ready:\n    ${dim(TASTE_SKILL_CMD)}\n`)
  }

  console.log(`  ${dim('Optional: evon:ui-ux builds admin site screens (used by the admin site workflow).')}\n`)
  if (await yes('Also install evon:ui-ux?')) {
    console.log('')
    if (installSkill(EVON_SKILL_REPO, EVON_SKILL_NAME)) {
      console.log(`\n  ${SYM.check}  ${bGreen('evon:ui-ux')} installed.\n`)
    } else {
      console.log(`\n  ${SYM.cross}  Install failed. Run manually:\n     ${dim(EVON_SKILL_CMD)}\n`)
    }
  } else {
    console.log(`\n  Skipped. Run when ready:\n    ${dim(EVON_SKILL_CMD)}\n`)
  }
```

(Keep the existing `section(3, 'Specialist agents')` block that follows unchanged.)

e. In the non-TTY block:

```js
      section(2, 'Design skills')
      console.log(`  Run in your terminal:\n    ${TASTE_SKILL_CMD}`)
      console.log(`\n  Optional — admin site workflow (evon:ui-ux):\n    ${EVON_SKILL_CMD}`)
```

- [ ] **Step 4: Run to verify pass**

Run: `node --test tests/cli.test.mjs`
Expected: all tests PASS.

- [ ] **Step 5: Smoke-test the CLI output**

Run (from the repo root, installing into a throwaway directory): `node bin/cli.js "$(mktemp -d)/kit" </dev/null`
Expected: the output shows "Design skills", both `npx skills add` commands (taste-skill and evondevKit), and a quick-start "Admin site" block naming `kit/phase-admin.md`.

- [ ] **Step 6: Verify the evon install command**

In an empty temp directory run: `npx skills add https://github.com/evondev/evondevKit --skill "ui-ux" --yes`
Expected: exit 0 and `.agents/skills/ui-ux/SKILL.md` present. If `--skill ui-ux` is rejected, read the error, correct `EVON_SKILL_NAME` (and the README-documented fallback is plain `npx skills add evondev/evondevKit`), re-run Step 4. Delete the temp directory afterwards.

- [ ] **Step 7: Commit**

```bash
git add bin/cli.js tests/cli.test.mjs
git commit -m "feat(cli): offer optional evon:ui-ux install and admin quick-start"
```

---

### Task 7: Docs wiring, changelog, and final verification

**Files:**
- Modify: `README.md` (Other Workflows table ~124-126; Required Skills note ~164; Kit Contents ~186-192)
- Modify: `AGENTS.md` (CLI step 8-9 ~30-31; workflow block ~54-57; session-logs paragraph ~60; hard gates ~70; Important Files ~173; template numbering list)
- Modify: `docs-site/reference/required-skills.md` (Skills table ~19-29)
- Modify: `kit/CHANGELOG.md` (under `## [Unreleased]`, line 8)

- [ ] **Step 1: README**

a. In the Other Workflows table, after the `Phase 3 — Iterate` row, add:

```markdown
| Admin Site | `phase-admin.md` | The built app needs an administrator site: Scope (hard) → Spec & Plan → Implement → Review & E2E → Ship (hard). Fixed Next.js stack; the admin app only calls `/api/admin/*` on your backend. Run after Phase 2. |
```

b. After the blockquote under the Skills table (`> Skills improve consistency...`) add:

```markdown
> Optional: `evon:ui-ux` builds admin site screens in the Admin Site workflow (`phase-admin.md`); without it `frontend-developer` builds them from the admin blueprint.
```

c. In Kit Contents: change the `phase-3-iterate.md`, `phase-bug-fix.md` row to `` `phase-3-iterate.md`, `phase-bug-fix.md`, `phase-admin.md` ``; change the `templates/` row text to end with `, model map, admin scope`; and in the `guides/` row add `` `admin-blueprint.md`, `` before `` `design-reference.md` ``.

- [ ] **Step 2: AGENTS.md**

a. In the CLI Installer list: in step 8 change "(a) `npx skills add design-taste-frontend` → `.agents/skills/`," to "(a) `npx skills add design-taste-frontend` → `.agents/skills/`, plus an optional `evon:ui-ux` install (admin site workflow),"; in step 9 change the path list to "(Phase 1 = `phase-1-bootstrap.md`, Phase 2 = `phase-2.md`, bug fix = `phase-bug-fix.md`, admin site = `phase-admin.md`)".

b. In the "Other workflows" block add after the Phase 3 line:

```
  Admin Site: Scope → Spec & Plan → Implement → Review & E2E → Ship
              docs/admin/scope.md, docs/specs/admin/{spec,plan}.md, feature/admin → one PR (main-backend changes + admin/)
```

c. In the session-logs paragraph add `docs/admin-session.md` to the list.

d. In the hard-gates sentence add `Admin Scope, Admin Ship;` before "Full definition".

e. In Important Files, change the row `| \`kit/phase-3-iterate.md\`, \`kit/phase-bug-fix.md\` | Other workflows |` to include `` `kit/phase-admin.md` `` and add a row:

```markdown
|`kit/guides/admin-blueprint.md`|Admin workflow's fixed stack, behavior contracts, module registry, backend conventions|
```

f. In the Template Numbering list add after `e2e-tests.md`:

```
admin-scope.md         — Admin Step 1 (→ docs/admin/scope.md)
```

- [ ] **Step 3: docs-site skills page**

In `docs-site/reference/required-skills.md`, after the `design-taste-frontend` row of the Skills table add:

```markdown
| `evon:ui-ux` *(optional)* | Admin Site workflow Step 3 — admin screens; without it `frontend-developer` builds them from the admin blueprint |
```

- [ ] **Step 4: CHANGELOG**

In `kit/CHANGELOG.md`, directly under `## [Unreleased]` insert (keep the blank line and following `---`):

```markdown

### Added — Admin Site workflow (experimental)

- **`kit/phase-admin.md`** — new workflow, run after Phase 2: Scope (hard; agent proposes modules, user edits, agent re-reviews once per round, loop until the user approves; roles and permission matrix, identity check, open-branch check) → Spec & Plan → Implement (Shell checkpoint before any module) → Review & E2E (security checklist, permission-matrix E2E) → Ship (hard; manual check, one PR).
- **`kit/guides/admin-blueprint.md`** — fixed admin stack (thin Next.js app in `admin/`, no database, only calls `/api/admin/*`), per-archetype behavior contracts, module registry contract, backend conventions (guard, RBAC, list contract, audit record, token handling).
- **`kit/templates/admin-scope.md`** — Step 1 artifact template.

### Changed

- **`kit/templates/04-roadmap.md`**, **`kit/steps/phase-1/p1-04-roadmap.md`** — new `Admin Site: yes | no | later` hint; never a feature row; excluded from the Phase 2 Scope criteria.
- **`kit/task-agent-rubric.md`** — admin UI routing row (`frontend-developer` + optional `evon:ui-ux`).
- **`kit/session-logging.md`** — `docs/admin-session.md`.
- **`bin/cli.js`** — optional `evon:ui-ux` install (interactive prompt and non-TTY instructions), generic `installSkill`, admin quick-start block.
- **`docs-site/`**, **`README.md`**, **`AGENTS.md`** — page table, templates and skills pages, workflow and gate lists.
- **Status:** not yet validated in a test round.
```

- [ ] **Step 5: Full verification**

Run: `node --test tests/cli.test.mjs`
Expected: all tests PASS (19 tests, same count as before; two existing tests gained assertions).

Run: `cd docs-site && npm run build`
Expected: build completes; pages `phases/admin` and `guides/admin-blueprint` generated.

Run: `git status --short`
Expected: only intended files changed.

- [ ] **Step 6: Commit**

```bash
git add README.md AGENTS.md docs-site/reference/required-skills.md kit/CHANGELOG.md
git commit -m "docs: document the admin site workflow"
```

---

## Self-Review

**Spec coverage:** D1 standalone workflow → Task 3. D2/D3/D4 stack and layout → Task 1 (§1, §2). D5 scope loop → Task 3 Step 1. D6 foundation-first → Task 3 Steps 2-3 (group 1 Shell, checkpoint). D7/D8 blueprint and optional evon → Tasks 1, 5, 6. D9 Phase 1 hook → Task 4. D10 single PR → Task 1 §2, Task 3 Step 5. Spec section 3 prerequisites → `phase-admin.md` header and Step 1 open-branch check. Section 8 file list → File Structure above. Section 9 verification → Tasks 1-7 test runs; narrative round is explicitly out of this plan.

**Deviations from the spec (intentional):**
- The spec said "add one CLI test". The two assertions went into existing tests instead, because a separate test would duplicate setup and the repo's testing rules discourage padding.
- The spec's `reviewer` agent is corrected to the kit's `code-reviewer`.
- The identity check also records how admins authenticate (needed because the login endpoint verifies against existing credentials). The spec is updated in Task 3.
- `kit/session-logging.md` and the docs-site page table needed edits the spec's file list did not name; both are required (log path convention; build fails otherwise).

**Not in this plan:** a narrative test round against a finished project. The workflow ships experimental until that round runs. `kit/steps/phase-2/p2-07-ship.md` does not offer the admin workflow after a release; the spec excluded Phase 2 step changes, so discoverability relies on the README, quick start, and the roadmap hint.

**Placeholder scan:** no TBD/TODO; template placeholders in `admin-scope.md` are the template's purpose.

**Type consistency:** `AdminModule` fields, permission id format `<module>:<action>`, `admin_audit_log`, `admin_session`, `POST /api/admin/auth/login`, `ADMIN_API_BASE_URL`, `installSkill`, `EVON_SKILL_*`, and section names (`1. Modules` … `6. Review Rounds`) are identical wherever they appear across tasks.
