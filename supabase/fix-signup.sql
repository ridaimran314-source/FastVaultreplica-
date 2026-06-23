-- Run this in Supabase SQL Editor if signup says "profile save failed"
-- Fixes: creates users table + auto-profile trigger

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  photo text,
  campus text not null,
  role text not null default 'student' check (role in ('student', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.users enable row level security;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.users
    where id = auth.uid() and role = 'admin'
  );
$$;

drop policy if exists "users_read" on public.users;
drop policy if exists "users_insert_own" on public.users;
drop policy if exists "users_update_own_or_admin" on public.users;

create policy "users_read" on public.users for select using (true);
create policy "users_insert_own" on public.users for insert with check (auth.uid() = id);
create policy "users_update_own_or_admin" on public.users for update using (auth.uid() = id or public.is_admin());

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

-- Fix account that already exists in Auth but has no profile:
insert into public.users (id, name, email, campus, role)
select
  id,
  coalesce(raw_user_meta_data->>'name', split_part(email, '@', 1)),
  email,
  coalesce(raw_user_meta_data->>'campus', 'islamabad'),
  case when email = 'ridaimran314@gmail.com' then 'admin' else 'student' end
from auth.users
where email = 'ridaimran314@gmail.com'
on conflict (id) do update set
  role = excluded.role,
  name = excluded.name,
  campus = excluded.campus;
