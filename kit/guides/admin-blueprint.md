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
Every route under `/api/admin/` passes through one guard that takes the required permission. No valid admin token → `401`. Valid token whose role lacks the permission → `403`. A route under `/api/admin/` that does not call the guard is a defect.

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
