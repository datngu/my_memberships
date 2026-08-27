# Membership Cards

A mobile-first PWA for saving Norwegian shop membership cards and pulling one up fast at checkout. Installable to a home screen icon; no password, just name + phone number.

Live at **https://mymemberships.vercel.app**

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

Deployed on [Vercel](https://vercel.com) (free tier), project `datngu/my_memberships`, linked via the Vercel CLI rather than a GitHub import (no GitHub remote for this repo yet, so there's no auto-deploy on push — re-run `vercel deploy --prod` after changes, or connect a git remote later for that). `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set as environment variables on the Vercel project (all three environments: production/preview/development), added with `--type config` since the Supabase anon key is meant to be public (protected by RLS, not secrecy) and Vite bundles `VITE_`-prefixed vars into client JS anyway. Vercel serves the PWA over HTTPS, which is required for install prompts and service workers.

## Security note

Sign-in only matches a phone number to a profile, there is no password. This is a deliberate tradeoff for a small trusted friend group, not a general-purpose auth system. See the comment at the top of `supabase/schema.sql`.
