# Roadmap Migration — move an existing roadmap table into `docs/backlog.json`

> **Use once per existing project** whose `docs/roadmap.md` has a hand-maintained feature table and no `docs/backlog.json`. New projects never run this: Phase 1 Step 4 writes the JSON from the start.
>
> Output: `docs/backlog.json` (validated), `docs/backlog.html` (rendered), and a `docs/roadmap.md` whose feature table is generated between `<!-- BEGIN FEATURES -->` and `<!-- END FEATURES -->`. Narrative sections are not touched.

Universal rules (banner, gates, PROJECT_ROOT, fail-fast writes, file verification) are in `kit/orchestrator-conventions.md`.

## Limitations (read before running)

- **Git dates record when a file changed, not when a feature was built.** A commit that touches `roadmap.md` may be a squash, may edit several rows at once, or may be unrelated to the feature. Every git-derived date is a hint.
- **History before this migration is never invented.** If there is no evidence and no user answer, the date is `unknown` and is stored as `null`. It renders blank.
- **Dates that are not confirmed are shown as unverified.** The HTML draws them in italics with an "unverified" badge.
- **Repos without git, or with rewritten history**, produce no hints. Every date then comes from the user or is `unknown`.

## How to start

Send this to your AI, from the project root:

```text
Run the roadmap migration using kit/phase-roadmap-migrate.md.
```

What happens next: the AI checks the preconditions, reads your roadmap table, and (if the project is a git repo) pulls date hints from history. It then shows one table of features with their hints and asks you, per feature, to confirm, correct, or mark the date unknown. Nothing is written until you approve that table.

What to have ready: the roadmap file as it is today, and the git history if you want date hints. You can answer for the whole table at once, for example "confirm all unflagged hints, mark the rest unknown".

## Steps

| # | Name | Gate | Model | Output |
|---|---|---|---|---|
| 1 | Preflight & parse | none | fast | Parsed feature list; format check result |
| 2 | Gather evidence | none | fast | Per-feature git hints with squash flags |
| 3 | Review dates | hard | capable | User decision per feature (confirm / correct / unknown) |
| 4 | Write & render | hard | fast | `docs/backlog.json`, `docs/backlog.html`, updated `docs/roadmap.md` |

## Step 1 — Preflight & parse

1. Stop if `docs/backlog.json` already exists. The project is already migrated; report that and end.
2. Stop if `docs/roadmap.md` does not exist. Phase 1 Step 4 must run first.
3. Read the feature table. Map columns by header name: `ID`, `Feature`, `Priority`, `Size`, `Depends on`, `Status`. If a required column is missing, stop and report the table as-is; do not guess values.
4. Validate each row: ID unique, priority in `Must | Should | Could | Won't`, size in `S | M | L`, status in `pending | in-progress | shipped | deferred`. Report every bad row and stop until the user fixes the table or agrees to map it.
5. Read the Release sections (if any) for release names. If there are none, create one release `r1` named after the project's MVP (status `shipped` if every feature is shipped, otherwise `in-progress`).
6. Scan `docs/roadmap.md` for sections the current kit no longer uses: a `Phase 2 Track` metadata field or section, and a `Gate Checklist` for a removed step. Do not edit them. List each one in the report and ask whether to leave them, or rewrite them to match the current kit (the user decides; the default is to leave them).

## Step 2 — Gather evidence

Run from the project root. Skip the whole step, with a note, if `git rev-parse --is-inside-work-tree` fails.

1. Commits that changed each feature's row, newest first:
   `git log -G"^\| F03 \|" --format="%H%x09%aI%x09%s" -- docs/roadmap.md`
   (replace `F03` with the feature ID; if the ID contains regex or shell characters, escape and quote it).
2. The earliest entry is the **created hint**; the newest entry is the **status hint**. For a `shipped` feature, the status hint is the shipped date.
3. **Squash flag:** count the feature rows changed in that commit:
   `git show --format= --unified=0 <sha> -- docs/roadmap.md | grep -c "^+|"` (counts every added table row, whatever the ID format).
   If the count is greater than 1, the hint is **flagged**: the commit touched other rows, so the date may not be the feature's own. A flagged hint **defaults to `unknown`**, never to a date. It can only become a date by an explicit per-feature answer in Step 3.
