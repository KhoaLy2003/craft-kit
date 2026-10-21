# Glossary

Terms used across the kit, in plain words.

## Feature priority (MoSCoW)

The Roadmap step sorts every feature into one of four buckets.

| Term | Meaning |
|---|---|
| **Must** | The product is not usable or not worth releasing without it. Phase 2 builds these first. |
| **Should** | Important and expected, but the first release can ship without it if time runs out. |
| **Could** | Nice to have; built only if there is room. |
| **Won't** | Agreed not to build now. Listed so the decision is visible and can be revisited. |

## Gates

A gate is a point where the AI reports what it did before it moves on.

| Gate | Behavior |
|---|---|
| `none` | The AI continues on its own. |
| `soft` | The AI shows a short summary and continues unless you ask for changes. |
| `hard` | The AI stops and waits until you explicitly approve. |

## Phase 2 scope

Chosen once, at the Phase 1 Roadmap gate, and recorded in `docs/roadmap.md`.

| Value | Meaning |
|---|---|
| `all` | Every Must feature is built in one Phase 2 cycle. For small apps; validated in test rounds. |
| `feature` | One feature per cycle, repeated in build order. For larger or multi-domain products; experimental. |

## Domain

A product area that needs a different specialist skill set, or a separate deployable concern. A typical web app with a UI and an API is **one** domain; a web app plus a mobile app plus a machine-learning pipeline is three. A second domain holding a large share of the work is the signal to use scope `feature`.

## Handover vs. handoff

- **Handoff** is the planned move from Phase 1 to Phase 2: the AI ends Phase 1 and gives you a prompt that starts Phase 2 in a new conversation, reading the planning documents in `docs/`.
- **Handover** is pausing in the middle of any workflow: the AI saves its state to `docs/handover.md` and you resume in a new conversation. See [Resuming in a New Session](/guides/resuming-a-session).

## Seam

A natural stopping point where nothing is half-finished and all state is on disk, such as the end of a step. The AI offers a handover at seams. See [Session Handover](/guides/session-handover).

## Shell checkpoint

A mandatory check in the Admin Site workflow, made before any module is built: the admin shell (sign-in, role-filtered menu, access rules, an example module, and audit logging) is verified against the running app so modules are built on a working base. See [Admin Site Workflow](/phases/admin).

## Constitution

A short list of coding rules the AI follows for the whole project, written in Phase 1 Step 7.

## Verification Commands

A table in the constitution listing the exact commands that install, build, lint, typecheck, test and start the project. Review, E2E and Ship run them; a command that cannot be determined is marked `unknown` and reported to you, never skipped silently. Together with the baseline, review and pre-ship runs, this is the Definition of Done.

## Non-functional requirements (NFR)

Qualities the product must have regardless of features: security, performance, accessibility, language support, availability, compliance. Phase 1 Step 4 records them in one combined question, each with a measurable target (or `n/a` with a reason), and later steps trace them to the architecture, the constitution, review and tests.

## Adopt

A run-once workflow that brings an existing codebase into the kit by reading the code and writing the planning documents, with you approving the decisions. See [Adopt](/phases/adopt).

## Kit version record

`docs/.craft-kit.json`, committed with your documents, says which kit version produced them. Workflows warn when it differs from the installed kit and never block.
