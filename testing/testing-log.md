# Kit Testing Log

Working document for all kit changes made during test runs.
Updated immediately when a kit change is made — before proceeding to the next step.
Round result metadata (PASS/FAIL, issue counts) is recorded in `testing/kit-testing-summary.md` only when a round closes.

---

## Open Issues

Issues found but not yet fixed — carried across rounds until resolved.

| # | Issue | Round found | Impact | Status |
|---|---|---|---|---|
| Open 1 | No way to skip per-task review in `subagent-driven-development` — results in 3 review layers when kit intent is 1 | Round 01 | Medium — cost/overhead | Open |
| Open 2 | Agent write failures add wall-clock overhead | Round 02 | Low (non-blocking) | **Fixed Round 03** — Issue 18 fail-fast write instruction eliminates retry spiral |
| 26 | Step 3 (Tech Research) removed; research absorbed into Step 7 (now Step 6 Architecture); Steps 4–9 renumbered to 3–8 | Refactor | Medium — structural workflow change | Fixed |
| 28 | Step 1 idea-brief written before clarifying questions were answered | Round 04 | Medium — rework + session log error | **Fixed** — `kit/steps/p1-01-ideation.md` + `kit/phase-1-checklist.md` Step 1: [BLOCK] added; Q&A-before-artifact rule explicit |
| 29 | No file-content preview before marking a step complete; syntax errors go unnoticed | Round 04 | Low — cosmetic in this case; potentially higher risk | **Fixed** — `kit/orchestrator-conventions.md` item 7 + Universal section in both `phase-1-checklist.md` and `phase-2-checklist.md` |
| 30 | Step 4 DESIGN.md auto-skip only checks `PROJECT_ROOT` and `docs/` — a file placed one directory up (round staging level) is not detected; tester must manually copy or place at project root | Round 05 | Low — causes confusion; check fails silently | Open |
| 31 | Todo system auto-promotes next step past a blocked step even when the next step has an undeclared dependency on the blocked step's output; reminder fires spuriously | Round 05 | Low — workflow confusion, no artifact harm | Open |
| 32 | E2E testing requires Supabase provisioning (migration + users + seed data) before tests can run. Kit workflow did not make this explicit or enforced. First E2E run failed on 42 skipped tests (no auth, no tables). | Round 05 | High — E2E proves nothing without provisioning | **Fixed Round 05** — Added Step 5a (E2E Testing Plan documentation) as required gate before Step 5b E2E testing; created `kit/guides/e2e-testing-plan.md` provisioning workflow; updated `kit/phase-2-single-pass.md`, `kit/phase-2-checklist.md`, flow diagram |
---

## Kit Files Changed (cumulative)

| File | Rounds | Nature of changes |
|---|---|---|
| `kit/phase-1-bootstrap.md` | 01, 02, 03, refactor | Orchestrator convention; step scope; Step 4 richer process + CSS rule; Step 5 output renamed to `docs/DESIGN.md` + path descriptions; Steps 6/7/8 inputs; Phase 1 Output Checklist; Step 7 hard gate; Step 9 pre-flight; Phase Handoff; item 6 fail-fast; Step 3 catalog-first; **Issue 26**: step table renumbered (8 steps), output checklist removes `docs/tech-options.md`, flow diagram updated |
| `kit/phase-2-single-pass.md` | 01, 02, 03, **Round 05** | Created Round 01; Step 2 hard gate; Step 3 branch creation; checklist reference; Step 1 input renamed to `docs/DESIGN.md`; **Issue 32 Fix**: Added Step 5a (E2E Testing Plan Documentation) as hard gate before E2E testing; split old Step 5 into 5a + 5b; updated flow diagram to show new gate |
| `kit/phase-2-checklist.md` | 03, post-04, **Round 05** | Created; Step 5 updated — batch E2E approach (Issue 25); **Issue 29**: Universal item 7 content-preview added; **Issue 32 Fix**: Added Step 5a checklist for E2E Testing Plan documentation hard gate; renamed Step 5 to Step 5b |
| `kit/guides/e2e-testing-plan.md` | **Round 05** | Created — Comprehensive E2E provisioning workflow for Supabase projects; prerequisite checklist, step-by-step provisioning, troubleshooting, CI/CD automation template; **Issue 32 Fix** |
| `kit/README.md` | 01, 02, 03, refactor | Phase 2 track table; doc path updates; `design-system.md` → `DESIGN.md` throughout; **Issue 26**: step groupings renumbered, Step 3 description removed, Architecture step updated, hard gates table updated, end-state artifact list removes `docs/tech-options.md` |
| `kit/templates/04b-prototype-brief.md` | 03 | Full rewrite — State Coverage, Mock Data, Feedback Log, DoD 11 items; CSS clarity item |
| `kit/templates/05-design-system.md` | 03 | Title and output reference updated to `docs/DESIGN.md` |
| `kit/templates/06-roadmap.md` | 01, 03 | Phase 2 Track field; `design-system.md` → `DESIGN.md` in Based on |
| `kit/templates/07-architecture.md` | 03, refactor | `design-system.md` → `DESIGN.md` in Based on; **Issue 26**: "Based on" updated, tech-options references removed from Sections 1, 3, and header note |
| `kit/templates/08-constitution.md` | 03 | `design-system.md` → `DESIGN.md` in Based on |
| `kit/templates/09-scaffold-checklist.md` | 01, 03, refactor | Phase 1 Closeout section; `design-system.md` → `DESIGN.md` in artifact list; **Issue 26**: `docs/tech-options.md` removed from artifact list; title updated to Step 8 |
| `kit/templates/phase-1-kickoff.md` | 03 | Removed "run all 9 steps" framing; gate-bypass warning; DESIGN.md path guidance |
| `kit/stack-catalog.md` | 03 | Created — 6 stack entries; `Requires` field; fail-fast write note |
| `kit/phase-1-checklist.md` | 03, 04, post-04 | Created; Step 5 updated — `docs/DESIGN.md` output, import path guidance; **Round 04**: Step 5 expanded to check project root `DESIGN.md` and auto-proceed without user confirmation (Issue 27); **Issues 28–29**: Step 1 [BLOCK] Q&A-before-artifact; Universal item 7 content-preview |
| `kit/phase-2-checklist.md` | 03, post-04 | Created; Step 5 updated — batch E2E approach (Issue 25); **Issue 29**: Universal item 7 content-preview added |
| `kit/orchestrator-conventions.md` | post-04 | **Issue 29**: item 7 added — preview first 20 lines of every written file |
| `kit/steps/p1-01-ideation.md` | post-04 | **Issue 28**: Q&A-before-artifact rule added as explicit note with sequencing contract |
| `kit/CHANGELOG.md` | 02, 03 | Created Round 02; Round 03 entries added (Issues 17–25) |
| `kit/phase-1-checklist.md` | 03, refactor | Created; Step 5 updated — `docs/DESIGN.md` output, import path guidance; **Issue 26**: full rewrite — Step 3 (Tech Research) section removed, all steps renumbered, Step 6 gains three-stage research checklist |
| `kit/steps/p1-03-tech-research.md` | refactor | **Issue 26**: deleted — step removed; research absorbed into architecture step |
| `kit/templates/03-tech-options.md` | refactor | **Issue 26**: deleted — artifact removed |
| `kit/steps/p1-03-prototype.md` | refactor | **Issue 26**: renamed from p1-04; step number and trigger updated |
| `kit/steps/p1-04-design.md` | refactor | **Issue 26**: renamed from p1-05; step number and internal references updated |
| `kit/steps/p1-05-roadmap.md` | refactor | **Issue 26**: renamed from p1-06; step number and trigger updated |
| `kit/steps/p1-06-architecture.md` | refactor | **Issue 26**: renamed from p1-07; full rewrite — absorbs Step 3 catalog-first research as Stage 1; two-stage process becomes Stages 2–3; inputs updated |
| `kit/steps/p1-07-constitution.md` | refactor | **Issue 26**: renamed from p1-08; step number updated |
| `kit/steps/p1-08-scaffold.md` | refactor | **Issue 26**: renamed from p1-09; step number and trigger updated |

