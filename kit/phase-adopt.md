# Adopt — bring an existing codebase into the kit

> **Status: experimental — not yet validated in a test round.**
>
> **Run once per project**, from the project root, on a codebase that has no kit documents. Writes `docs/` (architecture, constitution, roadmap, backlog.json, data-model, flows, MODELS, `.craft-kit.json`; `api.md` when the code exposes an API; `DESIGN.md` when there is a UI) and `AGENTS.md` (and `CLAUDE.md` when present). Source code is never modified.

Universal rules: `kit/orchestrator-conventions.md`. Session log: `docs/adopt-session.md`.

**Resume and handover.** A session that finds `docs/adopt-session.md` with unfinished steps resumes per conventions rule 18, from the documents already written (never regenerate an approved one). Seams: after Steps 2, 3, 4 and 6 (rule 19, `kit/guides/session-handover.md`; Adopt commits only at Step 7, so keep the same checkout).

## Limitations

- **Describes what exists**, including debt. Nothing aspirational becomes a MUST without approval.
- **Nothing is invented.** Every fact is `from-code`, `from-docs`, or `unknown` (`kit/templates/adopt-survey.md`). Code beats docs: a conflict is reported, never silently resolved.
- **Commands are copied verbatim** from scripts, Makefile, or CI config.
- **Secrets stay out.** `.env*` files are read for variable names only.
- **One repository per run** (one deployable, or a monorepo sharing one `docs/`).

## How to start

Send this to your AI, from the project root: `Run Adopt using kit/phase-adopt.md.`

The AI surveys read-only, drafts each document, and puts every unconfirmed item to you at the hard gates (Steps 2, 3, 4); reply "defaults" to answer Steps 2 and 3 together. Nothing is `approved` until you approve it. Have ready: which app or package (monorepo), and your view of the existing features.

## Steps

| # | Step | Gate | Model |
|---|---|---|---|
| 1 | Survey | `soft` | `fast` |
| 2 | Architecture (as-is) | `hard` | `capable` |
| 3 | Constitution from observed conventions | `hard` | `balanced` |
| 4 | Baseline roadmap | `hard` | `balanced` |
| 5 | Backfill modules and MODELS.md | each module's own gate | per module |
| 6 | DESIGN.md | `soft` | `balanced` |
| 7 | Closeout | `soft` | `fast` |

## Before Step 1

1. Apply conventions rule 9 (git hygiene).
2. Create `docs/adopt-session.md` per `kit/session-logging.md`.
3. Only the general-purpose agent is needed (plus `archify` for diagram rendering).
4. Monorepo: ask which app or package to cover.

## Step 1 — Survey

Read-only static analysis by one general-purpose agent. Fill `kit/templates/adopt-survey.md` into `docs/adopt/survey.md`, including the conventions evidence Step 3 uses and the business context (what the system does, its business transactions, its domain terms), each fact labelled and sourced. Large repositories: sample files by directory; record the sample size and what was not sampled. Present a short summary; advance unless the user objects.

## Step 2 — Architecture (as-is) (hard gate)

Draft `docs/architecture.md` from `kit/templates/06-architecture.md` as the system is, with `Provenance: reverse-engineered (Adopt)`. No stack catalog or deviation triggers.

- Key components table: fill `Type` and `Depends on` for each component; `unknown` when code does not show it.
- Record technical debt and every `unknown`; list docs-versus-code conflicts separately.
- NFR lines only where code or docs show them, else `unknown`.

Gate summary: *"The architecture records [stack] as built, with [k] debt items and [u] unknowns. Confirm it describes the system, or name what to correct. Reply 'defaults' to approve this and the constitution together."*

## Step 3 — Constitution from observed conventions (hard gate)

Draft `docs/constitution.md` from `kit/templates/07-constitution.md` with `Provenance: reverse-engineered (Adopt)`.

- Every MUST cites evidence: a config file (lint, format, compiler, CI check) or the observed file ratio in the survey sample. Everything else is SHOULD; write no aspirational rules. List thin-evidence rules for the user to decide.
- Fill `## Verification Commands` via Steps 1–2 of `kit/phase-verification-backfill.md`; this gate is the review.
- Set `**Base branch:**` from the survey (conventions rule 17) and the CI row's `runs on PRs to:` note from the workflow triggers. State a base branch outside those triggers once there, so Ship does not rediscover it.

Gate summary: *"[m] MUST rules each backed by config or observed usage, [s] SHOULD rules, and [v] of 8 verification commands found. Approve the constitution, or name a rule to change."*

If the user replied "defaults" at Step 2, set both documents `approved` on writing and still show both summaries.

## Step 4 — Baseline roadmap (hard gate)

1. Infer features from routes, screens, and API surfaces in the survey; cross-check them against its business context. A transaction with no feature, or a feature no transaction explains, goes to you as a question, never added or dropped silently.
2. Build `docs/backlog.json` from `kit/templates/backlog.json`, using only values `kit/scripts/render-backlog.js` allows. One release `r0-baseline`; per feature: short name, priority `Must`, size, `depends_on` where evident, `status: shipped`, `release: "r0-baseline"`, events `created` then `shipped`. `phase2_scope` and `admin_site` match the roadmap metadata.
3. Dates: with no date evidence an event is just `{"type": "created"}` (undated; no null fields, no note). A user-supplied date gets `at`, `source: "backfill-confirmed"`, `evidence: "user-supplied"`.
4. Write `docs/roadmap.md` from `kit/templates/04-roadmap.md`: short narrative, the feature table between `<!-- BEGIN FEATURES -->` and `<!-- END FEATURES -->`, `Non-functional Requirements` only from evidence in code or docs (else `unknown`), `Phase 2 Scope` per `p1-04-roadmap.md` (default `feature`). Run `node kit/scripts/render-backlog.js` (exit 0; fix from its errors).
5. Ask per feature: **keep / correct / drop**. You confirm every `r0-baseline` feature before approval.

