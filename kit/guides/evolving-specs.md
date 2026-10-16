# Evolving Specs

When a shipped feature needs to change — new requirements, discovered edge cases, product pivots — the kit has no opinion on how you maintain the artifacts. This guide names three models so you can make an explicit choice rather than drift into inconsistency. Ship (Phase 2 Step 7) asks for the choice once and records it in `docs/constitution.md`.

---

## Changing a Shipped Feature

Shipped features are never edited in `docs/backlog.json`: the file is append-only and a shipped feature stays `shipped`. Every change is a new feature entry, added as `pending` with a `created` event whose `note` names the feature it changes. Add it through Phase 3 if the change needs an impact check, or directly as described in `kit/steps/phase-2/p2-07-ship.md`. Phase 2 then builds it like any other feature.

- **Flow-forward** gives the new entry a new slug, so it gets its own `docs/specs/<feature-slug-v2>/`.
- **Flow-back** and **living spec** keep the original slug, so the existing `docs/specs/<feature-slug>/` is edited in place. Phase 2 skips Step 1 when that spec exists, so approve the spec edit before starting at Step 2.

---

## The Three Models

### Flow-Forward

Completed feature directories are **immutable historical records**. When requirements change, create a new feature directory; the old one stays intact.

**How it works:**
1. Open a new session for the changed feature.
2. Run Phase 2 (`scope: feature`) from Step 1 (Spec), writing to a new `docs/specs/<feature-slug-v2>/` directory.
3. Reference the original spec in the new spec's context so the agent knows what is changing and why.
4. The new cycle produces its own spec, plan, and branch. Ship it as a normal feature.
5. Leave the original `docs/specs/<feature-slug>/` directory unchanged.

**Good fit when:**
- Auditability matters — you want a clear record of how requirements evolved
- Features are well-scoped and rarely revisited
- The team traces decisions back to original intent

**Watch out for:** fragmented context spread across multiple spec directories. Cross-reference them explicitly.

---

### Flow-Back

Any artifact — `spec.md`, `plan.md`, or code — can be edited in place. The team reconciles the full set after the change.

**How it works:**
1. Edit whichever artifact is closest to the change (spec, plan, or code).
2. Decide whether the change affects the other artifacts, and update any that now disagree with the accepted direction.
3. Run Step 4 (Review) to verify the updated implementation still covers every acceptance criterion.
4. Run E2E (Step 5) if the code changed. Ship the diff.

**Good fit when:**
- The team is small and can notice drift quickly
- Implementation discoveries are expected to reshape the original plan
- Speed matters more than preserving each decision as immutable history

**Watch out for:** silent divergence. If the plan or code changes without `spec.md` changing, future contributors will not know which artifact to trust. After any flow-back change, spec, plan, and code must describe the same intended behavior.

---

### Living Spec

`spec.md` is the **source of truth and contract**. `plan.md` is derived from it and regenerated when the spec changes.

**How it works:**
1. Edit `spec.md` first. Do not touch `plan.md` or code yet.
2. Re-run Step 2 (Plan) to regenerate `plan.md` from the updated spec. If the old plan holds rationale worth keeping, carry it forward first.
3. Implement the new and changed tasks (Step 3).
4. Run Step 4 (Review) to confirm every acceptance criterion in the updated spec is covered, then E2E (Step 5). Ship the diff.

**Good fit when:**
- The product contract is stable enough to own the workflow
- The team is comfortable regenerating derived artifacts after spec changes
- Consistency between requirements and implementation matters more than keeping every intermediate plan

**Watch out for:** losing implementation rationale. A regenerated plan can discard decisions that still matter — review the old `plan.md` before overwriting it.

---

## Choosing a Model

1. **Should completed feature directories be historical records, or editable work areas?** Historical → flow-forward or living spec. Editable → flow-back.
2. **Is `spec.md` the single source of truth, or may plan and code become co-equal?** `spec.md` owns → living spec. Co-equal → flow-back or flow-forward.

Record the decision in `docs/constitution.md` under a "Spec Evolution" section so every future contributor knows the rule. A project can use different models in different areas — but only if that is explicit, not accidental.

---

## Whichever Model You Choose

Any spec change that results in code changes goes through Step 4 (Review) before shipping: its acceptance-criteria coverage check catches a new criterion that nobody implemented, exactly as it does on the first pass.

Any edit to `spec.md` also updates its `## Data & Flow Impact` section and applies the resulting amendments to `docs/data-model.md` and `docs/flows.md` (rule in `kit/steps/phase-2/p2-01-spec.md`) before Step 2 starts; flow-forward does this through its new spec.
