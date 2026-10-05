# Kit Testing Summary

Scorecard for each completed test round. **Updated only when a round closes** (result confirmed as PASS or FAIL).

Issue detail and lessons: `testing/testing-log.md`. Kit file changes: `kit/CHANGELOG.md`.

> **Track:** "single-pass" is the pre-refactor name for Phase 2 `scope: all`. All five rounds used it; `scope: feature` (formerly the standard loop) has not been validated in a round.

---

## Rounds at a Glance

| Round | Project | Track | Result | Wall-clock | E2E | Issues (found / fixed / open) |
|---|---|---|---|---|---|---|
| 01 | reading-list | single-pass | **PASS** | not tracked | 66 / 66 | 13 / 13 / 0 |
| 02 | meal-planner | single-pass | **FAIL** | not tracked | not recorded | 6 / 4 / 2 |
| 03 | chore-splitter | single-pass | **PASS** | ~4h 30m | 36 / 36 | 8 / 8 / 1 |
| 04 | court-booking | single-pass | **PASS** | ~8h+ | 30 / 30 | 3 / 1 / 2 |
| 05 | leave-request | single-pass | **PASS** | ~2h 30m | 84 / 84 | 1 / 1 / 0 |

---

## Entry Schema

Fill every field at round close; use `not tracked` when data was not recorded and `n/a` when the phase did not run.

```
Result:      PASS | FAIL
Date:        YYYY-MM-DD → YYYY-MM-DD
Track:       Phase 2 scope — all | feature   (pre-refactor rounds: single-pass | standard loop)
Wall-clock:  Xh Ym   (total, all phases run)
E2E:         N / N passing
Issues:      found / fixed / open   (testing-log.md Issue numbers)
Outcome:     [what was built — one sentence; on FAIL, the failure reason too]
```

---

## Round 01 — reading-list

```
Result:      PASS
Date:        not tracked
Track:       single-pass
Wall-clock:  not tracked   (time tracking added mid-round as Issue 3)
E2E:         66 / 66 passing
Issues:      13 / 13 / 0   (Issues 1–13)
Outcome:     Personal reading list (React + Vite + TypeScript + Tailwind + localStorage) — add/edit/filter items, mark read, persistence.
```

## Round 02 — meal-planner

```
Result:      FAIL
Date:        not tracked
Track:       single-pass
Wall-clock:  not tracked
E2E:         not recorded
Issues:      6 / 4 / 2   (Issues 14–16)
Outcome:     Weekly dinner planner (10 features) built in vanilla HTML/CSS/JS. Failed: the stack decision was made by the agent without user confirmation; found at Manual Check after the full implementation.
```

## Round 03 — chore-splitter

```
Result:      PASS
Date:        2026-09-05 → 2026-09-05
Track:       single-pass
Wall-clock:  ~4h 30m   (Phase 1 ~2h 30m, Phase 2 ~2h)
E2E:         36 / 36 passing   (3 bugs found and fixed during the E2E pass)
Issues:      8 / 8 / 1   (Issue 25 + 3 lessons; Open Issue 1 carried forward)
Outcome:     Shared household chore rotation app (React 18 + Vite + TypeScript + Supabase Postgres/Realtime/Edge Functions) — round-robin weekly assignments, mark done with real-time sync.
```

## Round 04 — court-booking

```
Result:      PASS
Date:        2026-09-06 → 2026-09-07
Track:       single-pass   (plus a separate 3-step redesign cycle, ~30 min)
Wall-clock:  ~8h+   (Phase 1 ~2h, Phase 2 ~6h including an E2E retry after a bcrypt env-var bug)
E2E:         30 / 30 passing   (second run; first run timed out on an auth bug)
Issues:      3 / 1 / 2   (Issues 27–29; 28–29 were open at close, fixed afterward)
Outcome:     Court booking MVP (Next.js 14 + TypeScript + Supabase Postgres via Drizzle + NextAuth.js v5 + Tailwind) — owner auth, court management, availability view, atomic slot booking, booking dashboard, slot management; redesign cycle on its own branch.
```

## Round 05 — leave-request

```
Result:      PASS
Date:        2026-09-08 → 2026-09-09
Track:       single-pass   (Phase 2 only; Phase 1 completed in a prior session)
Wall-clock:  ~2h 30m
E2E:         84 / 84 passing   (every acceptance criterion covered, none skipped)
Issues:      1 / 1 / 0   (Issue 32 — E2E provisioning requirement)
Outcome:     Leave request MVP (React 18 + Vite + TypeScript + Supabase Postgres/Auth + RLS) — employee submit/cancel, manager approve/reject, HR balances/history/CSV export; all 13 Must features shipped.
```
