import type { StoreDefinition } from '../types'

// 'master' is a reserved id: it is the auto-created phone-number card, not a
// user-selectable store, and is filtered out of add/edit store pickers (see
// SELECTABLE_STORES below). 'other' is a deliberate catch-all fallback, not
// a specific chain, kept so a card can still be added for a store not in
// this list. Brand colors here are approximate; swap `initials` for a real
// SVG/PNG logo under src/assets/logos/ later without changing the id, since
// MembershipCard.store_id references these ids.
export const STORES: StoreDefinition[] = [
  { id: 'master', name: 'Phone / ID', color: '#f59e0b', initials: 'ID' },
  { id: 'jula', name: 'Jula', color: '#d0021b', initials: 'JU' },
  { id: 'jysk', name: 'Jysk', color: '#e2001a', initials: 'JY' },
  { id: 'coop', name: 'Coop', color: '#c8102e', initials: 'CP' },
  { id: 'meny', name: 'Meny', color: '#00843d', initials: 'MY' },
  { id: 'rusta', name: 'Rusta', color: '#c8102e', initials: 'RA' },
  { id: 'clas-ohlson', name: 'Clas Ohlson', color: '#e2001a', initials: 'CH' },
  { id: 'megaflis', name: 'Megaflis', color: '#0072ce', initials: 'MF' },
  { id: 'biltema', name: 'Biltema', color: '#da291c', initials: 'BT' },
  { id: 'power', name: 'Power', color: '#111827', initials: 'PW' },
  { id: 'elkjop', name: 'Elkjøp', color: '#004b93', initials: 'EL' },
  { id: 'other', name: 'Other', color: '#475569', initials: '?' },
]

export const SELECTABLE_STORES = STORES.filter((s) => s.id !== 'master')

export function getStore(storeId: string): StoreDefinition {
  return STORES.find((s) => s.id === storeId) ?? STORES[STORES.length - 1]
}
