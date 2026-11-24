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

- Kit version: `kit/.craft-kit-version` (full kit) or `kit-lite/.craft-kit-version` (lite kit). If neither exists, the project may be on an old kit; check for a lite block in `CLAUDE.md` or `AGENTS.md`.
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

## 5a. Merge into an existing issue (only when the user asks)

Use this when the user wants the new facts combined into an open issue, not kept as a separate report.

1. Read the issue: `gh issue view <n> --repo KhoaLy2003/craft-kit --json title,body,labels`.
2. Draft the merged body. Keep every form heading. Keep the existing facts unless the user says they are wrong, and add the new facts under the matching heading. If the merged issue is also both a bug and an enhancement, add the matching label (Step 6 rule).
3. Show the current and the merged title, body and labels. Apply the redaction rules (Step 3), then ask: "Update issue #<n> with this? (yes / edit / cancel)".
4. On a yes, write the merged body to a file in the scratchpad directory and run `gh issue edit <n> --repo KhoaLy2003/craft-kit --title "<title>" --body-file <file>`, adding `--add-label` for any new label.
5. Report the issue URL. Edit only the issue the user chose in this run.

## 6. File the issue

Write the approved body to a file in the scratchpad directory, then:

```
gh issue create --repo KhoaLy2003/craft-kit --title "<title>" --label kit-issue --label needs-triage --body-file <scratchpad>/kit-issue-body.md
```

Use the `Issue type` value to choose the label: add `bug` for a bug, and `enhancement` for a missing feature. If one problem is both (for example a crash plus checks the kit should have had), add both labels; the body's `Issue type` stays the main kind. Do not add `ready-for-fix`; only the maintainer sets that.

Report the URL that `gh` prints.

## 6b. Many findings in one report

A report can hold several kit problems, often from an older kit version. Do not file one issue for all of them, and do not file each one separately without a plan:

1. **Re-check each point against the installed kit.** Read the file the point names in the project's kit folder (`kit/`, `kit-lite/`, or `.claude/skills/`). If the installed text already does what the point asks, drop the point and say so. Name the kit version you checked against.
2. **Search for duplicates** for each remaining point (Step 5).
3. **Group related points** that name the same file or step. One group becomes one issue, and its title makes one claim.
4. **Show every draft at once**: title, labels and body for each issue, plus the points dropped and why. Ask for one approval round: "Post these N issues? (yes / edit / cancel), or name any to drop."
5. **File the approved drafts** one at a time with Step 6, each with its own body file. Report every URL at the end.

Every draft follows the same redaction and form-heading rules.

## 7. If `gh` is missing or not logged in

Do not install or log in for the user. Give them the form link instead:

`https://github.com/KhoaLy2003/craft-kit/issues/new?template=kit-issue.yml&title=<url-encoded title>`

Tell them to paste the approved body into the form. Ask them to re-check the redaction first.

## Rules

- Never create, edit or delete files in the user's project for this. This skill only reads and files the issue.
- Never fix the kit or change the kit's code from here. The maintainer does that.
- Never include the user's name, email, or project details in anything beyond the approved issue body.
- Never add labels other than `kit-issue`, `needs-triage`, `bug` and `enhancement`.
- Never edit or close an existing issue except the one the user chose to merge into (Step 5a).
