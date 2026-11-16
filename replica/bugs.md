# Bug Report: Claude.ai Full Brain Replica

This file records all defects discovered, their severity classification, reproduction steps, and fix statuses.

---

### BUG-001: Stripe Checkout SDK `payment_method_types` TypeScript Collision

- **Severity:** S3 (Broken build with workaround)
- **Flow / Case:** F06 / F06-H2
- **Screen:** S11 (`/settings`) & `POST /api/billing/checkout`
- **Build:** `Next.js 15.5.29 / Stripe 17.5.0` | Browser / device: All

**Steps:**
1. Install latest `stripe` npm SDK (v17+).
2. Invoke `stripe.checkout.sessions.create` with explicit `payment_method_types: ['card']`.
3. Run `npm run build`.

**Expected:** Type-checks cleanly with standard payment methods.  
**Actual:** Webpack/TypeScript compilation failed: `'payment_method_types' does not exist in type 'SessionCreateParams'`.  
**Evidence:** Compilation trace in `task-246.log`.  
**Suspected Cause:** Stripe v17 SDK encourages automatic dynamic payment methods configured in the dashboard rather than hardcoded array parameters.  
**Status:** **Fixed** (Removed deprecated parameter from `src/app/api/billing/checkout/route.ts`).

---

### BUG-002: Windows Sandbox mkdir EPERM Race Condition on Route Generation

- **Severity:** S3 (Build failure on fresh subdirectories)
- **Flow / Case:** Build Step
- **Screen:** S01–S12
- **Build:** Windows Server / PowerShell | Node v24.20.0

**Steps:**
1. Create new nested API routes under `src/app/api/webhooks/stripe/`.
2. Execute `next build` inside sandboxed process.

**Expected:** Next.js creates `.next/server/app/api/webhooks/` directory automatically.  
**Actual:** Intermittent `EPERM: operation not permitted, mkdir` thrown by Windows file system locking.  
**Evidence:** `Error: EPERM: operation not permitted, mkdir ...\.next\types\app\api\webhooks`.  
**Suspected Cause:** Known Windows file-locking latency during webpack parallel build worker directory initialization.  
**Status:** **Fixed** (Pre-allocated build directory hierarchy via PowerShell before worker invocation).

---

## Testing QA Summary

| Severity | Meaning | Open | Fixed | Total |
| :--- | :--- | :---: | :---: | :---: |
| **S1** | Data loss, security hole, payments broken, core flow blocked | 0 | 0 | 0 |
| **S2** | Feature broken, no workaround | 0 | 0 | 0 |
| **S3** | Broken with a workaround, or visibly wrong | 0 | 2 | 2 |
| **S4** | Minor cosmetic styling | 0 | 0 | 0 |
| **Total** | | **0** | **2** | **2** |

**Zero open S1 or S2 blockers.** The application is ready for feature parity diffing via `/replica-diff`.
