# Test Accounts Backfill — create `.test-accounts.json` for an existing project

> **Use once per project** that has test credentials (in `.env` or elsewhere) but no `.test-accounts.json` (built on an older kit version, or without Phase 1). New projects never run this: the registry is created from the start.
>
> Output: `.test-accounts.json` at the project root, git-ignored, holding every test account found, each verified by sign-in where possible. Nothing in `docs/` is touched.

Universal rules (banner, gates, PROJECT_ROOT, fail-fast writes, file verification) are in `kit/orchestrator-conventions.md`. Registry format and rules: `kit/orchestrator-conventions.md` → Test account registry.

## Limitations (read before running)

- **Finds only what is written down.** Accounts that exist solely in a hosted dashboard and appear in no `.env` key, doc, or seed script are not discovered; add them by hand afterwards.
- **Nothing is invented.** An account without a recoverable email or password is not recorded; it is listed in the report instead.
- **A failed sign-in never blocks the upgrade.** The account is recorded `invalid` with the reason, and reported at the end.

## How to start

Send this to your AI, from the project root:

```text
Run the test accounts backfill using kit/phase-test-accounts-backfill.md.
```

What happens next: the AI locates the credentials the project already uses, shows you each candidate (passwords masked), and after your approval writes the registry and tries to sign in with every account.

What to have ready: the app (and its database) able to start locally, so sign-in can be verified. If it cannot start, accounts stay `unverified`.

## Steps

| # | Name | Gate | Model | Output |
|---|---|---|---|---|
| 1 | Preflight & locate | none | fast | Git hygiene verified; candidate list |
| 2 | Review | hard | balanced | User decision per candidate |
| 3 | Write & verify | none | fast | `.test-accounts.json`, sign-in results |

## Step 1 — Preflight & locate

1. Stop if `.test-accounts.json` exists. Backfill only runs when it is missing; to add accounts later, follow the registry rules.
2. Apply rule 9 (git hygiene) and verify `git check-ignore -q .test-accounts.json`. Do not continue until it passes (fail-closed).
3. Locate candidates, read-only:
   - `.env`, `.env.local`, and `.env.example` keys that name a test user (for example `E2E_*`, `TEST_USER_*`, `*_EMAIL` with a matching `*_PASSWORD`);
   - the credentials table in `docs/E2E-TESTS.md` (key names, which lead back to `.env` values);
   - seed scripts (`seed.*`, `prisma/seed.*`, `supabase/seed.sql`) that create users.
4. Group by role. Two keys that resolve to the same `email` are one account. Show the user each candidate: role, email, password masked, source, and how it was provisioned if known.

## Step 2 — Review (hard gate)

Ask per candidate: **keep / drop / change role**. Bulk answers are allowed ("keep all"); echo the meaning back before writing. Candidates without a recoverable email or password are listed as not recordable, not offered.

Gate summary: *"[N] test accounts found ([roles]). Record them in `.test-accounts.json` and try signing in with each? [Yes / change an item]"*

## Step 3 — Write & verify

1. Create `.test-accounts.json` from `kit/templates/test-accounts.json`. Append one entry per kept account, `status: unverified`, `id` as `<role>-<n>`, `created_by: backfill`, `provisioning` from the source, `last_verified: null`, `used_by: []`.
2. Verify the file parses and `git ls-files .test-accounts.json` returns nothing.
3. Start the app if needed and sign in with each account:
   - success → `status: valid`, `last_verified` today;
   - failure → `status: invalid`, reason in `notes`; do not stop;
   - app or database cannot be reached → leave `unverified` and say so.
4. Report: accounts recorded, counts by status, and every `invalid` account with its reason and the advice to fix or retire it. After a fix, the sign-in check is repeated by the registry rules (E2E pre-run verification); backfill is not re-run. Do not edit `.env`; the user may remove old keys once nothing reads them. Seed scripts and E2E tests that still read per-feature `.env` keys are switched to the registry when the next feature touches them (registry rule 4).

## Completion criteria

- [ ] `.test-accounts.json` exists, parses, is git-ignored, and is untracked
- [ ] Every kept account has an entry with a status
- [ ] The user approved at the Step 2 gate
- [ ] Every `invalid` or `unverified` account was reported to the user
- [ ] No password was written to any committed file or printed unmasked

## Transition

Done. Return to the workflow that sent you here (`kit/phase-upgrade.md`).

## Exceptions

- **No test credentials found:** report it and end; the registry is created lazily by the first step that needs an account.
- **Hosted auth only (no seed script, no `.env` keys):** ask the user for the test account emails and passwords directly, and enter them as candidates.
- **Monorepo:** ask the user which app's credentials to record.
