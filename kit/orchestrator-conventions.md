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

9. **Git hygiene** — before any workflow writes its first file in a repo, ensure a git repo exists and `.gitignore` contains the lines `kit/` and `.test-accounts.json` (append each only if missing; create `.gitignore` if absent). Verify: `git check-ignore -q kit/x` and `git check-ignore -q .test-accounts.json` both exit 0. If verification fails, stop and fix before continuing. Applies to every phase file, so upgrade, bug-fix, admin, and Phase 3 do not depend on Phase 1 Step 1.

10. **Kit version record** — `docs/.craft-kit.json` records the kit version that produced or last upgraded the project's documents. Workflows that finish a one-time setup (Phase 1 closeout, Adopt closeout, Project Upgrade report) write it from `.craft-kit-version` in the installed kit directory. Preflights compare it with the installed version, warn on a mismatch, and never block.

11. **Docs lint** — run `node kit/scripts/lint-docs.js` at the Phase 2 Docs preflight and before the Ship commit. Errors (invalid `Status`, malformed `Last updated`) are fixed before continuing. Warnings (`stale: <based-on file> was updated after <this file>`) are shown to the user and never block.

---

## Definition of Done

Commands come from `docs/constitution.md` → Verification Commands. A check whose status is `unknown` is reported to the user, never skipped silently.

1. **Baseline** (start of Phase 2 Step 3): run build, lint, typecheck and tests once and record the results in the session log. Failures that exist before any change are logged as `pre-existing` and are not attributed to this cycle.
2. **Before leaving Review** (Step 4): build, lint, typecheck and tests pass on the final fix diff. Only `pre-existing` failures may remain, each listed in the session log.
3. **Before Ship** (Step 7): if code changed since the last run (for example a fix from Manual Check), run them again.

Commands with side effects (database, network, deploy) are not run without asking the user.

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

## Test account registry

Test accounts live in one git-ignored file, `.test-accounts.json` at PROJECT_ROOT, reused across the whole lifecycle. Entry shape:

```json
{ "id": "admin-1", "role": "admin", "email": "...", "password": "...", "status": "unverified|valid|invalid|retired", "environment": "local|staging", "provisioning": "how it was created (e.g. seed.mjs, Supabase dashboard)", "created_by": "<feature slug or phase>", "created_on": "YYYY-MM-DD", "last_verified": "YYYY-MM-DD or null", "used_by": ["<feature slug>"], "notes": "free text (invalid reason, data it holds)" }
```

`id` is `<role>-<n>`, unique, never reused. Statuses: `unverified` (recorded, sign-in not confirmed), `valid` (confirmed, reusable), `invalid` (sign-in fails), `retired` (intentionally unused).

1. **Single source** — create the file from `kit/templates/test-accounts.json` if missing, only after rule 9 verification passes (fail-closed: never write it while it is not ignored).
2. **Reuse first** — before creating any account, read the registry and pick an entry with the needed `role` and `status: valid`. If only `unverified` exists, sign in to verify: set `valid` + `last_verified` on success, `invalid` + reason in `notes` on failure. Create a new account ONLY when no `valid` entry has the role, or the test needs isolated state (say why in `notes`). A new feature gets new test data on shared accounts, not a new account.
3. **Keep it current** — on creating an account, append an entry (`unverified`, then `valid` after a successful sign-in). On reuse, add the feature slug to `used_by`. On failure or discovered breakage, set `invalid`. Never delete entries; set `retired`. Update the file in the same step that changes reality.
4. **Scripts** — seed scripts and E2E tests read credentials from the registry, not per-feature `.env` keys, and are idempotent: upsert the account by `email`, never duplicate.
5. **Dispatch** — every subagent task touching sign-in, seeding, E2E, or manual-check instructions includes: `Test accounts: read PROJECT_ROOT/.test-accounts.json; follow kit/orchestrator-conventions.md → Test account registry; never copy passwords into committed files.`
6. **Committed docs** refer to accounts by `id` and `role` only.

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
