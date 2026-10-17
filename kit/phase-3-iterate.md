# Phase 3 — Iterate

> **Status:** experimental — not yet validated in a test round.
>
> **Use after a release has shipped, when customers or stakeholders send new requirements, or when you want to improve the product on your own evidence or ideas.** Phase 3 is the recurring change cycle: it runs again for every new batch of requirements. Output is a new release in `docs/backlog.json`, a release block in `docs/roadmap.md`, and **one approved design for the whole wave** (data model, flows, architecture, screens, and the data points features share), split into work packages that Phase 2 builds, possibly in parallel (`kit/phase-2.md`, `scope: feature`). Phase 3 never writes feature code. The one-time Phase 1 steps (ideation, market research, prototype, scaffold) are not repeated.
>
> Prerequisites: a shipped (or runnable) application; `docs/backlog.json`, `docs/roadmap.md`, `docs/constitution.md`, `docs/architecture.md`, `docs/data-model.md`, `docs/flows.md`, `docs/DESIGN.md`. A missing data-model or flows document: see "Docs preflight" in `kit/phase-2.md`.

Universal rules (banner, gates, PROJECT_ROOT, fail-fast writes, file verification) are in `kit/orchestrator-conventions.md`. Session log: `docs/phase-3-session.md`, one section per release (`kit/session-logging.md`). Agree `<release-slug>` with the user before Step 1 (e.g. `r2-growth`); it names the folder `docs/iterations/<release-slug>/`.

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
| One known new feature that fits the architecture        | Direct path: add a `planned` release entry and the feature (`pending`, `release` set to that entry) to `docs/backlog.json`, run `node kit/scripts/render-backlog.js`, set Phase 2 Scope to `feature`, then `kit/phase-2.md`. Impact is not checked; see `kit/steps/phase-2/p2-07-ship.md`. |
| Need to decide **what** to build next                   | **This phase**                                                                                                                              |
| Core idea, audience, or stack has fundamentally changed | New project: `kit/phase-1-bootstrap.md`                                                                                                     |


---

## Step 1 — Discover | Gate: soft

Establish what the product does today and what evidence exists, then produce a short, evidence-backed candidate list.

**Inputs:** `docs/backlog.json` (shipped, deferred, `Could` / `Won't` features), `docs/roadmap.md`, `docs/specs/`, `docs/specs/bugs/`, `docs/idea-brief.md`, `docs/market-notes.md`, `docs/prototype/journey-map.md` (where present), user-supplied evidence (feedback, support requests, analytics, interviews, usage notes).

### Rules

- Read `docs/backlog.json`, `roadmap.md` and `docs/specs/` before asking questions, so questions cover gaps rather than documented facts.
- Ask one at a time, before writing anything: (1) the goal of this release, (2) whether customers or stakeholders have sent requirements (who, what, why), (3) what other evidence exists, (4) whether the user has their own feature ideas. Record (4) as `ideas: yes | no | partial`. "No requirements, no evidence, no ideas" is valid input; do not block on it and do not invent evidence — record "none".
- **Path R (requirements received)**: the default when (2) is not empty. Capture each requirement in the requester's words, then ask until the problem behind it is stated and a first acceptance hint exists ("how will they know it works?"). Several requirements that describe one problem become one candidate; one requirement that hides several problems becomes several. Record who asked in `Requested by`.
- **Path A (`yes`)**: capture each idea, ask until the problem it solves is stated, then add it as a candidate. Offer Path B sources as extras if `partial`.
- **Path B (`no`/`partial`)**: mine these sources and name the source for each candidate: (1) deferred / `Could` / `Won't` features from `docs/backlog.json`, (2) pain points in the user's evidence, (3) known defects and debt blocking the goal, (4) manual, weak, or missing steps in the journey map, (5) a competitor and trend scan via the general-purpose agent with `market-notes.md` as baseline — only if the user approves the cost.
- A candidate needs an ID (`C01…`), a one-line description, the user problem it solves, a source (a requirement counts as a source; name `Requested by`), evidence or a `hypothesis` label (never present a trend guess as evidence), size (S / M / L), and whether it likely touches existing architecture. A candidate without a problem and a source is not a candidate. Maximum 10; fewer well-evidenced ones beat a long speculative list.
- Discuss candidates with the user before writing the file. Do not rank or choose (Step 2) and do not write specs or designs.
- A candidate that is really a bug goes to `kit/phase-bug-fix.md`; note it in `discover.md`.
- Dispatch research subagents per the PROJECT_ROOT and fail-fast write rules.