---

## Lessons Across Rounds

**Gates are the most load-bearing part of the kit.** Both round failures trace to gate problems: Round 01 almost shipped without a feature branch; Round 02 discarded a full implementation because Step 7 had `Gate: none`. Every step where a wrong assumption propagates downstream needs a hard gate.

**Agent self-approval is a silent failure mode.** Any document an agent writes with `Status: approved` — without explicit human confirmation — is a self-approval. The fix is always the same: separate the analysis output (chat) from the document output, and require a human confirmation between them.

**Agent routing matters as much as instructions.** Dispatching the `designer` for wireframes produced polished UI despite explicit low-fidelity instructions. The constraint fought the agent's training. Correct routing (use `task` for structural work, `designer` for visual work) removes the tension entirely.

**The single-pass track worked correctly.** Once Phase 1 produced correct inputs, Phase 2 single-pass delivered: spec, plan, implementation, review, and E2E in one cycle with no per-feature overhead.

**Hosted-BaaS infrastructure steps are operator prerequisites.** Schema migrations and serverless function deployments require authenticated CLI or dashboard access — unavailable to any agentic worker. Plan them as `[OPERATOR]` steps; `npx supabase@latest` provides CLI without global install.

**Supabase Realtime does not echo `postgres_changes` to the originating client.** Cross-tab delivery works; same-tab self-updates require an explicit local state update after the write is confirmed. Any Supabase + Realtime implementation must handle this.

---

## Round 04 — court-booking

### Round 04 Mid-Round Checkpoint

*Updated at Step 6 stop — Phase 1 in progress, stopped at Roadmap gate by user.*

| Field | Value |
|---|---|
| Phase 1 steps complete | 5 of 9 (Steps 1, 3, 4, 5; Step 2 skipped) |
| Phase 1 steps remaining | 4 (Steps 6–9; Step 6 gate not yet approved) |
| Wall-clock elapsed | ~40 min |
| Credits spent (Phase 1 so far) | not tracked reliably |
| Kit issues found this round | 3 (Issues 27–29) |
| Kit issues fixed this round | 1 (Issue 27 fixed); Issues 28–29 documented, not yet fixed |
| Blocking issues | None — round stopped by user, not by a blocker |

*Next: resume at Step 6 gate — user to approve roadmap, then Steps 7–9.*

---

### Issue 27 — Step 5 only checked `docs/DESIGN.md`, missed DESIGN.md at project root

- **Discovered at:** Phase 1 Step 5, Round 04 — court-booking
- **Problem:** The Step 5 pre-flight check only looked for `docs/DESIGN.md`. When the user placed `DESIGN.md` at the project root (not in `docs/`), the check came back negative and the orchestrator asked the user which path to take — a redundant confirmation when a design file clearly already exists.
- **Impact:** Unnecessary user friction; forces a confirmation that adds no information when the answer is obvious (if any DESIGN.md exists, use it).
- **Root cause:** The checklist only specified one search path (`docs/DESIGN.md`). Common placement patterns (project root, referenced in kickoff but not yet moved to docs/) were not covered.
- **Fix applied:**
  - Updated `kit/phase-1-checklist.md` Step 5 to check three locations in order: `docs/DESIGN.md`, project root `DESIGN.md`, and any path referenced in the kickoff form.
  - If ANY is found with content: copy to `docs/DESIGN.md` if not already there, mark Step 5 complete, advance to Step 6 — **no user confirmation required**.
  - Rationale added: the user already has a design file; asking them to confirm is redundant friction.
- **Status:** Fixed

---

### Issue 28 — Step 1 idea-brief written before clarifying questions were answered

- **Discovered at:** Phase 1 Step 1, Round 04 — court-booking (raised by user)
- **Problem:** The orchestrator asked Q1 (clarifying question), received an advisory to proceed, made assumptions, and wrote `docs/idea-brief.md` before getting any answers. The user correctly flagged this: the brainstorming skill's contract is questions → answers → document, not questions → document → answers.
- **Impact:** The idea-brief had to be deleted and rewritten after Q&A. Step 1 was marked complete without user approval, then reverted. Added ~10 minutes of rework and a session log syntax error.
- **Root cause:** The kit's Step 1 notes say to "fill `templates/01-idea-brief.md`" but do not explicitly state "only after all clarifying questions are answered." The brainstorming skill's gate ("do not implement until approved") applies, but it is not restated in the step notes where an orchestrator would read it.
- **Fix applied:** None yet — needs a note added to `kit/steps/p1-01-ideation.md` (or `kit/phase-1-checklist.md` Step 1 section) explicitly stating: *"Do not write `docs/idea-brief.md` until all clarifying questions are answered and the user has reviewed the draft."*
- **Status:** Open

---

### Issue 29 — No file-content preview before marking a step complete; syntax errors go unnoticed

- **Discovered at:** Phase 1 Step 1, Round 04 — court-booking (raised by user)
- **Problem:** After Step 1, the session log had a missing markdown table separator row (`|---|`) — a syntax error introduced when an edit operation overwrote the separator row with a data row. The error was only discovered because the user inspected the file manually. The kit has no convention requiring the orchestrator to preview generated files before marking a step complete.
- **Impact:** Malformed files can persist undetected until a downstream step reads them. In this case the error was cosmetic, but a malformed `roadmap.md` or `constitution.md` could cause downstream parse failures.
- **Root cause:** The Universal checklist items in `kit/phase-1-checklist.md` require verifying that a file *exists* on disk but do not require previewing its content for structural correctness.
- **Fix applied:** None yet — needs a Universal checklist item: *"After every file write: open the file and verify the top 20 lines render correctly (no missing table separators, no truncation, no placeholder text)."*
- **Status:** Open


---

### Round 04 Close — court-booking

**Result: PASS.** Phase 1 complete (8 of 8 steps; Step 2 skipped), Phase 2 single-pass complete (7 of 7 steps, 30/30 E2E), redesign cycle complete (3 of 3 steps).

#### Kit changes made this round

**Structural refactor — `specs/` → `docs/specs/`** (applied pre-Phase-2, same session):
- Problem: `docs/` (Phase 1 artifacts) and `specs/` (Phase 2 artifacts) were sibling directories at project root — arbitrary split, no rule backing it.
- Fix: Moved `specs/` under `docs/` so one rule covers all non-code artifacts: *"`docs/` owns all non-code artifacts."* Also eliminated the `full-app/` subfolder from single-pass (no subfolder needed when there is only ever one spec).
- Files changed: `kit/README.md`, `kit/phase-2-single-pass.md`, `kit/phase-2-feature-dev.md`, `kit/phase-2-checklist.md`, `kit/phase-bug-fix.md`, `kit/guides/evolving-specs.md`, `kit/templates/09-scaffold-checklist.md`, `AGENTS.md`

**Structural refactor — session logs and kickoff moved into `docs/`** (applied pre-Phase-2, same session):
- Problem: `phase-1-session.md`, `phase-2-session.md`, `phase-1-kickoff.md` were at project root — inconsistent with the new "everything in docs/" rule.
- Fix: All three move to `docs/`. Session logs are operational records, but merging them into `docs/` keeps the rule simple.
- Files changed: `kit/session-logging.md`, `kit/phase-1-checklist.md`, `kit/phase-2-checklist.md`, `kit/phase-2-single-pass.md`, `kit/phase-bug-fix.md`, `kit/README.md`, `kit/steps/p1-01-ideation.md`, `AGENTS.md`

**`design-taste-frontend` added to task-agent-rubric.md** (applied post-Phase-2):
- Added row in routing table for UI visual quality tasks referencing `/skill:design-taste-frontend` (new UI) and `/skill:redesign-existing-projects` (existing UI upgrades).
- File changed: `kit/task-agent-rubric.md`

#### New pattern validated: redesign as a separate post-Phase-2 cycle

Phase 2 delivered functional code; a separate redesign cycle (own branch, own session log, own code review gate) upgraded visual quality without touching functional behaviour. This pattern worked cleanly. Consider adding it as an optional post-Phase-2 step in the kit for UI-heavy projects.


