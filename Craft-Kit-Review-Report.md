# Craft Kit Core Review-Only Validation: Final Report

## Document control

| Field | Value |
|---|---|
| Report ID | CK-REVIEW-2026-10-15-R1 |
| Report version | **1.0** (first issued; see Revision history at the end) |
| Status | Final for the Craft Kit development team. Findings are open; none has been fixed or retested. |
| Report date | 2026-10-15 (finalized 19:05, UTC+7) |
| Review type | Review-only validation: static documentation, installed-kit and workflow review. No execution. |
| Governing plan | `Craft-Kit-Core-Review-Only-Validation-Plan-Draft.md`, v0.2-draft (sha256 `b56e26b3…db2420f`) |
| Reviewer | Claude Sonnet 5.5 (`claude-sonnet-5-5`) in Claude Code; single agent. The evidence re-check (section 8) ran in the same context, not a fresh one (plan 5.3 deviation, see Appendix D). |
| QA operator | The project owner who installed the kit and requested the review |
| **Kit reviewed** | **0.0.26**, from `kit/.craft-kit-version`. 49 files. Install command `npx github:KhoaLy2003/craft-kit`, run 2026-10-15 ~18:51. |
| Kit fingerprint | sha256 of the sorted per-file hashes of `kit/` excluding `.craft-kit-manifest.json`: `21424154c6907aa3a9accc0811a886f24824963d7e96490c567c9a03373a3a20`. A different value means a different kit build. |
| **Site reviewed** | https://khoaly2003.github.io/craft-kit/ on 2026-10-15. The changelog's latest entry was 0.0.26 (2026-10-14). The site shows no version of its own. |
| Other install artifacts | `.agents/` (6 agents, 1 skill), `.claude/skills/design-taste-frontend` (symlink), `skills-lock.json` (1 skill: `design-taste-frontend`) |
| Tabletop input | `requirements.txt`, Home Inventory Manager (sha256 `9ba4de9c…c5d`) |
| Issue count | 30 (S0: 0, S1: 0, S2: 17, S3: 13). IDs are stable and should be kept in any retest. |
| Rubric score | 2.70 / 4 (instruction quality only) |
| Verdict | REVIEW PASS WITH FINDINGS |
| Companion artifacts | None. Evidence is quoted in this report; no screenshots were taken. |
| Intended next step | Dev team fixes the findings in a newer kit release; the owner requests a **re-audit** against that release (section 14). |

**How to cite an issue:** use its ID (for example `N1`) plus the kit version it was found in (`0.0.26`).

---

## 1. Executive summary and verdict: REVIEW PASS WITH FINDINGS

- **No S0 or S1 issue was found.** The Core path (Getting Started, Phase 1, handoff, Phase 2) can be traced end to end from the site and the installed kit. The step files give explicit inputs, outputs, gates and completion criteria.
- The site and the installed kit are the same release and agree on the Phase 1 and Phase 2 step tables, the closeout checklist and the handoff prompt. Every file path the kit cites exists.
- **30 issues** are logged: 0 S0, 0 S1, 17 S2, 13 S3. The ones most likely to stop or mislead a beginner:
  1. **N1:** the install did not deliver the skills the workflow depends on, and the kit contains no check for them.
  2. **N4:** the last step (Ship) pushes and opens a PR, but nothing sets up or checks a git remote.
  3. **N6:** the scope rule's "Domains" criterion is undefined, so a normal frontend+backend app may be pushed off the one validated path (`scope: all`).
  4. **N8:** Phase 1 Step 3 blocks on a user-supplied `DESIGN.md` that Getting Started never mentions.
  5. **N2:** the kit uses tool names (`hub`, `agent://`, `/init`) that belong to one particular AI tool, with no explanation or fallback.
  6. **F5:** Step 1 is gate `none` yet needs user approval, and the site never defines the gate types.
- This verdict applies to documentation and file content only. It does **not** certify that the kit can build a working application.

**Coverage and limits.** Deep-read: site Overview, Getting Started, Phase 1, Phase 2, Session Handover, Changelog, required-skills, all 15 site step pages (p1-03 and p2-07 through the summarizing tool; the other 13 by an automated line-by-line comparison of the raw page text against the installed kit step file: every kit line of 35+ characters appears on the site page, apart from three lines that differ only in code/URL rendering; see Appendix B). Installed kit: `phase-1-bootstrap`, `phase-2`, `orchestrator-conventions`, `session-logging`, `task-agent-rubric`, `guides/session-handover`, all 8 Phase 1 step files, all 7 Phase 2 step files, and templates (kickoff, MODELS, roadmap, backlog, scaffold checklist in full; e2e-tests only the first ~30 lines plus keyword searches). Also read: site guides `resuming-a-session` and `phase-2-build`, and the Phase 1 diagram (through the summarizing tool). **Not deep-read:** `stack-catalog`, `design-reference`, `evolving-specs`, deferred workflows (Bug Fix, Phase 3, Admin, Roadmap-migrate), the other templates (01, 02, 03, 06, 07: Status field only), and the six agent definitions (frontmatter only). The step-page comparison is one-directional (kit text found on the site); I did not rigorously check whether the site pages add text that the kit lacks, because page chrome and layout made that comparison noisy. Site pages were read through a summarizing fetch tool, so site excerpts are paraphrases. Kit files were read directly.

No mutating command was run, no application code was written, and no kit file was changed.

---

## 2. Baseline

| Item | Value |
|---|---|
| Site base URL | https://khoaly2003.github.io/craft-kit/ |
| Site version evidence | Changelog 0.0.26 (2026-10-14). The overview and step pages show no version. |
| Installed kit | 0.0.26, in `F:\Khoa-TonyRay\learning\projects\testing-craft-kit\kit`. **Not OS-read-only** (plan 5.1 asks for this; it was not set up). Evidence of no changes: no file under `kit/`, `.agents/` or `.claude/` has a modification time after install (checked at 18:53). |
| Context constraints | Site pages came through a summarizing fetch tool, not raw HTML; no browser rendering, so layout, diagrams and in-page interactions were not seen. |
| Install command per docs | `npx github:KhoaLy2003/craft-kit` (`--force` updates) |
| Tooling | Claude Sonnet 5.5; WebFetch (summarizing), curl status checks, file reads |
| Limitations | Read-only. Installer output was not captured; I did not see what it printed. |

---

## 3. Documentation inventory and site-wide checks

36 pages checked (20 nav pages, the Phase 1 diagram, 15 step pages): **all return HTTP 200.** A crawl of the internal links on all 36 pages found **82 unique `/craft-kit/` targets, none broken** (one apparent 404 for a font file was my script appending `.html`; the file returns 200). A made-up URL returns a real 404. There is no `sitemap.xml`. **Page titles:** every page has one, but the two Phase 2 pages share the title "Phase 2 — Build | CraftKit" and the two Phase 3 pages share "Phase 3 — Iterate | CraftKit" (F12); the diagram title lacks the "| CraftKit" suffix; the page at `reference/required-skills` is titled "What You Need". The full per-page list is in Appendix B.

