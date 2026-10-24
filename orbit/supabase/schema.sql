-- Orbit portfolio content model. Apply only to a dedicated project after reviewing it.
-- Never use this file against an existing unrelated Supabase project.
create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_orbit_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admin_users au where au.user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_orbit_admin() from public;
grant execute on function public.is_orbit_admin() to authenticated;

create table if not exists public.portfolio_sections (
  id text primary key check (id ~ '^[a-z0-9-]{2,48}$'),
  label text not null check (char_length(label) between 1 and 48),
  title text not null check (char_length(title) between 1 and 140),
  description text not null check (char_length(description) between 1 and 6000),
  pathway text not null default 'both' check (pathway in ('both','ai','data')),
  sort_order integer not null default 0,
  published boolean not null default false,
  orbital boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.portfolio_projects (
  id text primary key check (id ~ '^[a-z0-9-]{2,64}$'),
  title text not null check (char_length(title) between 1 and 140),
  description text not null check (char_length(description) between 1 and 6000),
  category text not null default 'data' check (category in ('ai','data','both')),
  href text check (href is null or href ~ '^https://'),
  featured boolean not null default false,
  published boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.portfolio_sections enable row level security;
alter table public.portfolio_projects enable row level security;

-- Do not expose admin identities to public/anon clients.
create policy "Admins can read own admin grant"
on public.admin_users for select to authenticated
using (user_id = (select auth.uid()));

-- Public visitors may read published content only.
create policy "Public can read published sections"
on public.portfolio_sections for select to anon, authenticated
using (published = true);

create policy "Admins can manage sections"
on public.portfolio_sections for all to authenticated
using ((select public.is_orbit_admin()))
with check ((select public.is_orbit_admin()));

create policy "Public can read published projects"
on public.portfolio_projects for select to anon, authenticated
using (published = true);

create policy "Admins can manage projects"
on public.portfolio_projects for all to authenticated
using ((select public.is_orbit_admin()))
with check ((select public.is_orbit_admin()));

grant select on public.portfolio_sections, public.portfolio_projects to anon, authenticated;
grant insert, update, delete on public.portfolio_sections, public.portfolio_projects to authenticated;
grant select on public.admin_users to authenticated;

-- Owner bootstrap is deliberately manual:
-- 1) Create the owner user in Supabase Auth (disable public sign-ups).
-- 2) Copy that user's UUID from Auth users.
-- 3) Run: insert into public.admin_users (user_id) values ('OWNER_AUTH_USER_UUID');
-- Never add a public policy permitting users to insert themselves into admin_users.


-- Initial safe section set. Public section copy is editable from the owner console.
insert into public.portfolio_sections (id, label, title, description, pathway, sort_order, published, orbital) values
('about','About','Curiosity, made tangible.','I explore how thoughtful engineering and data-driven reasoning can turn complicated problems into useful tools. This space is a living record of what I build, what I learn, and what I want to solve next.','both',1,true,true),
('projects','Projects','Proof over promises.','Case studies designed to show the question, the decisions, the trade-offs, and the outcome—not just a polished screenshot. Metrics and links will be verified before publication.','both',2,true,true),
('skills','Skills','Tools are only the beginning.','Python, SQL, data analysis, machine learning, visualisation, annotation quality assurance, and the habits that make technical work reliable.','both',3,true,true),
('experience','Experience','Learning by doing.','A curated timeline of relevant work, responsibilities, and outcomes, with context for what I contributed and what I learned.','both',4,true,true),
('education','Education','Data Science · University of Nairobi','BSc Data Science, University of Nairobi. Expected graduation: 2029. Focused on building strong fundamentals and applying them to real problems.','data',5,true,true),
('ai-work','AI Work','Helping AI become more reliable.','Annotation, evaluation, instruction following, data quality, and careful review of model outputs—grounded in guidelines and evidence.','ai',6,true,true),
('credentials','Credentials','Evidence, not decoration.','A place for verifiable certifications, assessment milestones, and professional learning, clearly distinguished by status.','both',7,true,true),
('cv','CV / Resume','The concise version.','An accessible, recruiter-friendly résumé and downloadable PDF will be added after dates, links, and claims are verified.','both',8,true,true),
('contact','Contact','Have a good problem?','For AI evaluation, data science, and thoughtful collaborations. Choose a clear next step and get in touch.','both',9,true,true)
on conflict (id) do nothing;

insert into public.portfolio_projects (id,title,description,category,href,featured,published,sort_order) values
('titanic-sql-analysis','Titanic SQL Analysis','A structured exploration of passenger data using SQL to ask clear questions, surface patterns, and communicate findings.','data','https://github.com/Josephy1714/titanic-sql-analysis',false,true,1),
('careerpilot-ai','CareerPilot AI','A career-support product exploring résumé parsing, job-fit signals, and AI-assisted career workflows.','both','https://github.com/Josephy1714/careerpilotAI',true,true,2)
on conflict (id) do nothing;
