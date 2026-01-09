# Anchor Routine — Personal Today Dashboard

Minimal Next.js App Router starter for the "Anchor Routine" personal dashboard.

Built with:
- Next.js 14 (TypeScript)
- Tailwind CSS
- Prisma ORM (SQLite)

## Quick start

```bash
cd /home/wilfred/schedule
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Then open http://localhost:3000 in your browser.

## Project structure

- `app/page.tsx` — Today screen (shows current, upcoming, and all blocks)
- `app/api/routine/route.ts` — API endpoints (GET all, POST for current/upcoming)
- `app/actions/routine.ts` — Server actions (database queries)
- `components/` — UI components (`.tsx`)
- `lib/prisma.ts` — Prisma database client
- `prisma/schema.prisma` — Database schema

## Database

Events are stored in the `Routine` table. Run `npm run db:seed` to populate default routines.

All events are fetched from the database, not hardcoded.

- **Routine table**: name, start, end, strict, notifyBefore
- **DailyLog table**: date, blockId, status, notes (for tracking)

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Run production server
npm run prisma:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed default routines
```
# authh
