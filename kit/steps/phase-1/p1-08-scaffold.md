# Phase 1 · Step 8 — Scaffold and Convention Setup

## Overview

- **Purpose**: Generate the initial project structure, configure the build setup, and verify that the development environment runs correctly end-to-end.
- **Agent/Skill**: `general-purpose agent`; or `frontend-developer` if the stack is primarily frontend
- **Model**: `sonnet`
- **Trigger**: Step 7 gate approved (`docs/constitution.md` has `Status: approved`).
- **Inputs**:
  - `docs/architecture.md`
  - `docs/constitution.md`
- **Outputs**:
  - Initialized, runnable codebase — repository structure, linter/formatter, test framework, basic CI, README
- **Template**: `templates/09-scaffold-checklist.md` (use as the completion checklist, not just a reference — check items off as the agent completes them)
- **Gate**: `none` — the checklist's Phase 1 Closeout section serves as the gate.

## Scope

### In Scope

- Initializing the project repository structure according to `docs/architecture.md`.
- Configuring linter, formatter, test framework, and basic CI pipeline.
- Writing a README with the project start command documented.
- Running a smoke test to confirm the app launches with no errors at a "hello world" level.
- Checking off every item in `templates/09-scaffold-checklist.md` before closing Phase 1.

### Out of Scope

- Implementing any features (deferred to Phase 2).
- Writing business logic, data models, or UI beyond a working "hello world" state.
- Configuring production deployment (deferred to later phases).

### Scope Boundary

> A scaffold that cannot be started is not complete. Do not close Phase 1 until the project's start command runs successfully and the smoke test passes. Zero features implemented; zero startup errors allowed.

## Execution Rules

1. **Run the pre-flight environment check BEFORE dispatching the scaffold agent.** A scaffold started with missing tooling will fail mid-run and leave the project in a partial state. Check once; fix before proceeding.

   1. Read the stack from `docs/architecture.md` (Section: Stack Choice or equivalent).
   2. Look up `Requires` for that stack in `kit/stack-catalog.md`. If the stack is not in the catalog, identify its toolchain from the architecture doc.
   3. Run each check via `bash`:

      | Tool | Check command | Pass condition | Install URL if missing |
      |---|---|---|---|
      | Node.js | `node --version` | Output starts with `v18`, `v20`, `v22`, or higher | https://nodejs.org |
      | npm | `npm --version` | Any output (comes with Node) | (reinstall Node) |
      | git | `git --version` | Any output | https://git-scm.com |
      | PocketBase *(SvelteKit+PocketBase only)* | `ls backend/pocketbase` or equivalent | Binary present | https://pocketbase.io/docs/#installation — download the binary for the target OS and place it at `backend/pocketbase` |

   4. **If any check fails:** stop. Output the exact install URL(s) and ask the user to install and confirm before proceeding. Do not dispatch the scaffold agent until all checks pass.
   5. **Account prerequisites (hosted stacks only):** If the chosen stack requires an account (Supabase, Convex, Neon, Firebase), confirm the user has already created the project on that platform and has the required keys/URLs. If not, pause and link them to the sign-up page. The scaffold agent needs these credentials to configure environment variables — it cannot retrieve them itself.

2. **Git repo check:** Confirm a git repository exists at the project root (`git rev-parse --git-dir` returns successfully). If not, run `git init` — Step 1 (Ideation) should have already done this, so its absence indicates the step was skipped or the repo was deleted. Do not make any commits here; the Phase 1 commit runs at closeout below.

3. Dispatch the scaffold agent with `docs/architecture.md` and `docs/constitution.md` as context. Provide the scaffold checklist (`templates/09-scaffold-checklist.md`) as the completion checklist — instruct the agent to check items off as it completes them.

4. **Environment Variables Gate** — if the project requires environment variables (API keys, secrets, database connection strings, or any external service credentials):

   1. **Identify required variables**: Read the generated `.env.example` to enumerate all required keys. If the scaffold did not produce `.env.example`, generate it now from `docs/architecture.md` — list every external service or secret the app depends on, one `KEY=` line per variable.
   2. **Write `ENV_SETUP.md`** to the project root. This file is the user's reference while filling in `.env` — it must not be printed to the terminal. Format:

      ```markdown
      # Environment Setup — <project-name>

      Copy `.env.example` to `.env` and fill in each value using the references below.
      Do not commit `.env` — it is already in `.gitignore`.
      This file is safe to commit; it contains no secrets.

      ## Required Variables

      ### <KEY_NAME>
      - **What it is**: <one sentence describing why the app needs this value>
      - **Where to get it**: <exact location in the service dashboard, e.g. "Supabase Dashboard → Project Settings → API → Project URL">
      - **Expected format**: `<KEY_NAME>=<realistic-example-value>`

      <!-- repeat one section per key -->
      ```

      Generate one `### <KEY_NAME>` section per key in `.env.example`, sourcing service URLs from `docs/architecture.md`. Use realistic example values, not generic placeholders.

   3. **Wait for confirmation**: Tell the user "`ENV_SETUP.md` is ready at the project root — open it alongside your editor, copy `.env.example` to `.env`, fill in every value, then reply here when done." Do not advance until they confirm.
   4. **Validate `.env`**: After the user confirms:
      - Confirm `.env` exists at the project root
      - Confirm every key from `.env.example` is present in `.env` with a non-empty, non-placeholder value (reject `<...>`, `your-key-here`, `TODO`, `""`)
      - If any key is still missing or placeholder: name the key, restate where to obtain it, and wait for the user to fix it. Repeat until all keys are valid.
   5. **Do not proceed to Step 5 until all required env vars are confirmed valid.** This gate exists to prevent mismatched credentials from surfacing as failures deep in E2E testing, where diagnosing them is expensive.

   If the project has no environment variables (static sites, no external services), skip this rule entirely.


