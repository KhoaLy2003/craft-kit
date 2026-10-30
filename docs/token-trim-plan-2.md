# Kit token-trim plan 2: structural reductions

**Status:** draft, awaiting approval. Nothing here is started.
**Follows:** `docs/token-trim-plan.md` (wording trims, done: hot path 130.8K → 113.9K chars).
**Why a second plan:** what is left is rules, gates and checklists. Wording cannot shrink them; only loading less, merging duplicates, or removing steps can. Those change behavior, so every item has a risk level and is validated in a test round (R06) before release.

## Goal and targets
- Phase 1 + 2 reading set ≤ 95K chars (from 113.9K).
- **Per-step** reading set (conventions + phase file + step file) down further than the total, since the conventions file is re-read on every step.
- Zero change to gates, hard-gate list, produced artifacts, or the E2E pass bar.

## Rules for every item
1. One item at a time. After each: `npm test` green, CHANGELOG line, results row below.
2. Items marked **behavior change** also update `tests/`, `AGENTS.md`, `README.md`, and `docs-site` in the same item, and are not released before R06 passes.
3. If an item breaks a consistency test, fix the test only when the test encodes the thing being removed; otherwise revert the item.
4. No commits until the user reviews each phase of the plan.

## Phase S: Lazy loading (load less, rules unchanged). Lowest risk, biggest saving per step

- [x] **S1 Split the conventions file.** Done: conventions 11.2K → 7.7K; new `guides/diagrams.md` (1.9K) and `guides/test-accounts.md` (2.5K); per-step total 415.6K → 365.1K (-12%) before the guides are loaded; added to docs-site config, docs build OK. `orchestrator-conventions.md` is read at every step (11.2K). Move the rarely needed blocks into on-demand files and leave a one-line pointer:
  - rule 8 Diagrams (~2.3K) → `kit/guides/diagrams.md` (read only when a doc is `approved` and `archify` renders).
  - Test account registry (~2.4K) → `kit/guides/test-accounts.md` (read at Scaffold, E2E, Manual Check, admin).
  - Design dispatch contract (~1.2K) stays inline (used by every UI dispatch).
  Expected: conventions ≈ 5.5K, saving ≈ 5.7K on every step that does not render diagrams or touch accounts. Check `tests/cli.test.mjs` `KIT_REF` regex: `guides/*.md` already matches; update `kit-consistency` only if it lists known files.
- [x] **S2 Phase 2 scope `feature` block on demand.** Done: feature loop + parallel features (1.2K) to `guides/phase-2-feature-scope.md`; mid-cycle escape stays inline because it triggers under `scope: all`; phase-2.md 8.5K → 7.5K. Move "Parallel features", "Feature loop", "Mid-Cycle Escape" and the scope-differences rows that apply only to `scope: feature` (~3K of `phase-2.md`) into `kit/guides/phase-2-feature-scope.md`, read only when `Phase 2 Scope: feature`. `scope: all` (the validated default) never loads it.
- [x] **S3 Phase 3 Change control on demand.** Done: `guides/change-control.md` (2.4K); phase-3-iterate.md 21.2K → 19.1K. Move "Change control" (~3K) from `phase-3-iterate.md` into `kit/guides/change-control.md`, read only when a feature is cancelled or scope changes after Step 2. Update the references in `p2-01-spec.md` (cancelled status).
- [x] **S4 Phase 1 handoff and closeout on demand.** Done: moved into p1-08; bootstrap 8.5K → 6.2K (read by every Phase 1 step), p1-08 6.7K → 9.1K. Closeout checklist and handoff prompt (~3K of `phase-1-bootstrap.md`) are used once, at Step 8. Move them into `p1-08-scaffold.md` (their only caller) so Steps 1–7 do not re-read them with the phase file.
- [x] **S5 (revised) Lazy-load the optional path.** A read-only-this-path instruction saves nothing because the agent reads the whole file, so Path B (MCP) and the manifest schema moved to `guides/design-mcp.md`; p1-05 9.3K → 8.0K. p1-03 has no optional path (Phases A-D all run), so no change. Where one step has independent sub-phases (p1-03 Phases A–D, p1-05 Paths A/B), state "read only the Path you are executing". Measure whether agents honor it in R06.

## Phase D: De-duplication (same facts, one place)

- [x] **D1 (done: 7 step files, -2.2K, far below the 6K estimate because most criteria were already new checks) Completion Criteria that restate Rules.** The consistency test only requires the section to exist. Where a criterion repeats a rule word for word, replace the bullet with a pointer ("all Rules satisfied") and keep only checks that are new (artifact exists, user approved, command passes). Estimated 0.3–0.6K per step file × 15 files ≈ 6K. Risk: agents lose an explicit checklist; keep it for hard-gate steps.
- [x] **D2 (done, small: template only; the closeout list never duplicated it) One scaffold/closeout checklist.** `templates/08-scaffold-checklist.md` (3.4K) and the Phase 1 closeout checklist overlap. Keep the closeout checklist as the single list, reduce the template to the items that only exist at scaffold time. Update `tests/` (template metadata exceptions) and `p1-08`.
- [x] **D3 (reviewed, not done: summaries are already one sentence carrying counts/decisions; only the longest, p2-01, was shortened) Gate Summary sentences.** Each step carries a full-sentence gate summary (~250 chars × ~20). Replace with a single conventions rule plus a per-step "Decision:" noun phrase (what is being approved). Risk: gate messages become less specific; the conventions rule already requires naming the decision.
- [x] **D4 (reviewed, nothing left: the first wording pass already replaced restated conventions rules with pointers) Metadata-header, `Status`, and "write file then ask review" restatements.** Grep for repeats of conventions rules 3, 4 and the artifact metadata header in step files and replace with the rule number.
- [x] **D5 (reviewed: remaining repeats such as the pinned install command appear in distinct contexts; no change) Cross-file restatements.** Audit for facts stated in two files (Should-feature rule, skip detection, Phase 2 scope rule, handoff prompt) and keep one owner plus a pointer. List each found duplicate in the results table.

