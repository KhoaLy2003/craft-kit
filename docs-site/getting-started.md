# Getting Started

**CraftKit** is a structured guide you share with your AI assistant. Describe what you want to build, and the AI works through research, design, planning, and building — checking in with you at each important decision.

You don't need any technical knowledge. Your job is to describe your idea and give feedback at the right moments.

---

## What You Need

- **Node.js 18 or later** — for the one-time install command below
- **An AI assistant** — ChatGPT, Claude, or any capable AI you can have an extended conversation with

That's it. The kit tells the AI what to do; you don't need to figure out how to guide it.

---

## New Project — Five Steps

### Step 1 — Install the kit

Run this in your project folder (or any empty folder):

```bash
npx github:KhoaLy2003/craft-kit
```

This creates a `kit/` folder with all the phase files, templates, and guides. You only need to do this once per project. To update to the latest version later:

```bash
npx github:KhoaLy2003/craft-kit --force
```

When the version changes, the installer prints an upgrade summary (`v0.0.5 › v0.0.6`) and a direct link to the changelog. It also removes kit files the new version no longer ships; files you added yourself are left alone.

### Step 2 — Describe your idea

Copy the kickoff form into your project's `docs/` folder:

```bash
cp kit/templates/phase-1-kickoff.md docs/phase-1-kickoff.md
```

Then fill in `docs/phase-1-kickoff.md`. It asks for:

- What problem you're solving and for whom
- Who the target user is
- Anything you already have (a rough design, a preference for certain tools, existing code)
- Whether to run the optional market research step
- Any hard limits (budget, deadline, things that must or must not be included)

Rough notes are fine — the AI will ask follow-up questions before committing to anything.

### Step 3 — Hand the kit to your AI and start

Share `kit/phase-1-bootstrap.md` with your AI along with your filled-in kickoff form, then say:

```text
Start Phase 1 using the kickoff form I've shared.
```

The AI reads both files and begins working through the eight steps. It announces each step as it starts.

### Step 4 — Review and approve along the way

Phase 1 has four moments where the AI stops and waits for your sign-off before continuing:

| What the AI has done | What you decide |
|---|---|
| Designed the look and feel and built one clickable prototype with it | Does the design and flow match what you had in mind? |
| Built the feature list, build order, and chosen how Phase 2 will run | Is the scope correct? Are the priorities right? |
| Delivered full screen designs for every Must + Should feature *(skipped when you already have designs)* | Do the screen designs accurately reflect the product? Approve before any code is written. |
| Picked the tech stack and architecture | Is this the right foundation for what you want to build? |

Two softer steps — market research and the coding rules ("constitution") — show you a summary and move on unless you object. The coding rules are usually approved together with the architecture.

### Step 5 — Move to building

When Phase 1 finishes, the AI gives you an exact message to start the next stage. Copy and paste it into a fresh conversation — the AI tells you what to say, with your project name already filled in.

Phase 2 specs, plans, builds, reviews, and tests the work. Small apps build every Must feature in one cycle; larger products go one feature per cycle. Before anything ships, you walk through the working app yourself and confirm it matches what you asked for.

---

## Already Have a Project?

Skip Phase 1. Install the kit (`npx github:KhoaLy2003/craft-kit`), then create a few planning documents in a `docs/` folder. See [Existing Projects](/guides/existing-projects) for what to include in each one.

---

## Running a Bug Fix

When something in your shipped app is broken, share `kit/phase-bug-fix.md` with your AI and describe the problem:

```text
Run the bug fix workflow. The problem is: [describe what's wrong and where it happens].
```

See [Bug Fix Workflow](/phases/bug-fix) for the full process. This workflow is experimental.
