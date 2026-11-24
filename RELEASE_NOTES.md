## What's new

- **Report kit problems from your own project.** The new `report-kit-issue` skill is installed into `.claude/skills/` with the kit (full and lite). It drafts a GitHub issue from your project's context, redacts secrets, shows you the exact text and posts only after you say yes.
- **Safer upgrades.** `--force` removes kit skills a newer version no longer ships, and only inside `.claude/skills/`. Skills are installed only when the target folder is inside the current project.
- **Fixes reach reporters.** After a release, issues fixed in it get a comment with the upgrade command, a `released` label and are closed.
