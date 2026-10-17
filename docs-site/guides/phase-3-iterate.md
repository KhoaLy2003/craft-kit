# Phase 3 — Iterate

Use Phase 3 after a release has shipped, when customers or stakeholders send new requirements, or when you want to improve the product on your own evidence or ideas. It runs again for every new batch of requirements. It turns them into a new release in `docs/backlog.json` and a release block in `docs/roadmap.md`. The features are then built with Phase 2, and the one-time Phase 1 steps (ideation, market research, scaffold) are not repeated.

Phase 3 never writes feature code. It decides what to build; Phase 2 builds it.

> **Status: experimental.** This workflow has not yet been validated in a test round. Expect gaps, and tell the kit maintainer what you find.

---

## When to Use It

| Situation | Use |
|---|---|
| Something shipped is broken | [Bug Fix Workflow](/phases/bug-fix) |
| One shipped feature needs different behaviour | Change its spec (see [Evolving Specs](/guides/evolving-specs)), then Phase 2 |
| You already know the one feature to add | [Adding a Single Feature](/guides/adding-a-feature) |
| You need to decide **what** to build next | **Phase 3** |
| The core idea, audience, or stack has fundamentally changed | A new project: start again at Phase 1 |

Use Phase 3 with ideas or without them. If you have no ideas and no evidence, Phase 3 will help you gather them rather than invent a list.

---

## Before You Start

Phase 3 needs these files in your project's `docs/` folder:

- `backlog.json` and `roadmap.md` — from the shipped release. If your project predates the backlog file, run `kit/phase-roadmap-migrate.md` first.
- `constitution.md`, `architecture.md`, `DESIGN.md`
- Your application, shipped or at least runnable

Pick a short name (the **slug**) for the release before you start: lowercase letters, digits and hyphens, no spaces, such as `r2-growth` or `r2-client-requests`. The AI uses it for the folder `docs/iterations/<release-slug>/` and for the release block in the roadmap. Use a new slug for every release.

Have your input ready too: the client's requests, feedback, tickets or usage notes. The AI asks for them in Step 1.

---

## Starting Phase 3

Open a **new AI session in your project root** (the kit must be installed, so `kit/phase-3-iterate.md` exists), then send:

```text
Run Phase 3 using kit/phase-3-iterate.md. The release slug is r2-growth.
```

**Real-world example.** Your online bookstore shipped its first release. The client now asks for a wishlist, order-tracking emails, and a CSV export of orders. Use `r2-client-requests` as the slug, send the prompt, and when the AI asks whether you have ideas, answer "yes" and paste the three requests.

The AI reads your existing backlog, roadmap, and specs before it asks you anything, so its questions cover gaps rather than things already written down.

---

## What Happens

Phase 3 has five steps. You are involved at each one.

### Step 1 — Discover (soft gate)

The AI asks, one question at a time:

1. What is the goal of this release?
2. Have customers or stakeholders sent requirements? Who asked, what, and why.
3. What other evidence do you have? (user feedback, support requests, analytics, interviews, usage notes). "None" is a valid answer.
4. Do you already have feature ideas?

**If you have received requirements**, the AI records each one in the requester's words, asks what problem sits behind it and how they will know it works, and notes who asked.

**If you have ideas**, the AI captures each one and asks what problem it solves. An idea without a stated problem does not become a candidate.

**If you have no ideas or only some**, the AI looks at the places ideas usually hide: features you deferred earlier, pain points in your evidence, known defects that block the goal, weak steps in your user journey, and (only if you approve the cost) a competitor and trend scan.

Each candidate has an ID, a one-line description, the problem it solves, a source (including who requested it), a size (S / M / L), and a label: **evidence** or **hypothesis**. The AI never presents a guess as evidence. There are at most 10 candidates. A candidate that is really a bug is moved to the bug-fix workflow.

The result is saved as `docs/iterations/<release-slug>/discover.md`. You review the list and add, remove, or accept candidates before the AI moves on.

### Step 2 — Prioritise (hard gate)

The AI shows the candidates as a table with impact, size, evidence, and dependencies, and recommends where to cut. You decide.

- **Must** features are guaranteed for this release. **Should** and **Could** are stretch.
- A release with more than about 5 Must features, or an L-sized feature, should be split into two releases. The AI will suggest this.
- Unselected candidates go into a **Deferred** list with reasons.

Nothing is written to `docs/backlog.json` until you approve the scope. After approval, the AI adds the release and its features as `pending`, runs the render script, and writes a release block into `docs/roadmap.md`. Shipped features are never changed.

