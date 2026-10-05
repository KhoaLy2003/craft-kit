# Templates

Most steps have a fill-in-the-blank template in `kit/templates/`. The agent fills these templates with content and saves the result to your project's `docs/` folder.

**Rule:** Copy templates into your project's `docs/`. Never edit files inside `kit/`.

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
| `templates/07-constitution.md` | `docs/constitution.md` | Agent | Phase 1 Step 7 |
| `templates/08-scaffold-checklist.md` | Used as a checklist in the session | Agent | Phase 1 Step 8 |
| `templates/e2e-tests.md` | `docs/E2E-TESTS.md` | Agent | Phase 2 Step 5 |

---

## Kickoff Template

The only template you fill in yourself. Copy it to `docs/phase-1-kickoff.md` before starting Phase 1. It asks for the idea, the target user, what you already have (a design file, a tech preference, prior research), whether to run market research, and any hard constraints. Rough notes are fine.

---

## For Existing Projects

When adopting the kit on an existing project, use the templates for the required files and fill them in manually (or ask the agent to extract from your existing codebase):

- `templates/07-constitution.md` → `docs/constitution.md`
- `templates/06-architecture.md` → `docs/architecture.md`
- `templates/03c-design-system.md` → `docs/DESIGN.md`
- `templates/04-roadmap.md` → `docs/roadmap.md`
- `templates/MODELS.md` → `docs/MODELS.md`

See [Existing Projects](/guides/existing-projects) for what each file must contain. `kit/guides/design-reference.md` ([Design Reference](/guides/design-reference)) is a full example of the target shape for `DESIGN.md`.
