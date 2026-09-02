create extension if not exists pgcrypto;

create type public.booking_status as enum (
  'pending', 'confirmed', 'calendar_failed', 'cancelled', 'completed', 'no_show'
);

create type public.selection_status as enum (
  'awaiting_review', 'advanced', 'not_advanced', 'withdrew'
);

create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint candidates_email_normalized check (email = lower(trim(email)))
);

create table public.slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  blocked boolean not null default false,
  created_at timestamptz not null default now(),
  constraint slots_valid_interval check (ends_at > starts_at),
  constraint slots_unique_start unique (starts_at)
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null references public.candidates(id),
  slot_id uuid not null references public.slots(id),
  status public.booking_status not null default 'pending',
  google_event_id text,
  meet_url text,
  access_token_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index bookings_one_active_per_slot
  on public.bookings(slot_id)
  where status in ('pending', 'confirmed', 'calendar_failed', 'completed', 'no_show');

create unique index bookings_one_active_per_candidate
  on public.bookings(candidate_id)
  where status in ('pending', 'confirmed', 'calendar_failed', 'completed', 'no_show');

create table public.candidate_reviews (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid not null unique references public.candidates(id),
  status public.selection_status not null default 'awaiting_review',
  internal_notes text,
  public_feedback text,
  published_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.candidates enable row level security;
alter table public.slots enable row level security;
alter table public.bookings enable row level security;
alter table public.candidate_reviews enable row level security;

-- Nenhuma policy pública é criada. Leituras e mutações passam por endpoints server-side.
