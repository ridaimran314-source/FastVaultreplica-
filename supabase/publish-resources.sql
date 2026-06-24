-- Run once in Supabase SQL Editor (fixes uploads not showing on /resources)

-- Allow direct published inserts from the upload form
drop policy if exists "resources_insert" on public.resources;
create policy "resources_insert" on public.resources for insert with check (
  auth.uid() is not null and auth.uid() = uploaded_by and status in ('pending', 'published')
);

-- Publish any uploads that were stuck in pending review
update public.resources set status = 'published' where status = 'pending';
