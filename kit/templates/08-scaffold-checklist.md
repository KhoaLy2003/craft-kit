# scaffold-checklist.md

## Metadata

- **Status**: `not-started` | `in-progress` | `complete`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `architecture.md`, `constitution.md`

> The scaffold's output is the codebase, not a document. Check items off as the scaffold agent completes them. The Phase 1 closeout lives in `kit/steps/phase-1/p1-08-scaffold.md`.

---

## 1. Repository Structure

<!-- Match the layout architecture.md specifies; the baseline below is a starting point. -->

- [ ] `src/` (or `app/`, `lib/`, per architecture.md) created
- [ ] `test/` (or `tests/`, `spec/`) created
- [ ] `.gitignore` configured for the stack, with the `kit/` and `.test-accounts.json` entries from Ideation kept
- [ ] `.test-accounts.json` created from `kit/templates/test-accounts.json` and git-ignored (`git check-ignore` passes)
- [ ] `LICENSE` added <!-- required if this project may be open-sourced -->
- [ ] Folder structure matches the components in `architecture.md` § System Overview

---

## 2. Tooling

- [ ] Linter configured (per constitution.md's coding standards)
- [ ] Formatter configured
- [ ] Test framework installed and a placeholder test passes
- [ ] Package manager / dependency file initialized (`package.json`, `pyproject.toml`, ...)
- [ ] Every command in `constitution.md` → Verification Commands has been run and marked `verified` (or `unknown` / `n/a — <reason>`), and `Last amended` updated
- [ ] Environment variable handling set up (e.g. `.env.example`)

---

## 3. CI (basic)

- [ ] CI config created (lint + test on push/PR, minimum viable)
- [ ] CI passes on the empty scaffold

---

## 4. Convention Enforcement

<!-- Direct implementations of constitution.md principles, not new decisions. -->

- [ ] Naming, commit message (e.g. commitlint, or `README.md` Contributing), and test-location conventions documented

---

## 5. README.md

<!-- Standard-readme baseline; trim sections that don't apply yet (Usage may stay empty until Phase 2 ships a feature). -->

- [ ] Title and one-sentence description (what it does, not what it is)
- [ ] Quick Start (clone → install → run; must actually work)
- [ ] Repository Structure (one line per top-level folder)
- [ ] Tech stack summary, linking `architecture.md`
- [ ] License section
- [ ] Link to `constitution.md` for coding standards

---

## 6. Smoke Test

- [ ] Project builds/runs with zero features, and a trivial "hello world" check passes (the scaffold is wired up, not just files on disk)

---

## 7. Environment Variables

<!-- Skip this section if the project has no environment variables (for example a static site with no external services). -->

- [ ] `ENV_SETUP.md` (one `### KEY_NAME` section per variable) and `.env.example` (descriptive placeholders, e.g. `SUPABASE_URL=https://<project-ref>.supabase.co`) at the project root
- [ ] `.env` is git-ignored, user-filled (not assumed), and every key is non-placeholder (`p1-08-scaffold.md` rule 3)
- [ ] The app starts with no missing-env-var error
