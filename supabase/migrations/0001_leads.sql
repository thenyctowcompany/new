-- leads table: captures booking, contact, and job-application submissions
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (type in ('booking', 'contact', 'job-application')),
  name text,
  phone text,
  email text,
  zip text,
  city text,
  state text,
  when_needed text,
  details text,
  has_license text,
  can_lift text,
  availability text,
  about text,
  source text,
  status text not null default 'new' check (status in ('new', 'contacted', 'quoted', 'booked', 'completed', 'lost'))
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_type_idx on public.leads (type);
create index if not exists leads_status_idx on public.leads (status);

alter table public.leads enable row level security;

-- service_role writes from the API route; no public insert/select
drop policy if exists "service_role full access" on public.leads;
create policy "service_role full access" on public.leads
  for all to service_role using (true) with check (true);
