import { supabase } from './supabase'
import type { Profile } from '../types'

const SESSION_KEY = 'membership.profileId'

// Convenience-level identification only, not real authentication: anyone who
// knows a friend's phone number can sign in as them. This matches the app's
// scope (a small trusted friend group, no password management).
export function normalizePhone(raw: string): string {
  return raw.replace(/[^\d+]/g, '')
}

export async function findOrCreateProfile(input: {
  name: string
  email: string | null
  phone: string
}): Promise<Profile> {
  const phone = normalizePhone(input.phone)

  const { data: existing, error: findError } = await supabase
    .from('profiles')
    .select('*')
    .eq('phone', phone)
    .maybeSingle()

  if (findError) throw findError
  if (existing) return existing as Profile

  const { data: created, error: insertError } = await supabase
    .from('profiles')
    .insert({ name: input.name, email: input.email, phone })
    .select('*')
    .single()

  if (insertError) throw insertError
  return created as Profile
}

export async function updateProfile(
  profileId: string,
  input: { name: string; email: string | null },
): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ name: input.name, email: input.email })
    .eq('id', profileId)
    .select('*')
    .single()

  if (error) throw error
  return data as Profile
}

export function saveSession(profileId: string) {
  localStorage.setItem(SESSION_KEY, profileId)
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function getSessionProfileId(): string | null {
  return localStorage.getItem(SESSION_KEY)
}

export async function loadCurrentProfile(): Promise<Profile | null> {
  const id = getSessionProfileId()
  if (!id) return null

  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  if (!data) {
    clearSession()
    return null
  }
  return data as Profile
}
