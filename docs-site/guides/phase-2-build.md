# Phase 2 — Build

Phase 2 turns your planned features into working code. It runs one seven-step cycle, and you approve at the points where a mistake would be expensive to undo.

Phase 2 needs a finished Phase 1, or an existing project with the planning files in place. See [Existing Projects](/guides/existing-projects) for the files.

---

## Choose a Scope

The roadmap says how Phase 2 runs. Look for `Phase 2 Scope` in `docs/roadmap.md`:

| Scope | What one run builds | Use it for |
|---|---|---|
| `all` | Every Must feature, in one cycle, one pull request | Small apps: one domain, small to medium features, scope known upfront. A "domain" is an area of work needing a different specialist skill or a separate deployable concern; a normal web app with UI and API is one domain. Validated in the test rounds. |
| `feature` | One feature per cycle, in build order | Larger or multi-domain products, and every release after the first. Experimental. |

Phase 1 recommends a scope at the roadmap gate, and you confirm it. You can change it later if a cycle shows the app is more complex than expected; the AI will suggest the switch and wait for your agreement.

---

## Starting Phase 2

Share `kit/phase-2.md` with your AI, then send:

```text
Run Phase 2 using kit/phase-2.md.
```

The AI reads the roadmap, backlog, constitution, architecture, and design, then starts the first cycle.

---

## One Cycle

| Step | What the AI does | Your part |
|---|---|---|
| 1. Spec | Writes what the feature must do: acceptance criteria, validation, errors, and edge cases | **Approve the spec** (hard gate) |
| 2. Plan | Splits the work into tasks and assigns a specialist to each | Nothing; the AI presents the plan |
| 3. Implement | Builds on a new `feature/<slug>` branch, never on `main` | Nothing |
| 4. Review | Checks the code against the spec and fixes what it finds | Nothing. It is done when the last review shows zero open findings and no acceptance criterion without matching code |
| 5. E2E | Writes and runs end-to-end tests, and tells you what a prerequisite needs | Provide any test accounts or services it asks for. Passwords go in your git-ignored `.env`, never in the committed test doc |
| 6. Manual Check | Lists the acceptance criteria and E2E results, then gives you the app to walk through | **Test the app and confirm in your own words** (hard gate) |
| 7. Ship | Checks that a git remote exists and you are signed in, asks you to confirm the remote, then pushes and opens one pull request, and records the feature as shipped | Confirm the remote; review and merge the pull request yourself |

The AI never merges to `main` and never pushes to it. Pushing and opening a pull request publish your code outside this machine, so the AI asks first. With no remote or no sign-in, it commits on the feature branch, skips the push, and tells you how to publish later. The spec and the manual check are the two moments that decide what ships, so take them seriously.

Shipped features are recorded as `shipped` events in `docs/backlog.json`; `docs/backlog.html` and the roadmap table are generated from it.

---

## Feature-by-Feature Runs

With `scope: feature` (experimental, not yet validated in a test round), the cycle repeats. After Ship, the next `pending` feature starts at Step 1, with its own spec, branch, and pull request. Each feature is shipped on its own, so a problem found in one does not hold up the others.

Features that depend on each other are built in dependency order. The build order is in the roadmap.

---

## Pausing Between Sessions

Long runs can hit the limits of a single conversation. The AI can save a handover file (`docs/handover.md`) at a clean point, after the plan, the implementation, or the review, and you resume from it in a new session. It offers this at those points; you do not need to ask. The same mechanism covers all of Phase 2; the one-time Phase 1 to Phase 2 handoff prompt is separate.

---

## When Something Goes Wrong

- **The spec is wrong.** Say so at the spec gate. The AI revises the spec and asks again; nothing is built until you approve it.
- **The plan is too big.** Under `scope: all`, the AI may suggest switching to `scope: feature`. Agree only if you want the release split.
- **The manual check fails.** Describe what you saw. The AI fixes it on the same branch, reruns the affected tests, and asks you to check again.
- **A bug turns up after shipping.** Use the [bug-fix workflow](/phases/bug-fix), not another Phase 2 run.
- **One feature should be added.** Use [Adding a Single Feature](/guides/adding-a-feature).
