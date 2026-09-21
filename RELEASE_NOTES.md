## Phase 2 now bridges spec to designer before implementation begins

**Step 1b — Screen Design** is a new step inserted between Spec and Plan in both Phase 2 tracks (Single-Pass and Standard Loop).

### What it does

- After the spec is approved, the orchestrator prints a ready-to-share **designer handoff message** listing the existing files the designer needs (`docs/DESIGN.md` + per-screen spec files) and the exact screen names to design — no new document is created.
- When designs are ready, the user replies `"files"` or `"mcp"`:
  - **Path A — File exports:** place PNG/JPG/WebP/PDF/HTML files in `docs/designs/<feature-slug>/`; the orchestrator validates coverage per screen.
  - **Path B — Design tool via MCP:** provide a URL for any MCP-connected design tool (Figma, Sketch, Penpot, etc.); the orchestrator verifies the connection, checks artboard coverage, and writes a `design-manifest.json` mapping each screen to its status (`mcp` / `file_fallback` / `design_md_fallback`).
- The implement step reads the manifest at dispatch time to give the `frontend-developer` agent the right visual reference per screen — MCP artboard query, image file, or DESIGN.md fallback.

### Skip condition

Single-screen features already covered by `docs/preview/` can skip Step 1b. The step earns its cost on features with 2+ non-trivial screens.
