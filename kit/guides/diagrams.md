# Diagram rendering

> Read only when rendering a diagram to HTML with the `archify` skill (conventions rule 8). Everything else stays Mermaid or text in the document.

Diagrams live in the markdown document (Mermaid where the template has a diagram block, else text). Render to interactive HTML with the `archify` skill only the diagrams in the table below, after the document is `approved`; everything else stays Mermaid or text. Output: `docs/diagrams/<doc>-<name>.html` plus its typed JSON source beside it as `.json`; link the HTML under the document's `Diagrams` line. Follow the skill's workflow (typed JSON, then `finalize`); never hand-write the HTML, and check the result against the document.

| Candidate | Archify type | Render only when |
|---|---|---|
| System overview (`architecture.md` §5) | `architecture` | always (exactly 1) |
| Screen flow (`flows.md` §2) | `workflow` | the role or area has 5+ screens or a guarded branch; at most 1 per role |
| Core journey (`flows.md` §3) | `sequence` if it crosses an external service, else `dataflow` | a Core User Flow with 4+ steps; one diagram per journey |
| ER diagram (`data-model.md` §2) | `erd` (Archify 3+; older copies keep the Mermaid `erDiagram` only) | always (exactly 1); one table per entity with every §3 field, `pk`/`fk`/unique roles with `references`, a domain `tag` per entity when the model has more than 8 |

`data-model.md` §2 always carries the Mermaid `erDiagram` as the diffable source. Entity lifecycles are never rendered. **Budget: at most 6 rendered diagrams, not counting the ER diagram**; when over, keep in this order: system overview, primary-role screen flow, core journeys by build order, other screen flows. Phase 2 amendments re-render only an already-rendered diagram whose source changed. If `archify` is missing and the user agreed to proceed without it, skip the HTML and note it in the session log; it never blocks a gate.
