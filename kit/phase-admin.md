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
  2. a signed-in non-admin cannot reach the admin API: login returns `403`, and `/api/admin/*` called with a non-admin token returns `401`; an admin whose role lacks the permission gets `403`
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
  3. every mutation other than the login route writes an audit row in the same transaction
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
