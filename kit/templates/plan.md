# Plan: [Feature name | full app]

**Status:** draft
**Last updated:** YYYY-MM-DD
**Based on:** <!-- the spec path, plus extras only (design.md, a ticket) -->

<!-- Copy to docs/specs/<feature-slug>/plan.md (scope: feature) or docs/specs/plan.md (scope: all). Delete this comment.
Replaces the writing-plans layout: metadata header only, no banner, goal block or preamble. Tasks in dependency order, at most 12 lines each, one line per field of at most 300 characters (longer reasoning goes in the spec; cite it), no code beyond a signature or type shape. Only the sections below. Cite AC IDs; never restate criterion text. -->

## Task 1: [name]

- **Implements**: AC-F01-1 <!-- plus the entity or screen from the docs, for a table, route, or screen task -->
- **Files**: `path/to/file`
- **Interfaces**: `signature(args): Return`
- **Key decisions**: <!-- file and class names, migration version, library choice -->
- **Edge cases**:
- **Test intent**: <!-- one line -->
- **Specialist**: <!-- always: `general-purpose` or an installed agent, plus skills if any, e.g. `general-purpose + design-taste-frontend`; only names from the harness inventory -->
- **NFR**: <!-- only for an NFR task: `<category, row>`; reference the roadmap row, never copy it -->

<!-- Parallel group A: tasks 2, 3 — disjoint files, no dependency -->

## Skills and Agents

| Task | Agent | Skill | Used for |
|---|---|---|---|
| 1 | general-purpose | none | <!-- one line: why this agent and skill fit this task, or why none -->  |

<!-- Later steps: list the review, E2E and Ship skills they load (Step 4 loads the review skills). -->

## Architecture Impact

<!-- New dependencies, external services, auth/model changes, route groups, environment variables; or `none`. -->
