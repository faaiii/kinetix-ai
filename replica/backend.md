# Backend Documentation: Claude.ai Full Brain Replica

This document records the backend architecture, live authentication, database security, payments integration, and security audit for the clean-room Claude.ai clone.

---

## 1. Security Checklist

- [x] **Secrets in env vars only:** All API keys (`ANTHROPIC_API_KEY`, `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are kept in `.env.local`. Template defined in [.env.example](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/.env.example).
- [x] **`.env*` in `.gitignore`:** [.gitignore](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/.gitignore) explicitly excludes all `.env*` local files from source control.
- [x] **Input validated on server:** All route payloads are strictly validated using `zod` schemas on every endpoint (`POST /api/chat`, `POST /api/billing/checkout`, `POST /api/projects`, `POST /api/projects/:id/files`).
- [x] **Authorization checked on read and write:** `canAccessConversation` and `canAccessProject` guards enforce user and organization boundaries at the data layer.
- [x] **Row-Level Security (RLS):** All 11 PostgreSQL tables have RLS enabled with explicit tenant isolation rules defined in [schema.sql](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/replica/schema.sql).
- [x] **Webhooks verify signatures:** `POST /api/webhooks/stripe` validates signatures with `stripe.webhooks.constructEvent` before parsing payloads.
- [x] **Idempotency guaranteed:** Stripe webhook events track processed `event.id` values to prevent duplicate state transitions.
- [x] **Upload restrictions:** File uploads enforce a 10MB limit and validate MIME types (`pdf`, `csv`, `md`, `txt`, `json`, `js`, `ts`).
- [x] **No user data in URLs or logs:** Sensitive credentials, prompts, and tokens are omitted from server access logs.
- [x] **Audited dependencies:** Dependencies audited with `npm audit`.

---

## 2. Authentication & Authorization

- **Provider:** Supabase Auth / Secure JWTs.
- **Methods:** Email magic links, Google OAuth.
- **Session Handling:** HTTP-only secure cookies with automatic refresh.
- **Roles:**
  - `owner`: Workspace administration, subscription billing, invite management.
  - `admin`: Project creation, member management, prompt instructions.
  - `member`: Project chats, prompt submission, artifact generation.
- **Authorization Guards:** Defined in `src/lib/auth.ts`:
  - `getUserSession(req)`
  - `canAccessConversation(userId, conversationId)`
  - `canAccessProject(userId, projectId)`

---

## 3. Database & Migrations

- **Database:** PostgreSQL 15+ (hosted on Supabase or Neon).
- **Schema DDL:** [schema.sql](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/replica/schema.sql).
- **Access Policies:** PostgreSQL Row-Level Security (RLS) ensures queries strictly match `auth.uid()`.
- **Seed Script:** [scripts/seed.ts](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/scripts/seed.ts) populates test workspaces, organizations, and seed projects.

---

## 4. Payments & Subscriptions (Stripe)

- **Subscription Tiers:**
  - **Free:** Default tier, standard message capacity.
  - **Pro ($20/mo):** Priority access, 5x message allowance, Claude 3.7 Sonnet reasoning mode.
  - **Team ($30/seat/mo):** Shared projects, central billing, admin management.
- **Checkout Flow:** `POST /api/billing/checkout` redirects to Stripe-hosted Checkout.
- **Self-Serve Portal:** `POST /api/billing/portal` allows customers to update payment methods or cancel in one click.
- **Webhook Events Handled:**
  - `checkout.session.completed`: Sets `organizations.plan_tier = 'pro'`.
  - `customer.subscription.updated`: Syncs active subscription period.
  - `customer.subscription.deleted`: Gracefully resets organization to `free` tier.
  - `invoice.payment_failed`: Notifies admins of billing issues.

---

## 5. Live AI Streaming Engine

- **Endpoint:** `POST /api/chat`
- **Streaming Protocol:** Server-Sent Events (`text/event-stream`).
- **Live Providers Supported:**
  - **Anthropic Messages API:** Streams live `claude-3-7-sonnet-20250219` with `thinking: { type: 'enabled', budget_tokens: 2048 }`.
  - **Fallback Simulation Engine:** If no live API key is set, delivers deterministic SSE token chunks, reasoning thoughts, and artifact emissions.
- **Artifact Tag Extraction:** Progressive parsing detects code/HTML/SVG components and streams structured `event: artifact` payloads to open the split canvas.

---

## 6. Integrations Summary

| Provider | Purpose | Key / Scopes | Status |
| --- | --- | --- | --- |
| **Anthropic** | Frontier LLM Generation & Reasoning | `ANTHROPIC_API_KEY` | Integrated with thinking parameter support |
| **Supabase** | PostgreSQL + Auth + RLS | `SUPABASE_SERVICE_ROLE_KEY` | Schema, RLS, and admin client configured |
| **Stripe** | Subscriptions & Billing Portal | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Test mode checkout, portal, and webhook listener ready |
| **Resend** | Transactional Emails | `RESEND_API_KEY` | Configured in `.env.example` |
