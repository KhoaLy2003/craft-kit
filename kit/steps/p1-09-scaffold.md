# Phase 1 · Step 9 — Scaffold and Convention Setup

- **Agent/Skill**: `task` agent (general); `frontend-developer` agent (if stack is primarily frontend)
- **Trigger**: Step 8 gate approved
- **Inputs**: `docs/architecture.md`, `docs/constitution.md`
- **Outputs**: Initialized, runnable codebase — repository structure, linter/formatter, test framework, basic CI, README
- **Template**: `templates/09-scaffold-checklist.md` (use as the completion checklist, not just reference — check items off as the agent completes them)
- **Gate**: `none` (the checklist's Phase 1 Closeout section serves as the gate)
- **Review**: Run the project's start command as documented in the generated `README.md`. Confirm the app launches with no errors and the smoke test passes. If the stack uses a dev server (e.g. `vite dev`, `npm run dev`), the browser should open to a working "hello world" state. If it's a static site, open `index.html` directly. A scaffold that cannot be started is not complete — do not close Phase 1 until this runs.
  - **Windows note**: `npm` and `npx` are `.cmd` wrappers and cannot be launched via `hub start` directly. Use `hub start` with `application: "node"` and `args: ["node_modules/vite/bin/vite.js"]` for Vite-based projects. On macOS/Linux, `npm run dev` works directly.
- **Notes**:

  **Pre-flight environment check — run this BEFORE dispatching the scaffold agent.** A scaffold that starts with missing tooling will fail mid-run and leave the project in a partial state. Check once; fix before proceeding.

  1. **Read the stack** from `docs/architecture.md` (Section: Stack Choice or equivalent).
  2. **Look up `Requires`** for that stack in `kit/stack-catalog.md`. If the stack is not in the catalog, identify its toolchain from the architecture doc.
  3. **Run each check via `bash`**:

     | Tool | Check command | Pass condition | Install URL if missing |
     |---|---|---|---|
     | Node.js | `node --version` | Output starts with `v18`, `v20`, `v22`, or higher | https://nodejs.org |
     | npm | `npm --version` | Any output (comes with Node) | (reinstall Node) |
     | git | `git --version` | Any output | https://git-scm.com |
     | PocketBase *(SvelteKit+PocketBase only)* | `ls backend/pocketbase` or equivalent | Binary present | https://pocketbase.io/docs/#installation — download the binary for the target OS and place it at `backend/pocketbase` |

  4. **If any check fails:** stop. Output the exact install URL(s) and ask the user to install and confirm before proceeding. Do not dispatch the scaffold agent until all checks pass.
  5. **Account prerequisites** (hosted stacks only): If the chosen stack requires an account (Supabase, Convex, Neon, Firebase), confirm the user has already created the project on that platform and has the required keys/URLs. If not, pause and link them to the sign-up page. The scaffold agent needs these credentials to configure environment variables — it cannot retrieve them itself.

  **Git repo check:** After the pre-flight passes, confirm a git repository exists at the project root (`git rev-parse --git-dir` returns successfully). If not, run `git init` and make an initial empty commit (`git commit --allow-empty -m "chore: init"`) before the agent starts — Phase 2 branch creation depends on a git repo being present.

  **End state:** a project that builds and runs with zero features implemented. A "hello world" level smoke test must pass before Phase 1 is closed. Every item in the scaffold checklist must be checked. After this step, Phase 2 can begin — the orchestrator reads `docs/roadmap.md` and selects the first `pending` feature in build order.
