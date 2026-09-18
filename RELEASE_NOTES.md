<!-- Write user-facing release notes here before triggering release-trigger.yml.
     This file becomes the GitHub release body. Keep it concise and user-focused —
     what improved for kit users, not which files changed (kit/CHANGELOG.md tracks that).
     After the release workflow runs and the PR merges, this file resets automatically. -->

## What's new

- **Stack catalog rewritten** — instead of choosing between 6 named stacks, the orchestrator now starts from a canonical baseline (Next.js · TypeScript · Tailwind CSS + shadcn/ui · Drizzle ORM · Supabase · NextAuth.js v5 · Vercel) and layers in additions only when the project explicitly needs them. Six deviation triggers handle edge cases: self-hosted, heavy realtime, pure SPA, content-heavy/static, document schema, and mobile-first.

- **Step 4 (Design) streamlined** — AI generation removed. Bring your own `DESIGN.md` from getdesign.md or freedesignmd.com; the orchestrator validates it against 7 quality criteria, then builds a live HTML preview with mock data before the design gate.

- **`kit/` excluded from project git automatically** — Phase 1 now creates `.gitignore` at the project root with `kit/` as the first entry, so the workflow kit is never accidentally committed to the application repo.

- **Per-screen design brief template** — `templates/spec-screen.md` added for Phase 2 features with 2+ non-trivial screens. Covers identity, access control, content and data model, layout structure, interactions, states, and acceptance criteria.
