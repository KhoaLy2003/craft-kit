# Adopt — bring an existing codebase into the kit

> **Status: experimental — not yet validated in a test round.**
>
> **Run once per project**, from the project root, on a codebase that has no kit documents. Output: `docs/architecture.md`, `docs/constitution.md`, `docs/roadmap.md`, `docs/backlog.json`, `docs/data-model.md`, `docs/flows.md`, `docs/MODELS.md`, `AGENTS.md`, `docs/.craft-kit.json`, and `docs/DESIGN.md` when the project has a UI. Source code is never modified.

Universal rules: `kit/orchestrator-conventions.md`. Session log: `docs/adopt-session.md`.

## Limitations (read before running)

- **Describes what exists**, including debt. Nothing aspirational becomes a MUST without approval.
- **Nothing is invented.** Every fact is labelled `from-code`, `from-docs`, or `unknown` (survey template: `kit/templates/adopt-survey.md`).
- **Code beats docs.** A conflict is reported, never silently resolved.
- **Commands are copied verbatim** from scripts, Makefile, or CI config, never reconstructed.
- **Secrets stay out.** `.env*` files are read for variable names only.
- **Source code is never modified**; nothing is refactored.
- **Scope.** One repository (one deployable, or a monorepo sharing one `docs/`). Multi-repo: run once per repository.

## How to start

Send this to your AI, from the project root: `Run Adopt using kit/phase-adopt.md.`

The AI surveys the repository read-only, drafts each document, and puts every unconfirmed item to you at the hard gates (Steps 2, 3, 4); reply "defaults" to answer Steps 2 and 3 together. Nothing is `approved` until you approve it. Have ready: which app or package (monorepo), and your view of the existing features.

## Steps

| # | Step | Gate | Model | Output |
|---|---|---|---|---|
| 1 | Survey | `soft` | `fast` | `docs/adopt/survey.md`: stack, layout, scripts, CI, test setup, existing docs, commit and branch conventions, whether it is a monorepo |
| 2 | Architecture (as-is) | `hard` | `capable` | `docs/architecture.md` with `Provenance: reverse-engineered (Adopt)`. No stack-catalog or deviation triggers; technical debt and `unknown` items recorded |
| 3 | Constitution from observed conventions | `hard` | `balanced` | `docs/constitution.md` with `Provenance: reverse-engineered (Adopt)`, including the Verification Commands table. A rule is MUST only when tooling enforces it (lint or format config) or it is observed consistently in a file sample; everything else is SHOULD |
| 4 | Baseline roadmap | `hard` | `balanced` | `docs/roadmap.md` and `docs/backlog.json`: a release `r0-baseline` already `shipped`, features inferred from routes and screens, each confirmed by you; the NFR table recorded as `unknown` where nothing is found |
| 5 | Backfill modules | each module's own gate | per module | Runs the registry of `kit/phase-upgrade.md`: data-model, flows, test accounts, verification |
| 6 | DESIGN.md | `soft` | `balanced` | Only when there is a UI: tokens extracted into `docs/DESIGN.md` |
| 7 | MODELS.md | `none` | — | `docs/MODELS.md` from the "Model tiers" section of `kit/phase-1-bootstrap.md` |
| 8 | AGENTS.md | `soft` | `fast` | Root `AGENTS.md` from the survey and constitution, or a proposed diff when one exists |
| 9 | Closeout | `soft` | `fast` | Checklist; `docs/.craft-kit.json`; `docs/adopt-session.md`; one commit on `chore/adopt-craftkit` and a PR; a handoff prompt |

## Before Step 1

1. Apply conventions rule 9 (git hygiene).
2. Create `docs/adopt-session.md` per `kit/session-logging.md`.
3. Only the general-purpose agent is needed (plus `archify` for diagram rendering).
4. Monorepo: ask which app or package to cover.

## Step 1 — Survey

Read-only static analysis by one general-purpose agent. Fill `kit/templates/adopt-survey.md` into `docs/adopt/survey.md` (stack and versions, layout, scripts, CI, test setup, env variable names, existing docs, commit/branch conventions, monorepo or not, and the conventions evidence Step 3 uses). Large repositories: sample files by directory and record the sample size and what was not sampled. Present a short summary; advance unless the user objects.

## Step 2 — Architecture (as-is) (hard gate)

Draft `docs/architecture.md` from `kit/templates/06-architecture.md` as the system is, with `Provenance: reverse-engineered (Adopt)`. No stack catalog or deviation triggers. Record technical debt and every `unknown`; label facts as in the survey; list docs-versus-code conflicts separately; NFR lines only where code or docs show them, else `unknown`.

Gate summary: *"The architecture records [stack] as built, with [k] debt items and [u] unknowns. Confirm it describes the system, or name what to correct. Reply 'defaults' to approve this and the constitution together."*

## Step 3 — Constitution from observed conventions (hard gate)

Draft `docs/constitution.md` from `kit/templates/07-constitution.md` with `Provenance: reverse-engineered (Adopt)`. Every MUST cites evidence: a config file (lint, format, compiler, CI check) or the observed file ratio in the survey sample; anything else is SHOULD, and aspirational rules are not written. Fill `## Verification Commands` via Steps 1–2 of `kit/phase-verification-backfill.md` (survey scripts and CI config); this gate is the review. Rules with thin evidence are listed for you to decide.

Gate summary: *"[m] MUST rules each backed by config or observed usage, [s] SHOULD rules, and [v] of 8 verification commands found. Approve the constitution, or name a rule to change."*

If the user replied "defaults" at Step 2, set both documents `approved` on writing and still show both summaries.

