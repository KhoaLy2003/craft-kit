# Kit Testing Summary

Scorecard for each completed test round.
**Updated only when a round closes** (result confirmed as PASS or FAIL).

For issue detail, kit file changes, open issues, and lessons: see `testing/testing-log.md`.

---

## Rounds at a Glance

| Round | Project | Stack | Track | Result | Time | Credits | Issues (found / fixed / open) |
|---|---|---|---|---|---|---|---|
| 01 | reading-list | React + Vite + TS + Tailwind + localStorage | single-pass | **PASS** | not tracked | not tracked | 13 / 13 / 0 |
| 02 | meal-planner | Vanilla HTML + CSS + JS *(agent-chosen)* | single-pass | **FAIL** | not tracked | not tracked | 6 / 4 / 2 |
| 03 | chore-splitter | React 18 + Vite + TS + Supabase (Postgres + Realtime + Edge Functions) | single-pass | **PASS** | ~4h 30m | not tracked | 8 / 8 / 1 |
| 04 | court-booking | Next.js 14 + TS + Supabase Postgres (Drizzle) + NextAuth.js v5 + Tailwind CSS | single-pass | **PASS** | ~8h+ | not tracked | 3 / 1 / 2 |
| 05 | leave-request | React + Vite + TS + Supabase (Postgres + Auth + RLS) | single-pass | **PASS** | ~2h 30m | not tracked | 1 / 1 / 0 |

---

## Metadata Schema

Each round entry uses this block. Fill every field at round close; mark `n/a` only if the phase did not run, `not tracked` if data was not recorded.

```
Result:          PASS | FAIL
Date:            YYYY-MM-DD → YYYY-MM-DD
Sessions:        N   (how many separate chat sessions the round required)

Project
  Domain:        [one phrase — e.g. "personal productivity", "household coordination"]
  Stack:         [chosen stack]
  Phase 2 track: single-pass | standard loop

Complexity
  Must features:   N
  Should features: N
  Could features:  N
  Feature sizes:   S / M / L mix

Kit state going in
  Issues fixed before this round: N   (cumulative fixes applied before round started)
  Known open issues carried in:   N

Phase 1
  Steps run:      N of 9   (list skipped steps)
  Wall-clock:     Xh Ym
  Credits:        N
  Slowest step:   Step N — [name] (X min)
  Costliest step: Step N — [name] (N credits)

Phase 2
  Steps run:      N of 6 / N of 7   (whichever track)
  Wall-clock:     Xh Ym
  Credits:        N
  Slowest step:   Step N — [name] (X min)
  Costliest step: Step N — [name] (N credits)

Total
  Wall-clock:     Xh Ym
  Credits:        N
  USD estimate:   ~$X.XX   (from OMP dashboard; mark n/a if not checked)

Quality
  Hard gates triggered:    N
  Write failures recovered: N
  E2E tests:               N / N passing   (n/a if Phase 2 did not run)
  Spec coverage gaps:      N   (n/a if Phase 2 did not run)

Outcome
  What was built:   [one sentence]
  Failure reason:   [one sentence, or n/a]
  Issues found / fixed / open: N / N / N
  Detail: testing-log.md Issues N–N
```

---

## Round 01 — reading-list

```
Result:          PASS
Date:            not tracked → not tracked
Sessions:        not tracked

Project
  Domain:        personal productivity
  Stack:         React + Vite · TypeScript · Tailwind CSS · localStorage
  Phase 2 track: single-pass

Complexity
  Must features:   11
  Should features: not tracked
  Could features:  not tracked
  Feature sizes:   S/M (all)

Kit state going in
  Issues fixed before this round: 0   (first round — kit unvalidated)
  Known open issues carried in:   0

Phase 1
  Steps run:      9 of 9
  Wall-clock:     not tracked
  Credits:        not tracked
  Slowest step:   not tracked
  Costliest step: not tracked

Phase 2
  Steps run:      6 of 6 (single-pass)
  Wall-clock:     not tracked
  Credits:        not tracked
  Slowest step:   not tracked
  Costliest step: not tracked

Total
  Wall-clock:     not tracked   (time tracking added as Issue 3 fix mid-round)
  Credits:        not tracked
  USD estimate:   n/a

Quality
  Hard gates triggered:    not tracked
  Write failures recovered: not tracked
  E2E tests:               66 / 66 passing
  Spec coverage gaps:      0

Outcome
  What was built:   Personal reading list — add/edit/filter items, mark read, localStorage persistence.
  Failure reason:   n/a
  Issues found / fixed / open: 13 / 13 / 0
  Detail: testing-log.md Issues 1–13
```

---

## Round 02 — meal-planner

