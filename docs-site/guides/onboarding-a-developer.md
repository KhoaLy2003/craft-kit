# Onboarding a New Developer

Use this when a developer is joining the project. The AI reads your README, config and planning documents, drafts a guide for the newcomer, you review it, and it writes one self-contained web page: `docs/ONBOARDING.html`.

It works with or without the rest of the kit. It is experimental: not yet validated in a test round. You can run it again at any time to refresh the page.

---

## Starting

Run it from the project root:

```text
Run developer onboarding using kit/phase-onboarding.md.
```

Have ready the things a newcomer must **request** and the code cannot tell: access, accounts, who to ask. One answer for the whole list is fine.

---

## The Four Steps

| Step | What the AI does | Your part |
|---|---|---|
| 1. Gather | Lists the files it will read (README, package and lock files, Makefile, Docker and CI config, `.env.example`, planning documents). In a monorepo it asks which app to cover | Check the list |
| 2. Draft | Writes every section in chat, labelling each fact by where it came from | Nothing |
| 3. Review | Shows each item it could not confirm and each place where the code and the docs disagree | **Decide each item** (hard gate): keep, correct, drop, or mark unknown |
| 4. Write & verify | Writes `docs/ONBOARDING.html`, then checks that every command and link in it is real | Nothing |

---

## The Decision That Matters: the Review

The AI never guesses. Each fact carries a label:

| Label | Means |
|---|---|
| `from-docs` | a kit document or the README says so |
| `from-code` | found in config or scripts |
| `from-previous` | carried over from an earlier version of the page |
| `unknown` | the AI could not determine it |

At the gate you answer per item, or in bulk ("keep all, correct 3 and 7"). The AI repeats back what each bulk answer means before it writes anything. Where the code and the docs disagree, **only your answer resolves it**; the AI does not pick a side.

---

## What You Get

One file, `docs/ONBOARDING.html`:

- opens in any browser, with no build step and no network
- light and dark mode, side navigation, and print support
- commands copied word for word from your scripts
- environment variable **names** only. Values are never read into the page or the chat
- anything still unknown is listed in an "Open questions" section for the newcomer to ask about

Nothing else in `docs/` is changed.

---

## Keeping It Fresh

Nothing refreshes the page automatically. Run the same prompt and choose **refresh** when:

- a feature changed the setup, structure or conventions, or
- before each new developer starts.

A refresh re-reads the sources and the existing page, keeps your earlier answers (and asks before replacing any hand edits), and asks only about what is new or changed.

---

## When Something Goes Wrong

- **There is no README and no kit documents.** It works from the code alone and tells you the guide will be thin.
- **There are no scripts.** The setup section is marked unknown.
- **A hand-written `ONBOARDING.html` already exists** (not made by the kit). It is never overwritten. The new page is written to `docs/ONBOARDING.generated.html`.
- **A hand-written `ONBOARDING.md` exists.** It is left alone and used as a source.

---

## Reference

The file the AI follows, shown in full: [Developer Onboarding](/phases/onboarding).
