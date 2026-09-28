# Phase 2 — Feature Development

> **Run this cycle for every feature in `roadmap.md`, including the very first MVP feature.**
> Every feature goes through the full cycle independently — never batch multiple features together.
>
> **Coming from Design Sprint?** If you ran `kit/phase-2-design-sprint.md` first, Steps 1 and 1b
> are already complete for every feature in the sprint. The orchestrator auto-skips them when it
> detects the pre-built artifacts — start each feature at Step 2 (Plan).
>
> Prerequisites: Phase 1 complete, OR an existing project with `constitution.md` in place.

---

## Conventions

Read `kit/orchestrator-conventions.md` for the universal rules every orchestrating agent must follow: step banner format, time recording, PROJECT_ROOT requirement, file-write verification, gate summary protocol, and the fail-fast write instruction.

Read `kit/phase-2-checklist.md` for the Standard Loop checklist for each step and the Universal section at the top.

Read `kit/session-logging.md` for the session log schema and the Phase 2 Standard Loop starter template.

Before executing each step, read its step file — it is the authoritative source for that step's inputs, outputs, rules, and completion criteria.

---

## Skip Detection

Before running Step 1 or 1b for a feature, the orchestrator checks for pre-built artifacts:

| Step | Skip condition | How to detect |
|---|---|---|
| 1 — Brainstorm & Spec | Spec already written (e.g. by Design Sprint DS-1) | `docs/specs/<feature-slug>/spec.md` exists |
| 1b — Screen Design | Designs already validated (e.g. by Design Sprint DS-2) | `docs/designs/<feature-slug>/` contains at least one file **or** a `design-manifest.json` |

When a skip condition is met: record `status: skipped, reason: artifact_exists` in the session
log and advance directly to the next non-skipped step. Do not re-run the step or re-prompt the
user for approval — the gate was already passed in the sprint.

---

## Steps

| # | Name | Description | Gate | Skip if |
|---|---|---|---|---|
| 1 | Brainstorm & Spec | Write detailed acceptance criteria and edge cases for the feature; resolve ambiguity before implementation begins. | `hard` | `docs/specs/<slug>/spec.md` exists |
| 1b | Screen Design | User provides design files for all required screens in this feature; orchestrator validates coverage before planning begins. | `hard` | `docs/designs/<slug>/` contains designs |
| 2 | Plan | Break the feature into ordered implementation tasks with exact files, interfaces, and test steps. | `soft` | — |
| 3 | Assign Specialists | Match each task to the appropriate specialist agent based on domain and task type. | `none` | — |
| 4 | Implement | Write code to implement all tasks; dispatch specialist agents for each domain. | `soft` | — |
| 5 | Converge | Verify the implementation covers every acceptance criterion; identify gaps and implement them. | `none` | — |
| 6 | Code Review | Review code quality, security, and compliance with architecture and constitutional rules. | `none` | — |
| 7 | E2E Testing | Test the complete user flow in a running application with real data and real scenarios. | `soft` | — |
| 8 | Manual Double Check | Human walkthrough of the feature to catch anything automated tests may have missed. | `hard` | — |
| 9 | Ship | Commit, push the feature branch, and open a pull request; mark the feature as shipped. | `none` | — |

Step files: `kit/steps/phase-2/p2-01-spec.md` through `kit/steps/phase-2/p2-09-ship.md`; `kit/steps/phase-2/p2-01b-screen-design.md`.

---

## Flow Diagram

```
Pull next pending feature from docs/roadmap.md
         │
         ▼
docs/specs/<slug>/spec.md exists?
  Yes → skip Step 1 (log: artifact_exists)
  No  → [1] Brainstorm & Spec [hard gate]
         │
         ▼
docs/designs/<slug>/ has design files or manifest?
  Yes → skip Step 1b (log: artifact_exists)
  No  → [1b] Screen Design — user provides design files, coverage validated [hard gate]
         │
         ▼
[2] Plan
         │
         ▼
[3] Assign Specialists   ← kit-specific bridge step
         │
         ▼
[4] Implement (subagent-driven / parallel dispatch)
         │
         ▼
[5] Converge — spec coverage check → gap tasks → re-implement → repeat until converged
         │
         ▼
[6] Code Review → fix all findings → done
         │
         ▼
[7] E2E Testing (real app, real data, full flow) → fix failures → re-run
         │
         ▼
[8] Manual Double Check [hard gate]
         │
         ▼
[9] Ship (commit + push + PR to main + update roadmap.md)
         │
         ▼
Pull next pending feature from docs/roadmap.md ─────────────────┘
```

<div style="margin:24px 0;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.12);">
  <iframe src="/craft-kit/diagrams/phase-2-standard.html?embed=1" width="100%" style="border:none;display:block;height:60vh;min-height:480px;" title="Phase 2 Standard Loop — interactive flow diagram"></iframe>
</div>
<p style="margin-top:8px;font-size:0.85em;color:var(--vp-c-text-2);">Pan and zoom to explore. <a href="/craft-kit/diagrams/phase-2-standard.html" target="_blank" rel="noopener">Open full screen ↗</a></p>

---

## Notes on Skills

This phase uses the following skills without modifying them. Each skill is invoked as-is; the workflow just sequences them and adds the specialist assignment step between planning and implementation.

| Step | Skill / Agent | What it produces (internal) |
|---|---|---|
| 1 | `brainstorming` | Spec document + user approval |
| 2 | `writing-plans` | Plan document with tasks |
| 3 | Kit step (you) | Specialist annotations on each task |
| 4 | `subagent-driven-development` / `dispatching-parallel-agents` | Code on feature branch |
| 5 | general-purpose agent | Convergence report; gap tasks appended to plan.md |
| 6 | `code-reviewer` | Review findings, all fixed inline |
| 7 | `ui-ux-tester` / general-purpose agent | Test results, failures fixed inline |
| 8 | Human | Approval gate |
| 9 | `finishing-a-development-branch` + general-purpose agent | Committed branch + PR |

---

## Session Health

Phase 2 features can span multiple sessions. The orchestrator is responsible for recognizing
when a handover is appropriate and executing it cleanly. Three triggers apply:

### 1. Natural seam — proactive offer

After any of the following steps complete, offer a handover **before starting the next step**:

| After step | Why it's a clean cut |
|---|---|
| Step 2 — Plan | Spec and plan are on disk. No code written. Resumption is trivial. |
| Step 4 — Implement | Code is committed to the feature branch. No partial writes. |
| Step 6 — Code Review | All findings are fixed. Codebase is clean. |

Offer format (emit as a blockquote, then wait for the user's reply before continuing):

> **Session checkpoint.** This is a clean handover point — Step [N] is complete and nothing
> is mid-flight. Say **"hand over"** to pause here and continue in a new session, or say
> **"continue"** (or anything else) to proceed to Step [N+1].

Do not offer at every step. Only offer at the three seams above.

### 2. Stress signal — proactive offer

If the orchestrator has completed **3 or more steps on the current feature within this
session**, offer a handover at the next natural seam using the same offer format above.
This heuristic catches long Step 4 / Step 5 cycles that accumulate context gradually.

### 3. User request — execute immediately

Any of: "hand over", "new session", "checkpoint", "continue in a new session",
"session is getting big". Execute without offering — the user has already decided.

### Execution

When a handover is triggered (user accepts an offer, or user requests directly), follow
`kit/guides/session-handover.md` in full. It covers: pre-write cleanup for mid-step
handovers, the capture checklist, the `docs/handover.md` template, and the resumption
prompt format with a concrete example.
