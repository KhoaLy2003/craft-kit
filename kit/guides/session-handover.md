# Session Handover

> Invoked by the **Phase 2 Standard Loop** orchestrator when a handover is triggered.
> Produces `docs/handover.md` — the single file a new session needs to resume.
> Works with any AI harness.
>
> **Single-Pass users:** your session management is in `kit/phase-2-single-pass.md` —
> "Context Window Management" section. That flow is self-contained; this guide does not apply.

---

## Trigger Conditions

See `kit/phase-2-feature-dev.md` — Session Health section — for when the orchestrator calls
this guide and what form the trigger takes (proactive offer vs. immediate execution).

---

## Before Writing the Handover Document

### Clean-seam handover (after Step 2, 4, or 6)

Verify the completed step is recorded as `complete` in `docs/phase-2-session.md` before
writing the handover. No partial state exists; skip to the Capture Checklist.

### Mid-step handover (user-triggered, usually during Step 4 or 5)

Partial work is the hardest case. Resolve it before writing `docs/handover.md`:

1. Identify which plan tasks have complete, committed code.
2. For any task with partial code: commit what compiles cleanly, stash or discard the rest,
   and flag the task as "restarted in new session" in `docs/phase-2-session.md`.
3. Update the step's status in `docs/phase-2-session.md` to `blocked` with reason
   `session handover — resumed in new session`.

Do not hand over with uncommitted partial writes. A new session cannot recover in-memory or
unsaved work.

---

## Capture Checklist

Gather each item before filling the template:

- [ ] Project name — from `docs/idea-brief.md` or `package.json → name`
- [ ] Feature slug
- [ ] Current step number and name
- [ ] Sub-progress: what within the step is done, what remains
- [ ] Session log: read `docs/phase-2-session.md` for each step's current status
- [ ] Spec path and approval status
- [ ] Plan path, total task count, completed task count
- [ ] Current branch name — run `git branch --show-current`
- [ ] Any decisions made this session that are not captured in spec or plan
- [ ] Any blockers

---

## Handover Document Template

Write this to `docs/handover.md`. Overwrite any existing file — this is always the latest handover.

---

**`docs/handover.md` — fill every `[bracket]`:**

```
# Session Handover — [project-name]

**Generated:** [YYYY-MM-DD HH:MM local time]
**Reason:** [natural seam after Step N | stress signal | user request]

---

## Where We Are

| Field | Value |
|---|---|
| Phase | Phase 2 — Standard Loop |
| Feature | `[feature-slug]` |
| Step | Step [N] — [Step Name] |
| Status | [complete / in progress — description of sub-progress] |

---

## Completed Artifacts

Verify each path exists on disk before the new session proceeds.

| Artifact | Path | Notes |
|---|---|---|
| Spec | `docs/specs/[slug]/spec.md` | approved |
| Plan | `docs/specs/[slug]/plan.md` | [N] tasks total, [N] complete |
| Session log | `docs/phase-2-session.md` | updated to this handover point |
| Feature branch | `feature/[slug]` | [N] commits |

[Add rows for design files, architecture notes, or other artifacts produced this session.]

---

## In-Progress State

[Specific description of what was happening when the handover was triggered.

For mid-Step 4: list every plan task with its status — complete / restarted / not started.
For mid-Step 5: list every acceptance criterion with its convergence status — confirmed / gap found / not checked.
For clean seam: write "Step [N] complete. Ready to begin Step [N+1]."]

---

## Open Decisions

[Decisions made this session that are not yet reflected in spec.md or plan.md. A new session
reading only the artifacts would miss these.

If none, write: "None — all decisions are captured in the artifacts above."]

---

## Next Action

[Single, specific, unambiguous instruction — the first thing the new session does.
Concrete enough that no guesswork is needed.]

---

## Resumption Prompt

Copy everything from the line below through the end of this file.
Paste it as your first message in the new session.

====

I am resuming Phase 2 Standard Loop work on **[project-name]**.

**Kit:** `kit/phase-2-feature-dev.md`
**Feature:** `[feature-slug]`
**Resume at:** Step [N] — [Step Name] (`kit/steps/phase-2/p2-0N-[step-name].md`)
**Handover document:** `docs/handover.md` — read this first; it has full context.

Verify these exist on disk before doing anything else:
- `docs/specs/[slug]/spec.md`
- `docs/specs/[slug]/plan.md`
- `docs/phase-2-session.md`

**In-progress state:** [one sentence — copy from "In-Progress State" above]

**Next action:** [copy verbatim from "Next Action" above]

**Open decisions:** [copy from "Open Decisions" above, or "None"]

Emit the Step [N] banner per `kit/orchestrator-conventions.md`, then execute the next action.
Do not re-run any step recorded as `complete` in `docs/phase-2-session.md`.
```

---

## Concrete Example

Feature `user-authentication`, handed over mid-Step 5 on project `task-tracker`.
This is what the filled-in Resumption Prompt looks like:

```
I am resuming Phase 2 Standard Loop work on **task-tracker**.

**Kit:** `kit/phase-2-feature-dev.md`
**Feature:** `user-authentication`
**Resume at:** Step 5 — Converge (`kit/steps/phase-2/p2-05-converge.md`)
**Handover document:** `docs/handover.md` — read this first; it has full context.

Verify these exist on disk before doing anything else:
- `docs/specs/user-authentication/spec.md`
- `docs/specs/user-authentication/plan.md`
- `docs/phase-2-session.md`

**In-progress state:** Step 5 Converge is in progress. 8 of 10 acceptance criteria confirmed.
Two gaps identified: password reset flow (AC-7) and session expiry handling (AC-9) — not yet
implemented.

**Next action:** Implement AC-7 (password reset flow) and AC-9 (session expiry) as gap tasks,
then re-run convergence check against spec.md to confirm all 10 criteria pass before advancing
to Step 6.

**Open decisions:** Reset email provider: Resend (free tier). Token expiry: 24 h access,
30 d refresh. Both decisions are reflected in plan.md task notes.

Emit the Step 5 banner per `kit/orchestrator-conventions.md`, then execute the next action.
Do not re-run any step recorded as `complete` in `docs/phase-2-session.md`.
```

---

## New Session Bootstrap

The new session's first three actions, in this order:

1. **Read `docs/handover.md` in full** — the resumption prompt is a summary; the handover
   document has the complete state. Do not skip this step.
2. **Verify every artifact path** listed in the "Completed Artifacts" table exists on disk.
   If any path is missing, stop and report it before proceeding.
3. **Emit the step banner** for the resumption step per `kit/orchestrator-conventions.md`,
   then continue per the step file.

The new session MUST NOT re-run any step recorded as `complete` in `docs/phase-2-session.md`.
That log is the authoritative record of what is done.
