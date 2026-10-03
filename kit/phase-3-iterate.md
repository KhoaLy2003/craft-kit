# Phase 3 — Iterate

> **Use this after a release has shipped and you want to improve the product — whether you already have ideas or have none at all.**
> Output is a new release block in `docs/roadmap.md`. Features are then built with the normal Phase 2 Standard Loop. Phase 3 never writes feature code.
>
> Prerequisites: A shipped (or at least runnable) application; `docs/roadmap.md`, `docs/constitution.md`, `docs/architecture.md`, and `docs/DESIGN.md` in place.

---

## How to Read This Document

Four steps: **Review → Discover → Prioritise → Impact & Handoff**. Each step is structured as: Overview, Scope, Execution Rules, Artifact Rules, Completion Criteria, Transition Rules, Exceptions / Special Cases, and References. The gate at Prioritise is the most important — nothing enters the roadmap without explicit user approval.

## Orchestrator Conventions

Read `kit/orchestrator-conventions.md` for the universal rules every orchestrating agent must follow. For Phase 3 the key items are: step banner (use `Phase 3 · Step N — [Step Name]  |  Release: [release-slug]  |  Gate: [none/soft/hard]`), wall-clock time recording, PROJECT_ROOT injection into every subagent dispatch, file-write verification with 20-line preview, and gate summary protocol.

Log progress in `docs/iterations/<release-slug>/session.md` using the table schema from `kit/session-logging.md`.

`<release-slug>` names the iteration, e.g. `r2-growth` or `v1-1`. Agree on it with the user before Step 1 and use it for every path below.

---

## When to Use Phase 3 vs. Other Workflows

| Situation | Use |
|---|---|
| Something shipped is broken | `phase-bug-fix.md` |
| One known shipped feature needs different behavior | `guides/evolving-specs.md`, then `phase-2-feature-dev.md` |
| You know exactly one new feature to add, and it fits the architecture | `phase-2-feature-dev.md` directly (add a row to `docs/roadmap.md` first) |
| You want to improve the product but need to decide **what** to build — with ideas or without | **This phase** |
| Core idea, audience, or stack has changed fundamentally | Start a new project with `phase-1-bootstrap.md` |

---

## Step 1 — Review

### Overview

- **Purpose**: Establish what the shipped product actually does today and what evidence exists about how it is used, so that new work is grounded in reality rather than the original plan.
- **Agent/Skill**: General-purpose agent (read-only codebase and artifact research); `brainstorming` skill for the user conversation.
- **Trigger**: User asks to improve, extend, or "do the next version of" a shipped product.
- **Inputs**:
  - `docs/roadmap.md` (what shipped, what was deferred)
  - `docs/idea-brief.md`, `docs/market-notes.md` (if present)
  - `docs/specs/` (what was actually built)
  - `docs/specs/bugs/` (known defects)
  - User-supplied evidence, any of: user feedback, support requests, analytics, interviews, personal usage notes
- **Outputs**:
  - `docs/iterations/<release-slug>/review.md` — shipped-state summary, evidence list, pain points, and the user's stated goal for this release
- **Gate**: `soft`

### Scope

#### In Scope

- Summarising shipped features from `roadmap.md` and `docs/specs/`.
- Collecting whatever evidence the user has. Missing evidence is recorded as "none", not invented.
- Recording the user's goal for this release (e.g. retention, revenue, polish, new audience, "I just want it better").
- Listing known bugs and tech debt that affect the goal.

#### Out of Scope

- Proposing features — that is Step 2.
- Editing any code or existing artifact.

#### Scope Boundary

> Step 1 records facts and goals only. Do not suggest solutions here; a solution proposed before the evidence is on paper will anchor Step 2.

### Execution Rules

- Confirm the `<release-slug>` with the user first.
- Read `roadmap.md` and `docs/specs/` before asking questions, so questions are about gaps, not things already documented.
- Ask the user, one question at a time: (1) what is the goal of this release, (2) what evidence do you have (feedback, analytics, observations), (3) do you already have feature ideas. Questions are asked **before** `review.md` is written.
- Record the answer to (3) as `ideas: yes | no | partial`. It selects the Step 2 path.
- Treat an answer of "no evidence, no ideas" as valid input. Do not block on it.

### Artifact Rules

