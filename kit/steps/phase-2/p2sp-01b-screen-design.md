# Phase 2 (Single-Pass) · Step 1b — Full-App Screen Design

## Overview

- **Purpose**: Bridge spec to designer — emit a ready-to-share handoff message the user sends to their designer, then accept designs back as file exports (Path A) or via an MCP-connected design tool (Path B). Validates coverage before planning begins.
- **Skill/Agent**: Orchestrator only — no agent dispatch; no AI generation
- **Model**: none — screen identification, handoff message, coverage check, and manifest writing only
- **Trigger**: Step 1 (Full-App Spec) gate passed
- **Inputs**:
  - `docs/specs/spec.md` — all features and acceptance criteria
  - `docs/specs/*/screens/*.md` — filled spec-screen files (if produced in Step 1)
  - `docs/DESIGN.md` — approved design system
- **Outputs**:
  - `docs/designs/<feature-slug>/` — image files (Path A), or
  - `docs/designs/<feature-slug>/design-manifest.json` — design tool frame mappings (Path B), or both when Path B has file fallbacks
- **Template**: none
- **Gate**: `hard` — all required screens covered before Step 2 begins

## Scope

### In Scope

- Identifying every distinct screen across all features
- Emitting a designer handoff message the user can copy and send directly to their designer
- Accepting designs back via file exports or an MCP-connected design tool
- Validating coverage; recording fallback decisions in session log and manifests

### Out of Scope

- Generating, critiquing, or revising screen designs
- Creating new document files for the designer — the handoff is a printed terminal message only
- Implementation planning — that is Step 2

### Scope Boundary

> The kit's job in this step ends at two points: (1) handing the user a clear message to give their designer, and (2) validating that every required screen is covered when the designer delivers. Neither the orchestrator nor any agent makes design decisions.

## Execution Rules

### Phase A — Identify required screens

Read `docs/specs/spec.md` and any `docs/specs/*/screens/*.md` files. Identify every distinct screen each feature requires: pages, modals, drawers, named view states, and any state (empty, error) whose layout diverges meaningfully from the default.

Build the required-screen list grouped by feature slug with a suggested filename per screen.

**Skip condition:** if every feature has only one simple screen already covered by `docs/preview/`, skip this step. Record the reason in the session log and advance to Step 2. Not permitted if any feature has 2+ non-trivial screens.

---

### Phase B — Emit designer handoff message

Print the following to the terminal (fill in the actual screen list from Phase A). This is what the user sends to their designer — no file is created.

```
--- Designer Handoff ---

Share these files with your designer:
  docs/DESIGN.md                       ← design system (colors, typography, spacing, components)
  docs/specs/*/screens/*.md            ← one brief per screen (purpose, content, layout, states)
  [if no screen files exist: docs/specs/spec.md, sections: <feature names>]

Screens to design:

  <feature-name> (<feature-slug>)
    - <screen-name-1>
    - <screen-name-2>

  <feature-name> (<feature-slug>)
    - <screen-name-1>
    ...

Artboard/frame naming: use the screen names above exactly.
  Design tool (Figma, Sketch, etc.): case-insensitive; hyphens and spaces are equivalent.
  File exports: <screen-name>.png (or .jpg / .webp / .pdf / .html)

When designs are ready, reply "files" (exported images) or "mcp" (design tool with MCP access).
------------------------
```

Wait. Do not proceed until the user replies.

---

### Phase C — Path selection

**"files"** → follow Path A below.
**"mcp"** → follow Path B below.

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
> Provide the design file URL from your design tool (e.g. a Figma file link, or the URL your MCP server uses to identify the file). Confirm your MCP connection is active.

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

#### B5 — Write manifests

For each feature write `docs/designs/<feature-slug>/design-manifest.json`:

```json
{
  "design_url": "https://...",
  "design_tool": "figma",
  "screens": [
    { "screen": "dashboard-default", "frame_name": "Dashboard / Default", "status": "mcp" },
    { "screen": "dashboard-empty", "status": "file_fallback", "file": "dashboard-empty.png" }
  ]
}
```

Fields:
- `design_url` — URL the MCP server uses to identify the design file
- `design_tool` — name of the tool (e.g. `"figma"`, `"sketch"`, `"penpot"`) — used to select the correct MCP adapter at implement time
- `status` values: `"mcp"` (read via MCP at implement time), `"file_fallback"` (image file used instead), `"design_md_fallback"` (no design; use DESIGN.md + preview/ only)

---

### Phase D — Hard gate

**Path A:**
```
Gate Summary — Screen Design (file exports)
N files in place across M features. [X DESIGN.md-fallbacks listed]
Approve to begin planning.
```

**Path B:**
```
Gate Summary — Screen Design (design tool via MCP)
Design file: <url> · N artboards readable · X file-fallbacks · Y DESIGN.md-fallbacks
Approve to begin planning.
```

## Artifact Rules

- **No new documents created by this step** — the handoff is a printed terminal message only
- **Path A**: `docs/designs/<feature-slug>/` image files; user-provided; never modified by orchestrator or agents
- **Path B**: `docs/designs/<feature-slug>/design-manifest.json` written by orchestrator; image files also present for file-fallback screens
- DESIGN.md-fallback decisions recorded in `docs/phase-2-session.md`
- **Status / approval condition**: Hard gate — user explicitly approves after coverage passes

## Completion Criteria

- [ ] Required-screen list built (or skip recorded)
- [ ] Designer handoff message printed to terminal
- [ ] User has replied with delivery path ("files" or "mcp")
- [ ] Every required screen accounted for: file, MCP artboard, file-fallback, or DESIGN.md-fallback
- [ ] Path B: manifests written and verified on disk
- [ ] Hard gate passed

## Transition Rules

### Before Advancing

- All screens accounted for with no unresolved gaps
- Path B: manifests verified on disk (read first 5 lines)
- Hard gate passed — gate summary: *"All screen designs are in place. Approve to begin planning."*

### Next Step

- **Default**: Step 2 — Plan
- **Optional skip**: Yes — all features have one simple screen covered by `docs/preview/`; requires user confirmation and session log entry
- **User decision required**: Yes — hard gate approval required

### Transition Record

- **Record**: `docs/<project>/phase-2-session.md`
- **Values**: `complete` / `skipped`
- **Additional fields**: `design_path: file | mcp`, `design_url: <url>` (Path B only), `design_tool: <tool>` (Path B only)

## Exceptions / Special Cases

- If no `docs/specs/*/screens/*.md` files exist, point the designer to the relevant feature sections in `docs/specs/spec.md` — include section names in the handoff message
- If Path B MCP fails after one retry, fall back to Path A entirely — do not block on MCP issues
- If the designer iterates on a screen after delivery, the user re-places the file (Path A) or updates the artboard (Path B) and replies "ready" again — re-run coverage validation only for the changed screens
- `design_tool` in the manifest is informational — it helps the implement step select the right MCP adapter if multiple are configured

## References

- `docs/specs/spec.md`
- `docs/specs/*/screens/*.md`
- `docs/DESIGN.md`
- `docs/preview/`
- `kit/steps/phase-2/p2sp-02-plan.md`
