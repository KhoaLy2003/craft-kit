# Phase 3 — Iterate

Use Phase 3 after a release has shipped and you want to decide what the next release contains. It turns feedback, ideas, or your own judgement into a new release in `docs/backlog.json` and a release block in `docs/roadmap.md`. The features are then built with Phase 2.

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

Pick a short name for the release before you start, such as `r2-growth`. The AI uses it for the folder `docs/iterations/<release-slug>/` and for the release block in the roadmap.

---

## Starting Phase 3

Share `kit/phase-3-iterate.md` with your AI, then send:

```text
Run Phase 3 using kit/phase-3-iterate.md. The release slug is r2-growth.
```

The AI reads your existing backlog, roadmap, and specs before it asks you anything, so its questions cover gaps rather than things already written down.

---

## What Happens

Phase 3 has three steps. You are involved at each one.

### Step 1 — Discover (soft gate)

The AI asks, one question at a time:

1. What is the goal of this release?
2. What evidence do you have? (user feedback, support requests, analytics, interviews, usage notes). "None" is a valid answer.
3. Do you already have feature ideas?

**If you have ideas**, the AI captures each one and asks what problem it solves. An idea without a stated problem does not become a candidate.

**If you have no ideas or only some**, the AI looks at the places ideas usually hide: features you deferred earlier, pain points in your evidence, known defects that block the goal, weak steps in your user journey, and (only if you approve the cost) a competitor and trend scan.

Each candidate has an ID, a one-line description, the problem it solves, a source, a size (S / M / L), and a label: **evidence** or **hypothesis**. The AI never presents a guess as evidence. There are at most 10 candidates. A candidate that is really a bug is moved to the bug-fix workflow.

The result is saved as `docs/iterations/<release-slug>/discover.md`. You review the list and add, remove, or accept candidates before the AI moves on.

### Step 2 — Prioritise (hard gate)

The AI shows the candidates as a table with impact, size, evidence, and dependencies, and recommends where to cut. You decide.

- **Must** features are guaranteed for this release. **Should** and **Could** are stretch.
- A release with more than about 5 Must features, or an L-sized feature, should be split into two releases. The AI will suggest this.
- Unselected candidates go into a **Deferred** list with reasons.

Nothing is written to `docs/backlog.json` until you approve the scope. After approval, the AI adds the release and its features as `pending`, runs the render script, and writes a release block into `docs/roadmap.md`. Shipped features are never changed.

Approve only when the scope is what you actually want to build in this release.

### Step 3 — Handoff (soft gate)

The AI checks whether the new features need changes to the existing foundations: a new service, a data-model or auth change, a new screen design, or a rule in the constitution that a feature would break.

The result goes into an **Impact** table in the release block: each feature against architecture, constitution, and design, marked `none` or `amend`.

- If nothing needs amending, the AI moves on.
- If an amendment is needed, you see the minimal change and the feature that requires it. Nothing changes until you approve it.
- If a feature would break a fundamental constitutional rule, the AI stops. You choose between dropping the feature and amending the constitution.
- If two or more new features need screen designs and have none, the AI runs the screen-design step (Phase 1 Step 5, "Re-entry for new features") before building.

When Step 3 is done, the AI gives you a Phase 2 prompt to start the first pending feature.

---

## Outputs

| File | What it holds |
|---|---|
| `docs/iterations/<release-slug>/discover.md` | Shipped state, evidence, goal, candidates, and what was dropped |
| `docs/backlog.json` | The new release and its features (appended after approval) |
| `docs/backlog.html` | Regenerated board (do not edit by hand) |
| `docs/roadmap.md` | A `## Release <slug>` block with build order, deferred items, and impact |
| `docs/phase-3-session.md` | One section for this release, with the status of each step |

---

## Building the Release

Phase 3 ends with a Phase 2 prompt. Use it in a new conversation:

```text
Run Phase 2 using kit/phase-2.md.
```

Phase 2 is set to `feature` scope for a release, so it builds one feature at a time, in build order, each as its own branch and pull request. See [Phase 2 — Build](/phases/phase-2) for each cycle.

---

## Common Situations

**You want everything in one release.** The AI shows you the combined cost against your goal. If you still want it, the AI records your decision and suggests splitting into sequential releases.

**You select nothing.** The phase ends with no roadmap change. The reason is recorded in the session log. This is a valid outcome.

**There is nothing credible to build yet.** The AI says so and recommends gathering usage evidence first. The phase ends as blocked. The AI will not invent candidates to fill the list.

**The idea changes what the product is.** The AI flags it. It may belong in a new project, not a new release.

---

## Known Limits

- The workflow has not been validated in a test round. The gates, the no-ideas path, and the release-status updates are the least tested parts.
