# Model Setup

> Read by the orchestrator automatically when `docs/MODELS.md` is absent. Not a user-facing prompt — the user never references this file directly.


## Instructions for the AI

You are the AI running this session. You know your own provider, model, and capabilities — no external reference needed.

**1 — Identify what is available**

State your current provider and every model available in this session. Include any alternative models the user can switch to within this harness (e.g. a faster or cheaper variant alongside the default).

**2 — Map to tiers**

Assign one model to each tier based on the definitions below. It is valid for two or three tiers to share the same model if the subscription only provides one.

| Tier | What it requires |
|---|---|
| `capable` | Your most powerful model: strongest reasoning, longest context, highest output quality. For steps where a wrong decision is expensive to reverse — Ideation, Architecture, Spec. |
| `balanced` | Your standard workhorse: strong at code generation, planning, and analysis. Covers the majority of Phase 2 work. |
| `fast` | Your cheapest or fastest option: mechanical steps with no complex reasoning — Assign Specialists, Ship, git operations. May be the same as `balanced`. |

**3 — Write `docs/MODELS.md`**

Copy `kit/templates/MODELS.md` to `docs/MODELS.md`. Fill in every field:
- Provider name
- Today's date
- Model name for each tier
- Leave per-step overrides empty unless you have a specific reason to deviate

**4 — Confirm with the user**

Read the completed file content back in chat. Ask:

> "This is how I have configured your models for this project. Does this look correct, or would you like to adjust any tier?"

**5 — Wait for approval**

Do not set `Status: approved` until the user explicitly confirms. If the user requests a change, update `docs/MODELS.md` and confirm again. Once approved, the file is the source of truth for every step in this project.

---

## When to re-run

Re-run this setup (delete `docs/MODELS.md` and start fresh) when:

- You switch to a different AI provider or harness mid-project
- Your subscription changes and new models become available
- You want to adjust the cost/quality balance across phases