- **Artifact**: `docs/iterations/<release-slug>/review.md`
- Starts with the standard metadata header (`Status`, `Last updated`, `Based on`).
- Sections: Shipped State, Evidence, Known Defects & Debt, Release Goal, Idea Status (`yes | no | partial`).
- **Status / approval condition**: `soft` gate — orchestrator presents a summary and advances unless the user objects.

### Completion Criteria

- [ ] `review.md` exists with all five sections
- [ ] Release goal is recorded in the user's own words
- [ ] Evidence is listed, or explicitly recorded as "none"
- [ ] Idea Status is recorded
- [ ] 20-line preview done; no unfilled placeholders

### Transition Rules

#### Before Advancing

- Gate summary: *"Here is where the product stands and what you want from this release: [goal]. Evidence available: [summary or none]. Ideas in hand: [yes/no/partial]. Move on to finding candidate features?"*

#### Next Step

- **Default**: Step 2 — Discover
- **Optional skip**: No
- **User decision required**: No (soft gate)

#### Transition Record

- **Record**: `docs/iterations/<release-slug>/session.md`
- **Values**: `complete`

### Exceptions / Special Cases

- **Product never shipped or `roadmap.md` has unfinished Must features**: stop and finish Phase 2 first. Phase 3 starts from a stable base.
- **No `docs/` artifacts exist (product built outside the kit)**: dispatch the general-purpose agent to reverse-write a minimal `docs/roadmap.md`, `docs/architecture.md`, and `docs/constitution.md` from the codebase, and obtain user approval of each before continuing.

### References

- `docs/roadmap.md`, `docs/specs/`
- `kit/phase-bug-fix.md`

---

## Step 2 — Discover

### Overview

- **Purpose**: Produce a short, evidence-backed list of candidate features for this release.
- **Agent/Skill**: `brainstorming` skill (user has ideas); `market-researcher` / `research-analyst` agents (user has no or few ideas).
- **Trigger**: Step 1 complete.
- **Inputs**:
  - `docs/iterations/<release-slug>/review.md`
  - `docs/roadmap.md` §4 (Explicitly Deferred) and all `Could` / `Won't` rows
  - `docs/market-notes.md`, `docs/prototype/journey-map.md` (if present)
- **Outputs**:
  - `docs/iterations/<release-slug>/candidates.md` — candidate list, each with problem, evidence, source, rough size
- **Gate**: `soft`

### Scope

#### In Scope

- **Path A — user has ideas**: capture each idea, ask clarifying questions until the problem it solves is stated, then add it as a candidate. Offer, never impose, additional candidates from Path B sources.
- **Path B — no or few ideas**: mine these sources and propose candidates with the source named for each:
  1. Deferred, `Could`, and `Won't` rows in `roadmap.md`
  2. Pain points and themes in the user's evidence from Step 1
  3. Known defects and debt that block the release goal
  4. Gaps along the journey in `journey-map.md` (steps that are manual, weak, or missing)
  5. A refreshed competitor and trend scan, dispatched to `market-researcher` with the existing `market-notes.md` as baseline (only if the user approves the cost)
- Rough sizing (S / M / L) of each candidate.

#### Out of Scope

- Ranking or choosing — that is Step 3.
- Specs, plans, or technical design for any candidate.

#### Scope Boundary

> A candidate without a stated problem and a named source is not a candidate. Generate at most 10; fewer well-evidenced candidates beat a long speculative list.

### Execution Rules

- Follow Path A if Idea Status is `yes`; run Path A first, then offer Path B, if `partial`; Path B only if `no`.
- Every candidate needs: ID (`C01…`), one-line description, the user problem it solves, evidence or source, size, and whether it likely touches existing architecture.
- Never present a market-trend guess as evidence. Mark it `hypothesis`.
- Dispatch research subagents with PROJECT_ROOT and the fail-fast write instruction. Verify the output exists on disk.
- Do not write `candidates.md` until the user has reacted to the candidates discussed in conversation.

### Artifact Rules

- **Artifact**: `docs/iterations/<release-slug>/candidates.md`
- Standard metadata header. A table of candidates plus a short "Considered and dropped" list with reasons.
- **Status / approval condition**: `soft` gate.

### Completion Criteria

