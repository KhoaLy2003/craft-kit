# What to Say to the AI

You never need to memorise a workflow name. **If you are unsure, or you are coming back to a project, send this and nothing else:**

```text
Start using kit/START.md.
```

`kit/` here is the folder the installer created (see [Getting Started](/getting-started)). The router only reads your project. It prints the workflow to run and the exact prompt to send, including the prompt to **resume** anything left unfinished. See [Start](/start).

---

## By situation

Send the prompt as written in a conversation that can read your project folder. If your AI tool cannot read files, attach the named file first.

| You want to… | Say | What happens next |
|---|---|---|
| Not sure / come back after a break | `Start using kit/START.md.` | Prints the workflow and prompt to run |
| Start a new product | `Start Phase 1 using the kickoff form I've shared.` (fill in `docs/phase-1-kickoff.md` first) | Eight steps; you approve at four gates |
| Build the planned features | `Run Phase 2 using kit/phase-2.md.` | Spec first; you approve it before any code |
| **Build one specific feature** | `Run Phase 2 using kit/phase-2.md for feature F12.` | Same cycle, one feature |
| **Check** the work | Nothing to say: review and E2E run inside Phase 2. At Manual Check the AI gives you a walkthrough; reply with what matches and what does not | Fixes loop back before shipping |
| **Ship** | Nothing to say: Ship is Phase 2 Step 7 and runs after you approve Manual Check | Commit, PR, summary |
| **Resume** an unfinished run | `Start using kit/START.md.` and send the prompt it prints | Continues at the first unfinished step; finished steps are not repeated |
| Pause on purpose | `hand over` | Saves `docs/handover.md`; see [Resuming in a New Session](/guides/resuming-a-session) |
| Fix a bug | `Run the bug fix workflow using kit/phase-bug-fix.md. The problem is: [what is wrong and where].` | Assess (you approve), fix, verify |
| Plan the next release | `Run Phase 3 using kit/phase-3-iterate.md. The release slug is r2-growth.` | Experimental |
| Bring in existing code | `Run Adopt using kit/phase-adopt.md.` | Writes the planning documents from your code |
| Update an older project | `Run the project upgrade using kit/phase-upgrade.md.` | Runs only the modules you need |
| Add an admin site | `Build the admin site using kit/phase-admin.md.` | Experimental |
| Onboard a developer | `Run developer onboarding using kit/phase-onboarding.md.` | Experimental |

---

## At a gate, reply with…

A **hard gate** stops and waits for you. The AI names the decision, sometimes as a short numbered list (`D1`, `D2`, `D3`), each a yes or no question with a default.

| The AI shows | You can reply |
|---|---|
| One decision | `yes` or what to change |
| `D1 … D2 … D3 …` | `1 yes, 2 no, 3 yes`, or `approved` to accept every default |
| A soft summary | Nothing (it continues), or say what to change |

A bare "continue" counts only when the gate message already named the decision. If you answer some decisions and leave others out, the AI asks again for just those.
