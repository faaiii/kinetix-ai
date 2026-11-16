# Test Plan: Claude.ai Full Brain Replica

Build: Next.js 15.5.29 / React 19  
Date: 2026-11-16  
Env: Local dev / Test fixtures  

---

## Test Cases by Flow

| Case ID | Flow | Type | Steps | Expected Result | Mode | Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **F01-H1** | F01: Send Prompt & Stream | Happy Path | Open `/`, type "Explain quantum superposition in 2 sentences", click Send | Message bubble appears, streaming tokens append in real-time, completed answer renders with no console errors | e2e | PASS |
| **F01-E1** | F01: Send Prompt & Stream | Edge: Empty prompt | Open `/`, press Enter with whitespace or empty input | Send button remains disabled; no message dispatched | e2e | PASS |
| **F01-E2** | F01: Send Prompt & Stream | Edge: Very long prompt | Paste 5,000 character prompt, press Enter | Textarea auto-expands to max-height (200px) then scrolls cleanly; message submits without clipping | e2e | PASS |
| **F01-E3** | F01: Send Prompt & Stream | Edge: Abort generation | Send prompt, immediately click red Stop button while streaming | Stream terminates immediately; partial tokens preserved in bubble; input re-enabled | e2e | PASS |
| **F01-E4** | F01: Send Prompt & Stream | Edge: Extended Thinking | Select Claude 3.7 Sonnet, toggle Thinking On, send prompt | `<ThinkingAccordion>` renders with pulsing Brain icon and timer; thought summary collapses/expands cleanly | e2e | PASS |
| **F01-N1** | F01: Send Prompt & Stream | Negative: Network error | Simulate network disconnection during SSE stream | Stream disconnects with graceful error badge; retry button appears | manual | PASS |
| **F02-H1** | F02: Artifact Canvas | Happy Path | Send prompt "Create an interactive sales dashboard in HTML and SVG" | Split canvas smoothly slides in from right; Preview tab renders sandboxed iframe with interactive hover chart | e2e | PASS |
| **F02-H2** | F02: Artifact Canvas | Happy Path | In active artifact canvas, click "Code" tab | Raw HTML/SVG syntax displays in dark-themed code block with copy and download buttons | e2e | PASS |
| **F02-E1** | F02: Artifact Canvas | Edge: Copy code | Click Copy button in Artifact header | Checkmark icon flashes ("Copied!"); clipboard receives full source code | e2e | PASS |
| **F02-E2** | F02: Artifact Canvas | Edge: Fullscreen toggle | Click Maximize button on artifact canvas | Drawer expands to 100vw fixed overlay; minimize button returns to 50% split | e2e | PASS |
| **F02-E3** | F02: Artifact Canvas | Edge: Malicious script sandbox | Render artifact with script trying `window.parent.document` | Browser blocks DOM access (`Blocked a frame with origin from accessing a cross-origin frame`) due to strict `sandbox="allow-scripts"` | e2e | PASS |
| **F03-H1** | F03: Project Knowledge | Happy Path | Navigate to `/projects`, click "New Project", fill title & instructions, submit | New project created, card appears in list, context budget initializes at 0% | e2e | PASS |
| **F03-H2** | F03: Project Knowledge | Happy Path | Inside project detail, click "Start Project Chat" | Navigates to `/` with project custom instructions bound to conversation context | e2e | PASS |
| **F03-E1** | F03: Project Knowledge | Edge: Token budget meter | View project with 48.5k tokens of attached docs | Context bar shows 24.3% fill with green/accent color; exact token tally displayed | e2e | PASS |
| **F03-N1** | F03: Project Knowledge | Negative: File size > 10MB | Upload 12MB file to `POST /api/projects/:id/files` | Returns HTTP 400 with "File size exceeds maximum 10MB limit" | e2e | PASS |
| **F04-H1** | F04: Branching & Edits | Happy Path | Hover sent message, click Edit icon, modify text, submit | New assistant response generated; `< 1 / 2 >` branch paginator appears to toggle versions | manual | PASS |
| **F05-H1** | F05: Conversation Sharing | Happy Path | Click Share button on chat thread, copy public snapshot link | Read-only static snapshot view opens with bundled messages and artifacts | manual | PASS |
| **F06-H1** | F06: Billing & Usage | Happy Path | Open `/settings`, view "Plan & Usage" card | Active Pro plan badge displayed, 5-hour rolling capacity meter shows 18/45 messages used | e2e | PASS |
| **F06-H2** | F06: Billing & Usage | Happy Path | Click "Manage Stripe Billing Portal" button | Dispatches `POST /api/billing/portal` and redirects to Stripe customer portal URL | e2e | PASS |
| **F06-N1** | F06: Billing & Usage | Negative: Card declined | Trigger checkout with test card `4000 0000 0000 0002` | Stripe displays "Your card was declined"; subscription record remains in current state | manual | PASS |
