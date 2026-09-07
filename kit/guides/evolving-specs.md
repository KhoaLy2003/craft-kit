# Evolving Specs

When a shipped feature needs to change — new requirements, discovered edge cases, product pivots — the kit has no opinion on how you maintain the artifacts. This guide names three models so you can make an explicit choice rather than drift into inconsistency.

---

## The Three Models

### Flow-Forward

Completed feature directories are **immutable historical records**. When requirements change, you create a new feature directory; the old one stays intact.

**How it works:**
1. Open a new session for the changed feature.
2. Run the Phase 2 cycle from Step 1 (Brainstorm & Spec) in a new `docs/specs/<feature-slug-v2>/` directory.
3. Reference the original spec in the new spec's context section so the agent understands what is changing and why.
4. The new cycle produces its own spec, plan, and branch. Ship it as a normal feature.
5. Leave the original `docs/specs/<feature-slug>/` directory unchanged.

**Good fit when:**
- Auditability matters — you want a clear record of how requirements evolved over time
- Features are well-scoped and rarely revisited
- The team traces decisions back to original intent

**Watch out for:** duplicate or fragmented context spread across multiple spec directories. Cross-reference them explicitly.

---

### Flow-Back

Any artifact — `spec.md`, `plan.md`, or code — can be edited in place. The team reconciles the full set after the change.

**How it works:**
1. Edit whichever artifact is closest to the change (spec, plan, or code).
2. Determine whether the change affects the other artifacts.
3. Update any artifact that now disagrees with the accepted direction.
4. Run the Converge step (Phase 2 Step 5 / Step 4 single-pass) to verify the updated implementation still covers all acceptance criteria.
5. Run code review and E2E if the code changed. Ship the diff.

**Good fit when:**
- The team is small and can notice drift quickly
- Implementation discoveries are expected to reshape the original plan
- Speed matters more than preserving each decision as immutable history

**Watch out for:** silent divergence. If `tasks.md` or code is changed without updating `spec.md`, future contributors may not know which artifact to trust. After any flow-back change, all three must describe the same intended behavior.

---

### Living Spec

`spec.md` is the **source of truth and contract**. `plan.md` and task breakdowns are derived from it and are regenerated when the spec changes.

**How it works:**
1. Edit `spec.md` first. Do not touch `plan.md` or code yet.
2. Re-run the Phase 2 Plan step to regenerate `plan.md` from the updated spec.
3. Re-run Converge to identify what the implementation now needs to change.
4. Implement the gap tasks, then run code review and E2E. Ship the diff.
5. If important implementation rationale exists in the old `plan.md`, carry it forward explicitly before regenerating.

**Good fit when:**
- The product contract is stable enough to own the workflow
- The team is comfortable regenerating derived artifacts after spec changes
- Consistency between requirements and implementation matters more than keeping every intermediate plan

**Watch out for:** losing implementation rationale. Regenerated plan files can discard decisions that still matter. Before overwriting, review the old `plan.md` for any decisions worth preserving.

---

## Choosing a Model

Answer two questions:

1. **Should completed feature directories be historical records, or editable work areas?**
   - Historical → flow-forward or living spec
   - Editable → flow-back

2. **Is `spec.md` the single source of truth, or are plan and tasks allowed to become co-equal?**
   - `spec.md` owns → living spec
   - Co-equal → flow-back or flow-forward

Record the decision in `docs/constitution.md` under a "Spec Evolution" section so every future contributor knows the rule. A project can use different models in different areas — but only if that is explicit, not accidental.

---

## When to Use the Kit's Converge Step for Spec Changes

Regardless of which model you adopt, any time a spec change results in code changes, run the Converge step before shipping:

1. Update the spec (flow-back or living spec) or write the new spec (flow-forward).
2. Make the code changes.
3. Run Converge — verify the updated implementation covers every acceptance criterion in the updated spec.
4. Fix any gaps. Then run code review and E2E.

Converge catches cases where a spec change added a new criterion that the developer forgot to implement — the same problem it solves on the first pass.
