# API Backfill — create docs/api.md for an existing project

> **Status: experimental — not yet validated in a test round.**
>
> **Use once per project** that exposes an API and has no `docs/api.md`. New projects do not run this.
>
> Output: `docs/api.md`, reverse-engineered from the code, reviewed by you, and marked `approved`. Nothing else in `docs/` is touched.

Universal rules: `kit/orchestrator-conventions.md`.

## Limitations (read before running)

- **Derived from code, so it records what IS built.** An endpoint or interface found only in specs or the prototype is labelled `planned`.
- **Shared rules** (nothing invented, code beats docs, monorepo): `kit/phase-upgrade.md` → Shared module rules. Request and response shapes, validation rules, and status codes come from schemas, DTOs, validators, and handler code; an unreadable body is never guessed from a sample. An OpenAPI file, README, or existing doc that conflicts with the handler code is a conflict for you to decide.
- **Internal APIs are sampled.** Only interfaces that cross a module or package boundary are documented, not every exported function. The sample and what was not covered are recorded.
- **Not maintained by Phase 2.** Phase 2 keeps `data-model.md` and `flows.md` current, not this document. Re-run this module when the API has changed enough to matter.

## How to start

Send this to your AI, from the project root:

```text
Run the API backfill using kit/phase-api-backfill.md.
```

What to have ready: `docs/architecture.md`. `docs/data-model.md` is used when present.

## Steps

| # | Name | Gate | Model | Output |
|---|---|---|---|---|
| 1 | Preflight & locate | none | fast | Source file list shown to the user |
| 2 | Reverse-engineer | none | balanced | Labelled reports: HTTP endpoints, internal APIs |
| 3 | Review | hard | capable | User decision per non-confirmed item |
| 4 | Write & verify | none | fast | `docs/api.md` |

## Step 1 — Preflight & locate

1. Stop if `docs/api.md` exists and is `approved`, unless the user asks to refresh it from the code.
2. Require `docs/architecture.md`. If it is absent, stop and point to `kit/phase-adopt.md` (existing code with no kit documents).
3. Locate the sources and show the user the list:
   - route, controller, handler, and server-action files (for example `app/api/**`, `routes/`, `controllers/`, `*.controller.ts`, router config);
   - request and response schemas: validators, DTOs, serializers, OpenAPI or GraphQL schema files;
   - authentication and guard code (middleware, decorators, guards);
   - candidate internal interfaces: service, repository, and client classes or modules that other modules import;
   - docs inputs when present: `docs/data-model.md`, `docs/specs/**`, `docs/backlog.json`, and any existing API document or OpenAPI file.
4. If no endpoint and no cross-module interface is found, or the user declines the module, record the decision (see Exceptions) and end.

## Step 2 — Reverse-engineer

Two read-only general-purpose agent dispatches, independent of each other. Each carries `PROJECT_ROOT`, writes no files, and returns a structured report in chat.

- **(A) HTTP endpoints:** per endpoint: method, path, purpose, access guard, request fields (location, type, required, validation rule from the code), responses (status and body shape), entities touched, and the conventions of `templates/06d-api.md` §1, each with `source: <file:line-range>`.
- **(B) Internal APIs:** per boundary-crossing interface or class: methods, parameters, return types, callers, each with a source path. Record the directories sampled and not sampled.

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

Gate summary: *"The API has [N] endpoints ([a] as-built, [p] planned, [u] unknown) and [M] internal interfaces. Write `docs/api.md`? [Yes / change an item]"*

## Step 4 — Write & verify

1. Write `docs/api.md` from `kit/templates/06d-api.md`: replace every `a | b` alternative in the metadata with one value (`Status: approved`, `Provenance: backfilled from code on <date>`), set `Based on:` to the real files read, and fill the `Label` and `Source` columns from Step 2. Use `unknown` where a column cannot be determined. `unknown` and `planned` items are also listed in Open questions.
2. Check: every endpoint in §2 has a §3 block; every entity named under "Entities touched" exists in `docs/data-model.md` when that file exists (otherwise write `unknown` for it; never edit `data-model.md` from here).
3. Verify the file exists on disk (conventions rule on write verification).

## Completion criteria

- [ ] `docs/api.md` exists and is `approved`
- [ ] Every endpoint and interface has a Source and a label

## Exceptions

- **OpenAPI or GraphQL schema file exists:** use it as a source, cite it, and still check it against the handlers; a mismatch is a conflict for Step 3.
- **No HTTP API, only internal interfaces:** write §2 and §3 as `n/a: no HTTP API` and fill §4.
- **No API at all, or the user declines the module:** write `docs/api.md` with only the metadata block (`Status: approved`, `Provenance: backfilled from code on <date>`, `Based on:` the files searched) and one line, `n/a: no API exposed (<reason>)` or `n/a: declined by the user on <date>`. This records the decision so the upgrade Detect step and the install hint stop reporting the document as missing. Delete the file and re-run to document the API later.
- **Monorepo:** see the shared rules.
