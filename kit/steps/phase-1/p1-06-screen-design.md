# Phase 1 · Step 6 — Full Screen Design

## Overview

- **Purpose**: Identify every screen each in-scope feature requires, write per-screen briefs, emit one combined designer handoff message, accept designs back via file exports or an MCP-connected design tool, and obtain user sign-off on the full design set before architecture begins.
- **Agent/Skill**: Orchestrator only — no subagent dispatch; no AI generation of designs
- **Model**: `balanced`
- **Trigger**: Step 5 gate approved — `docs/roadmap.md` exists with all features `Status: pending`.
- **Inputs**:
  - `docs/roadmap.md` — feature list with Must / Should / Could / Won't priorities
  - `docs/prototype/prototype-brief.md` — screens, flows, mock data
  - `docs/DESIGN.md` — approved design system
  - `docs/preview/` — HTML UI preview from Step 4
  - `kit/templates/spec-screen.md` — per-screen brief template
- **Outputs**:
  - `docs/specs/<feature-slug>/screens/<screen-name>.md` — per-screen brief per feature (Phase A)
  - `docs/designs/<feature-slug>/` — image files per feature (Path A), or
  - `docs/designs/<feature-slug>/design-manifest.json` — design tool frame mappings per feature (Path B)
- **Template**: `kit/templates/spec-screen.md` (used for per-screen briefs in Phase A; filled by the orchestrator, not an agent)
- **Gate**: `hard` — user sign-off on the full design set is required before Step 7 (Architecture) begins.

## Scope

### In Scope

- Identifying every distinct screen each Must and Should feature requires — pages, modals, drawers, named view states, and any state (empty, error) whose layout diverges meaningfully from the default
- Assigning feature slugs (kebab-case of the roadmap feature name); these slugs are reused throughout Phase 2
- Writing per-screen briefs to `docs/specs/<slug>/screens/<screen-name>.md` using `kit/templates/spec-screen.md`
- Emitting one combined designer handoff message covering all in-scope features
- Accepting designs back via file exports (Path A) or an MCP-connected design tool (Path B)
- Validating coverage per feature; recording fallback decisions in the session log and manifests

### Out of Scope

- Could / Nice-to-Have and deferred features — these receive a Phase 3 Design Sprint if designs are needed later
- Generating, critiquing, or revising screen designs
- Creating new document files for the designer — the handoff is a printed terminal message only
- Architecture or technical decisions — that is Step 7
- Running partial gates — the hard gate covers all features together; no per-feature partial approval

### Scope Boundary

> This step covers all Must and Should features in `docs/roadmap.md`. Nice-to-Have (Could) and Won't features are excluded — they use the Phase 3 Design Sprint. The hard gate requires user sign-off on the complete design set; the step does not close until every in-scope feature's screens are accounted for.

## Execution Rules

### Phase A — Build combined screen list and write briefs

1. Read `docs/roadmap.md`. Extract all features with priority **Must** or **Should** in build order. For each feature, derive its slug: convert the feature name to lowercase kebab-case (spaces and punctuation → hyphens; strip special characters). This is the canonical slug Phase 2 will use for `docs/specs/<slug>/` and `docs/designs/<slug>/`.
2. For each feature slug:
   - Check whether `docs/designs/<slug>/` already contains design files or a valid `design-manifest.json`. If so, record `status: skipped, reason: designs_exist` in the session log and exclude this feature from the handoff.
   - Otherwise: read `docs/prototype/prototype-brief.md` and `docs/DESIGN.md`. Identify every distinct screen the feature requires — pages, modals, drawers, named view states, and any state (empty, error) whose layout diverges meaningfully from the default. Build the required-screen list with a suggested filename per screen (lowercase kebab-case, e.g. `item-list`, `item-detail`, `delete-confirm`).
   - Write a per-screen brief for each screen to `docs/specs/<slug>/screens/<screen-name>.md` using `kit/templates/spec-screen.md`. Fill the Identity, Purpose, Layout & Structure, and States sections from the prototype brief and roadmap feature description. Leave the Acceptance Criteria section blank — those are written in Phase 2 Step 1 (Spec).
3. **Skip condition (entire step)**: if every remaining feature has only one simple screen already covered by `docs/preview/`, record the reason in the session log and wait for user confirmation before skipping. Not permitted if any feature has two or more non-trivial screens.

---

### Phase B — Emit combined designer handoff message

Print the following to the terminal (fill in the actual grouped screen list from Phase A). This is what the user sends to their designer — no file is created.