- [ ] `candidates.md` exists with 1–10 candidates
- [ ] Every candidate has problem, source, size, evidence/hypothesis label
- [ ] The user has seen the list and either added, removed, or accepted it
- [ ] 20-line preview done

### Transition Rules

#### Before Advancing

- Gate summary: *"I found [N] candidate features for this release, [k] backed by evidence and [m] hypotheses. Ready to prioritise which of these enter the roadmap?"*

#### Next Step

- **Default**: Step 3 — Prioritise
- **Optional skip**: No
- **User decision required**: No (soft gate)

#### Transition Record

- **Record**: `docs/iterations/<release-slug>/session.md`
- **Values**: `complete`

### Exceptions / Special Cases

- **Discovery yields nothing credible** (no evidence, nothing deferred, user has no ideas): report that honestly and recommend gathering real usage evidence first. End Phase 3 with status `blocked`; do not manufacture candidates.
- **A candidate is really a bug**: move it to the bug-fix workflow and note it in `candidates.md`.
- **A candidate changes the product's core idea**: flag it; this may belong in a new project, not this release.

### References

- `brainstorming` skill
- `market-researcher`, `research-analyst` agents
- `kit/task-agent-rubric.md`

---

## Step 3 — Prioritise

### Overview

- **Purpose**: Choose which candidates enter this release, rank them, and commit them to `docs/roadmap.md` as a new release block.
- **Agent/Skill**: Orchestrator with the user. No subagent.
- **Trigger**: Step 2 complete.
- **Inputs**:
  - `docs/iterations/<release-slug>/review.md` (release goal)
  - `docs/iterations/<release-slug>/candidates.md`
  - `docs/roadmap.md`
- **Outputs**:
  - `docs/roadmap.md` — new `## Release <slug>` section appended (existing rows untouched)
- **Gate**: `hard`

### Scope

#### In Scope

- Scoring each candidate against the release goal and sizing (impact vs. size), then assigning MoSCoW.
- Resolving dependencies between candidates and on shipped features.
- Assigning feature IDs that continue the existing sequence (if the roadmap ends at `F11`, start at `F12`).
- Setting a build order.
- Recording unselected candidates as deferred.

#### Out of Scope

- Editing existing shipped rows in `roadmap.md`.
- Specs or plans.

#### Scope Boundary

> Scope the release to what the goal needs. Prefer a small release the user can finish and learn from. If the selected set exceeds roughly 5 `Must` features or any `L` feature, propose splitting it into two releases.

### Execution Rules

- Present candidates as a table (impact, size, evidence, dependency) and a recommended cut line. The user decides; the orchestrator recommends.
- Only `Must` features are guaranteed to be built this release. `Should` / `Could` are explicit stretch.
- New roadmap block uses the same columns as the original Feature List (`ID | Feature | Priority | Size | Depends on | Status`), all `pending`, plus its own Build Order and Deferred subsections.
- Append only. Never renumber or modify shipped rows.
- Phase 2 track for any iteration release is `standard`. Single-pass is for initial builds only (see `kit/steps/phase-2/p2sp-07-ship.md`).
- Set `roadmap.md` metadata `Status` back to `approved` only after the user approves the new block.

### Artifact Rules

- **Artifact**: `docs/roadmap.md` (appended section)
- Refresh `Last updated`. Add `docs/iterations/<release-slug>/candidates.md` to `Based on`.
- **Status / approval condition**: Explicit user approval of the new release block. Until then the block is marked `draft`.

### Completion Criteria

- [ ] New release block exists in `docs/roadmap.md` with IDs continuing the existing sequence
- [ ] Every selected feature traces to a candidate and to the release goal
- [ ] Build order accounts for dependencies
- [ ] Unselected candidates appear in the release's Deferred subsection with reasons
- [ ] Shipped rows are byte-for-byte unchanged
- [ ] The user has explicitly approved

### Transition Rules

#### Before Advancing

- Gate summary: *"This release commits [N] features — [list] — to serve the goal '[goal]'. [M] candidates are deferred. Do you approve this scope?"*

#### Next Step

- **Default**: Step 4 — Impact & Handoff
- **Optional skip**: No
- **User decision required**: Yes — explicit approval at the hard gate

#### Transition Record

- **Record**: `docs/iterations/<release-slug>/session.md`
- **Values**: `complete`

### Exceptions / Special Cases

