# Architecture: Claude.ai Full Brain Replica

A clean-room rebuild of Claude.ai's conversational intelligence workspace, interactive artifacts canvas, and project knowledge architecture.

---

## 1. Stack

| layer | choice | why |
| --- | --- | --- |
| **Web App** | Next.js 15 (App Router) + TypeScript + React 19 | Industry standard for streaming SSR/RSC, Server-Sent Events (SSE), and split-pane layout management. |
| **Styling** | Tailwind CSS + Radix UI Primitives + Lucide Icons | Accessible headless components, ultra-fast styling with design tokens derived from `replica-design`. |
| **Database** | PostgreSQL 15+ on Supabase or Neon | Robust relational storage for message trees, foreign key cascades, and row-level security (RLS). |
| **ORM & Migrations** | Drizzle ORM | Zero-overhead, type-safe SQL query builder with edge-compatible migration tooling. |
| **Authentication** | Supabase Auth (or Auth.js) | Passwordless magic links, Google OAuth, and secure HTTP-only JWT session management. |
| **AI Streaming Gateway** | Vercel AI SDK (`ai` core) | Unified streaming adapter supporting Claude 3.7 / Gemini 2.0 / OpenAI / DeepSeek with thinking token parsing. |
| **Artifact Sandbox** | Sandboxed `<iframe>` with Blob URLs + Babel Standalone | Client-side isolation (`sandbox="allow-scripts"`) preventing parent window access while running live React/HTML/SVG. |
| **File Storage** | Supabase Storage / Cloudflare R2 | S3-compatible cheap object storage for uploaded PDFs, images, and project knowledge documents. |
| **Payments & Billing** | Stripe Checkout + Billing Portal | Standard self-serve subscription billing for Free, Pro ($20/mo), and Team tiers. |
| **Background Jobs** | Inngest or Trigger.dev | Reliable serverless job orchestration for document text extraction, token counting, and usage quota rollups. |
| **Hosting** | Vercel (Edge & Serverless) | Global CDN edge caching and long-lived streaming connections with automatic deployments. |

---

## 2. Schema

The full relational schema is defined in [schema.sql](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/replica/schema.sql).

- **Table Count:** 11 relational tables
  - `users`: Core profile, preferences (theme, font), default model.
  - `organizations`: Multi-tenant boundary, plan tier, Stripe customer/subscription links.
  - `organization_members`: Role-based access (`owner`, `admin`, `member`).
  - `projects`: Workspace containers for custom instructions and scoped chats.
  - `project_files`: Uploaded reference knowledge files, token count, and extracted text.
  - `conversations`: Chat sessions with model config, star/archive flags, and project scoping.
  - `messages`: Self-referencing parent/child tree (`parent_message_id`) for branch navigation, thinking blocks, and token counts.
  - `artifacts`: Versioned interactive units (`v1, v2...`) linked by stable `identifier`.
  - `conversation_shares`: Public share tokens with immutable JSON snapshot data.
  - `style_presets`: Custom instruction tone/verbosity directives.
  - `usage_records`: Rolling 5-hour window token and message rate-limiting meters.
- **Access Rules:** PostgreSQL Row-Level Security (RLS) enabled on all tables, isolating data by `auth.uid()` and organization membership.

---

## 3. API & Routes

### Flow 1: Core Prompt & Streaming Chat (`F01`)
| method & path | what it does | who can call it | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `POST /api/chat` | Initiates or continues chat; streams assistant tokens & thinking | Authenticated User | `{ conversationId?, message, parentMessageId?, modelId, attachments? }` | `text/event-stream` (SSE chunks: text, thinking, artifact tags) | F01 |
| `POST /api/chat/:id/abort` | Aborts active SSE generation stream | Conversation Owner | `{ messageId }` | `{ success: true }` | F01 |
| `GET /api/chat/:id` | Fetches conversation thread and active message branch | Conversation Owner / Member | `none` | `{ conversation, messages: Message[] }` | F01 |

### Flow 2: Artifact Generation & Version Switching (`F02`)
| method & path | what it does | who can call it | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `GET /api/chat/:id/artifacts` | Lists all artifacts generated in a conversation | Conversation Owner | `none` | `ArtifactSummary[]` | F02 |
| `GET /api/artifacts/:identifier/versions` | Fetches all versions (v1, v2...) of an artifact | Conversation Owner | `none` | `Artifact[]` | F02 |

### Flow 3: Project Knowledge Workspace (`F03`)
| method & path | what it does | who can call it | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `GET /api/projects` | Lists user/organization projects | Org Member | `none` | `Project[]` | F03 |
| `POST /api/projects` | Creates a new project | Org Member | `{ title, description?, customInstructions? }` | `Project` | F03 |
| `POST /api/projects/:id/files` | Uploads and processes knowledge documents | Project Creator / Admin | `FormData` (file: pdf/txt/csv/md) | `{ fileId, filename, tokenCount }` | F03 |
| `DELETE /api/projects/:id/files/:fileId` | Removes file and updates context budget | Project Creator / Admin | `none` | `{ success: true }` | F03 |

### Flow 4: Message Branching & Edits (`F04`)
| method & path | what it does | who can call it | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `POST /api/messages/:id/edit` | Edits user prompt; creates new child branch and streams response | Message Owner | `{ newContent }` | `text/event-stream` | F04 |
| `GET /api/messages/:id/branches` | Returns sibling versions for a turn | Conversation Owner | `none` | `{ versions: Message[], activeIndex: number }` | F04 |