| Class | Pages | Status |
|---|---|---|
| Core Deep Review | Overview, Getting Started, Phase 1, Phase 2, Session Handover, Changelog | Reviewed with findings |
| Supporting (read) | required-skills; step pages p1-03 and p2-07 (the other 13 compared line by line with the kit files: identical in substance, no version string on any step page) | Reviewed with findings |
| Supporting (reachability only) | guides: resuming-a-session, phase-2-build, evolving-specs, design-reference, interactive-prototype, existing-projects; Phase 1 diagram | 200 only |
| Deferred Workflow | Bug Fix, Phase 3, Admin Site, Admin Blueprint, Roadmap-migrate, adding-a-feature | 200 only |

Navigation findings: Phase 2 and Phase 3 each appear twice (under Phases and under Guides) with similar labels (F12). Step pages carry no version or date (F12). The Bug Fix prompt names no file (F13).

---

## 4. Core workflow trace (tabletop: Home Inventory Manager)

Scenario used: a household inventory app with the Must features from `requirements.txt` (item CRUD, search and filter, quantity updates, low-stock alerts, validation). Nothing was generated; the trace only tests whether the instructions can be followed.

| # | Stage | Start / input | What the instructions ask | Decision / approval | Expected output | How completion is verified | Next | Status | Issues |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Getting Started | Node 18+, an AI assistant, an empty folder | `npx` install, copy and fill kickoff, share files with AI, approve 4 sign-offs | Kickoff content | `kit/`, `docs/phase-1-kickoff.md` | None stated | Phase 1 | Ambiguous | F1, F2, F8, N1, N8, N3 |
| 2 | Model tiers | Provider and models | Map `capable` / `balanced` / `fast`, write `docs/MODELS.md` | User confirms the mapping | `docs/MODELS.md` `Status: approved` | Read-back in chat | Step 1 | Clear | none |
| 3 | P1-1 Ideation | Kickoff | Git check, `git init`, add `kit/` to `.gitignore`, questions first, then write the brief | User confirms the written file | `docs/idea-brief.md`, kickoff moved to `docs/` | Completion Criteria list | Step 2 or 3 | Contradictory (gate `none` vs approval) | F5 |
| 4 | P1-2 Market research | `idea-brief.md` | Run or skip per kickoff, else ask once | proceed / pivot / stop | `docs/market-notes.md` | 7 sections with minimums | Step 3 | Clear in kit | F6 |
| 5 | P1-3 Prototype & Design | Brief, user-supplied `DESIGN.md` | Journey map, brief, validate `DESIGN.md` (7 criteria), build HTML | Hard gate: flow and look together | `docs/prototype/`, `docs/DESIGN.md`, `docs/preview/` | DoD (11 items) checked | Step 4 | Ambiguous | N8 |
| 6 | P1-4 Roadmap | Prototype | MoSCoW, build order, Phase 2 scope rule, Admin Site question | Hard gate | `docs/roadmap.md`, `backlog.json`, `backlog.html` | Validator and render script exit 0 | Step 5 | Ambiguous | N6, F7 |
| 7 | P1-5 Screen design | Backlog, briefs | One brief per screen, designer handoff, files or MCP | Hard gate | `docs/specs/*/screens/`, `docs/designs/` | Coverage validation | Step 6 | Ambiguous | N5, N9 |
| 8 | P1-6 Architecture | Roadmap, `stack-catalog` | Research, stack proposal in chat, confirm by name | Hard gate | `docs/architecture.md` | Stack named by the user | Step 7 | Clear | N2 (`librarian`) |
| 9 | P1-7 Constitution | Architecture | Draft rules, apply "would deleting it change an output" test | Soft; approved on accept | `docs/constitution.md` | Completion Criteria | Step 8 | Clear | none |
| 10 | P1-8 Scaffold + closeout | Architecture, constitution | Tool pre-flight, scaffold, `.env` gate, smoke test, `/init`, one commit | Hard `.env` gate | Runnable repo, `AGENTS.md`, 1 commit | Closeout checklist | Handoff | Requires Execution to Verify | N2, N10 |
| 11 | Phase 1 to 2 handoff | Closeout passed | Close session; new session reads 6 files incl. `kit/phase-2.md`; asks `[all\|feature]` | none | Prompt emitted, brackets filled | n/a | Phase 2 | Clear; assumes same folder | F4 |
| 12 | P2-1 Spec | Backlog, docs | `brainstorming`, behavior-only spec with stable IDs | Hard | `docs/specs/spec.md` | Criteria list | Step 2 | Clear; needs skill | N1 |
| 13 | P2-2 Plan | Spec | `writing-plans`, one `Specialist:` per task, parallel groups, 20% scope check | Soft | `docs/specs/plan.md` | Self-review loop | Step 3 | Ambiguous | N6, N1 |
| 14 | P2-3 Implement | Plan | Create `feature/<slug>` first, dispatch tasks to specialists | none | Code on branch | Criteria list | Step 4 | Requires Execution | N1 |
| 15 | P2-4 Review | Branch diff | One `code-reviewer` pass, fix all findings | none (but blocks on findings) | Zero findings, zero GAPs | COVERED / GAP table | Step 5 | Ambiguous | F10 |
| 16 | P2-5 E2E | Spec, running app | `docs/E2E-TESTS.md`, run all, one fix dispatch, re-run affected scope | Soft | `docs/E2E-TESTS.md` + results | PASS/FAIL per criterion | Step 6 | Requires Execution | N11 |
| 17 | P2-6 Manual check | Running app | Human walkthrough | Hard; the orchestrator never self-approves | Approval | Human approval | Step 7 | Ambiguous (no checklist, by design) | F10 |
| 18 | P2-7 Ship | Branch | Commit, push, open PR, record shipped events | none | Pushed branch, PR | Render script exit 0 | Phase complete | Requires Execution | N4, N11 |
| 19 | Session handover (any phase) | Seam reached | Write `docs/handover.md`, resume in new session | "hand over" | `docs/handover.md` | Artifact path check | Resume | Ambiguous | F11 |

---

## 5. Website vs. installed-kit comparison

| Item | Website | Installed kit | Classification |
|---|---|---|---|
| Version | 0.0.26 (changelog only) | 0.0.26 | Consistent |
| Phase 1 table (8 steps: gate, model, agent, output) | as read | `phase-1-bootstrap.md` identical | Consistent |
| Phase 2 table (7 steps) | as read | `phase-2.md` identical | Consistent |
| Closeout checklist and handoff prompt | as read | identical | Consistent |
| Cited paths | `kit/steps/...`, `kit/templates/...`, `kit/phase-*.md` | all exist; scripted check found none missing | Consistent |
| Handover procedure | as read | `guides/session-handover.md` matches, including the stash/discard wording | Consistent (shared defect F11) |
| Gate definitions (`none/soft/hard`) | not defined on the Phase pages | defined in `orchestrator-conventions.md` | Potential stale site content (F5) |
| Skip rules, "Definition of Done" | vague or undefined | defined in `p1-01`, `p1-05`, `03b` template | Potential stale site content (F6, F7) |
| Kickoff location | Getting Started: `docs/` | template header: project root; Step 1 accepts both and moves it | Expected 0.0.26 behavior, inconsistent wording (F8) |
| `ui-ux-tester` model | Phase 2 table: `balanced` | step file: `fast` for `ui-ux-tester` | Expected version/detail difference (S3) |
| Install side effects | only `kit/` described | also `.agents/`, `.claude/skills/`, `skills-lock.json` | Potential installed-kit / packaging mismatch (N3) |
| Phase 1 diagram vs. 8-step table | diagram folds Steps 6-8, no Constitution node, no optional/skippable markers | kit table lists 8 steps | Contradiction or ambiguous (N16) |
| Resume prompt | guide: "Read docs/handover.md and resume from there" | handover guide: long Resumption Prompt | Contradiction (N17) |
| Required skills (9 listed on required-skills) | "installer prints or runs install steps" | only `design-taste-frontend` installed; no kit text mentions a skills check | Contradiction or ambiguous applicability (N1) |

