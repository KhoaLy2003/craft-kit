# Docs Backfill — create docs/data-model.md and docs/flows.md for an existing project

> **Use once per project** that lacks `docs/data-model.md` or `docs/flows.md` (built on an older kit version, or without Phase 1). New projects never run this: Phase 1 Step 6 writes both documents from the start.
>
> Output: `docs/data-model.md` and `docs/flows.md`, reverse-engineered from the code, reviewed by you, and marked `approved`. Nothing else in `docs/` is touched.

Universal rules: `kit/orchestrator-conventions.md`.

## Limitations (read before running)

- **Derived from code, so it records what IS built.** An entity or screen found only in specs or the prototype is labelled `planned`.
- **Nothing is invented.** Unreadable or ambiguous items are `unknown`.
- **Code beats docs.** When ORM/migration code conflicts with existing docs, the conflict is reported to you, never silently resolved.

## How to start

Send this to your AI, from the project root:

```text
Run the docs backfill using kit/phase-docs-backfill.md.
```

What happens next: the AI lists the schema, route, and navigation files it will read, reverse-engineers entities, screens, and data flows from them, and shows you every item that is not plainly confirmed by code. You decide per item: keep, correct, drop, or mark unknown. Nothing is written until you approve.

What to have ready: `docs/architecture.md`. You can answer for the whole list at once, for example "keep all undocumented, mark the rest unknown".

## Steps

| # | Name | Gate | Model | Output |
|---|---|---|---|---|
| 1 | Preflight & locate | none | fast | Source file list shown to the user |
| 2 | Reverse-engineer | none | balanced | Labelled reports: data model, screens, data flows |
| 3 | Review | hard | capable | User decision per non-confirmed item |
| 4 | Write & verify | none | fast | `docs/data-model.md`, `docs/flows.md` |

## Step 1 — Preflight & locate

1. Stop if both `docs/data-model.md` and `docs/flows.md` exist and are `approved`. If only one exists, backfill only the missing one.
2. Require `docs/architecture.md`. If it is absent, stop and tell the user to create it first (see the existing-projects guide on the docs site, `docs-site/guides/existing-projects.md`).
3. Locate the sources and show the user the list:
   - schema, migration, and ORM files, found from `docs/architecture.md` §6 and the stack (e.g. `drizzle/`, `prisma/schema.prisma`, `supabase/migrations/`, SQL files, model/entity classes);
   - route and page files (e.g. `app/**/page.tsx`, `pages/`, router config);
   - navigation components;
   - API route, handler, and server-action files;
   - docs inputs when present: `docs/specs/**`, `docs/prototype/`, `docs/preview/`, `docs/backlog.json`.

## Step 2 — Reverse-engineer

Three read-only general-purpose agent dispatches. Each carries `PROJECT_ROOT`, writes no files, and returns a structured report in chat.

- **(A) Data model:** entities, fields with types, relationships, enums and state fields, each with `source: <file:line-range>`.
- **(B) Screens:** inventory with URL, access guard, incoming and outgoing navigation edges, each with a source path.
- **(C) Data flow:** dispatched after A and B finish, with their reports as input. Per screen and per API route/action: operations, entities touched, external calls.

Label every item:

| Label | Meaning |
|---|---|
| `as-built` | found in code |
| `planned` | only in specs or the prototype |
| `undocumented` | in code, absent from the existing docs |
| `unknown` | ambiguous |

List conflicts between code and existing docs separately.

## Step 3 — Review (hard gate)

Present one summary table per area (counts by label), then every `planned`, `undocumented`, and `unknown` item and every conflict. Ask per item: **keep / correct / drop / mark unknown**.

Rules:
- Bulk answers are allowed ("keep all undocumented, mark the rest unknown"); echo the per-item meaning back before writing.
- `planned` items are kept only on explicit user say-so; the default is drop.
- A conflict is resolved only by the user's answer.

Gate summary: *"The data model has [N] entities ([a] as-built, [p] planned, [u] unknown); the flows cover [M] screens and [K] flows. Write both documents? [Yes / change an item]"*

## Step 4 — Write & verify

1. Write both files from `templates/06b-data-model.md` and `templates/06c-flows.md`: replace every `a | b` alternative in the metadata with one value (`Status: approved`, `Provenance: backfilled from code on <date>`), set `Based on:` to the real files read, and fill the `Label` column from Step 2. `Source` columns hold file paths; use `unknown` where a column cannot be determined. `unknown` and `planned` items are also listed in each document's Open questions. In `flows.md` §3, count one flow per screen group or API route/action found.
2. Feature × Entity matrix: fill it from `docs/backlog.json` when it exists; otherwise replace the whole §4 content with the single line `no backlog.json; matrix not derivable`. Do not guess.
3. Run checks (b) and (c) from Stage 4 of `kit/steps/phase-1/p1-06-architecture.md`, reading (c) as "every screen found in Step 2 appears in the `flows.md` §1 inventory": every entity named in `flows.md` exists in `data-model.md`, and every screen found appears in the inventory. Also check (e): the `data-model.md` §2 `erDiagram` covers every entity written, with its foreign-key relationships as edges.
4. Verify both files exist on disk (conventions rule on write verification).
5. Render only the diagrams that pass the filter and budget in `kit/orchestrator-conventions.md` rule 8, and add the links to each document's `Diagrams` line. Items labelled `planned` or `unknown` are never rendered.

## Completion criteria

- [ ] `docs/data-model.md` and `docs/flows.md` exist and are `approved`
- [ ] Every entity and screen has a Source and a label
- [ ] The user approved at the Step 3 gate
- [ ] No invented items

## Transition

Done. Return to the workflow that sent you here (`kit/phase-2.md` Docs preflight, or `kit/phase-3-iterate.md`). Later changes are maintained per feature through the Data & Flow Impact rule in `kit/steps/phase-2/p2-01-spec.md`.

## Exceptions

- **No schema in code** (schemaless or hosted BaaS only): the data model documents the collections observed in access code, each field type `unknown`.
- **Monorepo:** ask the user which app or package to document.
- **No UI:** write `flows.md` with §1–2 as `n/a: no UI` and fill §3–5.
