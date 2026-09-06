# Gate Management

> Gate types control when the orchestrator pauses for human input.
> Every step in every phase file declares one of these gate types.

---

## Gate Types

| Gate | Behavior |
|---|---|
| `none` | Auto-advance — no human decision required; proceed directly to the next step |
| `soft` | Advance with visibility — present a summary of what was produced; the default is to advance, but the user may request changes before proceeding |
| `hard` | Stop — wait for explicit human approval before advancing; do not proceed on silence or a generic "continue" |

---

## Hard Gate Protocol

At every `hard` gate, the orchestrating agent MUST:

1. **Emit a Gate Summary** — one sentence: the most important thing the human needs to know about what they're reviewing.
   Format: `> **Gate:** [one sentence]`
   This gives non-technical users a clear decision point without reading the full artifact.

2. **Surface the specific decision being confirmed** — the user must know *what* they are approving (e.g. a stack name, a scope boundary, a spec document) before they respond. A gate message that does not name the decision leaves the user unable to give meaningful approval.

3. **Wait for an explicit response.** A non-response, silence, or a generic "continue" / "looks good" is sufficient *only if* the gate message already named the specific decision. If the decision was not named, prompt again.

4. **Do not advance until the response is received.** No amount of apparent completeness on the orchestrator's part overrides the hard gate.

---

## Soft Gate Protocol

At every `soft` gate, the orchestrating agent MUST:

1. Present a summary of what was produced (e.g. task count, key decisions, files created, parallel groups identified).
2. Give the user an opportunity to request changes.
3. Advance if no changes are requested. A soft gate is not a silent advance — it is an advance with visibility.

---

## Gate Summary Examples

**Good** — specific, names the decision:
> **Gate:** The recommended stack is React + Supabase. Review the reasoning and confirm before we write the architecture document.

> **Gate:** Market research is done. The main finding is [one sentence from Conclusions]. This is your proceed / pivot / stop decision.

**Poor** — vague, no clear decision:
> **Gate:** The architecture step is done. Please review and approve.

> **Gate:** Step 5 is complete.
