# Pricing Strategy: Kinetix

---

## 1. Competitive Pricing Matrix

Read Date: 2026-11-16

| Platform | Free Tier | Pro Tier (Monthly / Annual) | Team Tier | Limits & Oversights |
| :--- | :--- | :--- | :--- | :--- |
| **Claude.ai** (`claude.ai/pricing`) | Basic access, tight daily limits | $20 / mo (no annual discount) | $30 / user / mo (min 5 seats) | Strict 5-hour rolling lockout without token counters or BYOK fallback. |
| **ChatGPT Plus** (`openai.com/chatgpt/pricing`) | GPT-4o mini, rate-capped 4o | $20 / mo (no annual discount) | $25 / user / mo | Opaque message limits during peak hours; no isolated artifact iframe sandbox. |
| **Cursor** (`cursor.com/pricing`) | 2,000 completions | $20 / mo ($16 billed annually) | $40 / user / mo | Focused on editor tab completions rather than conversational architectural co-creation. |
| **Kinetix (Our Plan)** | **Free (Generous starters)** | **$20 / mo ($16 annual - 2 months free)** | **$30 / user / mo (no seat minimums)** | **Full live token telemetry, BYOK overflow fallback, multi-file ZIP export, and local Ollama support.** |

---

## 2. Review Feedback on Price & Billing

From [feedback.md](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/replica/feedback.md):
- **Price & Paywalls (5 reviews, 42% share):** Users resent paying $20/month only to get abruptly locked out after a short session because hidden conversation history burned through the budget.
- **Billing & Cancellation (2 reviews, 17% share):** Complaints about difficult cancel buttons, unexpected auto-renewals, and non-existent refund support.

---

## 3. Product Billing Principles

1. **Transparent Quota Telemetry:** The client displays live token counts and usage percentages on every message. Users never wonder why their budget changed.
2. **BYOK Overflow (Zero Lockouts):** When a user exhausts their standard monthly allowance, they are never blocked. They can plug in their own provider API key and continue at cost.
3. **One-Click Instant Cancellation:** Customers can cancel their subscription at any time directly through the Stripe Customer Portal with no dark patterns, confirmation friction, or retention tricks.
4. **Annual Incentive:** Annual billing offers 20% savings ($192/year equivalent to $16/month, giving 2 months free).

---

## 4. Tiers & Feature Packaging

### Tier 1: Developer (Free)
- **Target:** Individual builders, open-source contributors, students.
- **Price:** $0.
- **Included:** Core chat canvas, standard models, interactive HTML/SVG artifact sandbox, 3 active project workspaces, up to 10MB file context.

### Tier 2: Pro (Most Popular)
- **Target:** Professional developers, technical leads, power users.
- **Price:** $20 / month (or $16 / month billed annually at $192/year).
- **Included:** Flagship Kinetix Reasoning engine, 5x token capacity, live token and cost telemetry, instant BYOK overflow fallback, multi-file artifact ZIP download, local model connector (Ollama).

### Tier 3: Team
- **Target:** Engineering teams, technical consultancies, startups.
- **Price:** $30 / seat / month (or $25 / seat / month billed annually).
- **Included:** Everything in Pro, shared team project knowledge bases, role-based access control (Owner, Admin, Member), centralized Stripe invoicing, priority support.

---

## 5. Stripe Setup Checklist (For App Owner)

To be created in the Stripe Dashboard (Test Mode first, then Live):

1. **Product: `Kinetix Pro`**
   - Monthly Price: `$20.00 USD / month` (recurring) -> Assign ID to `STRIPE_PRO_MONTHLY_PRICE_ID`
   - Annual Price: `$192.00 USD / year` (recurring)
2. **Product: `Kinetix Team`**
   - Monthly Price: `$30.00 USD / user / month` (recurring per unit) -> Assign ID to `STRIPE_TEAM_MONTHLY_PRICE_ID`
   - Annual Price: `$300.00 USD / user / year` (recurring per unit)
3. **Stripe Customer Portal Configuration:**
   - Enable "Cancel subscription" (effective at end of billing period).
   - Enable "Update payment method".
   - Enable "View invoice history".
