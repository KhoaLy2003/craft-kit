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
      text: What to say to the AI
      link: /guides/what-to-say

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
      src: /icons/maintenance.svg
      alt: Maintenance
    title: Maintenance
    details: Add a feature or fix a bug on a shipped app. A feature is checked against your design, registered, and built by Phase 2. Experimental.
    link: /phases/phase-maintenance
    linkText: Maintenance
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

One install and one core path (Phase 1, then Phase 2). Other workflows cover a shipped app (bug fix, iterate, admin site), an existing codebase (Adopt, Upgrade, Onboarding), and a router (Start) that tells you which one to run.

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

1. Install it in your project folder with `npx github:KhoaLy2003/craft-kit` (creates `kit/`; `--force` updates it). Setup for Windows, macOS and Linux is in [Getting Started](/getting-started).
2. Send one short message to your AI. Unsure which? Send `Start using kit/START.md.` and it picks the workflow. Every prompt by situation is in [What to Say to the AI](/guides/what-to-say).
3. Read the summary the AI sends at each decision point, then say yes or give feedback.

Everything the AI produces lands in your project folder. Never edit `kit/`: an update with `--force` overwrites it.

---

## Explore the Docs

<div class="grid-3">

[**Phase 1 — Bootstrap**<br>Eight steps from raw idea to a working app foundation](/phases/phase-1)

[**Phase 2 — Build**<br>Spec, plan, implement, review, E2E, manual check, ship](/phases/phase-2)

[**Bug Fix Workflow**<br>Diagnose the cause, fix only that, verify it's gone](/phases/bug-fix)

[**Existing Projects**<br>Already have a codebase? Run Adopt, or set up a few files by hand and start at Phase 2](/guides/existing-projects)

[**Not sure where to start?**<br>The Start router inspects your project and prints the workflow and prompt to use](/start)

[**Maintenance**<br>Add a feature or fix a bug on a shipped app](/phases/phase-maintenance)

[**Admin Site**<br>Add a role-based admin site to a shipped app](/guides/admin-site)

[**Developer Onboarding**<br>Generate a one-page guide for a new developer](/phases/onboarding)

[**What to Say to the AI**<br>Every prompt by situation: start, build, resume, fix, plan the next release](/guides/what-to-say)

[**Adopt / Upgrade**<br>Bring an existing codebase or an older kit project up to date](/phases/adopt)

[**Resuming a Session**<br>Continue any workflow in a new conversation](/guides/resuming-a-session)

[**Skills & Agents**<br>Skills and agents the kit uses (one is required for visual work), and how it checks for them](/reference/required-skills)

[**Glossary**<br>Must, gate, scope, domain, seam, and other terms in plain words](/reference/glossary)

[**Session Handover**<br>Continue a long run in a fresh AI session](/guides/session-handover)

[**Changelog**<br>History of all kit changes](/changelog)

</div>