---

## 6. Scored rubric (0-4; instruction quality only)

| Category | Wt | Score | Evidence-based rationale |
|---|---:|:-:|---|
| Core workflow completeness and coherence | 25% | 3 | Step files state inputs, outputs, gates and completion criteria. Gaps: F5, F10, N4, N5, N6 |
| Beginner clarity and usability | 25% | 2 | F1, F2, N1, N2, N8, F7 |
| Website quality and discoverability | 15% | 3 | 36 of 36 pages return 200 and 0 of 82 internal link targets are broken; duplicate page titles and nav labels, no versions on pages (F12) |
| Website vs. installed alignment | 20% | 3 | Same release; tables and paths match. N1, N3, F8 |
| Efficiency and maintainability | 10% | 3 | Closeout stated once; gate rules live in one file. The site duplicates the kit and lags on definitions |
| Local-only and safety clarity | 5% | 2 | Good: `.env` gate rejects placeholders, `.env` must be gitignored, no destructive commands in the kit, the render script uses only `fs` and `path`. Weak: N4 (outward push not flagged), N11 (test passwords in a committed doc) |

Weighted: 0.75 + 0.50 + 0.45 + 0.60 + 0.30 + 0.10 = **2.70 / 4**. Build success, app quality, runtime behavior and test effectiveness are **Not Tested** and not scored.

---

## 7. Prioritized issue register

Severity count: S0 = 0, S1 = 0. Items are grouped by severity; N- items came from the kit inspection, F- items from the site and carried through.

### S2: medium (17)

| ID | Cat | Conf | Title and evidence | Location | Impact on a beginner | Recommendation | Needs execution? |
|---|---|---|---|---|---|---|---|
| N1 | Version Alignment | Confirmed (kit has no skills check); install behavior Unverified | Required skills not delivered and not checked. Steps depend on `brainstorming`, `writing-plans`, `subagent-driven-development`, `dispatching-parallel-agents`, `finishing-a-development-branch`; only `design-taste-frontend` was installed. required-skills says the platform "should check" at Phase 1 start; `grep` of `kit/` finds no such instruction. Getting Started never mentions skills. | `kit/phase-1-bootstrap.md`; `kit/steps/phase-2/*`; required-skills page | Phase 1 Step 1 and all of Phase 2 stall or improvise; the AI silently substitutes | Add a skills pre-flight; list required skills in Getting Started | Yes (what the installer prints) |
| N2 | Documentation | Confirmed | Tool-specific terms with no explanation or fallback: `hub`, `hub start`, `agent://<id>` (conventions rules 2-3, Step 8 smoke test), `/init`, `librarian` (P1-6), `evon:ui-ux`, `sonic` | `orchestrator-conventions.md`; `p1-08`; `p1-06`; `task-agent-rubric.md` | A user on another AI tool cannot follow the write-recovery, smoke-test or closeout instructions | Name the target harness; add neutral equivalents | No |
| N4 | Workflow / Safety | Likely | Ship pushes the branch and opens a PR; nothing creates a remote or checks auth, and the kit never names a PR tool (no `gh` anywhere in `kit/`). Step 8 pre-flight checks stack tools and local `git init` only. The site step page repeats the same text. Push and PR are not flagged as outward-facing. | `p2-07-ship.md`; `p1-08-scaffold.md` | A local-only beginner hits a failure at the last step | Add a remote/auth pre-flight and a local-commit fallback | Yes |
| N5 | Workflow | Likely | Step 5 designs "Must and Should" features, but `scope: all` builds only Must and Ship leaves unbuilt Should `pending`. Designer effort is requested for features Phase 2 will not build. | `p1-05`; `phase-2.md`; `p2-07` | Wasted design work; confusion about what ships | State when Should features are included or limit Step 5 to Must | No |
| N6 | Workflow | Likely | "Domains" in the scope rule ("one primary domain; any other domain < 20% of Must features") is undefined. A normal full-stack app (UI + API) can read as two domains. Plan then recommends leaving `scope: all` when more than 20% of tasks go to a minority specialist, and `scope: all` is the only validated scope. For the tabletop app, the frontend/backend split is not predictable from the instructions. | `p1-04`; `p2-02`; `phase-2.md` | The user is nudged onto the experimental path with no way to judge it | Define "domain"; state the expected outcome for a typical full-stack MVP | Yes (observe actual task split) |
| N8 | Documentation | Confirmed | Step 3 stops until the user supplies `docs/DESIGN.md` (from getdesign.md, freedesignmd.com or a custom file). Getting Started lists no such prerequisite. A custom file is allowed. | `p1-03` Phase B; Getting Started | The flow blocks mid-Phase 1; the beginner must find and judge a design-system file | Add it to Getting Started; offer a default `DESIGN.md` | No |
| N11 | Safety | Confirmed | The E2E template asks to "List every account the tests will use. Include email, password, and role." Ship then commits everything (`git add -A`) and pushes. `ENV_SETUP.md` is explicitly secret-free; `E2E-TESTS.md` has no such rule. | `templates/e2e-tests.md` line 34-36; `p2-07` | Test passwords can be committed and pushed | Say test credentials go in `.env`, with placeholders in the doc | No |
| F1 | Documentation | Confirmed | Terminal, Node install and version check, "project folder", and Unix-only `cp` are not explained; `docs/` is assumed to exist | Getting Started | Stuck at step 1 on Windows | Add a short per-OS setup section | No |
| F2 | Documentation | Confirmed | "Share ... with your AI" is undefined (upload, paste, or file access) | Getting Started step 4 | Fails with an AI that cannot read the folder | State supported tools and how to provide files | No |
| F4 | Handoff | Likely | Step 1 puts `kit/` in `.gitignore`; the handoff reads `kit/phase-2.md`. Works in the same folder, not on a fresh clone. The kit does not say so. | `phase-1-bootstrap.md`; `p1-01` | New machine or clone cannot resume | Say `kit/` must be reinstalled elsewhere | No |
| F5 | Workflow | Confirmed | Step 1 is gate `none` ("Auto-advance. No human decision required") but sets `approved` only after the user confirms. The site does not define the gate types. | `orchestrator-conventions.md` vs `p1-01`; site Phase 1 | Unclear whether the AI waits | Make Step 1 `soft` or `hard`; define gates on the site | No |
| F9 | Workflow | Confirmed | `scope: feature` is "experimental, not validated", yet `phase-2.md` says "Later releases run `scope: feature`". The skip rule treats an existing spec as already approved. | `phase-2.md` | A validated path leads to an unvalidated one | Label it where prescribed; check spec approval | No |
| F10 | Documentation | Confirmed | Step 4 is gate `none` but cannot advance with open findings; Step 6 has no checklist by design; "exhaustively" is unmeasured; `shipped` events are recorded in `docs/backlog.json` but the site does not say where | `p2-04`; `p2-06`; `phase-2.md`; site Phase 2 | Unclear when to stop | Add observable criteria | No |
| F11 | Handoff | Confirmed | "Commit what compiles cleanly, stash or discard the rest" next to "Never hand over with uncommitted writes"; no rule for an unconsumed `handover.md`; stress counter ("3 or more steps") not scoped; the guide is itself "experimental" | `guides/session-handover.md` | Lost or stale handover state | Resolve each case | Yes |
| N10 | Documentation | Confirmed | `phase-2.md` and the handover guide call handover the "one mechanism for the whole phase", but Phase 1 to 2 uses a separate prompt; the handover guide itself lists Phase 1 seams | `guides/session-handover.md`; `phase-1-bootstrap.md` | Two similar mechanisms | Explain how they relate | No |
| N9 | Workflow | Confirmed | Step 5 assumes a human designer ("no AI-generated designs"). The no-designer route (declare `design_md_fallback` per screen) is available but not framed as the beginner path. | `p1-05` | A solo beginner may think the step is mandatory | Describe the no-designer route up front | No |
| N12 | Documentation | Confirmed | "Must" is defined only by use (MoSCoW) with no one-line explanation on the site or in the kickoff; "shell checkpoint" and "scope all/feature" are used before definition | site Overview, Handover; `p1-04` | Cannot judge decisions | Add a glossary | No |