5. After the agent finishes and the Environment Variables Gate passes, run the project's start command as documented in the generated `README.md`. Confirm the app launches with no startup errors. If any error mentions a missing or invalid environment variable, return to the Environment Variables Gate and resolve it before re-running.

6. **Phase 1 closeout — AGENTS.md and commit:** Once the scaffold is confirmed running and the smoke test passes:
   1. Run `/init` to generate `AGENTS.md` at the project root. This command works the same way across all AI providers.
   2. Verify `AGENTS.md` exists and contains a meaningful project summary (not blank, not a stub).
   3. Stage and commit all Phase 1 output in a single commit — this is the **only commit** for the entire Phase 1 run:
      ```
      git add -A
      git commit -m "phase 1 complete: bootstrap docs, scaffold, and project conventions"
      ```
      This commit captures everything from `git init` to the completed scaffold: all `docs/` artifacts, the initialized codebase, and `AGENTS.md`. From this point forward, Phase 2 branches off of this single Phase 1 commit.

6. Select the agent based on stack: use `general-purpose agent` for full-stack or backend-heavy projects; use `frontend-developer` if the stack is primarily frontend.

## Artifact Rules

- **Artifact**: Initialized repository (no single output file; the scaffold checklist tracks all outputs)
- The scaffold checklist (`templates/09-scaffold-checklist.md`) must be fully checked before Phase 1 is closed. Every item in the checklist must be marked complete — partial completion is not acceptable.
- The Phase 1 Closeout section of the checklist serves as the gate for this step. There is no separate hard gate; the checklist is the gate.
- **Status / approval condition**: No explicit `Status` field; gate passes when the checklist's Phase 1 Closeout section is fully checked and the smoke test passes.

## Completion Criteria

The step is considered complete when:

- [ ] All pre-flight environment checks pass.
- [ ] Git repository exists at the project root.
- [ ] Account prerequisites confirmed for hosted stacks (if applicable).
- [ ] Environment Variables Gate passed: `.env` exists, all keys from `.env.example` set to non-empty non-placeholder values, and the app starts without any missing-env-var errors (skip if no environment variables required).
- [ ] Scaffold agent has run and all checklist items in `templates/09-scaffold-checklist.md` are checked.
- [ ] The project's start command runs successfully with no errors.
- [ ] The smoke test passes — browser opens to a working "hello world" state (dev server) or `index.html` opens correctly (static site).
- [ ] Phase 1 Closeout section of the scaffold checklist is fully checked.
- [ ] `AGENTS.md` generated at project root via harness `/init` command (or equivalent).
- [ ] All Phase 1 files committed in a single commit (`git add -A && git commit`).

## Transition Rules

### Before Advancing

- Every item in the scaffold checklist is checked, including the Phase 1 Closeout section.
- The smoke test has been run and confirmed passing.
- The project builds and runs with zero features and zero startup errors.
- `AGENTS.md` exists at the project root and contains a meaningful project summary.
- A single Phase 1 commit exists in `git log` — no partial commits during Phase 1 steps.
- Environment Variables Gate: `.env` validated and application starts clean with no env-related errors (if applicable).

### Next Step

- **Default**: Phase 1 complete — start Phase 2 session. The Phase 2 orchestrator reads `docs/roadmap.md` and selects the first `pending` feature in build order.
- **Optional skip**: No
- **User decision required**: No — Phase 2 starts automatically once the checklist and smoke test pass

### Transition Record

- **Record**: `docs/<project>/phase-1-session.md`
- **Values**: `complete`

## Exceptions / Special Cases

- **Windows note**: `npm` and `npx` are `.cmd` wrappers and cannot be launched via `hub start` directly. For Vite-based projects on Windows, use `hub start` with `application: "node"` and `args: ["node_modules/vite/bin/vite.js"]`. On macOS/Linux, `npm run dev` works directly via `hub start`.
- **Static sites**: If the stack produces a static site with no dev server, open `index.html` directly in a browser to verify the smoke test rather than launching a dev server.
- **Hosted stack accounts**: If the user does not yet have an account on a required platform (Supabase, Convex, Neon, Firebase), stop and link them to the sign-up page before dispatching the agent. The scaffold agent cannot retrieve credentials on its own — it will fail silently or produce an incomplete environment configuration.
- **Partial scaffold state**: If the scaffold agent fails mid-run due to a missing tool or credential discovered after dispatch, do not attempt to continue from the partial state. Fix the root cause, clean the partial output, and re-run the agent from scratch.

## References

- `templates/09-scaffold-checklist.md`
- `kit/stack-catalog.md`
- `docs/architecture.md`
- `docs/constitution.md`
