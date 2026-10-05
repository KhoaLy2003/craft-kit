# Phase 3 — Iterate

> **Status:** experimental — not yet validated in a test round.
>
> **Use after a release has shipped and you want to improve the product — with ideas or without.** Output is a new release block in `docs/roadmap.md`; features are then built with Phase 2 (`kit/phase-2.md`, `scope: feature`). Phase 3 never writes feature code.
>
> Prerequisites: a shipped (or runnable) application; `docs/roadmap.md`, `docs/constitution.md`, `docs/architecture.md`, `docs/DESIGN.md`.

Universal rules (banner, gates, PROJECT_ROOT, fail-fast writes, file verification) are in `kit/orchestrator-conventions.md`. Session log: `docs/phase-3-session.md`, one section per release (`kit/session-logging.md`). Agree `<release-slug>` with the user before Step 1 (e.g. `r2-growth`); it names the folder `docs/iterations/<release-slug>/`.

## Steps

| Step | Name | Gate | Model | Agent | Output |
|---|---|---|---|---|---|
| 1 | Discover | soft | capable | `brainstorming`; `market-researcher` / `research-analyst` when the user has few ideas | `docs/iterations/<release-slug>/discover.md` |
| 2 | Prioritise | hard | capable | orchestrator with the user | new release block in `docs/roadmap.md` |
| 3 | Handoff | soft | balanced | orchestrator; general-purpose agent (read-only impact check) | impact section in the release block; Phase 2 handoff prompt |

## When to Use Phase 3

| Situation | Use |
|---|---|
| Something shipped is broken | `kit/phase-bug-fix.md` |
| One shipped feature needs different behavior | `kit/guides/evolving-specs.md`, then `kit/phase-2.md` |
| One known new feature that fits the architecture | Add a row to `docs/roadmap.md`, then `kit/phase-2.md` |
| Need to decide **what** to build next | **This phase** |
| Core idea, audience, or stack has fundamentally changed | New project: `kit/phase-1-bootstrap.md` |

---

## Step 1 — Discover | Gate: soft

Establish what the product does today and what evidence exists, then produce a short, evidence-backed candidate list.

**Inputs:** `docs/roadmap.md` (shipped, deferred, `Could` / `Won't` rows), `docs/specs/`, `docs/specs/bugs/`, `docs/idea-brief.md`, `docs/market-notes.md`, `docs/prototype/journey-map.md` (where present), user-supplied evidence (feedback, support requests, analytics, interviews, usage notes).

### Rules

- Read `roadmap.md` and `docs/specs/` before asking questions, so questions cover gaps rather than documented facts.
- Ask one at a time, before writing anything: (1) the goal of this release, (2) what evidence exists, (3) whether the user already has feature ideas. Record (3) as `ideas: yes | no | partial`. "No evidence, no ideas" is valid input; do not block on it and do not invent evidence — record "none".
- **Path A (`yes`)**: capture each idea, ask until the problem it solves is stated, then add it as a candidate. Offer Path B sources as extras if `partial`.
- **Path B (`no`/`partial`)**: mine these sources and name the source for each candidate: (1) deferred / `Could` / `Won't` roadmap rows, (2) pain points in the user's evidence, (3) known defects and debt blocking the goal, (4) manual, weak, or missing steps in the journey map, (5) a competitor and trend scan via `market-researcher` with `market-notes.md` as baseline — only if the user approves the cost.
- A candidate needs an ID (`C01…`), a one-line description, the user problem it solves, a source, evidence or a `hypothesis` label (never present a trend guess as evidence), size (S / M / L), and whether it likely touches existing architecture. A candidate without a problem and a source is not a candidate. Maximum 10; fewer well-evidenced ones beat a long speculative list.
- Discuss candidates with the user before writing the file. Do not rank or choose (Step 2) and do not write specs or designs.
- A candidate that is really a bug goes to `kit/phase-bug-fix.md`; note it in `discover.md`.
- Dispatch research subagents per the PROJECT_ROOT and fail-fast write rules.