### S3: low (13)

| ID | Title | Location | Recommendation |
|---|---|---|---|
| N3 | Install writes `.agents/`, `.claude/skills/`, `skills-lock.json` outside `kit/` with no documentation. The `.claude/skills` entry is a symlink whose target is a POSIX-style path (`/f/Khoa-...`). Whether it resolves on Windows, and whether the tool finds agents under `.agents/agents`, is Unverified. | Getting Started; required-skills | Document all installed paths; verify symlink handling |
| F6 | Site wording for Step 2 ("the kickoff decides") and Step 5 ("skippable") is vague; the kit defines both | site Phase 1 | Mirror the kit's rules |
| F8 | Getting Started says copy the kickoff to `docs/`; the template header says project root; both work | Getting Started; kickoff template | Pick one |
| F12 | Duplicate nav labels **and duplicate page titles** (both Phase 2 pages, both Phase 3 pages); no version on the overview or step pages; `kit/` called read-only while `--force` overwrites it | Overview; `phases/phase-2.html` vs `guides/phase-2-build.html` | Rename or merge; show the version |
| N16 | The Phase 1 diagram folds Steps 6 to 8 into one node, shows no Constitution step, and does not mark Market Research as optional or Screen Design as skippable (the text does). Read through the summarizing tool, so confirm in a browser. | `diagrams/phase-1-bootstrap.html` vs `phase-1.html` | Make the diagram match the 8-step table |
| N17 | Two different resume instructions: the guide says to send "Read docs/handover.md and resume from there"; the handover document's own Resumption Prompt is a longer block to paste as the first message | `guides/resuming-a-session.html` vs `guides/session-handover.md` | Use one prompt |
| N18 | No cost disclosure: hosted stacks only require "account/project created", and AI usage cost is covered only by the model-tier mapping; the stack catalog tracks pricing and free-tier facts but the beginner pages do not mention them | `p1-08` pre-flight; Getting Started | Add a one-line cost note per hosted service and for AI usage |
| F13 | Bug Fix prompt names no file (`kit/phase-bug-fix.md` exists) | Overview | Name it |
| N7 | `ui-ux-tester` model: step file says `fast`, site table says `balanced` | `p2-05`; site Phase 2 | Align |
| N13 | Site pages mirror kit text one-to-one (confirmed for all 15 step pages: every kit line is on the site), so every edit must be made twice and may drift | whole site | Generate pages from the kit files |
| N19 | Hard-coded third-party facts that will go stale: "getdesign.md ... 73+ analyses", "freedesignmd.com ... 121+ free design systems", plus two external URLs the flow depends on | `p1-03` Phase B (kit and site) | Drop the counts; say what to do if a link is gone |
| N14 | Prototype requires CDN scripts (Tailwind, Phosphor, fonts, picsum images). This is fine for a prototype but is an unflagged external dependency and needs internet. | `p1-03` Phase C | Say so |
| N15 | The e2e template's worked example is Supabase-specific; other stacks get no example | `templates/e2e-tests.md` | Add a neutral example |

Duplicates merged: F3 from the earlier pass was dropped (the kit does not contradict the approval list); F6/F7 were downgraded after the kit defined the terms.

---

## 8. Evidence audit (audit pass)

I re-checked the issues that carry the most weight against the files. This pass ran in the same context as the review, not a fresh one, and no second model checked the findings (no S0/S1 existed to require it):

| ID | Claim | Re-check | Result |
|---|---|---|---|
| N1 | No skills check exists in the kit | `grep -rniE "required-skills|required skills|missing skill|skill.*(missing|not installed|unavailable)" kit` returned nothing; install dirs contain one skill | **Confirmed.** Severity stays S2 because required-skills lists them and Phase 1 start is where they are first needed. What the installer printed is Unverified. Caveat for the dev team: this review environment already had skills with the same names from a separate plugin, so the gap does not show up here as a hard failure. On a clean machine it may. |
| N4 | No remote step | `grep -rniE "git remote|remote origin"` in `kit/` returns 0 matches, and `grep -E "\bgh\b"` returns 0; the site step page for Ship has no remote or `gh` text | **Confirmed** as a documentation gap; the runtime failure is Unverified. |
| F5 | Gate `none` vs approval | Conventions: `none` = "Auto-advance. No human decision required"; `p1-01` Artifact Rules: `approved` only after the user confirms | **Confirmed** |
| N6 | "Domains" undefined | `p1-04` table and `phase-2.md` define neither frontend/backend nor product domain | **Confirmed**; the outcome for a real app is Unverified |
| N11 | Passwords in a committed doc | Template text quoted above; Ship `git add -A` (Step 8) and "Commit everything" (Ship) | **Confirmed** (test accounts only, but the guidance does not say so beyond "no production credentials") |

No finding was upgraded to S1: each needs either runtime evidence or still leaves a workable path. No claim in this report says the kit works or fails at runtime.

---

## 9. Beginner friction and unnecessary complexity

- **Before the first AI message:** terminal, Node, a folder, filling a form, sharing files with the AI, and (from N8) a design-system file. None of this is walked through for Windows (F1, F2, N8).
- **Terms without definition:** Must feature, gate types on the site, domain, scope, seam, shell checkpoint (N12, F5, N6).
- **Many sign-offs:** four on Getting Started, five `approved` files in the closeout, plus hard gates at Steps 3, 4, 5, 6; most name the decision being approved (a strength).
- **Duplication:** the site restates the kit page by page (N13) and the two have drifted on definitions (F5, F6, F7).
- **Heavy for a small app:** a home-inventory app still goes through Market Research, a designer handoff and a constitution, though each has a skip or minimal route. The kit gives skip rules for Steps 2 and 5 and a "3-5 rules" constitution; the guidance could say more loudly that small projects can take them.

---

## 10. Improvement backlog (priority = impact / effort)

