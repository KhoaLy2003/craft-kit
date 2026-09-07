# Skill & Agent Usage Tracker

> **Scope:** testing rounds only — one tally per trigger during a round run.
> A "trigger" = the orchestrator dispatches or invokes this skill/agent at least once in a step.
> Multiple dispatches of the same skill/agent within one step count as one trigger for that step;
> across different steps in the same round, count each step separately.
>
> **How to update:** after each round closes, fill in the count column for that round.
> Add new round columns as needed — copy the `R-NN` header pattern.

---

## Skills

| Skill | R-01 | R-02 | R-03 | R-04 | Total | Notes |
|---|---|---|---|---|---|---|
| `brainstorming` | — | — | — | — | — | P1 Step 1; P2 Step 1 (both tracks) |
| `writing-plans` | — | — | — | — | — | P2 Step 2 (both tracks) |
| `subagent-driven-development` | — | — | — | — | — | P2 Step 4 (standard); P2 Step 3 (single-pass) |
| `dispatching-parallel-agents` | — | — | — | — | — | P2 Step 4 (standard, parallel groups only) |
| `requesting-code-review` | — | — | — | — | — | P2 Step 6 (standard); P2 Step 5 (single-pass) |
| `finishing-a-development-branch` | — | — | — | — | — | P2 Step 9 (standard); P2 Step 7 (single-pass) |
| `using-git-worktrees` | — | — | — | — | — | Inside `subagent-driven-development` setup |
| `verification-before-completion` | — | — | — | — | — | Governs all completion claims across all steps |
| `design-taste-frontend` | — | — | — | — | — | P2 Step 4 (standard) / Step 3 (single-pass) — UI tasks with `frontend-developer` only |

---

## Specialist Agents

| Agent | R-01 | R-02 | R-03 | R-04 | Total | Notes |
|---|---|---|---|---|---|---|
| `market-researcher` | — | — | — | — | — | P1 Step 2 (optional) |
| `research-analyst` | — | — | — | — | — | P1 Step 6 |
| `frontend-developer` | — | — | — | — | — | P1 Step 3; P2 Steps 3–4 (standard); P2 Step 3 (single-pass); Bug Fix Step 2 |
| `code-reviewer` | — | — | — | — | — | P2 Step 6 (standard); P2 Step 5 (single-pass) |
| `ui-ux-tester` | — | — | — | — | — | P2 Step 7 (standard); P2 Step 5 (single-pass) |

---

## General-Purpose Agent

| Role | R-01 | R-02 | R-03 | R-04 | Total | Notes |
|---|---|---|---|---|---|---|
| General-purpose agent | — | — | — | — | — | P1 Steps 3–5, 7–8; P2 Steps 3, 5, 9; Bug Fix Steps 1–2 |

---

## Round Totals

| Round | Skills triggered | Agents triggered | Total triggers | Pass / Fail |
|---|---|---|---|---|
| R-01 | — | — | — | — |
| R-02 | — | — | — | — |
| R-03 | — | — | — | — |
| R-04 | — | — | — | — |
| **All rounds** | — | — | — | — |

---

## How to Fill In

1. At round close, go through the session log (`docs/phase-1-session.md`, `docs/phase-2-session.md`, `docs/bug-session.md`) for that round.
2. For each row in the session log where Status = `complete` or `skipped`, find the matching skill/agent row above and increment its count.
3. Skipped steps count as **0** (skill/agent was not triggered).
4. Update the Round Totals section after filling in all rows.
5. Carry `Total` as a running sum — do not reset between rounds.
