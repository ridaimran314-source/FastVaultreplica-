-- Run this in Supabase Dashboard → SQL Editor
-- Also create Storage bucket named "uploads" (public read)

-- Users profile (extends auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  photo text,
  campus text not null,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

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
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
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
  status text not null default 'pending' check (status in ('pending', 'published', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text,
  category text not null,
  author text not null,
  author_email text,
  status text not null default 'pending' check (status in ('pending', 'published')),
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

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  program text not null,
  campus text not null,
  approved boolean not null default false
);

create table if not exists public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  resource_id uuid not null,
  type text not null check (type in ('resource', 'event')),
  created_at timestamptz not null default now(),
  unique (user_id, resource_id, type)
);

create table if not exists public.event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  user_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (event_id, user_id)
);

create index if not exists idx_resources_status on public.resources(status, created_at desc);
create index if not exists idx_resources_campus on public.resources(campus);
create index if not exists idx_admission_status on public.admission_resources(status, created_at desc);
create index if not exists idx_events_date on public.events(date);
create index if not exists idx_bookmarks_user on public.bookmarks(user_id, type);

alter table public.users enable row level security;
alter table public.resources enable row level security;
alter table public.admission_resources enable row level security;
alter table public.faqs enable row level security;
alter table public.events enable row level security;
alter table public.societies enable row level security;
alter table public.merit_history enable row level security;
alter table public.testimonials enable row level security;
alter table public.bookmarks enable row level security;
alter table public.event_registrations enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Users
create policy "users_read" on public.users for select using (true);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);
create policy "users_update_own_or_admin" on public.users for update using (auth.uid() = id or public.is_admin());

-- Resources
create policy "resources_read" on public.resources for select using (
  status = 'published' or public.is_admin() or (auth.uid() = uploaded_by)
);
create policy "resources_insert" on public.resources for insert with check (
  auth.uid() is not null and auth.uid() = uploaded_by and status in ('pending', 'published')
);
create policy "resources_admin" on public.resources for all using (public.is_admin());

-- Admission resources
create policy "admission_read" on public.admission_resources for select using (
  status = 'published' or public.is_admin() or (auth.uid() = uploaded_by)
);
create policy "admission_insert" on public.admission_resources for insert with check (
  auth.uid() is not null and auth.uid() = uploaded_by and status = 'pending'
);
create policy "admission_admin" on public.admission_resources for all using (public.is_admin());

-- FAQs
create policy "faqs_read" on public.faqs for select using (
  status = 'published' or public.is_admin() or (auth.uid() is not null and author_email = auth.jwt() ->> 'email')
);
create policy "faqs_insert" on public.faqs for insert with check (auth.uid() is not null and status = 'pending');
create policy "faqs_admin" on public.faqs for all using (public.is_admin());

-- Events & societies (public read, admin write)
create policy "events_read" on public.events for select using (true);
create policy "events_admin" on public.events for all using (public.is_admin());

create policy "societies_read" on public.societies for select using (true);
create policy "societies_admin" on public.societies for all using (public.is_admin());

create policy "merit_read" on public.merit_history for select using (true);
create policy "merit_admin" on public.merit_history for all using (public.is_admin());

create policy "testimonials_read" on public.testimonials for select using (approved = true or public.is_admin());
create policy "testimonials_admin" on public.testimonials for all using (public.is_admin());

-- Bookmarks
create policy "bookmarks_own" on public.bookmarks for all using (auth.uid() = user_id);

-- Event registrations
create policy "registrations_read" on public.event_registrations for select using (
  auth.uid() = user_id or public.is_admin()
);
create policy "registrations_insert" on public.event_registrations for insert with check (auth.uid() = user_id);
create policy "registrations_delete" on public.event_registrations for delete using (
  auth.uid() = user_id or public.is_admin()
);

-- Auto-create user profile when someone signs up (works even with email confirmation)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, name, email, campus, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'campus', 'islamabad'),
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage: create bucket "uploads" in Dashboard → Storage → New bucket (public)
-- Then run these policies in SQL Editor:

-- insert into storage.buckets (id, name, public) values ('uploads', 'uploads', true) on conflict do nothing;

-- create policy "uploads_public_read" on storage.objects for select using (bucket_id = 'uploads');
-- create policy "uploads_auth_insert" on storage.objects for insert with check (
--   bucket_id = 'uploads' and auth.uid()::text = (storage.foldername(name))[1]
-- );
-- create policy "uploads_auth_delete" on storage.objects for delete using (
--   bucket_id = 'uploads' and auth.uid()::text = (storage.foldername(name))[1]
-- );