## Round 03 — chore-splitter

### Round 03 Mid-Round Checkpoint

*Updated after Step 4 — before Step 5 begins.*

| Field | Value |
|---|---|
| Phase 1 steps complete | 3 of 9 (Steps 1, 3, 4; Step 2 skipped) |
| Phase 1 steps remaining | 5 (Steps 5–9) |
| Wall-clock elapsed | ~45 min (Step 3: 30 min; Steps 1+4: ~15 min combined) |
| Credits spent (Phase 1 so far) | ~11,942 |
| Kit issues found this round | 5 (Issues 17–21) |
| Kit issues fixed this round | 5 (all fixed) |
| Kit rule changes | 1 (Kit Change Logging Rule — AGENTS.md) |
| Slowest step so far | Step 3 — Tech Research (30 min; 22 min was write-retry spiral now fixed) |
| Costliest step so far | Step 3 — Tech Research (~1,258 credits; note: this was pre-fix run) |
| Prototype DoD | 11/11 checklist items passing |
| Blocking issues | None — all 5 issues fixed before proceeding |

*Next: Step 5 — Product Design.*

---

### Issue 24 — Step 5 always presents DESIGN.md sources even when a DESIGN.md already exists

- **Discovered at:** Phase 1 Step 5, Round 03 — raised by user during Step 5 pre-flight
- **Problem:** The Step 5 pre-flight unconditionally presented two external sources for finding a `DESIGN.md` before asking which path to take. This is redundant and confusing when the user already has a `DESIGN.md` — they don't need to be told where to get one they've already got. The check should happen first; sources should be presented only when no `DESIGN.md` is found.
- **Impact:** Unnecessary friction for users who already have a design file. Presents irrelevant information at a gate that is already information-dense.
- **Root cause:** Step 5 Notes were written as a flat instruction sequence ("before this step, present sources; then ask which path") with no conditional logic based on what already exists on disk.
- **Fix applied:**
  - Rewrote Step 5 Notes in `kit/phase-1-bootstrap.md` with an explicit pre-step check:
    1. Check if `docs/DESIGN.md` exists or was referenced in the kickoff form
    2. If found → ask "Use it (import path) or run fresh AI session?" — no sources presented
    3. If not found → present sources (getdesign.md, freedesignmd.com); ask download or AI
  - Updated Step 5 section in `kit/phase-1-checklist.md` to match the same conditional logic.
- **Status:** Fixed

---

### Issue 23 — Step 5 output named `design-system.md`; inconsistent with `DESIGN.md` convention from input sources

- **Discovered at:** Phase 1 Step 5, Round 03 — raised by user during Step 5 pre-flight
- **Problem (original):** The kit told users *where to find* a DESIGN.md but gave no instruction on *where to save it*. A user who downloads a design file had no indication of where to place it.
- **Problem (follow-up):** After adding `docs/DESIGN.md` as the prescribed save location for the imported file, the user pointed out that having both `docs/DESIGN.md` (input) and `docs/design-system.md` (output) is inconsistent. Files from getdesign.md and freedesignmd.com are already named `DESIGN.md` — there is no reason the output should have a different name.
- **Impact:** Naming inconsistency between the user's downloaded file and the kit's output artifact; extra cognitive load in understanding which file is which; unnecessary rename friction.
- **Fix applied:**
  - **Renamed Step 5 output from `docs/design-system.md` → `docs/DESIGN.md`** across all kit files.
  - **Import path**: user provides the path to their downloaded file from wherever they saved it — no prescribed save location; Step 5 reads it and generates `docs/DESIGN.md`.
  - Updated `kit/phase-1-bootstrap.md`: Step 5 output, all three path descriptions, Steps 6/7/8 inputs, Phase 1 Output Checklist.
  - Updated `kit/phase-1-checklist.md`: Step 5 section, Phase Close checklist.
  - Updated `kit/phase-2-checklist.md`: Step 1 inputs (both tracks).
  - Updated `kit/phase-2-feature-dev.md` and `kit/phase-2-single-pass.md`: Step 1 inputs.
  - Updated `kit/README.md`: Phase 1 output list, Step 5 description, existing-project table.
  - Updated `kit/templates/05-design-system.md`, `06-roadmap.md`, `07-architecture.md`, `08-constitution.md`, `09-scaffold-checklist.md`: title, Based on metadata, closeout checklist.
  - Template file `kit/templates/05-design-system.md` retains its name (kit-internal convention; lowercase-hyphen pattern; not a user-facing artifact).
- **Status:** Fixed

---

### Issue 22 — No pre-step checklist; orchestrators must hunt through prose notes to find hard gates and must-dos

- **Discovered at:** Phase 1 Step 5 transition, Round 03 — identified when user asked what the kit should display before starting Step 5
- **Problem:** Each step's hard gates, pre-conditions, and required user interactions were buried in prose Notes sections. An orchestrator starting a step had to read paragraphs to find "must present two DESIGN.md sources before starting" or "two-stage process — do not write architecture.md before user confirms." Critical items were easy to miss, leading to gate bypasses and missed pre-conditions across prior rounds. The per-step notes provide context and detail, but are not scannable as a pre-flight checklist.
- **Impact:** Issues 14, 16, and the Step 5 pre-condition (present DESIGN.md sources before starting) are all attributable to orchestrators not scanning a checklist before each step. A structured checklist surfaces hard gates, blocks, and required user interactions at a glance.
- **Root cause:** The kit had detailed step notes but no dedicated pre-step reference. Orchestrators read the notes once when learning the process, then relied on memory — missing step-specific conditions.
- **Fix applied:**
  - Created `kit/phase-1-checklist.md`: per-step pre-flight checklist for all 9 Phase 1 steps plus Phase Close. Each step lists: Universal items (apply to all steps), [HARD GATE] items (explicit user approval required), [BLOCK] items (must pass before proceeding), [SOFT GATE] items, [LOOP] items.
  - Created `kit/phase-2-checklist.md`: same structure for both Phase 2 tracks (single-pass Steps 1–7 and standard loop Steps 1–9).
  - Added a prominent callout at the top of the Orchestrator Announcement Convention in all three phase files: *"Before starting any step, read the checklist for that step."*
- **Status:** Fixed

---

### Issue 21 — Step 4 prototype process incomplete: missing state coverage, realistic mock data, and review structure

- **Discovered at:** Phase 1 Step 4, Round 03 — identified when user introduced `kit/resource/interactive-prototype-process.md`
- **Problem:** The kit's Step 4 defined a low-fidelity structural prototype but was incomplete compared to a proper interactive prototype process. Specifically missing: (1) **realistic mock data** — the kit allowed placeholder text ("Member name", "Item 1") rather than requiring data plausible enough for users to evaluate the workflow; (2) **state coverage** — only the happy path was required; empty states, error/validation states, and success states were not mandated; (3) **structured review questions** — the Review section only said "walk the flow, ready when every screen is reachable" with no guidance on what to look for; (4) **feedback classification** — no structure for categorizing prototype feedback (Requirement Change vs UI/UX Change vs Out of Scope, etc.).
- **Impact:** Prototypes that only show the happy path with placeholder data cannot generate meaningful validation feedback. Users cannot evaluate "does this workflow match reality?" when the data is obviously fake and error paths are missing.
- **Root cause:** Step 4 was designed as a low-fidelity wireframe exercise rather than as a full interactive prototype stage. The distinction between wireframe (structure) and interactive prototype (flow + behavior + data) was not made. The reference document (`kit/resource/interactive-prototype-process.md`) formalizes this distinction and defines the richer standard.
- **Fix applied:**
  - **Step 4 renamed** from "Prototype Mock (HTML)" to "Interactive Prototype" in `phase-1-bootstrap.md`.
  - **Purpose reframed:** added "validate before building" as the explicit goal; added the core question: *"Are we building the right product, and does the proposed workflow actually work?"*
  - **Priority hierarchy added:** Flow → Function → Usability → Data → Visual Polish.
  - **Fidelity rule refined:** CSS is **required** for structural clarity (not merely "allowed"); bare-browser-only rule replaced with "simple, not confusing."
  - **Prototype requirements expanded:** user flows must include cancel/error paths; realistic mock data required; state coverage (empty + error + success) required.
  - **Review questions added** to Step 4 Review section: requirements, user flow, states, edge cases.
  - **`templates/04b-prototype-brief.md` fully rewritten:** new sections — State Coverage, Mock Data, Feedback Log with classification system; DoD checklist expanded from 6 to 11 items.
