# Recon map: Claude.ai (Web / Responsive Desktop)

Scope: Full Brain Replica (Conversational AI, Extended Thinking, Artifacts Canvas, Projects Knowledge Workspace, Organization/Team Management, Multi-tier Billing)  
For: Independent developers, teams, and enterprises building a clean-room, self-hosted or customizable AI workspace with an interactive artifacts canvas  
Date: 2026-11-16  

---

## Sources

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | Help Center / Support | `https://support.anthropic.com` | Comprehensive documentation on Projects, Artifacts, usage limits, subscriptions, and team workspaces. |
| 2 | Pricing & Plans | `https://claude.ai/pricing` | Feature gating rules between Free, Pro ($20/mo), and Team ($30/seat/mo) plans. |
| 3 | Anthropic News / Changelog | `https://anthropic.com/news` | Launches for Artifacts, Extended Thinking, Projects, Prompt Caching, and mobile apps. |
| 4 | Public Marketing Site | `https://claude.ai` | Positioning, headline value props, and core feature demonstrations. |
| 5 | Public API Documentation | `https://docs.anthropic.com/en/api` | Exact message structure, system prompts, tool use schemas, thinking tokens, and multimodal payloads. |
| 6 | Active User Account / UI | `https://claude.ai/new` | Direct inspection of DOM hierarchy, state transitions, SSE streaming events, and responsive layouts. |

---

## Core loop

Users prompt frontier LLMs with attached files and custom instructions, receive low-latency streaming answers with visible reasoning blocks, and iteratively co-create, inspect, and run code/visual components in a side-by-side interactive Artifacts canvas.

---

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| **S01** | Landing & Auth Gate | `/` or `/login` | Authenticate users via magic links or Google OAuth; explain product capabilities | Auth modal, OAuth buttons, email input, hero demo, terms disclaimer | Default, email sent, invalid token, rate limited |
| **S02** | New Chat (Home) | `/new` or `/chat/new` | Primary starting canvas to compose prompts, select models, and view suggested starters | Hero greeting, prompt input box, model selector dropdown, style preset picker, file dropzone, starter prompt pills | Empty, dragging file, model dropdown open, offline |
| **S03** | Active Conversation Timeline | `/chat/:chat_id` | Chronological multi-turn interaction stream with streaming output and controls | Message thread, User bubble, Assistant bubble, Markdown parser, LaTeX engine, Thinking accordion, Branch navigation (`< 1/n >`), Action toolbar (copy, retry, edit), Chat title header, Share button | Loading history, streaming tokens, thinking active, generation paused, rate-limit blocked, error |
| **S04** | Artifacts Canvas (Split Pane) | `/chat/:chat_id` (auto-opens upon artifact emission) | Live side-by-side workspace to inspect, execute, and version code, documents, SVGs, and web components | Split-pane slider, Artifact header (title, type badge, version dropdown), Tab switch (Code / Preview), Code editor/viewer with syntax highlighting, Sandboxed sandboxed iframe runner, Copy/Download buttons, Fullscreen toggle | Initial render, loading sandbox, error in code execution, version v1/v2 switched, fullscreen |
| **S05** | Projects Directory | `/projects` | Overview hub for user and team project workspaces | Project card grid, "New Project" button, search/filter input, project star indicators | Empty (no projects), populated, search no results |
| **S06** | Project Detail & Knowledge Workspace | `/project/:project_id` | Context-grounded hub configuring custom instructions, knowledge documents, and scoped chats | Project header, Custom instructions editor, Knowledge files list, Context window usage bar (% tokens used), "Start project chat" CTA, Project chats list | Empty files, uploading document, token limit warning, active chats |
| **S07** | Sidebar & History Drawer | Fixed Left Navigation (collapsible) | Global navigation, conversation history, recent projects, and account settings access | Collapsible sidebar, New chat CTA, Search chats overlay trigger, Pinned chats section, Chronological chat list, Project list, User profile avatar / menu | Expanded, collapsed, active item highlight, hover action menu (rename, star, delete) |
| **S08** | Custom Styles & Instructions Modal | `/settings/styles` or modal from `/new` | Tailor global model tone, verbosity, and behavioral directives | Style cards (Default, Concise, Explanatory, Formal), "Create custom style" form, custom prompt instructions field | Default, editing custom style, saving |
| **S09** | Public Shared Chat View | `/share/:share_token` | Read-only static snapshot of shared conversation and bundled artifacts | Read-only timeline, artifact preview panel, Anthropic branding header, "Continue this chat" clone CTA button | Active snapshot, revoked / expired share link |
| **S10** | Account & App Settings | `/settings/account` | Configure personal profile, theme, font preferences, and session data | Profile picture upload, display name field, Theme selector (Light / Dark / System), Font selector, Export data button, Delete account dialog | Default, saving changes, export pending, confirmation modal |
| **S11** | Plans & Billing Portal | `/settings/billing` | Manage tier upgrades (Pro / Team), view billing history, and monitor message limits | Plan comparison cards, Stripe checkout trigger, active subscription status, usage quota progress bar | Free tier, Pro active, payment delinquent, quota exhausted cooldown |
| **S12** | Organization & Team Admin | `/settings/team` | Administer team members, seat allocation, invites, and shared project access | Member table, Role dropdown (Owner, Admin, Member), "Invite Member" modal, SSO config (enterprise) | Member list populated, invite sent, pending invitations |

