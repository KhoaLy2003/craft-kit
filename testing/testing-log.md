# Kit Testing Log

Tracks problems found during test runs and fixes applied to the kit.
Each entry links the discovery context (round / project / step) to the specific fix.

---

## Round 01 — reading-list

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

### Issue 2 — Brainstorming skill over-applied in Step 1

- **Discovered at:** Step 1, Product Ideation
- **Problem:** The brainstorming skill's Architectural path naturally drives toward a full design spec (tech stack options, data model, component breakdown). In Phase 1 Step 1, the orchestrator followed that path without constraining it — resulting in tech stack selection (React vs Vanilla vs PWA), a localStorage schema, and a component tree, all of which belong to Steps 3, 5, and 7 respectively. The phase-1-bootstrap.md note says "do not push toward implementation decisions yet" but this is too easy for the orchestrator to ignore when the skill's own process pulls in the opposite direction.
- **Impact:** Phase 1 steps lose their purpose when Step 1 front-loads decisions that later steps exist to make deliberately. Step 3 (Tech Research) and Step 7 (Architecture) become redundant. The user also gets a false sense of progress — the idea feels "designed" before market research has even run.
- **Fix applied:** Strengthen the Step 1 Notes in `phase-1-bootstrap.md` to give the orchestrator an explicit stopping condition: stop the brainstorming skill after clarifying questions produce a clear problem statement and user profile. Do not enter the "Propose approaches" or "Present design" phases of the skill in Step 1.
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

### Issue 5 — Subagents write output files relative to workspace root, not project folder

- **Discovered at:** Step 4, designer agent output
- **Problem:** The `designer` agent was dispatched without being told the absolute path of the project folder. It resolved relative output paths (`docs/prototype/journey-map.md`) against the workspace root (`F:/Khoa-TonyRay/playround/`) instead of the project folder (`F:/Khoa-TonyRay/playround/testing/round-01/reading list/`). Files were created in the wrong location and had to be moved manually.
- **Impact:** Every subagent task that writes files needs an explicit project root path, or its output lands in the wrong directory. This is a silent failure — the agent reports success and the file appears to be created, but it's not where the orchestrator expects it.
- **Fix applied:** The task prompt for any subagent that writes files must include the explicit absolute project path as a required context field. The phase-1-bootstrap.md and phase-2-feature-dev.md kickoff instructions should note that the orchestrator must pass `PROJECT_ROOT: <absolute path>` in the context of every dispatched task, and subagent prompts must reference this path for all file writes.
- **Status:** Fixed

---

### Issue 6 — No guidance on how to access or review step outputs

- **Discovered at:** Step 4 gate, before advancing to Step 5
- **Problem:** Phase 1 step definitions document what files are produced but give no instruction on how to access or review those outputs. For markdown artifacts this is obvious, but for Step 4 (an HTML prototype) and Step 9 (a runnable codebase) the user has no indication of what to do with the output — e.g. "open `docs/prototype/index.html` in your browser" or "run the project's start command."
- **Impact:** Users completing Step 4 don't know to open the prototype in a browser. Users completing Step 9 don't know how to verify the scaffold runs. Both are hard gate prerequisites — a user can't meaningfully approve a gate without knowing how to access what they're reviewing.
- **Fix applied:** Added a `Review:` field to Step 4 and Step 9 in `phase-1-bootstrap.md`. Other steps produce markdown files — no review instruction needed. The `Review:` field only appears on steps whose output requires an action to access.
- **Status:** Fixed

---

### Issue 7 — Some agents cannot write files directly; content must be recovered from agent output

- **Discovered at:** Step 7, architecture document
- **Problem:** The `research-analyst` agent produced the full `architecture.md` content but could not write it to `F:/Khoa-TonyRay/playround/testing/round-01/reading list/docs/architecture.md` — the agent reported filesystem write permission errors. The agent correctly identified the problem and yielded its content as a structured output instead. The orchestrator had to read `agent://ArchitectureDoc` and write the file manually.
- **Impact:** Silent failure risk — an agent that cannot write files may yield a success-looking summary without the file actually existing at the expected path. The orchestrator must always verify file existence after any subagent file-write step, not just trust the agent's reported status.
- **Fix applied:** The Orchestrator Announcement Convention in both phase files already says to verify subagent outputs. Strengthening the verification step: after every subagent task that writes files, the orchestrator MUST confirm the file exists at the expected path before updating the session log as `complete`. If the file is absent, recover content from `agent://<id>` and write it directly.
- **Status:** Fix pending — add explicit verification step to phase file dispatch guidance.

