**Status:** draft
**Last updated:** 2026-11-06
**Based on:** `kit/` (all), `docs-site/` (all), `README.md`, `AGENTS.md`, `docs/token-trim-plan*.md`, `docs/20261103/*`, `docs/20261106/admin-docs-audit.md`, `tests/measure-reading-set.mjs`, git history of `kit/orchestrator-conventions.md`

# Craft-kit workflow docs: audit, plan and estimate

Lens: Diátaxis type per file, audience (kit = AI agent, docs-site = human), and read cost (chars ÷ 4 ≈ tokens; estimates, not billed tokens).

## 1. Headline findings

| # | Finding | Evidence | Severity |
|---|---|---|---|
| 1 | **The token trim has regressed.** The trim plans closed at 337.9K chars per-step reads. Today the same script reports 444.8K (+32%). The installed kit went 351K → 393K (+12%). | `node tests/measure-reading-set.mjs`; `git ls-tree` at `dba1dbe` vs `HEAD` | High |
| 2 | **`orchestrator-conventions.md` grew back.** The plan recorded 7.7K after split S1. It is 14.3K now (19 rules plus Definition of Done). It is re-read at every step. | 14,271 B; rules 13–19 and DoD added after the trim | High |
| 3 | **No size budget guards the hot path.** Nothing fails when a step or conventions grows, so each feature adds weight (finding 1 is the result). | No budget assertion in `tests/` | High |
| 4 | **Phases 3, Admin and Adopt are single monoliths.** Phase 1 and 2 load one small step file at a time; these three load everything at once. | `phase-3-iterate.md` 21.4K, `phase-admin.md` 17.6K, `phase-adopt.md` 13.4K | Medium |
| 5 | **Dense paragraph-lines hurt agents and humans.** Rules are crammed into 600–1,100-char lines. | `phase-adopt.md` 4 lines, `phase-2.md` 3 lines (Prerequisites, Preflight, Entry guard), `conventions` 3 lines, `p1-04` 1,119 chars | Medium |
| 6 | **Large reference files can be pulled in whole.** `design-reference.md` (23.6K) is only a sample `DESIGN.md`, but `p1-03` points to it as "a full example". `stack-catalog.md` (21K) is read selectively by instruction, but the instruction is only a prose rule. | `p1-03` line 48, `p1-06` line 25 | Medium |
| 7 | **Three overlapping on-ramps for humans.** README (14.4K), `docs-site/index.md` (10.2K) and `getting-started.md` (16.3K) each explain what the kit is, the phases and how to start. | Heading overlap: phases, existing projects, bug fix, admin, onboarding appear in all three | Medium |
| 8 | **Human guides restate the kit.** `guides/phase-3-iterate.md` (10.8K) walks the same five steps as the 21K kit file; `existing-projects.md` (10.2K) overlaps `phase-adopt` and `phase-upgrade`. Two copies drift. | Same step headings in both | Medium |
| 9 | **`AGENTS.md` (19.9K) loads on every session in this repo** and restates kit internals (phase diagrams, gate list, template numbering) already owned by `kit/`. | `AGENTS.md` | Medium |
| 10 | **Growth in generated project docs was fixed in 0.0.44–0.0.45 (spec/plan size, collapse at Ship, growth lint) but never validated.** The LifeAtlas sample was 93K + 109K. Plan item M1 (R06 round) is still open. | `token-trim-plan-2.md` M1, M3 unchecked; 0.0.45 changelog | Medium (unverified) |
| 11 | **Dead and stray files.** `docs/improvement.txt` (30K) and `docs/reverse-engineering.txt` are untracked scratch. `docs/20261103/` (214K of sample logs) is untracked. The two trim plans are tracked in `docs/`, though both are finished. | `git status` | Low |
| 12 | **Six one-time upgrade modules (38K) ship to every install** and are used only by projects from older kits. Not on the hot path, but they add noise to the kit and to the docs-site sidebar. | `phase-*-backfill/migrate/collapse.md` | Low |

What is already good (keep): Phase 1/2 step files follow one skeleton; the banner, gates and model tiers have one owner; the sidebar is generated from one page table; the CLI test blocks catch broken links; the admin workflow was already collapsed into one file.

## 2. Audience split (target state)

| Audience | Owns | Rule |
|---|---|---|
| AI agent | `kit/**` | Imperative, one rule one place, tables over prose, no motivation text beyond one clause, lazy-loaded guides |
| Human | `docs-site/**`, `README.md` | Explain the why and the choices; never restate a step's rules, link to the generated kit page |
| Repo maintainer | `AGENTS.md`, `kit/CHANGELOG.md`, `testing/` | Short index with pointers; no copy of kit content |

## 3. Plan

Effort is rough working time for one person with an agent. Savings are on the same metric as `measure-reading-set.mjs` (worst case: conventions plus phase file re-read at each step) and on the "read once" set.

