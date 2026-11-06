# Phase 3 · Step 1 — Discover

## Overview

- **Purpose**: Establish what the product does today and what evidence exists, then produce a short, evidence-backed candidate list.
- **Agent/Skill**: `brainstorming`
- **Model**: `capable`
- **Gate**: `soft`
- **Inputs**: `docs/backlog.json` (shipped, deferred, `Could` / `Won't` features), `docs/roadmap.md`, `docs/specs/`, `docs/specs/bugs/`, `docs/idea-brief.md`, `docs/market-notes.md`, `docs/prototype/journey-map.md` (where present), user-supplied evidence (feedback, support requests, analytics, interviews, usage notes)
- **Outputs**: `docs/iterations/<release-slug>/discover.md`
- **Template**: none

## Rules

- Read `docs/backlog.json`, `roadmap.md` and `docs/specs/` first, so questions cover gaps, not documented facts.
- Ask one at a time, before writing: (1) the release goal, (2) requirements received from customers or stakeholders (who, what, why), (3) other evidence, (4) the user's own feature ideas (record `ideas: yes | no | partial`). "None" is valid; never invent evidence.
- **Path R (requirements received)**: default when (2) is not empty. Capture each in the requester's words; ask until the underlying problem and a first acceptance hint ("how will they know it works?") exist. Merge requirements describing one problem; split one hiding several. Record `Requested by`.
- **Path A (`yes`)**: capture each idea; ask until its problem is stated; add as a candidate. Offer Path B sources as extras if `partial`.
- **Path B (`no`/`partial`)**: mine and name the source for each candidate: (1) deferred / `Could` / `Won't` features, (2) pain points in the evidence, (3) defects and debt blocking the goal, (4) weak or missing journey-map steps, (5) a competitor/trend scan by the general-purpose agent with `market-notes.md` as baseline, only if the user approves the cost.
- A candidate needs: ID (`C01…`), one-line description, the user problem, a source (a requirement counts; name `Requested by`), evidence or a `hypothesis` label, size (S / M / L), and whether it likely touches existing architecture. No problem or source, no candidate. Maximum 10; fewer well-evidenced beats a long speculative list.
- Discuss candidates before writing the file. Do not rank (Step 2) or write specs/designs. A candidate that is a bug goes to `kit/phase-bug-fix.md`; note it in `discover.md`.

**Artifact:** `docs/iterations/<release-slug>/discover.md` with the standard metadata header (`Status`, `Last updated`, `Based on`) and sections: Shipped State, Requirements Received (requester, original wording, date), Evidence, Known Defects and Debt, Release Goal (user's own words), Idea Status, Candidates (table, with `Requested by`), Considered and Dropped (with reasons).

## Completion Criteria

- [ ] `discover.md` has all sections and 1–10 candidates, each with problem, source, size, evidence/hypothesis label
- [ ] The user has seen the candidate list and added, removed, or accepted it

**Gate summary:** *"Release goal: [goal]. I found [N] candidates, [k] evidence-backed and [m] hypotheses. Ready to prioritise which enter the roadmap?"*

## Exceptions

- Product never shipped, or `roadmap.md` has unfinished Must features: stop and finish Phase 2 first.
- No `docs/` artifacts (built outside the kit): dispatch a general-purpose agent to reverse-write minimal `roadmap.md`, `architecture.md`, `constitution.md` from the codebase; get the user's approval of each before continuing.
- Nothing credible found (no evidence, nothing deferred, no ideas): say so, recommend gathering usage evidence first, end Phase 3 as `blocked`. Do not manufacture candidates.
- A candidate changes the product's core idea: flag it; it may belong in a new project.

## Transitions

- **Next**: Step 2 — Prioritise
