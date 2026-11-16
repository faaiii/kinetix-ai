# Deploy Checklist & Production Guide: Kinetix

Date: 2026-11-16  
Build: Next.js 15.5.29 Production Bundle  
Target Domain: `kinetixai.dev` (or `getkinetix.com`)  
Hosting Provider: Vercel (Edge & Serverless)  
Go from user: **Preflight Ready — Awaiting Final User Approval to Connect Domain**  

---

## 1. Preflight Gate (All Checks Passed)

| Check | Tool / Verification | Target | Result | Status |
| :--- | :--- | :--- | :--- | :---: |
| **E2E Test Suite** | Playwright (`e2e/`) | 20 cases passing | 20 passed / 0 failed | **PASS** |
| **Open Critical Bugs** | `replica/bugs.md` | 0 open S1 or S2 | 0 open S1, 0 open S2 | **PASS** |
| **Feature Parity** | `parity.py replica/features.csv` | Must-haves 100%, Score ≥ 80 | 30/30 must-haves (100.0 / 100) | **PASS** |
| **Rebrand Sweep** | `sweep.py . --config replica/brand.json` | Exit code 0 (clean) | Exit 0: Clean (no original names/colors) | **PASS** |
| **Store Listing Lint** | `listing.py replica/launch/listing.json` | 0 errors, 0 warnings | Exit 0: 0 errors, 0 warnings | **PASS** |
| **Production Build** | `npm run build` | Zero build / type errors | 14/14 static and dynamic routes compiled | **PASS** |
| **Legal Pages Live** | `/privacy` & `/terms` | Sub-processors listed | Live at `/privacy` & `/terms` | **PASS** |
| **Account Deletion** | `schema.sql` foreign keys | Right to erasure | Cascade deletion on `users.id` | **PASS** |
| **Brand Identity** | `brand.md` & `tokens.json` | Distinct trade dress | Kinetix Royal Indigo & Electric Violet | **PASS** |

---

## 2. Production Services Setup

### Database (PostgreSQL 15+ on Supabase or Neon)
- [ ] Provision a separate production PostgreSQL project (never reuse dev/staging database).
- [ ] Execute database DDL from [schema.sql](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/replica/schema.sql) to create all 11 tables with Row-Level Security (RLS) enabled.
- [ ] Enable automated daily backups in Supabase / Neon dashboard.

### Environment Variables
Configure in your hosting provider's dashboard (e.g. Vercel Project Settings > Environment Variables) matching [.env.example](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/.env.example):
```env
NEXT_PUBLIC_APP_URL="https://kinetixai.dev"
NEXT_PUBLIC_SUPABASE_URL="https://prod-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="live-anon-key..."
SUPABASE_SERVICE_ROLE_KEY="live-service-role-key..."
AI_GATEWAY_API_KEY="live-provider-key..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_PRO_MONTHLY_PRICE_ID="price_live_pro_monthly"
STRIPE_TEAM_MONTHLY_PRICE_ID="price_live_team_monthly"
RESEND_API_KEY="re_live_..."
EMAIL_FROM="Kinetix <notifications@kinetixai.dev>"
```

### Stripe Live Mode
- [ ] Toggle Stripe Dashboard from Test Mode to **Live Mode**.
- [ ] Create Products & Prices:
  - `Kinetix Pro`: $20.00 / month (`price_live_pro_monthly`)
  - `Kinetix Team`: $30.00 / user / month (`price_live_team_monthly`)
- [ ] Configure Webhook Endpoint:
  - URL: `https://kinetixai.dev/api/webhooks/stripe`
  - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- [ ] Conduct 1 real $20 test transaction with your personal card, verify database upgrade, and immediately issue a refund from the Stripe dashboard.

---

## 3. Host, Custom Domain & DNS Records

### Web Hosting (Vercel)
Connect repository to Vercel. Set production branch to `main`.

### DNS Records (Add at your domain registrar: Cloudflare, Namecheap, Google Domains)

| Type | Name / Host | Target / Value | TTL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| **A** | `@` | `76.76.21.21` | Auto / 300 | Vercel Apex IP |
| **CNAME** | `www` | `cname.vercel-dns.com` | Auto / 300 | Vercel WWW Redirect |
| **TXT** | `@` | `v=spf1 include:resend.com ~all` | Auto / 300 | SPF Email Authentication |
| **CNAME** | `resend._domainkey` | `dkim.resend.com` | Auto / 300 | DKIM Cryptographic Email Signature |
| **TXT** | `_dmarc` | `v=DMARC1; p=none; rua=mailto:dmarc@kinetixai.dev` | Auto / 300 | DMARC Phishing Protection |

- **Canonical Host:** `https://kinetixai.dev` (Redirect `www.kinetixai.dev` -> `https://kinetixai.dev`).
- **SSL / TLS:** Managed automatically by Vercel Let's Encrypt certificates.

---

## 4. Telemetry & Post-Launch Monitoring (Week 1)

1. **Error Tracking (Sentry):**
   - Monitor client-side uncaught exceptions in sandboxed iframe executions.
   - Monitor SSE disconnects and API gateway timeouts.
2. **Uptime Monitoring (BetterStack):**
   - 60-second ping check on `https://kinetixai.dev`.
   - Health probe on `https://kinetixai.dev/api/projects`.
3. **Smoke Test Verification:**
   - [ ] Perform core flow on desktop (Chrome / Safari): Login -> Prompt -> Live Thinking -> HTML Artifact Execution -> Multi-file ZIP Export.
   - [ ] Perform core flow on mobile viewport (390px): Sidebar collapse -> Prompt -> Artifact Drawer slide-over.
4. **Billing Verification:**
   - Verify test cancellation via Customer Portal successfully downgrades account at period end.