- **Status:** Fixed

---

### Issue 20 — Step 4 prototype too visually detailed; designer agent over-designs wireframes

- **Discovered at:** Phase 1 Step 4, observed across Round 01 and Round 02 test runs
- **Problem:** The Step 4 prototype outputs in prior rounds had too much visual detail — color palettes, typography choices, styled components, visual hierarchy. The `designer` agent was dispatched for journey map and wireframes, and designers produce visual output by nature: even when asked for "wireframes," they add brand colors, rounded corners, styled buttons, and layout polish. The result looked like a mid-fidelity Figma mockup rather than a low-fidelity flow diagram. This created two downstream problems: (1) Step 5 (Product Design) became partially redundant because visual decisions were already baked into the prototype, and (2) the prototype's visual choices constrained Step 5 before the deliberate design process had run.
- **Impact:** Step 5 either rehashed Step 4's decisions (wasted effort) or had to undo them (extra friction). The design process ran backwards — visual decisions before UX structure was validated.
- **Root cause:** Two compounding causes: (1) dispatching the `designer` agent for a structural task creates natural tension — the agent optimizes for visual quality; (2) the Step 4 Notes only said "prioritize interactive fidelity over visual polish," which is advice, not a constraint. No explicit definition of what "low-fidelity" means in this context, and no gate checklist items to enforce it.
- **Fix applied:**
  - **Agent routing changed:** Step 4 now uses `task` agent (not `designer`) for journey map and wireframe descriptions. `designer` is reserved for Step 5 only.
  - **Hard low-fidelity rule added to Step 4 Notes:** explicit definition of what wireframes must look like (labeled boxes, placeholder text, navigation arrows — no colors, no fonts, no spacing decisions). HTML prototype: default or near-default browser styling only. Test: "if it could be mistaken for a real app's UI, strip it back."
  - **Purpose boundary made explicit:** Step 4 Notes now state "Step 4 is about flow and structure. Visual decisions belong to Step 5. Making visual decisions in Step 4 makes Step 5 redundant."
  - **Gate checklist hardened in `templates/04b-prototype-brief.md`:** added three fidelity items — no brand colors, no custom fonts, no visual polish (shadows, gradients, rounded corners, icons).
- **Status:** Fixed

---

### Issue 19 — Step 9 dispatched scaffold agent without verifying toolchain or accounts

- **Discovered at:** Phase 1 Step 9 gap identified during Round 03 review (not yet reached in the test run)
- **Problem:** Step 9 Notes only verified one precondition before dispatching the scaffold agent: that a git repository exists. It did not check whether the required language runtime (Node.js ≥18), package manager (npm), or stack-specific tooling (e.g., PocketBase binary) were installed. It also did not check whether accounts required by hosted stacks (Supabase, Convex, Neon, Firebase) had been created and had credentials available. A scaffold agent started without these would either fail mid-run (partial project state) or silently produce a broken scaffold that appeared complete.
- **Impact:** No failure in Round 03 yet (Step 9 not reached), but a predictable future failure mode: scaffold fails mid-run on a machine without Node.js, or completes but cannot configure environment variables because no Supabase project exists yet.
- **Root cause:** Step 9 Notes were written for a machine already set up for development. The kit has no assumption about the developer's environment and should not make one silently.
- **Fix applied:**
  - Added structured **pre-flight environment check** to Step 9 Notes, to run before the scaffold agent is dispatched:
    - Read stack from `docs/architecture.md`
    - Look up `Requires` in `kit/stack-catalog.md` for that stack
    - Run `node --version`, `npm --version`, `git --version` via bash; compare against pass conditions
    - Check for PocketBase binary if stack is SvelteKit+PocketBase
    - If any check fails: stop, output install URL, wait for user confirmation
    - Check account prerequisites for hosted stacks — confirm credentials exist before dispatch
  - Added `**Requires:**` field to every stack entry in `kit/stack-catalog.md` (quick-reference table + full entries), stating minimum local toolchain and any account prerequisites.
- **Status:** Fixed

---

### Issue 18 — Step 3 subagent spent 22 of 30 minutes on write-retry spiral

- **Discovered at:** Phase 1 Step 3, Round 03 — chore-splitter (discovered by reviewing `history://TechResearch`)
- **Problem:** The `research-analyst` subagent completed all web research in ~7 minutes, then spent ~22 minutes attempting to write the output file via successive fallback methods (direct write → node_repl fs → MCP REPL → `hub start` PowerShell → base64 encoding → chunked PowerShell decode). Each attempt failed (EPERM on F: drive). The agent finally sent an IRC message to the orchestrator and yielded the content, which the orchestrator wrote in seconds. The kit's recovery mechanism (`agent://`) worked correctly — but the agent should have yielded immediately on first failure, not after 15 failed attempts.
- **Impact:** Step 3 took 30 minutes instead of ~8 minutes. 73% of the step's wall-clock time was wasted on write retries. Credits inflated proportionally.
- **Root cause:** No instruction in the dispatch prompt told the subagent to fail fast on write errors. The agent's default behavior was to try alternative methods exhaustively before giving up — reasonable general behaviour, but wrong here because the orchestrator already has a documented recovery path.
- **Fix applied:**
  - Added **item 6** to the Orchestrator Announcement Convention in `phase-1-bootstrap.md`: a verbatim fail-fast write instruction to include in every subagent dispatch that writes files: *"If any file write fails on the first attempt, stop immediately. Do not try alternative write methods. Yield the complete file content as your final result and notify the orchestrator via `hub`."*
  - Updated Step 3 Notes to reference item 6 and require it be included in dispatch prompts.
  - Created `kit/stack-catalog.md`: pre-researched entries for 6 common web stacks. Step 3 reads the catalog first; only web-searches for stacks not in the catalog or volatile facts (pricing/limits) older than 3 months. Reduces Step 3 research time from ~7 min to ~1–2 min for common stacks.
- **Status:** Fixed

---

### Issue 17 — Kickoff template "Steps to Adjust" comment invited gate bypass

- **Discovered at:** Phase 1 Step 1→2 transition, Round 03 — chore-splitter
- **Problem:** The `Steps to Adjust` section in `kit/templates/phase-1-kickoff.md` contained the comment "Leave blank to run all 9 steps as documented in `kit/phase-1-bootstrap.md`." This framing invited users to write "None — run all 9 steps" (as both the Round 02 test kickoff and the Round 03 kickoff did). That phrasing created ambiguity: does it pre-answer the Step 1→Step 2 optional gate, or just mean "don't skip any steps"? The Step 1 Notes already required the orchestrator to surface the Step 2 choice regardless, but this required adding a special-case exception rule to the bootstrap — complexity that shouldn't exist.
- **Impact:** Confusing framing; required the kit to maintain an exception rule ("even if the kickoff says 'run all steps'…") that would need updating if the template ever changed. Risk that a future orchestrator reads "run all steps" as pre-authorizing Step 2 without the in-chat gate.
- **Root cause:** Template comment described the default behavior ("leave blank = all steps run") rather than what the section is actually for (recording pre-made decisions). Users filled it in literally.
- **Fix applied:**
  - Rewrote the `Steps to Adjust` comment in `kit/templates/phase-1-kickoff.md`: "Leave blank if you have no pre-made decisions to record."
  - Added explicit warning: "Leaving this blank does NOT pre-answer in-chat gate choices. Optional steps (like Step 2) are always offered in chat, regardless of what you write here."
- **Status:** Fixed

---

## Round 02 — meal-planner

### Round 02 Result: FAIL

