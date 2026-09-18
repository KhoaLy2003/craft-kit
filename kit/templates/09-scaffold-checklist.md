# scaffold-checklist.md — Output Template for Step 8: Scaffold & Convention Setup

## Metadata

- **Status**: `not-started` | `in-progress` | `complete`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `architecture.md`, `constitution.md`

> Unlike previous steps, the primary output here is the codebase itself, not a document. This checklist tracks what must exist before Phase 1 is considered closed. Check items off as the scaffold agent completes them.

---

## 1. Repository Structure

<!-- Confirm the folder layout matches what architecture.md specifies. Common baseline shown below — adjust to the chosen stack. -->

- [ ] `src/` (or `app/`, `lib/` — per architecture.md's convention) created
- [ ] `test/` (or `tests/`, `spec/`) created
- [ ] `docs/` created
- [ ] `.gitignore` configured for the chosen stack; `kit/` entry present (added in Step 1 — must not be removed)
- [ ] `LICENSE` added <!-- required if this project may be open-sourced -->
- [ ] Folder structure matches the component breakdown in `architecture.md` § System Overview

---

## 2. Tooling

- [ ] Linter configured (per constitution.md's coding standard principles)
- [ ] Formatter configured
- [ ] Test framework installed and a placeholder test passes
- [ ] Package manager / dependency file initialized (e.g. `package.json`, `pyproject.toml`)
- [ ] Environment variable handling set up (e.g. `.env.example`)

---

## 3. CI (basic)

- [ ] CI config file created (lint + test on push/PR, minimum viable)
- [ ] CI passes on the initial empty scaffold

---

## 4. Convention Enforcement

<!-- These should be direct implementations of principles stated in constitution.md, not new decisions -->

- [ ] Naming convention documented (file/folder naming, per constitution.md)
- [ ] Commit message convention configured (e.g. commitlint, or documented in `README.md` under Contributing)
- [ ] Test organization convention documented (where tests live relative to source)

---

## 5. README.md

<!-- Standard-readme style baseline. Trim sections that don't apply yet at this stage (e.g. Usage may be empty until Phase 2 ships the first feature). -->

- [ ] Title + one-sentence description (what it does, not what it is)
- [ ] Quick Start (clone → install deps → run — must actually work)
- [ ] Repository Structure section (short description per top-level folder)
- [ ] Tech stack summary (link to `architecture.md` for full reasoning)
- [ ] License section
- [ ] Link to `constitution.md` for contribution/coding standards

---

## 6. Smoke Test

- [ ] Project builds/runs with zero features implemented
- [ ] A trivial "hello world" level check passes (proves the scaffold is genuinely wired up, not just files sitting unconnected)


---

## 7. Environment Variables

<!-- Skip this section entirely if the project has no environment variables (e.g. a static site with no external services). -->

- [ ] `ENV_SETUP.md` written to project root — one `### KEY_NAME` section per variable with what it is, where to get it, and expected format
- [ ] `.env.example` generated at project root — one line per required key with a descriptive placeholder (e.g. `SUPABASE_URL=https://<project-ref>.supabase.co`)
- [ ] User provided a value for every key in `.env.example` (confirmed by user, not assumed)
- [ ] `.env` exists at project root and is listed in `.gitignore`
- [ ] Every key in `.env` is set to a non-empty, non-placeholder value (no `<...>`, `your-key-here`, `TODO`, or empty strings)
- [ ] Application starts without any missing-env-var error in the startup log
---

## Gate: Phase 1 Closeout

<!-- This is the final checkpoint before Phase 2 begins. Unlike other gates, this one confirms the ENTIRE Bootstrap phase, not just this step. -->

- [ ] All sections above are checked (Section 7 may be skipped for projects with no env vars)
- [ ] `docs/idea-brief.md`, `docs/market-notes.md`, `docs/prototype/`, `docs/DESIGN.md`, `docs/roadmap.md`, `docs/architecture.md`, `docs/constitution.md` all exist and are `approved`
- [ ] `docs/roadmap.md` Status column shows all features as `pending` (none started yet)
- [ ] `docs/specs/` directory created (Phase 2 will write `docs/specs/<feature-slug>/spec.md` and `plan.md` here; single-pass writes `docs/specs/spec.md` and `plan.md` directly)
- [ ] Phase 2 entry point confirmed: the next action is to open a new agent session, reference `phase-2-feature-dev.md`, and tell the orchestrator to begin with the first `pending` feature in `docs/roadmap.md` (build order)
