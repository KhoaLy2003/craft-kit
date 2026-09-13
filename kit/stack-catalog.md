# Stack Catalog — Pre-Researched Web Stack Reference

Used by Step 3 (Technical Research) as the first lookup before any web searches.
The orchestrator reads this file and uses matching entries directly, only web-searching for:
- Stacks not listed here
- Volatile facts (pricing, limits) when `Last verified` is more than 3 months old

**Fact stability guide:**
- `[stable]` — architectural capability; rarely changes; trust without re-checking
- `[volatile]` — pricing, limits, tier names; changes without notice; spot-check if >3 months old
- `[current]` — verified in a recent test run against live docs

---

## Quick Reference Table

| Stack | Realtime | Data model | Anonymous tenant access | Free tier | Requires | Last verified |
|---|---|---|---|---|---|---|
| React + Vite + Supabase | WebSockets (Postgres CDC) | Relational (Postgres) | RLS on `anon` role + household token | 500 MB DB; pauses after 7 idle days `[volatile]` | Node ≥18, npm, git | 2026-09-04 |
| Next.js + Vercel + Upstash Redis | Polling or SSE (not native) | Key-value (JSON blobs) | API route enforces household key prefix | 256 MB, 500K cmds/mo; no pause `[volatile]` | Node ≥18, npm, git | 2026-09-04 |
| SvelteKit + PocketBase | SSE (base collections only) | SQLite (relational) | Collection filter rule by query param | Self-hosted; ~$4–6/mo VPS | Node ≥18, npm, git, PocketBase binary | 2026-09-04 |
| React/Next.js + Firebase | WebSockets (Firestore listeners) | Document (NoSQL) | Security rules + anonymous UID or custom claim | Spark: 1 GB, 50K reads/day `[volatile]` | Node ≥18, npm, git | 2026-09-04 |
| Next.js + Vercel + Neon | None native (add Pusher/Ably) | Relational (Postgres serverless) | Server-side session or API-route token | 0.5 GB, 190 compute hrs/mo `[volatile]` | Node ≥18, npm, git | 2026-09-04 |
| React + Vite + Convex | WebSockets (reactive queries) | Document + relations (TypeScript-first) | Custom tokens or anonymous auth | Generous free tier; check dashboard `[volatile]` | Node ≥18, npm, git | 2026-09-04 |


### Third-Party Services Quick Reference

| Service | Category | Free tier | Account required | Last verified |
|---|---|---|---|---|
| Clerk | Auth (hosted) | 10K MAU free `[volatile]` | Yes — publishable + secret key | 2026-09-13 |
| NextAuth.js / Auth.js v5 | Auth (self-hosted) | Free OSS | No (DB required) | 2026-09-13 |
| Cloudinary | Media storage + transforms | 25 GB storage, 25 GB BW `[volatile]` | Yes — cloud_name + api_key | 2026-09-13 |
| Cloudflare R2 | Object storage | 10 GB free, zero egress `[volatile]` | Yes — account + R2 token | 2026-09-13 |
| AWS S3 | Object storage | 5 GB / 12 months free `[volatile]` | Yes — access key + secret | 2026-09-13 |
---

## Full Entries

### React + Vite + Supabase (Postgres + Realtime + Row-Level Security)

**Last verified:** 2026-09-04 (live docs)
**Requires:** Node.js ≥18, npm ≥9, git. No other local tooling — Supabase runs fully hosted; the CLI (`npx supabase`) is optional and downloaded on demand.

**Summary:** Single-page React app built with Vite, backed by Supabase's hosted Postgres. Supabase Realtime uses Postgres logical replication to deliver WebSocket change events to the browser. Row Level Security scopes reads/writes to a tenant (household, org, etc.) without requiring user accounts.

**Realtime model** `[stable]`
- Protocol: WebSockets
- Mechanism: Postgres change data capture (logical replication) → Supabase Realtime server → browser WebSocket
- SDK: `supabase.channel().on('postgres_changes', ...).subscribe()`
- Free tier: 200 concurrent peak connections, 2M messages/month `[volatile]`

