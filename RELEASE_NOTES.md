Test accounts are now created once and reused across every feature, instead of each feature inventing its own.

- **One test account registry:** a single git-ignored `.test-accounts.json` holds every test account with its role, status (`unverified`, `valid`, `invalid`, `retired`), how it was provisioned, and which features use it. Agents reuse a `valid` account of the needed role first and create a new one only when none fits or the test needs isolated state.
- **Secret-free docs:** `docs/E2E-TESTS.md` lists account ids and roles only. Passwords stay in the registry, and Ship checks that it is untracked.
- **Fresh status each run:** E2E signs in with every referenced account before running and updates its status.
- **`kit/` and the registry are git-ignored in every workflow:** a new git-hygiene rule applies to upgrade, bug fix, admin and Phase 3, not only Phase 1.
- **Existing projects:** a new Test Accounts Backfill module (run from Project Upgrade) records the credentials a project already uses in `.env`, E2E docs or seed scripts, and verifies them by sign-in. A failed sign-in marks the account `invalid` and is reported without blocking the upgrade.
