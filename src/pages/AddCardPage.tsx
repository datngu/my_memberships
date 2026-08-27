import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { STORES } from '../data/stores'
import { addCard } from '../lib/cards'
import type { CodeType, MembershipCard, Profile } from '../types'

export function AddCardPage({
  profile,
  nextSortOrder,
  onAdded,
}: {
  profile: Profile
  nextSortOrder: number
  onAdded: (card: MembershipCard) => void
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [storeId, setStoreId] = useState(STORES[0].id)
  const [label, setLabel] = useState('')
  const [code, setCode] = useState('')
  const [codeType, setCodeType] = useState<CodeType>('barcode')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) {
      setError(t('login.error'))
      return
    }
    setSaving(true)
    setError(null)
    try {
      const card = await addCard({
        profileId: profile.id,
        storeId,
        label: label.trim() || null,
        code: code.trim(),
        codeType,
        sortOrder: nextSortOrder,
      })
      onAdded(card)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <form onSubmit={handleSubmit} className="card-form">
        <h2>{t('addCard.title')}</h2>
        <label>
          {t('addCard.store')}
          <select value={storeId} onChange={(e) => setStoreId(e.target.value)}>
            {STORES.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t('addCard.label')}
          <input value={label} onChange={(e) => setLabel(e.target.value)} />
        </label>
        <label>
          {t('addCard.code')}
          <input value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>
        <p className="hint">{t('addCard.codeHint')}</p>
        <label>
          {t('addCard.codeType')}
          <select value={codeType} onChange={(e) => setCodeType(e.target.value as CodeType)}>
            <option value="barcode">{t('addCard.codeType.barcode')}</option>
            <option value="qr">{t('addCard.codeType.qr')}</option>
          </select>
        </label>
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="secondary" onClick={() => navigate('/')}>
            {t('addCard.cancel')}
          </button>
          <button type="submit" disabled={saving}>
            {t('addCard.save')}
          </button>
        </div>
      </form>
    </div>
  )
}
