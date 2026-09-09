# Orchestrator Conventions

> Applies to every phase and every orchestrating agent in this kit.
> Phase files reference this document in place of their own convention sections.

---

## Step Banner

Emit this before doing any work in the step:

```
---
[Phase label] · Step N — [Step Name]
Skill / Agent: [name]  |  Gate: [none / soft / hard]
Started: HH:MM  |  Credits at start: NNNN
---
```

Phase-specific label variants:

| Phase | Label |
|---|---|
| Phase 1 | `Phase 1 · Step N — [Step Name]` |
| Phase 2 Standard Loop | `Phase 2 · Step N — [Step Name]  \|  Feature: [feature-slug]` |
| Phase 2 Single-Pass | `Phase 2 (Single-Pass) · Step N — [Step Name]` |
| Bug Fix | `Bug Fix · Step N — [Step Name]  \|  Slug: [bug-slug]` |

---

## Universal Rules

At the start of every step, the orchestrating agent MUST:

1. **Emit the step banner** before doing any work (see format above).

2. **Record wall-clock start time** — run `new Date().toLocaleTimeString()` via `eval(js)` at the exact moment the step starts. Do not estimate or leave as `—`.

3. **Set PROJECT\_ROOT** — include `PROJECT_ROOT: <absolute path to project folder>` in the context of every dispatched subagent task. Subagents resolve file paths relative to the workspace root, not the project folder, and will write outputs to the wrong location without an explicit path.

4. **Verify every file write** — after every subagent task that writes files, verify the file exists at the expected path before marking the step `complete`. If absent, recover content from `agent://<id>` and write it directly. Do not trust the agent's reported status alone.

5. **Gate Summary at every hard gate** — before waiting for human approval, emit a one-sentence Gate Summary. Format: `> **Gate:** [one sentence]`. This gives non-technical users a clear decision point without reading the full artifact. See `kit/gate-management.md` for gate type definitions and the full hard-gate protocol.

6. **Fail-fast write instruction** — include this verbatim in every subagent dispatch that produces a file:

   > *"If any file write fails on the first attempt, stop immediately. Do not try alternative write methods (REPL, base64, PowerShell, hub start, etc.). Yield the complete file content as your final result and notify the orchestrator via `hub`. The orchestrator handles file recovery from `agent://`."*

   This prevents subagents from spending 20+ minutes on write-retry spirals.

7. **Preview every written file** — after every file write (by subagent or directly), read back the first 20 lines and confirm: no missing markdown table separator rows (`|---|`), no truncation mid-sentence, no placeholder text left unfilled. A file that exists on disk but is structurally broken causes silent failures in downstream steps that read it.

At the **end of every step**, update the session log with duration and credit delta before advancing. See `kit/session-logging.md` for the log schema and phase-specific starter templates.

