# Phase 2 · Step 1b — Feature Screen Design

## Overview

- **Purpose**: Bridge spec to designer — emit a ready-to-share handoff message the user sends to their designer, then accept designs back as file exports (Path A) or via an MCP-connected design tool (Path B). Validates coverage before planning begins.
- **Skill/Agent**: Orchestrator only — no agent dispatch; no AI generation
- **Model**: none — screen identification, handoff message, coverage check, and manifest writing only
- **Trigger**: Step 1 (Brainstorm & Spec) gate passed
- **Inputs**:
  - `docs/specs/<feature-slug>/spec.md` — acceptance criteria and screen list for this feature
  - `docs/specs/<feature-slug>/screens/*.md` — filled spec-screen files (if produced in Step 1)
  - `docs/DESIGN.md` — approved design system
- **Outputs**:
  - `docs/designs/<feature-slug>/` — image files (Path A), or
  - `docs/designs/<feature-slug>/design-manifest.json` — design tool frame mappings (Path B), or both when Path B has file fallbacks
- **Template**: none
- **Gate**: `hard` — all required screens covered before Step 2 begins

## Scope

### In Scope

- Identifying every distinct screen this feature requires
- Emitting a designer handoff message the user can copy and send directly to their designer
- Accepting designs back via file exports or an MCP-connected design tool
- Validating coverage; recording fallback decisions in session log and manifest

### Out of Scope

- Generating, critiquing, or revising screen designs
- Creating new document files for the designer — the handoff is a printed terminal message only
- Designs for other features — each cycle covers only the current feature's screens
- Implementation planning — that is Step 2

### Scope Boundary

> Covers exactly the screens required by this feature's spec. Each feature cycle runs this step independently.

## Execution Rules

### Phase A — Identify required screens

Read `docs/specs/<feature-slug>/spec.md` and any `docs/specs/<feature-slug>/screens/*.md` files. Identify every distinct screen this feature requires: pages, modals, drawers, named view states, and any state (empty, error) whose layout diverges meaningfully from the default.

Build the required-screen list with a suggested filename per screen.

**Skip condition:** if this feature has only one simple screen already covered by `docs/preview/`, skip this step. Record the reason in the session log and advance to Step 2. Not permitted if the feature has 2+ non-trivial screens.

---

### Phase B — Emit designer handoff message

Print the following to the terminal (fill in the actual screen list from Phase A). This is what the user sends to their designer — no file is created.

```
--- Designer Handoff: [Feature Name] ---

Share these files with your designer:
  docs/DESIGN.md                                 ← design system (colors, typography, spacing, components)
  docs/specs/<feature-slug>/screens/*.md         ← one brief per screen (purpose, content, layout, states)
  [if no screen files exist: docs/specs/<feature-slug>/spec.md]

Screens to design:
  - <screen-name-1>
  - <screen-name-2>
  ...

Artboard/frame naming: use the screen names above exactly.
  Design tool (Figma, Sketch, Penpot, etc.): case-insensitive; hyphens and spaces are equivalent.
  File exports: <screen-name>.png (or .jpg / .webp / .pdf / .html)

When designs are ready, reply "files" (exported images) or "mcp" (design tool with MCP access).
----------------------------------------
```

Wait. Do not proceed until the user replies.

---

### Phase C — Path selection

**"files"** → follow Path A below.
**"mcp"** → follow Path B below.

If the previous feature cycle used Path B and the same design file is likely to contain this feature's artboards, offer to reuse the URL and tool name rather than asking again.

---

### Path A — File exports

#### A1 — Confirm paths

```
Place files at:
  docs/designs/<feature-slug>/<screen-name>.png
  ...
Reply "ready" when done. To skip a screen (fall back to DESIGN.md + preview/), name it.
```

#### A2 — Wait for "ready"

Hard stop.

#### A3 — Coverage validation

For each required screen check `docs/designs/<feature-slug>/` for the file.
- **Found** → covered
- **Missing, not declared** → block; list missing files; wait
- **Missing, declared skip** → record as DESIGN.md-fallback in session log with reason

Repeat until all screens are covered or declared.

---

### Path B — Design tool via MCP

#### B1 — Get design file URL

Ask:
> Provide the design file URL from your design tool (e.g. a Figma file link, a Penpot project URL, or the URL your MCP server uses to identify the file). Also name the tool (e.g. "figma", "sketch", "penpot"). Confirm your MCP connection is active.

