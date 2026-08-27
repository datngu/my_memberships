-- Run this in the Supabase SQL editor for a new project.
--
-- Security model: this app has no passwords. Sign-in only matches a phone
-- number to a profile (see src/lib/session.ts). RLS below is therefore
-- permissive for the anon role by design -- it stops accidental misuse from
-- other apps sharing the project, not a determined attacker. Suitable for a
-- small trusted friend group, not for storing sensitive data.

create extension if not exists "pgcrypto";

create table profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text not null unique,
  created_at timestamptz not null default now()
);

create table cards (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  store_id text not null,
  label text,
  code text not null,
  code_type text not null check (code_type in ('barcode', 'qr')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index cards_profile_id_idx on cards(profile_id);

alter table profiles enable row level security;
alter table cards enable row level security;

create policy "anon can read profiles" on profiles for select using (true);
create policy "anon can create profiles" on profiles for insert with check (true);

create policy "anon can read cards" on cards for select using (true);
create policy "anon can create cards" on cards for insert with check (true);
create policy "anon can update cards" on cards for update using (true) with check (true);
create policy "anon can delete cards" on cards for delete using (true);
