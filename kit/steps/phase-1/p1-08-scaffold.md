# Phase 1 · Step 8 — Scaffold

## Overview

- **Purpose**: Generate the initial project structure and build setup, verify the dev environment runs end to end, then close Phase 1 with a single commit and a Phase 2 handoff.
- **Agent/Skill**: general-purpose agent
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

1. **Pre-flight, before dispatching the agent** (missing tooling fails mid-run and leaves a partial state).
   - From `docs/architecture.md`, list every runtime needed (language, CLIs, platform SDKs), using the `Minimum local toolchain` and `Requires:` fields in `kit/stack-catalog.md` for the stack and each addition.
   - Run `<tool> --version` (or the catalog's check command) for each; `git` first. For each failure give the tool, install URL, and a one-line instruction, and wait until the check passes.
   - Hosted stacks (Supabase, Neon, Firebase, Expo EAS, ...): confirm the user created the account/project and has the keys and URLs (the agent cannot fetch credentials); check free-tier limits in the catalog first.
   - Git remote: optional now, needed before Ship (or accept its local-only fallback).
   - Confirm a git repo exists (`git rev-parse --git-dir`), else `git init`. Make no commits here.
   - Ensure `.test-accounts.json` exists per conventions → Test account registry (only after `git check-ignore` passes).
2. Dispatch the scaffold agent with `docs/architecture.md`, `docs/constitution.md`, and `templates/08-scaffold-checklist.md` as the completion checklist. If it fails mid-run, do not continue from the partial state: fix the cause, clean the output, re-run from scratch.
3. **Environment Variables Gate** (skip if the project has no external services or secrets):
   1. List the keys from `.env.example`; if missing, generate it from `docs/architecture.md`, one `KEY=` line per variable.
   2. Write `ENV_SETUP.md` to the project root (never print it), one section per key, with realistic examples and service URLs from `docs/architecture.md`:

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
   3. Tell the user to copy `.env.example` to `.env`, fill in every value using `ENV_SETUP.md`, and reply. Wait.
   4. Validate: every `.env.example` key is present in `.env` with a non-empty, non-placeholder value (reject `<...>`, `your-key-here`, `TODO`, `""`). Check by pattern; never print or quote a value. Name any bad key, restate where to get it, and wait until all are valid.

   **Hard gate:** do not close Phase 1 while `.env` is missing, holds placeholders, or causes env startup errors (wrong credentials found in E2E force costly reruns).
4. **Smoke test.** Run the start command from the generated `README.md` and confirm the app launches with no errors (a working "hello world"; for a static site, open `index.html`). An error naming an environment variable returns you to the gate above. On Windows, if the background-process tool cannot launch `.cmd` wrappers (`npm`, `npx`), run the underlying `node` entry file (Vite: `node node_modules/vite/bin/vite.js`) or a normal terminal.
   Then run every constitution `Verification Commands` row that can run on a fresh scaffold; mark each `verified`, or `unknown` / `n/a — <reason>`, and update `Last amended`. Side-effect commands need user approval (conventions → Definition of Done).
5. **Closeout.**
   1. Use your tool's project-init command if it has one (it generates `AGENTS.md`); otherwise write `AGENTS.md` from `docs/architecture.md` and `docs/constitution.md`. It must hold a real project summary, not a stub.
   2. Run the Phase 1 closeout checklist in `kit/phase-1-bootstrap.md`; every item except the commit must pass.
   3. Write `docs/.craft-kit.json` from `kit/templates/craft-kit.json` (`kit_version` from `.craft-kit-version`, `recorded_at` today, `recorded_by: phase-1`). Before staging, `git check-ignore -q .env` and `.test-accounts.json` must both exit 0 (skip `.env` if none), else fix `.gitignore`. Then make the only Phase 1 commit:
      ```
      git add -A
      git commit -m "phase 1 complete: bootstrap docs, scaffold, and project conventions"
      ```
   4. Emit the Phase 2 handoff prompt from `kit/phase-1-bootstrap.md` ("Phase handoff"), brackets filled in.

## Artifact Rules

`templates/08-scaffold-checklist.md` must be fully checked: partial completion is not acceptable.

## Completion Criteria

- [ ] Pre-flight checks passed; hosted-stack accounts confirmed (if applicable).
- [ ] Every item in `templates/08-scaffold-checklist.md` is checked, including the Environment Variables section when applicable.
- [ ] Smoke test passes with the project's start command and zero startup errors.
- [ ] `AGENTS.md` generated; the Phase 1 closeout checklist passes; the single Phase 1 commit exists and includes `docs/.craft-kit.json`.
- [ ] Every `Verification Commands` row is `verified`, `unknown`, or `n/a — <reason>`; none is still `planned`.
- [ ] Phase 2 handoff prompt emitted (pinned install command included).

## Transitions

- **Next**: Phase 2 (`kit/phase-2.md`), in a new session, via the handoff prompt from `kit/phase-1-bootstrap.md`.

## Exceptions / Special Cases

- **iOS needs macOS.** On Windows or Linux say so in the pre-flight and proceed Android-only, or use EAS Build or a remote Mac.
- **Android emulator not running.** If `adb devices` is empty at smoke test, have the user start a virtual device in AVD Manager, then re-run the start command.
