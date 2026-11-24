---
name: report-kit-issue
description: Use when the user wants to report a problem with the craft-kit workflow itself (its steps, templates, installer or docs), not a bug in their own app. Files a GitHub issue on KhoaLy2003/craft-kit using the kit-issue form. Triggers on "/report-kit-issue", "report a kit bug", "the kit's step is wrong", "craft-kit doesn't do X", "file an issue against the kit".
---

# Report a craft-kit issue

Turn a problem with the craft-kit workflow into a GitHub issue on `KhoaLy2003/craft-kit`, using the `kit-issue` form. Collect the facts from the project yourself. Do not ask the user to explain what you can read.

## Scope check (do first)

- **Kit problem** (a step asks for the wrong thing, a template is missing a section, the installer fails, the docs contradict the steps, a gate does not behave as documented): continue.
- **Problem in the user's own app** (a broken feature, a failing test in their code): stop. Tell the user this is for their project's bug-fix flow (`phase-bug-fix.md`), not the kit repo. Do not file it.
- If it is unclear, ask one question: "Is this about how craft-kit guides the work, or about your app's code?"

## 1. Gather context from the project (read-only)

Read these if they exist. Do not edit anything in the project.

- `.craft-kit-version` → kit version. If missing, the project may be on an old kit or on the lite kit; check for `kit-lite/` or a lite block in `CLAUDE.md`.
- Kit type: `kit-lite/` present → **Lite kit**; `docs/.craft-kit.json` present → **Full kit**; `bin/` or CLI output mentioned → **Installer / CLI**.
- Current workflow and step: the newest `docs/phase-*-session.md`, `docs/bug-session.md`, `docs/maintenance-session.md` or `docs/adopt-session.md` (last entries only), or `docs/NOTES.md` for lite. Take the workflow and step name from there.
- Keep only what the form needs. Do not read the whole docs folder into the report.

## 2. Ask the user for what only they know

Ask in one message, in plain language:

1. What did the kit do, or fail to do?
2. What did you expect?
3. What steps lead to it, and can you reproduce it?

Ask a follow-up only if an answer is missing. Do not ask for the project name or anything that identifies the project.

## 3. Redact before drafting

Remove or replace, in every field:

- Project name, folder names, and absolute paths (use `<project>` and relative paths like `docs/spec.md`).
- Usernames, emails, company or client names, domain names of the user's app.
- Tokens, keys, passwords, URLs with credentials, `.env` values.
- Customer or user data, and any app code that is not needed to show the kit problem.

Keep the kit's own file names, step names, error text and the AI's relevant reply.

## 4. Show the draft and get approval

Show the user the full issue title and body exactly as it will be posted. Ask: "Post this to KhoaLy2003/craft-kit? (yes / edit / cancel)". Posting is public and cannot be fully undone, so do not post without a clear yes. Apply any edits and show the draft again if they change it.

Title: `[Kit] <short claim, under 70 characters>`.

Body: use the form's headings, exactly:

```
### Issue type
### Kit
### Kit version
### Workflow
### Step
### What happened
### What you expected
### Steps to reproduce
### Relevant output (redacted)
### Before submitting
- [x] I searched existing issues and found no duplicate
- [x] I removed project names, paths, emails, tokens and customer data from this report
```

Tick the second checkbox only after you have actually redacted the body.

## 5. Check for duplicates

```
gh issue list --repo KhoaLy2003/craft-kit --state all --search "<two or three distinctive keywords>" --limit 10
```

If a matching open issue exists, show it to the user and offer to add a comment with the new facts instead. Only create a new issue if the user says it is different. Comments follow the same redaction and approval rules.

## 6. File the issue

Write the approved body to a file in the scratchpad directory, then:

```
gh issue create --repo KhoaLy2003/craft-kit --title "<title>" --label kit-issue --label needs-triage --body-file <scratchpad>/kit-issue-body.md
```

Use the `Issue type` value to choose the label: add `bug` for a bug, and `enhancement` for a missing feature. Do not add `ready-for-fix`; only the maintainer sets that.

Report the URL that `gh` prints.

## 7. If `gh` is missing or not logged in

Do not install or log in for the user. Give them the form link instead:

`https://github.com/KhoaLy2003/craft-kit/issues/new?template=kit-issue.yml&title=<url-encoded title>`

Tell them to paste the approved body into the form. Ask them to re-check the redaction first.

## Rules

- Never create, edit or delete files in the user's project for this. This skill only reads and files the issue.
- Never fix the kit or change the kit's code from here. The maintainer does that.
- Never include the user's name, email, or project details in anything beyond the approved issue body.
- Never add labels other than `kit-issue`, `needs-triage`, `bug` and `enhancement`.