#### B2 — Verify MCP connection

Attempt to read the design file via MCP.
- Succeeds → B3
- Fails → report the error; offer: fix and retry, or fall back to Path A. Wait.

#### B3 — Frame/artboard coverage check

For each required screen, find the matching artboard or frame in the design file (case-insensitive; hyphens = spaces).
- Found and readable → covered (mcp)
- Not found or unreadable → add to file-fallback list

#### B4 — Resolve fallbacks

For each file-fallback screen: user either fixes the artboard name/access in their design tool and retries, or exports and places the file at `docs/designs/<feature-slug>/<screen-name>.png`. Repeat until resolved.

#### B5 — Write manifest

Write `docs/designs/<feature-slug>/design-manifest.json`:

```json
{
  "design_url": "https://...",
  "design_tool": "figma",
  "screens": [
    { "screen": "item-detail", "frame_name": "Item Detail", "status": "mcp" },
    { "screen": "item-detail-edit", "status": "file_fallback", "file": "item-detail-edit.png" }
  ]
}
```

Fields:
- `design_url` — URL the MCP server uses to identify the design file
- `design_tool` — name of the tool (e.g. `"figma"`, `"sketch"`, `"penpot"`) — informational; helps the implement step select the right MCP adapter if multiple are configured
- `status` values: `"mcp"` (read via MCP at implement time), `"file_fallback"` (image file used instead), `"design_md_fallback"` (no design; use DESIGN.md + preview/ only)

---

### Phase D — Hard gate

**Path A:**
```
Gate Summary — Screen Design: [Feature Name] (file exports)
N files in place. [X DESIGN.md-fallbacks listed]
Approve to begin planning.
```

**Path B:**
```
Gate Summary — Screen Design: [Feature Name] (design tool via MCP)
Design file: <url> · N artboards readable · X file-fallbacks · Y DESIGN.md-fallbacks
Approve to begin planning.
```

## Artifact Rules

- **No new documents created by this step** — the handoff is a printed terminal message only
- **Path A**: `docs/designs/<feature-slug>/` image files; user-provided; never modified by orchestrator or agents
- **Path B**: `docs/designs/<feature-slug>/design-manifest.json` written by orchestrator; image files also present for file-fallback screens
- DESIGN.md-fallback decisions recorded in session log (per `kit/session-logging.md`)
- **Status / approval condition**: Hard gate — user explicitly approves after coverage passes

## Completion Criteria

- [ ] Required-screen list built (or skip recorded)
- [ ] Designer handoff message printed to terminal
- [ ] User has replied with delivery path ("files" or "mcp")
- [ ] Every required screen accounted for: file, MCP artboard, file-fallback, or DESIGN.md-fallback
- [ ] Path B: manifest written and verified on disk
- [ ] Hard gate passed

## Transition Rules

### Before Advancing

- All screens accounted for with no unresolved gaps
- Path B: manifest verified on disk (read first 5 lines)
- Hard gate passed — gate summary: *"Screen designs for [Feature Name] are in place. Approve to begin planning."*

### Next Step

- **Default**: Step 2 — Plan
- **Optional skip**: Yes — feature has one simple screen covered by `docs/preview/`; requires user confirmation and session log entry
- **User decision required**: Yes — hard gate approval required

### Transition Record

- **Record**: session log (per `kit/session-logging.md`)
- **Values**: `complete` / `skipped`
- **Additional fields**: `design_path: file | mcp`, `design_url: <url>` (Path B only), `design_tool: <tool>` (Path B only)

## Exceptions / Special Cases

- If no `docs/specs/<feature-slug>/screens/*.md` files exist, point the designer to the relevant sections in `docs/specs/<feature-slug>/spec.md` — include section names in the handoff message
- If Path B MCP fails after one retry, fall back to Path A entirely — do not block on MCP issues
- If the designer iterates on a screen after delivery, the user re-places the file (Path A) or updates the artboard (Path B) and replies "ready" again — re-run coverage validation only for the changed screens
- `design_tool` is informational only — if the kit does not recognise the tool name, it still attempts the MCP read using generic frame/artboard lookup

## References

- `docs/specs/<feature-slug>/spec.md`
- `docs/specs/<feature-slug>/screens/*.md`
- `docs/DESIGN.md`
- `docs/preview/`
- `kit/steps/phase-2/p2-02-plan.md`
