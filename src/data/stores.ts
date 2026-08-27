import type { StoreDefinition } from '../types'

// Brand colors approximate each chain's real palette. Swap `initials` for a
// real SVG/PNG logo under src/assets/logos/ later without changing the id,
// since MembershipCard.store_id references these ids.
export const STORES: StoreDefinition[] = [
  { id: 'trumf', name: 'Trumf', color: '#e30613', initials: 'TR' },
  { id: 'kiwi', name: 'Kiwi', color: '#e2001a', initials: 'KW' },
  { id: 'meny', name: 'Meny', color: '#00843d', initials: 'MY' },
  { id: 'spar', name: 'Spar', color: '#00693e', initials: 'SP' },
  { id: 'coop-medlem', name: 'Coop Medlem', color: '#c8102e', initials: 'CO' },
  { id: 'coop-extra', name: 'Coop Extra', color: '#0072ce', initials: 'EX' },
  { id: 'coop-obs', name: 'Coop Obs', color: '#e2001a', initials: 'OB' },
  { id: 'elkjop', name: 'Elkjøpklubben', color: '#004b93', initials: 'EL' },
  { id: 'circle-k', name: 'Circle K Extra', color: '#d0021b', initials: 'CK' },
  { id: 'xxl', name: 'XXL Sport', color: '#000000', initials: 'XL' },
  { id: 'sport1', name: 'Sport 1', color: '#005baa', initials: 'S1' },
  { id: 'other', name: 'Other', color: '#475569', initials: '?' },
]

export function getStore(storeId: string): StoreDefinition {
  return STORES.find((s) => s.id === storeId) ?? STORES[STORES.length - 1]
}
