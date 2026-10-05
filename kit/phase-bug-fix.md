# Bug Fix Workflow

> **Status:** experimental — not yet validated in a test round.
>
> **Use when a bug is reported against a shipped feature.** Diagnose the root cause before fixing; a patch on the wrong cause leaves the real bug in place.
>
> Prerequisites: a runnable application; `docs/constitution.md`.

Universal rules (banner, gates, PROJECT_ROOT, fail-fast writes, file verification) are in `kit/orchestrator-conventions.md`. Session log: `docs/bug-session.md`, one section per bug (`kit/session-logging.md`). `<bug-slug>` is a short kebab-case name agreed with the user.

| Step | Name | Gate | Model | Agent | Output |
|---|---|---|---|---|---|
| 1 | Assess | hard | capable | general-purpose agent (read-only) + human | `docs/specs/bugs/<bug-slug>/assess.md` |
| 2 | Fix | none | balanced | specialist matching the affected code (see `kit/task-agent-rubric.md`) | code on `fix/<bug-slug>` |
| 3 | Verify | soft; hard if the symptom is UI-only or not agent-verifiable | balanced | `ui-ux-tester` (UI) / general-purpose agent (non-UI) | commit + PR |

---

## Step 1 — Assess | Gate: hard

Reproduce the bug, diagnose the root cause, and bound the fix.

### Rules

- **Reproduce first.** Trigger the symptom reliably before reading any code; an unreproducible bug cannot be verified fixed. If it cannot be reproduced, record the attempts in `assess.md`, report to the human, and stop.
- Dispatch a general-purpose agent to locate the code, read-only. Ask where the reported behavior originates, not for a fix. Make no code edits in this step.
- Document the causal chain: what the user does → what the system does → where it goes wrong → why. A symptom ("button doesn't work") is not a root cause.
- Bound the fix scope explicitly: which files and functions are in, what is out.

**Artifact:** `docs/specs/bugs/<bug-slug>/assess.md`. Preserve every field:

```markdown
# Bug Assessment — [bug-slug]

**Report:** [original bug report, verbatim or linked]

**Symptom:** [what the user observes]

**Reproduction steps:**
1. …
2. …
3. …

**Root cause:** [specific location and reason — file, function, line range if known]

**Causal chain:** [what the user does → system behavior → where it breaks → why]

**Fix scope:** [files/functions to change; what is explicitly out of scope]

**Risk:** [what could break if the fix is wrong]
```

### Completion criteria

- [ ] Symptom reproduced reliably
- [ ] Root cause identified to a specific location; causal chain and bounded fix scope in `assess.md`
- [ ] Human confirmed the diagnosis

**Gate summary:** *"The diagnosis is: [one-sentence root cause]. The fix will touch: [files/scope]. Does this match what you believe is broken?"*

---

## Step 2 — Fix | Gate: none

Implement the fix, scoped strictly to the root cause in `assess.md`.

### Rules

- Create the branch first: `git checkout -b fix/<bug-slug>`.
- Dispatch the specialist matched to the affected code. Keep changes within the files and functions listed in the fix scope.
- **Scope boundary:** no refactoring of adjacent code and no added features. Anything else found broken becomes a separate bug report.
- Check the fix against `docs/constitution.md`; a fix that violates it creates a new problem.
- Do not commit yet; Step 3 commits once the fix is confirmed.

### Completion criteria

- [ ] `fix/<bug-slug>` exists with changes inside the `assess.md` fix scope, checked against the constitution
- [ ] Nothing committed

---

## Step 3 — Verify | Gate: soft (hard for UI-only / not agent-verifiable symptoms)

Confirm the original symptom is gone and nothing nearby regressed; then commit and open a PR.

### Rules

- Follow the exact reproduction steps from `assess.md` first. If the symptom persists, see "When the assessment is wrong".
- Run the affected Phase 2 E2E flow, if one exists, to catch regressions.
- UI symptoms: verify in the running browser with `ui-ux-tester`. Non-UI (data, API, error handling): dispatch a general-purpose agent.
- **Gate type:** if the agent verified the symptom itself, present the result as a soft gate. If the symptom is UI-only or cannot be verified by an agent, it is a hard gate: the human confirms the symptom is gone and surrounding behavior is intact before committing.
- Once verified: commit `fix(<scope>): <one-line description> — resolves <bug-slug>`, push the branch, and open a PR against main. Record status and PR link in `docs/bug-session.md`.
- No further code changes in this step.

### Completion criteria

- [ ] Original symptom no longer occurs; affected E2E flow (if any) passes
- [ ] Human confirmed, if the gate was hard
- [ ] Commit made in the format above; branch pushed; PR opened
- [ ] `docs/bug-session.md` shows final status and PR link

**Gate summary:** *"The fix is applied. Does [original symptom from assess.md] still occur, and does the surrounding behavior still work?"*

---

## When the Assessment Is Wrong

If the symptom persists after the fix, the Step 1 diagnosis was incorrect. Return to **Step 1 (Assess)**, do not patch around it in Step 2 or 3:

1. Update `assess.md` with what the failed fix revealed.
2. Re-diagnose and get the human's confirmation at the Step 1 gate.
3. Run a new Fix pass.

A fix that does not resolve the symptom is evidence about the real root cause, not a near-miss.
