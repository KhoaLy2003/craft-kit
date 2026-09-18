# Stack Catalog — Canonical Baseline and Additions Reference

Used by Step 6 (Architecture) as the primary reference before any web search.
The `research-analyst` reads this file to derive the recommended stack for the project.

**How to use this file:**
1. Start from the Canonical Baseline — it is the default for every project.
2. Run the Deviation Triggers checklist against the project's requirements. Apply only the deviations that match.
3. Walk the Additions Catalog domain by domain. Add only what the project's roadmap explicitly requires.
4. Web-search only for: stacks not listed here, or volatile facts with `Last verified` older than 3 months.

**Fact stability guide:**
- `[stable]` — architectural capability; rarely changes; trust without re-checking
- `[volatile]` — pricing, limits, tier names; changes without notice; spot-check if >3 months old
- `[current]` — verified in a recent test run against live docs

---

## Section 1 — Canonical Baseline Stack

This stack handles roughly 75% of modern web projects. It is the default choice unless a Deviation Trigger applies.

**Last verified:** 2026-09-18 (live docs)

| Layer | Choice | Version |
|---|---|---|
| Language | TypeScript | ≥5.x |
| Framework | Next.js (App Router) | ≥15 |
| Styling | Tailwind CSS + shadcn/ui | Tailwind v4, shadcn latest |
| ORM | Drizzle ORM | latest |
| Database | Supabase (PostgreSQL) | hosted |
| Auth | NextAuth.js (Auth.js v5) | v5 |
| Deployment | Vercel | hosted |

**Minimum local toolchain:** Node.js ≥18, npm ≥9, git.

**Account prerequisites (must exist before scaffold runs):**
- Supabase account (free) — connection string from project settings
- Vercel account (free) — connect GitHub repo during scaffold

---

### Why this baseline `[stable]`

**Next.js (App Router)** covers the full range of rendering strategies — SSR, SSG, ISR, and pure client components — in a single project. API routes and Server Actions replace a separate backend layer for most apps. It is the dominant full-stack React framework with first-class Vercel deployment.

**Supabase (PostgreSQL)** gives a hosted, fully managed relational database with a direct connection string for Drizzle. The SQL model handles normalized data, foreign keys, aggregations, and history queries that document stores cannot. Supabase also offers opt-in Realtime, Storage, and Auth as additions (see Section 3).

**Drizzle ORM** is TypeScript-native, schema-as-code, generates zero-overhead SQL, and works with any Postgres connection string. Migrations are plain SQL files — no magic, no lock-in.

**NextAuth.js v5 (Auth.js)** is self-hosted, provider-agnostic OAuth (Google, GitHub, Discord, and 60+ others), credentials, and magic links. Uses the Drizzle adapter against the same Supabase Postgres — no extra service. Upgrade to Clerk when org-level multi-tenancy or pre-built user management UI is required.

**Vercel** deploys Next.js with zero configuration. Edge Functions, Image Optimization, and Analytics are available on the free tier.

**Tailwind CSS + shadcn/ui** — utility-first styling with copy-in accessible components. No design system from scratch; components are owned code, not a dependency.

---

### Baseline free tiers `[volatile — spot-check if >3 months old]`

| Service | Free tier limits |
|---|---|
| Supabase | 500 MB DB; 5 GB egress; 2 active projects; pauses after 7 idle days |
| Vercel | 100 GB bandwidth; serverless function fair use; no pause |
| NextAuth.js | Free OSS — cost is only the Supabase DB that backs sessions |

**Supabase inactivity pause:** projects suspend after 7 idle days on the free tier (~30s cold-start to resume). Mitigation: free external cron ping (cron-job.org) weekly to keep alive. Pro plan ($25/month) removes the pause.

---

## Section 2 — Deviation Triggers

Check these against the project's requirements. Each trigger names exactly what to swap and what to keep. Apply only the triggers that match — do not stack deviations unnecessarily.

---

### D1 — Self-hosted / zero vendor lock-in

**Signal:** project requirements explicitly name self-hosting, on-prem, or "no third-party services."

**Swap:**
- Vercel → Railway or Fly.io (always-on container hosting)
- Supabase → Neon (raw serverless Postgres, same Drizzle connection) or keep Supabase as DB-only

**Keep:** Next.js, TypeScript, Tailwind, shadcn/ui, Drizzle, NextAuth.js.

**Note:** Supabase used purely as a Postgres connection string (no Realtime, no Auth SDK) is not vendor lock-in in any meaningful sense — the connection string is a standard Postgres DSN and the database can be migrated. Flag this to the user if they raise it.

---

### D2 — Heavy native realtime

