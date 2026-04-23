# The NYC Towing Service

Next.js 16 site for `thenyctowingservice.com` — 24/7 towing and roadside service across all five NYC boroughs. Light-duty, heavy-duty, flatbed, motorcycle, accident recovery, and full roadside (jump, tire, lockout, gas, winch-out). Flat-rate pricing, licensed NYC DCWP operator.

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

## Notes

- Site is optimized for SEO across NYC neighborhoods — 5 boroughs, 200+ neighborhoods.
- Uses Next.js 16 (see `AGENTS.md` / `CLAUDE.md` for the breaking-change caveat).
- Lead intake posts to Supabase, Resend, and a generic webhook — configure in env vars.