---

### Issue 8 — hub start cannot launch npm/npx directly on Windows

- **Discovered at:** Step 9, scaffold smoke test
- **Problem:** The `hub start` op failed when given `application: "npm"` — npm and npx are `.cmd` wrappers on Windows, not real Win32 executables. The hub requires a direct binary path. Error: `%1 is not a valid Win32 application. (os error 193)`.
- **Impact:** The Step 9 Review instruction says "run the project's start command." On Windows, `npm run dev` must be invoked differently. Using `node node_modules/vite/bin/vite.js` bypasses the wrapper and works correctly.
- **Fix applied:** Add a Windows-specific note to the Step 9 `Review:` field in `phase-1-bootstrap.md`: on Windows, start the dev server via `hub` using `application: "node"` and `args: ["node_modules/vite/bin/vite.js"]` rather than `npm run dev`. On macOS/Linux, `npm` works directly.
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

### Issue 10 — Started timestamps always `—` in session logs

- **Discovered at:** Phase 2, reviewing phase-2-session.md
- **Problem:** The orchestrator convention says "record the wall-clock start time" but never specifies how. The orchestrator has no built-in clock access — without an explicit instruction to call `new Date().toLocaleTimeString()` via `eval(js)`, the Started column stays as `—` throughout every session log.
- **Impact:** The Started and Duration columns are the primary way a user can see how long each step takes. Without Started timestamps, Duration cannot be computed and the session log provides only status and credits — not timing.
- **Fix applied:** Updated rule #2 in the Orchestrator Announcement Convention in all three phase files (`phase-1-bootstrap.md`, `phase-2-feature-dev.md`, `phase-2-single-pass.md`): explicitly instructs the orchestrator to run `new Date().toLocaleTimeString()` via `eval(js)` at step start to get the wall-clock time. "Do not estimate or leave as `—`" added to prevent the silent omission.
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

### Issue 12 — No git repo in test project; `finishing-a-development-branch` skill blocked

- **Discovered at:** Phase 2 single-pass Step 6 — Ship
- **Problem:** The `finishing-a-development-branch` skill expects to operate inside a git repository with a feature branch. The reading list test project had no git repo of its own — it was created inside the playround monorepo whose `testing/.gitignore` intentionally excludes all test projects. The skill could not stage or commit anything against the parent repo. A new `git init` was required on the spot before committing.
- **Impact:** Step 6 requires manual intervention every time a test project hasn't been git-initialised. There is nothing in the kit to prompt this — `git init` is silently assumed but never instructed.
- **Fix applied:**
  - Added a `git init` instruction to Step 9 (Scaffold) Notes in `phase-1-bootstrap.md`: after the scaffold is generated, the orchestrator MUST run `git init` and make an initial commit before the Step 9 gate. This ensures Phase 2 and the ship step always operate inside a proper git repository.
- **Status:** Fixed

---

### Issue 13 — Implementation agent skipped feature branch creation

- **Discovered at:** Phase 2 single-pass Step 6 — Ship
- **Problem:** `phase-2-single-pass.md` Step 3 says "All changes accumulate on the feature branch until Step 5 approval" and Step 6 says "Push the branch and open a PR." The `frontend-developer` agent implemented all features directly on `main` (the only branch) without creating `feature/full-app` first. No branch enforcement exists in the step definition.
- **Impact:** The ship step arrived with all work on `main` and no remote configured. The finishing skill has no "create a PR from main" path. We committed directly to main, which is what the single-pass track explicitly says not to do ("do not merge directly").
- **Fix applied:**
  - Added an explicit branch creation step to Step 3 Notes in `phase-2-single-pass.md`: the implementation agent MUST create and switch to `feature/<project-slug>` before writing any code. The step banner should include the branch name. If the branch does not exist when Step 3 starts, the orchestrator creates it before dispatching the agent.
- **Status:** Fixed
