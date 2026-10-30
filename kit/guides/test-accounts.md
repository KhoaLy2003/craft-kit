# Test account registry

> Read before creating, seeding, signing in with, or documenting any test account (Scaffold, E2E, Manual Check, admin, backfill). Rules 1–6 below; rule 9 of `kit/orchestrator-conventions.md` (git hygiene) must pass first.

Test accounts live in one git-ignored file, `.test-accounts.json` at PROJECT_ROOT, reused across the whole lifecycle. Entry shape:

```json
{ "id": "admin-1", "role": "admin", "email": "...", "password": "...", "status": "unverified|valid|invalid|retired", "environment": "local|staging", "provisioning": "how it was created (e.g. seed.mjs, Supabase dashboard)", "created_by": "<feature slug or phase>", "created_on": "YYYY-MM-DD", "last_verified": "YYYY-MM-DD or null", "used_by": ["<feature slug>"], "notes": "free text (invalid reason, data it holds)" }
```

`id` is `<role>-<n>`, unique, never reused. Statuses: `unverified` (recorded, sign-in not confirmed), `valid` (confirmed, reusable), `invalid` (sign-in fails), `retired` (intentionally unused).

1. **Single source** — create the file from `kit/templates/test-accounts.json` if missing, only after rule 9 verification passes (fail-closed: never write it while it is not ignored).
2. **Reuse first** — before creating any account, read the registry and pick an entry with the needed `role` and `status: valid`. If only `unverified` exists, sign in to verify: set `valid` + `last_verified` on success, `invalid` + reason in `notes` on failure. Create a new account ONLY when no `valid` entry has the role, or the test needs isolated state (say why in `notes`). A new feature gets new test data on shared accounts, not a new account.
3. **Keep it current** — on creating an account, append an entry (`unverified`, then `valid` after a successful sign-in). On reuse, add the feature slug to `used_by`. On failure or discovered breakage, set `invalid`. Never delete entries; set `retired`. Update the file in the same step that changes reality.
4. **Scripts** — seed scripts and E2E tests read credentials from the registry, not per-feature `.env` keys, and are idempotent: upsert the account by `email`, never duplicate.
5. **Dispatch** — every subagent task touching sign-in, seeding, E2E, or manual-check instructions includes: `Test accounts: read PROJECT_ROOT/.test-accounts.json; follow kit/guides/test-accounts.md; never copy passwords into committed files.`
6. **Committed docs** refer to accounts by `id` and `role` only.

---
