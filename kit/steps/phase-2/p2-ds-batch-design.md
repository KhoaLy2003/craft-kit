# Phase 2 (Design Sprint) · Step DS-2 — Batch Screen Design

## Overview

- **Purpose**: Identify all required screens across every specced feature in the current sprint; emit one combined designer handoff message; accept designs back via file exports (Path A) or an MCP-connected design tool (Path B); validate full coverage before implementation begins on any feature.
- **Skill/Agent**: Orchestrator only — no agent dispatch; no AI generation
- **Model**: none — screen identification, handoff message, coverage check, and manifest writing only
- **Trigger**: Design Sprint DS-1 complete — every pending feature has `docs/specs/<slug>/spec.md`
- **Inputs**:
  - `docs/specs/<feature-slug>/spec.md` — per-feature acceptance criteria and screen list (one per feature)
  - `docs/specs/<feature-slug>/screens/*.md` — filled spec-screen files where produced in DS-1
  - `docs/DESIGN.md` — approved design system
- **Outputs**:
  - `docs/designs/<feature-slug>/` — image files per feature (Path A), or
  - `docs/designs/<feature-slug>/design-manifest.json` — design tool frame mappings per feature (Path B), or both when Path B has file fallbacks
- **Template**: none
- **Gate**: `hard` — all required screens across all features covered before any feature begins Step 2 (Plan)

## Scope

### In Scope

- Identifying every distinct screen each feature requires, grouped by feature
- Skipping features whose `docs/designs/<slug>/` already contains validated coverage
- Emitting one combined designer handoff message covering all outstanding features
- Accepting designs back via file exports or an MCP-connected design tool
- Validating coverage per feature; recording fallback decisions in session log and manifests

### Out of Scope

- Generating, critiquing, or revising screen designs
- Creating new document files for the designer — the handoff is a printed terminal message only
- Implementation planning — that is Step 2 (Plan) in `kit/phase-2-feature-dev.md`
- Running partial gates — the hard gate covers all features together; no per-feature partial approval

### Scope Boundary

> This step covers all features included in the current Design Sprint. Each feature's coverage is
> validated independently; the hard gate waits until every feature passes. Features that already
> have validated designs in `docs/designs/<slug>/` are excluded and recorded as skipped.

## Execution Rules

### Phase A — Build combined screen list

1. Enumerate all feature slugs from `docs/roadmap.md` (status: pending at sprint start).
2. For each feature slug:
   - Check whether `docs/designs/<slug>/` already contains design files or a valid `design-manifest.json`. If so, record `status: skipped, reason: designs_exist` in the session log and exclude this feature from the handoff.
   - Otherwise: read `docs/specs/<slug>/spec.md` and any `docs/specs/<slug>/screens/*.md`. Identify every distinct screen the feature requires — pages, modals, drawers, named view states, and any state (empty, error) whose layout diverges meaningfully from the default. Build the required-screen list with a suggested filename per screen.
3. **Skip condition (entire step)**: if every remaining feature has only one simple screen already covered by `docs/preview/`, record the reason in the session log and advance. Not permitted if any feature has 2+ non-trivial screens.

---

### Phase B — Emit combined designer handoff message

Print the following to the terminal (fill in the actual grouped screen list from Phase A). This is what the user sends to their designer — no file is created.

```
--- Designer Handoff: All Features ---

Share these files with your designer:
  docs/DESIGN.md                       ← design system (colors, typography, spacing, components)
  docs/specs/*/screens/*.md            ← one brief per screen (purpose, content, layout, states)
  [if no screen files exist for a feature: docs/specs/<feature-slug>/spec.md]

Screens to design:

  <Feature Name> (<feature-slug>)
    - <screen-name-1>
    - <screen-name-2>
    ...

  <Feature Name> (<feature-slug>)
    - <screen-name-1>
    ...

Artboard/frame naming: use the screen names above exactly.
  Design tool (Figma, Sketch, Penpot, etc.): case-insensitive; hyphens and spaces are equivalent.
  File exports: <screen-name>.png (or .jpg / .webp / .pdf / .html)

When all designs are ready, reply "files" (exported images) or "mcp" (design tool with MCP access).
--------------------------------------
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
  docs/designs/<feature-slug>/<screen-name>.png    (repeat per feature)
  ...
Reply "ready" when done. To skip a screen (fall back to DESIGN.md + preview/), name it.
```

#### A2 — Wait for "ready"

Hard stop.

#### A3 — Coverage validation

For each feature, for each required screen, check `docs/designs/<feature-slug>/` for the file:
- **Found** → covered
- **Missing, not declared** → block; list all missing files across all features; wait
- **Missing, declared skip** → record as DESIGN.md-fallback in session log with reason

Repeat until all screens across all features are covered or declared.

---

### Path B — Design tool via MCP

