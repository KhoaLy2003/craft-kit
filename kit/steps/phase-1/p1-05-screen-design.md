# Phase 1 · Step 5 — Full Screen Design

## Overview

- **Purpose**: Identify every screen each in-scope feature needs, write per-screen briefs, send one combined designer handoff, accept designs back (file exports or an MCP design tool), and get sign-off on the full design set before architecture.
- **Agent/Skill**: orchestrator only. No subagent dispatch, no AI-generated designs.
- **Model**: `balanced`
- **Trigger**: Step 4 gate approved (`docs/roadmap.md` exists, all features `pending`).
- **Inputs**: `docs/roadmap.md`; `docs/prototype/prototype-brief.md`; `docs/DESIGN.md`; `docs/preview/`.
- **Outputs**:
  - `docs/specs/<feature-slug>/screens/<screen-name>.md` — one brief per screen (Phase A)
  - `docs/designs/<feature-slug>/` — image files (Path A), or `design-manifest.json` (Path B)
- **Template**: `kit/templates/spec-screen.md`
- **Gate**: `hard` — one sign-off covering all features; no per-feature partial approval.

## Scope

- **In**: Must and Should features only; screens (pages, modals, drawers, named views, empty/error states whose layout diverges); feature slugs; per-screen briefs; handoff; coverage validation.
- **Out**: Could and Won't features at initial build (re-enter this step for them later, see "Re-entry for new features"); generating or critiquing designs; creating handoff files (the handoff is a printed message only); architecture.

## Execution Rules

### Phase A — Screen list and briefs

1. Read `docs/roadmap.md`; take every Must and Should feature in build order. Derive each slug: lowercase kebab-case of the feature name. Phase 2 reuses these slugs for `docs/specs/<slug>/` and `docs/designs/<slug>/`.
2. **Skip the whole step** only if every feature has one simple screen already covered by `docs/preview/`: record the reason in the session log and wait for user confirmation. Never permitted if any feature has two or more non-trivial screens.
3. For each slug:
   - If `docs/designs/<slug>/` already holds design files or a valid `design-manifest.json`, record `skipped, designs_exist` and leave the feature out of the handoff. If the feature's one simple screen is covered by `docs/preview/` and the user confirms, record `skipped, preview_sufficient`.
   - Otherwise read `prototype-brief.md` and `DESIGN.md`, list every distinct screen with a kebab-case filename (`item-list`, `delete-confirm`), and write one brief per screen to `docs/specs/<slug>/screens/<screen-name>.md` from the template: fill sections 1, 2, 6, 7 (and 3–5 where the prototype brief already answers them); leave section 8 (Acceptance criteria) blank for Phase 2 Spec.

### Phase B — Designer handoff

Print this to the terminal, with the real grouped screen list. It is what the user sends to their designer; no file is created.

```
--- Designer Handoff: All Features ---

Share these files with your designer:
  docs/DESIGN.md                          <- design system (colors, typography, spacing, components)
  docs/prototype/prototype-brief.md       <- prototype screens and flows for context
  docs/specs/*/screens/*.md               <- one brief per screen (purpose, layout, states)

Screens to design:

  <Feature Name> (<feature-slug>)
    - <screen-name-1>
    - <screen-name-2>

Artboard/frame naming: use the screen names above exactly.
  Design tool (Figma, Sketch, Penpot, etc.): case-insensitive; hyphens and spaces are equivalent.
  File exports: <screen-name>.png (or .jpg / .webp / .pdf / .html)

When all designs are ready, reply "files" (exported images) or "mcp" (design tool with MCP access).
--------------------------------------
```

Wait for the reply, then follow Path A ("files") or Path B ("mcp").

### Phase C — Delivery paths

#### Path A — File exports

1. Tell the user to place files at `docs/designs/<feature-slug>/<screen-name>.png` (per feature) and reply "ready"; to skip a screen (fall back to `DESIGN.md` + `docs/preview/`), name it. Hard stop until "ready".
2. **Coverage validation**, per feature and per required screen:
   - File found → covered.
   - Missing, not declared → block; list all missing files across all features; wait.
   - Missing, declared skip → record as `design_md_fallback` in the session log with the reason.

   Repeat until every screen is covered or declared.

