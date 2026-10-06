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