| # | Change | Fixes | Impact | Effort |
|---|---|---|---|---|
| 1 | Add a skills and agents pre-flight at the start of Phase 1 and list them in Getting Started | N1, N3 | High | Low |
| 2 | Add a "before you start" section: terminal, Node check, Windows commands, how to share files, DESIGN.md prerequisite | F1, F2, N8 | High | Low |
| 3 | Add a remote/auth pre-flight before Ship and a local-only fallback; mark push/PR as external | N4 | High | Low |
| 4 | Define "domain" and show the expected scope for a typical full-stack MVP; align Step 5 with the Must-only scope | N6, N5 | High | Medium |
| 5 | Make Step 1 a proper gate; publish gate definitions on the site | F5 | Medium | Low |
| 6 | Replace or explain `hub`, `agent://`, `/init`, `librarian`, `sonic`, `evon:ui-ux` | N2 | Medium | Medium |
| 7 | State where test credentials live; keep `E2E-TESTS.md` secret-free | N11 | Medium | Low |
| 8 | Add a glossary (Must, scope, seam, gate, domain) | N12, F7 | Medium | Low |
| 9 | Resolve the handover edge cases and relate it to the Phase 1 handoff prompt | F11, N10 | Medium | Medium |
| 10 | Fix `kit/` ignored-vs-handoff wording; label the experimental scope where it is prescribed | F4, F9 | Medium | Low |
| 11 | Add measurable criteria to Steps 4 and 6; say where `shipped` events are stored | F10 | Medium | Low |
| 12 | Polish: nav labels, versions on pages, Bug Fix file name, kickoff location, generate the site from the kit | F6, F8, F12, F13, N7, N13 | Low | Medium |

---

## 11. Not tested (Not Verified: Requires Execution)

- What the installer prints, and whether it installs or checks the required skills.
- Whether the `.claude/skills` symlink resolves on Windows and whether the tool finds agents under `.agents/agents`.
- Build, scaffold and smoke test in Step 8 on any stack; the Windows `hub start` workaround.
- A fresh session actually resuming from the six handoff files or from `docs/handover.md`.
- Phase 2 end to end: specialist routing, parallel dispatch, the 20% scope check on a real project, E2E, Ship without a remote.
- Whether `render-backlog.js` and the backlog validator behave as described.
- Generated artifact validity, application functionality, performance, production behavior, and usability with real people.

## 12. Recommended next validation (smallest checks that would settle the open questions)

1. **Installer check (resolves N1, N3):** run the install in a new scratch folder with output captured; start a Phase 1 session and see whether missing skills are detected.
2. **Scope check (resolves N6):** run Phase 1 through Step 4 for the Home Inventory Manager only and record the scope the kit recommends and why.
3. **Ship check (resolves N4):** run Ship on a throwaway repo with no remote.
4. **Handoff check (resolves F4, F11):** resume Phase 2 in a fresh session from the six files, and once from a `docs/handover.md`.
5. After the owner approves doc changes, re-review only the changed files and run a short regression trace of the Core path. Decide on a full Core E2E afterwards.

---

## 13. Review completion checklist

- [x] Public-site page inventory recorded
- [x] Core pages and required supporting references reviewed (limits listed in section 1)
- [x] Navigation and internal-link check across the site (36 of 36 pages return 200; 82 internal link targets, none broken)
- [x] Installed-kit version recorded (0.0.26) and Core files inspected read-only
- [x] Differences classified, not automatically treated as defects
- [x] Tabletop trace covers Getting Started, Phase 1, handoff and Phase 2
- [x] Each finding has location, evidence, impact, severity, confidence and recommendation
- [x] Lightweight evidence review of the highest-weight findings (section 8)
- [x] No application code generated, no builds or tests run, no kit files changed
- [x] Runtime questions marked Not Verified
- [x] Limitations and next validation included

---

## 14. Re-audit protocol (for the next kit release)

Purpose: after the development team fixes issues and ships a newer kit, repeat this review against the new release and report what changed. The same plan (v0.2-draft) and the same rules apply: read-only, no app build.

### 14.1 Inputs the re-audit needs
1. The new kit version and a fresh install into an empty folder (so stale files from 0.0.26 are not mixed in; `--force` may leave or remove files). Record the new version and fingerprint the same way as in Document control.
2. The site snapshot date for the new release, and the new changelog entries.
3. The dev team's fix list, mapping each fix to an issue ID from this report (so the re-audit knows what to expect). Fixes without an ID will be treated as new changes.
4. The same tabletop input (`requirements.txt`), so results are comparable.

### 14.2 Procedure
1. **Freeze the new baseline** (version, fingerprint, site date, install output captured).
2. **Regression pass per issue (section 14.3).** Mark each ID `Fixed`, `Partially fixed`, `Not fixed`, `Cannot verify (needs execution)`, or `Won't fix (owner decision)`. Quote the new evidence.
3. **Diff the kit:** list added, removed and changed files against 0.0.26 and read every changed Core file in full (changed files only, not the whole kit).
4. **New-issue pass:** check changed text for new contradictions, especially where the site and kit were edited separately; continue issue IDs from `N20` and `F14`.
5. **Cover the gaps from this round:** read the files listed as not deep-read in section 1 if they are Core-linked or changed.
6. **Repeat the tabletop trace** (section 4) and update statuses.
7. **Re-score the rubric** (section 6) and re-issue the verdict. Do not carry over a Pass: an unresolved S1 appearing in the new release ends in REVIEW FAIL.
8. **Run the Section 12 execution checks** only if the owner has approved execution for this round.

### 14.3 Per-issue closure checks

| ID | Sev | Closed when (observable check) | Method |
|---|---|---|---|
| N1 | S2 | Getting Started lists the required skills; Phase 1 (or install) contains an explicit skills check with a stated fallback; the install result matches `required-skills` | Read + install capture |
| N2 | S2 | `hub`, `agent://`, `/init`, `librarian`, `sonic`, `evon:ui-ux` are each explained or replaced; a non-target tool has an equivalent | `grep` + read |
| N4 | S2 | A remote and PR-tool pre-flight exists before Ship, with a local-only fallback; push/PR is labelled external | Read |
| N5 | S2 | Step 5 scope (Must only, or Must+Should) matches what `scope: all` builds | Read |
| N6 | S2 | "Domain" is defined; the expected scope for a typical full-stack MVP is stated; Plan's 20% check is consistent with it | Read; run Phase 1 Step 4 on the tabletop (execution) |
| N8 | S2 | DESIGN.md prerequisite appears in Getting Started with a beginner route | Read |
| N11 | S2 | `E2E-TESTS.md` guidance puts credentials in `.env`; no passwords in committed docs | Read |
| F1, F2 | S2 | Setup section covers terminal, Node, folder, Windows commands, and how to give files to the AI | Read |
| F4 | S2 | `kit/`-is-gitignored behavior is explained for new machines/clones | Read |
| F5 | S2 | Step 1 gate matches its approval behavior; gate types defined on the site | Read |
| F9 | S2 | The experimental scope is labelled where prescribed | Read |
| F10 | S2 | Steps 4 and 6 have observable completion criteria; `shipped`-event location stated on the site | Read |
| F11 | S2 | Stash/discard rule, stale `handover.md`, and stress counter resolved | Read; resume test (execution) |
| N9, N10, N12 | S2 | Designer-less route described; handover vs. handoff relationship explained; glossary exists | Read |
| N3, F6, F8, F12, F13, N7, N13, N14, N15, N16, N17, N18, N19 | S3 | The item's recommendation in section 7 has been applied | Read |

### 14.4 Re-audit report format
Reuse this report's structure. Add a "Changes since 0.0.26" table (issue ID, previous status, new status, evidence), a "New issues" list, and an updated verdict and rubric. Keep this v1.0 report unchanged as the baseline.

