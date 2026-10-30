# Developer Onboarding — create docs/ONBOARDING.html for a developer joining the project

> **Status: experimental — not yet validated in a test round.**
>
> **Use on demand**, for any project (built with the kit or not) when a new developer or engineer is joining. Re-run to refresh.
>
> Output: `docs/ONBOARDING.html`, a single self-contained page (no build step, no network; opens in any browser, light and dark mode, side navigation, printable). Derived from the project's docs and code, reviewed by you, and marked `approved`. Nothing else in `docs/` is touched.

Universal rules: `kit/orchestrator-conventions.md`.

## How it is created and updated

- **Created:** the AI reads the README, config, and kit documents, drafts every section with each fact labelled, you review at the hard gate, and it writes `docs/ONBOARDING.html` from `templates/onboarding.html`.
- **Updated:** regenerated, never hand-patched. Re-run the same prompt and choose "refresh" in Step 1; it re-reads the sources **and** the existing file, carrying over earlier answers (including your hand edits, which it asks before replacing) and asking only about changed or new items. Refresh after a Phase 2 feature changes setup, structure, or conventions, and before each new developer starts; nothing triggers it automatically.

## Limitations (read before running)

- **Derived from existing docs and code.** Missing kit documents do not block; those sections come from code or the README, or are `unknown`.
- **Nothing is invented.** Commands are copied verbatim from scripts. Undeterminable items are `unknown`.
- **Code beats docs.** A conflict is reported, never silently resolved.
- **Secrets stay out.** `.env*` files are read for variable names only; values never appear in chat or the file.

## How to start

Send this to your AI, from the project root:

```text
Run developer onboarding using kit/phase-onboarding.md.
```

The AI lists its sources, drafts the guide with every fact labelled, and shows each unknown and conflict; you decide per item (keep, correct, drop, mark unknown). Nothing is written until you approve. Have ready: the access and accounts a new developer must request (code cannot tell it); one answer for the whole list is fine.

## Steps

| # | Name | Gate | Model | Output |
|---|---|---|---|---|
| 1 | Gather | none | fast | Source list shown to the user |
| 2 | Draft | none | balanced | In-chat draft, items labelled |
| 3 | Review | hard | capable | User decision per non-confirmed item |
| 4 | Write & verify | none | fast | `docs/ONBOARDING.html` |

## Step 1 — Gather

1. If `docs/ONBOARDING.html` exists with `Status: approved`, ask the user: refresh (continue) or stop. On refresh, the existing file is an input source (see Step 2).
2. Locate the sources and show the user the list:
   - `README.md`, `package.json`, lockfile, `Makefile`, `docker-compose*`, `.env.example`, `.nvmrc`, CI config (`.github/workflows/`);
   - kit documents when present: `docs/idea-brief.md`, `docs/architecture.md`, `docs/data-model.md`, `docs/flows.md`, `docs/constitution.md`, `docs/DESIGN.md`, `docs/scaffold-checklist.md`, `docs/E2E-TESTS.md`, `docs/roadmap.md`, `docs/backlog.json`.
3. Monorepo: ask which app or package to cover.

## Step 2 — Draft

One read-only general-purpose agent dispatch; it writes no files and returns every section of `templates/onboarding.html` in chat as plain text.

Label every fact:

| Label | Meaning |
|---|---|
| `from-docs` | a kit document or the README says so |
| `from-code` | found in config or scripts |
| `from-previous` | carried over from the existing `ONBOARDING.html` (refresh only) and not contradicted by current code or docs |
| `unknown` | not determinable |

Rules: nothing invented; commands verbatim from scripts; `.env*` names only. Code beats docs; list the conflict separately (a `from-previous` item contradicted by current code or docs is also a conflict).

## Step 3 — Review (hard gate)

Present the filled-in draft, then every `unknown` item and every conflict. Ask per item: **keep / correct / drop / mark unknown**.

Bulk answers are allowed (echo the per-item meaning back before writing). Only the user's answer resolves a conflict.

Gate summary: *"The onboarding guide has [N] sections, [u] items unknown, [c] conflicts. Write `docs/ONBOARDING.html`? [Yes / change an item]"*

## Step 4 — Write & verify

1. Write the file from `templates/onboarding.html`: fill every double-brace placeholder, delete the guide comments, set the status badge to `approved`, set the `craft-kit-provenance` meta to `generated from docs and code on <date>`, and set `Based on` to the real files read. HTML-escape all inserted text. Items marked `unknown` get the `unknown` class in place and are also listed in section 11, Open questions. Omit links to documents that do not exist.
2. Run checks; on failure of (b)–(e) fix and re-check without asking:
   - (a) the file exists on disk (conventions rule on write verification);
   - (b) every `npm run <x>` and `make <x>` command written in sections 3 and 9 maps to an existing script or target;
   - (c) every relative link resolves to an existing file;
   - (d) section 4 holds names only; no `.env` value appears anywhere in the file;
   - (e) no double-brace placeholder and no guide comment remains, and the file is well-formed (every section id from the template is present once).

## Completion criteria

- [ ] `docs/ONBOARDING.html` exists and is `approved`
- [ ] The user approved at the Step 3 gate
- [ ] Checks (a)–(e) pass
- [ ] No invented items; every `unknown` is in Open questions

## Transition

Done. Tell the user to re-run after a feature changes setup, structure, or conventions; the file opens directly in a browser.

## Exceptions

- **No README and no kit documents:** proceed from code only; tell the user the guide will be thin.
- **No scripts:** section 3 is `unknown`.
- **Existing `docs/ONBOARDING.html` without the `craft-kit-provenance` meta** (not generated by the kit): never overwrite it. Write to `docs/ONBOARDING.generated.html` instead and say so.
- **Existing `docs/ONBOARDING.md`** (a hand-written Markdown guide): leave it untouched and use it as an input source.
- **No session log:** a single short run, like the docs backfill.
