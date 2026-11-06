# Templates

Most steps have a fill-in-the-blank template in `kit/templates/`. The agent fills these templates and saves the result to your project's `docs/` folder. The only copy you make yourself is the kickoff form (see [Kickoff Template](#kickoff-template)).

**Rule:** Never edit files inside `kit/`; `--force` updates overwrite them.

---

## Templates

| Template | Output location | Filled by | Used in |
|---|---|---|---|
| `templates/phase-1-kickoff.md` | `docs/phase-1-kickoff.md` | **You** — before starting Phase 1 | Before Step 1 |
| `templates/MODELS.md` | `docs/MODELS.md` | Agent | Phase 1 "Model tiers" |
| `templates/01-idea-brief.md` | `docs/idea-brief.md` | Agent | Phase 1 Step 1 |
| `templates/02-market-notes.md` | `docs/market-notes.md` | Agent | Phase 1 Step 2 |
| `templates/03a-journey-map.md` | `docs/prototype/journey-map.md` | Agent | Phase 1 Step 3 |
| `templates/03b-prototype-brief.md` | `docs/prototype/prototype-brief.md` | Agent | Phase 1 Step 3 |
| `templates/03c-design-system.md` | `docs/DESIGN.md` | Agent | Phase 1 Step 3 |
| `templates/04-roadmap.md` | `docs/roadmap.md` | Agent | Phase 1 Step 4 |
| `templates/spec-screen.md` | `docs/specs/<slug>/screens/<screen-name>.md` | Agent | Phase 1 Step 5 |
| `templates/06-architecture.md` | `docs/architecture.md` | Agent | Phase 1 Step 6 |
| `templates/06b-data-model.md` | `docs/data-model.md` | Agent | Phase 1 Step 6 (Stage 4); Docs Backfill |
| `templates/06c-flows.md` | `docs/flows.md` | Agent | Phase 1 Step 6 (Stage 4); Docs Backfill |
| `templates/06d-api.md` | `docs/api.md` | Agent | API Backfill only; Phase 1 does not write an API document |
| `templates/known-issues.md` | `docs/known-issues.md` | Agent | Phase 2 Review / Ship |
| `templates/07-constitution.md` | `docs/constitution.md` | Agent | Phase 1 Step 7 |
| `templates/08-scaffold-checklist.md` | Used as a checklist in the session | Agent | Phase 1 Step 8 |
| `templates/backlog.json` | `docs/backlog.json` | Agent | Phase 1 Step 4 (feature list source; validated and rendered by `kit/scripts/render-backlog.js`) |
| `templates/backlog.html` | `docs/backlog.html` (generated, git-ignored) | Script | Rendered view of the backlog; never edit |
| `templates/test-accounts.json` | `.test-accounts.json` at the project root (git-ignored) | Agent | Any step that needs sign-in; see [Test Accounts](/guides/test-accounts) |
| `templates/spec.md` | `docs/specs/<slug>/spec.md` (or `docs/specs/spec.md` for scope `all`) | Agent | Phase 2 Step 1 |
| `templates/plan.md` | `docs/specs/<slug>/plan.md` (or `docs/specs/plan.md` for scope `all`) | Agent | Phase 2 Step 2 |
| `templates/e2e-tests.md` | `docs/E2E-TESTS.md` | Agent | Phase 2 Step 5 |
| `templates/onboarding.html` | `docs/ONBOARDING.html` | Agent | Developer Onboarding workflow |
| `templates/craft-kit.json` | `docs/.craft-kit.json` | Agent | Phase 1 Step 8, Adopt closeout, Project Upgrade report (records the kit version) |
| `templates/adopt-survey.md` | `docs/adopt/survey.md` | Agent | Adopt Step 1 |
| `templates/pr-description.md` | The pull request body | Agent | Phase 2 Step 7 (Ship) |

---

## Kickoff Template

The only template you fill in yourself. Copy it to `docs/phase-1-kickoff.md` before starting Phase 1. It asks for the idea, the target user, what you already have (a design file, a tech preference, prior research), the source mode (`idea`, or `requirements` when you already have a BRD, PRD, SRS or tickets), whether to run market research, and any hard constraints. Rough notes are fine.

---

## For Existing Projects

The fastest route is the Adopt workflow (`kit/phase-adopt.md`), which reads your code and writes these documents for you; see [Adopt](/phases/adopt). To do it by hand instead, use the templates for the required files and fill them in manually (or ask the agent to extract from your existing codebase):

- `templates/07-constitution.md` → `docs/constitution.md`
- `templates/06-architecture.md` → `docs/architecture.md`
- `templates/03c-design-system.md` → `docs/DESIGN.md`
- `templates/04-roadmap.md` → `docs/roadmap.md`
- `templates/MODELS.md` → `docs/MODELS.md`

See [Existing Projects](/guides/existing-projects) for what each file must contain. `kit/guides/design-reference.md` ([Design Reference](/guides/design-reference)) is a full example of the target shape for `DESIGN.md`.
