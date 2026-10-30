# Kit token-trim plan

**Goal:** cut the characters (tokens) an agent reads per run, with the same workflow, gates and outputs.
**Baseline (installed kit, excl. CHANGELOG/resource):** 384K chars. Phase 1 + 2 hot path: 124K chars (~31K tokens).
**Target:** hot path ≤ 95K chars (-23%); reference guides read on demand, not whole.

## Rules for every item
1. Wording only unless the item says otherwise: keep headings, rule numbers, gate/model bullets, file names and output paths (tests and other files link to them).
2. Cut: repeated explanation, "why" prose that restates a rule, examples beyond one, restated cross-file rules (point instead).
3. After each file: `npm test` must stay 75/75; record before → after chars below.
4. One CHANGELOG line per batch (`### Changed (token trim)`).
5. No commits (user reviews first).

## Checklist

### A. Loaded on every step
- [x] A1 `orchestrator-conventions.md` 13.4K → 11.2K
- [x] A2 `session-logging.md` 1.8K (reviewed, already tight, no change)
- [x] A3 `task-agent-rubric.md` 2.4K (reviewed, no change)
- [x] A4 `START.md` 2.9K (reviewed, no change)

### B. Phase 1 (once per project)
- [x] B1 `phase-1-bootstrap.md` 10.4K → 8.5K
- [x] B2 `p1-01-ideation.md` 4.7K → 4.0K
- [x] B3 `p1-02-market-research.md` 2.7K → 2.6K
- [x] B4 `p1-03-prototype-design.md` 12.2K → 10.0K
- [x] B5 `p1-04-roadmap.md` 7.9K → 6.9K
- [x] B6 `p1-05-screen-design.md` 10.3K → 9.3K
- [x] B7 `p1-06-architecture.md` 7.0K (only the catalog read instruction changed; see D1)
- [x] B8 `p1-07-constitution.md` 3.7K (reviewed, no change)
- [x] B9 `p1-08-scaffold.md` 8.1K → 6.7K

### C. Phase 2 (every build cycle)
- [x] C1 `phase-2.md` 9.8K → 8.5K
- [x] C2 `p2-01-spec.md` 7.3K → 6.4K
- [x] C3 `p2-02-plan.md` 4.8K → 4.1K
- [x] C4 `p2-03-implement.md` 4.4K → 3.7K
- [x] C5 `p2-04-review.md` 5.0K → 4.3K
- [x] C6 `p2-05-e2e.md` 4.8K → 3.8K
- [x] C7 `p2-06-manual-check.md` 1.6K (reviewed, no change)
- [x] C8 `p2-07-ship.md` 8.6K → 7.5K

### D. Reference material (biggest lever: read on demand)
- [x] D1 `stack-catalog.md` 21K: p1-06 and the catalog header now say read selectively (Section 1 + matching triggers/domains only); file size unchanged, per-run read is partial
- [x] D2 `guides/design-reference.md` 23.6K: skipped; it is only a pointer in p1-03 and the 03c template, never read automatically, so no per-run cost
- [x] D3 `guides/session-handover.md` 7.5K (skipped: only read on a handover)
- [x] D4 `guides/evolving-specs.md` 5.3K (skipped: only read once, at Ship)

### E. Other workflows (run rarely, lower value)
- [x] E1 `phase-3-iterate.md` 24.1K → 21.2K
- [x] E2 `phase-adopt.md` 13.2K → 11.0K (merged duplicate Limitations/Principles)
- [x] E3 `phase-admin.md` 12.8K → 11.7K; `admin-blueprint.md` skipped (read as reference)
- [x] E4 `phase-bug-fix.md` 7.2K → 6.4K
- [x] E5 `phase-onboarding.md` 7.3K → 6.4K
- [x] E6 `phase-upgrade.md` 4.2K → 3.2K, `phase-roadmap-migrate.md` 9.4K → 8.4K; the other 3 modules: boilerplate line only (one-time legacy migrations)

### F. Templates
- [x] F1 templates: skipped; their comments are guidance the agent needs while filling them

### G. Close-out
- [x] G1 Final `npm test` green
- [x] G2 Hot path 130.8K → 113.9K (-13%); installed kit 384.5K → 357.3K (-7%). Target of 95K NOT met: the remaining text is mostly rules and gates, which wording trims cannot remove
- [x] G3 CHANGELOG entry lists every file touched
- [x] G4 Report what was skipped and the residual risk (needs an R06 round to confirm behavior)

## Results log
| Item | Before | After |
|---|---|---|
| A1 | 13,411 | 11,167 |
| B4 | 12,169 | 9,965 |
| B6 | 10,293 | 9,276 |
| C1 | 9,752 | 8,459 |
| B1 | 10,419 | 8,518 |
| C8 | 8,569 | 7,536 |
| E1 | 24,118 | 21,177 |
| E2 | 13,217 | 10,998 |
| E3 (admin) | 12,761 | 11,712 |
| E4 | 7,157 | 6,444 |
| E5 | 7,278 | 6,388 |
| B2 | 4,722 | 3,955 |
| B5 | 7,918 | 6,875 |
| B9 | 8,088 | 6,714 |
| C2 | 7,339 | 6,431 |
| C3 | 4,794 | 4,083 |
| C4 | 4,415 | 3,728 |
| C5 | 4,998 | 4,344 |
| C6 | 4,811 | 3,843 |
