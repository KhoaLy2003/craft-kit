# Developer Onboarding — create docs/ONBOARDING.html for a developer joining the project

> **Status: experimental — not yet validated in a test round.**
>
> **Use on demand**, for any project (built with the kit or not) when a new developer or engineer is joining. Re-run to refresh.
>
> Output: `docs/ONBOARDING.html`, a single self-contained page (no build step, no network; opens in any browser, light and dark mode, side navigation, printable). Derived from the project's docs and code, reviewed by you, and marked `approved`. Nothing else in `docs/` is touched.

Universal rules (banner, gates, PROJECT_ROOT, fail-fast writes, file verification) are in `kit/orchestrator-conventions.md`.

## How it is created and updated

- **Created:** you run this workflow once. The AI reads the README, config, and kit documents, drafts every section with each fact labelled, you review at the hard gate, and the AI writes `docs/ONBOARDING.html` from `templates/onboarding.html`.
- **Updated:** the file is regenerated, never hand-patched. Re-run the same prompt; Step 1 offers "refresh". A refresh reads the current sources again **and** the existing `docs/ONBOARDING.html`, so answers you gave before (access to request, corrected facts) are carried over and only changed or new items are put to you again. You may also edit the file by hand; a refresh treats your edits as previous answers and asks before replacing any of them.
- **When to refresh:** after a Phase 2 feature ships that changes setup, structure, or conventions, and before each new developer starts. Nothing triggers it automatically.

## Limitations (read before running)

- **Derived from existing docs and code.** Missing kit documents do not block the run; the affected sections come from code or the README, or are `unknown`.
- **Nothing is invented.** Commands are copied verbatim from scripts, never reconstructed. Undeterminable items are `unknown`.
- **Code beats docs.** When a script or config conflicts with a document, the conflict is reported to you, never silently resolved.
- **Secrets stay out.** `.env*` files are read only for variable names; values never appear in chat or in the file.

## How to start

Send this to your AI, from the project root:

```text
Run developer onboarding using kit/phase-onboarding.md.
```

What happens next: the AI lists the sources it will read, drafts the guide with every fact labelled, and shows you every unknown item and conflict. You decide per item: keep, correct, drop, or mark unknown. Nothing is written until you approve.

What to have ready: answers about access and accounts a new developer must request, since code cannot tell the AI that. You can answer for the whole list at once.

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
3. Missing kit documents do not block: the affected section is filled from code or the README, or marked `unknown`.
4. Monorepo: ask the user which app or package to cover.

## Step 2 — Draft

One read-only general-purpose agent dispatch. It carries `PROJECT_ROOT`, writes no files, and returns the content of every section of `templates/onboarding.html` in chat (plain text, not HTML).

Label every fact:

| Label | Meaning |
|---|---|
| `from-docs` | a kit document or the README says so |
| `from-code` | found in config or scripts |
| `from-previous` | carried over from the existing `ONBOARDING.html` (refresh only) and not contradicted by current code or docs |
| `unknown` | not determinable |

Rules:
- Nothing is invented.
- Commands are copied verbatim from scripts, never reconstructed.
- `.env*` files are read only for variable names.
- On a conflict between code and docs, code wins and the conflict is listed separately. A `from-previous` item contradicted by current code or docs is also a conflict.

## Step 3 — Review (hard gate)

Present the filled-in draft, then every `unknown` item and every conflict. Ask per item: **keep / correct / drop / mark unknown**.

Rules:
- Bulk answers are allowed; echo the per-item meaning back before writing.
- A conflict is resolved only by the user's answer.

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

Done. Tell the user to re-run this workflow after Phase 2 ships a feature that changes setup, structure, or conventions, and that they can open the file directly in a browser.

## Exceptions

- **No README and no kit documents:** proceed from code only; most sections will be `unknown`. Tell the user the guide will be thin.
- **Project not runnable** (no scripts): section 3 is `unknown`.
- **Existing `docs/ONBOARDING.html` without the `craft-kit-provenance` meta** (not generated by the kit): never overwrite it. Write to `docs/ONBOARDING.generated.html` instead and say so.
- **Existing `docs/ONBOARDING.md`** (a hand-written Markdown guide): leave it untouched and use it as an input source.
- **No session log:** a single short run, like the docs backfill.
