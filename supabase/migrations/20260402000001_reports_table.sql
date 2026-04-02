-- Table de signalements d'erreurs sur les fiches salon
create table reports (
  id uuid primary key default gen_random_uuid(),
  salon_slug varchar not null,
  field varchar not null,
  correction text not null,
  reporter_email varchar,
  status varchar not null default 'pending',
  created_at timestamptz not null default now()
);

-- Contrainte sur les valeurs de status
alter table reports
  add constraint reports_status_check
  check (status in ('pending', 'reviewed', 'applied', 'dismissed'));

-- RLS
alter table reports enable row level security;

-- Tout le monde peut signaler une erreur (INSERT)
create policy "Public can insert reports"
  on reports for insert
  to anon, authenticated
  with check (true);

-- Seuls les utilisateurs authentifiés peuvent consulter les signalements
create policy "Authenticated can read reports"
  on reports for select
  to authenticated
  using (true);
