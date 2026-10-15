# Getting Started

**CraftKit** is a structured guide you share with your AI assistant. Describe what you want to build, and the AI works through research, design, planning, and building — checking in with you at each important decision.

You don't need to be a developer. Your job is to describe your idea and give feedback at the right moments. Plain terms such as *Must feature*, *gate*, or *scope* are explained in the [Glossary](/reference/glossary).

---

## What You Need

- **Node.js 18 or later** — for the one-time install command below
- **An AI assistant** you can have an extended conversation with, ideally one that can read files in your project folder
- **A design-system file (`DESIGN.md`)** — Phase 1 Step 3 stops until you provide one. See [Prepare your DESIGN.md](#prepare-your-design-md)
- **Optional: skills and agents** — add-ons that improve consistency; see [Skills and agents](#skills-and-agents)

The kit tells the AI what to do; you don't need to figure out how to guide it.

---

## Before You Start

### Open a terminal

A terminal is a text window where you type commands.

- **Windows:** press the Windows key, type `PowerShell`, press Enter.
- **macOS:** press Cmd+Space, type `Terminal`, press Enter.
- **Linux:** open your distribution's Terminal application.

### Check Node.js

```bash
node --version
```

If it prints `v18` or higher, you are set. If the command is not found or the number is lower, download the LTS version from [nodejs.org](https://nodejs.org), install it, close the terminal, and open a new one.

### Make a project folder

A project folder is an ordinary folder that holds everything for one product: the kit, the documents the AI writes, and the code. Create an empty one and move into it:

::::: code-group

```powershell [Windows (PowerShell)]
mkdir my-product
cd my-product
```

```bash [macOS / Linux]
mkdir my-product
cd my-product
```

:::::

Run every command below from inside this folder.

### Give your AI access to the files

The AI has to read `kit/` and your `docs/` folder. Use whichever your tool supports, best first:

1. **File access:** open the project folder in your AI tool (as its working directory or workspace) so it reads and writes files itself. This is the intended way.
2. **Paste:** if your tool cannot read files, paste the contents of each file into the chat when asked. You will have to save the files the AI produces into `docs/` yourself.
3. **Upload:** if your tool accepts attachments, attach the file instead of pasting it.

---

## New Project — Five Steps

### Step 1 — Install the kit

Run this in your project folder:

```bash
npx github:KhoaLy2003/craft-kit
```

This creates a `kit/` folder with all the phase files, templates, and guides. You only need to do this once per project. To update to the latest version later:

```bash
npx github:KhoaLy2003/craft-kit --force
```

`--force` overwrites the files the kit ships; it does not touch files you added yourself. When the version changes, the installer prints an upgrade summary (`v0.0.5 › v0.0.6`) and a direct link to the changelog, and removes kit files the new version no longer ships.

The installer may also offer to set up optional skills and an agent. See [What the installer writes](#what-the-installer-writes) for every path it touches.

### Step 2 — Describe your idea

Create the `docs/` folder and copy the kickoff form into it. This is the one place the kickoff lives: `docs/phase-1-kickoff.md`.

::::: code-group

```powershell [Windows (PowerShell)]
mkdir docs
Copy-Item kit\templates\phase-1-kickoff.md docs\phase-1-kickoff.md
```

```bash [macOS / Linux]
mkdir -p docs
cp kit/templates/phase-1-kickoff.md docs/phase-1-kickoff.md
```

:::::

Then fill in `docs/phase-1-kickoff.md`. It asks for:

- What problem you're solving and for whom
- Who the target user is
- Anything you already have (a rough design, a preference for certain tools, existing code)
- Whether to run the optional market research step
- Any hard limits (budget, deadline, things that must or must not be included)

Rough notes are fine — the AI will ask follow-up questions before committing to anything.

### Step 3 — Hand the kit to your AI and start

Give your AI `kit/phase-1-bootstrap.md` and your filled-in `docs/phase-1-kickoff.md` (see [Give your AI access to the files](#give-your-ai-access-to-the-files)), then say:

```text
Start Phase 1 using the kickoff form I've shared.
```

The AI first checks that the skills and agents it uses are available and tells you about any that are missing, then reads both files and works through the eight steps. It announces each step as it starts.

### Step 4 — Review and approve along the way

Phase 1 has four moments where the AI stops and waits for your sign-off before continuing:

| What the AI has done | What you decide |
|---|---|
| Designed the look and feel and built one clickable prototype with it | Does the design and flow match what you had in mind? |
| Built the feature list, build order, and chosen how Phase 2 will run | Is the scope correct? Are the priorities right? |
| Delivered full screen designs for every Must + Should feature *(skipped only when approved designs already exist, or every feature has one simple screen the prototype already covers)* | Do the screen designs accurately reflect the product? Approve before any code is written. |
| Picked the tech stack and architecture | Is this the right foundation for what you want to build? |

Three softer steps — ideation, market research (when you chose to run it), and the coding rules ("constitution") — show you a summary and move on unless you object. The coding rules are usually approved together with the architecture.

### Step 5 — Move to building

When Phase 1 finishes, the AI gives you an exact message to start the next stage. Copy and paste it into a fresh conversation — the AI tells you what to say, with your project name already filled in.

`kit/` is not committed to git. If you continue on another machine or from a fresh clone, run `npx github:KhoaLy2003/craft-kit` in the project folder again first; the `docs/` files come with the repository.

Phase 2 specs, plans, builds, reviews, and tests the work. Small apps build every Must feature in one cycle; larger products go one feature per cycle. Before anything ships, you walk through the working app yourself and confirm it matches what you asked for.

---

## Prepare Your DESIGN.md

Phase 1 Step 3 builds a prototype from a design-system file named `DESIGN.md` that you supply and save at `docs/DESIGN.md`. Get it ready before you start so the run does not stop halfway.

**Where to get one:**

- **[getdesign.md](https://getdesign.md/design-md)** — design systems modelled on well-known products. Download one, rename it `DESIGN.md`.
- **[freedesignmd.com](https://freedesignmd.com)** — free design systems. Same steps.
- **A custom file** — fill in the skeleton `kit/templates/03c-design-system.md`; `kit/guides/design-reference.md` shows a complete example. If a site above is gone, search the web for another DESIGN.md source or use this route.

**Beginner route:** you don't need to judge the file in detail. Pick the downloaded design whose look is closest to the products you like, put it in `docs/`, and the AI checks it against seven criteria:

1. An overview of the design personality
2. At least 5 color tokens
3. A typography scale of at least 3 levels
4. A spacing system
5. At least 3 core components
6. At least 2 responsive breakpoints
7. Real content (at least 300 words)

If a criterion fails, the AI tells you which one and why; you fix or replace the file and say "ready". You approve the look when you see the prototype.

---

## Skills and Agents

Skills are instruction sets and agents are specialist workers that some AI tools can load. The kit works without them; they improve consistency. They are optional per-tool add-ons, and where they live depends on your tool.

| Skill | Used in |
|---|---|
| `brainstorming` | Phase 1 Step 1; Phase 2 Step 1 |
| `writing-plans` | Phase 2 Step 2 |
| `subagent-driven-development` | Phase 2 Step 3 |
| `dispatching-parallel-agents` | Phase 2 Step 3 |
| `using-git-worktrees` | Phase 2 Step 3 |
| `design-taste-frontend` | Phase 1 Step 3 and Phase 2 Step 3 (UI work) |
| `requesting-code-review` | Phase 2 Step 4 |
| `finishing-a-development-branch` | Phase 2 Step 7 |
| `verification-before-completion` | All phases |

Agent: `code-reviewer` (Phase 2 Step 4). All other work uses your tool's general-purpose agent.

When Phase 1 starts, the AI checks which of these your tool has. If something is missing it tells you which step is affected and continues with the closest built-in behavior only after you agree. Details and install notes: [What You Need](/reference/required-skills).

### What the installer writes

| Path | Written when | What it is |
|---|---|---|
| `kit/` | always | The workflow files, templates, and guides |
| `kit/.craft-kit-version`, `kit/.craft-kit-manifest.json` | always | Installed version and the list of files shipped, used by `--force` upgrades |
| `.agents/skills/design-taste-frontend/` | if you accept the skill prompt | Optional skill, installed by the `skills` command |
| `.claude/skills/`, `skills-lock.json` | if the `skills` command creates them | Per-tool skill locations and a lock file made by that command, not by CraftKit. A tool that does not use these locations ignores them |
| `.agents/agents/code-reviewer.md` | if you accept the agent prompt | Optional agent definition downloaded from the VoltAgent repository |

Skills such as `brainstorming` come from a plugin installed inside your AI tool; the installer prints the instructions but writes nothing for them. Use `--skip-setup` to install `kit/` only.

---

## Costs

Hosted services that a stack may need (databases, hosting, authentication) can charge once you pass their free tier. Check each service's current pricing before you create an account. AI usage is billed or rate-limited by your AI provider; the kit's model tiers (`capable`, `balanced`, `fast`) let you use cheaper models for mechanical steps.

---

## Already Have a Project?

Skip Phase 1. Install the kit (`npx github:KhoaLy2003/craft-kit`), then create a few planning documents in a `docs/` folder. See [Existing Projects](/guides/existing-projects) for what to include in each one.

---

## Running a Bug Fix

When something in your shipped app is broken, share `kit/phase-bug-fix.md` with your AI and describe the problem:

```text
Run the bug fix workflow. The problem is: [describe what's wrong and where it happens].
```

You decide at the Assess step: the AI confirms the root cause and the files it will change, and you approve before any code is written. After the fix, the AI verifies it; if the problem shows only in the user interface, you confirm it yourself before anything is committed. See [Bug Fix Workflow](/phases/bug-fix) for the full process. This workflow is experimental.

---

## Planning the Next Release

After a release has shipped, share `kit/phase-3-iterate.md` with your AI and send:

```text
Run Phase 3 using kit/phase-3-iterate.md. The release slug is [your-release-slug].
```

The AI asks what the release should achieve, what evidence you have, and whether you have ideas. It writes nothing to the backlog until you approve the scope. See [Phase 3 — Iterate](/guides/phase-3-iterate) for each step and gate.

---

## Building an Admin Site

After Phase 2 has shipped, share `kit/phase-admin.md` with your AI and send:

```text
Build the admin site using kit/phase-admin.md.
```

Before you start, the app must have shipped through Phase 2, and no unfinished `feature/*` branch may touch the backend areas the admin site needs. The AI proposes modules in `docs/admin/scope.md` and asks you to edit it. You approve at two hard gates: Scope, and Ship. Before Ship, you sign in as each role and walk through the modules yourself. See [Admin Site Workflow](/phases/admin) for the full process. This workflow is experimental.
