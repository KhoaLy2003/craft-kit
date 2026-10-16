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

   > *"If any file write fails on the first attempt, stop immediately. Do not try alternative write methods (REPL, base64, PowerShell, shell redirection, etc.). Yield the complete file content as your final result and report the failure to the orchestrator. The orchestrator handles file recovery."*

3. **Verify every write** — after any subagent writes files, confirm each file exists at the expected path and its last line is complete (not cut mid-sentence). If absent, recover the content from the subagent's returned output or transcript if your platform exposes it; otherwise ask the subagent to resend the complete content. Then write the file directly. Do not trust the agent's reported status alone. For table-heavy or template-filled artifacts, also read the first 20 lines: confirm table separator rows (`|---|`) are present and no placeholders are left unfilled.

4. **Write the file first, then ask for review** — never print a document's full content in the terminal for review. Sequence: write the file → tell the user the path → ask them to open and review it → wait. Terminal output is for summaries, key decisions, and gate prompts. If clarifying questions must come before the file can be written, print only the questions, never a draft of the document.

5. **English only** — all AI-generated output (artifacts, plans, code comments, in-session summaries) is in English regardless of the user's language or the kickoff file's language. Exception: user-facing UI copy for a non-English target audience follows the product's language; surrounding documentation stays English.

6. **Session log** — update the phase's session log (`kit/session-logging.md`) at each gate and at completion, not after every step.

7. **Design dispatch** — every dispatch that implements UI follows the [Design dispatch contract](#design-dispatch-contract).

8. **Diagrams** — project diagrams live in the markdown document (Mermaid where the template has a diagram block, otherwise the text description): the diffable source of truth that renders anywhere. Rendering to interactive HTML costs real tokens, so render only the diagrams that earn it. When the `archify` skill is available, render a diagram only if it passes the filter below; everything else stays as Mermaid or text. Name the output location explicitly, because Archify otherwise writes under `.archify/`: HTML at `docs/diagrams/<doc>-<name>.html`, with its typed JSON source kept beside it as `docs/diagrams/<doc>-<name>.json` (that file is what a later re-render edits). Link the HTML under the document's `Diagrams` line. Follow the skill's own workflow (typed JSON from the Mermaid or text, then `finalize`); never hand-write the HTML. Archify does not parse Mermaid mechanically: the agent reads it for meaning and authors fresh JSON, so check the rendered result against the document.

   | Candidate | Archify type | Render only when |
   |---|---|---|
   | System overview (`architecture.md` §5) | `architecture` | always (exactly 1) |
   | Screen flow (`flows.md` §2) | `workflow` | the role or area has 5 or more screens or a guarded branch; at most 1 per role |
   | Core journey (`flows.md` §3) | `sequence` if it crosses an external service, otherwise `dataflow` | the journey is a Core User Flow from `roadmap.md` or `journey-map.md`, with 4 or more steps; one diagram per journey, never both types |
   | Entity-relationship diagram (`data-model.md` §2) | `erd` | always (exactly 1 per project); needs Archify 3 or later, which lists `erd` in its type router; with an older copy the Mermaid `erDiagram` stays the only version |

   Entity lifecycles are never rendered: they stay as the state list and transitions in `data-model.md` §3 (a Mermaid `stateDiagram` there is optional for 4 or more states).

   **Budget: at most 6 rendered diagrams per project, not counting the ER diagram.** If more candidates pass the filter, keep them in this order until the budget is full: system overview, screen flow of the primary role, core journeys by build order, other screen flows. The rest stay Mermaid. The ER diagram is always required in `data-model.md` §2 as a Mermaid `erDiagram` (the diffable source) and is always rendered with the `erd` type. Give it one table per entity with every field from §3, key roles (`pk`/`fk`/unique) with `references` on foreign keys, and a functional-domain `tag` per entity when the model has more than 8 entities.

   Render after the document is `approved`. Phase 2 amendments re-render only a diagram that is already rendered and whose source changed; they never add a new one unless the filter and budget allow it. `archify` is required for the HTML render (see the Phase 1 pre-flight); if it is missing and the user agreed to proceed without it, skip the HTML and record that in the session log. The document is complete without the HTML, so a missing skill never blocks a gate.

---

## Gates

Every step declares one gate type.

| Gate | Behavior |
|---|---|
| `none` | Auto-advance. No human decision required. A `none` step never sets a user-approved status on its artifacts. |
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

## Design dispatch contract

Applies to every dispatch that implements UI, in any phase. Never dispatch UI work without `docs/DESIGN.md` and `docs/preview/` — the implementing agent will otherwise invent its own visual language. Always include both in the dispatch brief, plus a per-screen visual reference resolved per screen:

- `docs/designs/<feature-slug>/design-manifest.json` exists and the screen's `status` is:
  - `mcp` → pass the design file URL, tool name, and frame/artboard name; the implementing agent queries the artboard via MCP at implementation time
  - `file_fallback` → include `docs/designs/<feature-slug>/<file>` as an image input
  - `design_md_fallback` → `docs/DESIGN.md` + `docs/preview/` only
- No manifest (designs delivered as file exports) → include the matching image from `docs/designs/<feature-slug>/` if one exists; otherwise `docs/DESIGN.md` + `docs/preview/` only.
- No `docs/designs/<feature-slug>/` for this screen → `docs/DESIGN.md` + `docs/preview/` only.

The implementing agent builds each screen to match its provided design exactly. This is not optional, whether or not the task carries "visual quality" signals.