- **Project**: meal-planner
- **Phase reached**: Phase 2, Step 6 (Manual Check)
- **Failure reason**: Tech stack chosen by agent (Vanilla JS) without user confirmation at Step 7. User expected a conventional application structure. The implemented app (3 files: `index.html`, `style.css`, `app.js`) was correct for the chosen stack but not what the user intended.
- **Work discarded**: All Phase 2 implementation, code review, and E2E testing (app.js 350 lines, style.css 518 lines)
- **Kit issues found this round**: Issues 14, 15, 16 (fixed); Open Issues 2, 3 (noted)
- **Code preserved**: Yes — files remain at `testing/round-02/meal-planner/` for reference; no revert needed (test environment)
- **Next action**: Round 03 with kit fix for Issue 16 applied

---

### Issue 16 — Step 7 architecture decision made by agent without user confirmation

- **Discovered at:** Phase 2 Step 6 (Manual Check), Round 02 — meal-planner
- **Problem:** Step 7 (Architecture) had `Gate: none`. The `research-analyst` agent wrote `docs/architecture.md` with `Status: approved` without the user ever seeing or confirming the tech stack choice. The user discovered during the Phase 2 Manual Check that the app was built in Vanilla HTML/CSS/JS — a choice they never made. The gate note said "human review is embedded in the agent process" but provided no mechanism to enforce it. With `Gate: none`, the orchestrator auto-advanced and the user had no opportunity to intervene.
- **Impact:** Round 02 result: **FAIL**. The app was fully implemented in the wrong stack from the user's perspective. All Phase 2 work (implementation, code review, E2E) was discarded. This is the highest-cost failure mode in the kit — it propagates from Step 7 through all of Phase 2 before surfacing.
- **Root cause:** `Gate: none` + agent self-approving the document (`Status: approved` written by the agent) + no explicit instruction to present the choice to the user before writing the document. Three missing controls compounded into a silent bypass.
- **Fix applied:**
  - Changed Step 7 `Gate: none` → `Gate: hard` in `phase-1-bootstrap.md`
  - Added `Gate Summary` line to Step 7
  - Added explicit two-stage process to Step 7 Notes: (1) agent produces a **chat recommendation** — not a document — presenting ranked options; (2) user confirms stack choice; ONLY THEN does the agent write `docs/architecture.md`
  - Added rule: `architecture.md` starts as `Status: draft`; orchestrator updates to `Status: approved` only after human confirmation
  - Added rule: "looks good" / "proceed" is sufficient — but the stack name must have been surfaced in the gate message so the user knows what they are confirming
  - Updated flow diagram: `Architecture [hard gate]` added
- **Status:** Fixed

---

### Issue 15 — Phase 1 → Phase 2 handoff requires user to manually compose the first message

- **Discovered at:** Phase 1 close, Round 02 — meal-planner
- **Problem:** The Phase Handoff section told the user to open a new session and manually construct the first message from instructions — referencing the right phase file, filling in the project name, choosing single-pass vs. standard. This is unnecessary friction: the orchestrator already knows all three values (Phase 2 Track from `docs/roadmap.md`, project name from kickoff, phase file from the track decision). The user had to do assembly work that the orchestrator could do for them.
- **Impact:** Small but real friction at every project's Phase 1 close. A user who forgets to include one of the four files starts Phase 2 with an incomplete context and no error.
- **Fix applied:** Updated the Phase Handoff section in `phase-1-bootstrap.md` with a ready-to-paste prompt block. Added an orchestrator note requiring the orchestrator to emit the filled-in prompt (brackets replaced) before closing the session — user copies and pastes without editing anything.
- **Status:** Fixed

---

### Issue 14 — Kickoff "run all steps" instruction overrides Step 1's required user decision

- **Discovered at:** Step 1 → Step 2 transition
- **Problem:** The kickoff file (`phase-1-kickoff-meal-planner.md`) contains the instruction "run all 9 steps as documented." Step 1 Notes require the orchestrator to stop after `idea-brief.md` is written and present the user with an explicit choice: proceed to Step 2 or skip to Step 3. The orchestrator treated the kickoff's blanket instruction as resolving that choice, and dispatched the market research agent without pausing. The user had no opportunity to decide.
- **Impact:** The Step 1 → Step 2 decision point is the only place in Phase 1 where the user can opt out of market research without modifying the kickoff. Silently advancing removes that affordance. More broadly: any blanket "run all steps" instruction in a kickoff file will suppress every intermediate gate that requires a conversational choice — not just Step 2.
- **Root cause:** Two instructions conflict and the kit provides no tiebreaker. The kickoff says "run all steps"; the bootstrap says "stop and ask." The orchestrator resolved the ambiguity silently in favor of proceeding.
- **Fix applied:** Add a note to Step 1 Notes in `phase-1-bootstrap.md`: the Step 1 → Step 2 user choice is required regardless of any blanket "run all steps" instruction in the kickoff file. The kickoff controls which steps are skippable; it does not replace the per-step gate conversation. If the kickoff explicitly pre-answers "proceed with Step 2," the orchestrator may advance — but must still acknowledge the choice in chat before dispatching.
- **Status:** Fixed

---

### Open Issue 3 — Step 4 → Step 5 boundary over-specified for small MVPs; prototype already delivers ~80% of design

- **Discovered at:** Step 4 complete, Round 02 — observed across both Round 01 and Round 02 prototype outputs
- **Observation:** Across two test projects, the HTML prototype produced in Step 4 consistently arrived at ~80%+ of the user's design expectations. The `frontend-developer` agent interprets "interactive fidelity over visual polish" loosely and delivers a visually reasonable result alongside full interactivity. By the time Step 5 runs, the design direction is already implicit in the prototype — making the designer agent session feel like a formality that formalizes decisions already made.
- **Root cause:** Step 4's scope instruction ("interactive fidelity over visual polish") is not tight enough to prevent the agent from doing Step 5's work prematurely. The prototype leaks into design territory.
- **Impact:** For small MVPs, Step 5 adds ceremony without proportional return. The hard gate on Step 5 exists to lock in design direction — but if direction is already implicit in the prototype, the gate is approving something that mostly exists. Running a full designer agent session to produce a design system from scratch is disproportionate when the prototype already reflects the system.
- **Fix applied:** Added a third path to Step 5 Notes in `phase-1-bootstrap.md`: if the user has not mentioned any design feedback or requested changes after reviewing the prototype, skip the designer agent session and convert the prototype's visual decisions directly into `design-system.md`. This treats the prototype as the implicit design source of truth. See kit fix below.
- **Status:** Fixed

---

### Open Issue 2 — Agent write failure inflates step wall-clock time even when recovery succeeds

- **Discovered at:** Step 3, Round 02 — comparing duration vs. Round 01 (16 min vs. ~6 min for equivalent output)
- **Observation:** Step 3 credits were cheaper (6,155 vs. 10,326) but wall-clock duration was ~2.7× longer. The discrepancy is explained by the file-write failure pattern (Issue 7): the agent completed its research, failed to write the file (EPERM), then paused and sent a message to the orchestrator to report the failure. The orchestrator's `hub wait` / `hub send` exchange to recover the content added several minutes of dead time on top of the actual research work. Issue 7's fix (verify file existence + recover from `agent://`) is correct and functional — but it doesn't prevent the failure-then-wait delay from occurring in the first place.
- **Impact:** Every step where an agent cannot write files directly adds unrecoverable wall-clock overhead: agent finishes → agent stalls → orchestrator notices → sends message → agent replies → orchestrator writes file. Credits reflect actual compute; duration does not.
- **Status:** Fixed in Round 03 (Issue 18 — fail-fast write instruction)

---

## Round 01 — reading-list

### Issue 13 — Implementation agent skipped feature branch creation