4. **Same-commit check:** if the created hint and the status hint are the same commit, the history cannot show when the feature was created. Set the created hint to `unknown` and keep the status hint.
5. Record for each feature: created hint (sha, date, flagged or not, same-commit or not), status hint (sha, date, flagged or not), or "no evidence".

## Step 3 — Review dates (hard gate)

Present one table: feature, status, created hint, status hint, flag, and a default action. Then ask the user, for each feature, one of:

- **Confirm** the hint → event `source: backfill-confirmed`, `evidence` = the commit sha.
- **Correct** the date → the user types an ISO date; event `source: backfill-confirmed`, `evidence: "user-supplied"`.
- **Unknown** → event `at: null`, `source: unknown`.
- **Accept without review** (only for hints that are not flagged) → `source: backfill-unverified`.

Rules:
- A **flagged** hint defaults to `unknown`. The user may explicitly confirm, correct, or accept it as `backfill-unverified` for that one feature. A bulk answer such as "accept all" never covers flagged hints.
- An **unflagged** hint may be accepted as `backfill-unverified` only when the user says so for that feature or for all unflagged features in one answer.
- If there is no hint, the default is `unknown`. The user may still supply a date.
- The user may answer for the whole table at once ("confirm all unflagged, rest unknown"); echo back exactly what that means per feature before writing.

Gate summary: *"[N] dates confirmed, [k] unverified, [m] unknown. Write docs/backlog.json and render? [Yes / change a row]"*

## Step 4 — Write & render (hard gate, then write)

1. Build `docs/backlog.json` from `kit/templates/backlog.json`:
   - `schema_version: 1`; `project` from the project name; `phase2_scope` and `admin_site` from the roadmap metadata.
   - For each feature: keep the legacy ID, priority, size, and dependencies. A `Won't` or `deferred` feature gets `release: null`; every other feature gets its release id.
   - **Title and description:** if the legacy feature text is longer than 80 characters, propose a short `name` (at most 60 characters, taken from the text, no new facts) and move the full original text, unchanged, into `description`. Show every proposed title in the Step 3 review table and get the user's approval or edit for each one before writing. Features whose text is already short keep it as `name` with no `description`.
   - Events, in order: `created` (from the Step 3 decision), then the status event that matches the legacy status (`started` for `in-progress`, `shipped` for `shipped`, `deferred` for `deferred`), with `by: "migration"`, `evidence` from Step 3, and `note: "migrated from roadmap.md"`. A `pending` feature has only the `created` event.
   - Set `status` to match the latest status event (the validator enforces this).
2. Replace the legacy table in `docs/roadmap.md` with the marker pair (`<!-- BEGIN FEATURES -->` and `<!-- END FEATURES -->`), placed where the table was, under "## 2. Feature List". This is the only manual edit allowed to `roadmap.md`; everything else in the file stays.
3. Run `node kit/scripts/render-backlog.js`. It must exit 0. If it exits 1, fix `backlog.json` from the printed errors and run again. Do not hand-edit the generated table.
4. Add one line to the roadmap metadata block: `- **Backlog**: migrated from the legacy table on YYYY-MM-DD; date confidence is recorded per event in docs/backlog.json`.
5. Show the user the rendered `docs/backlog.html` path, and list any features still `unknown` or `backfill-unverified`.

## Completion criteria

- [ ] `docs/backlog.json` exists and the render script exits 0
- [ ] `docs/backlog.html` rendered; every feature from the legacy table appears with its original ID
- [ ] The feature table in `docs/roadmap.md` is between the markers and is generated; narrative sections unchanged
- [ ] Every migrated date has a `source`; no date was invented
- [ ] Roadmap metadata records the migration date

## Transition

Done. Future status changes go through `docs/backlog.json` followed by the render script (see `kit/steps/phase-2/p2-07-ship.md` and `kit/phase-3-iterate.md`).

## Exceptions

- **Table has no ID column or duplicate IDs**: stop; the user fixes the table first.
- **Git hints conflict with the table** (for example, the table says `shipped` but the newest row change says `pending`): report the conflict; the table is the status source, the hint is only a date hint.
- **Feature has shipped but no evidence at all**: write the `shipped` event with `at: null` and `source: unknown`, and say so in the report. The schema allows it; the HTML leaves the date blank. Do not invent a date.
