# Build Log: Claude.ai Full Brain Replica

- **S01 Landing & Auth Gate**: 2026-11-16 | partial | Mock auth session state implemented; OAuth callback and live Supabase token exchange delegated to replica-backend.
- **S02 New Chat (Home)**: 2026-11-16 | done | Clean hero greeting, prompt starters, model selector (Sonnet 3.7, Haiku 3.5, Opus 3), extended thinking toggle, and expanding input box with attachment support.
- **S03 Active Conversation Timeline**: 2026-11-16 | done | Multi-turn message bubbles, live token streaming simulation, embedded interactive artifact cards, and copy/edit/retry toolbar.
- **S04 Artifacts Split Pane**: 2026-11-16 | done | Dual-tab Code & Preview canvas, isolated sandbox `iframe` (`sandbox="allow-scripts"`), version selector (v1, v2), and copy/download/maximize controls.
- **S05 Projects Hub**: 2026-11-16 | done | Grid overview of projects, star tags, and "New Project" modal workflow.
- **S06 Project Workspace**: 2026-11-16 | done | Context window token budget meter (% of 200k tokens), custom system instructions editor, reference knowledge files list with deletion.
- **S07 Sidebar Navigation**: 2026-11-16 | done | Collapsible desktop/mobile drawer, starred chats, chronological history, projects links, and user workspace footer.
- **S08 Custom Styles & Instructions**: 2026-11-16 | partial | System prompt directives wired into state; custom persona builder modal delegated to replica-backend.
- **S09 Public Shared Chat View**: 2026-11-16 | partial | Read-only static snapshot view designed; database permalink generation wired into schema.
- **S10 Account & App Settings**: 2026-11-16 | done | Profile name, appearance/theme picker (Light, Dark, System), and data export archive trigger.
- **S11 Plans & Billing**: 2026-11-16 | done | Active Pro subscription badge, 5-hour rolling usage limit progress bar, and Stripe Customer Portal trigger.
- **S12 Organization & Team Admin**: 2026-11-16 | partial | Workspace entity and member schema ready; multi-seat team invitation UI delegated to full backend rollout.
