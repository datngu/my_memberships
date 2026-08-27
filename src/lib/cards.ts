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

export async function deleteCard(cardId: string): Promise<void> {
  const { error } = await supabase.from('cards').delete().eq('id', cardId)
  if (error) throw error
}
