# Phase 1 · Step 4 — Product Design

## Overview

- **Purpose**: Establish the visual language, component tokens, and UI patterns for the product by either importing an existing design system file or generating one from the prototype.
- **Agent/Skill**: General-purpose agent (AI path only — skipped entirely if `docs/DESIGN.md` already exists or is downloaded by the user)
- **Trigger**: `docs/prototype/` folder exists and prototype is walkable.
- **Inputs**:
  - Always: `docs/prototype/`, `docs/idea-brief.md`
  - Import path only: `docs/DESIGN.md` (user's downloaded file saved at the standard location)
- **Outputs**:
  - `docs/DESIGN.md`
  - Finalized mock screens inside `docs/prototype/`
- **Template**: `templates/05-design-system.md`
- **Gate**: `hard` (AI path only) — last checkpoint before scope and technical direction are locked in.

## Scope

### In Scope

- Checking whether `docs/DESIGN.md` already exists before doing any other work.
- Import path: accepting and verifying a user-supplied or downloaded `docs/DESIGN.md` without modification.
- AI path: dispatching a general-purpose agent to produce color tokens, typography, components, and finalized mock screens from the prototype.
- Setting `Source: ai-generated` on the AI-generated output.

### Out of Scope

- Running any agent on the import path — the file is used as-is.
- Modifying the contents of a user-supplied `docs/DESIGN.md`.
- Any work that belongs to Step 5 (Roadmap) or later.

### Scope Boundary

> Step 4 has two mutually exclusive paths: Import and AI. The pre-step check determines which path runs — or whether the step is skipped entirely. Never run the AI path if a `docs/DESIGN.md` file is found and has content.

## Execution Rules

- **Pre-step check — run before doing anything else:**
  1. Check whether `docs/DESIGN.md` already exists at the project root (glob or bash check). Also check the kickoff form for a referenced design file.
  2. **If `docs/DESIGN.md` is found and has content → skip Step 4 entirely.** Mark Step 4 as `complete` in the session log. The file is used as-is in Steps 5, 6, and 7. Advance immediately to Step 5. Do not run any agent.
  3. **If no `docs/DESIGN.md` is found** → present the two free sources and tell the user where to save one:
     *"No `DESIGN.md` found. You can (a) download one and save it to `docs/DESIGN.md` in the project folder, or (b) let the AI designer create one from the prototype."*
     - **getdesign.md** — https://getdesign.md/design-md (73+ analyses of Stripe, Linear, Notion, etc.; free to download)
     - **freedesignmd.com** — https://freedesignmd.com (121+ free design systems; no login, no paywall)

- **Import path (user downloads a file):**
  - User saves chosen file to `docs/DESIGN.md` and confirms ("downloaded" or similar).
  - Orchestrator checks file exists and has content — do not ask for the path.
  - If found: mark Step 4 complete and advance to Step 5.
  - If not found: tell the user and wait.

- **AI path (user chooses AI generation):**
  - Dispatch your general-purpose agent (or a dedicated visual design agent if available) to produce tokens, components, and finalized mocks from the prototype.
  - Set `Source: ai-generated` in the output.
  - Write result to `docs/DESIGN.md`.
  - Present the Gate Summary and wait for user approval before advancing.

## Artifact Rules

- **Artifact**: `docs/DESIGN.md`
- On the import path: file is accepted as-is; no agent writes to it.
- On the AI path: the agent writes color tokens, typography, component definitions, and finalized mock screens.
- `Source: ai-generated` must be set in the file when produced by the AI path.
- **Status / approval condition**: Import path — gate is satisfied by the user having chosen and confirmed the file; no additional approval needed. AI path — present the Gate Summary and wait for explicit user approval before advancing.

## Completion Criteria

The step is considered complete when:

- [ ] Pre-step check has run.
- [ ] Either `docs/DESIGN.md` was found on disk (import path) or the user confirmed a downloaded file (import path) or the AI path agent wrote the file and the user approved it (AI path).
- [ ] Step 4 is marked `complete` in the session log.

## Transition Rules

### Before Advancing

- Confirm `docs/DESIGN.md` exists and has content.
- **AI path only** — present the Gate Summary before advancing:
  *"The design direction is set — colors, typography, and components are locked. Changing direction after this is expensive. Does this match what you want the product to look and feel like?"*
- Import path: no additional gate approval needed; advance immediately once file is confirmed.

### Next Step

- **Default**: Step 5 — Roadmap
- **Optional skip**: No
- **User decision required**: Yes (AI path) — user must approve the generated design before advancing. No additional decision needed on the import path.

### Transition Record

- **Record**: `docs/<project>/phase-1-session.md`
- **Values**: `complete` / `skipped`

## Exceptions / Special Cases

- If the user confirms a download but the file is not found at `docs/DESIGN.md`, tell the user and wait — do not assume a different path or proceed without confirmation.
- A dedicated visual design agent may be substituted for the general-purpose agent on the AI path if one is available in the session.
- The hard gate applies **only** on the AI path. On the import path, the user's choice of file serves as the approval.

## References

- `templates/05-design-system.md`
- https://getdesign.md/design-md (getdesign.md — 73+ free design system analyses)
- https://freedesignmd.com (freedesignmd.com — 121+ free design systems)
