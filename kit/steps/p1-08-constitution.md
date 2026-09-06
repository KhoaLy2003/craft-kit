# Phase 1 · Step 8 — Constitution / AI Working Guideline

- **Agent/Skill**: `task` agent
- **Trigger**: `docs/architecture.md` exists and is `approved`
- **Inputs**: `docs/architecture.md`, `docs/DESIGN.md`, `docs/roadmap.md`
- **Outputs**: `docs/constitution.md` (or `CLAUDE.md` / `AGENTS.md` at project root if required by the agent harness)
- **Template**: `templates/08-constitution.md`
- **Gate**: `hard` — every Phase 2 step runs under this document's authority
- **Gate Summary**: *"The working rules for all Phase 2 code are set. Every AI agent on this project will follow these principles. Does anything need to change before we start building?"*
- **Notes**:
  - Every principle must be concrete enough to change at least one downstream decision — reject any principle that wouldn't alter a plan or diff if removed. Do not include personal workflow preferences; this file contains only rules that shape code and architecture output. The Amendment Procedure in the template must be filled in — governance without a change process creates a frozen document no one can update.
  - **For single-pass projects (solo developer, ≤ 15 S/M features):** the constitution can be minimal — 3–5 concrete rules rather than a comprehensive governance document. The amendment procedure section can be simple ("update this file directly; no approval process needed for a solo project"). All Phase 2 references to `docs/constitution.md` still apply.
