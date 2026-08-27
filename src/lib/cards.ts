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
export async function ensureMasterCard(profileId: string, phone: string): Promise<MembershipCard | null> {
  const { data: existing, error: findError } = await supabase
    .from('cards')
    .select('*')
    .eq('profile_id', profileId)
    .eq('store_id', 'master')
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

  if (insertError) throw insertError
  return created as MembershipCard
}
