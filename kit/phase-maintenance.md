# Maintenance Workflow

> **Status:** experimental — not yet validated in a test round.
>
> **Use on a shipped application when you want to add a feature or fix a bug.** It asks which one, then routes: a bug goes to `kit/phase-bug-fix.md`; a feature is taken in, checked against the existing design, registered in `docs/backlog.json` and `docs/roadmap.md`, and built by Phase 2 (`kit/phase-2.md`, `scope: feature`). Maintenance never writes feature code.
>
> Prerequisites: a runnable application; `docs/backlog.json`, `docs/roadmap.md`, `docs/constitution.md`, `docs/architecture.md`. A missing data-model or flows document: see "Docs preflight" in `kit/phase-2.md`.

Universal rules: `kit/orchestrator-conventions.md`. Session log (feature path only): `docs/maintenance-session.md`, one section per feature (`## <feature-slug>`; `kit/session-logging.md`). The bug path writes no Maintenance log; `docs/bug-session.md` takes over.

**Resume.** A session that finds the feature's section in `docs/maintenance-session.md` with unfinished steps resumes per conventions rule 18; the feature slug is the Unit. `intake.md` with `Status: draft` means Step 2 is not approved.

## Steps

| Step | Name | Gate | Model | Agent | Output |
|---|---|---|---|---|---|
| 1 | Choose | none | balanced | orchestrator | the path: feature or bug |
| 2 | Intake | soft; hard if the feature does not fit | capable | orchestrator with the user | `docs/specs/<feature-slug>/intake.md` |
| 3 | Register | soft | balanced | orchestrator | feature and release in `docs/backlog.json`; release block in `docs/roadmap.md`; Phase 2 prompt |

The bug path runs Step 1 only.

---

## Step 1 — Choose | Gate: none

Ask exactly one question: *"Do you want to add a new feature or fix an existing bug?"* Accept nothing else; a request that names both is split, and the user picks which runs first.

- **Fix a bug.** Ask one follow-up if the report is missing: what is wrong and where. Print the prompt and stop; the user sends it in a new session: `Run the bug fix workflow using kit/phase-bug-fix.md. The problem is: <what is wrong and where>.`
- **Add a feature.** Continue with Step 2.
- Something shipped needs *different behavior* (not broken, not new): `kit/guides/evolving-specs.md`, then `kit/phase-2.md`.
- The core idea, audience or stack has fundamentally changed: a new project, `kit/phase-1-bootstrap.md`.

---

## Step 2 — Intake | Gate: soft (hard if the feature does not fit)

Collect what the feature is, and check it against what exists. Agree `<feature-slug>` (short kebab-case; Phase 2 derives the same slug from the feature name).

### Rules

- Create `docs/maintenance-session.md` (if absent) and a `## <feature-slug>` section from the Steps table above.
- **Ask in one round:**
  1. What the feature does, in the user's words.
  2. Who it is for and the value it gives.
  3. Which screens, data or existing features it touches, if known.
  4. Any feature it depends on, and any must-have constraint (deadline, compatibility).
  Ask nothing already answerable from `docs/`. "I don't know" is valid for item 3; the fit check fills it in.
- **Fit check.** Read `docs/architecture.md`, `docs/constitution.md`, `docs/data-model.md`, `docs/flows.md` and `docs/DESIGN.md` (those that exist). Classify the feature:

  | Result | Meaning | Gate |
  |---|---|---|
  | **Fits** | Uses the existing stack, services and auth model; screens follow `DESIGN.md`; data changes, if any, are within the existing model | soft |
  | **Extends** | Adds entities, fields or flows. Phase 2 Step 1 records them in `## Data & Flow Impact` and amends `docs/data-model.md` and `docs/flows.md` | soft |
  | **Does not fit** | Needs a new service or deployable, a new dependency of architectural weight, a change to the auth model or stack, or contradicts a constitution rule | hard |

