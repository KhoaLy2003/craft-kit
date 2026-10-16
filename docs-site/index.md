---
layout: home

hero:
  name: "CraftKit"
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
  - icon:
      src: /icons/phase-1.svg
      alt: Phase 1 Bootstrap
    title: Phase 1 — Bootstrap
    details: Eight steps from raw idea to a working app foundation. The AI sketches the idea, optionally researches the market, designs and prototypes the look, maps the features, delivers full screen designs, picks the tech stack, and sets up the codebase. You approve the big decisions along the way.
    link: /phases/phase-1
    linkText: Walk through Phase 1
  - icon:
      src: /icons/phase-2.svg
      alt: Phase 2 Build
    title: Phase 2 — Build
    details: One seven-step cycle — spec, plan, implement, review, E2E, manual check, ship. Small apps build every Must feature in one run; larger products build one feature per cycle. You approve the spec and walk through the working app before anything ships.
    link: /phases/phase-2
    linkText: Phase 2 workflow
  - icon:
      src: /icons/bug-fix.svg
      alt: Bug Fix Workflow
    title: Bug Fix Workflow
    details: Assess, fix, verify. The AI must confirm the root cause and the files it will touch before writing a fix, and cannot mark the bug resolved until the original problem is gone and nothing new is broken.
    link: /phases/bug-fix
    linkText: Bug fix workflow
  - icon:
      src: /icons/phase-3.svg
      alt: Phase 3 Iterate
    title: Phase 3 — Iterate
    details: After release, turn real-world feedback into the next roadmap release — discover what to change, prioritise it, and hand it to Phase 2. Experimental.
    link: /phases/phase-3-iterate
    linkText: Iterate
  - icon:
      src: /icons/install.svg
      alt: One Command to Install
    title: One Command to Install
    details: Run `npx github:KhoaLy2003/craft-kit` in your project folder. It copies all the phase files, templates, and guides into a `kit/` directory — ready to share with ChatGPT, Claude, or any capable AI.
    link: /getting-started
    linkText: Get started
  - icon:
      src: /icons/templates.svg
      alt: Templates Included
    title: Templates Included
    details: Every planning step has a structured template. Copy the kickoff form once and fill it in; the AI fills everything else — research notes, feature list, tech choice, design guide. All saved as readable text files alongside your project.
    link: /reference/templates
    linkText: View templates
---

---

## The Big Picture

One install, one core path, and three experimental workflows you can reach once the app has shipped.

<div style="margin:24px 0;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.12);">
  <iframe src="/craft-kit/diagrams/overview.html?embed=1" width="100%" style="border:none;display:block;height:60vh;min-height:480px;" title="CraftKit overview — interactive diagram"></iframe>
</div>
<p style="margin-top:8px;font-size:0.85em;color:var(--vp-c-text-2);">Pan and zoom to explore. <a href="/craft-kit/diagrams/overview.html" target="_blank" rel="noopener">Open full screen ↗</a></p>

---

## Two Phases, One Kit

The kit has a hard split between *starting* a project and *building* it. Phase 1 runs once. Phase 2 builds what Phase 1 planned.

### Phase 1 — Bootstrap <span class="VPBadge tip" style="vertical-align:middle">once per project</span>