### Phase A: Stop the regression (agent-facing, no behavior change)
| Item | Change | Saving | Effort | Risk |
|---|---|---|---|---|
| A1 | Add a **budget test** to `tests/kit-consistency.test.mjs`: fail if conventions > 9K, any step file > 8K, any phase file > 8K, or the measured hot path rises above the recorded number. Record today's numbers as the baseline. | Prevents all future drift | 1–2 h | Low |
| A2 | **Slim conventions 14.3K → ~9K.** Move rules 13 (untrusted input), 18–19 (resume, checkpoint) and the Definition of Done into `guides/session-handover.md` and the P2 phase file, which are their only callers. Leave one-line pointers. | −5K per step read; −75K worst case | 3–4 h | Low–Med (rule numbers are cited by other files; tests check links) |
| A3 | **Make heavy references opt-in.** Remove the "see design-reference.md" pointer from `p1-03` (or mark it "do not read; human sample"); move the file to `docs-site/` or `kit/resource/` (not installed). Turn the stack-catalog read rule into a headed index at the top of the file. | −23.6K installed; avoids a 6K-token accidental read | 1 h | Low |
| A4 | **Reflow dense lines** (finding 5) into short lists/tables in `phase-2.md`, `phase-adopt.md`, conventions, `p1-04`. Wording unchanged. | ~−2K, clearer gates | 2 h | Low |

### Phase B: Load only what the step needs (agent-facing, structure change)
| Item | Change | Saving | Effort | Risk |
|---|---|---|---|---|
| B1 | Split `phase-3-iterate.md` into a ~5K phase file plus `steps/phase-3/p3-0N-*.md` (same skeleton as Phase 1/2). | 21K → ~9K per run (−12K) | 4–5 h | Med: step-count tests and docs-site mapping |
| B2 | Same for `phase-admin.md` (17.6K → ~8K per run) and `phase-adopt.md` (13.4K → ~7K). Do after B1 proves the pattern. | −16K per run | 6–8 h | Med |
| B3 | Fold the six upgrade modules into `phase-upgrade.md` as a table of "gap → module" and keep module files only for versions that still need them; mark each with a retire-by version. | −20 to 38K installed | 3 h | Low–Med |

### Phase C: Human docs (docs-site and README)
| Item | Change | Saving | Effort | Risk |
|---|---|---|---|---|
| C1 | **One on-ramp.** `getting-started.md` owns "install → first run". `index.md` becomes a one-page overview with links. README shrinks to install, the one-line prompt and links to the site. | 40K → ~24K across the three | 4 h | Low |
| C2 | **Guides stop restating kit steps.** `guides/phase-3-iterate.md` and `existing-projects.md` keep when/why/decisions/common situations; step rules link to the generated kit page and its summary box. | −8K, no drift | 3–4 h | Low |
| C3 | Trim `AGENTS.md` to ~9K: keep commands, conventions, test and release rules; replace the workflow diagram, gate list and template numbering with pointers to `kit/phase-*.md`. Keep the `Hard gates:` line the test checks, or point the test at the phase files. | −11K per repo session | 2 h | Low |

### Phase D: Validate and tidy
| Item | Change | Effort |
|---|---|---|
| D1 | Make `measure-reading-set.mjs` print two numbers: worst case and read-once (plus on-demand guides). Record before/after in a results table. | 1 h |
| D2 | **R06 round** (open item M1): one small project, Phase 1 → Phase 2, final kit. Record billed tokens and wall time, compare with R05. This is the only way to confirm the cuts change real cost and that agents follow the lazy-loaded guides. | 3–5 h of runs |
| D3 | Housekeeping: delete or move `docs/improvement.txt`, `docs/reverse-engineering.txt`, the two finished trim plans and `docs/20261103/` into gitignored `testing/` (or delete). Tag the release per AGENTS.md. | 1 h |

**Total: ≈ 35–45 h, about 5 working days.** Order: A1 → A2 → A3 → A4 → D1 (baseline) → B1 → C1–C3 → B2 → B3 → D2 → D3. A and C are safe to ship alone.

## 4. Before and after (estimates)

| Metric | Before (measured) | After A | After A+B | After A+B+C |
|---|---|---|---|---|
| Installed kit (excl. CHANGELOG, resource) | 393K | ~366K | ~330K | ~330K |
| Conventions, re-read per step | 14.3K | ~9K | ~9K | ~9K |
| Per-step worst-case reads, Phase 1+2 | 444.8K (337.9K at last trim) | ~365K (−18%) | ~365K | ~365K |
| Read-once set, Phase 1 / Phase 2 | 77K / 61K | ~70K / ~55K | same | same |
| Phase 3 run (kit files read) | ~21K + conventions | ~16K | ~9K | ~9K |
| Admin / Adopt run | 17.6K / 13.4K | same | ~8K / ~7K | same |
| Human on-ramp (README + index + getting-started) | 40.5K | 40.5K | 40.5K | ~24K |
| `AGENTS.md` loaded per repo session | 19.9K | 19.9K | 19.9K | ~9K |
| Regression guard | none | budget test | budget test | budget test |

In tokens (÷4): the Phase 1+2 read-once set is about 35K tokens now and about 31K after. Phase 3 saves about 3K tokens per run, Admin and Adopt about 2–3K each.

