# Phase 1 · Step 4 — Roadmap

## Overview

- **Purpose**: Prioritise features into Must / Should / Could / Won't, set the dependency-aware build order, and choose the Phase 2 scope.
- **Agent/Skill**: general-purpose agent drafts; the human makes every priority, cut/keep, and scope call.
- **Model**: `balanced`
- **Trigger**: Step 3 gate approved.
- **Inputs**: `docs/idea-brief.md`; `docs/market-notes.md` *(if Step 2 ran)*; `docs/prototype/`; `docs/DESIGN.md`.
- **Outputs**: `docs/roadmap.md` — build order, deferred features, `Phase 2 Scope`; `docs/backlog.json` — feature list; `docs/backlog.html` — rendered board.
- **Template**: `templates/04-roadmap.md`, `templates/backlog.json`
- **Gate**: `hard` — product-scope decision.

## Scope

- **In**: MoSCoW prioritisation; evaluating each market-research feature inspiration; build order; explicit deferrals; the Phase 2 scope recommendation.
- **Out**: technical decisions (Step 6); sprint or milestone assignment; applying the scope recommendation without human confirmation.

## Execution Rules

- **Feature inspirations**: place each `docs/market-notes.md` Section 5 entry in a MoSCoW tier or mark it `Won't (out of scope)` with a one-line reason; none ignored. If Step 2 was skipped, say so in the roadmap and flag priority assumptions.
- All features (original and inspirations) are written to `docs/backlog.json` under one release entry (`id` `r1`, `name`, `status: planned`). Each feature is `pending` with `release` set to it and a `created` event (`at` ISO date-time, `source: live`, `by: orchestrator`, `note`). Won't and deferred features get `release: null`, status `deferred`, and a `deferred` event. `node kit/scripts/render-backlog.js` generates the roadmap table.
- **Build order** follows dependencies, not only tier: a lower-priority feature that a Must feature depends on comes first.
- **Deferred** features are listed in the Explicitly Deferred section, never dropped.
- **Phase 2 Scope** (`all` | `feature`) — the kit's one selection rule, evaluated on the Must features before presenting the draft:

  | Criterion | `scope: all` (whole app in one cycle) | `scope: feature` (one feature per cycle) |
  |---|---|---|
  | Must feature count | ≤ 15 | > 15 |
  | Feature sizes | All S or M | Any L |
  | Domains | One primary domain; any other domain is < 20% of Must features | A second domain is ≥ 20% of Must features |
  | Dependency structure | Tight chain, each feature builds on the previous | Independent parallel streams |
  | Developers | Solo | Team |

  **Domain** = a distinct area needing a different specialist skill, or a separate deployable concern. UI plus API is **one** domain; web app plus mobile app plus ML pipeline is three. A typical full-stack MVP is one domain, so `scope: all`.

  Recommend `all` only if all five criteria point to it; **any one pointing to `feature` overrides.** Write the recommendation, the five scores, and a one-line rationale in the roadmap's `Phase 2 Scope` section. The human confirms; never auto-applied. Mid-cycle escape: `phase-2.md`.

- **Admin Site** (`yes` | `no` | `later`): ask once, before presenting the draft: "Will this product need an administrator site (to manage users, content, payments, and so on)?" Record the answer in the roadmap metadata. It is a hint for `kit/phase-admin.md` (runs after Phase 2), **never a feature row**, and **excluded from every Phase 2 Scope criterion**. `no` and `later` need no further Phase 1 work.
- **Source references** (`requirements` mode, `docs/idea-brief.md` has `Provenance: requirements`): a feature derived from a requirement starts its `backlog.json` `description` with `[Src: BRD §3.2]`, copied from the brief's `Source Trace` (a description of only the tag is fine). Features with no source requirement carry no tag.
- **Non-functional requirements** (`## 7. Non-functional Requirements` in the template): ask once, in one combined round, before presenting the draft. Offer defaults by project type; the user answers "defaults", edits rows, or marks a category `n/a — <reason>`. Categories: security and privacy, performance, accessibility, i18n/l10n, availability and observability, compliance. Defaults: *web app with accounts* — security (auth on every non-public route, no secrets in the repo, input validation), performance (main page interactive under 3 s on a mid-range device), accessibility (WCAG 2.1 AA, no critical automated-scan violations), observability (errors logged); *API or backend* — security, performance (p95 target), availability and observability (health endpoint, structured logs); *CLI or library* — mostly `n/a`; *internal tool* — accessibility and i18n `n/a`. Each row needs a measurable target or `n/a — <reason>` (all `n/a` is valid), plus `Applies to` and `Verified by` (Review, an E2E case, or a Verification Commands row). Step 7 maps measurable rows to a constitution MUST or Verification Commands row.

## Artifact Rules

- Write `docs/backlog.json` from `templates/backlog.json`. Fill `project` (the project name), `phase2_scope`, and `admin_site` with the same values as the roadmap metadata; the validator rejects empty values. Whenever `Phase 2 Scope` or `Admin Site` changes later, update both places. Then run `node kit/scripts/render-backlog.js`; never hand-edit the generated table or `docs/backlog.html`. Write the rest of `docs/roadmap.md` from the template.
- Keep the template's metadata block and section numbering (Phase 3 appends release blocks and reads Section 4).
- Set `Status: approved` when the human confirms scope and Phase 2 Scope at the gate.

## Completion Criteria

- [ ] Features MoSCoW-prioritised; every Must traces to the Core User Flow; no tech-stack assumptions; build order follows dependencies; deferred features captured.
- [ ] `docs/backlog.json` validates and the render script exits 0.
- [ ] `Phase 2 Scope` (with scores), `Admin Site` (no admin row), and the Non-functional Requirements table are filled; `requirements` mode: `[Src: ...]` tags present.
- [ ] Human confirmed the feature scope and `Phase 2 Scope`.

Gate summary: *"The feature roadmap is set: [N] Must features in build order, [X] items explicitly deferred, Phase 2 will run as scope [all|feature]. Does this scope match what you want to ship for the MVP?"*

## Transition Rules

Next: Step 5 — Full Screen Design. If scope changes after approval (for example during Step 6), return here and re-approve before continuing.