- **Does not fit:** state which `architecture.md` or constitution item it breaks and offer: (a) amend that document first (mark `draft`, show the edit, restore `approved` after the user's explicit approval, refresh `Last updated`), then continue; (b) cut the feature down until it fits; (c) drop it. Wait for the user's choice before continuing.
- Compare against `docs/backlog.json`: if a `pending` or `deferred` feature already covers it, show it and ask whether to reuse that entry instead of adding one.
- If the feature is large (would be `L`-sized, or spans more than one domain), say so and offer to split it into separate runs of this workflow; one feature per run.

**Artifact:** `docs/specs/<feature-slug>/intake.md`. Preserve every field:

```markdown
# Feature Intake — [feature-slug]

**Status:** draft | approved
**Last updated:** YYYY-MM-DD
**Based on:** [docs read for the fit check]

**Feature:** [what it does]

**Value / audience:** [who and why]

**Touches:** [screens, entities, existing features]

**Depends on:** none | [feature IDs]

**Fit:** fits | extends | does not fit — [one-line reason; for `extends`, the entities or flows added; for `does not fit`, the choice made and the amended document]
```

### Completion criteria

- [ ] `intake.md` exists with every field filled and `Status: approved`
- [ ] The Fit result is recorded; a `does not fit` result carries the user's explicit choice
- [ ] `docs/maintenance-session.md` has the `## <feature-slug>` section with Step 2 recorded

**Gate summary:** *"Feature: [name] — [value]. Fit: [fits | extends | does not fit — reason]. Do you approve adding it to the backlog?"*

---

## Step 3 — Register | Gate: soft

Write the feature to the backlog and roadmap, then hand off to Phase 2.

### Rules

- **Append only.** Add a release entry (`id`, `name`, `status: planned`) and the feature (`release` set to that id, `status: pending`, `depends_on` from `intake.md`, a `created` event with `at`, `source: live`, `by: orchestrator`, `note`) to `docs/backlog.json`. IDs continue from the highest (`F11` → `F12`; releases likewise). Never renumber, edit or remove shipped features. Run `node kit/scripts/render-backlog.js`; never hand-edit the table.
- Add a `## Release <slug>` section to `docs/roadmap.md` below the template's final comment: the goal (the feature's value), the Build Order (the one feature), and the Impact (`intake.md` Fit line). Replace any "all features are shipped" sentence in the roadmap's Build Order section with a pointer to this block, so the roadmap never says nothing is left to build.
- Set `Phase 2 Scope` in `docs/roadmap.md` and `phase2_scope` in `docs/backlog.json` to `feature`.
- Refresh `Last updated` on `roadmap.md`; add `intake.md` to its `Based on`.
- Commit nothing; Phase 2 Ship commits `backlog.json` and the roadmap with the feature. (A handover makes a WIP commit, `kit/guides/session-handover.md`.)
- Print the Phase 2 prompt, then tell the user to close this session and open a new one for Phase 2: `Run Phase 2 using kit/phase-2.md for feature <F-id>.`

### Completion criteria

- [ ] The release and feature exist in `docs/backlog.json` with the next IDs; shipped features are unchanged; the render script exits 0
- [ ] `docs/roadmap.md` has the `## Release <slug>` block and `Phase 2 Scope: feature`
- [ ] `docs/maintenance-session.md` shows all steps complete for this feature
- [ ] The Phase 2 prompt was printed

**Gate summary:** *"[F-id] [name] is registered as pending in release [slug]. Start Phase 2 for it in a new session?"*

---

## Change control

When a registered feature is dropped, cancelled or changed before or during its build, read and follow `kit/guides/change-control.md`.

## Output Checklist

- [ ] Feature path: `docs/specs/<feature-slug>/intake.md` approved; `docs/backlog.json` updated and rendered; `docs/roadmap.md` release block; `docs/maintenance-session.md` shows every step complete
- [ ] Bug path: the bug-fix prompt was printed and no feature artifacts were written