**Signal:** project requires live push to multiple clients simultaneously — collaborative editing, live cursors, presence indicators, chat, multiplayer state, or dashboards that must update within 1–2 seconds without user action.

**Add:** Supabase Realtime (Postgres CDC via WebSockets) — see Additions Catalog, Realtime section.

**Alternative swap:** if the realtime requirement is the primary constraint and relational data is not critical, consider Convex (TypeScript-first reactive backend; see D5).

**Keep everything else in the baseline.**

---

### D3 — Pure SPA / no SSR

**Signal:** internal dashboard, admin tool, or heavily client-interactive app where SSR provides no SEO or performance benefit, and the team prefers a clean client-only build.

**Swap:**
- Next.js → React + Vite
- Vercel → Vercel (still works) or any static host (Cloudflare Pages, Netlify)

**Keep:** TypeScript, Tailwind, shadcn/ui, Drizzle, Supabase, NextAuth.js.

**Note:** React + Vite loses API routes and Server Actions — all backend logic must go through a separate API (can be Next.js API-routes-only deployment, or a standalone Express/Hono server).

---

### D4 — Content-heavy / marketing site / blog

**Signal:** majority of pages are editorial content, marketing copy, or documentation. SEO and build-time generation are primary concerns. Little to no per-user state.

**Swap:**
- Next.js → Astro (island architecture; ships zero JS by default; Tailwind + shadcn/ui work unchanged)

**Keep:** TypeScript, Tailwind, shadcn/ui, Vercel.

**Drop:** Drizzle, Supabase, NextAuth.js (unless the site has a logged-in section — add them back scoped to that section).

**Add:** a CMS if editorial workflow is needed (see Additions Catalog, CMS section).

---

### D5 — Document / schema-flexible data

**Signal:** data schema evolves rapidly and unpredictably; hierarchical or nested documents are the natural representation; SQL joins would be artificial; no relational history or aggregation queries.

**Swap:**
- Supabase + Drizzle → Firebase Firestore (document NoSQL, native realtime listeners, anonymous auth built in)

**Keep:** Next.js or React + Vite (Firebase works with both), TypeScript, Tailwind, shadcn/ui, Vercel.

**Drop:** Drizzle (no ORM needed for Firestore), NextAuth.js (Firebase Auth replaces it).

---

### D6 — Mobile-first / cross-platform

**Signal:** project is a native mobile app, or requires native mobile alongside a web app.

**Swap (mobile layer):**
- Next.js → Expo (React Native) for the mobile app
- Keep Next.js as the API backend if a web surface is also needed

**Keep:** TypeScript, Supabase (excellent React Native SDK), Drizzle (server-side only).

**Note:** this is an additive deviation — Expo is added, not a replacement of the entire baseline. Tailwind does not apply to React Native (use NativeWind or StyleSheet).

---

## Section 3 — Additions Catalog

These are problem-specific additions layered onto the baseline (or a deviated baseline). Each addition is off by default. Add only when the project's roadmap explicitly requires the capability.

For each domain, the orchestrator should ask: *"Does the project's roadmap include a feature that requires this?"* If yes, add the recommended entry and note it in `docs/architecture.md`.

---

### Auth — Upgrade from NextAuth.js

Add when: the project needs org/team multi-tenancy, B2B SaaS with seat management, pre-built user management UI, or the team wants zero auth configuration overhead.

#### Clerk

**Last verified:** 2026-09-18 (live docs)
**Add alongside:** replace NextAuth.js entirely; remove Drizzle auth tables.
**Requires:** Clerk account — publishable key + secret key before scaffold runs.

Hosted auth with pre-built sign-in/sign-up/user-profile components. First-class Next.js App Router support (`@clerk/nextjs` middleware). Organizations, roles, and permissions built in. Handles OAuth, passwordless, passkeys, MFA, and device sessions automatically.

**Free tier** `[volatile]`: 10,000 MAU free; all auth methods included; advanced org features on paid.

**When Clerk over NextAuth:** org-level multi-tenancy, B2B seat management, or the team wants zero auth configuration. At high MAU, Clerk is significantly more expensive than NextAuth — size the decision against growth projections.

---

### Realtime

Add when: the project requires live push updates to connected clients without polling.

#### Supabase Realtime (recommended if already on baseline)

**Last verified:** 2026-09-18 (live docs)
**Add alongside:** baseline — no new service account needed; same Supabase project.

Postgres CDC (logical replication) via WebSockets. SDK: `supabase.channel().on('postgres_changes', ...).subscribe()`. Changes to any table row push instantly to subscribed clients.

**Free tier** `[volatile]`: 200 concurrent connections, 2M messages/month.

**Limitation** `[stable]`: requires the Supabase JS client in the browser; not suitable for server-only environments. Row-level security on the `anon` role must be correctly configured or all-tenant data is exposed.

