## What's new

- **Leaner Phase 2:** plans carry signatures instead of code, specs have a size target, session logs and handovers stay short, and review fixes only critical and important findings.
- **One base branch:** the constitution records the branch every feature, fix and admin branch starts from and every PR targets (`Base branch:`), plus which branches CI runs on, so release-branch projects need no manual correction.
- **Known issues:** minor review findings and gaps that ship open now live in `docs/known-issues.md` and must be cleared at Phase 3 Closeout.
- **Smaller bookkeeping:** backlog events can omit default fields, `docs/backlog.html` is no longer committed, lint takes a `Reviewed against:` date to silence resolved stale warnings, and hard gates list numbered decisions with defaults.
- **Phase 3 designs** end with a per-feature slice index, so each feature reads only its part of the wave design.
- **Cleaner install:** installed kit files no longer point at website paths or contain website HTML (a test now guards this), and the `AGENTS.md` workflow block no longer pins a kit version.
