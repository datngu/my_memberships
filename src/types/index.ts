export type CodeType = 'barcode' | 'qr'

export interface Profile {
  id: string
  name: string
  email: string | null
  phone: string
  created_at: string
}

export interface MembershipCard {
  id: string
  profile_id: string
  store_id: string
  label: string | null
  code: string
  code_type: CodeType
  sort_order: number
  created_at: string
}

export interface StoreDefinition {
  id: string
  name: string
  color: string
  initials: string
}
