-- Run this AFTER fix-signup.sql (skips users table — already exists)

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text default '',
  type text not null,
  course text not null,
  semester int not null,
  campus text not null,
  department text,
  file_url text not null,
  downloads int not null default 0,
  uploaded_by uuid references public.users(id) on delete set null,
  uploader_name text,
  status text not null default 'pending',
  search_keywords text[] default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.admission_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  subcategory text not null,
  file_url text not null,
  downloads int not null default 0,
  uploaded_by uuid references public.users(id) on delete set null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text,
  category text not null,
  author text not null,
  author_email text,
  status text not null default 'pending',
  answered_by uuid references public.users(id),
  answered_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  date timestamptz not null,
  venue text not null,
  campus text not null,
  poster text,
  organizer text not null,
  registration_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.societies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  campus text not null,
  category text,
  logo text,
  members int not null default 0,
  social_links jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.merit_history (
  id uuid primary key default gen_random_uuid(),
  campus text not null,
  program text not null,
  year int not null,
  closing_merit numeric not null
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  resource_id uuid not null,
  type text not null check (type in ('resource', 'event')),
  created_at timestamptz not null default now(),
  unique (user_id, resource_id, type)
);

alter table public.resources enable row level security;
alter table public.admission_resources enable row level security;
alter table public.faqs enable row level security;
alter table public.events enable row level security;
alter table public.societies enable row level security;
alter table public.merit_history enable row level security;
alter table public.bookmarks enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'admin');
$$;

drop policy if exists "resources_read" on public.resources;
drop policy if exists "resources_insert" on public.resources;
drop policy if exists "resources_admin" on public.resources;
create policy "resources_read" on public.resources for select using (
  status = 'published' or public.is_admin() or (auth.uid() = uploaded_by)
);
create policy "resources_insert" on public.resources for insert with check (
  auth.uid() is not null and auth.uid() = uploaded_by and status in ('pending', 'published')
);
create policy "resources_admin" on public.resources for all using (public.is_admin());

drop policy if exists "admission_read" on public.admission_resources;
drop policy if exists "admission_insert" on public.admission_resources;
drop policy if exists "admission_admin" on public.admission_resources;
create policy "admission_read" on public.admission_resources for select using (
  status = 'published' or public.is_admin() or (auth.uid() = uploaded_by)
);
create policy "admission_insert" on public.admission_resources for insert with check (
  auth.uid() is not null and auth.uid() = uploaded_by and status = 'pending'
);
create policy "admission_admin" on public.admission_resources for all using (public.is_admin());

drop policy if exists "faqs_read" on public.faqs;
drop policy if exists "faqs_insert" on public.faqs;
drop policy if exists "faqs_admin" on public.faqs;
create policy "faqs_read" on public.faqs for select using (
  status = 'published' or public.is_admin() or (auth.uid() is not null and author_email = auth.jwt() ->> 'email')
);
create policy "faqs_insert" on public.faqs for insert with check (auth.uid() is not null and status = 'pending');
create policy "faqs_admin" on public.faqs for all using (public.is_admin());

drop policy if exists "events_read" on public.events;
drop policy if exists "events_admin" on public.events;
create policy "events_read" on public.events for select using (true);
create policy "events_admin" on public.events for all using (public.is_admin());

drop policy if exists "societies_read" on public.societies;
drop policy if exists "societies_admin" on public.societies;
create policy "societies_read" on public.societies for select using (true);
create policy "societies_admin" on public.societies for all using (public.is_admin());

drop policy if exists "merit_read" on public.merit_history;
drop policy if exists "merit_admin" on public.merit_history;
create policy "merit_read" on public.merit_history for select using (true);
create policy "merit_admin" on public.merit_history for all using (public.is_admin());

drop policy if exists "bookmarks_own" on public.bookmarks;
create policy "bookmarks_own" on public.bookmarks for all using (auth.uid() = user_id);