**Data model** `[stable]`
- Relational (Postgres): tables, foreign keys, constraints, joins, SQL aggregations
- Excellent for: normalized entities with history, fairness/audit queries, week-boundary joins
- Poor for: unstructured or schema-less data

**Anonymous tenant access (no per-user accounts)** `[stable]`
- Pattern 1 (simpler): Household token in URL → server/Edge Function validates → uses `service_role` key server-side, bypassing RLS. Adds one server layer but avoids RLS complexity.
- Pattern 2 (elegant): Edge Function mints a custom JWT with `tenant_id` claim → client uses it directly against Supabase RLS policies on the `anon` role. No server layer, but requires careful RLS policy design.
- Risk: RLS misconfiguration on the `anon` role can silently expose all tenants' data. Needs a focused spike before committing.

**Hosting / free tier** `[volatile — spot-check if >3 months old]`
- Database: 500 MB (entire small-app data will be kilobytes)
- API requests: unlimited
- Egress: 5 GB/month
- Realtime: 200 concurrent connections, 2M messages/month
- **Inactivity pause: projects suspend after 7 idle days; ~30s cold-start to resume**
- Mitigation: free external cron ping (cron-job.org) weekly to keep alive
- Paid: Pro at $25/month; same schema, no pause, more limits

**Rotation/scheduling logic** `[stable]`
- Lives in application code (client-side trigger or Edge Function)
- Edge Function free tier: 500K invocations/month — sufficient for weekly rotation trigger
- Postgres stored functions possible for atomic rotation computation

**Best fit if:** relational data model needed, first-class realtime required, zero-ops hosting preferred, willing to spike RLS anonymous-access pattern.

**Watch out for:** free-tier inactivity pause; RLS anon-role complexity.

---

### Next.js + Vercel + Upstash Redis

**Last verified:** 2026-09-04 (live docs)
**Requires:** Node.js ≥18, npm ≥9, git. No other local tooling — Vercel and Upstash are fully hosted; the Vercel CLI is optional (`npm i -g vercel`).

> **Note:** Vercel KV was deprecated December 2024 and migrated to Upstash. New projects connect directly to Upstash via the Vercel Marketplace integration. Do not reference Vercel KV in new projects.

**Summary:** Next.js app on Vercel, using Upstash Redis as the data store. All data operations go through Next.js API routes or Server Actions, which enforce tenant access. Redis stores state as JSON blobs keyed by tenant ID. Realtime requires client-side polling or SSE — not natively provided by Upstash serverless.

**Realtime model** `[stable]`
- No native realtime from Upstash serverless Redis (no persistent pub/sub)
- Option A: Client-side polling every 5s → ~36K commands/day → within free 500K/month `[volatile]` limit; up to 5s lag
- Option B: SSE from a Vercel Edge route → persistent connection, no polling lag; conflicts with serverless model; more complex
- Choose polling unless instant push is a hard requirement

**Data model** `[stable]`
- Key-value: JSON blobs keyed by tenant + entity (e.g., `household:{id}:week:{date}`)
- Poor fit for: relational queries, cross-entity aggregations, 4-week history fairness summaries
- Acceptable if: data stays simple (one blob per week, no cross-week joins needed)
- Race condition risk: concurrent writes to same blob → must use atomic Redis ops (SETNX, Lua transactions) or per-item key design

**Anonymous tenant access** `[stable]`
- Simple: API route checks incoming household code → enforces key-prefix scoping server-side
- No RLS or JWT design needed — server holds all enforcement
- Simplest access model of all options

**Hosting / free tier** `[volatile — spot-check if >3 months old]`
- Upstash: 256 MB data, 500K commands/month, 10 GB bandwidth; no inactivity pause
- Vercel: 100 GB bandwidth, serverless function invocations (fair-use); no pause
- No backup/restore on Upstash free tier — data loss on accidental key deletion

**Best fit if:** team is deeply Next.js-native, zero-ops hosting required, data model is simple enough for JSON blobs, polling latency ≤5s is acceptable.

**Watch out for:** Redis is a genuinely poor fit for relational rotation logic; any cross-week aggregation (fairness summaries) becomes painful; no native realtime.

