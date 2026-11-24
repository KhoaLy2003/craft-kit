# Step 1 — Setup

- **Gate**: `hard`
- **Produces**: `docs/BRIEF.md` (Status `approved`), `docs/NOTES.md`
- **Template**: `kit-lite/templates/BRIEF.md`

The user's first message is usually a loose idea. This step turns it into a brief that Step 2 can specify without guessing. Spend the questions here, not in the build.

## Before the questions

Skip this section if `kit-lite/audit/` does not exist or the user installed with `--no-audit`.

1. **Hooks present.** `.claude/settings.json` has three hooks that run `kit-lite/audit/record.js`: `prompt` (UserPromptSubmit), `stop` (Stop) and `end` (SessionEnd). If any is missing, tell the user to run `npx github:KhoaLy2003/craft-kit --lite --force`, which rewrites them. The hooks are not in the kit manifest, so this check is the only proof they exist.
2. **Recorder smoke test.** Run it with the Bash tool (on Windows, Git Bash). Use this exact form and do not wrap it in `cmd /c`:
   `printf '%s' '{"session_id":"smoke000","prompt":"smoke test"}' | node kit-lite/audit/record.js prompt`
   Then check that `docs/audit/` holds a file ending in `-smoke000.md` that contains `## Turn 1`, and delete that file. If it is missing, read `docs/audit/.errors.log`, fix the cause and run the test again. Do not ask the first question until it passes.
3. **Live hooks.** If prompts in this session still write nothing to `docs/audit/`, the hooks are not loaded yet: ask the user to approve them in `/hooks` or to start a new session.

## Do

1. Read the user's message and `docs/` if it exists. Write down, for yourself, what the message already answers and what you would have to guess.
2. Ask about the guesses, **one question per message, no limit on how many**. Build each question on the last answer. Say what the answer changes. When the choices can be named, give two or three, what each trades off, and your pick. Never ask what the message or files already answer.
3. Stop asking only when you can answer every line below without guessing:
   - Who uses it, and what do they do in their first five minutes?
   - Each feature: what it does, and a check that proves it works (by running the app or a test).
   - What is **not** in this build (out of scope), and what is parked for later.
   - Stack, and the commands to install, run and test it.
   - Does data persist? Where, and what is kept?
   - Look and platform, in one line (UI projects only).
   - Edge cases and failure cases the user already cares about (empty input, no network, bad data).
4. Write `docs/BRIEF.md` from the template. 3 to 8 features, in build order, each small enough for one commit. Create `docs/` if needed. Use the user's words for the goal and the features. Anything you filled in yourself goes under `## Assumptions`, each with your reason, so the user can reject it.
5. Show the brief. It is the playback of what you understood. Ask what is wrong or missing. Apply changes, and go back to questions if a change opens a new gap. Do this until the user approves explicitly.
6. On approval set the brief's Status to `approved` and create `docs/NOTES.md` from `kit-lite/templates/NOTES.md` (Status `Step 2 Spec — not started`, Next action `Draft docs/SPEC.md from the brief`). Run the checkpoint in `START.md` → Context; Setup is a recommended seam for a new session.

## Rules

- Keep the brief to about one page. No market research, personas, roadmap, risk list or architecture document.
- Split any feature that is not small. Anything the user wants but does not need on day one goes under "Later".
- More than 8 features, multiple users, or a real backend with persisted user data: warn once that this is beyond lite (see `START.md`).
- Do not write code, scaffold, or install anything in this step.

## Done when

`docs/BRIEF.md` is approved by the user, it has no open guesses outside `## Assumptions`, and `docs/NOTES.md` exists.
