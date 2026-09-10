---
layout: home

hero:
  name: "Product Development Kit"
  text: "Turn your idea into a real product."
  tagline: "Describe what you want to build. AI agents handle the research, design, planning, and code — pausing at key decisions so you stay in control."
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: Phase 1 — Bootstrap
      link: /phases/phase-1

features:
  - icon: 🚀
    title: Phase 1 — Bootstrap
    details: Eight steps from raw idea to a working app foundation. The AI conducts market research, sketches a prototype, designs the look, maps the features, picks the tech stack, and sets up the codebase. You approve the big decisions along the way.
    link: /phases/phase-1
    linkText: Walk through Phase 1
  - icon: 🔄
    title: Phase 2 — Standard Loop
    details: One feature at a time, from idea to shipped code. Each feature goes through planning, building, review, and a hands-on check before it goes live. Best for larger features or complex projects with multiple areas (frontend + backend).
    link: /phases/phase-2-standard
    linkText: Standard loop
  - icon: ⚡
    title: Phase 2 — Single Pass
    details: All features built in one run. Best for small apps with 15 or fewer features that are all simple to medium in scope. Faster to complete; lower overhead for solo builders.
    link: /phases/phase-2-single-pass
    linkText: Single-pass track
  - icon: 🐛
    title: Bug Fix Workflow
    details: Three steps — diagnose, fix, verify. The AI must confirm the root cause before writing a single line of fix. It cannot mark the bug resolved until the original problem is gone and nothing new is broken.
    link: /phases/bug-fix
    linkText: Bug fix workflow
  - icon: 📦
    title: One Command to Install
    details: Run `npx github:KhoaTonyRay/product-development-kit` in your project folder. It copies all the phase files, templates, and guides into a `kit/` directory — ready to share with ChatGPT, Claude, or any capable AI.
    link: /getting-started
    linkText: Get started
  - icon: 📋
    title: Templates Included
    details: Every planning step has a structured template. Copy the kickoff form once and fill it in; the AI fills everything else — research notes, feature list, tech choice, design guide. All saved as readable text files alongside your project.
    link: /reference/templates
    linkText: View templates
---

---

## Two Phases, One Kit

The kit has a hard split between *starting* a project and *building* it. Phase 1 runs once. Phase 2 runs on every feature.

### Phase 1 — Bootstrap <span class="VPBadge tip" style="vertical-align:middle">once per project</span>

Takes a raw idea through eight sequential steps: market research, interactive prototype, visual design, feature roadmap, tech choice, and codebase setup. Each step produces a planning document that feeds the next. Four decision points require your explicit approval before the next step runs.

**End state:** a runnable app with zero features yet, plus eight approved planning documents in your project's `docs/` folder — everything Phase 2 needs to start building.

[Walk through Phase 1 →](/phases/phase-1)

---

### Phase 2 — Feature Development <span class="VPBadge warning" style="vertical-align:middle">once per feature</span>

Takes one feature from your feature list through brainstorming, planning, building, checking, and shipping. You approve the feature spec before building starts, then do a hands-on walkthrough of the working app before it ships.

Phase 2 has two tracks chosen at the Roadmap gate:

| Track | Best for | Steps |
|---|---|---|
| **Standard loop** | Larger or more complex features; projects spanning frontend and backend | 9 steps per feature |
| **Single pass** | Small apps with 15 or fewer simple-to-medium features; solo builders | 8 steps total |

[Compare the tracks →](/phases/phase-2-standard)

---

## Kit Philosophy

**One feature at a time.** The AI works through one feature fully — planning, building, reviewing, testing — before starting the next. This keeps the work focused and easy for you to follow.

**You approve every big decision.** At several points the AI stops, summarizes what it decided, and waits for your sign-off before continuing. These are called *gates*. You don't need to understand every technical detail — the AI gives you a one-sentence summary and asks if you agree.

**Consistent rules throughout.** Before building starts, the kit establishes a short "constitution" — a list of rules the AI follows for the whole project (things like how files should be named or how errors should be handled). This keeps the code consistent from the first feature to the last.

**A real hands-on check before anything ships.** Before marking a feature complete, you walk through the working app yourself. If anything doesn't match what you asked for, the AI goes back and fixes it.

**The kit folder is read-only.** The files in `kit/` are what the AI reads to know what to do. You never edit them. Your project's planning documents and code live in a separate folder.

---

## How to Use This Kit

**Step 1 — Install the kit** in your project folder:

```bash
npx github:KhoaTonyRay/product-development-kit
```

This creates a `kit/` folder with all the phase files and templates. Run once per project; use `--force` to update an existing install.

**Step 2 — Share the relevant phase file** with your AI assistant and send a short message to begin. The AI reads the file and follows the workflow — creating documents, making decisions, and pausing to get your input at key moments. You don't run anything manually.

**Your role:**
1. Copy `kit/templates/phase-1-kickoff.md` to `docs/phase-1-kickoff.md` and fill it in
2. Read the brief summary the AI sends at each decision point
3. Say yes to continue — or give feedback before it moves on

**Phrases to start** — share the matching phase file first, then send one of these:

::::: code-group

```text [New project]
Start Phase 1 using the kickoff form I've shared.
```

```text [Next feature]
Pick the next pending feature from the roadmap and run the Phase 2 cycle.
```

```text [All features at once]
Run Phase 2 single-pass for all Must features in the roadmap.
```

```text [Bug fix]
Run the bug fix workflow for: [describe what's wrong and where it appears].
```

:::::

Everything the AI produces (documents, plans, code) lands in your **project folder**. The `kit/` folder is a guide the AI reads — you never edit it.

---

## Explore the Docs

<div class="grid-3">

[**Phase 1 — Bootstrap**<br>Eight steps from raw idea to a working app foundation](/phases/phase-1)

[**Phase 2 — Standard Loop**<br>One feature at a time, with planning, building, review, and a hands-on check](/phases/phase-2-standard)

[**Phase 2 — Single Pass**<br>All features in one run — best for small apps with 15 or fewer features](/phases/phase-2-single-pass)

[**Bug Fix Workflow**<br>Diagnose the cause, fix only that, verify it's gone](/phases/bug-fix)

[**Existing Projects**<br>Already have a codebase? Start at Phase 2 with four setup files](/guides/existing-projects)

[**Evolving Specs**<br>How to update your feature plan after something has shipped](/guides/evolving-specs)

[**What You Need**<br>Skills and agents required before starting Phase 1](/reference/required-skills)

[**Changelog**<br>History of all kit changes](/changelog)

</div>

<style>
.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
  margin-top: 24px;
}
.grid-3 a {
  display: block;
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  color: var(--vp-c-text-1);
  transition: border-color 0.2s, background 0.2s;
}
.grid-3 a:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}
</style>
