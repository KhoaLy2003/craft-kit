# Lite Kit — Small Personal Projects

The full kit is built for products that will be used and maintained: eight planning steps, a seven-step build cycle, and a dozen documents. For a practice project, a weekend tool or a script, that is more paper than code. The **lite kit** is a separate, much smaller workflow for that case: six short steps, each ending at your approval, about five documents.

It is installed separately and never touches the full kit.

| | Lite kit | Full kit |
|---|---|---|
| Use it for | Small personal or practice projects, up to about 8 features | Products with real users, data and standards |
| Steps | 6 (Setup, Spec, Plan, Build, Verify, Ship) | Phase 1 (8 steps), Phase 2 (7 steps), plus maintenance workflows |
| Hard gates | Every step | Several per phase |
| Documents | `docs/BRIEF.md`, `docs/SPEC.md`, `docs/PLAN.md` (temporary), `docs/NOTES.md`, `README.md` | The full `docs/` set |
| Installed into | `kit-lite/` | `kit/` |

If a project grows past lite (several users, a backend with real data, more than about 8 features), switch to the full kit in a new project folder. The lite workflow tells the AI to say so.

---

## Install

Run this from the project folder (the project root):

```bash
npx github:KhoaLy2003/craft-kit --lite
```

The kit lands in `kit-lite/`, directly under the folder you ran it in. A target that is nested deeper, or `.`, is rejected before anything is written, because the wiring files below live in the project root.

Besides copying the kit, the installer writes these into the project:

