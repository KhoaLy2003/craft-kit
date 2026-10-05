# scaffold-checklist.md

## Metadata

- **Status**: `not-started` | `in-progress` | `complete`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: `architecture.md`, `constitution.md`

> The scaffold's output is the codebase, not a document. Check items off as the scaffold agent completes them. The Phase 1 closeout lives in `kit/phase-1-bootstrap.md`.

---

## 1. Repository Structure

<!-- Match the layout architecture.md specifies; the baseline below is a starting point. -->

- [ ] `src/` (or `app/`, `lib/`, per architecture.md) created
- [ ] `test/` (or `tests/`, `spec/`) created
- [ ] `.gitignore` configured for the stack, with the `kit/` entry from Ideation kept
- [ ] `LICENSE` added <!-- required if this project may be open-sourced -->
- [ ] Folder structure matches the components in `architecture.md` § System Overview

---

## 2. Tooling

- [ ] Linter configured (per constitution.md's coding standards)
- [ ] Formatter configured
- [ ] Test framework installed and a placeholder test passes
- [ ] Package manager / dependency file initialized (`package.json`, `pyproject.toml`, ...)
- [ ] Environment variable handling set up (e.g. `.env.example`)

---

## 3. CI (basic)

- [ ] CI config created (lint + test on push/PR, minimum viable)
- [ ] CI passes on the empty scaffold

---

## 4. Convention Enforcement

<!-- Direct implementations of constitution.md principles, not new decisions. -->

- [ ] Naming convention documented (file/folder naming)
- [ ] Commit message convention configured (e.g. commitlint) or documented in `README.md` under Contributing
- [ ] Test organization documented (where tests live relative to source)

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

- [ ] Project builds/runs with zero features implemented
- [ ] A trivial "hello world" check passes (proves the scaffold is wired up, not just files on disk)

---

## 7. Environment Variables

<!-- Skip this section if the project has no environment variables (for example a static site with no external services). -->

- [ ] `ENV_SETUP.md` at the project root, one `### KEY_NAME` section per variable
- [ ] `.env.example` at the project root, one line per key with a descriptive placeholder (e.g. `SUPABASE_URL=https://<project-ref>.supabase.co`)
- [ ] User supplied a value for every key (confirmed by the user, not assumed)
- [ ] `.env` exists and is listed in `.gitignore`
- [ ] Every `.env` key has a non-empty, non-placeholder value (no `<...>`, `your-key-here`, `TODO`, or empty string)
- [ ] The app starts without any missing-env-var error in the startup log
