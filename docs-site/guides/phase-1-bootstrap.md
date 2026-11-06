# Phase 1 — Bootstrap

Phase 1 takes you from a rough idea to a project that is ready to build: planning documents, an approved design and stack, and a scaffolded app that starts but has no features yet. It runs once per project, in eight steps. You approve at four of them.

Already have code? Use [Existing Projects](/guides/existing-projects) instead.

---

## Before You Start

1. Install the kit and get your AI to read your project folder. See [Getting Started](/getting-started).
2. Fill in the kickoff form, `docs/phase-1-kickoff.md`. Rough notes are fine: the problem, who has it, any hard constraints. The AI asks about whatever is missing.
3. **Have a `DESIGN.md` ready** (your design-system file). Step 3 stops until you provide one, so having it ready saves a wait. See [Prepare your design-system file](/getting-started#prepare-your-design-system-file).

Then send:

```text
Start Phase 1 using the kickoff form I've shared.
```

Before Step 1 the AI also checks which skills are installed and asks you which AI models to use for which kind of work. Answer in a sentence; it writes the result to `docs/MODELS.md`.

---

## The Eight Steps

| Step | What the AI does | Your part |
|---|---|---|
| 1. Ideation | Asks short questions about the problem, the user, the alternatives and what is out of scope, then writes the idea brief | Answer; say if the written brief is wrong. It continues unless you object |
| 2. Market Research *(optional)* | Looks at similar products, trends and reasons the idea might fail, and suggests features worth borrowing | Say **run** or **skip** at Step 1. If it runs, say **proceed**, **pivot** or **stop** |
| 3. Prototype & Design | Writes a journey map and a prototype brief, checks your `DESIGN.md`, and builds a clickable HTML prototype | **Open the prototype and approve it** (hard gate) |
| 4. Roadmap | Sorts features into Must / Should / Could / Won't, sets the build order and recommends how Phase 2 will run | **Approve the feature list and the scope** (hard gate) |
| 5. Full Screen Design | Lists every screen, writes a brief for each, and prints one handoff message for your designer | **Send it to your designer, return the designs, and approve the set** (hard gate). No designer: say so and it builds from `DESIGN.md` and the prototype |
| 6. Architecture | Recommends a tech stack with reasons, then writes the architecture, data model and screen flows | **Confirm the stack by name** (hard gate) |
| 7. Constitution | Writes the coding rules every later step must follow, and the commands that prove the code works | Read the summary. It continues unless you object |
| 8. Scaffold | Checks your tools, builds a runnable skeleton with no features, and makes one commit | Install any missing tool it names, and fill in `.env` keys if it asks |

You can skip Step 5 only when approved designs already exist, or when every feature has one simple screen the prototype already shows.

---

## The Four Decisions That Matter

These are the points where a wrong answer is expensive, so the AI stops and waits.

- **Prototype (Step 3).** This approves the flows and the look together. Click through it. Check the empty states and the error states, not only the happy path. The prototype is disposable; it proves the idea, not the architecture.
- **Roadmap (Step 4).** This decides what gets built. Anything marked Won't or deferred is kept in a list, not dropped. The AI also recommends the Phase 2 scope (`all` or `feature`); you confirm it. See [Phase 2 — Build](/guides/phase-2-build#choose-a-scope).
- **Screen design (Step 5).** One sign-off covers every feature. Changing a design after this costs more than changing it now.
- **Stack (Step 6).** Changing the stack mid-build throws away work. Reply with the **name** of the stack (for example "Next.js + Supabase"). A bare "continue" does not count. See [What to Say](/guides/what-to-say#at-a-gate-reply-with) for the short reply formats.

---

## What You Have at the End

| You get | Where |
|---|---|
| Idea brief, market notes, roadmap, feature list | `docs/idea-brief.md`, `docs/market-notes.md`, `docs/roadmap.md`, `docs/backlog.json` and `docs/backlog.html` |
| Design system, prototype, screen designs | `docs/DESIGN.md`, `docs/preview/`, `docs/designs/` |
| Architecture, data model, flows | `docs/architecture.md`, `docs/data-model.md`, `docs/flows.md` |
| Coding rules and verification commands | `docs/constitution.md` |
| A runnable app with no features | your project folder, plus `AGENTS.md` |
| One commit | The only commit Phase 1 makes. Nothing is pushed |
| The prompt for Phase 2 | Printed at the end |

Step 8 ends by printing the exact prompt that starts Phase 2. Open a **new** conversation for it. It will normally look like this:

```text
Run Phase 2 using kit/phase-2.md.
```

---

## Pausing Between Sessions

Phase 1 keeps a log in `docs/phase-1-session.md`. If you close the chat, open a new one and say `Start using kit/START.md`. It finds the first unfinished step and prints the prompt to resume; finished steps are not repeated. Documents stay uncommitted until Step 8, so resume in the same folder. See [Resuming in a New Session](/guides/resuming-a-session).

---

## When Something Goes Wrong

- **You don't like a document.** Say what to change at its gate. The AI rewrites it and asks again; nothing moves on until you approve.
- **Market research says the idea is weak.** Choose **pivot** or **stop**. Phase 1 halts and the decision is logged.
- **You have no `DESIGN.md`.** Step 3 waits for it. The kit has a skeleton to start from, but the file has to come from you.
- **A tool is missing at Step 8.** The AI names the tool and where to install it, then waits and re-checks. It does not continue from a partial scaffold.
- **You want to change the stack after Step 6.** Say so before Phase 2 starts. Once features are built on it, a change discards that work.

---

## Reference

The files the AI follows, shown in full: [Phase 1 — Bootstrap (workflow)](/phases/phase-1) and the eight step pages under it. You do not need to read them to run Phase 1.