Takes a raw idea through eight steps (market research runs only if you choose it; full screen design is skipped when approved designs exist or the prototype already covers each feature's one simple screen): ideation, market research (optional), a combined prototype and design step, feature roadmap, full screen design, tech choice, coding rules, and codebase setup. Each step produces a planning document that feeds the next. Four steps require your explicit approval before the next one runs.

**End state:** a runnable app with zero features yet, plus the approved planning documents in your project's `docs/` folder — everything Phase 2 needs to start building.

[Walk through Phase 1 →](/phases/phase-1)

---

### Phase 2 — Build <span class="VPBadge warning" style="vertical-align:middle">one cycle per scope</span>

Takes the feature list through spec, plan, implementation, review, E2E testing, a hands-on check, and shipping. You approve the spec before building starts, then walk through the working app before it ships.

The Roadmap gate in Phase 1 sets the scope:

| Scope | Best for | Cycles |
|---|---|---|
| `all` | Small apps: one domain, small-to-medium features, complete scope known upfront | One cycle for every Must feature |
| `feature` *(experimental)* | Larger or multi-domain products | One cycle per feature |

[See the Phase 2 workflow →](/phases/phase-2)

---

## Kit Philosophy

**You approve every big decision.** At several points the AI stops, summarizes what it decided, and waits for your sign-off before continuing. These are called *gates*. You don't need to understand every technical detail — the AI gives you a one-sentence summary and asks if you agree.

**Consistent rules throughout.** Before building starts, the kit establishes a short "constitution" — a list of rules the AI follows for the whole project (things like how files should be named or how errors should be handled). This keeps the code consistent from the first feature to the last.

**A real hands-on check before anything ships.** Before marking work complete, you walk through the working app yourself. If anything doesn't match what you asked for, the AI goes back and fixes it.

**Leave the kit folder alone.** The files in `kit/` are what the AI reads to know what to do. Don't edit them: `npx github:KhoaLy2003/craft-kit --force` overwrites them when you update. Your project's planning documents and code live in a separate folder.

---

## How to Use This Kit

**Step 1 — Install the kit** in your project folder:

```bash
npx github:KhoaLy2003/craft-kit
```

This creates a `kit/` folder with all the phase files and templates. Run once per project; use `--force` to update an existing install.

**Step 2 — Share the relevant phase file** with your AI assistant and send a short message to begin. The AI reads the file and follows the workflow — creating documents, making decisions, and pausing to get your input at key moments. You don't run anything manually.

**Your role:**
1. Copy `kit/templates/phase-1-kickoff.md` to `docs/phase-1-kickoff.md` and fill it in (setup steps for Windows, macOS, and Linux are in [Getting Started](/getting-started))
2. Read the brief summary the AI sends at each decision point
3. Say yes to continue — or give feedback before it moves on

**Phrases to start** — share the matching phase file first, then send one of these:

::::: code-group

```text [New project]
Start Phase 1 using the kickoff form I've shared.
```

```text [Build (Phase 2)]
Run Phase 2 using kit/phase-2.md.
```

```text [Bug fix]
Run the bug fix workflow using kit/phase-bug-fix.md. The problem is: [describe what's wrong and where it appears].
```

```text [Next release (Phase 3)]
Run Phase 3 using kit/phase-3-iterate.md. The release slug is r2-growth.
```

```text [Admin site]
Build the admin site using kit/phase-admin.md.
```

```text [Developer onboarding]
Run developer onboarding using kit/phase-onboarding.md.
```

:::::

Everything the AI produces (documents, plans, code) lands in your **project folder**. The `kit/` folder is a guide the AI reads — you never edit it; an update with `--force` overwrites it.

---

## Explore the Docs

<div class="grid-3">

[**Phase 1 — Bootstrap**<br>Eight steps from raw idea to a working app foundation](/phases/phase-1)

[**Phase 2 — Build**<br>Spec, plan, implement, review, E2E, manual check, ship](/phases/phase-2)

[**Bug Fix Workflow**<br>Diagnose the cause, fix only that, verify it's gone](/phases/bug-fix)

[**Existing Projects**<br>Already have a codebase? Start at Phase 2 with a few setup files](/guides/existing-projects)

[**Evolving Specs**<br>How to update your feature plan after something has shipped](/guides/evolving-specs)

[**What You Need**<br>Skills and agents the kit uses (one is required for visual work), and how it checks for them](/reference/required-skills)

[**Glossary**<br>Must, gate, scope, domain, seam, and other terms in plain words](/reference/glossary)

[**Session Handover**<br>Continue a long run in a fresh AI session](/guides/session-handover)

[**Changelog**<br>History of all kit changes](/changelog)

</div>