---

## 15. Revision history

| Version | Date | Kit | Change |
|---|---|---|---|
| 1.0 | 2026-10-15 | 0.0.26 | First issued. Site plus installed-kit review, 30 issues, verdict REVIEW PASS WITH FINDINGS. Before issue: corrected the e2e template coverage note and the N4 and N1 evidence wording; added the document-control block, re-audit protocol, a plan-compliance check (Appendix D), the full site crawl, the previously unread site pages (resuming-a-session, phase-2-build, diagram, and a line-by-line comparison of the 13 remaining step pages), full issue records (Appendix A), the per-page inventory (Appendix B) and answers to the plan's key questions (Appendix C). |

---

## Appendix A. Full issue records (plan section 12 template), all S2 issues

Finding class (plan step 7): **C** = confirmed documentation or file-content issue; **W** = likely workflow-design issue; **V** = potential version mismatch needing maintainer confirmation; **R** = runtime behavior not verified; **E** = environment/tool limitation. Paths are relative to the install folder; URLs are under `https://khoaly2003.github.io/craft-kit/`.

**N1: Required skills not delivered and not checked.** S2 | Version Alignment | Confidence: Confirmed (for the missing check); install behavior Unverified | Class: C + R
- Public URL: `reference/required-skills.html`, `getting-started.html`. Installed: `kit/phase-2.md`, `kit/steps/phase-2/p2-01-spec.md`, `p2-02-plan.md`, `skills-lock.json`. Section: "Steps" tables; "What You Need".
- Evidence: `p2-01-spec.md`: "Invoke `brainstorming`; it runs clarifying questions → approaches → design sections → written spec." `skills-lock.json` lists one skill (`design-taste-frontend`). A search of `kit/` for "required skills" and "missing skill" finds nothing.
- Expected: before Phase 1 starts, the user learns which skills are needed and the AI checks they exist (the required-skills page says the platform "should check ... when Phase 1 starts"). Observed: the install delivered 1 of 9 required skills; no kit text performs or describes the check; Getting Started does not mention skills.
- Impact: Phase 1 Step 1 and all of Phase 2 depend on skills that may not exist; the AI may silently substitute. Stage: Getting Started, P1-1, P2-1/2/3/7.
- Recommendation: add a skills pre-flight with a stated fallback; list required skills in Getting Started. Needs execution: Yes (installer output). Related: N3.

**N2: Tool-specific names used without explanation.** S2 | Documentation | Confirmed | Class: C
- Installed: `kit/orchestrator-conventions.md` (Universal Rules 2 and 3), `kit/steps/phase-1/p1-08-scaffold.md` (Rule 4), `p1-06-architecture.md` (Stage 1), `kit/task-agent-rubric.md`.
- Evidence: "notify the orchestrator via `hub`. The orchestrator handles file recovery from `agent://`."; "`npm` and `npx` are `.cmd` wrappers that `hub start` cannot launch"; "Use a `librarian` agent only when ..."; "`sonic` ... is an optional harness-provided agent".
- Expected: terms are explained or have a neutral equivalent. Observed: `hub`, `agent://`, `librarian`, `sonic`, `evon:ui-ux` and `/init` are never defined; no statement of which AI tool the kit targets.
- Impact: on another AI tool the write-recovery rule and the Windows smoke-test workaround cannot be followed. Stage: P1-1 to P1-8, all Phase 2 dispatches. Recommendation: name the target tool(s) and give neutral steps. Needs execution: No. Related: N3.

**N4: Ship assumes a remote and a PR tool.** S2 | Workflow / Safety | Likely | Class: W + R
- Public URL: `phases/steps/p2-07-ship.html`, `guides/phase-2-build.html`. Installed: `kit/steps/phase-2/p2-07-ship.md`, `p1-08-scaffold.md`. Section: "Rules"; "Execution Rules 1 (pre-flight)".
- Evidence: "Push the branch and open a PR against `main`. Never merge it and never push to `main`." No `git remote` or `gh` text anywhere in `kit/`; Step 8 pre-flight checks stack tools and "a git repo exists ... `git init`" only.
- Expected: remote, authentication and the PR tool are checked before the last step, with a fallback, and the outward-facing push is flagged. Observed: none of these. Impact: a local-only beginner fails at the final step; the push is not marked as publishing code. Stage: P2-7. Recommendation: add the pre-flight and a "commit only" fallback. Needs execution: Yes. Related: N1.

**N5: Step 5 designs Should features that `scope: all` does not build.** S2 | Workflow | Likely | Class: W
- Installed: `kit/steps/phase-1/p1-05-screen-design.md`, `kit/phase-2.md`, `p2-07-ship.md`. Section: Scope; Scope Differences; Rules.
- Evidence: p1-05 "**In**: Must and Should features only"; phase-2 "`scope: all` — every Must feature in `docs/backlog.json` is specced, planned, built ..."; p2-07 "Should and Could features not built stay `pending`".
- Expected: design effort matches what Phase 2 builds. Observed: designers are asked for Should-feature screens that the first Phase 2 pass leaves unbuilt. Impact: wasted designer effort; unclear which screens matter. Stage: P1-5. Recommendation: say when Should features are included, or limit Step 5 to Must. Needs execution: No.

**N6: "Domains" criterion undefined; may push a normal app off the validated scope.** S2 | Workflow | Likely | Class: W + R
- Installed: `kit/steps/phase-1/p1-04-roadmap.md` (Phase 2 Scope table), `kit/steps/phase-2/p2-02-plan.md`, `kit/phase-2.md`.
- Evidence: p1-04 "Domains | One primary domain; any other domain is < 20% of Must features"; p2-02 "if more than 20% of tasks go to a minority specialist, recommend switching to `scope: feature`"; phase-2 "Scope `all` is validated" and "`feature` is experimental".
- Expected: a reader can score "Domains" and predict the outcome for a typical MVP. Observed: "domain" is not defined (product domain? frontend vs backend?). A full-stack app may well have a minority specialist above 20% of tasks. Impact: the user may be steered to the experimental scope without being told. Stage: P1-4, P2-2. Recommendation: define "domain" and state the expected result for a typical full-stack MVP. Needs execution: Yes (observe the real task split). Related: F9.

**N8: Design-system file is a hidden prerequisite.** S2 | Documentation | Confirmed | Class: C
- Public URL: `getting-started.html`, `phases/steps/p1-03-prototype-design.html`. Installed: `kit/steps/phase-1/p1-03-prototype-design.md`. Section: "Phase B — DESIGN.md".
- Evidence: "`docs/DESIGN.md` — user-provided, validated, never modified"; "Before the prototype can be built, you need a design system file. Pick one from getdesign.md ... or freedesignmd.com ... A custom file works too."
- Expected: Getting Started lists everything the user must bring. Observed: it does not mention this file. Impact: the flow stops mid-Phase 1 and the beginner must find and judge a design-system file (seven validation criteria apply). Stage: P1-3. Recommendation: add it to Getting Started; offer a default. Needs execution: No.

**N9: Step 5 assumes a human designer.** S2 | Workflow | Confirmed | Class: W
- Installed: `kit/steps/phase-1/p1-05-screen-design.md`. Evidence: "**Agent/Skill**: orchestrator only. No subagent dispatch, no AI-generated designs."; Phase B "It is what the user sends to their designer". The no-designer route exists (declare `design_md_fallback`) but is described only as a per-screen skip. Impact: a solo beginner may think the step is mandatory. Recommendation: describe the no-designer route up front. Needs execution: No.

