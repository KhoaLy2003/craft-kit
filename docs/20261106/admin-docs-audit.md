**Status:** applied
**Last updated:** 2026-11-06
**Based on:** `kit/phase-admin.md`, `kit/guides/admin-blueprint.md`, `kit/templates/admin-scope.md`, `docs-site/guides/admin-site.md`, `docs/superpowers/{plans,specs}/2026-10-05-admin-*`, and every other file that mentions the admin workflow (39 files, 208 mentions)

# Admin workflow docs — audit and change plan

Audience lens: Diátaxis type per file; AI-agent read cost = bytes/4 ≈ tokens (estimate, not measured).

## 1. Inventory

| File | Type | Read by | Lines | Bytes |
|---|---|---|---|---|
| `kit/phase-admin.md` | How-to (orchestration) | Agent, every admin run | 172 | 12,061 |
| `kit/guides/admin-blueprint.md` | Reference | Agent (Step 2, Step 3 dispatches) | 138 | 9,567 |
| `kit/templates/admin-scope.md` | Template | Agent (Step 1) | 71 | 2,350 |
| `docs-site/guides/admin-site.md` | Tutorial/how-to for humans | Human only | 72 | 3,912 |
| `docs/superpowers/plans/2026-10-05-admin-workflow.md` | Historical plan | Nobody | 896 | 48,766 |
| `docs/superpowers/specs/2026-10-05-admin-workflow-design.md` | Historical design | Nobody | 138 | 11,156 |
| Mentions in 30+ other files (README, START, conventions, rubric, cli.js, docs-site pages, CHANGELOG) | Routing / pointers | Mixed | — | — |

Agent-read set per admin run (first three files): **23,978 B ≈ 6.0k tokens**, and the blueprint is re-read or re-passed in Steps 2–3.

## 2. Findings

### F1 — Dead weight: shipped plan and design doc (High)
`docs/superpowers/plans/…` (896 lines) and `specs/…` (138 lines) are tracked, but `kit/phase-admin.md` and the blueprint replaced them. Nothing references them (grep: zero hits outside themselves). They are stale: the plan still mentions `evon:ui-ux` (removed) and a login route behind the guard (changed to exempt). An agent that globs `docs/` could read 15k tokens of out-of-date instructions. Git history keeps them.

### F2 — The same rule is stated 2–3 times (Medium)

| Rule | Where it appears |
|---|---|
| Token never in browser storage / cookie / URL | Blueprint §1 "Why Next.js", §5.5 (twice), phase-admin Step 4 check 4 |
| Proxy rejects `.` / `..` | Blueprint §2, phase-admin Step 4 check 8 |
| Admin app never touches the DB | Blueprint §1 table row, §1 paragraph, §2 |
| "Visuals come from DESIGN.md" | Blueprint header, §3 intro, §6; phase-admin Step 3; rubric row |
| Steps 1 rules vs `admin-scope.md` section comments (roles, identity, open branch, impact) | Both files restate the same instructions |
| Step outputs | Steps table, each step's text, and the closing Output Checklist |
| "When to Use" routing | phase-admin table, `START.md` router, README table |

### F3 — Ambiguities and small gaps (Medium)
- Env var: blueprint §2 says document `ADMIN_API_BASE_URL` in `ENV_SETUP.md` / `.env.example` **of `admin/`**; phase-admin Step 1 says add new env variables to `ENV_SETUP.md` and `.env.example` without saying which one (root or `admin/`).
- Shell check 2 reads as contradictory ("login returns 403 … non-admin token returns 401"). It is correct per blueprint §5.1/§5.5 but needs three explicit lines: non-admin login → 403; non-admin token → 401; admin without the permission → 403.
- Dashboard endpoint `GET /api/admin/dashboard` appears only in blueprint §3; §5 and the module registry do not list it.
- Blueprint §6 ends with "this workflow's gates are the only gates", which carries no instruction.

### F4 — Prompt and summary sprawl (Low)
The trigger prompt "Build the admin site using kit/phase-admin.md." appears in 7 places. Most are UI surfaces (docs-site index, what-to-say, cli.js, summaries) and should stay. README alone has an extra 7-line admin block that repeats its own table row; no other workflow except onboarding gets one.

### F5 — Human guide (Low, keep)
`docs-site/guides/admin-site.md` is human-only (zero agent cost) and readable. "When Something Goes Wrong" repeats Step 1 Exceptions. Light trim only.

### Not a problem
- `AGENTS.md` (9 mentions): all load-bearing; the hard-gate list is test-checked.
- `kit/CHANGELOG.md` (24 mentions): excluded from installs, history by design.
- Tests pin: step banners with `Gate: hard`, "rule 18", `session-handover.md`, and the template's Metadata block. The plan below keeps all of them.

## 3. Change plan