**Artifact:** `docs/iterations/<release-slug>/discover.md` with the standard metadata header (`Status`, `Last updated`, `Based on`) and sections: Shipped State, Evidence, Known Defects & Debt, Release Goal (user's own words), Idea Status, Candidates (table), Considered and Dropped (with reasons).

### Completion criteria

- [ ] `discover.md` has all sections and 1–10 candidates, each with problem, source, size, evidence/hypothesis label
- [ ] The user has seen the candidate list and added, removed, or accepted it

**Gate summary:** *"Release goal: [goal]. I found [N] candidates, [k] evidence-backed and [m] hypotheses. Ready to prioritise which enter the roadmap?"*

### Exceptions

- Product never shipped, or `roadmap.md` has unfinished Must features: stop and finish Phase 2 first.
- No `docs/` artifacts (built outside the kit): dispatch a general-purpose agent to reverse-write minimal `roadmap.md`, `architecture.md`, `constitution.md` from the codebase; get the user's approval of each before continuing.
- Nothing credible found (no evidence, nothing deferred, no ideas): say so, recommend gathering usage evidence first, end Phase 3 as `blocked`. Do not manufacture candidates.
- A candidate changes the product's core idea: flag it; it may belong in a new project.

---

## Step 2 — Prioritise | Gate: hard

Choose, rank, and commit candidates as a new release block in `docs/roadmap.md`. No subagent.

**Inputs:** `discover.md` (release goal, candidates), `docs/roadmap.md`, `kit/templates/04-roadmap.md`.

### Rules

- Present candidates as a table (impact, size, evidence, dependencies) with a recommended cut line. The orchestrator recommends; the user decides.
- Score impact vs. size against the release goal and assign MoSCoW. Only `Must` features are guaranteed this release; `Should` / `Could` are explicit stretch.
- Prefer a small release. If the selection exceeds roughly 5 `Must` features or includes an `L` feature, propose splitting into two releases.
- **Append only.** Add a `## Release <slug>` section; never renumber, edit, or reorder shipped rows. Feature IDs continue the existing sequence (roadmap ends at `F11` → start at `F12`).
- The block uses the original Feature List columns (`ID | Feature | Priority | Size | Depends on | Status`), all `pending`, plus Build Order and Deferred subsections (unselected candidates with reasons). Set `Phase 2 Scope: feature`.
- Mark the block `draft` until approved; refresh `Last updated`; add `discover.md` to `Based on`; restore roadmap `Status: approved` only after approval.

### Completion criteria

- [ ] Release block exists with IDs continuing the sequence; each feature traces to a candidate and the release goal
- [ ] Build order respects dependencies; unselected candidates are in Deferred with reasons
- [ ] Shipped rows are byte-for-byte unchanged
- [ ] The user explicitly approved the scope

**Gate summary:** *"This release commits [N] features — [list] — to serve '[goal]'. [M] candidates are deferred. Do you approve this scope?"*

### Exceptions

- User wants everything: show the summed cost against the goal; if they insist, record the decision and split into sequential releases.
- Zero features selected: end Phase 3 as `complete` with no roadmap change; record the reason in the session log.

---

## Step 3 — Handoff | Gate: soft

Check whether the new features invalidate the existing foundations, then hand off to Phase 2.

**Inputs:** the new release block, `docs/architecture.md`, `docs/constitution.md`, `docs/DESIGN.md`.

### Rules

- Dispatch a general-purpose agent read-only to check each new feature for: a new dependency, service, data-model or auth change, a new design component, or a rule exception.
- Record the result as an **Impact** section inside the release block of `docs/roadmap.md`: a table of feature × {architecture, constitution, design} with `none | amend` and a one-line reason. No separate file.
- If any verdict is `amend`: present the minimal amendments, each tagged with the feature requiring it; apply only after explicit user approval; keep `Status: approved` and refresh `Last updated`. Amend only what a selected feature cannot be built without. A new stack choice follows `kit/stack-catalog.md` and `kit/steps/phase-1/p1-06-architecture.md`.
- Large impact (new stack, new auth model, data migration): make the foundation change its own feature at the head of the build order, with its own spec and migration plan.
- An amendment that contradicts a constitutional rule fundamental to the product: stop and surface it; the user chooses between dropping the feature and amending the constitution explicitly.
- If 2+ new features need screen designs and have none, run Phase 1 Step 5 as a re-entry for them (`kit/steps/phase-1/p1-05-screen-design.md`, "Re-entry for new features") before Phase 2.
- Emit the Phase 2 handoff prompt: `kit/phase-2.md`, project name, release slug, `scope: feature`, and the first pending feature in the build order.

### Completion criteria

- [ ] Impact section present in the release block with a verdict for every new feature
- [ ] Any amendments applied with approval, or none needed
- [ ] Phase 2 handoff prompt emitted; session log shows Phase 3 `complete`

**Gate summary (only when amendments exist):** *"The new features require these changes to existing foundations: [list]. Approve them so Phase 2 can build on them?"*

---

## Output Checklist

- [ ] `docs/iterations/<release-slug>/discover.md`
- [ ] `docs/roadmap.md`: approved release block with Impact section
- [ ] Foundation documents amended only if required, with approval
- [ ] `docs/phase-3-session.md` shows all three steps complete
