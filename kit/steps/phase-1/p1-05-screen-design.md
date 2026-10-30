# Phase 1 · Step 5 — Full Screen Design

## Overview

- **Purpose**: Identify every screen each in-scope feature needs, write per-screen briefs, send one combined designer handoff, accept designs back (file exports or an MCP design tool), and get sign-off on the full design set before architecture.
- **Agent/Skill**: orchestrator only. No subagent dispatch, no AI-generated designs.
- **Model**: `balanced`
- **Trigger**: Step 4 gate approved (`docs/backlog.json` and `docs/roadmap.md` exist, all features `pending`).
- **Inputs**: `docs/backlog.json`; `docs/roadmap.md` (build order); `docs/prototype/prototype-brief.md`; `docs/DESIGN.md`; `docs/preview/`.
- **Outputs**:
  - `docs/specs/<feature-slug>/screens/<screen-name>.md` — one brief per screen (Phase A)
  - `docs/designs/<feature-slug>/` — image files (Path A), or `design-manifest.json` (Path B)
- **Template**: `kit/templates/spec-screen.md`
- **Gate**: `hard` — one sign-off covering all features; no per-feature partial approval.

> **No designer?** At the "files"/"mcp" reply (or the Path A "ready" prompt) declare every screen skipped; each is recorded as `design_md_fallback` and Phase 2 builds from `docs/DESIGN.md` + `docs/preview/`. Briefs are still written.

## Scope

- **In**: Must and Should features only; screens (pages, modals, drawers, named views, empty/error states whose layout diverges); feature slugs; per-screen briefs; handoff; coverage validation. **Should rule:** designs cover Should features so later cycles are ready, but `scope: all` builds Must only.
- **Out**: Could and Won't features at initial build (re-enter this step for them later, see "Re-entry for new features"); generating or critiquing designs; creating handoff files (the handoff is a printed message only); architecture.

## Execution Rules

### Phase A — Screen list and briefs

1. Read the feature list from `docs/backlog.json`; take every feature with priority Must or Should, in build order from `docs/roadmap.md` Section 3. Derive each slug: lowercase kebab-case of the feature name; if two features give the same slug, append the later one's ID (`login-f07`). A slug is never changed once a folder uses it. Phase 2 reuses these slugs for `docs/specs/<slug>/` and `docs/designs/<slug>/`.
2. **Skip the whole step** only if every feature has one simple screen covered by `docs/preview/`: log the reason and wait for user confirmation. Never if any feature has two or more non-trivial screens.
3. For each slug:
   - If `docs/designs/<slug>/` already holds design files or a valid `design-manifest.json`, record `skipped, designs_exist` and leave the feature out of the handoff. If the feature's one simple screen is covered by `docs/preview/` and the user confirms, record `skipped, preview_sufficient`.
   - Otherwise read `prototype-brief.md` and `DESIGN.md`, list every distinct screen with a kebab-case filename (`item-list`, `delete-confirm`), and write one brief per screen to `docs/specs/<slug>/screens/<screen-name>.md` from the template: fill sections 1, 2, 6, 7 (and 3–5 where the prototype brief already answers them); leave section 8 (Acceptance criteria) blank for Phase 2 Spec. Section 3 (Entry and Exit) of each brief feeds `docs/flows.md` in Step 6; fill it fully.

### Phase B — Designer handoff

Print this (no file), with the real grouped screen list; the user sends it to their designer.

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

Read `kit/guides/design-mcp.md` and follow it (design file URL, MCP read, coverage check, fallbacks, one `design-manifest.json` per feature, verified on disk). After one failed MCP retry, fall back to Path A for the remaining features.

### Phase D — Hard gate

Gate summary, naming the decision and the delivery path:

- **Path A:** `> **Gate:** Full screen designs for N features are approved (N files in place across M features; X design_md_fallback screens listed). Changing them after this point means re-opening this step before implementation.`
- **Path B:** `> **Gate:** Full screen designs for N features are approved (design file <url>; N artboards readable, X file fallbacks, Y design_md_fallback screens across M features). Changing them after this point means re-opening this step before implementation.`

## Artifact Rules

- The orchestrator writes briefs and manifests; Path A image files are user-provided and never modified.
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
- **Partial delivery**: record coverage per feature as it arrives; the gate closes only when every feature passes.
- **Re-opening after approval**: record it in the session log and repeat from Phase A for the affected features only; Step 6 cannot proceed until the gate is re-approved.
- **Re-entry for new features** (Phase 3 releases, or features added after Phase 1 that have no designs): run Phases A–D for the given feature set only; the skip rule and the single batch gate apply unchanged, with one handoff for all. Each feature's `## Screens` list comes from `docs/iterations/<release-slug>/design.md` (`kit/phase-3-iterate.md` Step 3) for a Phase 3 release (Phase 2 Step 1 then only checks its slice), or, for a feature added outside Phase 3, from its behavior-only spec written first (Phase 2 Step 1, "Spec mode"), after which Phase 2 resumes at Step 2 (Plan), where Step 1's Data & Flow Impact rule applies the change to `docs/flows.md`. Log the re-entry under `docs/phase-1-session.md` as `Step 5 (re-entry: <release-slug>)`. The Step 6 hand-off in Transition Rules does not apply.