### Flow 5: Conversation Sharing (`F05`)
| method & path | what it does | who can call it | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `POST /api/chat/:id/share` | Generates public read-only share snapshot | Conversation Owner | `{ includeArtifacts: boolean }` | `{ shareUrl, shareToken }` | F05 |
| `GET /api/share/:token` | Fetches static public conversation snapshot | Public | `none` | `{ snapshotData, createdAt }` | F05 |
| `POST /api/share/:token/fork` | Clones shared chat into authenticated user account | Authenticated User | `none` | `{ newConversationId }` | F05 |

### Flow 6: Billing & Usage Limits (`F06`)
| method & path | what it does | who can call it | input | output | flow |
| --- | --- | --- | --- | --- | --- |
| `GET /api/usage` | Returns current rolling window message usage and cooldown | Authenticated User | `none` | `{ usedMessages, maxMessages, cooldownEnd? }` | F06 |
| `POST /api/billing/checkout` | Creates Stripe Checkout session for Pro/Team | Org Owner / Admin | `{ planTier: 'pro' \| 'team', seats? }` | `{ checkoutUrl }` | F06 |
| `POST /api/billing/portal` | Generates Stripe Customer Billing Portal session | Subscribed Org Owner | `none` | `{ portalUrl }` | F06 |

### Webhooks & Background Jobs
- **Webhooks In:**
  - `POST /api/webhooks/stripe`: Handles `checkout.session.completed`, `customer.subscription.updated`, and `customer.subscription.deleted`. Updates `organizations.plan_tier`.
- **Background Jobs (Inngest / Trigger.dev):**
  - `jobs/process-project-file`: Triggers on upload. Extracts text from PDF/Doc, calculates token count with `gpt-tokenizer`, updates `project_files.extracted_text`.
  - `jobs/generate-chat-title`: Triggers after turn 1. Uses lightweight model (Haiku/Flash) to generate a concise 4-word title for `conversations.title`.
  - `jobs/cleanup-expired-shares`: Daily cron cleaning public shares past expiration.

---

## 4. The Parts That Bite

- **Real-time SSE Streaming & Buffering:** Next.js edge/serverless routes terminate if streams stall. Must write heartbeat pings (`: ping\n\n`) every 15s and pipe `AbortSignal` directly to the LLM client when the user cancels.
- **Iframe Sandbox Isolation:** Code generated by LLMs may attempt XSS or token exfiltration. The artifact iframe must use strict sandboxing: `sandbox="allow-scripts"` with **no** `allow-same-origin`, loading content via ephemeral `Blob` URLs or `srcdoc` with strict CSP.
- **Branching Message Trees:** Storing conversation as a flat array breaks when users edit earlier prompts. The schema uses `parent_message_id`. Client state maintains the active leaf ID and traverses upward to assemble the linear context window.
- **Token Budget & Context Clipping:** Large project knowledge bases can easily exceed model limits. Files must be pre-counted, and system prompts must assemble project context using structured XML delimiters (`<project_context>...</project_context>`) to leverage prompt caching.
- **Stripe Webhook Idempotency:** Stripe sends events more than once. Store processed `event.id` in a dedicated `processed_events` table within a PostgreSQL transaction before updating subscription status.
- **Rolling Rate Limit Windows:** Fixed hourly limits cause spike thundering herds. Use a sliding 5-hour window stored in `usage_records` to calculate real-time availability.

---

## 5. Build Order

### Milestone 1: Thin Vertical Slice (Core Loop)
- **Goal:** User can sign in, start a chat, send a prompt, and see an SSE streaming response.
- **Screens:** `S01` (Auth), `S02` (New Chat), `S03` (Chat Timeline).
- **Tables:** `users`, `conversations`, `messages`.
- **Routes:** `POST /api/chat`, `GET /api/chat/:id`.

### Milestone 2: Artifacts Canvas & Extended Thinking
- **Goal:** Side-by-side split screen rendering code, SVG, and HTML in an isolated sandbox, plus collapsible thinking accordions.
- **Screens:** `S03` (Timeline with Thinking), `S04` (Artifacts Split Pane).
- **Tables:** `artifacts`.
- **Routes:** `GET /api/chat/:id/artifacts`, `GET /api/artifacts/:identifier/versions`.

### Milestone 3: Projects & Knowledge Base Grounding
- **Goal:** Projects workspace with custom instructions, file uploads, token meter, and scoped project chats.
- **Screens:** `S05` (Projects Hub), `S06` (Project Workspace), `S07` (Sidebar Navigation).
- **Tables:** `projects`, `project_files`.
- **Routes:** `GET /api/projects`, `POST /api/projects`, `POST /api/projects/:id/files`.
- **Jobs:** `process-project-file`.

### Milestone 4: Branching, Sharing, and Commercialization
- **Goal:** Edit/regenerate branch trees, public conversation sharing, Stripe subscription billing, and 5-hour usage limit meters.
- **Screens:** `S08` (Styles), `S09` (Shared Chat), `S10` (Settings), `S11` (Billing).
- **Tables:** `organizations`, `organization_members`, `conversation_shares`, `style_presets`, `usage_records`.
- **Routes:** `POST /api/messages/:id/edit`, `POST /api/chat/:id/share`, `GET /api/share/:token`, `POST /api/billing/checkout`.
- **Webhooks:** `POST /api/webhooks/stripe`.

---

## Output Files
- [architecture.md](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/replica/architecture.md)
- [schema.sql](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/replica/schema.sql)
