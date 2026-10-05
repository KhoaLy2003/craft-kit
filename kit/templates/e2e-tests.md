# e2e-tests.md

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: <!-- path of the approved spec, e.g. docs/specs/spec.md or docs/specs/<feature-slug>/spec.md -->

---

## 1. Overview

<!-- Fill in totals derived from the spec. Time estimate: roughly 30-60 seconds per test case as a baseline. -->

- **Total acceptance criteria**:
- **Test cases planned**:
- **Coverage**: <!-- X of Y acceptance criteria covered; flag any intentionally skipped and why -->
- **Framework**: <!-- e.g. Playwright, Cypress -->
- **Estimated run time**:
- **External dependencies**: <!-- list every external service the tests rely on (auth, database, payments, etc.) -->

---

## 2. Prerequisites Checklist

<!-- Every item must be checked before the E2E run begins. If any box is unchecked, E2E cannot start. -->

- [ ] Dev server starts without errors (`npm run dev` or equivalent)
- [ ] `.env` has all required values (set up during Scaffold — re-confirm here)
- [ ] <!-- add one line per external service or infrastructure requirement -->
- [ ] Test data seeded (see Section 5)
- [ ] Test credentials documented below and available

**Test credentials:**

<!-- List every account the tests will use. Include email, password, and role. Do not use production credentials. -->

| Role | Email | Password |
|------|-------|----------|
| <!-- e.g. admin --> | | |
| <!-- e.g. standard user --> | | |

---

## 3. Test Coverage Map

<!-- One table per feature in the spec. AC IDs must match the spec exactly. Under `scope: feature` each cycle appends its own Feature block. Status stays blank until the E2E run; then PASS / FAIL / BLOCKED. -->

<!-- Repeat this block for each feature: -->

### Feature: <!-- Feature name from roadmap -->

| AC ID | Acceptance Criterion | Test Case | Status |
|-------|---------------------|-----------|--------|
| <!-- AC-F01-1 --> | <!-- criterion text from spec --> | <!-- what the test does: action → expected result --> | |
| | | | |

<!-- Add more features above this line -->

---

## 4. External Service Setup

<!-- One section per external service. Skip this section if the project has no external services. Every service needs a provisioning checklist, a verification command, and at least one troubleshooting entry. -->

<!-- Repeat this block for each service: -->

### <!-- Service name (e.g. Supabase, Auth0, Stripe) -->

**What it does:**
<!-- One sentence: its role in the application -->

**Must-do checklist:**

- [ ] Account / project provisioned
- [ ] Credentials in `.env` (`<!-- KEY_NAME -->`)
- [ ] <!-- any schema migration, seed script, or manual step specific to this service -->
- [ ] Connection verified (see verification step below)

**Verification:**

```
<!-- Paste the exact command or query that confirms the service is reachable and configured correctly -->
<!-- Example: SELECT COUNT(*) FROM users; — should return ≥ 1 -->
```

**Troubleshooting:**

- **If `<!-- common error message -->`**: <!-- cause and fix -->
- **If `<!-- second common error -->`**: <!-- cause and fix -->

<!--
EXAMPLE — Supabase. Adapt and keep when the project uses Supabase; delete otherwise.

### Supabase

**What it does:**
Hosts the Postgres database and the auth service.

**Must-do checklist:**

- [ ] Project created; schema migration applied
- [ ] `SUPABASE_URL` and `SUPABASE_ANON_KEY` in `.env`
- [ ] Test users created MANUALLY — Supabase Dashboard → Authentication → Users → "Add user", using the exact emails and passwords in Section 2. Test users cannot be created programmatically.
- [ ] Each test user's UUID copied from the Auth dashboard and inserted into `profiles` (the profile `id` must equal the Auth user ID)
- [ ] Test data seeded (e.g. `node seed.mjs`) after the profiles exist
- [ ] Connection verified

**Verification:**

    Sign in with a test credential; then run: SELECT COUNT(*) FROM profiles; — expect at least the number of test users

**Troubleshooting:**

- **If `Invalid login credentials`**: the test users do not exist in Auth yet — create them in the dashboard. This is the most common E2E blocker on Supabase projects.
- **If a signed-in user sees no data**: the profile `id` does not match the Auth UUID — re-copy the UUID and update the profile row.

If provisioning takes more than a few lines, put the step-by-step walkthrough in a separate `PROVISIONING.md` and link it here.
-->

<!-- Add more services above this line -->

---

## 5. Test Data Requirements

<!-- Describe every system state the tests depend on. The "How to reach this state" column must be a concrete command or step, not "set it up manually". -->

| State | What it requires | How to reach this state |
|-------|-----------------|------------------------|
| Empty | No users, no records | Fresh database with schema applied |
| <!-- Populated --> | <!-- e.g. 3 users, 10 records --> | <!-- e.g. `node seed.mjs` --> |
| <!-- Error --> | <!-- e.g. payment service offline --> | <!-- e.g. set `STRIPE_KEY` to an invalid value --> |

---

## 6. Running the Tests

<!-- Paste the exact commands in order. No assumptions about what the reader knows. -->

```bash
# 1. Start the dev server
<!-- npm run dev -->

# 2. In a second terminal, run the full E2E suite
<!-- npx playwright test -->
# or
<!-- npm run test:e2e -->
```

**Expected output on full pass:**

```
<!-- paste or describe the expected success output, e.g. "84 passed (2m 13s)" -->
```

---

## 7. Troubleshooting Failed Tests

<!-- Add one entry per known failure pattern. Populated incrementally as failures are encountered during the run. -->

<!-- Template for each entry: -->

**If `<!-- test name or AC ID -->` fails with `<!-- error message -->`:**
- **Cause**: <!-- root cause -->
- **Fix**: <!-- exact step to resolve -->
- **Verify**: <!-- how to confirm the fix worked -->
