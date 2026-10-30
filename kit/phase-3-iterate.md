# Phase 3 — Iterate

> **Status:** experimental — not yet validated in a test round.
>
> **Use after a release has shipped, when new requirements arrive, or to improve the product on your own evidence or ideas.** It runs again for every new batch. Output: a new release in `docs/backlog.json`, a release block in `docs/roadmap.md`, and **one approved design for the whole wave** (data model, flows, architecture, screens, shared data points), split into work packages that Phase 2 builds, possibly in parallel (`kit/phase-2.md`, `scope: feature`). Phase 3 never writes feature code.
>
> Prerequisites: a shipped (or runnable) application; `docs/backlog.json`, `docs/roadmap.md`, `docs/constitution.md`, `docs/architecture.md`, `docs/data-model.md`, `docs/flows.md`, `docs/DESIGN.md`. A missing data-model or flows document: see "Docs preflight" in `kit/phase-2.md`.

Universal rules: `kit/orchestrator-conventions.md`. Session log: `docs/phase-3-session.md`, one section per release (`kit/session-logging.md`). Agree `<release-slug>` (e.g. `r2-growth`) before Step 1; it names `docs/iterations/<release-slug>/`.

## Steps


| Step | Name       | Gate | Model    | Agent                                                        | Output                                                                              |
| ---- | ---------- | ---- | -------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------- |
| 1    | Discover   | soft | capable  | `brainstorming`                                              | `docs/iterations/<release-slug>/discover.md`                                        |
| 2    | Prioritise | hard | capable  | orchestrator with the user                                   | new release and features in `docs/backlog.json`; release block in `docs/roadmap.md` |
| 3    | Design     | hard | capable  | orchestrator; general-purpose agents (one per document); Phase 1 Step 5 re-entry for screens | `docs/iterations/<release-slug>/design.md`; amended foundation documents; Shared Surface table and Amendment log in the release block |
| 4    | Handoff    | soft | balanced | orchestrator                                                 | Work Packages table in the release block; design commit; Phase 2 prompts           |
| 5    | Closeout   | soft | balanced | orchestrator                                                 | outcome section in the release block; leftover features resolved                    |


## When to Use Phase 3


| Situation                                               | Use                                                                                                                                         |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Something shipped is broken                             | `kit/phase-bug-fix.md`                                                                                                                      |
| One shipped feature needs different behavior            | `kit/guides/evolving-specs.md`, then `kit/phase-2.md`                                                                                       |
| One known new feature that fits the architecture        | Direct path: add a `planned` release entry and the feature (`pending`, `release` set to that entry) to `docs/backlog.json`, run `node kit/scripts/render-backlog.js`, set Phase 2 Scope to `feature`, then `kit/phase-2.md`. Impact is not checked. |
| Need to decide **what** to build next                   | **This phase**                                                                                                                              |
| Core idea, audience, or stack has fundamentally changed | New project: `kit/phase-1-bootstrap.md`                                                                                                     |


---

## Step 1 — Discover | Gate: soft

Establish what the product does today and what evidence exists, then produce a short, evidence-backed candidate list.

**Inputs:** `docs/backlog.json` (shipped, deferred, `Could` / `Won't` features), `docs/roadmap.md`, `docs/specs/`, `docs/specs/bugs/`, `docs/idea-brief.md`, `docs/market-notes.md`, `docs/prototype/journey-map.md` (where present), user-supplied evidence (feedback, support requests, analytics, interviews, usage notes).

### Rules

- Read `docs/backlog.json`, `roadmap.md` and `docs/specs/` first, so questions cover gaps, not documented facts.
- Ask one at a time, before writing: (1) the release goal, (2) requirements received from customers or stakeholders (who, what, why), (3) other evidence, (4) the user's own feature ideas (record `ideas: yes | no | partial`). "None" is valid; never invent evidence.
- **Path R (requirements received)**: default when (2) is not empty. Capture each in the requester's words; ask until the underlying problem and a first acceptance hint ("how will they know it works?") exist. Merge requirements describing one problem; split one hiding several. Record `Requested by`.
- **Path A (`yes`)**: capture each idea; ask until its problem is stated; add as a candidate. Offer Path B sources as extras if `partial`.
- **Path B (`no`/`partial`)**: mine and name the source for each candidate: (1) deferred / `Could` / `Won't` features, (2) pain points in the evidence, (3) defects and debt blocking the goal, (4) weak or missing journey-map steps, (5) a competitor/trend scan by the general-purpose agent with `market-notes.md` as baseline, only if the user approves the cost.
- A candidate needs: ID (`C01…`), one-line description, the user problem, a source (a requirement counts; name `Requested by`), evidence or a `hypothesis` label, size (S / M / L), and whether it likely touches existing architecture. No problem or source, no candidate. Maximum 10; fewer well-evidenced beats a long speculative list.
- Discuss candidates before writing the file. Do not rank (Step 2) or write specs/designs. A candidate that is a bug goes to `kit/phase-bug-fix.md`; note it in `discover.md`.

