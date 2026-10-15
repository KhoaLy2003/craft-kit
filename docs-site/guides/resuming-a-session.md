# Resuming in a New Session

Long workflows can outgrow one conversation. When that happens, the AI saves what it knows to a file and you continue in a fresh conversation without losing progress.

> **Status: experimental.** The handover mechanism has not been validated in a test round.

---

## When the AI Offers a Handover

At certain safe points, the AI stops and offers you the choice:

> **Session checkpoint.** Step [N] is complete and nothing is mid-flight. Say **"hand over"** to pause here and continue in a new session, or anything else to proceed to Step [N+1].

The offer only appears where nothing is half-finished, so it is always safe to accept.

You can also ask at any time, in any step: say **"hand over"** or **"new session"**. The AI then saves its state as soon as it can. If code is half-written, it first commits the complete parts and sets the rest aside, so the saved state is consistent.

---

## What the AI Saves

The AI writes one file, `docs/handover.md`. It records:

- which workflow, project, and step you are in
- which artifacts exist, such as the spec, plan, or diagnosis
- what was half-done when you paused, and what the next action is
- any decisions that were made in conversation but not yet written down

If the work is in code, the AI commits it to the current branch before it saves, so nothing sits only in your working folder.

---

## Resuming

Open a new conversation in your project folder and paste the **Resumption Prompt** that the AI wrote into `docs/handover.md` as the first message. It is the last section of that file and is already filled in with your phase, project, and the step to resume. Its template is in [Session Handover](/guides/session-handover#resumption-prompt).

The AI then:

1. Reads the whole handover file.
2. Checks that every artifact it lists exists. If one is missing, it stops and tells you.
3. Marks the paused step as in progress in the session log.
4. Continues from the next action.

Once the step is in progress, the AI deletes `docs/handover.md`. The session log is the record; the handover file was only a bridge.

---

## Things to Know

- **Completed steps are not repeated.** The session log decides what is done, and the AI does not re-run a step it has marked complete.
- **One handover at a time.** A new handover overwrites the previous `docs/handover.md`.
- **If the AI cannot find a file it expects,** tell it. Do not recreate the file by hand; ask the AI to check which artifacts are really on disk.
