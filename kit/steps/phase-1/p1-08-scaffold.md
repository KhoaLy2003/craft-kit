# Phase 1 · Step 8 — Scaffold

## Overview

- **Purpose**: Generate the initial project structure and build setup, verify the dev environment runs end to end, then close Phase 1 with a single commit and a Phase 2 handoff.
- **Agent/Skill**: general-purpose agent
- **Model**: `balanced`
- **Trigger**: Step 7 complete (`docs/constitution.md` is `approved`).
- **Inputs**: `docs/architecture.md`; `docs/constitution.md`.
- **Outputs**: a runnable codebase; `ENV_SETUP.md` and `.env` when the project needs environment variables; `AGENTS.md`; the single Phase 1 commit.
- **Template**: `templates/08-scaffold-checklist.md`, the completion checklist the scaffold agent checks off.
- **Gate**: `none` — the Phase 1 closeout checklist below is the exit check.

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
   - Ensure `.test-accounts.json` exists per `kit/guides/test-accounts.md` (only after `git check-ignore` passes).
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
   1. Use your tool's project-init command if it has one (it generates `AGENTS.md`); otherwise write `AGENTS.md` from `docs/architecture.md` and `docs/constitution.md`. It must hold a real project summary, not a stub. Append the `## Workflow (craft-kit)` section from `kit/orchestrator-conventions.md` → "Project workflow block", with the real `<kit_version>`; init commands do not add it. Add it to `CLAUDE.md` too when the tool generated one.
   2. Run the Phase 1 closeout checklist below; every item except the commit must pass.
   3. Write `docs/.craft-kit.json` from `kit/templates/craft-kit.json` (`kit_version` from `.craft-kit-version`, `recorded_at` today, `recorded_by: phase-1`). Before staging, `git check-ignore -q .env` and `.test-accounts.json` must both exit 0 (skip `.env` if none), else fix `.gitignore`. Then make the only Phase 1 commit:
      ```
      git add -A
      git commit -m "phase 1 complete: bootstrap docs, scaffold, and project conventions"
      ```
   4. Emit the Phase 2 handoff prompt below, brackets filled in.

## Phase 1 closeout checklist

The single closeout checklist. Step 8 runs it; every item must pass before the Phase 1 commit and handoff.

- [ ] `docs/MODELS.md` is `approved`; `docs/phase-1-session.md` shows every step `complete` or `skipped`
- [ ] `docs/phase-1-kickoff.md`
- [ ] `docs/idea-brief.md` is `approved`
- [ ] `docs/market-notes.md` *(skip if Step 2 was skipped)*
- [ ] `docs/prototype/` (journey-map.md and prototype-brief.md, Definition of Done checked), `docs/DESIGN.md`, and `docs/preview/index.html` (the approved prototype)
- [ ] `docs/roadmap.md` is `approved`, `Phase 2 Scope` recorded; `docs/backlog.json` validates (all features `pending`) and `docs/backlog.html` is rendered
- [ ] `docs/specs/*/screens/*.md` and `docs/designs/` *(skip if Step 5 was skipped)*
- [ ] `docs/architecture.md`, `docs/data-model.md`, `docs/flows.md` and `docs/constitution.md` are `approved`
- [ ] Scaffold: every item in `kit/templates/08-scaffold-checklist.md` is checked; the app builds and runs; the smoke test passes
- [ ] `ENV_SETUP.md` at the project root, and `.env` valid with no placeholders and a clean start *(skip if no environment variables)*
- [ ] `docs/.craft-kit.json` written from `kit/templates/craft-kit.json` with `recorded_by: phase-1` and `kit_version` copied from `.craft-kit-version` in the installed kit directory (conventions rule 10)
- [ ] `AGENTS.md` at the project root with a meaningful project summary and the `## Workflow (craft-kit)` section
- [ ] `kit/` and `.test-accounts.json` are in `.gitignore`, and `git log` shows the single Phase 1 commit capturing all of the above

## Phase handoff prompt

After the closeout passes, **close this session and open a new one for Phase 2** (this one carries Phase 1 debate that raises cost and leaks stale reasoning). Emit this prompt with every bracket filled (scope from `Phase 2 Scope` in `docs/roadmap.md`, name from the kickoff); the user pastes it into a new session at the project root:

```
Read these files before starting:
- docs/architecture.md
- docs/data-model.md
- docs/flows.md
- docs/constitution.md
- docs/roadmap.md
- docs/backlog.json
- docs/MODELS.md
- kit/phase-2.md

Then run Phase 2 (scope: [all | feature]) for [project-name].
```

`kit/` is git-ignored, so a fresh clone lacks it. There, first reinstall with the pinned command `npx github:KhoaLy2003/craft-kit#v<kit_version>` (`<kit_version>` from `docs/.craft-kit.json`; substitute the real value in the prompt). `docs/` is committed and travels with the repo.

## Artifact Rules

`templates/08-scaffold-checklist.md` must be fully checked.

## Completion Criteria

- [ ] Pre-flight passed; every item in `templates/08-scaffold-checklist.md` checked (smoke test included).
- [ ] No `Verification Commands` row is still `planned`.
- [ ] Closeout checklist passes; the single Phase 1 commit exists with `docs/.craft-kit.json`; handoff prompt emitted with the pinned install command.

## Transitions

- **Next**: Phase 2 (`kit/phase-2.md`), in a new session, via the handoff prompt from `kit/phase-1-bootstrap.md`.

## Exceptions / Special Cases

- **iOS needs macOS.** On Windows or Linux say so in the pre-flight and proceed Android-only, or use EAS Build or a remote Mac.
- **Android emulator not running.** If `adb devices` is empty at smoke test, have the user start a virtual device in AVD Manager, then re-run the start command.