## Phase B: Behavior changes (need R06). Highest saving, highest risk

- [x] **B1 (assessed, NOT done: an optional step that is skipped is never read, so removing it saves ~4.6K only for projects that run it) Make Market Research opt-in by default.** Today it is optional but has its own step file, template, gate, and Step 1 question. Option A: remove the step and fold its output (comparable products, feature inspirations) into the idea brief as an optional section when the user asks. Option B: keep the step, drop the question (default skip, user says "run"). B is a smaller change. Touches: bootstrap table, p1-01, p1-02, p1-04 (feature inspirations rule), kickoff template, tests (step list), docs-site, AGENTS.md gate list.
- [x] **B2 (assessed, NOT done: ~1.5K of boilerplate saved, heavier architecture gate) Merge Constitution into Architecture.** Step 7 is `soft`, `fast`, 3.7K plus a 4K template. Fold it into Step 6 as a final section so the architecture gate approves both. Risk: Step 6 grows; the constitution is read by every Phase 2 agent, so it must stay a separate file (`docs/constitution.md` path unchanged).
- [x] **B3 (assessed, NOT done: the skip condition already exists in the bootstrap table) Drop the Phase 1 Step 3 / Step 5 split for single-screen apps.** Step 5 already has a skip condition; make it automatic when the prototype covers every screen, instead of a step the orchestrator reads and then skips.
- [x] **B4 (assessed, NOT done: ~1K saved, loses a handover seam) Optional: collapse Phase 2 Steps 4 and 5.** Review and E2E run back to back with the same agent and a shared fix loop. Merging removes one step file and one handover seam. Risk: seam loss; only do it if R06 shows handovers are rarely used at Step 4.

## Phase M: Measure and validate

- [x] **M0 Baseline script (before any item).** Done: `node tests/measure-reading-set.mjs`; baseline 415,610 chars per full Phase 1 + 2 run (every step re-reads conventions + phase file). Add a dev-only script (not shipped, under `tests/` or `testing/`) that sums characters of the files each step reads: conventions + phase file + step file + its template. Record per-step numbers here so S/D/B savings are real, not estimated.
- [ ] **M1 R06 run.** Run a full Phase 1 → Phase 2 round on a small project with the modified kit. Pass bar: 100% generated E2E pass, every hard gate reached in order, all expected artifacts present, no step skipped by mistake. Compare tokens and credits against R05 if recorded.
- [x] **M2 Decide.** Decision: no B items. The M0 metric counts a worst case where every step re-reads the conventions and phase file. Realistic cost is each file read once: about 106K chars (~26K tokens) of kit files for Phase 1 + 2, plus templates. B items are worth ~5K for real behavior risk. Keep B items only if R06 passes and the saving is at least 10% of total tokens; otherwise revert them and keep S and D.
- [ ] **M3 Release.** Bump version, CHANGELOG, tag per the release process in `AGENTS.md`.

## Suggested order
M0 → S1 → S2 → S3 → S4 → D1 → D2 → D3 → D4 → D5 → S5 → (review) → B1 → B2 → B3 → B4 → M1 → M2 → M3.
Do S and D first: they keep every rule and gate, and S1 alone should save more than any single wording pass did.

## Expected savings (estimates, to be replaced by M0 numbers)
| Item | Est. chars | Risk |
|---|---|---|
| S1 | 5.7K per step | low |
| S2 | 3K for `scope: all` | low |
| S3 | 3K for Phase 3 | low |
| S4 | 3K for Steps 1–7 | low |
| D1–D5 | 8–12K | low–medium |
| B1 | 5–7K | medium |
| B2 | 3–4K | medium |
| B3/B4 | 2–4K | medium |

## Results log
| Item | Before | After | Notes |
|---|---|---|---|
| M0 | - | 415,610 | per-step reading set, Phase 1 + 2 |
| S1 | 415,610 | 365,107 | conventions 11,167 → 7,700; guides read on demand add ~2K to the steps that need them |
| S2-S5 | 365,107 | 340,466 | -6.7% on top of S1; total -18% vs M0 baseline. Hot path file set 113.9K → 108.4K |
| D1-D5 | 340,466 | 337,922 | D1 -2.2K, D2 ~-0.6K; D3-D5 nothing worth the risk |

## Outcome
- Phase S and D done and committed (`dba1dbe`, `eeb3bf5`). M0 worst-case metric 415.6K → 337.9K (-18.7%); files read once, Phase 1 + 2: 130.8K → ~106K (-19%).
- Phase B not worth doing. Remaining open items: M1 (R06 round, to confirm agents follow the on-demand guides and behave the same) and M3 (release).