Approve only when the scope is what you actually want to build in this release.

### Step 3 — Design (hard gate)

Before anything is built, the AI designs the **whole wave** in one pass, so features that touch the same data cannot conflict later. It first estimates each feature's **design delta** (`none`, `data-only`, `flow`, `screens`) in an **Impact** table, then writes one proposal, `docs/iterations/<release-slug>/design.md`:

- **Data model:** every new or changed entity, field, and relationship for all features.
- **Flows:** new and changed flows, transitions, and hand-offs between features.
- **Architecture, constitution, design system:** new services, dependencies, rules, tokens, components.
- **Screens:** designs for every feature that needs them (the Phase 1 Step 5 re-entry, run as one batch).

It also builds a **Shared Surface** table: every data point (entity or field, route, event, screen, setting) that two or more features touch, each with exactly **one owner** feature and a conflict rule where two features write it. The AI checks every pair of features and resolves contradictions before you see the design.

Nothing in your foundation documents changes until you approve. After approval the design is applied once to `data-model.md`, `flows.md`, `architecture.md`, the constitution, and `DESIGN.md`, and every applied item is written to an **Amendment log** so it can be reversed if a feature is cancelled. A change that breaks a fundamental constitutional rule stops the AI; you choose between dropping the feature and amending the constitution.

### Step 4 — Handoff (soft gate)

The AI splits the release into **work packages**: a table with each feature, what it depends on, which Shared Surface items it owns, and a **group**. Features in the same group can be built at the same time (each only depends on earlier groups and none needs another's code, because the schema and contracts are fixed by the design). It then commits the design on a `design/<release-slug>` branch and opens a PR (you confirm the remote first), so every feature branch starts from the same design.

You get one Phase 2 prompt per feature in the first group. Run each in its own session, worktree, or hand it to a developer. Prompts for later groups come when the earlier groups have shipped. If a feature turns out to need something the design lacks, it stops and sends a **design change request** back to Phase 3; the design, the Shared Surface table, and the affected features are updated together, never patched inside one feature.

### Step 5 — Closeout (soft gate)

After Phase 2 ships the release, the AI lists each feature's final status, asks what to do with leftover `pending` features (keep, or move to `deferred`), and writes an **Outcome** section in the release block: goal against delivery, shipped and cancelled features, and any feedback since release. New requirements then start a new Phase 3 round with a new slug.

### When scope changes after approval

Customers can drop or change requirements at any time. To drop a feature, the AI marks it `cancelled` with your reason; it is never deleted. It then lists the design items that feature introduced (from the Amendment log) and reverts them after your approval, except where another surviving feature uses them; a shared item the cancelled feature owned passes to a surviving user, and the work packages are re-checked. The spec is marked `cancelled` and kept for the record, you decide whether its branch is discarded or parked, and features that depended on it are re-checked with you. Requirements that arrive mid-build wait for the next Phase 3 round.

---

## Outputs

| File | What it holds |
|---|---|
| `docs/iterations/<release-slug>/discover.md` | Shipped state, requirements received, evidence, goal, candidates, and what was dropped |
| `docs/iterations/<release-slug>/design.md` | The design for the whole wave, per foundation document |
| `docs/backlog.json` | The new release and its features (appended after approval); dropped features stay as `cancelled` |
| `docs/backlog.html` | Regenerated board (do not edit by hand) |
| `docs/roadmap.md` | A `## Release <slug>` block with build order, impact, shared surface, amendment log, work packages, and outcome |
| `docs/phase-3-session.md` | One section for this release, with the status of each step |

---

## Building the Release

Phase 3 ends with one Phase 2 prompt per feature of the first group. Use each in its own conversation:

```text
Run Phase 2 using kit/phase-2.md for feature F12.
```

Phase 2 is set to `feature` scope for a release. Each feature is its own branch and pull request, and features in the same group run in parallel. A feature's spec only checks its slice of the approved wave design. See [Phase 2 — Build](/phases/phase-2) for each cycle.

---

## Common Situations

**You want everything in one release.** The AI shows you the combined cost against your goal. If you still want it, the AI records your decision and suggests splitting into sequential releases.

**You select nothing.** The phase ends with no roadmap change. The reason is recorded in the session log. This is a valid outcome.

**There is nothing credible to build yet.** The AI says so and recommends gathering usage evidence first. The phase ends as blocked. The AI will not invent candidates to fill the list.

**The idea changes what the product is.** The AI flags it. It may belong in a new project, not a new release.

---

## Known Limits

- The workflow has not been validated in a test round. The gates, the no-ideas path, and the release-status updates are the least tested parts.
