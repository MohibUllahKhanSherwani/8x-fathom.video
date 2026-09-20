-- Fathom Clone Schema (PRD Section 11)

-- 1. Users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  color text
);

-- 2. Sandbox Sessions (per-visitor isolation)
create table if not exists sandbox_sessions (
  id uuid primary key,
  created_at timestamptz default now(),
  settings jsonb default '{}'::jsonb,
  onboarding jsonb default '{}'::jsonb,
  points int default 25
);

-- 3. Meetings
create table if not exists meetings (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid references users(id),
  session_id uuid references sandbox_sessions(id),      -- null for shared seed content
  title text not null,
  started_at timestamptz,                                -- null for seed rows
  seed_offset_minutes int,                               -- seed rows: started_at = now() - offset
  duration_sec int,
  source text check (source in ('seed','upload','record','simulated')),
  platform text,
  visibility text default 'private' check (visibility in ('private','team')),
  status text default 'ready' check (status in ('uploading','processing','ready','failed')),
  error text,
  audio_url text,
  share_token text unique,
  share_enabled boolean default false,
  share_parts jsonb default '{"summary":true,"transcript":true,"recording":true}',
  is_external boolean default false,
  created_at timestamptz default now()
);

-- 4. Participants
create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade,
  name text not null,
  is_host boolean default false,
  is_external boolean default false,
  color text,
  talk_ms int default 0
);

-- 5. Segments (Transcript)
create table if not exists segments (
  id bigserial primary key,
  meeting_id uuid references meetings(id) on delete cascade,
  idx int not null,
  participant_id uuid references participants(id),
  start_ms int not null,
  end_ms int not null,
  text text not null,
  tsv tsvector generated always as (to_tsvector('english', text)) stored
);

create index if not exists idx_segments_meeting_idx on segments (meeting_id, idx);
create index if not exists idx_segments_tsv on segments using gin (tsv);

-- 6. Summaries (Templates & Languages)
create table if not exists summaries (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade,
  template text not null,
  language text not null default 'en',
  content jsonb not null,
  model text,
  created_at timestamptz default now(),
  unique (meeting_id, template, language)
);

-- 7. Action Items
create table if not exists action_items (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade,
  session_id uuid references sandbox_sessions(id),       -- null for AI/seed items
  source text default 'ai' check (source in ('ai','manual')),
  text text not null,
  assignee text,
  due_hint text,
  start_ms int
);

-- 8. Action Item State (Per-session completion)
create table if not exists action_item_state (
  session_id uuid,
  action_item_id uuid,
  done boolean default false,
  primary key (session_id, action_item_id)
);

-- 9. Highlights
create table if not exists highlights (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade,
  session_id uuid not null,
  start_ms int not null,
  end_ms int,
  note text,
  created_at timestamptz default now()
);

-- 10. Clips
create table if not exists clips (
  id uuid primary key default gen_random_uuid(),
  meeting_id uuid references meetings(id) on delete cascade,
  session_id uuid not null,
  token text unique not null,
  title text,
  start_ms int not null,
  end_ms int not null,
  created_at timestamptz default now()
);

-- 11. Chat Sessions (Ask Fathom)
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null,
  meeting_id uuid,             -- null = account level
  scope text default 'my',
  title text,
  created_at timestamptz default now()
);

-- 12. Chat Messages
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  chat_session_id uuid references chat_sessions(id) on delete cascade,
  role text check (role in ('user','assistant')),
  content text not null,
  citations jsonb default '[]',
  created_at timestamptz default now()
);

-- 13. AI Cache
create table if not exists ai_cache (
  key text primary key,
  value jsonb not null,
  created_at timestamptz default now()
);
