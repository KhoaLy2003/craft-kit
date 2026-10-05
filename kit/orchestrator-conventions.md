# Orchestrator Conventions

> Universal rules for every orchestrating agent in every phase. Phase and step files reference this document instead of restating these rules.

---

## Step Banner

Emit one line before any work in a step:

```
## Step N — <Name> | Gate: <none|soft|hard> | Model: <tier>
```

Phase, feature slug, and bug/release slug are implied by the phase file and session log; do not repeat them. `<tier>` is `capable`, `balanced`, or `fast` as declared in the step's Overview. Add elapsed time or credits only if the harness exposes them cheaply; never block on them.

## Model Tiers

Tiers are resolved once, in Phase 1 (`kit/phase-1-bootstrap.md` → "Model tiers"), which writes `docs/MODELS.md`. The tier → model map is copied into the header of each session log when the log is created. Steps use the map from the session log and do not re-read `docs/MODELS.md`. A per-step override listed in `docs/MODELS.md` is copied into the log header too.

## Universal Rules

1. **PROJECT_ROOT** — include `PROJECT_ROOT: <absolute path to project folder>` in every dispatched subagent task. Subagents resolve paths against the workspace root and will write to the wrong place without it.

2. **Fail-fast write instruction** — include this verbatim in every subagent dispatch that produces a file:

   > *"If any file write fails on the first attempt, stop immediately. Do not try alternative write methods (REPL, base64, PowerShell, hub start, etc.). Yield the complete file content as your final result and notify the orchestrator via `hub`. The orchestrator handles file recovery from `agent://`."*

3. **Verify every write** — after any subagent writes files, confirm each file exists at the expected path and its last line is complete (not cut mid-sentence). If absent, recover content from `agent://<id>` and write it directly. Do not trust the agent's reported status alone. For table-heavy or template-filled artifacts, also read the first 20 lines: confirm table separator rows (`|---|`) are present and no placeholders are left unfilled.

4. **Write the file first, then ask for review** — never print a document's full content in the terminal for review. Sequence: write the file → tell the user the path → ask them to open and review it → wait. Terminal output is for summaries, key decisions, and gate prompts. If clarifying questions must come before the file can be written, print only the questions, never a draft of the document.

5. **English only** — all AI-generated output (artifacts, plans, code comments, in-session summaries) is in English regardless of the user's language or the kickoff file's language. Exception: user-facing UI copy for a non-English target audience follows the product's language; surrounding documentation stays English.

6. **Session log** — update the phase's session log (`kit/session-logging.md`) at each gate and at completion, not after every step.

7. **Frontend dispatch** — every `frontend-developer` dispatch follows [Frontend dispatch contract](#frontend-dispatch-contract).

---

## Gates

Every step declares one gate type.

| Gate | Behavior |
|---|---|
| `none` | Auto-advance. No human decision required. |
| `soft` | Present a short summary of what was produced (counts, key decisions, files). Advance unless the user asks for changes. |
| `hard` | Stop. Wait for explicit approval. Silence or a generic "continue" counts only if the gate message already named the decision being approved. |

At every hard gate:

1. Write the artifact to disk and give its path (rule 4).
2. Emit a Gate Summary: `> **Gate:** <one sentence>`. It MUST name the specific decision being confirmed (a stack, a scope boundary, a spec) and the most important thing the reader needs to know.
3. Do not advance until the response arrives.

**Good** — names the decision:
> **Gate:** The recommended stack is React + Supabase. Confirm before we write the architecture document.

**Poor** — no decision named:
> **Gate:** The architecture step is done. Please review and approve.

---

## Frontend dispatch contract

Applies to every `frontend-developer` dispatch, in any phase. Never dispatch a frontend task without `docs/DESIGN.md` and `docs/preview/` — the agent will otherwise invent its own visual language. Always include both in the dispatch brief, plus a per-screen visual reference resolved per screen:

- `docs/designs/<feature-slug>/design-manifest.json` exists and the screen's `status` is:
  - `mcp` → pass the design file URL, tool name, and frame/artboard name; the agent queries the artboard via MCP at implementation time
  - `file_fallback` → include `docs/designs/<feature-slug>/<file>` as an image input
  - `design_md_fallback` → `docs/DESIGN.md` + `docs/preview/` only
- No manifest (designs delivered as file exports) → include the matching image from `docs/designs/<feature-slug>/` if one exists; otherwise `docs/DESIGN.md` + `docs/preview/` only.
- No `docs/designs/<feature-slug>/` for this screen → `docs/DESIGN.md` + `docs/preview/` only.

The agent implements a screen to match its provided design exactly. This is not optional, whether or not the task carries "visual quality" signals.
