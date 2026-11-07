// Plain-language summary shown above each workflow page. The page body is the kit's own
// instruction file for the AI, so this is the part a person reads first.
// Keep facts here to what the workflow file's header and step table already say.

export type Summary = {
  when?: string     // workflow: when to run it
  prompt?: string   // workflow: what to send the AI
  does?: string     // step: what the step does (marks a step summary)
  check?: string[]  // step with a hard gate: what to verify before approving
  you: string[]     // what you decide or do
  produces: string  // what exists afterwards
  experimental?: boolean
}

const module_ = (when: string, produces: string, prompt: string, you: string[], experimental = false): Summary => ({
  when: `${when} Normally started for you by [Project Upgrade](/phases/upgrade).`,
  prompt, you, produces, experimental,
})

const WORKFLOWS: Record<string, Summary> = {
  'start': {
    when: 'You are not sure which workflow fits, or you are coming back to a project.',
    prompt: 'Start using kit/START.md.',
    you: ['Answer up to three short questions.'],
    produces: 'Nothing is written. It prints the workflow to run and the exact prompt for it, or the prompt to resume an unfinished one.',
  },
  'phases/phase-1': {
    when: 'A new product, once per project: from idea to a ready-to-code codebase.',
    prompt: "Start Phase 1 using the kickoff form I've shared.",
    you: [
      'Fill in `docs/phase-1-kickoff.md` and supply `docs/DESIGN.md` first.',
      'Approve at four hard gates: Prototype & Design (Step 3), Roadmap (4), Full Screen Design (5) and Architecture (6).',
    ],
    produces: 'The planning documents in `docs/`, a scaffolded app with no features yet, one commit, and the prompt that starts Phase 2.',
  },
  'phases/phase-2': {
    when: 'Phase 1 (or Adopt) is done and you want features built.',
    prompt: 'Run Phase 2 using kit/phase-2.md.',
    you: ['Approve the spec (Step 1).', 'Walk through the running app and confirm (Step 6).', 'Review and merge the pull request yourself.'],
    produces: 'Specs and plans in `docs/specs/`, `docs/E2E-TESTS.md`, and code on a `feature/<slug>` branch opened as one pull request. The AI never merges.',
  },
  'phases/bug-fix': {
    when: 'Something you already shipped is broken.',
    prompt: 'Run the bug fix workflow using kit/phase-bug-fix.md. The problem is: [what is wrong and where].',
    you: ['Approve the diagnosis and the list of files it may change (Assess).', 'Confirm the fix yourself when the symptom is only visible in the UI.'],
    produces: '`docs/specs/bugs/<bug-slug>/assess.md`, and a fix on `fix/<bug-slug>` opened as a pull request.',
    experimental: true,
  },
  'phases/phase-maintenance': {
    when: 'A release has shipped and you want to add a feature or fix a bug. Runs again for every feature.',
    prompt: 'Run Maintenance using kit/phase-maintenance.md.',
    you: ['Say whether you want to add a feature or fix a bug.', 'For a feature: describe it and approve the intake and fit check.'],
    produces: 'For a feature: `docs/specs/<feature-slug>/intake.md`, a release and feature in `docs/backlog.json` and `docs/roadmap.md`, and the Phase 2 prompt. For a bug: the bug-fix prompt. No feature code.',
    experimental: true,
  },
  'guides/admin-site': {
    when: 'Phase 2 has shipped and the app needs an administrator site.',
    prompt: 'Run Maintenance using kit/phase-maintenance.md.',
    you: ['Edit and approve the module list (Scope) at Maintenance intake.', 'Sign in as each role and walk through the modules before Ship.'],
    produces: 'the agreed admin scope in the feature\'s `intake.md`, then the `Admin Shell` and module features built through Phase 2.',
    experimental: true,
  },
  'phases/adopt': {
    when: 'You have a codebase and no kit documents. Run once per repository.',
    prompt: 'Run Adopt using kit/phase-adopt.md.',
    you: ['Approve three decisions: the architecture as it is, the coding rules, and the baseline feature list.'],
    produces: 'The planning documents Phase 2 needs, written from your code. Your source code is never modified; the documents arrive as a pull request from `chore/adopt-craftkit`.',
    experimental: true,
  },
  'phases/upgrade': {
    when: 'The project was built on an older kit version, or lacks documents the current kit expects.',
    prompt: 'Run the project upgrade using kit/phase-upgrade.md.',
    you: ['Choose which of the detected modules to run.', 'Review each module at its own gate.'],
    produces: 'The missing documents, and `docs/.craft-kit.json` recording the kit version.',
  },
  'phases/docs-backfill': module_(
    '`docs/data-model.md` or `docs/flows.md` is missing.',
    '`docs/data-model.md` and `docs/flows.md`, reverse-engineered from the code.',
    'Run the docs backfill using kit/phase-docs-backfill.md.',
    ['Decide each item the AI could not confirm.', 'Approve the write.']),
  'phases/api-backfill': module_(
    'The project exposes an API and has no `docs/api.md`.',
    '`docs/api.md`, reverse-engineered from the code.',
    'Run the API backfill using kit/phase-api-backfill.md.',
    ['Decide each item the AI could not confirm.', 'Approve the write.'], true),
  'phases/test-accounts-backfill': module_(
    'Test credentials exist (for example in `.env`) but there is no `.test-accounts.json`.',
    'A git-ignored `.test-accounts.json`, each account checked by sign-in where possible.',
    'Run the test accounts backfill using kit/phase-test-accounts-backfill.md.',
    ['Review the accounts it found and any it could not record.']),
  'phases/verification-backfill': module_(
    'The constitution has no `## Verification Commands` section.',
    'A Verification Commands table in `docs/constitution.md`, copied from your scripts and CI config.',
    'Run the verification backfill using kit/phase-verification-backfill.md.',
    ['Review the table; commands with no source are marked `unknown`.'], true),
  'phases/log-collapse': module_(
    '`docs/phase-2-session.md` or `docs/E2E-TESTS.md` still holds the full text of shipped features.',
    'Shipped units moved unchanged to `docs/archive/`, with a short stub left behind. Nothing is deleted.',
    'Run the log collapse using kit/phase-log-collapse.md.',
    ['Collapse all shipped units, or name any to skip.'], true),
  'phases/onboarding': {
    when: 'A developer is joining the project. Works with or without the kit; re-run to refresh.',
    prompt: 'Run developer onboarding using kit/phase-onboarding.md.',
    you: ['Keep, correct, drop or mark unknown each doubtful item and each conflict between code and docs (one hard gate).'],
    produces: '`docs/ONBOARDING.html`: one self-contained page with light and dark mode, side navigation and print support.',
    experimental: true,
  },
}

import { STEPS } from "./step-summaries"
export const SUMMARIES: Record<string, Summary> = { ...WORKFLOWS, ...STEPS }