- **Discovered at:** Phase 2 single-pass Step 6 — Ship
- **Problem:** `phase-2-single-pass.md` Step 3 says "All changes accumulate on the feature branch until Step 5 approval" and Step 6 says "Push the branch and open a PR." The `frontend-developer` agent implemented all features directly on `main` (the only branch) without creating `feature/full-app` first. No branch enforcement exists in the step definition.
- **Impact:** The ship step arrived with all work on `main` and no remote configured. The finishing skill has no "create a PR from main" path. We committed directly to main, which is what the single-pass track explicitly says not to do ("do not merge directly").
- **Fix applied:**
  - Added an explicit branch creation step to Step 3 Notes in `phase-2-single-pass.md`: the implementation agent MUST create and switch to `feature/<project-slug>` before writing any code. The step banner should include the branch name. If the branch does not exist when Step 3 starts, the orchestrator creates it before dispatching the agent.
- **Status:** Fixed

---

### Issue 12 — No git repo in test project; `finishing-a-development-branch` skill blocked

- **Discovered at:** Phase 2 single-pass Step 6 — Ship
- **Problem:** The `finishing-a-development-branch` skill expects to operate inside a git repository with a feature branch. The reading list test project had no git repo of its own — it was created inside the playround monorepo whose `testing/.gitignore` intentionally excludes all test projects. The skill could not stage or commit anything against the parent repo. A new `git init` was required on the spot before committing.
- **Impact:** Step 6 requires manual intervention every time a test project hasn't been git-initialised. There is nothing in the kit to prompt this — `git init` is silently assumed but never instructed.
- **Fix applied:**
  - Added a `git init` instruction to Step 9 (Scaffold) Notes in `phase-1-bootstrap.md`: after the scaffold is generated, the orchestrator MUST run `git init` and make an initial commit before the Step 9 gate. This ensures Phase 2 and the ship step always operate inside a proper git repository.
- **Status:** Fixed

---

### Issue 11 — Plan gate skipped; implementation dispatched without user review

- **Discovered at:** Phase 2 single-pass Step 2 → Step 3 transition
- **Problem:** Step 2 (Plan) had a `soft` gate. The orchestrator generated the plan and immediately dispatched the implementation agent without presenting the plan summary or pausing for the user to review. For single-pass, where the plan covers all 11 features, a wrong task assumption propagates into every downstream task — the plan deserves explicit approval before implementation starts.
- **Impact:** User had no opportunity to review or correct the plan before implementation began. The implementation agent was already running before the user noticed.
- **Fix applied:**
  - Changed Step 2 gate from `soft` to `hard` in `phase-2-single-pass.md`. Added gate behaviour note: present plan summary and wait for explicit approval.
  - Strengthened Step 2 `soft` gate in `phase-2-feature-dev.md` with an explicit note: a soft gate is not a silent advance — present a summary and give the user a chance to respond before proceeding.
- **Status:** Fixed

---

### Issue 10 — Started timestamps always `—` in session logs

- **Discovered at:** Phase 2, reviewing phase-2-session.md
- **Problem:** The orchestrator convention says "record the wall-clock start time" but never specifies how. The orchestrator has no built-in clock access — without an explicit instruction to call `new Date().toLocaleTimeString()` via `eval(js)`, the Started column stays as `—` throughout every session log.
- **Impact:** The Started and Duration columns are the primary way a user can see how long each step takes. Without Started timestamps, Duration cannot be computed and the session log provides only status and credits — not timing.
- **Fix applied:** Updated rule #2 in the Orchestrator Announcement Convention in all three phase files (`phase-1-bootstrap.md`, `phase-2-feature-dev.md`, `phase-2-single-pass.md`): explicitly instructs the orchestrator to run `new Date().toLocaleTimeString()` via `eval(js)` at step start to get the wall-clock time. "Do not estimate or leave as `—`" added to prevent the silent omission.
- **Status:** Fixed

---

### Correction to Improvement 9 — Phase 2 track declaration moved from kickoff to roadmap

- **Discovered at:** Post-implementation review of single-pass addition
- **Problem:** The `Phase 2 Approach` field was initially added to `phase-1-kickoff.md`. This is wrong: at kickoff the user doesn't yet know how big the app is, how many features it will have, or whether features are tightly coupled. That information only exists at Step 6 (Roadmap), where the full feature list, sizes, and dependency structure become concrete.
- **Correct location:** Step 6 (Roadmap Generation) gate — after the roadmap is approved, the orchestrator evaluates the feature list against the five criteria (feature count, sizes, domains, dependency structure, developer count) and recommends a track. The human confirms. The decision is recorded in `docs/roadmap.md` as `Phase 2 Track`.
- **Fix applied:**
  - Removed `Phase 2 Approach` section from `kit/templates/phase-1-kickoff.md`
  - Added Phase 2 track evaluation criteria to Step 6 Notes in `kit/phase-1-bootstrap.md`
  - Added `Phase 2 Track` metadata field and gate checklist item to `kit/templates/06-roadmap.md`
  - Updated `kit/README.md` — Phase 2 track is decided at Step 6, not in the kickoff
  - Updated reading list `docs/roadmap.md` to carry `Phase 2 Track: single-pass`
  - Removed the incorrectly added section from the reading list `phase-1-kickoff.md`
- **Status:** Fixed

---

### Improvement 9 — Phase 2 standard loop too heavyweight for small projects

- **Discovered at:** Phase 1 close, before starting Phase 2
- **Problem:** The standard Phase 2 loop (8 steps × N features) is designed for medium-to-large features in complex codebases. For a small personal app like this reading list (11 S-sized features, one domain, solo developer), running 11 separate spec → plan → implement → review → test → ship cycles is disproportionate overhead. The ceremony exceeds the actual work.
- **Root cause:** The kit was designed with one Phase 2 track. It assumed all projects need per-feature iteration cycles. Small projects — where the full feature set is known upfront and features are tightly coupled — are better served by a single pass covering everything at once.
- **Fix applied:**
  - Created `kit/phase-2-single-pass.md` — a 6-step single-pass variant: Full-App Spec (hard gate) → Plan → Implement → Code Review + E2E → Manual Check (hard gate) → Ship. One cycle, all features. Two hard gates total regardless of feature count.
  - Added `Phase 2 Approach` section to `kit/templates/phase-1-kickoff.md` — user declares `standard` or `single-pass` before Phase 2 starts.
  - Updated `kit/README.md` Phase 2 section to document both tracks with a decision table.
  - The mid-cycle escape is defined: if complexity is discovered mid-implementation, the single-pass track can switch to the standard loop for remaining features.
- **Status:** Fixed

---

### Issue 8 — hub start cannot launch npm/npx directly on Windows

- **Discovered at:** Step 9, scaffold smoke test
- **Problem:** The `hub start` op failed when given `application: "npm"` — npm and npx are `.cmd` wrappers on Windows, not real Win32 executables. The hub requires a direct binary path. Error: `%1 is not a valid Win32 application. (os error 193)`.
- **Impact:** The Step 9 Review instruction says "run the project's start command." On Windows, `npm run dev` must be invoked differently. Using `node node_modules/vite/bin/vite.js` bypasses the wrapper and works correctly.
- **Fix applied:** Add a Windows-specific note to the Step 9 `Review:` field in `phase-1-bootstrap.md`: on Windows, start the dev server via `hub` using `application: "node"` and `args: ["node_modules/vite/bin/vite.js"]` rather than `npm run dev`. On macOS/Linux, `npm` works directly.
- **Status:** Fixed

---

### Issue 7 — Some agents cannot write files directly; content must be recovered from agent output

- **Discovered at:** Step 7, architecture document
- **Problem:** The `research-analyst` agent produced the full `architecture.md` content but could not write it to `F:/Khoa-TonyRay/playround/testing/round-01/reading list/docs/architecture.md` — the agent reported filesystem write permission errors. The agent correctly identified the problem and yielded its content as a structured output instead. The orchestrator had to read `agent://ArchitectureDoc` and write the file manually.
- **Impact:** Silent failure risk — an agent that cannot write files may yield a success-looking summary without the file actually existing at the expected path. The orchestrator must always verify file existence after any subagent file-write step, not just trust the agent's reported status.
- **Fix applied:** The Orchestrator Announcement Convention in both phase files already says to verify subagent outputs. Strengthening the verification step: after every subagent task that writes files, the orchestrator MUST confirm the file exists at the expected path before updating the session log as `complete`. If the file is absent, recover content from `agent://<id>` and write it directly.
- **Status:** Fix pending — add explicit verification step to phase file dispatch guidance.

