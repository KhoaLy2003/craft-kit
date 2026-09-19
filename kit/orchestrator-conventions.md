# Orchestrator Conventions

> Applies to every phase and every orchestrating agent in this kit.
> Phase files reference this document in place of their own convention sections.

---

## Step Banner

Emit this before doing any work in the step:

```
---
[Phase label] · Step N — [Step Name]
Skill / Agent: [name]  |  Model: [tier → model-name]  |  Gate: [none / soft / hard]
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

0. **Resolve model before each step** — before emitting the step banner, read `docs/MODELS.md`. Find the tier specified in the step file's Overview (`capable`, `balanced`, or `fast`), check for a per-step override matching this step file name, and resolve to a model name. Use that model for all AI work in this step. Include it in the banner as `[tier → model-name]`. If `docs/MODELS.md` is absent, stop and run `kit/setup-models.md` before proceeding.

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

8. **Language: English only** — all AI-generated output (artifacts, documents, plans, comments, code comments, and in-session summaries) must be in English, regardless of the user's spoken language or the language used in the kickoff file. If a user writes the kickoff in Vietnamese, translate and respond in English. The only exception is user-facing UI copy that the product explicitly targets at a non-English audience — that copy follows the product's target language, but the surrounding documentation remains English.

9. **Write the file first, then ask for review** — never print a document's full content in the terminal and ask the user to review it there. The correct sequence is: write the file to disk → tell the user the file path → ask them to open and review it → wait for approval. Terminal output is for summaries, key decisions, and gate prompts — not full document content. This applies to every artifact: idea brief, market notes, spec, plan, design doc, architecture doc, constitution, and any other generated file.

   **During clarifying Q&A:** if questions must be asked before the file can be written, print only the questions — not a draft of the document content. The user answers the questions; the agent writes the file; the user then reviews the file on disk. Never mix document content into a Q&A message.

10. **Design system reference for frontend tasks** — any subagent dispatch that includes `frontend-developer` MUST pass `docs/DESIGN.md` and `docs/preview/` as explicit inputs in the dispatch brief. These are the approved visual contract from Phase 1 Step 4. The implementation must match the color tokens, typography, spacing, component patterns, and visual language shown in the preview. Never dispatch a frontend task without both files — omitting them causes the agent to invent its own visual language and breaks design consistency across the codebase.

At the **end of every step**, update the session log with duration and credit delta before advancing. See `kit/session-logging.md` for the log schema and phase-specific starter templates.