```
Result:          FAIL
Date:            not tracked → not tracked
Sessions:        not tracked

Project
  Domain:        household meal planning
  Stack:         Vanilla HTML + CSS + JavaScript   (chosen by agent, not user — root cause of failure)
  Phase 2 track: single-pass

Complexity
  Must features:   10
  Should features: not tracked
  Could features:  not tracked
  Feature sizes:   S/M (all)

Kit state going in
  Issues fixed before this round: 13   (Issues 1–13 from Round 01)
  Known open issues carried in:   0

Phase 1
  Steps run:      9 of 9
  Wall-clock:     not tracked
  Credits:        not tracked
  Slowest step:   not tracked
  Costliest step: not tracked

Phase 2
  Steps run:      5 of 6 (failed at Step 6 — Manual Check)
  Wall-clock:     not tracked
  Credits:        not tracked
  Slowest step:   not tracked
  Costliest step: not tracked

Total
  Wall-clock:     not tracked
  Credits:        not tracked
  USD estimate:   n/a

Quality
  Hard gates triggered:    not tracked
  Write failures recovered: not tracked
  E2E tests:               not tracked (Phase 2 reached E2E but result not recorded before failure)
  Spec coverage gaps:      0   (convergence passed before Manual Check failure)

Outcome
  What was built:   Weekly dinner planner (10 features) — built entirely in Vanilla JS/CSS without user approval of stack.
  Failure reason:   Step 7 stack decision made by agent without user confirmation; discovered at Manual Check after full Phase 2 implementation.
  Issues found / fixed / open: 6 / 4 / 2
  Detail: testing-log.md Issues 14–16
```

---

## Round 03 — chore-splitter

```
Result:          PASS
Date:            2026-09-05 → 2026-09-05
Sessions:        2   (Phase 1 in prior session; Phase 2 in this session)

Project
  Domain:        household chore coordination
  Stack:         React 18 + Vite · TypeScript strict · Supabase (Postgres + Realtime + Edge Functions) · React Router v6 · Lucide React
  Phase 2 track: single-pass

Complexity
  Must features:   6   (F01–F06)
  Should features: 2   (F07, F08 — deferred to future standard loop)
  Could features:  2   (F09, F10 — deferred)
  Feature sizes:   S (3), M (3)

Kit state going in
  Issues fixed before this round: 19   (Issues 1–16 from Rounds 01–02; Issues 17–24 during Phase 1)
  Known open issues carried in:   1   (Open Issue 1 — SDD per-task review)

Phase 1
  Steps run:      8 of 9   (Step 2 — Market Research skipped by user)
  Wall-clock:     ~2h 30m
  Credits:        not tracked reliably
  Slowest step:   Step 3 — Tech Research (~30 min; post-Issue-18-fix; catalog-first)
  Costliest step: Step 4 — Interactive Prototype (~9652 credits)

Phase 2
  Steps run:      7 of 7   (all steps; Step 3 infrastructure applied via npx supabase)
  Wall-clock:     ~2h 00m   (19:37 → 21:35)
  Credits:        not tracked reliably (budget.spent() inconsistent across subagent sessions)
  Slowest step:   Step 5 — Code Review + E2E (73 min; 11 min review + 45 min E2E + 17 min infrastructure setup)
  Costliest step: Step 5 — Code Review + E2E (estimated ~35k credits)

Total
  Wall-clock:     ~4h 30m
  Credits:        not tracked reliably
  USD estimate:   n/a

Quality
  Hard gates triggered:    4   (Step 1 spec, Step 2 plan, Step 6 manual check — all explicit; infrastructure unblock was user-assisted not a gate)
  Write failures recovered: 0
  E2E tests:               36 / 36 passing   (3 bugs found and fixed during E2E pass)
  Spec coverage gaps:      0   (39/39 AC covered at Converge)

Outcome
  What was built:   Shared household chore rotation app — create household, manage chores, generate weekly assignments with round-robin rotation, mark chores done with real-time sync across all connected members.
  Failure reason:   n/a
  Issues found / fixed / open: 8 / 8 / 1   (Issues 25 + 3 Lessons; Open Issue 1 carried forward)
  Detail: testing-log.md Round 03 Close section
```

---

## Round 04 — court-booking