#### Pusher / Ably (when not using Supabase)

**Last verified:** 2026-09-18 (knowledge-based)

Managed WebSocket pub/sub. Drop-in for any stack — not tied to the database. Use when the project uses D1 (self-hosted Neon) or D3 (React+Vite) and still needs push.

**Free tiers** `[volatile]`: Pusher Sandbox — 200 concurrent connections, 200K messages/day. Ably — 200 concurrent connections, 6M messages/month.

---

### Storage

Add when: the project stores user-uploaded files, images, videos, or binary assets.

#### Cloudflare R2 (recommended default)

**Last verified:** 2026-09-18 (live docs)
**Requires:** Cloudflare account + R2 token before scaffold runs.

S3-compatible object storage with zero egress fees. Use the `@aws-sdk/client-s3` pointed at the R2 endpoint — same SDK as S3, no re-learning. Presigned PUT/GET for direct browser uploads without proxying bytes through the app server.

**Free tier** `[volatile]`: 10 GB storage, 1M Class-A ops, 10M Class-B ops/month; zero egress fees forever.

**No image transformation built in** — pair with Cloudinary (below) if transformation is needed.

#### AWS S3

**Last verified:** 2026-09-18 (knowledge-based)
**Requires:** AWS account + access key + secret before scaffold runs.

Industry standard. Same presigned URL pattern as R2. Prefer R2 unless the project is already in the AWS ecosystem — S3 egress fees accumulate fast on read-heavy apps.

**Free tier** `[volatile]`: 5 GB storage, 20K GET, 2K PUT/month for 12 months only; egress fees apply after.

#### Cloudinary (image/video transformation)

**Last verified:** 2026-09-18 (live docs)
**Requires:** Cloudinary account — `cloud_name`, `api_key`, `api_secret` before scaffold runs.

Add when: project needs server-side image/video transformation (resize, crop, format conversion, compression, AI background removal). Delivers via global CDN. `f_auto` + `q_auto` serve WebP/AVIF automatically.

**Free tier** `[volatile]`: 25 GB storage, 25 GB bandwidth/month, 25 monthly credits (1 credit ≈ 1 transformation unit).

**Watch out for:** credit model is non-obvious — each transformation variant counts separately; eager pre-generation required for image-heavy apps to avoid credit runaway.

#### Supabase Storage

**Last verified:** 2026-09-18 (live docs)
**Add alongside:** baseline only — no new service account; same Supabase project.

Simple file/object storage with Row Level Security tied to the same Postgres auth model. Good for small files where single-vendor simplicity matters. No image transformation built in.

**Free tier** `[volatile]`: 1 GB storage on free plan.

---

### Payments

Add when: the project charges users — subscriptions, one-time purchases, or metered billing.

#### Stripe

**Last verified:** 2026-09-18 (live docs)
**Requires:** Stripe account + publishable key + secret key + webhook secret before scaffold runs.

De facto standard for web payments. Handles subscriptions, one-time charges, metered billing, trials, coupons, and invoices. Next.js integration via API routes or Server Actions for webhook handling.

**Pricing** `[volatile]`: 2.9% + $0.30 per transaction; no monthly fee; no free tier on transactions.

**Key integration points** `[stable]`: `stripe.checkout.sessions.create()` for hosted checkout; `stripe.webhooks.constructEvent()` for webhook verification; `stripe/stripe-node` + `@stripe/stripe-js` (client).

---

### Email

Add when: the project sends transactional emails (confirmations, password resets, notifications) or marketing emails.

#### Resend (recommended)

**Last verified:** 2026-09-18 (live docs)
**Requires:** Resend account + API key; domain DNS records for sending before go-live.

Modern developer-first email API. Uses React Email for template authoring (JSX components). First-class Next.js integration. Excellent deliverability.

**Free tier** `[volatile]`: 3,000 emails/month, 100/day.

#### SendGrid

**Last verified:** 2026-09-18 (knowledge-based)
**Requires:** SendGrid account + API key; domain authentication before go-live.

Established high-volume platform. Use when Resend's limits are insufficient or the team is already on the Twilio ecosystem.

**Free tier** `[volatile]`: 100 emails/day free forever.

---

### Search

Add when: the project needs full-text search across user-generated or catalog content — keyword search, facets, filters, typo tolerance.

> **Note:** Postgres full-text search (`tsvector` / `to_tsquery`) covers simple keyword search with no additions. Only add a dedicated search service when advanced relevance ranking, faceted filters, or high-query-volume is required.

#### Typesense (recommended for most projects)

**Last verified:** 2026-09-18 (live docs)