- **User wants everything**: show the cost (sum of sizes) against the goal; if they still insist, record the decision and split into sequential releases.
- **Zero features selected**: end Phase 3 with status `complete`, no roadmap change. Record the reason in `session.md`.

### References

- `kit/templates/06-roadmap.md`
- `kit/gate-management.md`

---

## Step 4 — Impact & Handoff

### Overview

- **Purpose**: Check whether the new features invalidate the existing architecture, constitution, or design system, amend them with approval if so, and hand off to Phase 2.
- **Agent/Skill**: General-purpose agent (read-only impact analysis); orchestrator applies approved amendments.
- **Trigger**: Step 3 approved.
- **Inputs**:
  - New release block in `docs/roadmap.md`
  - `docs/architecture.md`, `docs/constitution.md`, `docs/DESIGN.md`
- **Outputs**:
  - `docs/iterations/<release-slug>/impact.md` — per-feature verdict against each foundation document
  - Amended `architecture.md` / `constitution.md` / `DESIGN.md` (only if needed and approved)
- **Gate**: `hard` if any amendment is proposed; otherwise `none`

### Scope

#### In Scope

- For each new feature: does it need a new dependency, service, data model change, auth change, new design component, or rule exception?
- Drafting minimal amendments, each tagged with the feature that requires it.
- Handing off to `phase-2-feature-dev.md`.

#### Out of Scope

- Rewriting foundation documents beyond what the new features require.
- Implementing or migrating anything.

#### Scope Boundary

> Amend the foundation documents only where a selected feature cannot be built without it. A change that no selected feature needs is out of scope.

### Execution Rules

- Dispatch the general-purpose agent read-only to produce the impact verdicts. Verify `impact.md` is on disk.
- If all verdicts are "no change": record that, skip the gate, and proceed to handoff.
- If amendments are needed: present them with the feature they serve; apply only after explicit approval; set the document metadata `Last updated` and keep `Status: approved`.
- A new stack choice goes through the same stack-catalog rules as `kit/steps/phase-1/p1-06-architecture.md`.
- Offer the Design Sprint (`phase-2-design-sprint.md`) if 2+ new features need designer-provided screens.
- Handoff is automatic: emit the exact first message for the next session — phase file `kit/phase-2-feature-dev.md`, project name, release slug, and the first pending feature in the new build order.

### Artifact Rules

- **Artifact**: `docs/iterations/<release-slug>/impact.md`
- Standard metadata header. A table: feature × {architecture, constitution, design} with `none | amend` and a one-line reason.
- **Status / approval condition**: `hard` gate only when amendments exist.

### Completion Criteria

- [ ] `impact.md` exists with a verdict for every new feature
- [ ] All proposed amendments are applied with approval, or none were needed
- [ ] Handoff message emitted
- [ ] Session log shows Phase 3 `complete`

### Transition Rules

#### Before Advancing

- Gate summary (only if amendments): *"The new features require these changes to existing foundations: [list]. Approve them so Phase 2 can build on them?"*

#### Next Step

- **Default**: Phase 2 — `kit/phase-2-feature-dev.md`, Step 1 for the first pending feature of the new release
- **Optional skip**: No
- **User decision required**: Only if amendments exist

#### Transition Record

- **Record**: `docs/iterations/<release-slug>/session.md`
- **Values**: `complete`

### Exceptions / Special Cases

- **Amendment would contradict a constitutional rule fundamental to the product**: stop and surface the conflict; the user decides between dropping the feature and amending the constitution explicitly.
- **Impact is large (new stack, new auth model, data migration)**: treat the foundation change as its own feature at the head of the build order, with its own spec and migration plan.

### References

- `kit/phase-2-feature-dev.md`
- `kit/phase-2-design-sprint.md`
- `kit/steps/phase-1/p1-06-architecture.md`
- `kit/guides/evolving-specs.md`

---

## Phase 3 Output Checklist

- [ ] `docs/iterations/<release-slug>/review.md`
- [ ] `docs/iterations/<release-slug>/candidates.md`
- [ ] `docs/roadmap.md` has an approved new release block
- [ ] `docs/iterations/<release-slug>/impact.md`
- [ ] Foundation documents amended if and only if required, with approval
- [ ] `docs/iterations/<release-slug>/session.md` shows all four steps complete
- [ ] Phase 2 handoff message emitted
