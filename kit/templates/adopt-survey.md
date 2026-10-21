# adopt-survey.md

## Metadata

- **Status**: `draft` | `approved`
- **Last updated**: <!-- YYYY-MM-DD -->
- **Based on**: <!-- the files and directories actually read, e.g. `package.json`, `.github/workflows/ci.yml`, `src/` (sampled) -->
- **Provenance**: `survey by Adopt on YYYY-MM-DD`

> Read-only survey of an existing codebase, written by `kit/phase-adopt.md` Step 1. Every fact carries one label: `from-code` (found in code, config, or scripts), `from-docs` (a document in the repository says so), or `unknown` (not determinable). Code beats docs: a conflict goes to the Conflicts section, never silently resolved. Commands are copied verbatim, never reconstructed. `.env*` files are read for variable names only; no value appears here.

---

## 1. Scope and sample

- **Repository type**: <!-- single app | monorepo (covered app or package: ...) -->
- **Files read**: <!-- count -->
- **Sample**: <!-- how files were sampled, which directories were not sampled; `full read` for a small repository -->

---

## 2. Stack

| Item | Value | Label |
|---|---|---|
| Language(s) and version | | |
| Framework(s) | | |
| Package manager | | |
| Database / storage | | |
| External services | | |
| Hosting / deployment | | |

---

## 3. Layout

<!-- Top-level folders, one line each: purpose and label. -->

| Path | Purpose | Label |
|---|---|---|
| | | |

---

## 4. Scripts, CI and tests

| Check | Command (verbatim) | Source file | Label |
|---|---|---|---|
| Install | | | |
| Build | | | |
| Lint | | | |
| Typecheck | | | |
| Unit / integration tests | | | |
| E2E | | | |
| Start | | | |
| CI | | | |

- **Test setup**: <!-- framework, where tests live, rough coverage of directories; label -->
- **Test credentials**: <!-- names of env keys or seed scripts that create users; never values -->

---

## 5. Environment variables

<!-- Names only, with the file that declares them. -->

| Name | Declared in | Label |
|---|---|---|
| | | |

---

## 6. Existing documentation

| Document | Path | Notes |
|---|---|---|
| | | |

---

## 7. Conventions observed

<!-- Evidence for the constitution (Step 3). A rule becomes MUST only when tooling enforces it or the sample shows it consistently. -->

| Convention | Evidence (config file, or `N of M sampled files`) | Enforced by tooling | Label |
|---|---|---|---|
| | | yes / no | |

- **Commit message style**: <!-- e.g. conventional commits, from git log sample; label -->
- **Branch naming**: <!-- label -->

---

## 8. Routes, screens and API surface

<!-- Input for the baseline roadmap (Step 4). One line per route, page, or API group, with its source path. -->

| Surface | Source | Label |
|---|---|---|
| | | |

---

## 9. Conflicts and unknowns

<!-- Code vs docs conflicts, and every `unknown` item the user should resolve. -->

-
