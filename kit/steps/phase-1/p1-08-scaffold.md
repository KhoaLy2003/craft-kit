# Phase 1 · Step 8 — Scaffold and Convention Setup

## Overview

- **Purpose**: Generate the initial project structure, configure the build setup, and verify that the development environment runs correctly end-to-end.
- **Agent/Skill**: `general-purpose agent`; or `frontend-developer` if the stack is primarily frontend
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

2. **Git repo check:** After the pre-flight passes, confirm a git repository exists at the project root (`git rev-parse --git-dir` returns successfully). If not, run `git init` and make an initial empty commit (`git commit --allow-empty -m "chore: init"`) before dispatching the agent. Phase 2 branch creation depends on a git repo being present.

3. Dispatch the scaffold agent with `docs/architecture.md` and `docs/constitution.md` as context. Provide the scaffold checklist (`templates/09-scaffold-checklist.md`) as the completion checklist — instruct the agent to check items off as it completes them.

4. After the agent finishes, run the project's start command as documented in the generated `README.md`. Confirm the app launches with no errors and the smoke test passes.

5. Select the agent based on stack: use `general-purpose agent` for full-stack or backend-heavy projects; use `frontend-developer` if the stack is primarily frontend.

## Artifact Rules

- **Artifact**: Initialized repository (no single output file; the scaffold checklist tracks all outputs)
- The scaffold checklist (`templates/09-scaffold-checklist.md`) must be fully checked before Phase 1 is closed. Every item in the checklist must be marked complete — partial completion is not acceptable.
- The Phase 1 Closeout section of the checklist serves as the gate for this step. There is no separate hard gate; the checklist is the gate.
- **Status / approval condition**: No explicit `Status` field; gate passes when the checklist's Phase 1 Closeout section is fully checked and the smoke test passes.

## Completion Criteria

The step is considered complete when:

- [ ] All pre-flight environment checks pass.
- [ ] Git repository exists at the project root with at least one commit.
- [ ] Account prerequisites confirmed for hosted stacks (if applicable).
- [ ] Scaffold agent has run and all checklist items in `templates/09-scaffold-checklist.md` are checked.
- [ ] The project's start command runs successfully with no errors.
- [ ] The smoke test passes — browser opens to a working "hello world" state (dev server) or `index.html` opens correctly (static site).
- [ ] Phase 1 Closeout section of the scaffold checklist is fully checked.

## Transition Rules

### Before Advancing

- Every item in the scaffold checklist is checked, including the Phase 1 Closeout section.
- The smoke test has been run and confirmed passing.
- The project builds and runs with zero features and zero startup errors.

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
