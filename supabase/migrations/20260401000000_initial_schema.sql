-- ============================================================
-- Showfinder : schema initial
-- ============================================================

-- Enums
-- ------------------------------------------------------------

create type salon_status as enum ('draft', 'published', 'cancelled', 'postponed');
create type salon_frequency as enum ('annuel', 'bisannuel', 'ponctuel');
create type provider_category as enum ('standiste', 'traiteur', 'av_technique', 'photographe', 'transport', 'hebergement', 'autre');
create type provider_tier as enum ('free', 'premium');
create type review_target_type as enum ('salon', 'provider');
create type review_role as enum ('exposant', 'visiteur', 'organisateur');
create type tag_category as enum ('audience', 'trend', 'value', 'sector');

-- Fonctions utilitaires
-- ------------------------------------------------------------

-- Mise a jour automatique de updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Tables
-- ------------------------------------------------------------

-- Secteurs
create table sectors (
  id uuid primary key default gen_random_uuid(),
  slug varchar not null unique,
  name varchar not null,
  description text,
  icon varchar,
  seo_title varchar,
  seo_description varchar,
  created_at timestamptz not null default now()
);

-- Salons
create table salons (
  id uuid primary key default gen_random_uuid(),
  slug varchar not null unique,
  name varchar not null,
  edition_year int,
  description text,
  start_date date,
  end_date date,
  city varchar,
  venue varchar,
  venue_lat float,
  venue_lng float,
  country varchar not null default 'FR',
  website_url varchar,
  organizer_name varchar,
  organizer_email varchar,
  frequency salon_frequency,
  estimated_exhibitors int,
  estimated_visitors int,
  is_premium boolean not null default false,
  status salon_status not null default 'draft',
  logo_url varchar,
  cover_image_url varchar,
  seo_title varchar,
  seo_description varchar,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger salons_updated_at
  before update on salons
  for each row execute function update_updated_at();

-- Jointure Salon <-> Secteur (M2M)
create table salon_sectors (
  salon_id uuid not null references salons(id) on delete cascade,
  sector_id uuid not null references sectors(id) on delete cascade,
  primary key (salon_id, sector_id)
);

-- Prestataires
create table providers (
  id uuid primary key default gen_random_uuid(),
  slug varchar not null unique,
  company_name varchar not null,
  category provider_category not null,
  description text,
  city varchar,
  coverage_radius_km int,
  website_url varchar,
  phone varchar,
  email varchar,
  logo_url varchar,
  is_verified boolean not null default false,
  subscription_tier provider_tier not null default 'free',
  avg_rating float not null default 0,
  review_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger providers_updated_at
  before update on providers
  for each row execute function update_updated_at();

-- Jointure Salon <-> Prestataire (M2M)
create table salon_providers (
  salon_id uuid not null references salons(id) on delete cascade,
  provider_id uuid not null references providers(id) on delete cascade,
  is_featured boolean not null default false,
  primary key (salon_id, provider_id)
);

-- Avis
create table reviews (
  id uuid primary key default gen_random_uuid(),
  target_type review_target_type not null,
  target_id uuid not null,
  user_id uuid references auth.users(id) on delete set null,
  rating int not null check (rating >= 1 and rating <= 5),
  title varchar,
  body text,
  role review_role,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- Tags editoriaux
create table salon_tags (
  id uuid primary key default gen_random_uuid(),
  salon_id uuid not null references salons(id) on delete cascade,
  label varchar not null,
  category tag_category,
  color varchar,
  created_at timestamptz not null default now()
);

-- Index
-- ------------------------------------------------------------

create index idx_salons_city on salons(city);
create index idx_salons_country on salons(country);
create index idx_salons_status on salons(status);
create index idx_salons_start_date on salons(start_date);

create index idx_providers_category on providers(category);
create index idx_providers_city on providers(city);

create index idx_salon_tags_salon_id on salon_tags(salon_id);

create index idx_reviews_target on reviews(target_type, target_id);

create index idx_salon_sectors_sector_id on salon_sectors(sector_id);

-- Row Level Security
-- ------------------------------------------------------------

alter table sectors enable row level security;
alter table salons enable row level security;
alter table salon_sectors enable row level security;
alter table providers enable row level security;
alter table salon_providers enable row level security;
alter table reviews enable row level security;
alter table salon_tags enable row level security;

-- Lecture publique pour toutes les tables
create policy "Lecture publique sectors" on sectors for select using (true);
create policy "Lecture publique salons" on salons for select using (true);
create policy "Lecture publique salon_sectors" on salon_sectors for select using (true);
create policy "Lecture publique providers" on providers for select using (true);
create policy "Lecture publique salon_providers" on salon_providers for select using (true);
create policy "Lecture publique reviews" on reviews for select using (true);
create policy "Lecture publique salon_tags" on salon_tags for select using (true);