```
Result:          PASS
Date:            2026-09-06 → 2026-09-07
Sessions:        3+  (Phase 1; Phase 2 + redesign in separate sessions)

Project
  Domain:        sports facility booking
  Stack:         Next.js 14 App Router · TypeScript strict · Supabase Postgres (Drizzle ORM) · NextAuth.js v5 · Tailwind CSS (Bento Quiet)
  Phase 2 track: single-pass

Complexity
  Must features:   5   (F01–F05)
  Should features: 1   (F06 — shipped in same pass)
  Could features:  0
  Feature sizes:   S (2), M (4)

Kit state going in
  Issues fixed before this round: 26   (Issues 1–26 from Rounds 01–03 + refactor)
  Known open issues carried in:   1   (Open Issue 1 — SDD per-task review)

Phase 1
  Steps run:      8 of 8   (Step 2 — Market Research skipped by user; 8-step schema post-Issue-26 refactor)
  Wall-clock:     ~2h
  Credits:        not tracked reliably
  Slowest step:   Step 9 — Scaffold (~45 min; Next.js + Supabase + NextAuth setup)
  Costliest step: Step 9 — Scaffold (estimated highest)

Phase 2
  Steps run:      7 of 7   (all steps)
  Wall-clock:     ~6h   (includes E2E retry due to bcrypt env-var interpolation bug)
  Credits:        not tracked reliably
  Slowest step:   Step 5 — Code Review + E2E (~5h total across two E2E runs)
  Costliest step: Step 5 — Code Review + E2E

Redesign cycle (new pattern — separate from Phase 2)
  Steps run:      3 of 3   (Audit+Fix, Code Review, Manual Check)
  Wall-clock:     ~30 min
  Credits:        not tracked
  Branch:         feature/court-booking-redesign off feature/court-booking

Total
  Wall-clock:     ~8h+
  Credits:        not tracked reliably
  USD estimate:   n/a

Quality
  Hard gates triggered:    5   (spec, plan, manual check — Phase 2; manual check — redesign; plus Phase 1 gates)
  Write failures recovered: 0
  E2E tests:               30 / 30 passing   (second run; first run timed out on auth bug)
  Spec coverage gaps:      1   (AC-01.5 missing redirect; fixed at Converge)

Outcome
  What was built:   Court booking MVP — owner auth, court management, player availability view, slot booking
                    with atomic double-booking prevention, booking dashboard, slot management (block/cancel/unblock).
                    Separate redesign cycle: left-aligned homepage, slot chip animations, focus-visible rings,
                    confirmation page redesign, 404 page, favicon.
  Failure reason:   n/a
  Issues found / fixed / open: 3 / 1 / 2   (Issues 27–29; 27 fixed; 28–29 open)
  Kit improvements: specs/ → docs/specs/ path refactor (8 files); session logs + kickoff → docs/ (8 files);
                    design-taste-frontend added to task-agent-rubric.md
  New pattern:      Redesign cycle as clean post-Phase-2 step — own branch, own session log, own code review
  Detail:           testing-log.md Round 04 section (Issues 27–29 + Round 04 Close)
```

---

## Round 05 — leave-request

```
Result:          PASS
Date:            2026-09-08 → 2026-09-09
Sessions:        1   (continuous single session)

Project
  Domain:        leave request management (HR/compliance)
  Stack:         React 18 + Vite · TypeScript · Supabase (Postgres + Auth) · Role-Level Security (RLS)
  Phase 2 track: single-pass

Complexity
  Must features:   13   (F01–F12, F15)
  Should features: 1   (F13 — deferred)
  Could features:  1   (F14 — deferred)
  Feature sizes:   S (11), M (2)

Kit state going in
  Issues fixed before this round: 29   (Issues 1–29 from Rounds 01–04 + refactor)
  Known open issues carried in:   3   (Open Issues 1, 30, 31)

Phase 1
  Steps run:      n/a   (Phase 1 completed in prior session; kit validation only tests Phase 2)

Phase 2
  Steps run:      7 of 7   (all steps including new Step 5a gate)
  Wall-clock:     ~2h 30m   (8:10 PM → 8:37 PM)
  Credits:        not tracked
  Slowest step:   Step 5 — Code Review + E2E (95 min; comprehensive review + 84 E2E tests)
  Costliest step: Step 5 — Code Review + E2E

Total
  Wall-clock:     ~2h 30m
  Credits:        not tracked
  USD estimate:   n/a

Quality
  Hard gates triggered:    4   (Step 1 spec, Step 2 plan, Step 5a E2E testing plan, Step 6 manual check — all explicit user approval gates)
  Write failures recovered: 0
  E2E tests:               84 / 84 passing   (all acceptance criteria covered; zero skipped)
  Spec coverage gaps:      0   (Converge analysis: 84/84 ACs covered)

Outcome
  What was built:   Leave request MVP — Employee submit/cancel requests with balances, Manager approve/reject/queue,
                    HR balances view + history + filters + CSV export. State machine enforcement via Postgres ENUM.
                    Role-Level Security (RLS) for access control. All 13 Must features shipped.
  Failure reason:   n/a
  Issues found / fixed / open: 1 / 1 / 0
  Kit improvements: Step 5a (E2E Testing Plan) gate added (hard gate before E2E testing); generic `kit/guides/e2e-testing-plan.md`
                    provisioning workflow created; `kit/phase-2-single-pass.md` + `kit/phase-2-checklist.md` updated
  Detail:           testing-log.md Issue 32 (E2E provisioning requirement) + Round 05 Close
```
