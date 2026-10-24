# Orbit — cinematic portfolio

A new, isolated Next.js + React Three Fiber foundation for a cinematic AI & Data Science portfolio.

## Development
- Node.js 20.9+ (Node 24 is supported by current Next.js)
- `npm install`
- `npm run dev`
- `npm run typecheck`
- `npm run build`

## Current scope
- Cinematic intro with skip control
- Interactive abstract data sphere with orbital destinations
- AI Work and Data Science pathways
- Responsive layout and reduced-motion support
- Modular content and a private admin workspace foundation
- Supabase schema with row-level security policies

## Private admin setup (not yet production-ready)
1. Use a dedicated Supabase project; do not apply `supabase/schema.sql` to an existing unrelated project.
2. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and server-only `ADMIN_EMAIL` in your environment.
3. Apply `supabase/schema.sql` after reviewing it.
4. Disable public sign-ups in Supabase Auth, create the owner user manually, and insert that user's UUID into `public.admin_users`.
5. Set the owner password directly through the provider's secure flow. Never commit secrets.
6. Test that unauthenticated users cannot read drafts or write records. Test that authenticated non-admin users cannot write records.
7. Connect published database records to the public sphere and verify draft content cannot leak through server rendering, caches, or APIs.

The dashboard and schema are an implementation foundation, not a claim that authentication or the content publishing pipeline has already been fully security-tested.

## Deployment
Deploy only from a reviewed branch and preview. Production deployment is a separate approval step. Backend project selection and schema application require verification before connecting a database.
