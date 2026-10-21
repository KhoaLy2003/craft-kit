# Adopt — bring an existing codebase into the kit

> **Status: experimental — not yet validated in a test round.**
>
> **Run once per project**, from the project root, on a codebase that has no kit documents. Output: `docs/architecture.md`, `docs/constitution.md`, `docs/roadmap.md`, `docs/backlog.json`, `docs/data-model.md`, `docs/flows.md`, `docs/MODELS.md`, `AGENTS.md`, `docs/.craft-kit.json`, and `docs/DESIGN.md` when the project has a UI. Source code is never modified.

Universal rules (banner, gates, PROJECT_ROOT, fail-fast writes, file verification) are in `kit/orchestrator-conventions.md`. Session log: `docs/adopt-session.md`.

## Limitations (read before running)

- **Describes what exists.** Documents record the code as it is, including its debt. Nothing aspirational becomes a MUST rule without your approval.
- **Nothing is invented.** Every fact is labelled `from-code`, `from-docs`, or `unknown`.
- **Code beats docs.** A conflict is reported to you, never silently resolved.
- **Secrets stay out.** `.env*` files are read for variable names only.
- **Scope.** One repository, one deployable or one monorepo sharing a single `docs/`. Multi-repo systems: run once per repository; cross-service contract docs are out of scope.

## How to start

Send this to your AI, from the project root: `Run Adopt using kit/phase-adopt.md.`

What happens next: the AI surveys the repository read-only, then drafts each document from what it finds and puts every non-confirmed item to you at the hard gates (Steps 2, 3 and 4). You can answer Steps 2 and 3 together with the single reply "defaults". Nothing is written to `docs/` as `approved` until you approve it.

What to have ready: the answer to "which app or package?" if the repository is a monorepo, and your view of what the product's existing features are.

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

## Principles

Inherited from Onboarding and Docs Backfill:

- **Code beats docs.** A conflict between them is reported, never silently resolved.
- **Nothing is invented.** What cannot be determined is `unknown`.
- **Every fact is labelled** `from-code`, `from-docs`, or `unknown` (survey template: `kit/templates/adopt-survey.md`).
- **Commands are copied verbatim** from scripts, Makefile, or CI config, never reconstructed.
- **`.env*` files are read for variable names only.**
- **Source code is never modified** and nothing is refactored.

## Before Step 1

1. Apply Universal Rule 9 (git hygiene) from `kit/orchestrator-conventions.md`: a git repo exists and `.gitignore` holds `kit/` and `.test-accounts.json`, verified.
2. Create `docs/adopt-session.md` per `kit/session-logging.md`.
3. Skills and agents are not needed beyond the general-purpose agent, except `archify` if diagrams are rendered (conventions rule 8).
4. Monorepo: ask which app or package to cover, as Step 1 of `kit/phase-onboarding.md` does.

## Step 1 — Survey

Read-only static analysis by one general-purpose agent carrying `PROJECT_ROOT`. Fill `kit/templates/adopt-survey.md` into `docs/adopt/survey.md`: stack and versions, folder layout, scripts and how to build, lint, typecheck, test and start, CI, test setup, environment variable names, existing docs (README, ADRs, wikis in the repo), commit and branch conventions, monorepo or not, and the observed-conventions evidence used in Step 3. Large repositories: take a controlled file sample (by directory) and record the sample size and what was not sampled. Present a short summary; advance unless the user asks for changes.

## Step 2 — Architecture (as-is) (hard gate)

Draft `docs/architecture.md` from `kit/templates/06-architecture.md` describing the system as it is. Set `Provenance: reverse-engineered (Adopt)`. Do not apply the stack catalog or its deviation triggers: the stack is whatever the code uses. Record technical debt and every `unknown` item in the document. Label facts as in the survey. Conflicts between docs and code are listed separately. NFR lines in decisions are filled only where the code or docs show them, otherwise `unknown`.

Gate summary: *"The architecture records [stack] as built, with [k] debt items and [u] unknowns. Confirm it describes the system, or name what to correct. Reply 'defaults' to approve this and the constitution together."*

## Step 3 — Constitution from observed conventions (hard gate)

