# Membership Cards

A mobile-first PWA for saving Norwegian shop membership cards and pulling one up fast at checkout. Installable to a home screen icon; no password, just name + phone number.

Live at **https://mymemberships.vercel.app**
Onboarding guide for friends: **https://mymemberships.vercel.app/guide**

## Features

- Sign in with just a name + phone number, no password
- Every profile gets an automatic "master" card carrying your phone number, since most Norwegian stores look up membership by phone regardless of which chain's card is asked for
- Add unlimited store membership cards, each shown as a barcode or QR code for quick scanning
- English, Vietnamese, and Norwegian, switchable anytime
- Installable to your phone's home screen, works offline for already-visited screens
- A "Share with a friend" button sends the onboarding guide via your phone's native share sheet (or copies the link)

## Stack

- React + Vite + TypeScript, packaged as a PWA (`vite-plugin-pwa`)
- Supabase (Postgres) for shared storage across devices/friends
- `react-i18next` for English (default), Vietnamese, Norwegian
- `jsbarcode` / `qrcode.react` to render each card's code for scanning

## Setup

1. Create a free [Supabase](https://supabase.com) project.
2. In the SQL editor, run `supabase/schema.sql`.
3. Copy `.env.example` to `.env.local` and fill in the project URL and anon key (Project Settings → API).
4. `npm install`
5. `npm run dev`

## Scripts

- `npm run dev` - start the dev server
- `npm run build` - typecheck (`tsc -b`) then build for production
- `npm run lint` - oxlint
- `npm run preview` - preview the production build locally

## Deploying

Deployed on [Vercel](https://vercel.com) (free tier). Push to `main`, then `vercel deploy --prod` to publish (deploys aren't automatic on push, see `CLAUDE.md` for why). `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set as environment variables on the Vercel project.

A scheduled GitHub Action (`.github/workflows/supabase-keep-alive.yml`) pings Supabase every 2 days so the free-tier database doesn't auto-pause from inactivity.

## Security note

Sign-in only matches a phone number to a profile, there is no password. This is a deliberate tradeoff for a small trusted friend group, not a general-purpose auth system. See the comment at the top of `supabase/schema.sql`.

---

For architecture notes, non-obvious implementation decisions, and gotchas, see `CLAUDE.md`.
