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
- Curated demo content only

## Security roadmap
The private admin dashboard is not considered complete until server-side authentication, authorization, private draft handling, and protected write operations are implemented and tested. Never add real credentials to Git. The Supabase service-role key must remain server-only. No admin login information is displayed on the public site.

## Deployment
Deploy only from a reviewed branch and preview. Production deployment is a separate approval step. Backend provider and schema remain subject to verification before connecting a database.
