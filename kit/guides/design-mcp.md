# Screen designs via an MCP design tool (Path B)

> Read only when the user replies "mcp" at the Phase 1 Step 5 designer handoff (`kit/steps/phase-1/p1-05-screen-design.md`). Path A (file exports) never needs it.

## Path B — Design tool via MCP

1. Ask for the design file URL and tool name (one URL per file if designers use separate files); the MCP connection must be active.
2. Attempt to read the file via MCP. On failure, report the error and offer fix-and-retry or Path A; after one failed retry, fall back to Path A for all remaining features.
3. **Coverage check**, per feature and per screen: find the matching artboard or frame (case-insensitive; hyphens = spaces). Found and readable → covered (`mcp`); otherwise add to the file-fallback list.
4. **Resolve fallbacks**: the user either fixes the artboard name or access and retries, or exports the file to `docs/designs/<feature-slug>/<screen-name>.png`. Repeat until none remain.
5. Write one manifest per feature (below) and verify each on disk by reading its first 5 lines.

### Manifest schema

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

- `design_tool`: `figma`, `sketch`, `penpot`, …; selects the MCP adapter at implement time.
- `status`: `"mcp"` (read via MCP at implement time), `"file_fallback"` (image file used instead), `"design_md_fallback"` (no design; use `DESIGN.md` + `docs/preview/` only).

Phase 2 resolves these statuses per screen under the Design dispatch contract in `kit/orchestrator-conventions.md`.