## Step 4 — Baseline roadmap (hard gate)

1. Read the allowed values in `kit/scripts/render-backlog.js` (statuses, priority, size, event types, sources, `by`) and follow `kit/phase-roadmap-migrate.md` Step 4 conventions (`schema_version`, `phase2_scope`, `admin_site`, event order, `status` = latest status event).
2. Infer features from routes, screens, and API surfaces in the survey, grouped in one release `r0-baseline` (`shipped`). Each feature: short name, priority `Must`, size estimate, `depends_on` where evident, `status: shipped`, `release: "r0-baseline"`, events `created` then `shipped` with `by: "orchestrator"`. With no date evidence, set `at: null`, `source: "unknown"`, `note: "inferred by Adopt"`; a user-supplied date gets `source: "backfill-confirmed"`, `evidence: "user-supplied"`. Use only validator values.
3. Write `docs/roadmap.md` from `kit/templates/04-roadmap.md` (short narrative, feature table between the generated markers, `Non-functional Requirements` filled only from evidence in code or docs, else `unknown`). Set `Phase 2 Scope` per `p1-04-roadmap.md`, defaulting to `feature`.
4. Run `node kit/scripts/render-backlog.js` (exit 0; fix from its errors).
5. Ask per feature: **keep / correct / drop**. You confirm every `r0-baseline` feature before approval.

Gate summary: *"The baseline has [N] features inferred from routes and screens, all marked shipped with unknown dates. Confirm the list, or name what to correct."*

## Step 5 — Backfill modules

Run the registry in `kit/phase-upgrade.md` (Detect, Confirm, Run): data-model and flows (`phase-docs-backfill.md`), test accounts (`phase-test-accounts-backfill.md`) if the project has test credentials, verification (`phase-verification-backfill.md`) only if Step 3 did not write it. Each module keeps its own gate. Skip `phase-roadmap-migrate.md`: Step 4 wrote the backlog.

## Step 6 — DESIGN.md

Skip when the project has no UI (record `skipped (no UI)`). Otherwise extract tokens from the tailwind config, CSS variables, and theme files into `docs/DESIGN.md` using `kit/templates/03c-design-system.md`, each token `from-code`. Create no `docs/preview/` (the Design dispatch contract has `design_md_fallback`).

## Step 7 — MODELS.md

Run the "Model tiers" section of `kit/phase-1-bootstrap.md`.

## Step 8 — AGENTS.md

Create the root `AGENTS.md` from the survey and constitution (Commands from `## Verification Commands`). If one exists, show a diff and apply only on approval; never overwrite a hand-written file.

## Step 9 — Closeout

1. Checklist, every item must pass:
   - [ ] `docs/architecture.md`, `docs/constitution.md`, `docs/roadmap.md`, `docs/data-model.md`, `docs/flows.md`, `docs/MODELS.md` are `approved`; `docs/DESIGN.md` too, or the skip is recorded
   - [ ] `docs/backlog.json` passes `node kit/scripts/render-backlog.js` with exit 0 and every `r0-baseline` feature was confirmed by you
   - [ ] Every MUST in the constitution has evidence (config file, or an observed ratio recorded in `docs/adopt/survey.md`)
   - [ ] `AGENTS.md` at the project root with a meaningful project summary
   - [ ] `node kit/scripts/lint-docs.js` reports no errors (conventions rule 11); warnings are shown to you
   - [ ] Only `docs/`, `AGENTS.md`, and `.gitignore` changed in the repository (plus `.test-accounts.json`, already ignored); source code is untouched
2. Write `docs/.craft-kit.json` from `kit/templates/craft-kit.json` with `recorded_by: adopt`, `kit_version` from `.craft-kit-version` in the installed kit directory, and `recorded_at` today (conventions rule 10).
3. Finalise `docs/adopt-session.md`.
4. Branch `chore/adopt-craftkit`, one commit (`adopt: add craft-kit documents`), then push and open a PR per the pre-flight, local-only fallback, and never-merge rules in `p2-07-ship.md`.
5. Emit the handoff prompt, brackets filled, for Phase 2, Phase 3 (`kit/phase-3-iterate.md`), or Bug Fix (`kit/phase-bug-fix.md`) as chosen, with the pinned install command `npx github:KhoaLy2003/craft-kit#v<kit_version>` (from `docs/.craft-kit.json`; `kit/` is git-ignored).

## Completion criteria

- [ ] All 9 steps are `complete` or `skipped` in `docs/adopt-session.md`
- [ ] The Phase 2 Docs preflight in `kit/phase-2.md` passes without any file written by hand
- [ ] Every MUST in the constitution has evidence
- [ ] `docs/backlog.json` passes the render script with exit 0
- [ ] Only `docs/`, `AGENTS.md`, and `.gitignore` changed; source code untouched
- [ ] The user approved at the Steps 2, 3 and 4 gates

## Transition

Done. Next: `kit/phase-2.md` (keep building), `kit/phase-3-iterate.md` (decide what to build), or `kit/phase-bug-fix.md`. Offer `kit/phase-onboarding.md` when a developer is about to join.

## Exceptions

- **Project already has some kit documents:** use `kit/phase-upgrade.md` instead; Adopt is for a codebase with no kit documents.
- **Monorepo:** one app or package per run; list it in the survey.
- **No tests, no CI, or no scripts:** the matching Verification Commands rows are `unknown` or `n/a — <reason>`; never guess common commands.
- **Existing hand-written `docs/architecture.md` or `docs/constitution.md`:** never overwrite. Write the draft to a `.generated.md` sibling, say so, and let the user merge.

