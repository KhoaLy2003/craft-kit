# e2e-tests.md — Output Template for Step 5a: E2E Testing Plan

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `docs/specs/spec.md`

---

## 1. Overview

<!-- Fill in totals derived from docs/specs/spec.md. Time estimate: roughly 30-60 seconds per test case as a baseline. -->

- **Total acceptance criteria**:
- **Test cases planned**:
- **Coverage**: <!-- X of Y acceptance criteria covered; flag any intentionally skipped and why -->
- **Framework**: <!-- e.g. Playwright, Cypress -->
- **Estimated run time**:
- **External dependencies**: <!-- list every external service the tests rely on (auth, database, payments, etc.) -->

---

## 2. Prerequisites Checklist

<!-- Every item here must be checked before Step 5b begins. If any box is unchecked, E2E cannot start. -->

- [ ] Dev server starts without errors (`npm run dev` or equivalent)
- [ ] `.env` has all required values (verified in Step 8 Scaffold — re-confirm here)
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

<!-- One table per feature from docs/specs/spec.md. AC IDs must match those in the spec exactly. Status column stays blank until Step 5b runs. -->

<!-- Repeat this block for each feature: -->

### Feature: <!-- Feature name from roadmap -->

| AC ID | Acceptance Criterion | Test Case | Status |
|-------|---------------------|-----------|--------|
| <!-- AC-F01-1 --> | <!-- criterion text from spec --> | <!-- what the test does: action → expected result --> | |
| | | | |

<!-- Add more features above this line -->

---

## 4. External Service Setup

<!-- One section per external service. Skip this section if the project has no external services. -->

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

<!-- Add one entry per known failure pattern. Populated incrementally as failures are encountered in Step 5b. -->

<!-- Template for each entry: -->

**If `<!-- test name or AC ID -->` fails with `<!-- error message -->`:**
- **Cause**: <!-- root cause -->
- **Fix**: <!-- exact step to resolve -->
- **Verify**: <!-- how to confirm the fix worked -->

---

## Gate Checklist (before proceeding to Step 5b)

- [ ] All acceptance criteria from `docs/specs/spec.md` appear in Section 3 (or are explicitly noted as excluded with reason)
- [ ] Every external service in Section 4 has a provisioning checklist and at least one troubleshooting entry
- [ ] Test credentials documented in Section 2
- [ ] Section 5 covers every data state the test suite depends on
- [ ] Section 6 commands are exact — copy-paste runnable with no gaps
- [ ] User has reviewed and approved this plan