| # | Change | Files | Risk |
|---|---|---|---|
| C1 | Delete the shipped plan and design doc | 2 files in `docs/superpowers/` | None at runtime; needs your OK (git history retains) |
| C2 | Blueprint: remove §6 and its `(§6)` refs; compress "Why Next.js" + Thin-Next + no-DB into one short §1 block; drop the duplicate token bullet; add the dashboard endpoint to §5.3; state which `ENV_SETUP.md` | `admin-blueprint.md`; fix refs in `phase-admin.md`, `task-agent-rubric.md` | Low; grep `§6` after |
| C3 | phase-admin: merge the two header blockquotes; cut the "When to Use" table to the one unique exception line (roadmap says `Admin Site: no`); collapse Step 1's four section-by-section bullets to one that points at the template; reword shell check 2; tighten Step 4 checklist to one line per rule with a blueprint § reference; delete the closing Output Checklist (after checking sibling workflow files) | `phase-admin.md` | Low; keep banners, rule 18, handover link |
| C4 | Template: cut comment text that repeats phase-admin rules; keep the Metadata block and the six sections | `admin-scope.md` | Low |
| C5 | README: delete the admin prompt block (keep table row) | `README.md` | None |
| C6 | Docs-site guide: drop "When Something Goes Wrong" duplicates, keep the shell-check and open-branch lines | `admin-site.md` | None |
| C7 | Add an `[Unreleased]` CHANGELOG entry (required by repo rule) | `kit/CHANGELOG.md` | None |
| Verify | `npm test`; `grep -rn "§6" kit docs-site`; docs-site build | — | — |

## 4. Before vs after (projection, not measured)

| Metric | Before | After | Change |
|---|---|---|---|
| `phase-admin.md` | 172 lines / 12.1 KB | ~145 lines / ~10.2 KB | −16% |
| `admin-blueprint.md` | 138 lines / 9.6 KB | ~124 lines / ~8.6 KB | −10% |
| `admin-scope.md` | 71 lines / 2.4 KB | ~58 lines / ~1.6 KB | −33% |
| **Agent-read set per admin run** | **24.0 KB ≈ 6.0k tokens** | **~20.4 KB ≈ 5.1k tokens** | **−15% (≈ −0.9k tokens per read)** |
| Stale docs an agent could pick up from `docs/` | 59.9 KB ≈ 15k tokens | 0 | −100% |
| Duplicated rules (F2 table) | 7 groups | 0–1 | — |
| Open ambiguities (F3) | 4 | 0 | — |
| Tracked admin-related lines removed | — | ~1,070 (1,034 from C1) | — |

Why the runtime saving is modest: the three agent files are already dense and mostly load-bearing (security contracts, gate text). The big win is C1; the rest is clarity and fewer places to keep in sync.

## 5. Decisions
- Merging files was considered and rejected: the template must stay separate (Step 1 copies it), the blueprint is read at different steps than `phase-admin.md`, and the guide serves human readers.
- Per-file verdict: delete the two `docs/superpowers` files; keep and cut `phase-admin.md`, the blueprint and the template; keep the docs-site guide with a light trim.

## 6. Applied (2026-11-06, uncommitted)

C1–C7 applied. Not applied: the proposed move of the Step 3/4 checks into the blueprint, and the `getting-started.md` admin section (left as is).

| Metric | Before | After (measured) | Change |
|---|---|---|---|
| `phase-admin.md` | 172 lines / 12,061 B | 154 / 11,428 | −5% |
| `admin-blueprint.md` | 138 / 9,567 | 136 / 9,276 | −3% |
| `admin-scope.md` | 71 / 2,350 | 65 / 1,801 | −23% |
| Agent-read set per admin run | 23,978 B ≈ 6.0k tokens | 22,505 B ≈ 5.6k tokens | **−6%** |
| `docs-site/guides/admin-site.md` | 72 / 3,912 | 71 / 3,807 | −3% |
| `docs/superpowers` plan and design doc | 1,034 lines / 59.9 KB | deleted | −100% |
| `README.md` | — | −7 lines | — |

### Round 2 — merge (reversed the section 5 decision)
The first pass only trimmed text and kept four files. Round 2 collapsed the agent-facing set into one file:
- `kit/guides/admin-blueprint.md` is now the closing "Blueprint" section of `kit/phase-admin.md`, with the generic screen detail compressed.
- `kit/templates/admin-scope.md` is deleted; Step 1 lists the six `scope.md` sections inline.
- Removed references: `AGENTS.md` (2), `README.md` (2), `docs-site/.vitepress/config.ts` (2), `docs-site/reference/templates.md`, `task-agent-rubric.md`; the guide links now point at `/phases/admin`.

| Metric | Before | After round 2 |
|---|---|---|
| Agent-facing admin files | 3 (phase, blueprint, template) | **1** (`phase-admin.md`) |
| Bytes read per admin run | 23,978 ≈ 6.0k tokens | **20,388 ≈ 5.1k tokens (−15%)** |
| File reads / template copy step | 3 reads + 1 copy | 1 read, no copy |
| Docs-site admin pages | 3 (guide, phase, blueprint) | 2 (guide, phase) |

Verification: `npm test` 100/100; docs-site build passes. Open: whether to delete the human guide `docs-site/guides/admin-site.md` too.

### Round 3 — drop the fixed stack
The admin app now follows the project's own stack (`docs/architecture.md`, else the `stack-catalog.md` baseline). The Blueprint states constraints (no database, proxy-held httpOnly token, `/api/admin/*` only) instead of a stack table, and its screen contracts, registry and audit record are shorter. This also removes the conflict with `stack-catalog.md` D3. `phase-admin.md`: 255 → 202 lines, 20.4 KB → 17.7 KB. Read per run ≈ 4.4k tokens, −26% versus the original 6.0k. The "different stack" exception is removed from the workflow file, the README row and the docs-site guide. `npm test` 100/100; docs-site build passes.

The projection in section 4 (−15%) overshot for round 1. The agent files were already dense, so the measured saving is −6%; the larger win is the deleted stale files. Verification: `npm test` 100/100 pass; remaining `§6` hits are unrelated (`architecture.md` §6).
