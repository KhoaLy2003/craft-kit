# Bug Fix Workflow

> **Use this when a bug has been reported against a shipped feature.**
> Do not start fixing before the root cause is diagnosed — a patch applied to the wrong cause silently leaves the real bug in place.
>
> Prerequisites: A runnable application; `docs/constitution.md` in place.

---

## How to Read This Document

Three steps: **Assess → Fix → Verify**. Each step has a gate. The gate at Assess is the most important — do not proceed to Fix until the diagnosis is confirmed.

## Orchestrator Conventions

Read `kit/orchestrator-conventions.md` for the universal rules every orchestrating agent must follow. For bug fixes, the key items are: step banner (use `Bug Fix · Step N — [Step Name]  |  Slug: [bug-slug]  |  Gate: [none/hard]`), wall-clock time recording, file-write verification, and gate summary protocol at the Assess and Verify hard gates.

Read `kit/session-logging.md` for the session log schema and the Bug Fix starter template (`docs/bug-session.md`).

---

## Step 1 — Assess

- **Agents**: Your general-purpose agent (read-only codebase research — instruct it to read only, no edits); human confirms the diagnosis
- **Trigger**: A bug report exists with a reproducible symptom
- **Inputs**: Bug report; running application; codebase
- **Output**: `docs/specs/bugs/<bug-slug>/assess.md` — symptom, reproduction steps, root cause location, proposed fix scope
- **Gate**: `hard` — do not proceed to Fix until the root cause is confirmed
- **Gate Summary**: *"The diagnosis is: [one sentence root cause]. The fix will touch: [files/scope]. Does this match what you believe is broken?"*
- **Notes**:
  - **Reproduce first.** Confirm you can trigger the symptom reliably before reading any code. An unreproducible bug cannot be verified fixed.
  - Dispatch your general-purpose agent to locate the relevant code. Instruct it to read only — no edits at this stage. Ask it to find where the reported behavior originates, not to propose a fix.
  - Document the full causal chain: *what the user does → what the system does → where it goes wrong → why it goes wrong there*. A symptom description ("button doesn't work") is not a root cause.
  - Bound the fix scope explicitly: which files, which functions, what is in and what is out. A fix that touches more than the root cause is a spec violation.
  - `assess.md` template:

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

---

## Step 2 — Fix

- **Agent**: Specialist matched to the affected code (e.g. `frontend-developer`, or your general-purpose agent)
- **Trigger**: Step 1 gate approved — root cause confirmed, fix scope defined
- **Inputs**: `docs/specs/bugs/<bug-slug>/assess.md`; affected files identified in Assess
- **Output**: Code changes on a `fix/<bug-slug>` branch
- **Gate**: `none`
- **Notes**:
  - **Before dispatching:** create a fix branch: `git checkout -b fix/<bug-slug>`.
  - The fix is scoped to the root cause identified in `assess.md`. Do not expand scope, refactor adjacent code, or add features while fixing. If something else is broken, file a separate bug report.
  - Check the fix against `docs/constitution.md`. A fix that violates the constitution introduces a new problem.
  - Do not commit until Step 3 confirms the fix works.

---

## Step 3 — Verify

- **Agents**: `ui-ux-tester` (UI symptom verification); your general-purpose agent (non-UI symptom regression + related behavior); human confirms
- **Trigger**: Fix complete on `fix/<bug-slug>` branch
- **Inputs**: Running application with fix applied; original reproduction steps from `assess.md`
- **Output**: Verification result — original symptom resolved, no regression detected; then commit + PR
- **Gate**: `hard` — do not ship without confirmation that the original symptom is gone
- **Gate Summary**: *"The fix is applied. Does [original symptom from assess.md] still occur? And does the surrounding behavior still work as expected?"*
- **Notes**:
  - **Verify the original symptom first.** Follow the exact reproduction steps from `assess.md`. If the symptom still occurs, the fix is wrong — return to Step 2.
  - Run the affected E2E flow from Phase 2 (if one exists) to confirm no regression in related behavior.
  - For UI symptoms, use `ui-ux-tester` to verify in the running browser. For non-UI verification (data integrity, API behavior, error handling), dispatch your general-purpose agent.
  - Once verified: commit with message `fix(<scope>): <one-line description> — resolves <bug-slug>`. Push the branch and open a PR against main.
  - Update `docs/bug-session.md` with the final status and PR link.

---

## Flow Diagram

```
Bug report received
         │
         ▼
[1] Assess — reproduce, locate root cause, bound fix scope  [hard gate]
         │
         ▼
[2] Fix — implement against the diagnosed cause only
         │
         ▼
[3] Verify — original symptom gone + no regression  [hard gate]
         │
         ▼
Commit + PR → main
```

---

## When the Assessment Is Wrong

If Step 3 reveals the symptom persists, the root cause diagnosis in Step 1 was incorrect. Do not iterate on the fix indefinitely — return to Step 1:

1. Update `assess.md` with what the failed fix revealed.
2. Re-diagnose the root cause using the new information.
3. Get human confirmation on the updated diagnosis.
4. Proceed to a new fix pass.

A fix that does not resolve the symptom is evidence about the real root cause, not a near-miss to patch around.
