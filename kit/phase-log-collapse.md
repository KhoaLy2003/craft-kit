# Log Collapse — archive shipped units out of the session log and the E2E doc

> **Status: experimental — not yet validated in a test round.**
>
> **Use once per project** whose `docs/phase-2-session.md` or `docs/E2E-TESTS.md` still carries the full text of features that already shipped (built on a kit version before Ship collapsed units). New projects never run this: Phase 2 Step 7 collapses each unit as it ships.
>
> Output: each shipped unit's text moved unchanged to `docs/archive/`, with a short stub left in place. Nothing is deleted; no other document is touched.

Universal rules: `kit/orchestrator-conventions.md`.

## Limitations (read before running)

- **Shipped units only.** A unit is shipped when its Step 7 row is `complete`, or `docs/backlog.json` has a `shipped` event for the feature. A unit in progress is never touched; its overlong notes and Run Log rows are reported, not edited.
- **Move, never rewrite.** The archive file holds the original text verbatim. The stub carries only facts found in that text or in `docs/backlog.json`; an item neither settles is `unknown`.
- **Shared rules** (nothing invented, code beats docs, monorepo): `kit/phase-upgrade.md` → Shared module rules.
- **No backfill of new columns.** The E2E `Evidence` column and the one-line Run Log rule apply to new blocks and rows from the next feature on; existing rows are archived, not reformatted.

## How to start

Send this to your AI, from the project root:

```text
Run the log collapse using kit/phase-log-collapse.md.
```

What to have ready: `docs/phase-2-session.md`, `docs/E2E-TESTS.md` (either may be absent), `docs/backlog.json`.

## Steps

| # | Name | Gate | Model | Output |
|---|---|---|---|---|
| 1 | Preflight & detect | none | fast | Shipped units listed; lint growth warnings shown |
| 2 | Propose | none | balanced | Stub and archive path per unit, in chat |
| 3 | Review | hard | balanced | User decision per unit |
| 4 | Write & verify | none | fast | `docs/archive/phase-2-session/<unit-slug>.md`, `docs/archive/e2e/<feature-slug>.md`, collapsed docs |

## Step 1 — Preflight & detect

1. Run `node kit/scripts/lint-docs.js` and show the growth warnings. Stop if there are none.
2. List the shipped units: sections of `docs/phase-2-session.md` whose Step 7 row is `complete`, plus features with a `shipped` event in `docs/backlog.json` that have a block in `docs/E2E-TESTS.md`. Stop if there are none. Sections whose heading carries a feature id (for example `levels-xp (F24)`) keep the full heading text; the archive file name is the slug.

## Step 2 — Propose

One read-only general-purpose agent dispatch carrying `PROJECT_ROOT`; it writes no files and returns, per shipped unit:

- the archive paths: `docs/archive/phase-2-session/<unit-slug>.md` and, when the unit has an E2E block, `docs/archive/e2e/<feature-slug>.md`;
- the session stub, in the format of `kit/steps/phase-2/p2-07-ship.md` section 4 (Output cells reduced to the file paths named in them, `—` when none). The PR reference comes from the `shipped` event's evidence; the counts from the section's E2E row or the E2E block's Status column; each missing item is `unknown`;
- the E2E stub (same Ship section), replacing the block and moving the unit's Section 8 rows (rows whose Scope names the feature) to the archive;
- the size of each file before and after.

Unit-level Run Log rows that name several features go to the archive of the first feature they name, and the stub list says so.

## Step 3 — Review (hard gate)

Show the table: unit, session KB before → after, E2E KB before → after, the Outcome line. Ask per unit: **collapse / skip**. Say that nothing is lost: the full text moves to `docs/archive/`, which stays in git history and is never read automatically.

Gate summary: *"[n] shipped units, about [x] KB in the session log and [y] KB in the E2E doc, would shrink to about [x2] and [y2] KB. Collapse them all, or name a unit to skip?"*

## Step 4 — Write & verify

1. Per approved unit, write the archive file first (text unchanged), then replace the section or block with its stub.
2. Re-read each archive file and confirm it contains the moved text; if any is short, restore the original text before going on.
3. Re-run `node kit/scripts/lint-docs.js`. The shipped-unit warnings are gone; whatever remains (an in-progress unit's notes, a long line in the E2E doc's static sections) is reported to the user, never edited here.
4. Leave `docs/archive/` out of `.gitignore`; it is committed.

## Completion criteria

- [ ] Every approved shipped unit has an archive file holding its original text
- [ ] The session log and E2E doc hold only stubs for those units
- [ ] Nothing invented in a stub (`unknown` where the text did not settle it)
- [ ] The lint shows no not-collapsed warning for an approved unit

## Exceptions

- **No E2E doc, or no session log:** do the other one; say which is missing.
- **A unit has no archive-worthy text** (its section is already a table and one line): skip it and say so.
