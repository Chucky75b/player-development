-- ============================================================
-- 0001_init.sql
-- Fondamenta per l'auth: tabella profiles, ruoli, RLS.
-- Da incollare nello SQL Editor di Supabase (o eseguire via CLI).
-- ============================================================

-- ------------------------------------------------------------
-- 1. Tabella profiles (1:1 con auth.users)
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text,
  last_name text,
  role text not null default 'player'
    check (role in ('player', 'coach', 'admin')),
  avatar_url text,
  created_at timestamptz not null default now()
);

comment on table public.profiles is
  'Dati applicativi legati a auth.users. Un profilo per utente, creato automaticamente alla registrazione.';

-- ------------------------------------------------------------
-- 2. Trigger: crea automaticamente il profilo alla creazione
--    di un utente in auth.users (es. quando l'Admin invita
--    un nuovo account).
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- 3. Funzione helper per verificare il ruolo (usata nelle RLS
--    policy di coach/admin, incluse le tabelle che aggiungeremo
--    più avanti: players, development_plans, goals, ecc.)
-- ------------------------------------------------------------
create or replace function public.is_coach_or_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role in ('coach', 'admin')
  );
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

-- ------------------------------------------------------------
-- 4. Row Level Security su profiles
-- ------------------------------------------------------------
alter table public.profiles enable row level security;

-- Ogni utente vede e aggiorna solo il proprio profilo.
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

-- Coach e Admin vedono tutti i profili (serve per liste giocatori/staff).
drop policy if exists "Staff can view all profiles" on public.profiles;
create policy "Staff can view all profiles"
on public.profiles
for select
to authenticated
using ((select public.is_coach_or_admin()));

-- Solo l'Admin può cambiare il ruolo di un altro utente.
drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
on public.profiles
for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

-- ------------------------------------------------------------
-- Nota: le tabelle players / development_plans / goals /
-- evaluations / videos arrivano nella prossima migration,
-- quando costruiremo player dashboard e coach dashboard.
-- ------------------------------------------------------------
