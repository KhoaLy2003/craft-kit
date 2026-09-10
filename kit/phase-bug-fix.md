# Bug Fix Workflow

> **Use this when a bug has been reported against a shipped feature.**
> Do not start fixing before the root cause is diagnosed — a patch applied to the wrong cause silently leaves the real bug in place.
>
> Prerequisites: A runnable application; `docs/constitution.md` in place.

---

## How to Read This Document

Three steps: **Assess → Fix → Verify**. Each step is structured as: Overview, Scope, Execution Rules, Artifact Rules, Completion Criteria, Transition Rules, Exceptions / Special Cases, and References. The gate at Assess is the most important — do not proceed to Fix until the diagnosis is confirmed.

## Orchestrator Conventions

Read `kit/orchestrator-conventions.md` for the universal rules every orchestrating agent must follow. For bug fixes, the key items are: step banner (use `Bug Fix · Step N — [Step Name]  |  Slug: [bug-slug]  |  Gate: [none/hard]`), wall-clock time recording, file-write verification, and gate summary protocol at the Assess and Verify hard gates.

Read `kit/session-logging.md` for the session log schema and the Bug Fix starter template (`docs/bug-session.md`).

---

## Step 1 — Assess

### Overview

- **Purpose**: Reproduce the bug and diagnose its root cause; define the exact scope of what needs to be fixed.
- **Agent/Skill**: General-purpose agent (read-only codebase research); human confirms the diagnosis.
- **Trigger**: A bug report exists with a reproducible symptom.
- **Inputs**:
  - Bug report
  - Running application
  - Codebase
- **Outputs**:
  - `docs/specs/bugs/<bug-slug>/assess.md` — symptom, reproduction steps, root cause location, proposed fix scope
- **Gate**: `hard` — do not proceed to Fix until the root cause is confirmed.

### Scope

#### In Scope

- Reproducing the symptom reliably.
- Dispatching the general-purpose agent to locate the relevant code (read-only, no edits).
- Documenting the full causal chain: what the user does → what the system does → where it goes wrong → why.
- Bounding the fix scope explicitly: which files, which functions, what is in and what is out.

#### Out of Scope

- Proposing or implementing a fix (deferred to Step 2).
- Touching any code at this stage.

#### Scope Boundary

> Do not proceed to Fix until the root cause is confirmed by the human. A symptom description is not a root cause.

### Execution Rules

- **Reproduce first.** Confirm you can trigger the symptom reliably before reading any code. An unreproducible bug cannot be verified fixed.
- Dispatch your general-purpose agent to locate the relevant code. Instruct it to read only — no edits at this stage. Ask it to find where the reported behavior originates, not to propose a fix.
- Document the full causal chain: *what the user does → what the system does → where it goes wrong → why it goes wrong there*. A symptom description ("button doesn't work") is not a root cause.
- Bound the fix scope explicitly: which files, which functions, what is in and what is out. A fix that touches more than the root cause is a spec violation.

### Artifact Rules

- **Artifact**: `docs/specs/bugs/<bug-slug>/assess.md`
- Write the artifact using the following template — preserve every field:

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

- **Status / approval condition**: The artifact is approved when the human confirms the root cause and fix scope at the hard gate.

### Completion Criteria

The step is considered complete when:

- [ ] The symptom can be reliably reproduced.
- [ ] The root cause is identified to a specific location in the codebase (file, function, line range if known).
- [ ] The full causal chain is documented in `assess.md`.
- [ ] The fix scope is explicitly bounded (in scope and out of scope).
- [ ] The human has confirmed the diagnosis at the hard gate.

### Transition Rules

#### Before Advancing

- The symptom must be reproducible.
- `assess.md` must be written and contain a specific root cause (not just a symptom description).
- The fix scope must be explicitly bounded.
- Human confirmation received at the gate.
- Gate summary: *"The diagnosis is: [one sentence root cause]. The fix will touch: [files/scope]. Does this match what you believe is broken?"*

#### Next Step

- **Default**: Step 2 — Fix
- **Optional skip**: No
- **User decision required**: Yes — hard gate requires human confirmation

#### Transition Record

- **Record**: `docs/bug-session.md`
- **Values**: `complete`

### Exceptions / Special Cases

- If the bug cannot be reproduced, do not proceed. Document the attempted reproduction steps in `assess.md` and report back to the human before continuing.

### References

- `kit/orchestrator-conventions.md`
- `kit/session-logging.md`
- `docs/constitution.md`

---

## Step 2 — Fix

### Overview

- **Purpose**: Implement the fix scoped precisely to the diagnosed root cause; do not expand scope or refactor.
- **Agent/Skill**: Specialist matched to the affected code (e.g. `frontend-developer`, or your general-purpose agent).
- **Trigger**: Step 1 gate approved — root cause confirmed, fix scope defined.
- **Inputs**:
  - `docs/specs/bugs/<bug-slug>/assess.md`
  - Affected files identified in Assess
- **Outputs**:
  - Code changes on a `fix/<bug-slug>` branch
- **Gate**: `none`

### Scope

#### In Scope

- Implementing the fix targeted to the root cause identified in `assess.md`.
- Checking the fix against `docs/constitution.md`.

#### Out of Scope

- Expanding scope beyond the root cause.
- Refactoring adjacent code.
- Adding features while fixing.
- Committing until Step 3 confirms the fix works.

#### Scope Boundary

