# Ship checklist

**Status:** draft
**Last updated:** YYYY-MM-DD

What Step 6 Ship checks before the work lands. One table, one row per item. Replace the placeholder rows with items found in this project; delete any that do not apply. An item with no evidence source is `unknown`, not invented.

<!-- Categories to scan for: Docs, Changelog/version, Config/env, Tests, PR. Group rows under a heading per category when the list grows. -->

| # | Item | Applies when | Check (evidence) | Source |
|---|---|---|---|---|
| 1 | <item, e.g. README matches how to run it> | <always or a condition> | <command or file that proves it> | <file or user> |
| 2 | <changelog entry added> | <user-visible behavior> | <command or file that proves it> | <file or user> |
| 3 | <new env var listed> | <new env var> | <command or file that proves it> | <file or user> |

Ship report per item: `pass` (with evidence), `fixed` (done now, with evidence), `n/a` (condition not met), `blocked` (needs the user). Never `pass` without evidence. The file holds only the item list; results are shown in chat each run.
