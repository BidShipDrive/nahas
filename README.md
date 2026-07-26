# BidShipDrive

Website for BidShipDrive (BSD) — we bid on cars at US auctions, ship them to Lebanon, and deliver them to the customer. Built with Next.js, Tailwind CSS, and Prisma/SQLite.

## Getting Started

```bash
npm install
npx prisma db push       # creates dev.db from prisma/schema.prisma
npx tsx prisma/seed.ts   # optional: adds sample cars, reviews, and one order
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's here

- **Public site**: homepage, `/cars` (browse + `/cars/[id]` detail), `/customize` (request a specific car), `/how-it-works`, `/reviews`, `/track` (order tracking by code + phone), `/contact`.
- **Bilingual**: English/Arabic toggle in the navbar, with right-to-left layout for Arabic. Translation strings live in `src/lib/i18n/translations.ts`.
- **Admin panel** at `/admin` — manage car listings, view inquiries and custom car requests, manage orders (tracking codes/status), manage reviews.

## Before going live

1. **Admin login** — set real values for `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env` (currently a placeholder password). Also replace `SESSION_SECRET` with a new random value if you regenerate this file.
2. **How It Works video** — once you have the explainer video, paste its embed URL into `howItWorksVideoUrl` in `src/lib/site-config.ts`.
3. **Database** — this uses local SQLite (`dev.db`), which is fine for development but won't survive most hosting platforms' deploys. Before deploying, switch to a hosted Postgres/MySQL database (update `datasource` in `prisma/schema.prisma` and `DATABASE_URL`).
4. **Contact details** — `src/lib/site-config.ts` holds the business name, WhatsApp number, and contact email shown across the site.

## Deploy

Works well on [Vercel](https://vercel.com/new). Point the domain `bidshipdrive.com` at it once deployed, and make sure the production `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SESSION_SECRET` env vars are set there too.
