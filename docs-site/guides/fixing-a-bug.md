# Fixing a Bug

Use the bug-fix workflow when something you already shipped is broken. It diagnoses the cause first, then fixes only that cause, then checks the symptom is gone. It does not refactor nearby code or add features.

It needs a runnable app and `docs/constitution.md`. It is experimental: not yet validated in a test round.

Not a bug but a missing feature? Use the [Maintenance workflow](/phases/phase-maintenance).

---

## Starting

Describe the problem in one or two sentences: what is wrong, and where.

```text
Run the bug fix workflow using kit/phase-bug-fix.md. The problem is: [what is wrong and where].
```

The more exact you are about what you did and what you saw, the faster the diagnosis. Include the page or command, any error text, and anything that changed recently.

---

## The Three Steps

| Step | What the AI does | Your part |
|---|---|---|
| 1. Assess | Reproduces the bug **before** reading code, finds the root cause, and writes it up with the exact files it may change | **Confirm the diagnosis** (hard gate) |
| 2. Fix | Creates a `fix/<bug-slug>` branch, changes only the files named in the assessment, and adds a regression test where the project has a test runner | Nothing |
| 3. Verify | Repeats the reproduction steps, runs any related end-to-end flow, then commits and opens a pull request | Nothing if the AI could check it itself. **Confirm the symptom is gone** if the bug is only visible in the UI |

The AI never merges and never pushes to your main branch. It asks before pushing, and with no remote it commits locally and tells you how to publish.

---

## The Decision That Matters: the Diagnosis

At the end of Assess you see one sentence like:

> The diagnosis is: *the date filter compares local time to UTC*. The fix will touch: *`src/lib/dates.ts`*. Does this match what you believe is broken?

Check two things:

1. **Is that really the cause of what you saw?** A symptom ("the button doesn't work") is not a cause. If the explanation does not fit what you observed, say so now. Nothing is changed until you confirm.
2. **Is the list of files right?** The fix cannot touch anything outside it. If the fix needs more, the AI comes back and asks.

---

## What You Get

| You get | Where |
|---|---|
| The diagnosis: steps to reproduce, root cause, fix scope, risk | `docs/specs/bugs/<bug-slug>/assess.md` |
| The fix, with a regression test where possible | branch `fix/<bug-slug>` |
| A pull request | Opened for you to review and merge |
| A log entry | `docs/bug-session.md`, one section per bug |

If the fix changes behaviour the docs describe (data model, flows, a spec, the E2E tests), the assessment lists those amendments and the AI makes them with the fix.

---

## When Something Goes Wrong

- **The AI cannot reproduce the bug.** It records what it tried and stops. Send more detail: exact steps, the data involved, the browser or environment.
- **The symptom is still there after the fix.** The diagnosis was wrong. The AI goes back to Assess, updates the assessment with what it learned, and asks you to confirm again. It does not patch around the problem.
- **It finds something else broken on the way.** That becomes a separate bug report, not part of this fix.
- **Several bugs at once.** Run the workflow once per bug. Each gets its own branch and pull request.

---

## Reference

The file the AI follows, shown in full: [Bug Fix Workflow](/phases/bug-fix).