**N10: Two overlapping handoff mechanisms.** S2 | Handoff | Confirmed | Class: C
- Installed: `kit/phase-2.md`, `kit/guides/session-handover.md`, `kit/phase-1-bootstrap.md`.
- Evidence: phase-2: "Handover: one mechanism for the whole phase — `kit/guides/session-handover.md`"; the handover guide lists Phase 1 seams ("Any step whose hard gate has just cleared"), while Phase 1 → 2 uses its own prompt ("Read these files before starting: ...").
- Expected: one explanation of how mid-phase handover and the Phase 1 → 2 handoff relate. Observed: both exist with no cross-reference. Impact: confusion about which file the new session needs. Recommendation: add one paragraph relating them. Needs execution: No. Related: F11, N17.

**N11: Test credentials written into a committed document.** S2 | Safety | Confirmed | Class: C
- Installed: `kit/templates/e2e-tests.md` (Section 2), `kit/steps/phase-2/p2-07-ship.md`.
- Evidence: template: "List every account the tests will use. Include email, password, and role. Do not use production credentials."; Ship: "Commit everything." and the branch is pushed. `ENV_SETUP.md` is stated to contain no secrets; `E2E-TESTS.md` has no such rule.
- Expected: secrets stay out of committed docs. Observed: passwords are requested in `docs/E2E-TESTS.md`. Impact: test passwords may be pushed to a remote. Stage: P2-5, P2-7. Recommendation: keep credentials in `.env` and reference key names. Needs execution: No.

**N12: Terms used without definition.** S2 | Documentation | Confirmed | Class: C
- Public URL: home, `guides/session-handover.html`. Installed: `kit/steps/phase-1/p1-04-roadmap.md`. Evidence: p1-04 "Prioritise features into Must / Should / Could / Won't" with no one-line meaning; "shell checkpoint" (handover); "scope all/feature" appear before they are explained. Impact: a beginner cannot judge the decisions they are asked to approve. Recommendation: add a glossary. Needs execution: No.

**F1: Setup assumptions not explained.** S2 | Documentation | Confirmed | Class: C
- Public URL: `getting-started.html`, section "First Actions". Evidence: "Run this in your project folder (or any empty folder)"; "cp kit/templates/phase-1-kickoff.md docs/phase-1-kickoff.md". Terminal, Node install and check, what a project folder is, and a Windows equivalent for `cp` are not given; `docs/` is assumed to exist. Impact: stuck at action 2 on Windows. Stage: Getting Started. Recommendation: per-OS setup section. Needs execution: No.

**F2: "Share ... with your AI" is undefined.** S2 | Documentation | Confirmed | Class: C
- Public URL: `getting-started.html`, action 4. Evidence: "Share `kit/phase-1-bootstrap.md` and your filled-in form with your AI". Upload, paste or file access is not stated. Impact: fails on an AI without file access. Recommendation: state supported tools and how to provide files. Needs execution: No.

**F4: `kit/` is gitignored but the handoff reads it.** S2 | Handoff | Likely | Class: W
- Installed: `kit/steps/phase-1/p1-01-ideation.md` (Rule 1), `kit/phase-1-bootstrap.md` (handoff prompt). Evidence: "Ensure `.gitignore` exists with `kit/` as an entry"; handoff prompt lists "`kit/phase-2.md`". Works in the same folder; fails on a fresh clone or another machine, and the kit does not say so. Impact: cannot resume elsewhere. Recommendation: say `kit/` must be reinstalled. Needs execution: No.

**F5: Gate `none` conflicts with approval.** S2 | Workflow | Confirmed | Class: C
- Installed: `kit/orchestrator-conventions.md` (Gates), `kit/steps/phase-1/p1-01-ideation.md` (Artifact Rules). Public: `phases/phase-1.html` (does not define gates).
- Evidence: "`none` | Auto-advance. No human decision required." vs "Set `Status: approved` only after the user confirms the written file." Impact: the AI may advance without waiting. Recommendation: make Step 1 `soft` or `hard`; define gates on the site. Needs execution: No.

**F9: Experimental path prescribed.** S2 | Workflow | Confirmed | Class: C
- Installed: `kit/phase-2.md`. Evidence: "scope `feature` is experimental — not yet validated in a test round." and "Later releases run `scope: feature`." Also: skip detection says "the gate was already passed" without checking approval. Impact: a validated path leads to an unvalidated one. Recommendation: label it where prescribed. Needs execution: No. Related: N6.

**F10: Missing or unmeasured completion criteria in Phase 2.** S2 | Documentation | Confirmed | Class: C
- Installed: `kit/steps/phase-2/p2-04-review.md`, `p2-06-manual-check.md`, `kit/phase-2.md`. Evidence: p2-04 "Gate: `none`" and "Do not advance with any open finding or GAP."; p2-06 "Outputs: explicit human approval (no file)"; phase-2 "Cross-feature interactions tested exhaustively". The site does not say where `shipped` events are recorded (the kit says `docs/backlog.json`). Impact: unclear when a step is done. Recommendation: add observable criteria. Needs execution: No.

**F11: Handover edge cases unresolved.** S2 | Handoff | Confirmed | Class: C + R
- Installed: `kit/guides/session-handover.md`. Evidence: "commit what compiles cleanly, stash or discard the rest" next to "Never hand over with uncommitted writes"; no rule when `docs/handover.md` already exists and is unconsumed; "3 or more steps completed in the current session" does not say whether earlier sessions count; status line "experimental — not yet validated in a test round". Impact: lost or stale handover state. Recommendation: resolve each case. Needs execution: Yes (resume test). Related: N10, N17.

---

## Appendix B. Documentation inventory (per page)

Status key: **RF** reviewed with findings; **R** reviewed; **C** compared: the raw site page text was checked line by line against the installed kit step file (all kit lines found; 3 lines differ only in code/URL rendering); **S** smoke check only (HTTP 200 and title); **D** deferred. All 36 return HTTP 200 and have a title.