---

## Flows

```
F01 Send prompt with file and stream response
    S02 -> attach file -> type prompt -> click send -> S03
    happy path clicks: 3 (attach -> send -> view stream)
    edge: file exceeds token budget, unsupported mime type, stream interrupted by network loss, rate limit hit during generation

F02 Generate, inspect, and iterate on an interactive Artifact
    S03 (user asks for dashboard or tool) -> Assistant emits artifact tag -> S04 split-pane slides in -> Preview renders in sandbox -> User prompts iteration -> Artifact v2 emitted
    happy path clicks: 2 (send prompt -> click version dropdown to compare v1/v2)
    edge: sandbox script error, malicious code execution blocked by iframe sandbox, unsupported rendering format

F03 Ground chats in a dedicated Project Knowledge Base
    S07 -> S05 -> click "New Project" -> S06 -> paste instructions -> drop reference documents -> click "Start Chat" -> S03 (scoped to project)
    happy path clicks: 5
    edge: document parsing failure, total knowledge exceeds 200k/1M token limit, project archived by another team member

F04 Edit prompt and navigate branching message tree
    S03 -> hover sent message -> click Edit -> modify text -> click Save & Submit -> new assistant branch generated -> toggle < 1 of 2 >
    happy path clicks: 4
    edge: editing root message when child thread has 20 turns, switching branches while an artifact is currently open

F05 Share conversation snapshot publicly
    S03 -> click Share button -> toggle "Include artifacts" -> click Copy Link -> S09 (opened in incognito) -> recipient clicks "Continue this chat" -> S03 (forked into recipient account)
    happy path clicks: 4
    edge: conversation contains deleted project references, share link revoked by author, recipient not logged in

F06 Usage limit cooldown enforcement
    S03 -> user sends prompt -> backend detects rolling 5-hour message cap reached -> S03 shows cooldown banner ("Claude will be available at 6:00 PM") -> prompt input disabled
    happy path clicks: 0 (automatic gate upon sending)
    edge: user upgrades to Pro mid-cooldown, cooldown timer synchronizes with client local clock
```