#### B1 — Get design file URL

Ask:
> Provide the design file URL from your design tool (e.g. a Figma file link, a Penpot project URL, or the URL your MCP server uses to identify the file). The file should contain artboards for all features in this sprint. Also name the tool (e.g. "figma", "sketch", "penpot"). Confirm your MCP connection is active.

#### B2 — Verify MCP connection

Attempt to read the design file via MCP.
- Succeeds → B3
- Fails → report the error; offer: fix and retry, or fall back to Path A. Wait.

#### B3 — Frame/artboard coverage check

For each feature, for each required screen, find the matching artboard or frame in the design file (case-insensitive; hyphens = spaces).
- Found and readable → covered (mcp)
- Not found or unreadable → add to file-fallback list

#### B4 — Resolve fallbacks

For each file-fallback screen: user either fixes the artboard name/access in their design tool and retries, or exports and places the file at `docs/designs/<feature-slug>/<screen-name>.png`. Repeat until all fallbacks are resolved.

#### B5 — Write manifests

For each feature write `docs/designs/<feature-slug>/design-manifest.json`:

```json
{
  "design_url": "https://...",
  "design_tool": "figma",
  "screens": [
    { "screen": "item-list", "frame_name": "Item List", "status": "mcp" },
    { "screen": "item-detail", "status": "file_fallback", "file": "item-detail.png" }
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
Gate Summary — Batch Screen Design (file exports)
N files in place across M features. [X DESIGN.md-fallbacks listed]
Approve to begin implementation on any feature.
```

**Path B:**
```
Gate Summary — Batch Screen Design (design tool via MCP)
Design file: <url> · N artboards readable · X file-fallbacks · Y DESIGN.md-fallbacks across M features
Approve to begin implementation on any feature.
```

## Artifact Rules

- **No new documents created by this step** — the handoff is a printed terminal message only
- **Path A**: `docs/designs/<feature-slug>/` image files; user-provided; never modified by orchestrator or agents
- **Path B**: `docs/designs/<feature-slug>/design-manifest.json` written per feature by the orchestrator; image files also present for file-fallback screens
- DESIGN.md-fallback decisions recorded in session log (per `kit/session-logging.md`)
- **Status / approval condition**: Hard gate — user explicitly approves after coverage passes for all features

## Completion Criteria

- [ ] Combined required-screen list built across all features (or skips recorded per feature)
- [ ] Designer handoff message printed to terminal
- [ ] User has replied with delivery path ("files" or "mcp")
- [ ] Every required screen across every feature accounted for: file, MCP artboard, file-fallback, or DESIGN.md-fallback
- [ ] Path B: manifests written and verified on disk for each feature (read first 5 lines)
- [ ] Hard gate passed

## Transition Rules

### Before Advancing

- All screens across all features accounted for with no unresolved gaps
- Path B: manifests verified on disk (read first 5 lines of each)
- Hard gate passed — gate summary: *"All screen designs are in place for all M features. Approve to begin implementation."*

### Next Step

- **Default**: implementation may begin on any feature via `kit/phase-2-feature-dev.md`, starting at Step 2 (Plan). Steps 1 and 1b auto-skip.
- **Optional skip**: Yes — all features have one simple screen covered by `docs/preview/`; requires user confirmation and session log entry
- **User decision required**: Yes — hard gate approval required

### Transition Record

- **Record**: session log (per `kit/session-logging.md`)
- **Values**: `complete` / `skipped` (one entry for the entire DS-2 batch)
- **Additional fields**: `design_path: file | mcp`, `design_url: <url>` (Path B only), `design_tool: <tool>` (Path B only), `features_covered: N`, `features_skipped: N`

## Exceptions / Special Cases

- **Features with no screen files**: if `docs/specs/<slug>/screens/*.md` does not exist for a feature, point the designer to the relevant sections in `docs/specs/<slug>/spec.md` — include section names in the handoff message
- **Path B MCP failure**: if MCP fails after one retry, fall back to Path A for all remaining features — do not block on MCP issues
- **Designer iterates post-delivery**: user re-places the file (Path A) or updates the artboard (Path B) and replies "ready" again — re-run coverage validation only for the changed screens
- **Multiple design files**: if the designer uses separate files per feature, collect all URLs in B1 and verify each separately; write per-feature manifests with the correct `design_url` for each
- **Partial delivery**: designer delivers some features before others — accept partial deliveries and record coverage per feature, but do not close the gate until all features pass

## References

- `docs/roadmap.md`
- `docs/specs/<feature-slug>/spec.md` (per feature)
- `docs/specs/<feature-slug>/screens/*.md` (per feature)
- `docs/DESIGN.md`
- `docs/preview/`
- `kit/phase-2-design-sprint.md`
- `kit/steps/phase-2/p2-02-plan.md`
