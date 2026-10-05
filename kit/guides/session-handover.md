# Session Handover

> **Status:** experimental — not yet validated in a test round.
>
> The one handover mechanism for every phase (Phase 1, Phase 2, Phase 3, bug fix). Produces `docs/handover.md`, the single file a new session needs to resume. Works with any AI harness.

---

## Triggers

| Trigger | Action |
|---|---|
| **Natural seam** | Offer a handover before starting the next step, after a seam step completes. |
| **Stress signal** | 3 or more steps completed in the current session → offer at the next natural seam. |
| **User request** | "hand over", "new session", "checkpoint", "session is getting big" → execute immediately; do not offer. |

Natural seams (nothing mid-flight, state is on disk):

| Phase | Seam steps |
|---|---|
| Phase 1 | Any step whose hard gate has just cleared |
| Phase 2 | After Step 2 (Plan: spec and plan on disk, no code), Step 3 (Implement: code on the feature branch; the handover commits it), Step 4 (Review: findings fixed; the handover commits it) |
| Phase 3 / bug fix | After any hard gate |

Offer format (blockquote, then wait for the reply). Do not offer at other steps.

> **Session checkpoint.** Step [N] is complete and nothing is mid-flight. Say **"hand over"** to pause here and continue in a new session, or anything else to proceed to Step [N+1].

---

## Before Writing

**Clean seam:** confirm the completed step is `complete` in the phase's session log. If there are uncommitted code changes (Phase 2 after Implement or Review), WIP-commit them on the feature branch. Then go to the Capture Checklist.

**Mid-step (user-triggered, typically Implement or E2E):** resolve partial work first.

1. Identify which plan tasks have complete code on the feature branch.
2. Commit the complete work as a WIP commit (handover is the one place besides Ship where commits happen). For partial code: commit what compiles cleanly, stash or discard the rest, and flag the task "restarted in new session" in the session log.
3. Set the step to `blocked` in the session log with reason `session handover`.

Never hand over with uncommitted writes; a new session cannot recover unsaved work.

---

## Capture Checklist

- [ ] Project name (`docs/idea-brief.md` or `package.json → name`)
- [ ] Phase, unit (feature slug / bug slug / release slug), current step number and name
- [ ] Sub-progress: what within the step is done, what remains
- [ ] Session log status per step (Phase 1: `docs/phase-1-session.md`; Phase 2: `docs/phase-2-session.md`; bug fix: `docs/bug-session.md`; Phase 3: `docs/phase-3-session.md`)
- [ ] Paths and approval status of the step's artifacts (spec, plan, assess.md, discover.md …); plan task counts if applicable
- [ ] Current branch (`git branch --show-current`) if code is involved
- [ ] Decisions made this session not captured in an artifact
- [ ] Blockers

---

## Handover Document

Write to `docs/handover.md`, overwriting any existing file. Fill every `[bracket]`.

```
# Session Handover — [project-name]

**Generated:** [YYYY-MM-DD HH:MM local time]
**Reason:** [natural seam after Step N | stress signal | user request]

## Where We Are

| Field | Value |
|---|---|
| Phase | [Phase 1 | Phase 2 (scope: all|feature) | Phase 3 | Bug fix] |
| Unit | `[feature-slug | bug-slug | release-slug | project]` |
| Step | Step [N] — [Step Name] |
| Status | [complete | in progress — sub-progress] |

## Completed Artifacts

Verify each path exists on disk before proceeding.

| Artifact | Path | Notes |
|---|---|---|
| [Spec] | `[path]` | [approved] |
| Session log | `[path]` | updated to this handover point |
| [Branch] | `[branch]` | [N commits] |

## In-Progress State

[What was happening at handover. Mid-Implement: every plan task with status complete / restarted / not started. Mid-E2E: every criterion as pass / fail / not run. Clean seam: "Step [N] complete. Ready to begin Step [N+1]."]

## Open Decisions

[Decisions not yet reflected in the artifacts, or "None — all decisions are captured in the artifacts above."]

## Next Action

[One specific instruction — the first thing the new session does.]

## Resumption Prompt

Paste everything below as the first message in the new session.

====

I am resuming **[phase]** work on **[project-name]**.

**Phase file:** `[kit/phase-….md]`
**Unit:** `[slug]`
**Resume at:** Step [N] — [Step Name] (`[step file path]`)
**Handover document:** `docs/handover.md` — read this first.

Verify these exist before doing anything else:
- `[artifact path]`
- `[session log path]`

**In-progress state:** [one sentence from above]
**Next action:** [verbatim from above]
**Open decisions:** [from above, or "None"]

Emit the Step [N] banner per `kit/orchestrator-conventions.md`, then execute the next action.
Do not re-run any step recorded as `complete` in the session log.
```

---

## New Session Bootstrap

1. Read `docs/handover.md` in full; the resumption prompt is only a summary.
2. Verify every path in "Completed Artifacts" exists. If any is missing, stop and report it.
3. Emit the banner for the resumption step and continue per the step file. The session log is the authoritative record of what is done; never re-run a `complete` step.