## 5. Caveats

- **Kit reading is a small part of run cost.** The kit files an agent reads in a full Phase 1 + 2 are roughly 35K tokens. A real run also pays for generated specs, plans, E2E docs, subagent dispatches that repeat context, and test and review loops. Phases A–C trim the doc share of a run by 10–20%, which is a low single-digit percent of the whole bill. The larger savings are in generated artifacts (finding 10) and in how often subagents re-read them. Those were fixed in 0.0.44–0.0.45 but are unmeasured until R06.
- **The "+32%" is a worst-case metric** the earlier plan itself called pessimistic (every step re-reads conventions and the phase file). The direction is real (the installed kit grew 12%); the exact percentage is not what you pay.
- **Not verified:** I did not run `npm test`, the docs-site build or any workflow. Estimates for A2/B1/B2 depend on how many references to rule numbers and step counts the tests enforce; I counted file sizes, not those links.
- Rule numbers in conventions are cited by many files ("rule 18"). Renumbering is the main risk in A2: move text, keep the numbers, add pointers.
- `docs/reverse-engineering.txt` looks like an outline for an "analyze existing code" workflow. Adopt already covers most of it. I treated it as scratch.

## 6. Decisions needed

1. Proceed with A + C first (~2 days), then decide on B after the R06 numbers?
2. May the upgrade modules be retired on a version schedule (B3), or must they stay for old projects?
3. Should the human on-ramp live only on the docs-site, with README reduced to install plus a link?

## 7. Implementation result (2026-11-06, uncommitted)

`npm test` 105/105 and the docs-site build pass. Measured with `node tests/measure-reading-set.mjs` (same script on HEAD and on the working tree).

| Item | Status | Result |
|---|---|---|
| A1 budget tests | done | conventions ≤ 12K, phase file ≤ 8K, step file ≤ 10.5K, installed kit ≤ 400K |
| A2 slim conventions | partly | 14.3K → 11.5K (target 9K missed; the remaining rules are used by every workflow) |
| A3 heavy references | done | `design-reference.md` marked human-only; stack-catalog already selective |
| A4 dense lines | partly | `phase-2.md` reflowed; `phase-adopt.md`, `p1-04` not touched |
| B1 Phase 3 split | done | 21.3K file → 4.8K phase file + 5 step files |
| B2 admin/adopt split | not done | admin was merged into one file on purpose in the last commit; adopt runs once per project |
| B3 upgrade modules | not done | needs your decision (question 2) |
| C1 on-ramps | partly | README 14.4K → 9.0K; `index.md` 10.2K → 8.7K; `getting-started.md` untouched |
| C2 guides | partly | `guides/phase-3-iterate.md` 10.8K → 10.2K |
| C3 AGENTS.md | done | 19.9K → 16.0K (target 9K missed; maintainer rules kept) |
| D1 measuring script | done | worst case and read-once, Phase 3 included |
| D2 R06 round | not done | needs a real run |
| D3 housekeeping | not done | deleting or moving your untracked files needs your OK |

| Metric (same script, base = conventions + session-logging + phase file) | HEAD | Now |
|---|---|---|
| Worst case, Phase 1 + 2 | 499.6K | 456.6K (−8.6%) |
| Phase 1 worst case / Phase 2 worst case | 274.9K / 224.7K | 252.2K / 204.4K |
| Read once, Phase 1 / Phase 2 | 108.6K / 70.9K | 105.6K / 67.5K |
| Conventions | 14.3K | 11.5K |

**Correction to section 4:** the Phase 3 split does not reduce the total a full five-step Phase 3 run reads (the same step content is read; it is now spread over five files). It reduces what each step loads (about 9K instead of 21K) and what a resumed or split session loads. The "21K → 9K per run" estimate was wrong for a run that finishes in one session. The installed kit stays roughly flat (about +1%).

## 8. Upgrade modules (follow-up, 2026-11-06)

Investigated each module (what gap it fills, when added, who else uses it):

| Module | Verdict | Why |
|---|---|---|
| docs-backfill, api-backfill, test-accounts-backfill, verification-backfill | keep (permanent) | Adopt runs them for any existing codebase; the Phase 2 preflight routes to them |
| log-collapse | keep, review at 0.0.50 | added in 0.0.45; its `growth:` lint trigger can fire on any project |
| roadmap-migrate (8.4K) | retired | Phase 1 has written `backlog.json` for many releases; Adopt only used its Step 4 conventions, now stated in Adopt Step 4. Registry row 1 points to release v0.0.46 (tag exists locally and on origin) |

Done: roadmap-migrate deleted and every reference updated (registry, Adopt, README, AGENTS, docs-site page, summary, guides); the other five modules lost their Transition section, "What happens next" paragraph and repeated completion bullets (about −2.6K), with "Done means" stated once in `phase-upgrade.md`; a Retirement note was added to the registry. Installed kit now 388.8K chars (was 393K bytes at HEAD, 351K at the end of the trim plans). `npm test` 105/105, docs-site build passes.