Draft `docs/constitution.md` from `kit/templates/07-constitution.md` with `Provenance: reverse-engineered (Adopt)`. Every MUST cites evidence: a config file (lint, format, compiler settings, CI check) or the observed ratio of files in the survey sample. Anything else is SHOULD, and aspirational rules are not written. Fill `## Verification Commands` by following Steps 1–2 of `kit/phase-verification-backfill.md` (sources are the survey's scripts and CI config); this gate is the review, so the module's own gate is not repeated. A rule whose evidence is thin is listed for you to decide.

Gate summary: *"[m] MUST rules each backed by config or observed usage, [s] SHOULD rules, and [v] of 8 verification commands found. Approve the constitution, or name a rule to change."*

If the user replied "defaults" at Step 2, set both documents `approved` on writing and still show both summaries.

## Step 4 — Baseline roadmap (hard gate)

1. Read the allowed values in `kit/scripts/render-backlog.js` (release status, priority, size, feature status, event types, event sources, event `by`) before writing, and follow the conventions of `kit/phase-roadmap-migrate.md` (Step 4: `schema_version`, `phase2_scope`, `admin_site`, event order, `status` matching the latest status event).
2. Infer features from routes, screens, and API surfaces found in the survey. Group them into one release `r0-baseline` with status `shipped`. Give each feature a short name, priority `Must`, a size estimate, `depends_on` where evident, `status: shipped`, `release: "r0-baseline"`, and events `created` then `shipped` with `by: "orchestrator"`. Because Adopt finds no date evidence, set `at: null` and `source: "unknown"` on both, with a `note` of `inferred by Adopt`; a date you supply is recorded with `source: "backfill-confirmed"` and `evidence: "user-supplied"`. The validator has no `backfill` source value; use only the values it lists.
3. Write `docs/roadmap.md` from `kit/templates/04-roadmap.md` with a short narrative, the feature table between the generated markers, and the `Non-functional Requirements` table: rows are filled only from evidence in the code or docs (for example an accessibility lint rule, a rate limiter), otherwise `unknown`. Set `Phase 2 Scope` using the rule in `kit/steps/phase-1/p1-04-roadmap.md`, with `feature` as the default for an adopted project.
4. Run `node kit/scripts/render-backlog.js`; it must exit 0. Fix from the printed errors and rerun.
5. Show the feature list and ask per feature: **keep / correct / drop**. Every `r0-baseline` feature is confirmed by you before approval.

Gate summary: *"The baseline has [N] features inferred from routes and screens, all marked shipped with unknown dates. Confirm the list, or name what to correct."*

## Step 5 — Backfill modules

Run the registry in `kit/phase-upgrade.md` (Detect, Confirm, Run). Expected: data-model and flows (`kit/phase-docs-backfill.md`), test accounts (`kit/phase-test-accounts-backfill.md`) when the project has test credentials, and verification (`kit/phase-verification-backfill.md`) only if Step 3 did not already write the section. Each module keeps its own limitations and gate; Adopt adds none. Do not run `kit/phase-roadmap-migrate.md`: Step 4 wrote the backlog.

## Step 6 — DESIGN.md

Skip when the project has no UI (record `skipped (no UI)`). Otherwise extract tokens from the tailwind config, CSS variables, and theme files into `docs/DESIGN.md` using `kit/templates/03c-design-system.md`, labelling each token `from-code`. Do not create `docs/preview/`: the Design dispatch contract in `kit/orchestrator-conventions.md` already has a `design_md_fallback` status.

## Step 7 — MODELS.md

Run the "Model tiers" section of `kit/phase-1-bootstrap.md`.

## Step 8 — AGENTS.md

Create the root `AGENTS.md` from the survey and the constitution; its Commands section comes from `## Verification Commands`. If an `AGENTS.md` exists, show a proposed diff and apply it only on your approval. Never overwrite a hand-written file.

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
4. Create branch `chore/adopt-craftkit`, commit everything in one commit (`adopt: add craft-kit documents`), then push and open a PR following the pre-flight, local-only fallback, and never-merge rules in `kit/steps/phase-2/p2-07-ship.md`.
5. Emit the handoff prompt with every bracket filled, for Phase 2, Phase 3 (`kit/phase-3-iterate.md`), or Bug Fix (`kit/phase-bug-fix.md`) as the user chooses. It includes the pinned install command `npx github:KhoaLy2003/craft-kit#v<kit_version>` (`kit_version` from `docs/.craft-kit.json`), because `kit/` is git-ignored and a fresh clone does not have it.

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
- **Monorepo:** cover one app or package per run; shared `docs/` keeps one set of documents, so list the covered package in the survey.
- **No tests, no CI, or no scripts:** the matching Verification Commands rows are `unknown` or `n/a — <reason>`; never guess common commands.
- **Existing hand-written `docs/architecture.md` or `docs/constitution.md`:** never overwrite. Write the draft to a `.generated.md` sibling, say so, and let the user merge.
- **Large repository:** split the survey by directory, sample files, and record the sample size.
