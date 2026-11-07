// Plain-language summary shown above each step page. Facts come from the step file's
// Overview and gate summary. Merged into SUMMARIES in summaries.ts.
import type { Summary } from './summaries'

const step = (does: string, you: string[], produces: string, check?: string[]): Summary =>
  ({ does, you, produces, check })

export const STEPS: Record<string, Summary> = {
  'phases/steps/p1-01-ideation': step(
    'Asks short questions about the problem, who has it, what they use today and what is out of scope, then writes the idea brief. With a requirements document it reads that first and asks only about gaps and conflicts.',
    ['Answer the questions.', 'Say whether to run Market Research (Step 2) if the kickoff form left it blank.', 'Say what is wrong with the written brief; otherwise it continues.'],
    '`docs/idea-brief.md`, and your kickoff form moved to `docs/phase-1-kickoff.md`.'),
  'phases/steps/p1-02-market-research': step(
    'Looks at similar products and trends, and lists reasons the idea might fail and features worth borrowing. Optional.',
    ['Read the findings, then say **proceed**, **pivot** or **stop**. Silence means proceed.'],
    '`docs/market-notes.md`. A pivot or a stop halts Phase 1.'),
  'phases/steps/p1-03-prototype-design': step(
    'Writes a journey map and a prototype brief, checks your `DESIGN.md`, and builds a clickable HTML prototype that uses it.',
    ['Provide `docs/DESIGN.md` (the step waits for it).', 'Open the prototype and approve it, or say what to change.'],
    '`docs/prototype/`, `docs/DESIGN.md` (yours, unchanged) and `docs/preview/` with the prototype.',
    ['The main flow works from start to finish.', 'Empty, error and success states look right, not only the happy path.', 'The look matches your `DESIGN.md`.', 'The prototype is disposable: it proves the idea, not the architecture.']),
  'phases/steps/p1-04-roadmap': step(
    "Sorts features into Must, Should, Could and Won't, sets the build order, and recommends how Phase 2 will run.",
    ['Move features between tiers and cut or keep each one.', 'Answer whether you will need an admin site (`yes`, `no` or `later`).', 'Approve the feature list and the Phase 2 scope (`all` or `feature`).'],
    '`docs/roadmap.md`, `docs/backlog.json` and `docs/backlog.html`.',
    ['Every Must feature is something the first release really needs.', "Anything deferred or marked Won't is on the list on purpose.", 'The recommended scope fits your team and the size of the Must list.']),
  'phases/steps/p1-05-screen-design': step(
    'Lists every screen for the Must and Should features, writes a brief for each, and prints one message for your designer.',
    ['Send the message to your designer, or declare the screens skipped to build from `DESIGN.md` and the prototype.', 'Put the returned designs in place (files or a design tool), then approve the whole set.'],
    '`docs/specs/<feature>/screens/` briefs and `docs/designs/`. The step is skipped when designs already exist or every feature has one simple screen.',
    ['Every screen of every feature is covered. One sign-off covers all features.', 'Changing a design after this point means re-opening the step.']),
  'phases/steps/p1-06-architecture': step(
    'Recommends a tech stack with reasons, then writes the architecture, the data model and the screen and data flows.',
    ['Review the recommendation and confirm the stack **by name**, for example "Next.js + Supabase". A bare "continue" does not count.'],
    '`docs/architecture.md`, `docs/data-model.md` and `docs/flows.md`.',
    ['The stack fits the roadmap, your skills and your budget.', 'The reasons name what was deliberately not chosen.', 'Changing the stack once features are built discards that work.']),
  'phases/steps/p1-07-constitution': step(
    'Writes the coding rules every later step must follow, and the commands that prove the code builds and passes.',
    ['Read the summary. It continues unless you object. Accepting the defaults at Step 6 skips this review.'],
    '`docs/constitution.md`, with a Verification Commands table the scaffold step will run.'),
  'phases/steps/p1-08-scaffold': step(
    'Checks your tools, builds a runnable skeleton with no features, fills in environment settings, and makes the single Phase 1 commit.',
    ['Install any missing tool it names.', 'If the project needs services, create the accounts and fill in `.env` as `ENV_SETUP.md` explains.'],
    'A runnable app with no features, `AGENTS.md`, and one commit. Nothing is pushed. It ends by printing the prompt that starts Phase 2.'),

  'phases/steps/p2-01-spec': step(
    'Writes what the feature must do: acceptance criteria, validation, errors and edge cases.',
    ['Answer questions about anything ambiguous.', 'Approve the spec, or say what to change. Nothing is built until you do.'],
    '`docs/specs/<feature>/spec.md`, or one `docs/specs/spec.md` with a section per feature when the scope is `all`.',
    ['Each criterion says what you would actually see when it works.', 'Errors and edge cases are covered, not only the happy path.', 'A wrong assumption here carries into every later step.']),
  'phases/steps/p2-02-plan': step(
    'Splits the work into ordered tasks, assigns a specialist to each, and marks which can run in parallel.',
    [],
    '`docs/specs/<feature>/plan.md` (or `docs/specs/plan.md` for scope `all`). You see a summary and can object.'),
  'phases/steps/p2-03-implement': step(
    'Builds the plan on a new `feature/<slug>` branch, never on `main`, with each task sent to its specialist.',
    [],
    'Code on the feature branch, uncommitted until Ship.'),
  'phases/steps/p2-04-review': step(
    'Checks every acceptance criterion has matching code, reviews the whole change for quality, security and the constitution, and fixes what it finds.',
    [],
    'Fixes on the branch. It moves on only when no important finding is open and no criterion is without code.'),
  'phases/steps/p2-05-e2e': step(
    'Writes and runs end-to-end tests through the real interface (browser, API, command line or mobile) with real data.',
    ['Provide any test accounts or services it asks for. Passwords go in your git-ignored `.env`, never in a committed document.'],
    '`docs/E2E-TESTS.md` and run evidence in `docs/e2e-runs/`. You get a summary: how many criteria passed, what failed and was fixed.'),
  'phases/steps/p2-06-manual-check': step(
    'Hands you the running app. This is the only step with no AI work: you use it the way your target user would.',
    ['Walk the app from first open through every feature, in the order a real user would.', 'Say what matches and what does not, in your own words. Approve shipping only when you are satisfied.'],
    'Your approval. No file is written. Failures go back to be fixed on the same branch.',
    ['Anything that feels wrong, even though every test passed.', 'How the features work together, not only each on its own.', 'This is the last check before the code ships.']),
  'phases/steps/p2-07-ship': step(
    'Commits, pushes the branch and opens one pull request with a structured description, then records the feature as shipped.',
    ['Confirm the git remote when asked.', 'Review and merge the pull request yourself. The AI never merges.'],
    'A pushed branch, a pull request, and the feature marked `shipped` in `docs/backlog.json`. With no remote it commits locally and tells you how to publish.'),
}
