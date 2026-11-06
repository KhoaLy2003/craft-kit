# Phase 3 · Step 3 — Design

## Overview

- **Purpose**: Design the whole wave before any feature is built, so every feature starts from one agreed design and two features touching the same data cannot collide later.
- **Agent/Skill**: orchestrator; general-purpose agents (one per document); Phase 1 Step 5 re-entry for screens
- **Model**: `capable`
- **Gate**: `hard`
- **Inputs**: the release block and `discover.md`; `docs/architecture.md`, `docs/constitution.md`, `docs/DESIGN.md`, `docs/data-model.md`, `docs/flows.md`; existing `docs/designs/` and `docs/prototype/`
- **Outputs**: `docs/iterations/<release-slug>/design.md`; amended foundation documents; Shared Surface table and Amendment log in the release block
- **Template**: none

## Rules

- Design every feature approved in Step 2, and only those. Deferred candidates are not designed.
- Dispatch a general-purpose agent read-only first to check each feature for a new dependency, service, data-model or auth change, design component, or rule exception, and classify its **design delta**: `none | data-only | flow | screens`. Record an **Impact** table in the release block: feature × {architecture, constitution, design, data-model, flows, NFR} with `none | amend` and a one-line reason (NFR: whether a roadmap NFR row is added or changed), plus `Design delta`.
- Then write the proposed design for all features at once to `docs/iterations/<release-slug>/design.md` (standard metadata header; `Status: draft`), one section per foundation document: **data model** (entities, fields, relationships, ER changes), **flows** (new and changed flows, transitions, cross-feature hand-offs, screen inventory), **architecture / constitution / design system** (dependencies, services, auth, rules, tokens and components), and **screens** (which features get designs). Dispatch one general-purpose agent per document; the orchestrator reconciles so no two agents edit the same file. End the file with a **Feature slices** index: one `### <F-id>` entry per feature, one line each, naming the entities, flows, screens, and Shared Surface items it touches, with the design.md heading that holds each. It repeats no design text; Phase 2 reads only the feature's entry and the sections it lists, never the whole file.
- **Shared Surface.** List every data point touched by two or more features (an entity or field, table, route, event, screen, or environment variable) in a table in the release block: `Item | Owner feature | Other features (read / write) | Rule`. Each item has one owner (the feature that creates or migrates it); others use it through the owner's contract in `design.md` and never create or alter it. If two features write a field, decide the conflict rule here (ordering, last write wins, versioning, locking). Check every feature pair, list contradictions, and resolve them before the gate.
- Screens: features classified `screens` without designs go through Phase 1 Step 5 re-entry (`p1-05-screen-design.md`, "Re-entry for new features") as one batch before the gate; the user may accept the `docs/DESIGN.md` fallback for a simple feature (record it in Impact).
- Large impact (new stack, auth model, data migration): make it its own feature at the head of the build order, with its own spec and migration plan.
- A change contradicting a fundamental constitutional rule: stop; the user chooses to drop the feature or amend the constitution explicitly. A new stack follows `kit/stack-catalog.md` and `p1-06-architecture.md`.
- **Write nothing to a foundation document before approval.** Then apply `design.md` to `docs/data-model.md`, `docs/flows.md`, `docs/architecture.md`, `docs/constitution.md`, and `docs/DESIGN.md` (keep `Status: approved`, refresh `Last updated`; `Last amended` for the constitution; `DESIGN.md` has no header), re-render affected diagrams (`kit/guides/diagrams.md`), and set `design.md` to `approved`. Log every applied item in an **Amendment log** in the release block (feature(s), file, one-line change) so cancelling a feature can reverse it.
- Phase 2 Step 1 then finds the wave design in the documents and only checks the feature's slice.

## Completion Criteria

- [ ] `design.md` covers every selected feature and every foundation document it changes, and ends with a Feature slices entry per feature; Impact section and Shared Surface table are in the release block
- [ ] Every Shared Surface item has exactly one owner and a conflict rule where two features write it
- [ ] Every `screens` feature has designs, or the fallback is recorded
- [ ] The user approved the design as one wave; foundation documents are amended; every applied item is in the Amendment log

**Gate summary:** *"The design for [N] features changes: [data model: entities], [flows], [architecture], [screens]. [S] data points are shared between features, each with one owner. Approve this design as the single basis for building all of them?"*

## Transitions

- **Next**: Step 4 — Handoff (after explicit approval; a handover seam, `kit/guides/session-handover.md`)