Gate summary: *"The baseline has [N] features inferred from routes and screens, all marked shipped with unknown dates. Confirm the list, or name what to correct."*

## Step 5 — Backfill modules and MODELS.md

Run the registry in `kit/phase-upgrade.md` (Detect, Confirm, Run); each module keeps its own gate:

- data-model and flows (`phase-docs-backfill.md`);
- the API document (`phase-api-backfill.md`) if the code exposes an API;
- test accounts (`phase-test-accounts-backfill.md`) if the project has test credentials;
- verification (`phase-verification-backfill.md`) only if Step 3 did not write it.

Then write `docs/MODELS.md` by running the "Model tiers" section of `kit/phase-1-bootstrap.md`.

## Step 6 — DESIGN.md

Skip when the project has no UI (record `skipped (no UI)`). Otherwise `docs/DESIGN.md` must exist when this step ends:

- A hand-written design file exists (for example a root `DESIGN.md` or a design-system doc): write `docs/DESIGN.md` from it in the template's format, name its path under `Based on`, and leave the original untouched.
- Otherwise extract tokens from the tailwind config, CSS variables, and theme files using `kit/templates/03c-design-system.md`, each token `from-code`.

Create no `docs/preview/`: the Design dispatch contract treats it as optional (`design_md_fallback`).

## Step 7 — Closeout

1. **AGENTS.md.** Create the root `AGENTS.md` from the survey and constitution (Commands from `## Verification Commands`), ending with the `## Workflow (craft-kit)` section from `kit/guides/conventions-detail.md` → "Project workflow block" (no version number). Without it a fresh session does not know `kit/` exists and codes backlog features directly. If `AGENTS.md` exists, show a diff and apply only on approval; never overwrite a hand-written file. Same rule for `CLAUDE.md` when one exists.
2. Run the Completion criteria below; every item must pass. Run `node kit/scripts/lint-docs.js` (conventions rule 11) and show warnings to you.
3. Write `docs/.craft-kit.json` from `kit/templates/craft-kit.json` with `recorded_by: adopt`, `kit_version` from `.craft-kit-version` in the installed kit directory, and `recorded_at` today (conventions rule 10).
4. Finalise `docs/adopt-session.md`.
5. Branch `chore/adopt-craftkit`, one commit (`adopt: add craft-kit documents`), then push and open a PR per the pre-flight, local-only fallback, and never-merge rules in `p2-07-ship.md`.
6. Emit the handoff prompt, brackets filled, for Phase 2, Maintenance (`kit/phase-maintenance.md`), or Bug Fix (`kit/phase-bug-fix.md`) as chosen, with the pinned install command `npx github:KhoaLy2003/craft-kit#v<kit_version>` (from `docs/.craft-kit.json`; `kit/` is git-ignored).

## Completion criteria

- [ ] All 7 steps are `complete` or `skipped` in `docs/adopt-session.md`; you approved the Steps 2, 3 and 4 gates
- [ ] `docs/architecture.md`, `constitution.md`, `roadmap.md`, `data-model.md`, `flows.md`, `MODELS.md` are `approved`; `docs/api.md` too, or the code exposes no API; `docs/DESIGN.md` too, or the skip is recorded
- [ ] `docs/backlog.json` passes `node kit/scripts/render-backlog.js` with exit 0 and you confirmed every `r0-baseline` feature
- [ ] Every MUST in the constitution has evidence (config file, or an observed ratio recorded in `docs/adopt/survey.md`)
- [ ] `AGENTS.md` at the project root has a meaningful project summary and the `## Workflow (craft-kit)` section
- [ ] `node kit/scripts/lint-docs.js` reports no errors
- [ ] The Phase 2 Docs preflight in `kit/phase-2.md` passes without any file written by hand
- [ ] Only `docs/`, `AGENTS.md`, `CLAUDE.md`, and `.gitignore` changed (plus `.test-accounts.json`, already ignored); source code untouched

## Transition

Done. Close this session; run the next workflow in a new one with the handoff prompt. Every `r0-baseline` feature is `shipped`, so Phase 2 has nothing to build until features are `pending`: choose `kit/phase-maintenance.md` (add a feature or fix a bug; it registers the feature) to add them, then `kit/phase-2.md` to build them, or `kit/phase-bug-fix.md` for a defect. Unsure: `kit/START.md`. Offer `kit/phase-onboarding.md` when a developer is about to join.

## Exceptions

- **Project already has some kit documents:** use `kit/phase-upgrade.md`; Adopt is for a codebase with no kit documents.
- **Monorepo:** one app or package per run; list it in the survey.
- **No tests, no CI, or no scripts:** the matching Verification Commands rows are `unknown` or `n/a — <reason>`; never guess common commands.
- **Existing hand-written `docs/architecture.md` or `docs/constitution.md`:** never overwrite. Write the draft to a `.generated.md` sibling, say so, and let the user merge.