```
--- Designer Handoff: All Features ---

Share these files with your designer:
  docs/DESIGN.md                          ← design system (colors, typography, spacing, components)
  docs/prototype/prototype-brief.md       ← prototype screens and flows for context
  docs/specs/*/screens/*.md               ← one brief per screen (purpose, layout, states)

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
> Provide the design file URL from your design tool (e.g. a Figma file link, a Penpot project URL, or the URL your MCP server uses to identify the file). The file should contain artboards for all features. Also name the tool (e.g. "figma", "sketch", "penpot"). Confirm your MCP connection is active.

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
Gate Summary — Full Screen Design (file exports)
N files in place across M features. [X DESIGN.md-fallbacks listed]
Full screen designs for N features are approved. Changing them after this point means
re-opening this step before implementation.
```

**Path B:**
```
Gate Summary — Full Screen Design (design tool via MCP)
Design file: <url> · N artboards readable · X file-fallbacks · Y DESIGN.md-fallbacks across M features
Full screen designs for N features are approved. Changing them after this point means
re-opening this step before implementation.
```

## Artifact Rules

- **No new documents created by this step** — the handoff is a printed terminal message only
- **Per-screen briefs** (`docs/specs/<slug>/screens/<screen-name>.md`): written from `kit/templates/spec-screen.md` by the orchestrator in Phase A; Identity, Purpose, Layout & Structure, and States sections filled; Acceptance Criteria left blank for Phase 2 Step 1
- **Path A**: `docs/designs/<feature-slug>/` image files; user-provided; never modified by the orchestrator or any agent
- **Path B**: `docs/designs/<feature-slug>/design-manifest.json` written per feature by the orchestrator; image files also present for file-fallback screens
- DESIGN.md-fallback decisions recorded in session log (per `kit/session-logging.md`)
- **Status / approval condition**: Hard gate — user explicitly approves after coverage passes for all features

## Completion Criteria

The step is considered complete when:

- [ ] All Must and Should features read from `docs/roadmap.md`; feature slugs derived
- [ ] For each feature: every required screen identified; per-screen briefs written to `docs/specs/<slug>/screens/`
- [ ] Designer handoff message printed to terminal
- [ ] User has replied with delivery path ("files" or "mcp")
- [ ] Every required screen across every feature accounted for: file, MCP artboard, file-fallback, or DESIGN.md-fallback
- [ ] Path B: `docs/designs/<slug>/design-manifest.json` written and verified on disk for each feature (read first 5 lines)
- [ ] Hard gate passed — user has explicitly signed off on the complete design set

## Transition Rules

### Before Advancing

- All screens across all features accounted for with no unresolved gaps
- Path B: manifests verified on disk (read first 5 lines of each)
- Hard gate passed — gate summary: *"Full screen designs for N features are approved. Changing them after this point means re-opening this step before implementation."*

### Next Step

- **Default**: Step 7 — Tech Stack Research and Architecture Decision
- **Optional skip**: Yes — all features have one simple screen already covered by `docs/preview/`; requires user confirmation and session log entry
- **User decision required**: Yes — hard gate approval required

### Transition Record

- **Record**: `docs/<project>/phase-1-session.md`
- **Values**: `complete` / `skipped`
- **Additional fields**: `design_path: file | mcp`, `design_url: <url>` (Path B only), `design_tool: <tool>` (Path B only), `features_covered: N`, `features_skipped: N`

## Exceptions / Special Cases

- **Features with no distinct screens**: if a feature has exactly one simple screen already covered by `docs/preview/` and the user confirms it needs no additional design work, record `status: skipped, reason: preview_sufficient` in the session log for that feature and exclude it from the handoff. The entire step may only be skipped when this applies to every in-scope feature.
- **Path B MCP failure**: if MCP fails after one retry, fall back to Path A for all remaining features — do not block on MCP issues
- **Designer iterates post-delivery**: user re-places the file (Path A) or updates the artboard (Path B) and replies "ready" again — re-run coverage validation only for the changed screens
- **Multiple design files**: if the designer uses separate files per feature, collect all URLs in B1 and verify each separately; write per-feature manifests with the correct `design_url` for each
- **Partial delivery**: designer delivers some features before others — accept partial deliveries and record coverage per feature, but do not close the gate until all features pass
- **User wants to re-open after approval**: record the re-open in the session log; repeat from Phase A for the affected features only; Step 7 cannot proceed until the gate is re-approved

## References

- `docs/roadmap.md`
- `docs/prototype/prototype-brief.md`
- `docs/DESIGN.md`
- `docs/preview/`
- `kit/templates/spec-screen.md`
- `kit/steps/phase-1/p1-05-roadmap.md`
- `kit/steps/phase-1/p1-07-architecture.md`
- `kit/steps/phase-2/p2-ds-batch-design.md` (Path A/B wording adapted from this step)