**Artifact:** `docs/iterations/<release-slug>/discover.md` with the standard metadata header (`Status`, `Last updated`, `Based on`) and sections: Shipped State, Requirements Received (requester, original wording, date), Evidence, Known Defects and Debt, Release Goal (user's own words), Idea Status, Candidates (table, with `Requested by`), Considered and Dropped (with reasons).

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

Choose, rank, and commit candidates as a new release in `docs/backlog.json`, with its `## Release <slug>` block in `docs/roadmap.md`. No subagent.

**Inputs:** `discover.md` (release goal, candidates), `docs/backlog.json`, `docs/roadmap.md`, `kit/templates/04-roadmap.md`.

### Rules

- Present candidates as a table (impact, size, evidence, dependencies) with a recommended cut line. The orchestrator recommends; the user decides.
- Score impact vs. size against the release goal and assign MoSCoW. Only `Must` features are guaranteed this release; `Should` / `Could` are explicit stretch.
- Prefer a small release: beyond roughly 5 `Must` features or any `L` feature, propose splitting into two releases.
- **Append only, after approval.** Write nothing to `docs/backlog.json` until the scope is approved. Then append the release entry (`status: planned`) and its features (`pending`, a `created` event with `source: live`, `by: orchestrator`); never renumber, edit, or remove shipped features. IDs continue from the highest (`F11` → `F12`). Run `node kit/scripts/render-backlog.js`; never hand-edit the table.
- Add a `## Release <slug>` section to `docs/roadmap.md` (Build Order, Deferred with reasons, Impact prose). Set top-level `Phase 2 Scope` and `phase2_scope` in `docs/backlog.json` to `feature` with the release; no second scope field in the block.
- Mark the block `draft` until approved; refresh `Last updated`; add `discover.md` to `Based on`; restore roadmap `Status: approved` only after approval.

### Completion criteria

- [ ] Release entry and features exist in `docs/backlog.json` with IDs continuing the sequence; each feature traces to a candidate and the release goal
- [ ] Build order respects dependencies; unselected candidates are in Deferred with reasons
- [ ] Shipped features are unchanged in `docs/backlog.json`; the render script exits 0
- [ ] The user explicitly approved the scope

**Gate summary:** *"This release commits [N] features — [list] — to serve '[goal]'. [M] candidates are deferred. Do you approve this scope?"*

### Exceptions

- User wants everything: show the summed cost against the goal; if they insist, record the decision and split into sequential releases.
- Zero features selected: end Phase 3 as `complete` with no roadmap change; record the reason in the session log.
- The user later drops every feature of the release before any ships: set the release `status: cancelled` in `docs/backlog.json` and follow `kit/guides/change-control.md`.

---

## Step 3 — Design | Gate: hard

Design the whole wave before any feature is built, so every feature starts from one agreed design and two features touching the same data cannot collide later.

**Inputs:** the release block and `discover.md`; `docs/architecture.md`, `docs/constitution.md`, `docs/DESIGN.md`, `docs/data-model.md`, `docs/flows.md`; existing `docs/designs/` and `docs/prototype/`.

### Rules

- Design every feature approved in Step 2, and only those. Deferred candidates are not designed.
- Dispatch a general-purpose agent read-only first to check each feature for a new dependency, service, data-model or auth change, design component, or rule exception, and classify its **design delta**: `none | data-only | flow | screens`. Record an **Impact** table in the release block: feature × {architecture, constitution, design, data-model, flows, NFR} with `none | amend` and a one-line reason (NFR: whether a roadmap NFR row is added or changed), plus `Design delta`.
- Then write the proposed design for all features at once to `docs/iterations/<release-slug>/design.md` (standard metadata header; `Status: draft`), one section per foundation document: **data model** (entities, fields, relationships, ER changes), **flows** (new and changed flows, transitions, cross-feature hand-offs, screen inventory), **architecture / constitution / design system** (dependencies, services, auth, rules, tokens and components), and **screens** (which features get designs). Dispatch one general-purpose agent per document; the orchestrator reconciles so no two agents edit the same file.
- **Shared Surface.** List every data point touched by two or more features (an entity or field, table, route, event, screen, or environment variable) in a table in the release block: `Item | Owner feature | Other features (read / write) | Rule`. Each item has one owner (the feature that creates or migrates it); others use it through the owner's contract in `design.md` and never create or alter it. If two features write a field, decide the conflict rule here (ordering, last write wins, versioning, locking). Check every feature pair, list contradictions, and resolve them before the gate.
- Screens: features classified `screens` without designs go through Phase 1 Step 5 re-entry (`p1-05-screen-design.md`, "Re-entry for new features") as one batch before the gate; the user may accept the `docs/DESIGN.md` fallback for a simple feature (record it in Impact).
- Large impact (new stack, auth model, data migration): make it its own feature at the head of the build order, with its own spec and migration plan.
- A change contradicting a fundamental constitutional rule: stop; the user chooses to drop the feature or amend the constitution explicitly. A new stack follows `kit/stack-catalog.md` and `p1-06-architecture.md`.
- **Write nothing to a foundation document before approval.** Then apply `design.md` to `docs/data-model.md`, `docs/flows.md`, `docs/architecture.md`, `docs/constitution.md`, and `docs/DESIGN.md` (keep `Status: approved`, refresh `Last updated`; `Last amended` for the constitution; `DESIGN.md` has no header), re-render affected diagrams (`kit/guides/diagrams.md`), and set `design.md` to `approved`. Log every applied item in an **Amendment log** in the release block (feature(s), file, one-line change) so cancelling a feature can reverse it.
- Phase 2 Step 1 then finds the wave design in the documents and only checks the feature's slice.

### Completion criteria

- [ ] `design.md` covers every selected feature and every foundation document it changes; Impact section and Shared Surface table are in the release block
- [ ] Every Shared Surface item has exactly one owner and a conflict rule where two features write it
- [ ] Every `screens` feature has designs, or the fallback is recorded
- [ ] The user approved the design as one wave; foundation documents are amended; every applied item is in the Amendment log

**Gate summary:** *"The design for [N] features changes: [data model: entities], [flows], [architecture], [screens]. [S] data points are shared between features, each with one owner. Approve this design as the single basis for building all of them?"*

---

## Step 4 — Handoff | Gate: soft

Turn the approved design into work that developers can pick up independently, and publish the design so every branch starts from it.

**Inputs:** the release block (Build Order, Shared Surface, Impact), `design.md`, `docs/backlog.json`.

### Rules

- Add a **Work Packages** table to the release block: `Feature | Depends on | Owns (Shared Surface items) | Group | Branch`. A **group** is a set of features buildable at the same time: each depends only on earlier groups and none needs another's *code* (design, schema, and contracts are fixed in Step 3); a feature needing built code goes in a later group. Same-group features must not own the same Shared Surface item.
- Commit the design: branch `design/<release-slug>`, commit `design.md`, the amended foundation documents, the release block, and `docs/backlog.*`, then push and open a PR per the pre-flight, confirmation, and local-only fallback in `p2-07-ship.md`. Feature branches start from `main` after that PR merges (from `design/<release-slug>` if local-only).
- Emit one Phase 2 handoff prompt per first-group feature (`kit/phase-2.md`, project name, `scope: feature`, feature ID); each can run in its own session, worktree, or developer. Emit a later group's prompts when the earlier groups have `shipped` and merged (or the later feature branches from the earlier one, `p2-03-implement.md`). Phase 2 reads the Work Packages table and `docs/backlog.json`; the prompt is a hint.
- **Design change requests.** If a Phase 2 cycle needs an entity, field, screen, or contract the wave design lacks, it stops and returns here: update `design.md`, the foundation documents, the Shared Surface table, and the Amendment log; list the features using the changed items (they re-check their spec slice); get approval. Never patch a shared item inside one feature.

### Completion criteria

- [ ] Work Packages table present, with a group for every feature and no shared owner within a group
- [ ] The design commit exists on `design/<release-slug>` (pushed and PR open, or the local-only fallback recorded)
- [ ] Phase 2 handoff prompts emitted for the first group; session log shows Step 4 `complete` (Phase 3 stays open until Step 5 Closeout)

---

## Step 5 — Closeout | Gate: soft

Runs when Phase 2 reports the release complete (its Ship step marked the release `shipped`), or when the user ends the release early. It closes the loop so the next round starts from facts.

**Inputs:** the release block, `docs/backlog.json`, `docs/phase-2-session.md`, `discover.md`.

### Rules

- List every feature of the release with its final status (`shipped`, `cancelled`, `deferred`, or `pending` stretch). Do not change a shipped feature.
- For each `pending` feature left (Should / Could stretch), the user chooses: keep it as `pending` in this release's record for a later round, or move it to `deferred` (append a `deferred` event, set `release: null`).
- Add an **Outcome** section to the release block: the release goal against what shipped, shipped features with their PR references, cancelled features with reasons, and any feedback the user has since the release. Ask the user for that feedback; record "none" if there is none.
- Closing the release does not start the next one. Tell the user that new requirements start a new Phase 3 round with a new `<release-slug>`.
- Append the Closeout result to `docs/phase-3-session.md`.

### Completion criteria

- [ ] Every feature in the release has a final status; no `in-progress` feature remains
- [ ] Outcome section present in the release block
- [ ] Leftover `pending` features resolved; render script exits 0

**Gate summary:** *"Release [slug]: [n] shipped, [c] cancelled, [d] deferred. Goal '[goal]' was [met | partly met | not met]. Anything left pending moves as you chose. Ready to close it?"*

---

## Change control — when scope changes after Step 2

When a feature is dropped, cancelled, or changed after the Prioritise gate (including mid-build), read and follow `kit/guides/change-control.md`.

---

## Output Checklist

- [ ] `docs/iterations/<release-slug>/discover.md` and `design.md`
- [ ] `docs/backlog.json` updated and rendered; `docs/roadmap.md`: approved release block with Impact, Shared Surface, Amendment log, Work Packages, and (after Closeout) Outcome section
- [ ] Foundation documents amended once, from the approved wave design, with every applied item logged against its feature
- [ ] `docs/phase-3-session.md` shows all five steps complete