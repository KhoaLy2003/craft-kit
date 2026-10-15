# Release notes

**Agents simplified.** The installer now sets up one specialist agent, `code-reviewer`. Implementation, research, UI, and testing work goes to your platform's general-purpose agent. You no longer need to download five VoltAgent agents (frontend-developer, backend-developer, market-researcher, research-analyst, ui-ux-tester).

**Fewer optional installs.** The optional `evon:ui-ux` admin-site skill is gone. `design-taste-frontend` is still installed and used for UI quality work.

**Design contract kept.** The rules for turning Phase 1 design files into implementation input (MCP, file fallback, `DESIGN.md` fallback) are unchanged. They now live under a neutral name, *Design dispatch contract*.

**Smaller routing file.** `kit/task-agent-rubric.md` is a short routing table instead of a long per-agent list.

**Migration.** Existing projects keep working. Re-run the installer with `--force` to drop the removed agent files. Files you added yourself are never touched.