Open-source, self-hostable, or managed (Typesense Cloud). Typo-tolerant, sub-50ms queries, TypeScript SDK. Good for datasets up to tens of millions of records.

**Managed free tier** `[volatile]`: 3 nodes × 1 vCPU on Typesense Cloud — check current dashboard limits.

**Self-hosted:** single binary; ~256 MB RAM for small datasets; deploy on Railway or Fly.io.

#### Algolia

**Last verified:** 2026-09-18 (knowledge-based)

Fully managed hosted search. Rich feature set (geo-search, personalization, AI ranking). Use when Typesense self-hosting is not acceptable or enterprise SLA is required.

**Free tier** `[volatile]`: 10K records, 10K search ops/month.

---

### Background Jobs

Add when: the project needs work that runs outside the HTTP request/response cycle — delayed tasks, recurring jobs, long-running processes, event-driven pipelines.

#### Inngest (recommended for Next.js)

**Last verified:** 2026-09-18 (live docs)
**Requires:** Inngest account + event key; Inngest Dev Server for local development.

Event-driven serverless functions that live inside the Next.js app. Handles retries, fan-out, delays, and step functions natively. Triggered by events sent from application code. No separate worker process.

**Free tier** `[volatile]`: 50K function runs/month; check dashboard for current limits.

#### Trigger.dev

**Last verified:** 2026-09-18 (knowledge-based)

Durable background job execution with long-running task support. Use when tasks exceed serverless function timeouts (>60s) or need fine-grained progress reporting.

---

### Analytics

Add when: the project needs product analytics (user behavior, funnels, retention) or privacy-respecting page-view tracking.

#### PostHog (recommended)

**Last verified:** 2026-09-18 (live docs)
**Requires:** PostHog account (cloud) or self-hosted instance.

Open-source product analytics with session replay, feature flags, A/B testing, and funnel analysis. Self-hostable on a VPS (Docker). Cloud hosted with generous free tier.

**Cloud free tier** `[volatile]`: 1M events/month, 5K session recordings/month.

#### Plausible

**Last verified:** 2026-09-18 (knowledge-based)

Lightweight, privacy-first, GDPR-compliant page-view analytics. Script is <1 KB. No cookies, no consent banner needed in most jurisdictions. Use when product analytics depth is not needed and privacy compliance is a priority.

**Pricing** `[volatile]`: no free tier on cloud; self-hostable OSS for free.

---

### CMS

Add when: the project has editorial content (blog, knowledge base, marketing pages) that non-technical users must be able to update without code deploys.

#### Sanity (recommended)

**Last verified:** 2026-09-18 (live docs)
**Requires:** Sanity account + project ID + dataset name before scaffold runs.

Structured content with a real-time collaborative editing studio. GROQ query language. Excellent Next.js integration via `next-sanity`. Schema defined in code.

**Free tier** `[volatile]`: 3 users, 2 datasets, 500K API CDN requests/month.

#### Contentful

**Last verified:** 2026-09-18 (knowledge-based)

Enterprise CMS with REST and GraphQL delivery APIs. Use when the client already has a Contentful subscription or needs enterprise SLA and locale management.

**Free tier** `[volatile]`: 5 users, 2 locales, 25K API calls/month.

---

### AI / LLM

Add when: the project includes AI-generated content, chat, embeddings, or any LLM-powered feature.

#### Vercel AI SDK (required when adding any LLM)

**Last verified:** 2026-09-18 (live docs)

TypeScript SDK for streaming AI responses, tool use (function calling), and multi-provider support. First-class Next.js integration — streaming via Server Actions and Route Handlers. Abstracts OpenAI, Anthropic, Google, and others behind a unified API.

**Cost:** free OSS library; pay only for the underlying model API.

#### OpenAI

**Last verified:** 2026-09-18 (knowledge-based)
**Requires:** OpenAI account + API key before scaffold runs.

GPT-4o and GPT-4o-mini for text; text-embedding-3-small/large for embeddings; DALL-E 3 for image generation. Pay-per-token.

#### Anthropic

**Last verified:** 2026-09-18 (knowledge-based)
**Requires:** Anthropic account + API key before scaffold runs.

Claude models (claude-sonnet-4-5, claude-haiku-4-5) for text. Preferred for long-context reasoning, instruction-following, and structured output. Pay-per-token.

---

## Section 4 — Adding New Entries

When Step 6 requires a service not listed above, the `research-analyst` should web-search for it and append an entry to the relevant section after the run. Format: follow the structure of an existing entry. Mark all facts with stability tags. Set `Last verified` to today's date.

Volatile facts (pricing, limits, tier names) must be spot-checked before use if `Last verified` is older than 3 months. Update the specific fact in place and bump `Last verified` — do not replace the whole entry.