---

### Issue 6 — No guidance on how to access or review step outputs

- **Discovered at:** Step 4 gate, before advancing to Step 5
- **Problem:** Phase 1 step definitions document what files are produced but give no instruction on how to access or review those outputs. For markdown artifacts this is obvious, but for Step 4 (an HTML prototype) and Step 9 (a runnable codebase) the user has no indication of what to do with the output — e.g. "open `docs/prototype/index.html` in your browser" or "run the project's start command."
- **Impact:** Users completing Step 4 don't know to open the prototype in a browser. Users completing Step 9 don't know how to verify the scaffold runs. Both are hard gate prerequisites — a user can't meaningfully approve a gate without knowing how to access what they're reviewing.
- **Fix applied:** Added a `Review:` field to Step 4 and Step 9 in `phase-1-bootstrap.md`. Other steps produce markdown files — no review instruction needed. The `Review:` field only appears on steps whose output requires an action to access.
- **Status:** Fixed

---

### Issue 5 — Subagents write output files relative to workspace root, not project folder

- **Discovered at:** Step 4, designer agent output
- **Problem:** The `designer` agent was dispatched without being told the absolute path of the project folder. It resolved relative output paths (`docs/prototype/journey-map.md`) against the workspace root (`F:/Khoa-TonyRay/playround/`) instead of the project folder (`F:/Khoa-TonyRay/playround/testing/round-01/reading list/`). Files were created in the wrong location and had to be moved manually.
- **Impact:** Every subagent task that writes files needs an explicit project root path, or its output lands in the wrong directory. This is a silent failure — the agent reports success and the file appears to be created, but it's not where the orchestrator expects it.
- **Fix applied:** The task prompt for any subagent that writes files must include the explicit absolute project path as a required context field. The phase-1-bootstrap.md and phase-2-feature-dev.md kickoff instructions should note that the orchestrator must pass `PROJECT_ROOT: <absolute path>` in the context of every dispatched task, and subagent prompts must reference this path for all file writes.
- **Status:** Fixed

---

### Issue 4 — Phase 1 outputs placed at project root, not in a subfolder

- **Discovered at:** Step 3, before writing `tech-options.md`
- **Problem:** All Phase 1 artifacts (`idea-brief.md`, `market-notes.md`, `phase-1-session.md`, etc.) were written directly to the project root, same level as `phase-1-kickoff.md` and eventually the scaffold's `src/`. In a real project, this clutters the root with 8+ planning documents alongside source code, config files, and CI.
- **Impact:** Poor project hygiene; makes the repo root hard to navigate; planning artifacts and code compete for attention at the same level.
- **Fix applied:**
  - All Phase 1 outputs now go into a `docs/` subfolder at the project root.
  - Updated all output paths in `phase-1-bootstrap.md` (Steps 1–9, Output Checklist, Session Log example).
  - Updated all input paths in `phase-2-feature-dev.md` (Steps 1, 2, 4, 5, 8, Flow Diagram).
  - Updated `templates/09-scaffold-checklist.md` Phase 1 Closeout gate.
  - Updated `README.md` end state artifact list and existing-project onboarding table.
  - Moved existing test project files (`idea-brief.md`, `market-notes.md`, `phase-1-session.md`) into `docs/` retroactively.
  - `phase-1-kickoff.md` stays at project root — it is user input filled before the kit runs, not a kit output.
  - `specs/` stays at project root — it is Phase 2's working directory, structurally separate from Phase 1 planning docs.
- **Status:** Fixed

---

### Issue 3 — No time or cost tracking per step

- **Discovered at:** Step 2 gate, before proceeding
- **Problem:** The session log tracked status and output per step but had no visibility into how long each step took or what it cost. Without this, there is no way to identify slow or expensive steps in the workflow, compare runs across projects or rounds, or calibrate expectations for future use.
- **Impact:** Kit produces no data useful for evaluating its own efficiency. Time and cost are only visible in aggregate (OMP dashboard), not per step.
- **Fix applied:**
  - Updated session log schema in both `phase-1-bootstrap.md` and `phase-2-feature-dev.md` to add `Started`, `Duration`, and `Credits` columns.
  - Updated the Orchestrator Announcement Convention in both phase files: the orchestrator now MUST record wall-clock start time and `budget.spent()` at the start of each step, and compute the delta when updating the log at step end.
  - Rewrote `phase-1-session.md` for the current run with the new schema; Steps 1–2 backfilled with estimates (tracking was not active during those steps).
  - Credits are OMP internal units; USD equivalent available via OMP dashboard.
- **Status:** Fixed

---

### Issue 2 — Brainstorming skill over-applied in Step 1

- **Discovered at:** Step 1, Product Ideation
- **Problem:** The brainstorming skill's Architectural path naturally drives toward a full design spec (tech stack options, data model, component breakdown). In Phase 1 Step 1, the orchestrator followed that path without constraining it — resulting in tech stack selection (React vs Vanilla vs PWA), a localStorage schema, and a component tree, all of which belong to Steps 3, 5, and 7 respectively. The phase-1-bootstrap.md note says "do not push toward implementation decisions yet" but this is too easy for the orchestrator to ignore when the skill's own process pulls in the opposite direction.
- **Impact:** Phase 1 steps lose their purpose when Step 1 front-loads decisions that later steps exist to make deliberately. Step 3 (Tech Research) and Step 7 (Architecture) become redundant. The user also gets a false sense of progress — the idea feels "designed" before market research has even run.
- **Fix applied:** Strengthen the Step 1 Notes in `phase-1-bootstrap.md` to give the orchestrator an explicit stopping condition: stop the brainstorming skill after clarifying questions produce a clear problem statement and user profile. Do not enter the "Propose approaches" or "Present design" phases of the skill in Step 1.
- **Status:** Fixed

---

### Issue 1 — No visibility into active skill or agent during execution

- **Discovered at:** Step 1, Product Ideation
- **Problem:** While the orchestrator was running the `brainstorming` skill's Architectural path, the user had no way to tell which skill was active, why certain questions were being asked, or whether the kit was actually being followed. The step header I emitted ("Phase 1 — Step 1: Product Ideation") was not clearly tied to the skill name or its current sub-process.
- **Impact:** User cannot verify the kit is working as documented, cannot distinguish orchestrator behavior from the underlying skill's behavior, and has no trace of what ran after the session ends.
- **Fix applied:**
  - Added **Orchestrator Announcement Convention** to both `phase-1-bootstrap.md` and `phase-2-feature-dev.md`: the orchestrator MUST emit a step banner (step number, name, skill/agent, gate type) at the start of every step, before doing any work.
  - Added **Session Log** convention to both phase files: the orchestrator maintains a `phase-1-session.md` / `phase-2-session.md` at the project root, updated at the end of each step, listing every step's skill/agent, status, and output file.
  - Created `phase-1-session.md` for this test run retroactively.
- **Status:** Fixed

---

### Open Issue 1 — No way to skip per-task review in subagent-driven-development

- **Discovered at:** Post-round-01 analysis, Issue 5 speed/cost discussion
- **Problem:** The `subagent-driven-development` skill has `Never skip the task review` hardcoded into its process. There is no external flag or invocation mode that disables per-task review. The kit's standard loop (phase-2-feature-dev.md) Step 4 currently uses SDD, resulting in: per-task reviewer (from SDD) + final whole-branch review (from SDD) + Step 5 code-reviewer (from kit) = three review layers per feature. The intent is one code review per feature, at the end, after all tasks are done.
- **Options under consideration:**
  1. Replace SDD in Step 4 with direct `task` agent dispatch (one implementer per task, no per-task reviewer); all code review consolidates into Step 5.
  2. Accept the current three-layer structure and document it as intentional.
  3. Modify or fork the SDD skill to support a `no-task-review` mode.
