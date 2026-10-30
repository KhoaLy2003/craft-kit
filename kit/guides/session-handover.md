# Session Handover

> **Status:** experimental — not yet validated in a test round.
>
> The one mid-phase handover mechanism for every phase (Phase 1, Phase 2, Phase 3, bug fix). Produces `docs/handover.md`, the single file a new session needs to resume. Works with any AI harness.
>
> **Relation to the Phase 1 → 2 handoff:** that one-time prompt, printed when Phase 1 ends and owned by `kit/phase-1-bootstrap.md`, starts Phase 2 in a fresh session. This guide covers pauses *inside* a phase, including inside Phase 2 after the handoff. The two never overlap: the handoff prompt is not written to `docs/handover.md`, and a handover never replaces it.

---

## Triggers

| Trigger | Action |
|---|---|
| **Natural seam** | Offer a handover before starting the next step, after a seam step completes. |
| **Stress signal** | 3 or more steps completed in the current session (steps completed in earlier sessions do not count; the counter restarts at every resume) → offer at the next natural seam. |
| **User request** | "hand over", "new session", "checkpoint", "session is getting big" → execute immediately; do not offer. |

Natural seams (nothing mid-flight, state is on disk):

| Phase | Seam steps |
|---|---|
| Phase 1 | Any step whose hard gate has just cleared |
| Phase 2 | After Step 2 (Plan: spec and plan on disk, no code), Step 3 (Implement: code on the feature branch; the handover commits it), Step 4 (Review: findings fixed; the handover commits it), Step 7 (Ship, `scope: feature` with `pending` features left: everything committed; the Unit is the next feature and the resume step is Step 1) |
| Phase 3 / bug fix / admin site | After any hard gate (admin: after the Scope gate, or after the shell checkpoint passes) |

Offer format (blockquote, then wait for the reply). Do not offer at other steps.

> **Session checkpoint.** Step [N] is complete and nothing is mid-flight. Say **"hand over"** to pause here and continue in a new session, or anything else to proceed to Step [N+1].

---

## Before Writing

**Clean seam:** confirm the completed step is `complete` in the phase's session log. If there are uncommitted code changes (Phase 2 after Implement or Review; bug fix at its Verify gate), WIP-commit them on the feature or fix branch. Then go to the Capture Checklist.

**Mid-step (user-triggered, typically Implement or E2E):** resolve partial work first.

1. Identify which plan tasks have complete code on the feature branch.
2. Commit the complete work as a WIP commit (handover is the one place besides Ship where commits happen).
3. For partial code, apply the one rule: **commit only what compiles cleanly; every other uncommitted change is stashed (`git stash push -m "handover: <task>"`, listed under In-Progress State) or discarded, and its task is flagged "restarted in new session" in the session log.** Never leave partial writes in the working tree.
4. Set the step to `blocked` in the session log with reason `session handover`.

**Phase 1 exception:** Phase 1 makes exactly one commit, at Step 8, so its documents stay uncommitted at a handover. Do not commit. List every file under `docs/` in the handover document and tell the user to keep the working folder (the same checkout) for the new session.

**Rule (all other phases):** after these steps the working tree is clean apart from `docs/handover.md` and the session log (`git status` shows no other uncommitted change). Never hand over with uncommitted writes; a new session cannot recover unsaved work. A stash is saved work only if it is named in the handover document.

---

## Capture Checklist

- [ ] Project name (`docs/idea-brief.md` or `package.json → name`)
- [ ] Phase, unit (feature slug / bug slug / release slug), current step number and name
- [ ] Sub-progress: what within the step is done, what remains
- [ ] Session log status per step (Phase 1: `docs/phase-1-session.md`; Phase 2: `docs/phase-2-session.md`; bug fix: `docs/bug-session.md`; Phase 3: `docs/phase-3-session.md`; admin: `docs/admin-session.md`)
- [ ] Paths and approval status of the step's artifacts (spec, plan, assess.md, discover.md …); plan task counts if applicable
- [ ] Current branch (`git branch --show-current`) if code is involved
- [ ] Decisions made this session not captured in an artifact
- [ ] Blockers

---

## Handover Document

Write to `docs/handover.md`. Fill every `[bracket]`.

**If `docs/handover.md` already exists:** it is an unconsumed handover (the New Session Bootstrap deletes it once consumed). Read its `Generated`, Phase, Unit, and Step first.
- Same phase and unit: the new document supersedes it. Overwrite, and mention the replaced one's step in Open Decisions if it differs.
- Different phase or unit: do not overwrite silently. Tell the user and ask whether to replace it or finish the earlier unit first.

```
# Session Handover — [project-name]

**Generated:** [YYYY-MM-DD HH:MM local time]
**Reason:** [natural seam after Step N | stress signal | user request]

## Where We Are

| Field | Value |
|---|---|
| Phase | [Phase 1 | Phase 2 (scope: all|feature) | Phase 3 | Bug fix | Admin site] |
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
**Resume at:** Step [N] — [Step Name] (`[step file path, or the phase file section for steps written inline]`)
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
4. Set the resumed step to `in progress` in the session log; the handover left it `blocked`.
5. Once the log shows the step in progress, delete `docs/handover.md`. It is a one-time handoff, not a record.