---

### SvelteKit + PocketBase (Self-Hosted, SQLite Backend)

**Last verified:** 2026-09-04 (live docs — PocketBase v0.40.x)
**Requires (frontend):** Node.js ≥18, npm ≥9, git.
**Requires (backend):** PocketBase pre-compiled binary for the target OS — download from [pocketbase.io](https://pocketbase.io/docs/#installation). No Go runtime or build toolchain needed; it is a single self-contained executable. The scaffold step downloads it automatically or the developer places it at `backend/pocketbase`.

**Summary:** SvelteKit frontend + PocketBase single-binary Go backend embedding SQLite. PocketBase provides REST API, built-in SSE realtime, collection rules for access control, and an admin dashboard — all in one executable. Self-hosted on a VPS or Fly.io.

**Realtime model** `[stable]`
- Protocol: Server-Sent Events (SSE)
- SDK: `pb.collection('assignments').subscribe('*', callback)`
- **Limitation:** SSE events only fire for Base collections; View collections (SQL SELECT aggregations) do not emit events — fetch history on demand via REST

**Data model** `[stable]`
- SQLite (relational): Relation fields for FK-like links between collections, joins via View collections
- Good fit for: structured entities with relationships; history via SQL aggregations
- Limitation: SQLite serializes writes — safe under low concurrency (2–5 household members) but blocking under high concurrent load

**Anonymous tenant access** `[stable]`
- Option A: Collection API rule filters by query param: `@request.query.householdId = household_id` — no auth needed
- Option B: Single shared PocketBase auth record (username + PIN) as the household "account" — uses built-in session without per-user accounts
- Both patterns are documented and supported

**Hosting / cost** `[volatile — spot-check if >3 months old]`
- No managed free tier with always-on hosting
- Fly.io hobby: free but **pauses when idle** (same failure mode as Supabase free)
- Paid VPS: ~$4–6/month Hetzner/DigitalOcean; always-on, developer owns ops (backups, upgrades)
- PocketBase Cloud: beta as of 2026; limited availability

**Stability** `[current]`
- PocketBase is pre-v1.0 (v0.40.x). Project docs warn backward compatibility not guaranteed before v1.0. Manual migration steps between versions may be required. Monitor changelog.

**Best fit if:** developer prefers self-hosted control, willing to pay ~$4–6/month and do light ops, wants to avoid vendor lock-in, comfortable with Svelte.

**Watch out for:** self-hosting ops burden for solo dev; pre-v1.0 stability; Fly.io hobby pause if going free.

---

### React / Next.js + Firebase (Firestore + Realtime)

**Last verified:** 2026-09-04 (knowledge-based; spot-check Spark tier limits before use)
**Requires:** Node.js ≥18, npm ≥9, git. Firebase CLI optional for deployment (`npm i -g firebase-tools`); not needed for local development. A Google account is required to create the Firebase project.

**Summary:** Google Firebase provides Firestore (document database with real-time listeners) and Firebase Realtime Database (JSON tree with WebSocket sync). Works with React (Vite) or Next.js. Authentication supports anonymous users, which can be used to scope tenant data without per-user accounts.

**Realtime model** `[stable]`
- Firestore: real-time listeners via `onSnapshot()` — WebSocket-based, instant push
- Realtime Database: WebSocket sync on a JSON tree — lower latency but simpler data model
- Both work on free Spark plan

**Data model** `[stable]`
- Firestore: Document (NoSQL) — nested collections, flexible schema
  - Reasonable fit for chore assignments stored as documents per week
  - Cross-collection aggregations (fairness history) require client-side computation or Cloud Functions — no SQL joins
- Realtime Database: flat JSON tree — simpler but harder to query

**Anonymous tenant access** `[stable]`
- Firebase Anonymous Auth gives each browser session an anonymous UID
- Firestore Security Rules can scope reads/writes to documents matching a `householdId` field, where the household ID is stored in a custom claim or passed as a verified token
- Pattern: household creator mints a shared "join token" → stored in Firestore → members present it → server-side function adds `householdId` claim to their anonymous token
- More moving parts than Supabase RLS or PocketBase rules for the same outcome

**Hosting / free tier (Spark plan)** `[volatile — spot-check before use]`
- Firestore: 1 GB storage, 50K reads/day, 20K writes/day, 20K deletes/day
- No inactivity pause
- Requires a Google account; no credit card for Spark
- Blaze (pay-as-you-go) required for Cloud Functions beyond the free invocation limit

**Best fit if:** team is already in the Google ecosystem, wants real-time without backend setup, acceptable with document data model and client-side aggregation.

**Watch out for:** document model requires more client-side logic for relational queries; anonymous auth + household scoping has more steps than simpler options; Spark daily read/write limits may surprise on busy days.

---

### Next.js + Vercel + Neon (Serverless Postgres)

**Last verified:** 2026-09-04 (knowledge-based; spot-check free tier limits before use)
**Requires:** Node.js ≥18, npm ≥9, git. Neon and Vercel are fully hosted; no local database process needed. A Neon account (free) is required before scaffold runs.

**Summary:** Next.js on Vercel, backed by Neon — a serverless Postgres provider. Full Postgres with scale-to-zero. No native realtime; a separate pub/sub layer (Pusher, Ably, or Supabase Realtime used standalone) would be needed for live updates. Best for projects that need relational data but can tolerate polling for realtime.

**Realtime model** `[stable]`
- None native from Neon — it's a database, not a realtime platform
- Options: client-side polling (simplest), Pusher/Ably (managed WebSockets, paid after low threshold), or SSE from a Next.js Edge route
- Adding a realtime layer is a real integration cost

**Data model** `[stable]`
- Full Postgres: normalized tables, foreign keys, SQL aggregations, joins
- Best relational fit of all the serverless options
- Schema migrations via Drizzle ORM or Prisma

**Anonymous tenant access** `[stable]`
- Server-side enforcement via Next.js API routes / Server Actions
- Household token in URL → validated server-side → queries scoped to `WHERE household_id = $1`
- No RLS required (application layer enforces scoping)

**Hosting / free tier** `[volatile — spot-check before use]`
- Neon: 0.5 GB storage, 190 compute hours/month on free tier; no inactivity pause (scale-to-zero is fast, not a 30s pause)
- Vercel: free tier as above
- No realtime included — Pusher Sandbox: 200 concurrent connections, 200K messages/day free

**Best fit if:** relational data model is a priority, team is Next.js-native, realtime is a "nice to have" not a hard requirement (polling acceptable), zero VPS ops required.

**Watch out for:** realtime requires a separate paid service at production scale; two integrations (Neon + Vercel + realtime provider) adds surface area.

---

### React + Vite + Convex

**Last verified:** 2026-09-04 (knowledge-based; spot-check free tier limits before use)
**Requires:** Node.js ≥18, npm ≥9, git. Convex is fully hosted; the CLI is installed as a dev dependency (`npm i convex`). A Convex account (free) is required before scaffold runs.

**Summary:** Convex is a TypeScript-first reactive backend. Queries are functions that automatically re-run when their data changes and push results to subscribed clients — no manual WebSocket management. Schema defined in TypeScript. Hosted, fully managed.

**Realtime model** `[stable]`
- Reactive queries: define a `query` function → Convex re-runs it automatically on data change → pushes results to subscribed React components via WebSocket
- No explicit subscription code needed — React hook (`useQuery`) handles subscription lifecycle
- Instant push, no polling

**Data model** `[stable]`
- Document-like with a typed schema (TypeScript); supports indexes and relations
- Less SQL-like than Postgres; cross-document aggregations done in query functions
- Mutation functions (server-side transactions) handle concurrent writes safely — optimistic concurrency built in

**Anonymous tenant access** `[stable]`
- Convex supports anonymous authentication (generates a session token per browser)
- Household scoping: query/mutation functions receive identity → check or store `householdId` association
- Simpler than Firebase anonymous auth for the same outcome

**Hosting / free tier** `[volatile — spot-check before use]`
- Generous free tier (check convex.dev/pricing for current limits)
- No inactivity pause
- No self-hosting option — fully managed only

**Best fit if:** developer wants reactive realtime with zero WebSocket boilerplate, TypeScript-first schema appeals, comfortable with a newer/smaller ecosystem.

**Watch out for:** Convex is a smaller ecosystem than Firebase or Supabase; vendor lock-in (no self-hosting); document model with typed schema may feel unfamiliar if team is Postgres-native.

---

## Adding New Entries

When a project's Step 3 requires a stack not listed above, the research-analyst should web-search for it and append an entry here after the run. Format: follow the structure of an existing entry. Mark all facts with stability tags. Set `Last verified` to today's date.

Entries must include a `**Requires:**` field immediately after `**Last verified:**`. State the minimum local toolchain (Node version, package manager, git) and any account prerequisites (hosted services that require sign-up before scaffold runs).

Entries should be updated (not replaced) when spot-checks find changed facts — update the specific volatile fact and bump `Last verified`.

---

## Third-Party Services

These are not full stacks — they are standalone services that integrate into any of the stacks above. List them in `docs/architecture.md` under "Third-Party Services" and confirm accounts exist before scaffold runs.

---

### Auth: Clerk

**Last verified:** 2026-09-13 (live docs)
**Requires:** Node ≥18, npm. A Clerk account and application are required before scaffold runs — get publishable key + secret key from the Clerk dashboard.

**Summary:** Hosted authentication and user management. Provides pre-built UI components (sign-in, sign-up, user profile), session management, and organization/multi-tenancy support. Works with Next.js (App Router first-class), React, and any Node backend. Handles JWTs, refresh, and device sessions automatically.

**Integration model** `[stable]`
- Next.js: `@clerk/nextjs` middleware wraps the app; `auth()` / `currentUser()` available in Server Components and API routes
- React (Vite): `@clerk/react` provider + hooks (`useAuth`, `useUser`)
- Backend-only: `@clerk/backend` for token verification in standalone APIs

**Key features** `[stable]`
- Passwordless (magic link, OTP), OAuth (Google, GitHub, etc.), passkeys — all built-in, no extra config
- Webhooks for user lifecycle events (user.created, session.ended)
- Organizations: multi-tenant with roles and permissions out of the box
- MFA, bot protection, and email deliverability handled by Clerk

**Free tier** `[volatile — spot-check if >3 months old]`
- 10,000 monthly active users free; unlimited seats on free plan
- All auth methods included on free tier; advanced org features on paid
- No self-hosting option on free; fully managed

**Best fit if:** the project needs real user accounts with social login, passwordless, or org-level multi-tenancy, and the team wants zero auth boilerplate. Particularly strong for Next.js App Router projects.

**Watch out for:** vendor lock-in (session model is Clerk-specific); self-hosting not available on free tier; at high MAU Clerk is significantly more expensive than rolling auth with NextAuth/Lucia.

---

### Auth: NextAuth.js (Auth.js v5)

**Last verified:** 2026-09-13 (knowledge-based)
**Requires:** Node ≥18, npm. A database (Postgres, SQLite, etc.) is required for the database adapter; JWTs only for the stateless variant.

**Summary:** Open-source auth library for Next.js (and now any framework via Auth.js v5). Handles OAuth providers, credentials, magic links. Self-hosted — no vendor account required. Session stored in JWT (stateless) or database (stateful via an adapter).

**Integration model** `[stable]`
- Next.js App Router: `auth()` helper in Server Components; `middleware.ts` for route protection
- Adapters for Prisma, Drizzle, Supabase, and others — connect to whichever DB the stack already uses
- Credentials provider for username/password (requires manual password hashing with bcrypt)

**Key features** `[stable]`
- OAuth: Google, GitHub, Discord, and 60+ providers with 3 lines of config
- JWT or database sessions — swap without changing application code
- No usage-based pricing; entirely self-hosted

**Free tier** `[stable]`
- Free and open-source; cost is only the database that backs the session store

**Best fit if:** the project needs OAuth login, the team wants zero vendor lock-in, and a database is already part of the stack (Supabase, Neon, PocketBase).

**Watch out for:** more configuration than Clerk for the same outcome; Auth.js v5 (App Router) is stable but the migration path from v4 is manual; credentials provider requires careful password-hashing implementation.

---

### Storage: Cloudinary

**Last verified:** 2026-09-13 (live docs)
**Requires:** Node ≥18, npm. A Cloudinary account is required before scaffold runs — get `cloud_name`, `api_key`, and `api_secret` from the Cloudinary dashboard.

**Summary:** Hosted media management platform. Handles image and video upload, storage, on-the-fly transformation (resize, crop, format conversion, compression), and global CDN delivery. Exposes an upload API and an SDK for Node, React, and Next.js.

**Integration model** `[stable]`
- Server-side upload: `cloudinary.uploader.upload(filePath)` — upload from a Next.js API route or Server Action; client never receives credentials
- Client-side upload: unsigned upload preset + direct browser-to-Cloudinary upload; no server round-trip for the file bytes
- Next.js Image: use `next-cloudinary` (`<CldImage>` component) for automatic format + size optimization via URL transforms
- Transformation URL API: append parameters (`/w_400,h_300,c_fill/`) to the delivery URL — no re-upload needed

**Key features** `[stable]`
- Auto-format (`f_auto`) and auto-quality (`q_auto`) deliver WebP/AVIF to supported browsers
- Eager transformations pre-generate variants at upload time; lazy transforms happen on first request and are cached at CDN edge
- AI-powered background removal, generative fill, and smart cropping available on paid plans
- Video transcoding, thumbnail generation, and adaptive streaming (HLS) available

**Free tier** `[volatile — spot-check if >3 months old]`
- 25 monthly credits free (1 credit ≈ 1 transformation or 1 MB storage/bandwidth unit)
- 25 GB storage, 25 GB bandwidth/month
- Sufficient for prototypes and small apps; production workloads typically require paid

**Best fit if:** the project handles user-uploaded images or videos and needs on-the-fly resizing/optimization without provisioning a separate storage bucket and image CDN.

**Watch out for:** credit model is non-obvious — each transformation variant counts; cost can escalate quickly on image-heavy apps without eager pre-generation; vendor lock-in on URL-based transform syntax.

---

### Storage: AWS S3 / Cloudflare R2

**Last verified:** 2026-09-13 (knowledge-based)
**Requires:** Node ≥18, npm, `@aws-sdk/client-s3` (S3) or `aws4fetch` / same SDK pointed at R2 endpoint (R2). An AWS account (S3) or Cloudflare account (R2) is required before scaffold runs.

**Summary:** Object storage for files, images, videos, and other binary assets. S3 is the AWS standard; Cloudflare R2 is S3-compatible with zero egress fees. Both use presigned URLs to let browsers upload directly without proxying bytes through the app server.

**Integration model** `[stable]`
- Presigned PUT: server generates a time-limited signed URL → client uploads file bytes directly to S3/R2 → server records the resulting object key in the database
- Presigned GET: server generates signed download URL for private objects; public buckets skip this step
- `@aws-sdk/client-s3` + `@aws-sdk/s3-request-presigner` — same SDK works for both S3 and R2 (set custom endpoint for R2)

**Key features** `[stable]`
- No built-in image transformation — pair with Cloudflare Images, imgproxy, or Cloudinary for on-the-fly resizing
- Lifecycle rules: auto-delete or move to cold storage after N days
- Versioning: keep object history for overwrite protection
- R2 advantage: zero egress fees make it significantly cheaper than S3 for read-heavy workloads

**Free tier** `[volatile — spot-check if >3 months old]`
- S3: 5 GB storage, 20K GET, 2K PUT requests/month for 12 months (then paid); egress fees apply
- R2: 10 GB storage, 1M Class-A ops, 10M Class-B ops/month free forever; zero egress fees

**Best fit if:** the project stores arbitrary files (PDFs, exports, backups) or large media that does not need server-side transformation, and cost at scale matters.

**Watch out for:** S3 egress fees accumulate fast on read-heavy apps — prefer R2 if Cloudflare is acceptable; neither provides image transformation (add a separate service); presigned URL flows require careful CORS configuration on the bucket.
