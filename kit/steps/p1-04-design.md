# Phase 1 · Step 4 — Product Design

- **Agent/Skill**: Your general-purpose agent (AI path only — skipped entirely if `docs/DESIGN.md` already exists)
- **Trigger**: `docs/prototype/` folder exists and prototype is walkable
- **Inputs**:
  - Always: `docs/prototype/`, `docs/idea-brief.md`
  - Import path only: `docs/DESIGN.md` (user's downloaded file saved at the standard location)
- **Outputs**: `docs/DESIGN.md` + finalized mock screens inside `docs/prototype/`
- **Template**: `templates/05-design-system.md`
- **Gate**: `hard` — last checkpoint before scope and technical direction are locked in
- **Gate Summary**: *"The design direction is set — colors, typography, and components are locked. Changing direction after this is expensive. Does this match what you want the product to look and feel like?"*
- **Notes**:

  **Pre-step check — run before doing anything else:**

  1. Check whether `docs/DESIGN.md` already exists at the project root (glob or bash check). Also check the kickoff form for a referenced design file.

  2. **If `docs/DESIGN.md` is found and has content → skip Step 4 entirely.**
     Mark Step 4 as `complete` in the session log. The file is used as-is in Steps 5, 6, and 7. Advance immediately to Step 5. Do not run any agent.

  3. **If no `docs/DESIGN.md` is found** → present the two free sources and tell the user where to save one:
     *"No `DESIGN.md` found. You can (a) download one and save it to `docs/DESIGN.md` in the project folder, or (b) let the AI designer create one from the prototype."*
     - **getdesign.md** — https://getdesign.md/design-md (73+ analyses of Stripe, Linear, Notion, etc.; free to download)
     - **freedesignmd.com** — https://freedesignmd.com (121+ free design systems; no login, no paywall)
     - Download chosen → user saves to `docs/DESIGN.md`; user confirms ("downloaded" or similar). Orchestrator checks file exists and has content — do not ask for the path. If found: mark Step 4 complete and advance to Step 5. If not found: tell the user and wait.
     - AI chosen → dispatch your general-purpose agent (or a dedicated visual design agent if available) to produce tokens, components, and finalized mocks from the prototype. Set `Source: ai-generated`. Write to `docs/DESIGN.md`.

  **Hard gate applies only on the AI path** — when the agent produces the design, present the Gate Summary and wait for approval before advancing. On the import path (DESIGN.md already exists or downloaded), the gate is satisfied by the user having chosen to use that file; no additional approval needed.