- **Status:** Open — deferred for future review

---

### Round 03 Close — chore-splitter: PASS

Phase 2 completed 2026-09-05. All 7 single-pass steps finished; F01–F06 shipped on `feature/chore-splitter`.

---

### Issue 25 — E2E inline-fix approach lacks explicit regression guarantee

- **Discovered at:** Phase 2 Step 5, Round 03 — raised by user after E2E completed
- **Problem:** The current E2E agent instructions say "if any step FAILS: fix immediately and continue." This fix-inline approach has a structural gap: a fix applied at step 20 may silently break step 5, and the agent may not re-run the entire suite cleanly. The user proposed a better approach: run all test steps first (marking failures/blocked separately), batch all failures to the implementer, then do a full re-run to confirm no regressions. The re-run is the key missing guarantee.
- **Impact:** Medium — in Round 03 the inline approach happened to work (the CORS fix was applied before any later steps ran, so no regression risk existed). But this is luck, not structure. A fix applied mid-suite could break earlier steps undetected.
- **Root cause:** The E2E agent dispatch instructions conflate testing and fixing. These are distinct concerns: the tester's job is to find and document failures; the implementer's job is to fix them. Mixing them in one agent pass means the tester's findings are incomplete when fixes start.
- **Fix applied:** Updated E2E agent dispatch guidance (in the kit's mental model; `phase-2-single-pass.md` and `phase-2-checklist.md` to be updated): run all steps first; distinguish FAIL from BLOCKED (a step blocked by a prior failure is not independently failing); batch all failures to the implementer; run full suite again after all fixes. The re-run is the regression signal.
- **Status:** Documented — kit file update pending (low urgency; no round failure caused by this)

---

### Lesson — Supabase infrastructure steps are operator prerequisites, not agent-automatable

- **Discovered at:** Phase 2 Step 5 (E2E blocked), Round 03
- **Observation:** Plan Task 4 included "apply migration" and "deploy Edge Function" as steps. These require an authenticated Supabase CLI session or dashboard access — neither is available to the frontend-developer agent. The agent correctly wrote the files and stopped; the orchestrator initially presented these as a gap rather than as intentional prerequisites.
- **Clarification:** For Supabase (and any hosted-BaaS) projects, schema migration and serverless function deployment are operator steps. They belong in the plan but should be annotated as `[OPERATOR]` steps — explicitly user-driven, not agent-driven. The `npx supabase@latest` approach (no global install required) is the most developer-friendly path: `supabase login` → `supabase link` → `supabase db push` → `supabase functions deploy`.
- **Action:** Plan template should note `[OPERATOR]` for infrastructure steps in Supabase projects. No kit file change required — this is a plan-writing discipline note.

---

### Lesson — Supabase Realtime does not echo postgres_changes to originating client

- **Discovered at:** Phase 2 Step 5 E2E, Round 03
- **Observation:** The mark-done write succeeded (confirmed by Supabase response), but the same browser tab that made the write never received the Realtime UPDATE event. Cross-tab updates worked perfectly. This is expected Supabase behavior — Realtime `postgres_changes` subscriptions don't reliably deliver events back to the connection that caused the change.
- **Fix in this run:** Added `onMarkDone` callback from ThisWeek → AssignmentCard; local state updated immediately after confirmed write. Realtime still delivers to other clients.
- **Action:** Add this as a `constitution.md` note or architectural risk item for any future Supabase + Realtime project in the kit. Template `docs/architecture.md` could note this as a known behavior under "Harder / constraints introduced."

---

### Issue 26 — Step 3 (Tech Research) removed; research absorbed into Architecture step; steps renumbered

- **Discovered at:** Post-Round 03 refactor — user-initiated structural investigation
- **Problem:** Step 3 (Technical Research) produced `docs/tech-options.md` as an exploratory artifact. Investigation confirmed that Steps 4–6 do not consume `tech-options.md` content (Step 4's trigger referenced it only as a file-existence signal, not for its content). The document existed solely to feed Step 7. Running a separate catalog-lookup + research-analyst dispatch to produce an intermediate artifact, then re-reading that artifact in Step 7's analysis stage, adds a full step with no downstream benefit to Steps 4–6 and no structural value to the final decision — Step 7 already re-derives the same comparison.
- **Impact:** Medium — one fewer step in Phase 1 (9 → 8); `docs/tech-options.md` artifact removed; Steps 4–9 renumbered to 3–8; step filenames updated.
- **Root cause:** Step 3 was designed early in kit development when the two-document paper trail (options → decision) was considered beneficial. Testing confirmed Steps 4–6 don't read it, making it a pure intermediate artifact that only the orchestrator produces and Step 7 consumes — collapsible without information loss.
- **Fix applied:**
  - Deleted `kit/steps/p1-03-tech-research.md` and `kit/templates/03-tech-options.md`
  - Created `kit/steps/p1-06-architecture.md` (from p1-07): absorbs Step 3's catalog-first research + web-search stage as a new Stage 1; existing two-stage analysis + confirmation process becomes Stages 2 and 3; inputs updated to include `idea-brief.md`, `market-notes.md` (optional), `kit/stack-catalog.md`; trigger updated to "Step 5 gate approved"
  - Renamed step files: p1-04 → p1-03, p1-05 → p1-04, p1-06 → p1-05, p1-08 → p1-07, p1-09 → p1-08; updated all internal trigger/step-number references
  - Updated `kit/phase-1-bootstrap.md`: step table renumbered (8 steps), output checklist removes `docs/tech-options.md`, flow diagram updated
  - Updated `kit/phase-1-checklist.md`: Step 3 section removed; all subsequent steps renumbered; Architecture step gains research-stage checklist items; Phase 1 Close removes `docs/tech-options.md`
  - Updated `kit/README.md`: step groupings renumbered, Step 3 description removed, Architecture step updated to reflect self-contained research, hard gates table updated, end-state artifact list removes `docs/tech-options.md`
  - Updated `kit/templates/07-architecture.md`: "Based on" updated; tech-options references removed from Sections 1, 3, and the header note
  - Updated `kit/templates/09-scaffold-checklist.md`: `docs/tech-options.md` removed from Phase 1 Closeout artifact list
- **Status:** Fixed

---

## Round 05 — leave-request

### Issue 30 — Step 4 DESIGN.md auto-skip only checks PROJECT_ROOT; round-level placement not detected

- **Discovered at:** Round 05, Step 4
- **Problem:** The Step 4 checklist auto-skips when `DESIGN.md` exists at `PROJECT_ROOT` or `PROJECT_ROOT/docs/`. In Round 05 the tester placed `DESIGN.md` at the round staging level (`testing/round-05/DESIGN.md`), one directory above the project root. The checklist rule did not detect it; the kickoff form also had the checkbox unchecked. Orchestrator had to manually decide intent and copy the file.
- **Impact:** Low — caused ambiguity requiring a judgment call; no artifact harm.
- **Root cause:** Checklist Step 4 check is path-specific (`PROJECT_ROOT` and `docs/`); no fallback to check parent directories.
- **Fix applied:** None yet. Recommended fix: add a note to the Step 4 checklist to also check the parent directory of `PROJECT_ROOT` and any path mentioned in the kickoff form even if the checkbox is unchecked.
- **Status:** Open

### Issue 31 — Todo system auto-promotes past a blocked step with undeclared downstream dependencies

- **Discovered at:** Round 05, Step 6 hard gate
- **Problem:** When Step 6 was marked `blocked` (awaiting stack confirmation at a hard gate), the todo system auto-promoted Step 7 to `in_progress`. Steps 7 and 8 both depend on `docs/architecture.md` which Step 6 produces. Three "continue working" reminders fired against Step 7, all inapplicable.
- **Impact:** Low — no incorrect artifact produced; workflow confusion and spurious reminder noise.
- **Root cause:** Todo system has no dependency graph; blocking one task does not propagate to dependents.
- **Fix applied:** None (harness behavior). Orchestrator-level mitigation: when blocking a hard-gate step, also block all subsequent steps that depend on its output artifact.
- **Status:** Open
