-- =============================================================
-- Prestataires : données éditoriales vérifiées + pages hub métier x zone
-- =============================================================
-- Chantier SEO prestataires (tasks/todo.md volet G, règles tasks/regles-edito-prestataires-v1.md).
-- Idempotent. Les données arrivent par scripts/diag-providers-editorial-apply.ts.

-- 1. Champs factuels produits par le pipeline writer / reviewers (chacun prouvé par une
--    citation du site officiel ou par le registre des entreprises, cf. P20 à P23).
alter table providers add column if not exists postal_code varchar;
alter table providers add column if not exists department varchar(3);
alter table providers add column if not exists specialties text[] not null default '{}';
alter table providers add column if not exists founded_year int;
alter table providers add column if not exists memberships text[] not null default '{}';
alter table providers add column if not exists editorial_reviewed_at timestamptz;

-- 2. Indexabilité explicite et réversible : une fiche n'est indexable (robots + sitemap) que si
--    ce flag est vrai. Posé par script sur le lot test, puis élargi selon les résultats GSC.
alter table providers add column if not exists seo_indexable boolean not null default false;

create index if not exists providers_category_department_idx on providers (category, department);

-- 3. Pages hub. Même espace d'URL que les fiches (/prestataires/[slug]) : le slug d'un hub ne doit
--    jamais être celui d'un prestataire (vérifié par le script d'apply).
create table if not exists provider_hubs (
  id uuid primary key default gen_random_uuid(),
  slug varchar not null unique,
  category provider_category not null,
  -- Départements couverts ; tableau vide = hub national
  departments text[] not null default '{}',
  zone_label varchar,
  zone_label_en varchar,
  h1 varchar not null,
  h1_en varchar,
  seo_title varchar not null,
  seo_title_en varchar,
  seo_description varchar not null,
  seo_description_en varchar,
  editorial_mdx text,
  editorial_mdx_en text,
  editorial_updated_at timestamptz,
  -- En dessous de ce nombre de prestataires dans la zone, le hub reste en noindex
  min_providers int not null default 5,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists provider_hubs_updated_at on provider_hubs;
create trigger provider_hubs_updated_at before update on provider_hubs
  for each row execute function update_updated_at();

alter table provider_hubs enable row level security;

drop policy if exists "Lecture publique provider_hubs" on provider_hubs;
create policy "Lecture publique provider_hubs" on provider_hubs for select using (true);

drop policy if exists "Admin et editor ecrivent provider_hubs" on provider_hubs;
create policy "Admin et editor ecrivent provider_hubs" on provider_hubs for all
  using (exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'editor')))
  with check (exists (select 1 from user_roles where user_id = auth.uid() and role in ('admin', 'editor')));
