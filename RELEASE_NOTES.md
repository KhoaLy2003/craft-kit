## What's new

- **Start anywhere:** say `Start using kit/START.md.` and the kit inspects your project, then tells you which workflow to run and the exact prompt.
- **Adopt existing codebases:** a new one-time workflow reads your code and writes the architecture, constitution, baseline roadmap and more, labelling every fact `from-code`, `from-docs` or `unknown`. Source code is never touched.
- **Verification Commands and Definition of Done:** the constitution now lists your real build, lint, typecheck and test commands; Review, E2E and Ship run them.
- **Requirements intake:** start Phase 1 from a BRD, PRD or tickets; the kit asks only about gaps and conflicts.
- **Ship hardening:** structured PR description, CI status recorded, product changelog entry.
- **Early non-functional requirements** in the roadmap, traced through review and E2E.
- **Version record and docs lint:** `docs/.craft-kit.json` pins the kit version; `lint-docs.js` flags invalid or stale documents.

All new workflows are experimental and not yet validated in a test round.
