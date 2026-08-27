import { supabase } from './supabase'
import type { CodeType, MembershipCard } from '../types'

export async function listCards(profileId: string): Promise<MembershipCard[]> {
  const { data, error } = await supabase
    .from('cards')
    .select('*')
    .eq('profile_id', profileId)
    .order('sort_order', { ascending: true })

  if (error) throw error
  return data as MembershipCard[]
}

export async function addCard(input: {
  profileId: string
  storeId: string
  label: string | null
  code: string
  codeType: CodeType
  sortOrder: number
}): Promise<MembershipCard> {
  const { data, error } = await supabase
    .from('cards')
    .insert({
      profile_id: input.profileId,
      store_id: input.storeId,
      label: input.label,
      code: input.code,
      code_type: input.codeType,
      sort_order: input.sortOrder,
    })
    .select('*')
    .single()

  if (error) throw error
  return data as MembershipCard
}

export async function updateCard(
  cardId: string,
  input: { label: string | null; code: string; codeType: CodeType },
): Promise<MembershipCard> {
  const { data, error } = await supabase
    .from('cards')
    .update({ label: input.label, code: input.code, code_type: input.codeType })
    .eq('id', cardId)
    .select('*')
    .single()

  if (error) throw error
  return data as MembershipCard
}

export async function deleteCard(cardId: string): Promise<void> {
  const { error } = await supabase.from('cards').delete().eq('id', cardId)
  if (error) throw error
}

// Most Norwegian stores look up membership by phone number, so every
// profile gets one auto-created "master" card carrying it. Existing
// profiles (from before this existed) get it lazily on next login.
//
// The select-then-insert here is inherently racy (e.g. React StrictMode
// double-firing an effect in dev calls this twice back to back), so the
// database also enforces at most one master card per profile
// (cards_one_master_per_profile in schema.sql). If two calls race, the
// loser's insert fails with a unique violation (Postgres code 23505) --
// that's expected, not an error, so it re-selects the winner's row.
export async function ensureMasterCard(profileId: string, phone: string): Promise<MembershipCard> {
  const { data: existing, error: findError } = await supabase
    .from('cards')
    .select('*')
    .eq('profile_id', profileId)
    .eq('store_id', 'master')
    .limit(1)
    .maybeSingle()

  if (findError) throw findError
  if (existing) return existing as MembershipCard

  const { data: created, error: insertError } = await supabase
    .from('cards')
    .insert({
      profile_id: profileId,
      store_id: 'master',
      label: null,
      code: phone,
      code_type: 'barcode',
      sort_order: -1,
    })
    .select('*')
    .single()

  if (insertError) {
    if (insertError.code === '23505') {
      const { data: winner, error: refetchError } = await supabase
        .from('cards')
        .select('*')
        .eq('profile_id', profileId)
        .eq('store_id', 'master')
        .single()
      if (refetchError) throw refetchError
      return winner as MembershipCard
    }
    throw insertError
  }
  return created as MembershipCard
}