---

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| **Button** | primary, secondary, ghost, danger, icon-only | default, hover, active, focus, disabled, loading | all |
| **ChatInput** | multiline expandable, compact | empty, focused, filled, disabled (cooldown), drag-over | S02, S03 |
| **ModelSelector** | dropdown pill (Haiku / Sonnet / Opus / Reasoning) | collapsed, open, selected | S02, S03 |
| **ThinkingAccordion** | collapsible reasoning card | thinking in progress (pulsing timer), collapsed, expanded | S03 |
| **MessageBubble** | user, assistant, system notice | default, hover (reveals action buttons), editing | S03 |
| **MarkdownRenderer** | GFM body, prose, tables, math | default, streaming chunk append | S03, S04 |
| **CodeBlock** | syntax-highlighted block with top bar | default, hover, copy clicked ("Copied!"), language badge | S03, S04 |
| **ArtifactDrawer** | side canvas (50% split, 70% expanded, full modal) | closed, opening transition, open, maximized | S03, S04 |
| **SandboxedIframe** | sandboxed HTML/SVG/React sandbox | loading, active, script error boundary | S04 |
| **ContextUsageMeter** | linear progress bar with percentage | <50% (green), 50-80% (amber), >80% (red/warning) | S06, S11 |
| **FileDropzone** | inline chat attachment button, large project dropzone | default, dragging, uploading, thumbnail preview, delete chip | S02, S03, S06 |
| **BranchPaginator** | `< n / m >` inline turn switcher | disabled (single version), active | S03 |
| **SidebarNav** | persistent desktop drawer, mobile slide-over | expanded, collapsed, item active, item hover menu | all |
| **ModalDialog** | confirmation, auth, share link, settings | open, closing, backdrop click | S01, S05, S07, S10 |

---

## Inferred data model

```
User
  id: uuid (pk)
  email: string (unique)
  display_name: string
  avatar_url: string (nullable)
  default_model: string
  created_at: timestamp
  evidence: S01 auth flow, S10 profile settings, API auth token
  confidence: high

Organization / Workspace
  id: uuid (pk)
  name: string
  slug: string
  plan_tier: enum ('free', 'pro', 'team', 'enterprise')
  stripe_customer_id: string (nullable)
  stripe_subscription_id: string (nullable)
  created_at: timestamp
  evidence: S11 billing portal, S12 team admin screen, pricing page
  confidence: high

OrganizationMember
  id: uuid (pk)
  organization_id: uuid (fk -> Organization)
  user_id: uuid (fk -> User)
  role: enum ('owner', 'admin', 'member')
  created_at: timestamp
  evidence: S12 team roles dropdown
  confidence: high

Project
  id: uuid (pk)
  organization_id: uuid (fk -> Organization)
  created_by: uuid (fk -> User)
  title: string
  description: text (nullable)
  custom_instructions: text (nullable)
  is_pinned: boolean
  created_at: timestamp
  updated_at: timestamp
  evidence: S05 projects grid, S06 project workspace
  confidence: high

ProjectKnowledgeFile
  id: uuid (pk)
  project_id: uuid (fk -> Project)
  filename: string
  file_size: integer
  mime_type: string
  storage_path: string
  extracted_text: text
  token_count: integer
  created_at: timestamp
  evidence: S06 project knowledge list and token gauge
  confidence: high

Conversation
  id: uuid (pk)
  organization_id: uuid (fk -> Organization)
  user_id: uuid (fk -> User)
  project_id: uuid (nullable, fk -> Project)
  title: string
  model_id: string
  system_prompt: text (nullable)
  style_preset: string (nullable)
  is_starred: boolean
  is_archived: boolean
  created_at: timestamp
  updated_at: timestamp
  evidence: S02 new chat, S03 timeline, S07 history sidebar
  confidence: high

Message
  id: uuid (pk)
  conversation_id: uuid (fk -> Conversation)
  parent_message_id: uuid (nullable, self-fk -> Message for branch trees)
  role: enum ('user', 'assistant', 'system')
  content: text
  thinking_content: text (nullable)
  attachments: jsonb (nullable)
  model_used: string (nullable)
  token_usage: jsonb (input, output, cache_read, cache_creation)
  finish_reason: string (nullable)
  created_at: timestamp
  evidence: S03 message bubbles, API messages endpoint response schema
  confidence: high

Artifact
  id: uuid (pk)
  conversation_id: uuid (fk -> Conversation)
  message_id: uuid (fk -> Message)
  identifier: string (stable identifier across versions, e.g. "sales-dashboard")
  title: string
  type: enum ('code', 'html', 'svg', 'markdown', 'react')
  language: string (nullable, e.g. "python", "typescript", "html")
  content: text
  version: integer (1, 2, 3...)
  created_at: timestamp
  evidence: S04 artifact split-screen, artifact version dropdown
  confidence: high

ConversationShare
  id: uuid (pk)
  conversation_id: uuid (fk -> Conversation)
  created_by: uuid (fk -> User)
  share_token: string (unique)
  is_public: boolean
  snapshot_data: jsonb
  created_at: timestamp
  evidence: S03 share button, S09 public shared view
  confidence: high

StylePreset
  id: uuid (pk)
  user_id: uuid (fk -> User)
  name: string
  directives: text
  is_default: boolean
  evidence: S08 custom styles modal
  confidence: medium
```

