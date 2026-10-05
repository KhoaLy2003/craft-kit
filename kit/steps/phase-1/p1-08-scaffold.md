# Phase 1 · Step 8 — Scaffold

## Overview

- **Purpose**: Generate the initial project structure and build setup, verify the dev environment runs end to end, then close Phase 1 with a single commit and a Phase 2 handoff.
- **Agent/Skill**: general-purpose agent; `frontend-developer` if the stack is primarily frontend (follow the Frontend dispatch contract in `kit/orchestrator-conventions.md`).
- **Model**: `balanced`
- **Trigger**: Step 7 complete (`docs/constitution.md` is `approved`).
- **Inputs**: `docs/architecture.md`; `docs/constitution.md`.
- **Outputs**: a runnable codebase; `ENV_SETUP.md` and `.env` when the project needs environment variables; `AGENTS.md`; the single Phase 1 commit.
- **Template**: `templates/08-scaffold-checklist.md`, the completion checklist the scaffold agent checks off.
- **Gate**: `none` — the Phase 1 closeout in `kit/phase-1-bootstrap.md` is the exit check.

## Scope

- **Out**: implementing features, business logic, data models, UI beyond a "hello world" state, production deployment.

> A scaffold that cannot be started is not complete. Zero features implemented, zero startup errors.

## Execution Rules

1. **Pre-flight, before dispatching the agent.** A scaffold started with missing tooling fails mid-run and leaves a partial state.
   - Read the stack from `docs/architecture.md`. Identify every runtime it needs (language, CLI tools, platform SDKs), cross-referencing the `Minimum local toolchain` and `Requires:` fields in `kit/stack-catalog.md` for the chosen stack and each addition.
   - Run `<tool> --version` (or the catalog's check command) for each via `bash`; `git` is always required, check it first. For each failure give the tool name, install URL, and a one-line install instruction, and wait until the user confirms and the check passes.
   - Hosted stacks (Supabase, Neon, Firebase, Expo EAS, ...): confirm the user has created the account/project and has the keys and URLs. The scaffold agent cannot retrieve credentials itself.
   - Confirm a git repo exists (`git rev-parse --git-dir`); Step 1 should have created it. If missing, `git init`. Make no commits here.
2. Dispatch the scaffold agent with `docs/architecture.md`, `docs/constitution.md`, and `templates/08-scaffold-checklist.md` as the completion checklist. If it fails mid-run (missing tool or credential discovered late), do not continue from the partial state: fix the root cause, clean the output, re-run from scratch.
3. **Environment Variables Gate** (skip if the project has no external services or secrets):
   1. Read `.env.example` to list the required keys; if the scaffold did not produce one, generate it from `docs/architecture.md`, one `KEY=` line per variable.
   2. Write `ENV_SETUP.md` to the project root (never print it to the terminal), one section per key, with realistic example values and service URLs taken from `docs/architecture.md`:

      ```markdown
      # Environment Setup — <project-name>

      Copy `.env.example` to `.env` and fill in each value below. Do not commit `.env`
      (already in `.gitignore`). This file contains no secrets and is safe to commit.

      ## Required Variables

      ### <KEY_NAME>
      - **What it is**: <one sentence on why the app needs it>
      - **Where to get it**: <exact dashboard path, e.g. "Supabase Dashboard → Project Settings → API → Project URL">
      - **Expected format**: `<KEY_NAME>=<realistic-example-value>`
      ```
   3. Tell the user: *"`ENV_SETUP.md` is ready at the project root. Open it next to your editor, copy `.env.example` to `.env`, fill in every value, and reply when done."* Wait.
   4. Validate: `.env` exists and every key from `.env.example` is present with a non-empty, non-placeholder value (reject `<...>`, `your-key-here`, `TODO`, `""`). For any bad key, name it, restate where to get it, and wait. Repeat until all are valid.

   **Hard gate:** do not close Phase 1 while `.env` is missing, holds placeholders, or causes env-related startup errors. Wrong credentials found during E2E force costly reruns; this is the cheapest moment to fix them.
4. **Smoke test.** Run the start command from the generated `README.md` and confirm the app launches with no errors (browser shows a working "hello world" state; for a static site, open `index.html`). If an error names a missing or invalid environment variable, return to the gate above. On Windows, `npm` and `npx` are `.cmd` wrappers that `hub start` cannot launch: for Vite projects use `hub start` with `application: "node"` and `args: ["node_modules/vite/bin/vite.js"]`; on macOS/Linux `npm run dev` works directly.
5. **Closeout.**
   1. Run `/init` to generate `AGENTS.md` at the project root (works across AI providers) and check it holds a meaningful project summary, not a stub.
   2. Run the Phase 1 closeout checklist in `kit/phase-1-bootstrap.md`; every item except the commit must pass.
   3. Commit everything in one commit, the only commit of Phase 1:
      ```
      git add -A
      git commit -m "phase 1 complete: bootstrap docs, scaffold, and project conventions"
      ```
      Phase 2 branches off this commit.
   4. Emit the Phase 2 handoff prompt from `kit/phase-1-bootstrap.md` ("Phase handoff") with every bracket filled in so the user can copy it unedited.

## Artifact Rules

`templates/08-scaffold-checklist.md` must be fully checked: partial completion is not acceptable.

## Completion Criteria

- [ ] Pre-flight checks passed; hosted-stack accounts confirmed (if applicable).
- [ ] Every item in `templates/08-scaffold-checklist.md` is checked, including the Environment Variables section when applicable.
- [ ] Smoke test passes with the project's start command and zero startup errors.
- [ ] `AGENTS.md` generated; the Phase 1 closeout checklist passes; the single Phase 1 commit exists.
- [ ] Phase 2 handoff prompt emitted.

## Exceptions / Special Cases

- **iOS needs macOS.** Simulator and Xcode are macOS-only. On Windows or Linux, state this in the pre-flight output and proceed Android-only locally, or use EAS Build (Expo cloud compilation) or a remote Mac.
- **Android emulator not running.** `adb --version` passing only proves `adb` is on `PATH`. If `adb devices` is empty at smoke-test time, have the user create and start a virtual device in Android Studio's AVD Manager, then re-run the start command.