| # | Title (as shown in the page title) | URL path under `/craft-kit/` | Scope class | Status |
|---|---|---|---|---|
| 1 | CraftKit | (home) | Core Deep Review | RF |
| 2 | Getting Started | `getting-started.html` | Core Deep Review | RF |
| 3 | Phase 1 — Bootstrap | `phases/phase-1.html` | Core Deep Review | RF |
| 4 | Phase 2 — Build | `phases/phase-2.html` | Core Deep Review | RF |
| 5 | Bug Fix Workflow | `phases/bug-fix.html` | Deferred Workflow | S |
| 6 | Phase 3 — Iterate | `phases/phase-3-iterate.html` | Deferred Workflow | S |
| 7 | Admin Site Workflow | `phases/admin.html` | Deferred Workflow | S |
| 8 | Roadmap Migration — move an existing roadmap table into docs/backlog.json | `phases/roadmap-migrate.html` | Deferred Workflow | S |
| 9 | Existing Projects | `guides/existing-projects.html` | Site-Wide Smoke Check | S |
| 10 | Phase 2 — Build (same title as #4) | `guides/phase-2-build.html` | Supporting / Conditional | RF (F12) |
| 11 | Phase 3 — Iterate (same title as #6) | `guides/phase-3-iterate.html` | Deferred Workflow | S |
| 12 | Adding a Single Feature | `guides/adding-a-feature.html` | Deferred Workflow | S |
| 13 | Resuming in a New Session | `guides/resuming-a-session.html` | Supporting / Conditional | RF (N17) |
| 14 | Evolving Specs | `guides/evolving-specs.html` | Supporting / Conditional | S (referenced by Ship; not deep-read) |
| 15 | Session Handover | `guides/session-handover.html` | Core Deep Review | RF |
| 16 | Interactive Prototype — Background | `guides/interactive-prototype-process.html` | Supporting / Conditional | S (background only per Step 3) |
| 17 | DESIGN.md Format Reference | `guides/design-reference.html` | Supporting / Conditional | S (referenced by Step 3; not deep-read) |
| 18 | Admin Blueprint | `guides/admin-blueprint.html` | Deferred Workflow | S |
| 19 | What You Need | `reference/required-skills.html` | Supporting / Conditional | RF (N1) |
| 20 | Changelog | `changelog.html` | Core Deep Review | R |
| 21 | Phase 1 — Bootstrap Diagram (no "CraftKit" suffix) | `diagrams/phase-1-bootstrap.html` | Supporting / Conditional | RF (N16) |
| 22-29 | Phase 1 · Steps 1 to 8 | `phases/steps/p1-01-ideation.html` to `p1-08-scaffold.html` | Core Deep Review | C for all 8 (kit files also read in full); Step 3 page also read directly (RF, N8, N19) |
| 30-36 | Phase 2 · Steps 1 to 7 | `phases/steps/p2-01-spec.html` to `p2-07-ship.html` | Core Deep Review | C for all 7 (kit files also read in full); Step 7 page also read directly (RF, N4) |

Orphans: none found; every page is reachable from the navigation. The missing `sitemap.xml` is noted but not logged as an issue.

---

## Appendix C. Answers to the plan's key questions (section 17)

| # | Question | Answer from this review |
|---|---|---|
| 1 | Does Getting Started fully explain prerequisites and first actions? | **No.** It names Node 18+ and an AI assistant, but not terminal use, Windows commands, how to share files, required skills, or the design-system file (F1, F2, N1, N8). |
| 2 | Are Core steps, inputs, outputs and approval gates easy to discover? | **Mostly yes.** Each step has a file with Overview, Inputs, Outputs, Gate and Completion Criteria. The phase pages list outputs and gates but not per-step inputs. |
| 3 | Do overviews, detailed steps, templates and handover guidance agree? | **Mostly.** Exceptions: gate definitions (F5), diagram (N16), resume prompt (N17), kickoff location (F8), handover vs. handoff (N10), `ui-ux-tester` model (N7). |
| 4 | Can the next session find its next action from the prescribed handoff files? | **By design, yes:** the Phase 1 → 2 prompt names six files and the scope; `handover.md` has a "Next Action" field. Whether it works in a fresh session is Unverified (execution); F4 and F11 are known gaps. |
| 5 | Are optional and experimental paths labelled clearly? | **Partly.** `scope: feature`, Bug Fix, Admin and handover carry "experimental" labels, but `scope: feature` is prescribed for later releases without the caveat (F9), and N6 may push users there. |
| 6 | Does the site describe the pinned kit accurately? | **Mostly.** Same release, matching tables, all cited paths exist. Gaps: install side effects (N3), skills (N1), definitions lag the kit (F5, F6, F7). |
| 7 | Are completion claims tied to observable checks? | **Largely yes:** Completion Criteria lists, the Phase 1 closeout, "render script exits 0", the smoke test, COVERED/GAP tables. Weak: Step 4 gate and Step 6 (F10). |
| 8 | Is guidance repeated unnecessarily or split across too many pages? | **Some of both.** The site duplicates the kit page by page (N13); there are two pages each for Phase 2 and Phase 3 (F12); handover and resume information is spread over three pages (N10, N17). The Phase 1 closeout is stated once, which is good. |
| 9 | Are cost, external-service, secret and mutating-operation risks disclosed? | **Partly.** Secrets: strong for `.env` and `ENV_SETUP.md`, weak for test credentials (N11). Hosted accounts: pre-flight asks for them but not about cost (N18). Outward actions: the push and PR are described but not flagged as outward-facing (N4). No destructive commands exist in the kit. |

---

## Appendix D. Plan-compliance check and deviations

Each plan requirement and where this report covers it.

| Plan section | Requirement | Status | Where |
|---|---|---|---|
| 8.1 | Freeze baseline: trial ID, date, URL, kit version, local path and read-only status, model, constraints, limitations | Met, with a deviation (read-only not enforced) | Document control, section 2 |
| 8.2 | Per-page inventory (title, URL, class, status) and site-wide navigation and link check | Met | Appendix B, section 3 |
| 8.3 | Read each in-scope page against five dimensions; mark each page's status | Met, with limits: 13 step pages were compared by text matching, not read by eye; the comparison runs kit to site only | Sections 1, 7, Appendix B |
| 8.4 | Inspect installed kit read-only | Met for Core; templates 01/02/03/06/07 and agent definitions read to header level | Sections 1, 5 |
| 8.5 | Compare site vs. kit with the six classes | Met | Section 5 |
| 8.6 | One compact tabletop trace with the listed columns | Met | Section 4 |
| 8.7 | Merge duplicates, classify, audit S0/S1 and disputed claims | Met (no S0/S1 existed); same-context audit | Sections 7, 8, Appendix A |
| 8.8 and 13 | Eight deliverables | Met | Summary (1), Inventory (3, B), Trace (4), Comparison (5), Register (7, A), Backlog (10), Not-tested (11), Next validation (12) |
| 10 | Rubric, six categories, 0-4, no scoring of runtime | Met | Section 6 |
| 11 | Severity and confidence labels; no runtime assumption labelled Confirmed | Met | Section 7, Appendix A |
| 12 | Issue template for every issue | Met for all S2 (Appendix A); S3 items are in a compact table with location and recommendation, which the plan allows ("grouped S3") | Appendix A, section 7 |
| 14 | Completion checklist and verdict | Met | Section 13, Document control |
| 15 | Suggested report structure | Met in substance; sections are numbered differently | Whole report |
| 17 | Key questions | Met | Appendix C |
| 6 | Guardrails: read-only, no builds, no installers, no edits | Met. Commands run were `ls`, `find`, `grep`, `sha256sum`, `curl` GETs and file reads. The only write was this report. | n/a |

**Deviations from the plan (disclosed):**
1. **Read-only access (plan 5.1):** the installed kit was not made OS-read-only. I made no changes; no file was modified after install.
2. **Fresh-context audit (plan 5.3):** the evidence re-check ran in the same context, and no separate model reviewed findings. No S0/S1 finding existed, so the plan's mandatory trigger did not apply.
3. **Page depth (plan 8.3):** 13 of 15 step pages were checked by automated line-by-line comparison against the kit files (which I read in full), not read page by page. Extra text that exists only on the site, and layout or rendering, were not assessed.
4. **Fetch method:** site content came through a summarizing tool; quotes from the site are paraphrases unless shown as exact text from the fetched page.
5. **Templates and agents:** templates 01, 02, 03, 06, 07 and the six agent files were checked at header level only.
6. **No screenshots or browser rendering**, so visual layout and diagram interactivity are Not Tested.