### Relationships
- `Organization` 1-n `OrganizationMember` n-1 `User`
- `Organization` 1-n `Project` 1-n `ProjectKnowledgeFile`
- `Organization` 1-n `Conversation` 1-n `Message`
- `Project` 1-n `Conversation` (optional scoping)
- `Message` 1-n `Message` (self-referential parent/child tree for edit branching)
- `Conversation` 1-n `Artifact` (grouped by `identifier` and ordered by `version`)
- `Conversation` 1-n `ConversationShare`

---

## Feature matrix

See [features.csv](file:///C:/Users/faisa/.gemini/antigravity/scratch/claude-replica/replica/features.csv).  
- **Must**: 26 (Core chat, token streaming, thinking UI, artifacts viewer/sandbox, markdown/math, projects, file uploads, history, usage limits)  
- **Should**: 9 (React artifact transpilation, full-text search, conversation sharing & cloning, custom styles, prompt caching, data export)  
- **Could**: 4 (Team workspaces, role-based access, centralized seat billing)  
- **Skip**: 2 (Proprietary model training/weights and internal TPU/GPU infrastructure)  

---

## Out of scope (cannot or should not be cloned)

1. **Proprietary Frontier Model Weights & Training Infrastructure**: We cannot clone Anthropic's proprietary pre-training weights or RLHF/constitutional training clusters. The replica uses clean-room architecture consuming frontier LLM APIs (Gemini 1.5/2.0 Pro/Flash, Claude 3.5 Sonnet API, or open-weights like Llama 3/DeepSeek) behind an adapter interface.
2. **Anthropic Internal Safety Red-Teaming & Classification Harness**: Internal automated classifiers and proprietary trust & safety backends are replaced with standard provider safety filters or open-source moderation guardrails.
3. **Proprietary Network Peering & Edge Hardware**: Edge routing relies on commodity CDNs (Cloudflare / Fastly) rather than proprietary custom network points-of-presence.

---

## Size

- **Inventory**: 12 Screens, 6 Core User Flows, 10 Inferred Entities.
- **Hard Parts**:
  1. *Real-time SSE token streaming* with bidirectional aborting and progressive rendering of embedded Artifact and Thinking blocks.
  2. *Secure multi-runtime Artifact Sandbox* executing untrusted code, HTML, SVG, and client-side React safely inside isolated iframes without parent window DOM/credential access.
  3. *Project Context & Token Budget Optimizer* combining system instructions, multi-file text extractions, and conversation history within provider context limits (with prompt caching).
  4. *Branching message tree architecture* (`parent_message_id`) allowing seamless multi-turn backtracking and editing.
- **Size**: **L** (A quarter for full production multi-tenant app with teams and Stripe billing; **M** / 3–4 weeks for a focused single-tenant vertical slice implementing Core Chat + Thinking + Artifacts Canvas + Projects).
