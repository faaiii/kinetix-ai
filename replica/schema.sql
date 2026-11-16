-- =============================================================================
-- REPLICA SCHEMA: Full Brain Claude.ai Clone
-- Dialect: PostgreSQL 15+ (Supabase / Neon Compatible)
-- Access Security: Row-Level Security (RLS) enabled on all tables
-- =============================================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. USERS & PROFILES
-- -----------------------------------------------------------------------------
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  display_name text not null default '',
  avatar_url text,
  default_model text not null default 'claude-3-7-sonnet',
  theme_preference text not null default 'system'
    check (theme_preference in ('light', 'dark', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_users_email on users (email);

-- -----------------------------------------------------------------------------
-- 2. ORGANIZATIONS & WORKSPACES
-- -----------------------------------------------------------------------------
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  plan_tier text not null default 'free'
    check (plan_tier in ('free', 'pro', 'team', 'enterprise')),
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_organizations_slug on organizations (slug);
create index idx_organizations_stripe_cust on organizations (stripe_customer_id);

-- -----------------------------------------------------------------------------
-- 3. ORGANIZATION MEMBERS
-- -----------------------------------------------------------------------------
create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  role text not null default 'member'
    check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint uq_org_user unique (organization_id, user_id)
);

create index idx_org_members_user on organization_members (user_id);
create index idx_org_members_org on organization_members (organization_id);

-- -----------------------------------------------------------------------------
-- 4. PROJECTS
-- -----------------------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  created_by uuid not null references users(id) on delete set null,
  title text not null,
  description text default '',
  custom_instructions text default '',
  is_pinned boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_projects_org on projects (organization_id);
create index idx_projects_created_by on projects (created_by);

-- -----------------------------------------------------------------------------
-- 5. PROJECT KNOWLEDGE FILES
-- -----------------------------------------------------------------------------
create table if not exists project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  filename text not null,
  file_size integer not null check (file_size > 0),
  mime_type text not null,
  storage_path text not null,
  extracted_text text not null default '',
  token_count integer not null default 0 check (token_count >= 0),
  created_at timestamptz not null default now()
);

create index idx_project_files_proj on project_files (project_id);

-- -----------------------------------------------------------------------------
-- 6. CONVERSATIONS
-- -----------------------------------------------------------------------------
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references users(id) on delete cascade,
  project_id uuid references projects(id) on delete set null,
  title text not null default 'New Chat',
  model_id text not null default 'claude-3-7-sonnet',
  system_prompt text,
  style_preset text default 'default',
  is_starred boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_conversations_user on conversations (user_id, updated_at desc);
create index idx_conversations_project on conversations (project_id) where project_id is not null;
create index idx_conversations_org on conversations (organization_id);

-- -----------------------------------------------------------------------------
-- 7. MESSAGES (TREE-BRANCHING STRUCTURE)
-- -----------------------------------------------------------------------------
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  parent_message_id uuid references messages(id) on delete set null,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  thinking_content text,
  attachments jsonb not null default '[]'::jsonb,
  model_used text,
  token_usage jsonb not null default '{"prompt": 0, "completion": 0, "total": 0}'::jsonb,
  finish_reason text,
  created_at timestamptz not null default now()
);

create index idx_messages_conv on messages (conversation_id, created_at asc);
create index idx_messages_parent on messages (parent_message_id);

-- -----------------------------------------------------------------------------
-- 8. ARTIFACTS
-- -----------------------------------------------------------------------------
create table if not exists artifacts (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  message_id uuid not null references messages(id) on delete cascade,
  identifier text not null,
  title text not null,
  type text not null check (type in ('code', 'html', 'svg', 'markdown', 'react')),
  language text,
  content text not null,
  version integer not null default 1 check (version > 0),
  created_at timestamptz not null default now(),
  constraint uq_conv_artifact_ver unique (conversation_id, identifier, version)
);

create index idx_artifacts_conv on artifacts (conversation_id, identifier);
create index idx_artifacts_msg on artifacts (message_id);

-- -----------------------------------------------------------------------------
-- 9. CONVERSATION SHARES
-- -----------------------------------------------------------------------------
create table if not exists conversation_shares (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  created_by uuid not null references users(id) on delete cascade,
  share_token text not null unique,
  is_public boolean not null default true,
  snapshot_data jsonb not null,
  views_count integer not null default 0,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index idx_shares_token on conversation_shares (share_token);

-- -----------------------------------------------------------------------------
-- 10. STYLE PRESETS
-- -----------------------------------------------------------------------------
create table if not exists style_presets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  directives text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_styles_user on style_presets (user_id);

-- -----------------------------------------------------------------------------
-- 11. USAGE RECORDS (RATE LIMIT & BILLING METERING)
-- -----------------------------------------------------------------------------
create table if not exists usage_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  window_start timestamptz not null,
  message_count integer not null default 0 check (message_count >= 0),
  tokens_used integer not null default 0 check (tokens_used >= 0),
  created_at timestamptz not null default now(),
  constraint uq_user_window unique (user_id, window_start)
);

create index idx_usage_user_window on usage_records (user_id, window_start);

-- -----------------------------------------------------------------------------
-- ROW-LEVEL SECURITY POLICIES (RLS)
-- -----------------------------------------------------------------------------
alter table users enable row level security;
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table projects enable row level security;
alter table project_files enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table artifacts enable row level security;
alter table conversation_shares enable row level security;
alter table style_presets enable row level security;
alter table usage_records enable row level security;

-- Users can read and update their own record
create policy "users_self" on users
  for all using (id = auth.uid());

-- Org Members can view organizations they belong to
create policy "org_members_view" on organizations
  for select using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = organizations.id
      and organization_members.user_id = auth.uid()
    )
  );

-- Projects scoped to organization membership
create policy "projects_org_access" on projects
  for all using (
    exists (
      select 1 from organization_members
      where organization_members.organization_id = projects.organization_id
      and organization_members.user_id = auth.uid()
    )
  );

-- Conversations owned by user or shared within project
create policy "conversations_owner_access" on conversations
  for all using (
    user_id = auth.uid()
    or exists (
      select 1 from organization_members
      where organization_members.organization_id = conversations.organization_id
      and organization_members.user_id = auth.uid()
      and organization_members.role in ('owner', 'admin')
    )
  );

-- Messages accessible via conversation permission
create policy "messages_conv_access" on messages
  for all using (
    exists (
      select 1 from conversations
      where conversations.id = messages.conversation_id
      and (
        conversations.user_id = auth.uid()
        or exists (
          select 1 from organization_members
          where organization_members.organization_id = conversations.organization_id
          and organization_members.user_id = auth.uid()
        )
      )
    )
  );

-- Artifacts accessible via conversation permission
create policy "artifacts_conv_access" on artifacts
  for all using (
    exists (
      select 1 from conversations
      where conversations.id = artifacts.conversation_id
      and conversations.user_id = auth.uid()
    )
  );

-- Public shares are readable by anyone
create policy "shares_public_read" on conversation_shares
  for select using (is_public = true and (expires_at is null or expires_at > now()));

create policy "shares_owner_modify" on conversation_shares
  for all using (created_by = auth.uid());