| Path | What it is |
|---|---|
| `CLAUDE.md` (and `AGENTS.md` if it already exists) | A marked `## Workflow (craft-kit-lite)` block. It makes the AI read `kit-lite/START.md` when you say "I want to build ...", so you never have to name the file |
| `.claude/settings.json` | Three Claude Code hooks that record the conversation (see [Conversation audit](#conversation-audit)) |
| `.gitignore` | A `docs/audit/` entry, so the recordings stay out of git |
| `kit-lite/.craft-kit-version`, `kit-lite/.craft-kit-manifest.json` | Installed version and file list, used by `--force` upgrades |
| `.claude/skills/report-kit-issue/SKILL.md`, `.craft-kit-skills.json` | The kit's own `/report-kit-issue` skill, and the list of skill files it wrote (used by `--force`). Written only when the install folder sits directly in the folder you ran the command from |

Every write is idempotent and touches only its own marked block or entries. Your own text in `CLAUDE.md`, other hooks and other settings in `.claude/settings.json`, and existing `.gitignore` lines are kept.

| Option | Effect |
|---|---|
| `--force` | Update an existing lite install. Files the new version no longer ships are removed; files you added are not |
| `--no-hook` | Do not write the workflow block. Start with `Start using kit-lite/START.md.` instead. The AI is then not asked for audit tags either, so each reply is recorded as `Tag: (missing)` |
| `--no-audit` | Do not write the hooks or the `.gitignore` entry. The workflow block is still written, without the audit instruction |
| `--skip-setup` | Not needed: the lite install never prompts for skills. For a UI project the installer prints the `design-taste-frontend` install command; it is optional |

The installer prints no skill prompts and makes no network calls for lite.

---

## Using it

Found a problem with the kit itself (a step that is wrong, an installer failure)? Type `/report-kit-issue` in Claude Code. The skill checks the problem is about the kit, redacts your project details, shows you the issue, and files it only after you approve. Problems in your own app do not go there.

Open your AI tool in the project folder and describe what you want:

```text
I want to build a habit tracker that runs in the terminal.
```

Or, without the workflow block: `Start using kit-lite/START.md.`

`START.md` checks the project and picks the first match:

1. **Resume.** `docs/NOTES.md` exists and its status is not `complete`. The AI says where it is resuming, reads the brief, spec, plan and notes, and continues from the **Next action** line. Nothing already answered is asked again.
2. **Change to a finished project.** `docs/NOTES.md` is `complete`. A new feature is added to the brief and goes through Steps 2 to 6 for that feature alone; a bug is reproduced with a failing test, fixed, run, and committed.
3. **New project.** No `docs/NOTES.md` yet: Step 1 starts (or resumes, if a draft brief exists).

### The six steps

| # | Step | Gate | What happens | Produces |
|---|---|---|---|---|
| 1 | Setup | **hard** | The AI turns your loose idea into a clear brief. It asks one question per message, with **no limit on how many**, until nothing important is a guess: who uses it, what each feature must prove, what is out of scope, stack and commands, data, look, edge cases. It shows the brief as a playback and waits for approval | `docs/BRIEF.md` (approved), `docs/NOTES.md` |
| 2 | Spec | **hard** | A subagent drafts 3 to 6 checkable acceptance criteria per feature; you approve the contract | `docs/SPEC.md` |
| 3 | Plan | **hard** | A subagent drafts one-line tasks in dependency order, each tied to criteria; you approve | `docs/PLAN.md` |
| 4 | Build | **hard** | On `feature/<slug>`, subagents implement the tasks (failing test first for core logic, a real run of each task), one commit per feature. A separate fresh subagent reviews the diff against the spec; gaps and serious findings are fixed | Working code, reviewed |
| 5 | Verify | **hard** | A subagent runs the tests and walks every criterion through the real app and marks it PASS, FAIL or BLOCKED. Then you try the app yourself and approve | Statuses in `docs/SPEC.md` |
| 6 | Ship | **hard** | README from commands that were actually run, notes closed, plan deleted. You choose: merge, open a PR, or leave the branch | `README.md`, final `docs/NOTES.md` |

`hard` stops until you say yes. **No code is written before the brief, spec and plan are approved.**

### Keeping the context small

One session cannot carry six steps. At each gate the AI decides what fits:

- **Subagent** for work that needs no answers from you and reads and writes files: drafting the spec and plan, implementing, reviewing, verifying. The main session keeps only the summary, and the reviewer is independent of the author.
- **New session** for long exchanges or when the session is full of material the next step does not need. The AI recommends it after Setup and after Build, or when three steps have run in one session. You paste one line, `Resume craft-kit lite: read kit-lite/START.md.`; `docs/NOTES.md` carries the state, with no handover file.

Where your AI tool has no subagents, those offers become new-session offers.

### Rules the AI follows

- **Done means run.** A task is done only when its tests pass and the app or CLI was started and the changed path used. The AI reports what it ran and saw. A test it cannot run (no credentials, missing service) goes under *Open issues*, never "passing".
- **Tests for core logic only:** calculations, data handling, parsing, APIs. Not for layout, config or glue.
- **One commit per feature**, `feat:` / `fix:` / `chore:`, on `feature/<slug>`.
- **Few documents.** No logs, roadmaps or per-screen design docs.
- **Your rules first.** Instructions you give in your own settings or in a message override a kit rule where they conflict. The AI says which rule it set aside and notes it in `docs/NOTES.md`.
- **No re-asking.** It reads `docs/` before asking you anything.

### Documents

- **`docs/BRIEF.md`** — about one page: goal, users, stack, commands, data, one-line visual direction, the feature table in build order (each with a "done when"), edge cases, *Later*, *Out of scope* and *Assumptions*.
- **`docs/SPEC.md`** — acceptance criteria per feature, with a Status column filled in at Verify.
- **`docs/PLAN.md`** — task list for the build; deleted at Ship.
- **`docs/NOTES.md`** — resume state, not a log: status, one specific next action, the task checklist, decisions a later session would otherwise re-ask, and open issues. It is rewritten, not appended, and stays under about 40 lines.

Resuming after a break needs nothing from you beyond opening a new session in the same folder and saying what you want, or `Start using kit-lite/START.md.`.

---

## Conversation audit

For a learning project it helps to look back at what you asked and what the AI answered. With the audit on, Claude Code hooks run a small recorder (`kit-lite/audit/record.js`) at three moments:

| Hook | Records |
|---|---|
| `UserPromptSubmit` | Your prompt |
| `Stop` | The AI's final reply for the turn, with a one-line tag it was asked to end with: `[audit] step=<1-6> gate=<none\|soft\|hard> kind=<one word>` |
| `SessionEnd` | Turn count and how many replies had no tag |

Output goes to `docs/audit/<date>-<session>.md`, one file per session, git-ignored. Both sides are stored quoted, so pasted text or code in a prompt or reply can never look like a new record. Only the last line of a reply counts as the tag.

- **Claude Code only.** Other tools get the workflow block but no recording.
- **Never blocks the conversation.** The recorder always exits 0. If it cannot record, it notes why in `docs/audit/.errors.log` rather than failing silently.
- **Works the same on every shell.** The hooks use Claude Code's exec form (`node` plus an argument list with `${CLAUDE_PROJECT_DIR}`), so they behave the same under bash, Git Bash and PowerShell. Claude Code substitutes the placeholder itself.
- **Invalid `.claude/settings.json`.** If the file is not valid JSON, it is left untouched, the hooks are skipped, and the AI is **not** asked for audit tags (they would be recorded nowhere). Fix the file and re-run `npx github:KhoaLy2003/craft-kit --lite --force`.
- **Checked at Setup.** Step 1 checks the three hooks and smoke-tests the recorder before any question. Run that check from Git Bash on Windows; quoting with `cmd /c` breaks it.
- **Kept, not shipped.** Ship neither commits nor deletes `docs/audit/`. The files stay on your machine.
- **Any project type.** The recorder ships with its own `package.json` (`"type": "commonjs"`), so it also works in a project whose `package.json` sets `"type": "module"`, such as a Vite app.

---

## One project, one kit

A project uses either the lite kit or the full kit, not both.

- `--lite` is refused in a project that already has the full kit. The full install is refused where the lite kit is installed.
- `--force` does **not** override this. It only updates the same kit.
- The error names what it found (for example `kit/` or `docs/.craft-kit.json` for the full kit, the `craft-kit-lite` block in `CLAUDE.md` for lite) and how to switch.
- Detection looks only at kit-specific signals in the project root, so other projects in a shared parent folder never block an install.

To move a project from lite to full, start a new project folder, or remove the lite kit first (its folder, the `craft-kit-lite` block in `CLAUDE.md` / `AGENTS.md`, and its hooks), then follow [Getting Started](/getting-started). For code that already exists without kit documents, use [Adopt](/guides/existing-projects) with the full kit.

---

## Updating

The lite kit ships in the same release as the full kit, with the same version number, but is installed and updated independently:

```bash
npx github:KhoaLy2003/craft-kit --lite --force
```

A normal install or `--force` never touches `kit-lite/`, and `--lite` never touches `kit/`. Changes to the lite kit are listed in the [Changelog](/changelog).

---

## Not for production work

The lite kit gives up the Phase 1 document set, design gates, formal end-to-end test documents, and change control in exchange for speed. If the project needs several users, a backend with real data, more than about 8 features, or production standards, use the [full kit](/getting-started) instead. The lite workflow warns once when a project goes past that point and continues only if you insist.

The lite kit's step files are not part of this site. Read them in the repository: [`kit-lite/`](https://github.com/KhoaLy2003/craft-kit/tree/main/kit-lite).