**Artifact:** `docs/iterations/<release-slug>/discover.md` with the standard metadata header (`Status`, `Last updated`, `Based on`) and sections: Shipped State, Requirements Received (requester, original wording, date), Evidence, Known Defects &amp; Debt, Release Goal (user's own words), Idea Status, Candidates (table, with `Requested by`), Considered and Dropped (with reasons).

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
- Prefer a small release. If the selection exceeds roughly 5 `Must` features or includes an `L` feature, propose splitting into two releases.
- **Append only, after approval.** Write nothing to `docs/backlog.json` until the user approves the scope. Then append the new release entry (`status: planned`) and its features to `docs/backlog.json`, each feature `pending` with a `created` event (`source: live`, `by: orchestrator`); never renumber, edit, or remove shipped features. Feature IDs continue from the highest existing ID (e.g. `F11` → `F12`). Then run `node kit/scripts/render-backlog.js`; never hand-edit the generated table.
- Add a `## Release <slug>` section to `docs/roadmap.md` holding the Build Order, Deferred (unselected candidates with reasons), and Impact prose. Set the top-level `Phase 2 Scope` metadata to `feature` (the field Phase 2 reads) and `phase2_scope` to `feature` in `docs/backlog.json`, both written with the release; do not add a second scope field in the block.
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
- The user later drops every feature of the release before any ships: set the release `status: cancelled` in `docs/backlog.json` and follow "Change control" below.

---

## Step 3 — Design | Gate: hard

Design the whole wave before any feature is built, so every feature starts from one agreed design and features that touch the same data cannot conflict later. Without this step the data model and flows would grow one feature at a time, and two features changing the same entity would only collide when the second is specced.

**Inputs:** the release block and `discover.md`; `docs/architecture.md`, `docs/constitution.md`, `docs/DESIGN.md`, `docs/data-model.md`, `docs/flows.md`; existing `docs/designs/` and `docs/prototype/`.

### Rules

- Design every feature approved in Step 2, and only those. Deferred candidates are not designed.
- Dispatch a general-purpose agent read-only first, to check each feature for a new dependency, service, data-model or auth change, a new design component, or a rule exception, and to classify its **design delta**: `none | data-only | flow | screens`. Record the result as an **Impact** section in the release block: a table of feature × {architecture, constitution, design, data-model, flows} with `none | amend` and a one-line reason, plus the `Design delta` column.
- Then write the proposed design for all features at once to `docs/iterations/<release-slug>/design.md` (standard metadata header; `Status: draft`), one section per foundation document: **data model** (entities, fields, relationships, ER changes), **flows** (new and changed flows, transitions, cross-feature hand-offs, screen inventory), **architecture / constitution / design system** (dependencies, services, auth, rules, tokens and components), and **screens** (which features get designs). Dispatch one general-purpose agent per document, with `PROJECT_ROOT` and the fail-fast write instruction; the orchestrator reconciles their output so no two agents edit the same file.
- **Shared Surface.** List every data point touched by two or more features (an entity or field, table, route, event, screen, or environment variable) in a table in the release block: `Item | Owner feature | Other features (read / write) | Rule`. Each item has exactly one owner, the feature that creates or migrates it; other features use it through the owner's contract in `design.md`, and never create or alter it themselves. If two features write the same field, decide the conflict rule here (ordering, last write wins, versioning, locking), not at build time. Check every pair of features against the design, list each contradiction found, and resolve it before the gate.
- Screens: every feature classified `screens` without designs goes through Phase 1 Step 5 as a re-entry (`kit/steps/phase-1/p1-05-screen-design.md`, "Re-entry for new features") as one batch before the gate. The user may accept the `docs/DESIGN.md` fallback for a single simple feature; record that in the Impact section.
- Large impact (new stack, new auth model, data migration): make the foundation change its own feature at the head of the build order, with its own spec and migration plan; the other features depend on it.
- A change that contradicts a constitutional rule fundamental to the product: stop and surface it; the user chooses between dropping the feature and amending the constitution explicitly. A new stack choice follows `kit/stack-catalog.md` and `kit/steps/phase-1/p1-06-architecture.md`.
- **Write nothing to a foundation document before approval.** After the user approves `design.md`, apply it to `docs/data-model.md`, `docs/flows.md`, `docs/architecture.md`, `docs/constitution.md`, and `docs/DESIGN.md` (keep `Status: approved` and refresh `Last updated`; `Last amended` for the constitution; `DESIGN.md` has no metadata header), re-render the affected diagrams (`kit/orchestrator-conventions.md` rule 8), and set `design.md` to `approved`. Record every applied item in an **Amendment log** in the release block (feature or features, file, one-line change); cancelling a feature must be able to reverse it (see "Change control").
- Once applied, Phase 2 Step 1 finds the wave design already in the documents and only checks the feature's slice against it.

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

- Add a **Work Packages** table to the release block: `Feature | Depends on | Owns (Shared Surface items) | Group | Branch`. A **group** is a set of features that may be built at the same time: every feature in it depends only on features in earlier groups, and none needs another's *code* (the shared design, schema, and contracts are already fixed in Step 3). A feature that needs another feature's built code goes in a later group. Features in the same group must not own the same Shared Surface item.
- Commit the design: create `design/<release-slug>`, commit `design.md`, the amended foundation documents, the release block, and `docs/backlog.*`, then push and open a PR following the pre-flight, confirmation, and local-only fallback in `kit/steps/phase-2/p2-07-ship.md`. Feature branches are created from `main` after that PR is merged (from `design/<release-slug>` when local-only), so every branch sees the same design.
- Emit one Phase 2 handoff prompt per feature of the first group: `kit/phase-2.md`, project name, `scope: feature`, and the feature ID. Each prompt can run in its own session, worktree, or by its own developer. Emit the prompts of a later group when every feature of the earlier groups has `shipped`. Phase 2 reads the Work Packages table and `docs/backlog.json`; the prompt is a hint, and the release slug is not an input.
- **Design change requests.** If a Phase 2 cycle needs an entity, field, screen, or contract the wave design lacks, that cycle stops and returns here. Update `design.md` and the foundation documents, the Shared Surface table, and the Amendment log; list the features that use the changed items (they re-check their spec slice); and get the user's approval. Never patch a shared item from inside one feature.

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

Applies at any point after the Prioritise gate, including mid-build: a client drops a requirement, changes their mind, or sends a new one. Approved design and amendments do not guarantee that a feature ships, so every one of them must be reversible.

- **Decide on the backlog first.** Never delete a feature. To drop one, append a `cancelled` event (`by: user`, `note`: the reason; the validator rejects an empty note) and set `status: cancelled`; keep `release` so the history stays traceable. Run `node kit/scripts/render-backlog.js`.
- **Reverse its amendments.** Collect what the feature changed in the foundation documents: its items in the release block's Amendment log (the Step 3 wave design applied to `docs/data-model.md`, `docs/flows.md`, `docs/architecture.md`, and the others), plus anything its spec's `## Data & Flow Impact` or its plan's `## Architecture Impact` added beyond the wave design. Show the user the list, then revert each item after approval. **Keep an item that another non-cancelled feature also uses** (same entity, screen, dependency, or variable; the Shared Surface table shows who), and if the cancelled feature owned it, hand ownership to the surviving feature that uses it most and update the table. Refresh `Last updated`, and re-render the affected diagrams (`kit/orchestrator-conventions.md` rule 8). Then recheck the Work Packages groups.
- **Spec, plan, designs.** Leave `docs/specs/<feature-slug>/` and `docs/designs/<feature-slug>/` in place for the record. Set the spec `Status` to `cancelled`, so skip detection in `kit/phase-2.md` never treats it as approved; a revived feature goes through Step 1 approval again.
- **Code.** If the feature has a branch (`feature/<feature-slug>`), ask the user whether to discard it or keep it parked. Never delete a branch without confirmation. Uncommitted documentation edits revert with the amendments above.
- **Dependents.** Check `depends_on` of every non-cancelled feature. If one depends on a cancelled feature, present the options (drop it too, drop the dependency, or build the missing piece) and let the user decide. Then update the release block's Build Order and confirm it with the user before Phase 2 picks the next `pending` feature.
- **Foundation work.** If a foundation feature existed only to serve the cancelled feature and nothing surviving needs it, cancel it too. Do not build speculative schema or infrastructure for a feature that is not yet committed.
- **New requirements mid-build.** Do not add them to the running cycle. Park them for the next Phase 3 round, unless they change an existing feature's behavior (`kit/guides/evolving-specs.md`).
- **Release status.** A release whose features are all cancelled gets `status: cancelled`. Otherwise Phase 2 Ship closes the release when no `Must` feature is `pending` or `in-progress`; cancelled features do not hold it open.
- Record every cancellation, the reverted items, and the branch decision in `docs/phase-3-session.md`.

---

## Output Checklist

- [ ] `docs/iterations/<release-slug>/discover.md` and `design.md`
- [ ] `docs/backlog.json` updated and rendered; `docs/roadmap.md`: approved release block with Impact, Shared Surface, Amendment log, Work Packages, and (after Closeout) Outcome section
- [ ] Foundation documents amended once, from the approved wave design, with every applied item logged against its feature
- [ ] `docs/phase-3-session.md` shows all five steps complete