#### Path B — Design tool via MCP

1. Ask for the design file URL (Figma link, Penpot project URL, or whatever the MCP server uses to identify the file) and the tool name; the file must hold artboards for all features and the MCP connection must be active. If designers use separate files per feature, collect and verify each URL.
2. Attempt to read the file via MCP. On failure, report the error and offer fix-and-retry or Path A; after one failed retry, fall back to Path A for all remaining features.
3. **Coverage check**, per feature and per screen: find the matching artboard or frame (case-insensitive; hyphens = spaces). Found and readable → covered (`mcp`); otherwise add to the file-fallback list.
4. **Resolve fallbacks**: the user either fixes the artboard name or access and retries, or exports the file to `docs/designs/<feature-slug>/<screen-name>.png`. Repeat until none remain.
5. Write one manifest per feature (below) and verify each on disk by reading its first 5 lines.

##### Manifest schema

`docs/designs/<feature-slug>/design-manifest.json`:

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

- `design_url`: URL the MCP server uses to identify the design file.
- `design_tool`: `"figma"`, `"sketch"`, `"penpot"`, and so on; selects the MCP adapter at implement time.
- `status`: `"mcp"` (read via MCP at implement time), `"file_fallback"` (image file used instead), `"design_md_fallback"` (no design; use `DESIGN.md` + `docs/preview/` only).

Phase 2 resolves these statuses per screen under the Frontend dispatch contract in `kit/orchestrator-conventions.md`.

### Phase D — Hard gate

Gate summary, naming the decision and the delivery path:

- **Path A:** `> **Gate:** Full screen designs for N features are approved (N files in place across M features; X design_md_fallback screens listed). Changing them after this point means re-opening this step before implementation.`
- **Path B:** `> **Gate:** Full screen designs for N features are approved (design file <url>; N artboards readable, X file fallbacks, Y design_md_fallback screens across M features). Changing them after this point means re-opening this step before implementation.`

## Artifact Rules

- Per-screen briefs are written by the orchestrator from the template.
- Path A image files are user-provided and never modified by the orchestrator or any agent.
- Path B manifests are written by the orchestrator; image files exist alongside for file-fallback screens.
- Record `design_path: file | mcp`, `design_url`/`design_tool` (Path B), and every `design_md_fallback` screen as notes in the session log.

## Completion Criteria

- [ ] Every Must and Should feature has a slug and a required-screen list; briefs written to `docs/specs/<slug>/screens/`.
- [ ] Handoff printed; user replied "files" or "mcp".
- [ ] Every required screen across every feature is accounted for: file, MCP artboard, file fallback, or `design_md_fallback`.
- [ ] Path B: `design-manifest.json` verified on disk for each feature.
- [ ] User signed off at the hard gate.

## Transition Rules

Next: Step 6 — Architecture, only after the gate. Skippable per the Phase A skip condition.

## Exceptions / Special Cases

- **Designer iterates after delivery**: the user re-places the file (Path A) or updates the artboard (Path B) and replies "ready"; re-validate only the changed screens.
- **Partial delivery**: accept features as they arrive and record coverage per feature, but do not close the gate until every feature passes.
- **Re-opening after approval**: record it in the session log and repeat from Phase A for the affected features only; Step 6 cannot proceed until the gate is re-approved.
- **Re-entry for new features** (Phase 3 releases, or features added after Phase 1 that have no designs): run Phases A–D again for the given feature set only, in place of "every Must and Should feature". The existing `docs/designs/<slug>/` skip rule and the one-hard-gate-for-the-batch rule apply unchanged, and the same handoff covers all the new features at once. Write each feature's behavior-only spec first (Phase 2 Step 1, "Spec mode"), because the briefs need its `## Screens` list; Phase 2 then resumes at Step 2 (Plan) for each feature. Log the re-entry under `docs/phase-1-session.md` as `Step 5 (re-entry: <release-slug>)`. The Step 6 hand-off in Transition Rules does not apply.
