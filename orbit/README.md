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
2. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, server-only `ADMIN_EMAIL`, and server-only `CONTACT_RATE_LIMIT_SECRET` (at least 32 random characters) in Vercel Preview and Production environments. Never prefix the secret or admin email with `NEXT_PUBLIC_` and never commit their values.
3. Apply `supabase/schema.sql` after reviewing it.
4. Disable public sign-ups in Supabase Auth, create the owner user manually, and insert that user's UUID into `public.admin_users`.
5. Set the owner password directly through the provider's secure flow. Never commit secrets.
6. Create a random secret (for example, generate 64 hexadecimal characters with a cryptographically secure password generator). Store it as `CONTACT_RATE_LIMIT_SECRET` in Vercel, then insert the exact same value into `private.contact_rate_limit_secret` using the Supabase SQL editor: `insert into private.contact_rate_limit_secret(singleton, secret) values (true, 'YOUR_SECRET') on conflict (singleton) do update set secret = excluded.secret;` Do not put the value in GitHub or a public environment variable.
7. Test that unauthenticated users cannot read drafts or write records. Test that authenticated non-admin users cannot write records. Test that direct anonymous RPC calls without a valid HMAC signature are rejected.
8. Connect published database records to the public sphere and verify draft content cannot leak through server rendering, caches, or APIs.

The dashboard and schema are an implementation foundation, not a claim that authentication or the content publishing pipeline has already been fully security-tested.

## Deployment
Deploy only from a reviewed branch and preview. Production deployment is a separate approval step. Backend project selection and schema application require verification before connecting a database.
