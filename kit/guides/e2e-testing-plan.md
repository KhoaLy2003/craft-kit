# E2E Testing Plan — Generic Kit Guide

> **For kit users on Phase 2:** Before Step 5b (Code Review + E2E Testing), create an E2E Testing Plan that documents what will be tested and how. This guide explains what to include.

---

## Purpose

The E2E Testing Plan is a **hard gate** before automated E2E testing begins. It ensures:
1. You understand what acceptance criteria will be tested
2. External services (databases, auth, payment processors, etc.) are provisioned
3. Test data requirements are documented
4. E2E testing time is not wasted on unprepared infrastructure

**Without a plan, E2E testing fails silently** (tests skip, tests timeout, tests crash with cryptic errors).

---

## What Goes in the E2E Testing Plan

Create `docs/E2E-TESTS.md` with these sections:

### 1. Overview
- **Total acceptance criteria**: N
- **Test coverage**: X% (ideally 100%)
- **Framework**: Playwright, Cypress, Selenium, etc.
- **Execution time estimate**: Minutes
- **Key dependencies**: External services needed (database, auth, payment processor, etc.)

### 2. Prerequisites Checklist

List everything that must be done before any test can run:

**Example:**
- [ ] Database schema applied (`migrations/schema.sql`)
- [ ] Auth service provisioned (Firebase, Auth0, Supabase, etc.)
- [ ] Test users created with known credentials
- [ ] Test data seeded (empty state, populated state, error states)
- [ ] API keys / connection strings in `.env`
- [ ] Dev server runs without errors

**Critical rule:** If ANY checkbox is unchecked, E2E **cannot start**. Document this explicitly.

### 3. Test Coverage Map

One table per feature or component. Map each acceptance criterion to its test case:

**Example:**
| AC ID | AC Description | Test Case | Status |
|-------|---|---|---|
| AC-F01-1 | User sees login form on `/login` | Unauthenticated nav to `/login` renders email + password fields | PASS |
| AC-F01-2 | Valid credentials sign user in | Submit valid email + password → redirect to home | PASS |
| AC-F01-3 | Invalid credentials show error | Submit wrong password → error message visible | PASS |

**Coverage rule:** Every AC has a row. Any AC with no test is a gap.

### 4. External Service Setup

For each external service (database, auth, payments, etc.), document:

**Template:**
```
## [Service Name]

**What it does:** 
Brief explanation (one sentence)

**Must-do checklist:**
- [ ] Service account provisioned
- [ ] Credentials in `.env`
- [ ] Test data seeded (how to seed)
- [ ] Connection verified (example query/call)

**Troubleshooting:**
- If X error, do Y
- If Z error, do W
```

**Example for a database:**
```
## PostgreSQL Database

**What it does:** 
Stores user accounts, requests, and transactions.

**Must-do checklist:**
- [ ] Database created on managed host (RDS, DigitalOcean, etc.) or local
- [ ] Schema migration applied (`migrations/schema.sql`)
- [ ] Connection string in `.env`
- [ ] Test users inserted
- [ ] Test data seeded (20 transactions, 5 users)

**Verification:**
```sql
SELECT COUNT(*) FROM users; -- should be ≥5
SELECT COUNT(*) FROM transactions; -- should be ≥20
```

**If "connection refused":**
- Check `DATABASE_URL` in `.env`
- Verify database is running
- Check firewall rules if remote

**If "table does not exist":**
- Migration not applied
- Run: `psql $DATABASE_URL < migrations/schema.sql`
```

### 5. Test Data Requirements

Document what state the system must be in before tests start:

**Example:**
```
| State | What it requires |
|-------|---|
| **Empty state** | No users, no data. Tests: home screen shows "Start here" message |
| **Populated state** | 10 users with 50 transactions. Tests: list loads, filters work |
| **Error state** | Database offline, auth service down. Tests: app shows error gracefully |
```

Then explain **how to set up each state** (seed scripts, fixtures, manual steps).

### 6. Running the Tests

Provide exact commands:

```bash
# Start dev server
npm run dev

# In another terminal, run E2E suite
npm run test:e2e
# or
npx playwright test
```

Expected output:
```
84/84 tests passed
```

### 7. Troubleshooting Failed Tests

Common failure patterns and fixes:

**Template:**
```
**If test "AC-X-Y" fails with "element not found":**
- Cause: Component not rendered yet (async issue)
- Fix: Add `await page.waitForSelector('.component', { timeout: 5000 })`
- Verify: Re-run, same test should pass

**If test "AC-A-B" times out:**
- Cause: External service slow or offline
- Fix: Check service status; verify network connection
- Verify: Retry test manually, confirm service is up
```

---

## User Approval Gate

After creating the plan, present it to the user:

> "E2E Testing Plan is ready (docs/E2E-TESTS.md). Review:
> - Does test coverage include all 84 acceptance criteria?
> - Are provisioning steps clear and doable?
> - Does troubleshooting guide cover known failure modes?
>
> Approve to proceed to E2E testing."

**Wait for explicit approval.** User may request:
- More test coverage
- Clearer provisioning steps
- Additional troubleshooting guides

Update the plan, re-present for approval.

---

## When E2E Testing Can Proceed

Only after user approves the plan AND all prerequisite checkboxes are verified:
1. External services are up
2. Test data is seeded
3. Dev server runs clean
4. `.env` is configured

Then run automated tests.

---

## Common Mistakes to Avoid

**Mistake 1:** Plan says "run tests" but doesn't say how to provision services first.
- **Fix:** Prerequisites checklist MUST come before the Run Tests section

**Mistake 2:** Plan assumes the reader knows the project's tech stack and architecture.
- **Fix:** Include one-sentence explanations (what does "database" mean? what's its role?)

**Mistake 3:** Plan lists all 84 ACs but doesn't map them to tests.
- **Fix:** Use a table with AC ID, description, test case, and status columns

**Mistake 4:** Provisioning steps are buried in prose instead of a checklist.
- **Fix:** Use checkboxes; make them scannable and actionable

---

## Example Structure (Minimal)

For a small project:

```markdown
# E2E Testing Plan — [Project Name]

## Overview
- 20 acceptance criteria
- 20 test cases (100% coverage)
- Framework: Playwright
- Time: ~5 minutes
- Dependency: PostgreSQL, Auth0

## Prerequisites Checklist
- [ ] PostgreSQL running on localhost:5432
- [ ] Auth0 tenant configured with test app
- [ ] Test credentials: test@example.com / TestPass123!
- [ ] Database schema applied
- [ ] `.env` has DATABASE_URL and AUTH0_DOMAIN

## Test Coverage
| AC | Test Case | Status |
|---|---|---|
| AC-1 | Home page loads | PASS |
| AC-2 | Login form validates email | PASS |
| ... | ... | ... |

## Running Tests
\`\`\`bash
npm run dev
npm run test:e2e
\`\`\`

## Troubleshooting
- "Connection refused": Check `.env` DATABASE_URL
- "Auth0 error": Verify tenant credentials in dashboard
```

---

## After Approval

Once user approves:
1. Verify all prerequisite checkboxes are done
2. Run dev server
3. Execute E2E test suite
4. Report pass/fail

If E2E passes → proceed to Step 5b (Code Review).
If E2E fails → fix blockers, re-run, update troubleshooting guide.

