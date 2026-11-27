# Ship Checklist — <Project>

**Status:** draft
**Last updated:** <YYYY-MM-DD>
**Based on:** <files scanned>

## How Ship uses this

Ship reads this file before the commit. For every item whose `Applies when` matches the change, it runs or inspects the `Check (evidence)` and reports one result per item: `pass` (with evidence), `fixed` (done now, with evidence), `n/a` (the condition is not met), or `blocked` (needs the user). An item is never `pass` without evidence. An item whose evidence path or command no longer exists is stale and is reported as `blocked`. This file holds only the item list; per-run results are shown in chat.

- `Applies when`: `always`, or a condition on the change (for example `user-visible behavior`, `schema change`, `new env var`, `new dependency`).
- `Check (evidence)`: a command to run or a file or section to inspect that proves the item is done (for example `git diff --name-only` includes `CHANGELOG.md`).
- `Source`: the file where the scan found the item, or `user`.

## Docs

| # | Item | Applies when | Check (evidence) | Source |
|---|---|---|---|---|
| 1 | <item> | <always or condition> | <command or file/section> | <file path or user> |

## Changelog and version

| # | Item | Applies when | Check (evidence) | Source |
|---|---|---|---|---|
| 1 | <item> | <always or condition> | <command or file/section> | <file path or user> |

## Config and env

| # | Item | Applies when | Check (evidence) | Source |
|---|---|---|---|---|
| 1 | <item> | <always or condition> | <command or file/section> | <file path or user> |

## Data/migrations

| # | Item | Applies when | Check (evidence) | Source |
|---|---|---|---|---|
| 1 | <item> | <always or condition> | <command or file/section> | <file path or user> |

## Tests and CI

| # | Item | Applies when | Check (evidence) | Source |
|---|---|---|---|---|
| 1 | <item> | <always or condition> | <command or file/section> | <file path or user> |

## Tracking (issues/backlog)

| # | Item | Applies when | Check (evidence) | Source |
|---|---|---|---|---|
| 1 | <item> | <always or condition> | <command or file/section> | <file path or user> |

## PR/release

| # | Item | Applies when | Check (evidence) | Source |
|---|---|---|---|---|
| 1 | <item> | <always or condition> | <command or file/section> | <file path or user> |

## Notes

<rules the user added that fit no category; delete this line if none>
