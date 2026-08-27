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

**Data model** (`supabase/schema.sql`, mirrored in `src/types/index.ts`): `profiles` (id, name, email, phone) 1-to-many `cards` (id, profile_id, store_id, label, code, code_type, sort_order). `store_id` is a free-text key into the static store catalog in `src/data/stores.ts`, it is not a foreign key, no join or migration is needed to add a new store. All four RLS actions (select/insert/update/delete) need their own permissive policy on `cards`, missing one silently blocks writes and PostgREST surfaces it as an opaque "Cannot coerce the result to a single JSON object" from `.select().single()`, not as an RLS-specific error, that's the first thing to check if a write "does nothing."

**Every profile has exactly one auto-created "master" card** (`store_id === 'master'`), carrying the person's phone number, since most Norwegian stores look up membership by phone regardless of which chain's card is being asked for. `ensureMasterCard` (`src/lib/cards.ts`) creates it on first login and is idempotent, called from `loadCardsWithMaster` in `src/App.tsx` on both fresh sign-in and returning-session load, so existing profiles get one lazily too. `'master'` is excluded from `SELECTABLE_STORES` (`src/data/stores.ts`), it can't be chosen when adding a regular card, and `CardsPage`/`CardDetailPage` special-case `store_id === 'master'` to render it as the larger first row (`.master-row` in `App.css`) and to hide the delete button, it can be edited (label/code) but not removed.

**Store branding is a placeholder scheme, not real logos.** `src/data/stores.ts` defines each store (Jula, Jysk, Coop, Meny, Rusta, Clas Ohlson, Megaflis, Biltema, Power, Elkjøp, plus `master` and the `other` catch-all) with a brand color and initials; `src/components/StoreLogo.tsx` renders that as a colored badge. There is no logo image asset pipeline yet. If real logos are added, they should be swapped in per `store_id` (e.g. `src/assets/logos/<id>.svg`) without changing existing ids, since `cards.store_id` values already reference them. The store list is intentionally curated, not exhaustive, don't bulk-add chains without being asked.

**Card codes render as either a barcode (`jsbarcode`, CODE128) or a QR code (`qrcode.react`)**, chosen per-card at creation time (`code_type` on the card). `src/components/CodeDisplay.tsx` is the single place that switches between the two.

**Screens are plain state, not global state management**: `src/App.tsx` owns `profile` and `cards` in `useState`, loads them once on mount, and passes them down as props with callbacks (`onAdded`, `onUpdated`, `onDeleted`, `onSignedOut`) that mutate local state after a Supabase write succeeds, there is no refetch-after-write. Routing is `react-router-dom`: `/` (list), `/add`, `/card/:cardId` (full-screen quick-scan view, also the master card's view), `/card/:cardId/edit`, `*` (redirect home). `CardDetailPage`/`EditCardPage` redirect to `/` via a `useEffect` when their card isn't found (e.g. mid-delete, before the route changes), not by calling `navigate()` directly in the render body, that pattern trips React's "Cannot update a component while rendering a different component" warning.

**i18n**: `src/i18n/{en,vi,no}.json` are parallel key sets loaded by `src/i18n/index.ts` (English is `fallbackLng`). Adding UI text means adding the key to all three files, `react-i18next`'s `useTranslation()`/`t()` is used throughout, no key should be hardcoded in a component.

**PWA config lives in `vite.config.ts`** (`VitePWA` plugin: manifest, service worker via Workbox `generateSW`). The manifest icon currently points at `public/favicon.svg` as a stand-in; before a real production deploy this should be swapped for proper 192/512px PNG (plus a maskable variant), see the icons array in `vite.config.ts`.

**Colors are CSS custom properties, not literals.** `src/index.css` defines `--bg`/`--text`/`--text-secondary`/`--border`/`--border-subtle`/`--danger`/`--accent-border`/`--accent-bg`/`--button-bg`/`--button-text`/`--input-bg` on `:root`, overridden under `@media (prefers-color-scheme: dark)`; `src/App.css` should reference these vars, not hardcode hex colors, or text goes invisible in the theme it wasn't hand-tested against. Two intentional exceptions, both hardcoded on purpose and commented in `App.css`: `.code-wrap`'s white background (barcodes/QR codes need black-on-white contrast to scan, regardless of app theme) and `button.danger`'s white text (reads fine on the fixed red in both themes, not worth theming).

**Safe-area insets** (`viewport-fit=cover` in `index.html`, `env(safe-area-inset-*)` padding on `.page` in `App.css`) keep content clear of the iPhone notch/Dynamic Island and home indicator when installed as a standalone PWA. Every screen must stay wrapped in the shared `.page` class to get this, a screen with its own top-level wrapper div would need the same padding added manually.
