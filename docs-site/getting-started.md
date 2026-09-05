# Getting Started

**Product Development Kit** is a structured guide you share with your AI assistant. Describe what you want to build, and the AI works through research, design, planning, and building — checking in with you at each important decision.

You don't need any technical knowledge. Your job is to describe your idea and give feedback at the right moments.

---

## What You Need

- An AI assistant you can have an extended conversation with — ChatGPT, Claude, or any capable AI
- This kit's files downloaded and accessible alongside your project

That's it. The kit tells the AI what to do; you don't need to figure out how to guide it.

---

## New Project — Four Steps

### Step 1 — Describe your idea

Copy `kit/templates/phase-1-kickoff.md` into your project folder and fill it in. It asks for:

- What problem you're solving and for whom
- Who the target user is
- Anything you already have (a rough design, a preference for certain tools, existing code)
- Any hard limits (budget, deadline, things that must or must not be included)

Rough notes are fine — the AI will ask follow-up questions before committing to anything.

### Step 2 — Hand the kit to your AI and start

Share `kit/phase-1-bootstrap.md` with your AI along with your filled-in kickoff form, then say:

```text
Start Phase 1 using the kickoff form I've shared.
```

The AI reads both files and begins working through the nine steps. It announces each step as it starts.

### Step 3 — Review and approve along the way

Phase 1 has four moments where the AI stops and waits for your sign-off before continuing:

| What the AI has done | What you decide |
|---|---|
| Researched the market *(optional step)* | Is there a real need for this? Proceed, change direction, or stop. |
| Designed the look and feel | Does the design match what you had in mind? |
| Built the feature list | Is the list correct? Are the priorities right? |
| Written the AI's working rules | Are the guidelines for how your app gets built correct? |

At each point the AI gives you a one-sentence summary. You respond with approval or feedback — you don't need to read the full document it produced.

### Step 4 — Move to building

When Phase 1 finishes, the AI gives you an exact message to start the next stage. Copy and paste it into a fresh conversation — the AI tells you what to say, with your project name already filled in.

Phase 2 builds your features one at a time. Before each feature ships, you walk through the working app yourself and confirm it matches what you asked for.

---

## Already Have a Project?

Skip Phase 1. You just need four planning documents in a `docs/` folder. See [Existing Projects](/guides/existing-projects) for what to include in each one.

---

## Running a Bug Fix

When something in your shipped app is broken, share `kit/phase-bug-fix.md` with your AI and describe the problem:

```text
Run the bug fix workflow. The problem is: [describe what's wrong and where it happens].
```

See [Bug Fix Workflow](/phases/bug-fix) for the full three-step process.
