-- ════════════════════════════════════════════════════════════════
--  LUMINA Imóveis — Schema PostgreSQL (Supabase)
--  Execute no SQL Editor do Supabase para provisionar o banco.
-- ════════════════════════════════════════════════════════════════

create extension if not exists "uuid-ossp";

-- ── Enums ───────────────────────────────────────────────────────
do $$ begin
  create type listing_type as enum ('compra', 'aluguel', 'lancamento', 'luxo');
exception when duplicate_object then null; end $$;

do $$ begin
  create type property_type as enum ('apartamento', 'casa', 'cobertura', 'terreno', 'comercial');
exception when duplicate_object then null; end $$;

do $$ begin
  create type property_status as enum ('disponivel', 'reservado', 'vendido');
exception when duplicate_object then null; end $$;

do $$ begin
  create type lead_status as enum ('novo', 'contatado', 'qualificado', 'convertido', 'perdido');
exception when duplicate_object then null; end $$;

-- ── Agents ──────────────────────────────────────────────────────
create table if not exists public.agents (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  role        text not null default 'Corretor',
  photo       text not null,
  phone       text not null,
  email       text not null,
  bio         text,
  creci       text,
  created_at  timestamptz not null default now()
);

-- ── Properties ──────────────────────────────────────────────────
create table if not exists public.properties (
  id            uuid primary key default uuid_generate_v4(),
  title         text not null,
  slug          text not null unique,
  description   text not null,
  price         numeric(14,2) not null check (price >= 0),
  listing_type  listing_type not null default 'compra',
  type          property_type not null default 'apartamento',
  status        property_status not null default 'disponivel',
  city          text not null,
  state         text not null,
  neighborhood  text not null,
  address       text,
  latitude      double precision,
  longitude     double precision,
  bedrooms      int not null default 0,
  bathrooms     int not null default 0,
  garage        int not null default 0,
  area          numeric(10,2) not null check (area > 0),
  suites        int default 0,
  images        jsonb not null default '[]'::jsonb,
  amenities     text[] not null default '{}',
  featured      boolean not null default false,
  agent_id      uuid references public.agents(id) on delete set null,
  tour_url      text,
  video_url     text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists idx_properties_listing_type on public.properties (listing_type);
create index if not exists idx_properties_type          on public.properties (type);
create index if not exists idx_properties_city          on public.properties (city);
create index if not exists idx_properties_featured      on public.properties (featured);
create index if not exists idx_properties_price         on public.properties (price);

-- ── Leads ───────────────────────────────────────────────────────
create table if not exists public.leads (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  email           text not null,
  phone           text not null,
  message         text,
  property_id     uuid references public.properties(id) on delete set null,
  property_title  text,
  source          text default 'site',
  status          lead_status not null default 'novo',
  created_at      timestamptz not null default now()
);

create index if not exists idx_leads_status     on public.leads (status);
create index if not exists idx_leads_created_at on public.leads (created_at desc);

-- ── updated_at automático ───────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_properties_updated_at on public.properties;
create trigger trg_properties_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

-- ════════════════════════════════════════════════════════════════
--  Row Level Security
-- ════════════════════════════════════════════════════════════════
alter table public.properties enable row level security;
alter table public.agents     enable row level security;
alter table public.leads      enable row level security;

-- Leitura pública de imóveis e corretores
drop policy if exists "Properties são públicos" on public.properties;
create policy "Properties são públicos"
  on public.properties for select using (true);

drop policy if exists "Agents são públicos" on public.agents;
create policy "Agents são públicos"
  on public.agents for select using (true);

-- Qualquer visitante pode criar um lead (formulário de contato)
drop policy if exists "Visitantes podem criar leads" on public.leads;
create policy "Visitantes podem criar leads"
  on public.leads for insert with check (true);

-- Apenas usuários autenticados (admin) leem/gerenciam leads e editam imóveis.
-- Em produção, restrinja por role/claim. O backend usa a service_role key,
-- que ignora RLS para operações administrativas.
drop policy if exists "Admin gerencia leads" on public.leads;
create policy "Admin gerencia leads"
  on public.leads for select using (auth.role() = 'authenticated');

drop policy if exists "Admin gerencia properties" on public.properties;
create policy "Admin gerencia properties"
  on public.properties for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- ════════════════════════════════════════════════════════════════
--  Seed inicial (corretores + 1 imóvel de exemplo)
-- ════════════════════════════════════════════════════════════════
insert into public.agents (id, name, role, photo, phone, email, creci, bio)
values
  ('11111111-1111-1111-1111-111111111111', 'Helena Vasconcelos', 'Especialista em Alto Padrão',
   'https://i.pravatar.cc/400?img=47', '+55 11 99888-0001', 'helena@lumina.com.br',
   'CRECI-SP 123.456', 'Mais de 12 anos no mercado de luxo de São Paulo.'),
  ('22222222-2222-2222-2222-222222222222', 'Rafael Andrade', 'Consultor de Lançamentos',
   'https://i.pravatar.cc/400?img=12', '+55 11 99888-0002', 'rafael@lumina.com.br',
   'CRECI-SP 234.567', 'Referência em lançamentos e investimentos.')
on conflict (id) do nothing;

insert into public.properties
  (title, slug, description, price, listing_type, type, status, city, state, neighborhood,
   bedrooms, bathrooms, garage, area, suites, images, amenities, featured, agent_id)
values
  ('Cobertura Duplex Vista Parque', 'cobertura-duplex-vista-parque-itaim-bibi',
   'Cobertura duplex impecável com 380m² de puro requinte e vista panorâmica.',
   9800000, 'luxo', 'cobertura', 'disponivel', 'São Paulo', 'SP', 'Itaim Bibi',
   4, 5, 4, 380, 4,
   '[{"url":"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80","alt":"Fachada"}]'::jsonb,
   array['Piscina privativa','Terraço gourmet','Automação'],
   true, '11111111-1111-1111-1111-111111111111')
on conflict (slug) do nothing;