> The fix is scoped to the root cause identified in `assess.md`. If something else is broken, file a separate bug report.

### Execution Rules

- **Before dispatching:** create a fix branch: `git checkout -b fix/<bug-slug>`.
- Dispatch the specialist matched to the affected code.
- The fix is scoped to the root cause identified in `assess.md`. Do not expand scope, refactor adjacent code, or add features while fixing. If something else is broken, file a separate bug report.
- Check the fix against `docs/constitution.md`. A fix that violates the constitution introduces a new problem.
- Do not commit until Step 3 confirms the fix works.

### Artifact Rules

- **Artifact**: Code changes on `fix/<bug-slug>` branch (no separate document artifact).
- Changes must be limited to files and functions listed in the fix scope of `assess.md`.
- **Status / approval condition**: `none` — Step 2 has no gate; proceed to Step 3 when the fix implementation is complete.

### Completion Criteria

The step is considered complete when:

- [ ] The `fix/<bug-slug>` branch is created.
- [ ] Code changes are limited to the scope defined in `assess.md`.
- [ ] The fix has been checked against `docs/constitution.md`.
- [ ] No commit has been made yet (deferred to Step 3).

### Transition Rules

#### Before Advancing

- The fix branch exists and code changes are in place.
- Changes do not exceed the scope defined in `assess.md`.
- The fix has been verified against `docs/constitution.md`.

#### Next Step

- **Default**: Step 3 — Verify
- **Optional skip**: No
- **User decision required**: No

#### Transition Record

- **Record**: `docs/bug-session.md`
- **Values**: `complete`

### Exceptions / Special Cases

- If something else is found broken during the fix, do not fold it in — file a separate bug report and keep the current fix scoped.

### References

- `docs/specs/bugs/<bug-slug>/assess.md`
- `docs/constitution.md`
- `kit/orchestrator-conventions.md`

---

## Step 3 — Verify

### Overview

- **Purpose**: Confirm the original symptom is resolved and no regression occurred in related behavior; then commit and open a PR.
- **Agent/Skill**: `ui-ux-tester` (UI symptom verification); general-purpose agent (non-UI symptom regression + related behavior); human confirms.
- **Trigger**: Fix complete on `fix/<bug-slug>` branch.
- **Inputs**:
  - Running application with fix applied
  - Original reproduction steps from `assess.md`
- **Outputs**:
  - Verification result — original symptom resolved, no regression detected
  - Commit on `fix/<bug-slug>` and PR against main
  - Updated `docs/bug-session.md`
- **Gate**: `hard` — do not ship without confirmation that the original symptom is gone.

### Scope

#### In Scope

- Verifying the original symptom using the exact reproduction steps from `assess.md`.
- Running the affected E2E flow (if one exists) to check for regression in related behavior.
- Committing, pushing, and opening a PR once verified.
- Updating `docs/bug-session.md` with the final status and PR link.

#### Out of Scope

- Making further code changes (if the symptom persists, return to Step 2; do not patch in Step 3).

#### Scope Boundary

> If the original symptom still occurs after applying the fix, the fix is wrong. Return to Step 2 — do not iterate around the symptom in this step.

### Execution Rules

- **Verify the original symptom first.** Follow the exact reproduction steps from `assess.md`. If the symptom still occurs, the fix is wrong — return to Step 2.
- Run the affected E2E flow from Phase 2 (if one exists) to confirm no regression in related behavior.
- For UI symptoms, use `ui-ux-tester` to verify in the running browser.
- For non-UI verification (data integrity, API behavior, error handling), dispatch your general-purpose agent.
- Once verified: commit with message `fix(<scope>): <one-line description> — resolves <bug-slug>`. Push the branch and open a PR against main.
- Update `docs/bug-session.md` with the final status and PR link.

### Artifact Rules

- **Artifact**: Commit on `fix/<bug-slug>` branch; PR against main; updated `docs/bug-session.md`.
- Commit message format: `fix(<scope>): <one-line description> — resolves <bug-slug>`.
- **Status / approval condition**: The gate is cleared when the human confirms the original symptom no longer occurs and surrounding behavior is intact.

### Completion Criteria

The step is considered complete when:

- [ ] The original symptom no longer occurs using the exact reproduction steps from `assess.md`.
- [ ] The affected E2E flow (if one exists) passes without regression.
- [ ] Human has confirmed at the hard gate.
- [ ] Commit made with the correct message format.
- [ ] Branch pushed and PR opened against main.
- [ ] `docs/bug-session.md` updated with final status and PR link.

### Transition Rules

#### Before Advancing

- Original symptom confirmed resolved by the human.
- No regression detected in surrounding behavior.
- Commit, push, and PR completed.
- Gate summary: *"The fix is applied. Does [original symptom from assess.md] still occur? And does the surrounding behavior still work as expected?"*

#### Next Step

- **Default**: Workflow complete — bug is resolved.
- **Optional skip**: No
- **User decision required**: Yes — hard gate requires human confirmation

#### Transition Record

- **Record**: `docs/bug-session.md`
- **Values**: `complete`

### Exceptions / Special Cases

- If the symptom persists after the fix, return to Step 1 (Assess): update `assess.md` with what the failed fix revealed, re-diagnose, get human confirmation, and proceed to a new fix pass. See the "When the Assessment Is Wrong" section below.

### References

- `docs/specs/bugs/<bug-slug>/assess.md`
- `docs/bug-session.md`
- `kit/orchestrator-conventions.md`

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
