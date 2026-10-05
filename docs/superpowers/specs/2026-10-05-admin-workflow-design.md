# Admin Workflow — Design

**Status:** draft
**Last updated:** 2026-10-05
**Based on:** brainstorming session 2026-10-05; `kit/phase-3-iterate.md`, `kit/phase-bug-fix.md`, `kit/steps/phase-1/p1-04-roadmap.md`, `kit/templates/04-roadmap.md`, `kit/stack-catalog.md`, `kit/task-agent-rubric.md`, `bin/cli.js`

## 1. Goal

Add a workflow to craft-kit that builds the **admin site** of a project the kit has already built. Today the kit builds only the user-facing product. Most applications also need an administrator surface (users, roles, audit log, settings, and domain-specific modules such as payments or contracts). What to manage depends on the project's domain; the shape of the admin site is nearly identical across projects.

## 2. Decisions (all confirmed with the user)

| # | Decision |
|---|---|
| D1 | Standalone workflow `kit/phase-admin.md`, run after Phase 2 has shipped. Phase 1 and Phase 2 steps are unchanged except one roadmap hint (D9). |
| D2 | The admin site is always a **separate frontend app** in an `admin/` folder of the same repo. It has no database and no ORM. |
| D3 | The admin app **only calls `/api/admin/*`** on the main backend. The main backend owns business logic, the role guard, and audit writes. |
| D4 | Fixed admin stack, no per-project stack decision (section 4). |
| D5 | Module scope is discovered by an agent-proposal / user-edit / agent-re-review loop with a hard gate (section 5, Step 1). |
| D6 | Foundation first, then modules, in one cycle (like Phase 2 `scope: all`). |
| D7 | The kit ships a **blueprint** (markdown), not starter source code. Screen visuals come from the optional `evon:ui-ux` skill when installed. |
| D8 | `evon:ui-ux` (https://github.com/evondev/evondevKit, MIT, beta) is a **recommended optional** skill, never required. |
| D9 | Phase 1 hook: one metadata line `Admin Site: yes \| no \| later` in `04-roadmap.md`. It is never a feature row and is excluded from the Phase 2 Scope criteria. |
| D10 | One PR from `feature/admin` carries the main-backend changes and the `admin/` app. |

## 3. Prerequisites

- Phase 2 has shipped, or the application is at least runnable.
- `docs/architecture.md`, `docs/constitution.md`, `docs/DESIGN.md`, `docs/roadmap.md` exist.
- No open `feature/*` branch touches the backend areas listed in the Step 1 impact check. If one does, stop and finish or merge it first.

## 4. Fixed admin stack

| Layer | Choice |
|---|---|
| App | Next.js (App Router), TypeScript, deployed on Vercel |
| UI | Tailwind CSS v4 + shadcn/ui; shadcn data-table (TanStack Table); react-hook-form + zod |
| Charts | shadcn charts, only if the approved scope includes a chart |
| Data | None. The admin app has no database and no ORM. |
| Auth | No auth library. The admin app's server layer proxies to the main backend and keeps a short-lived token in an httpOnly cookie; `middleware` blocks unauthenticated routes. |
| Tests | Playwright |

**Why Next.js and not a Vite SPA:** the admin token must not live in browser JavaScript. A thin Next.js server layer (route handlers or server actions) is the proxy that holds it. A SPA would need either a browser-held token or cross-origin cookie configuration on the main backend, which varies by main stack.

**Thin-Next rule (goes in the blueprint):** data screens are client-rendered. The server side exists only for the proxy and the auth middleware. No server components for data screens. SSR and SEO have no value behind a login.

**Consequence to state plainly:** the workflow edits the main codebase too (admin routes, role guard, audit table, and a role field if the app has none). The token and cookie details above are the design default; the blueprint pins the exact contract.

## 5. Workflow: `kit/phase-admin.md`

Single file with inline steps, following the Phase 3 and Bug Fix pattern. Marked **experimental, not yet validated in a test round**. Universal rules come from `kit/orchestrator-conventions.md`. Session log: `docs/admin-session.md`.

| Step | Name | Gate | Model | Agent | Output |
|---|---|---|---|---|---|
| 1 | Scope | hard | capable | read-only general-purpose agent + user | `docs/admin/scope.md` |
| 2 | Spec & Plan | soft | balanced | orchestrator | `docs/specs/admin/{spec,plan}.md` |
| 3 | Implement | none | balanced | specialists per `kit/task-agent-rubric.md`; `evon:ui-ux` for admin screens when installed | code on `feature/admin` |
| 4 | Review & E2E | none | capable | `reviewer`; Playwright | findings fixed, suite green |
| 5 | Ship | hard | balanced | orchestrator + user | commit and PR |

### Step 1 — Scope (hard)

Inputs: `docs/architecture.md`, data model, `docs/specs/`, `docs/roadmap.md` (including the `Admin Site` hint), auth code, any payment, contract, upload, notification, or moderation code.

Loop:
1. A read-only agent reads the built app and produces a **proposal**. It also walks a short baseline prompt list so common modules are not silently missed: users and roles, audit log, settings, dashboard; and "is there payment / contracts / uploads / notifications / moderation?".
2. Each proposed module row states: name, the source entity or feature it traces to, admin actions (view, edit, suspend, refund, ...), and a sensitivity note.
3. The user adds, changes, or removes modules.
4. The agent re-reviews the edited list **once per edit round**: flags gaps, conflicts, and dependencies (for example "Contracts depends on Users, which you removed") and issues a final recommendation.
5. Repeat from 3 until the user explicitly approves the whole list. Each round is logged in `scope.md`.

`scope.md` also records, before the gate:
- **Admin roles and permission matrix** (module × action × role).
- **Identity model check:** whether the main app has a role or identity model. If it does not, the plan opens with **task group 0: schema migration adding it**, before any admin feature.
- **Open-branch check** from section 3.
- **Impact on the main codebase:** the `/api/admin/*` routes, guard, and audit table that will be added.

Completion: scope.md complete, approved by the user, `Status: approved`.

### Step 2 — Spec & Plan (soft)

One spec and one plan for the whole admin site. The plan's first groups are, in order: (0) role-model migration if Step 1 required it; (1) **Shell**: admin app skeleton, proxy and middleware, `/api/admin/*` guard, audit table, module registry, one empty example module; then one task group per approved module. Specialist assignment and parallel groups follow `kit/task-agent-rubric.md`.

### Step 3 — Implement (none)

Branch `feature/admin`. Build Shell first. **Mandatory checkpoint before any module starts:** an admin signs in and sees a role-filtered menu; a non-admin gets 403; the example module renders its empty, loading, and error states; one mutation writes an audit row. Then build modules.

### Step 4 — Review & E2E (none)

- Playwright covers the permission matrix (each role × each module action) plus one happy path per module. Extend `kit/templates/e2e-tests.md`.
- `reviewer` runs a short security checklist: guard on every `/api/admin/*` route, deny by default, audit on every mutation, no token in browser-accessible storage.
- Fix findings; suite must be green.

### Step 5 — Ship (hard)

The user performs a manual check of the admin site. After approval: commit, push `feature/admin`, open one PR containing the main-backend changes and `admin/`. Record status and PR link in `docs/admin-session.md`.

## 6. Blueprint: `kit/guides/admin-blueprint.md`

1. **Fixed stack and the thin-Next rule** (section 4).
2. **Behavior contract per screen archetype** (what each must do, not how it looks): Shell, Dashboard, List, Detail, Form, Audit Log, Settings, destructive-action confirmation. Example: List requires server-side pagination, sort, and filter; permission-gated row and bulk actions; the four states (empty, loading, error, no-permission).
3. **Module registry contract:** one declarative entry per module: route, menu item, required permission, columns, filters, actions, emitted audit events. The Shell renders the menu and routes from the registry.
4. **Backend conventions:** the `/api/admin/*` guard (deny by default), RBAC model, the list-endpoint query contract (page, sort, filter), and the rule that every mutation writes an audit record.
5. **Token handling contract:** login endpoint, cookie attributes, expiry, and how the proxy attaches the token.
6. **Visuals:** `DESIGN.md` tokens take precedence. When `evon:ui-ux` is installed, admin screens use it in "just build it" mode with the behavior contract as the brief; its probe check output feeds Step 4. When not installed, `frontend-developer` builds the screens from the blueprint.

## 7. Phase 1 hook

- `kit/templates/04-roadmap.md`: add a metadata line `**Admin Site**: yes | no | later` next to `Phase 2 Scope`.
- `kit/steps/phase-1/p1-04-roadmap.md`: Step 4 asks one question at its existing hard gate. Rules: it is **never a feature row** and is **excluded from the Phase 2 Scope criteria** (otherwise it could inflate the Must count or domain split and flip scope to `feature`). It is a hint only; Admin Step 1 runs without it and reports a mismatch if the app clearly needs an admin site.

## 8. File changes

New:
- `kit/phase-admin.md`
- `kit/guides/admin-blueprint.md`
- `kit/templates/admin-scope.md` (standard metadata header; sections: Modules table, Roles & Permission Matrix, Identity Model Check, Open-Branch Check, Main-Codebase Impact, Review Rounds)

Edited:
- `kit/templates/04-roadmap.md`, `kit/steps/phase-1/p1-04-roadmap.md` (section 7)
- `kit/task-agent-rubric.md`: admin UI row: `evon:ui-ux` when installed, otherwise `frontend-developer`
- `kit/session-logging.md`: `docs/admin-session.md`
- `bin/cli.js`: optional `evon:ui-ux` install (`npx skills add evondev/evondevKit`) in the TTY prompt and the non-TTY instructions; quick-start line for the admin workflow
- `docs-site/.vitepress/config.ts`: page table entry
- `kit/CHANGELOG.md` (`[Unreleased]`), `README.md`, `AGENTS.md`: workflow and gate lists

## 9. Verification

- Existing suite (`node --test tests/cli.test.mjs`): kit link integrity covers the new `.md` references; the installed-tree test picks up the new files automatically.
- Add one CLI test asserting the admin quick-start line and the optional-skill text appear in non-TTY output.
- Real validation is a narrative round against a finished kit project. Until then the workflow stays experimental.

## 10. Out of scope

- Shipping starter source code (door left open: a reference implementation may be added behind the same blueprint if a test round shows too much output variance).
- Any change to Phase 1 or Phase 2 steps beyond the roadmap hint.
- Any change to `evon:ui-ux` itself.
- A separate repository for the admin app.
