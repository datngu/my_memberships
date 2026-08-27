# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A mobile-first PWA (installable to a home screen icon) for saving Norwegian shop membership cards and pulling one up fast for a cashier to scan. Built for a small group of friends, not the general public. See `README.md` for setup and `supabase/schema.sql` for the database schema and its security-model comment.

## Commands

- `npm run dev` - start the Vite dev server
- `npm run build` - `tsc -b && vite build` (typecheck, then production build; run this before considering any change done)
- `npm run lint` - oxlint
- `npm run preview` - serve the production build locally

There is no test runner configured yet.

## Environment

Requires `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local` (see `.env.example`). `src/lib/supabase.ts` throws at import time if either is missing, this will break `npm run dev`/`build` in a fresh checkout until `.env.local` is created and the schema is applied via `supabase/schema.sql`.

## Architecture

**Auth is intentionally not real authentication.** There are no passwords. `src/lib/session.ts` identifies a person by phone number only: `findOrCreateProfile` looks up (or creates) a `profiles` row by phone, and the resulting `profile.id` is cached in `localStorage` as the "session." Anyone who knows a friend's phone number can sign in as them, and Supabase RLS policies for `profiles`/`cards` are correspondingly permissive (open read/insert/delete for the `anon` role). This is a deliberate scope decision (see `supabase/schema.sql` header comment), not an oversight, don't "fix" it by bolting on password auth unless asked.

**Data model** (`supabase/schema.sql`, mirrored in `src/types/index.ts`): `profiles` (id, name, email, phone) 1-to-many `cards` (id, profile_id, store_id, label, code, code_type, sort_order). `store_id` is a free-text key into the static store catalog in `src/data/stores.ts`, it is not a foreign key, no join or migration is needed to add a new store.

**Store branding is a placeholder scheme, not real logos.** `src/data/stores.ts` defines each Norwegian chain (Trumf, Kiwi, Meny, Coop variants, Elkjøp, Circle K, XXL, Sport 1, ...) with a brand color and initials; `src/components/StoreLogo.tsx` renders that as a colored badge. There is no logo image asset pipeline yet. If real logos are added, they should be swapped in per `store_id` (e.g. `src/assets/logos/<id>.svg`) without changing existing ids, since `cards.store_id` values already reference them.

**Card codes render as either a barcode (`jsbarcode`, CODE128) or a QR code (`qrcode.react`)**, chosen per-card at creation time (`code_type` on the card). `src/components/CodeDisplay.tsx` is the single place that switches between the two. The membership "code" itself is often just the person's phone number, matching how Norwegian stores commonly look up membership at checkout, this is why `addCard.codeHint` calls that out and why phone number is also the identity key for login.

**Screens are plain state, not global state management**: `src/App.tsx` owns `profile` and `cards` in `useState`, loads them once via `loadCurrentProfile`/`listCards` on mount, and passes them down as props with callbacks (`onAdded`, `onDeleted`, `onSignedOut`) that mutate local state after a Supabase write succeeds, there is no refetch-after-write. Routing is `react-router-dom` with four routes: `/` (list), `/add`, `/card/:cardId` (full-screen quick-scan view), `*` (redirect home).

**i18n**: `src/i18n/{en,vi,no}.json` are parallel key sets loaded by `src/i18n/index.ts` (English is `fallbackLng`). Adding UI text means adding the key to all three files, `react-i18next`'s `useTranslation()`/`t()` is used throughout, no key should be hardcoded in a component.

**PWA config lives in `vite.config.ts`** (`VitePWA` plugin: manifest, service worker via Workbox `generateSW`). The manifest icon currently points at `public/favicon.svg` as a stand-in; before a real production deploy this should be swapped for proper 192/512px PNG (plus a maskable variant), see the icons array in `vite.config.ts`.
