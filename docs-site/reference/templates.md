# Templates

Every Phase 1 step has a corresponding fill-in-the-blank template in `kit/templates/`. The agent fills these templates with content and saves the result to your project's `docs/` folder.

**Rule:** Copy templates to your project root. Never edit files inside `kit/`.

---

## Phase 1 Templates

| Template | Output location | Filled by | Step |
|---|---|---|---|
| `templates/phase-1-kickoff.md` | Project root | **You** — before starting Phase 1 | Before Step 1 |
| `templates/01-idea-brief.md` | `docs/idea-brief.md` | Agent | Step 1 |
| `templates/02-market-notes.md` | `docs/market-notes.md` | Agent | Step 2 |
| `templates/03-tech-options.md` | `docs/tech-options.md` | Agent | Step 3 |
| `templates/04a-journey-map.md` | `docs/prototype/journey-map.md` | Agent | Step 4 |
| `templates/04b-prototype-brief.md` | `docs/prototype/prototype-brief.md` | Agent | Step 4 |
| `templates/05-design-system.md` | `docs/design-system.md` | Agent | Step 5 |
| `templates/06-roadmap.md` | `docs/roadmap.md` | Agent | Step 6 |
| `templates/07-architecture.md` | `docs/architecture.md` | Agent | Step 7 |
| `templates/08-constitution.md` | `docs/constitution.md` | Agent | Step 8 |
| `templates/09-scaffold-checklist.md` | Used as checklist in session | Agent | Step 9 |

---

## Kickoff Template

The only template you fill in yourself. Copy it to your project root before starting Phase 1.

```markdown
# Phase 1 Kickoff

## Idea
[One paragraph: what problem you're solving, for whom, and what solution you have in mind]

## Target User
[Who uses this, their context, their current pain point]

## Existing Assets
[Design files, brand guide, tech preferences, any existing code]

## Hard Constraints
[Stack requirements, budget, timeline, compliance]

## Steps to Skip
[List any Phase 1 steps you want to bypass and why]
```

---

## For Existing Projects

When adopting the kit on an existing project, use the templates for the four required files and fill them in manually (or ask the agent to extract from your existing codebase):

- `templates/08-constitution.md` → `docs/constitution.md`
- `templates/07-architecture.md` → `docs/architecture.md`
- `templates/05-design-system.md` → `docs/design-system.md`
- `templates/06-roadmap.md` → `docs/roadmap.md`

See [Existing Projects](/guides/existing-projects) for what each file must contain.

---

## Samples

The `kit/samples/` directory contains reference examples:

| Sample | Purpose |
|---|---|
| `samples/DESIGN.md` | Airbnb-style design system in the expected format — use as the Step 5 import path source |

If you have an existing design system in a different format, use `samples/DESIGN.md` as the target shape to normalize into.
