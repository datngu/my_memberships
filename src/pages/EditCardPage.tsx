import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { getStore } from '../data/stores'
import { updateCard } from '../lib/cards'
import { errorMessage } from '../lib/errors'
import type { CodeType, MembershipCard } from '../types'

export function EditCardPage({
  cards,
  onUpdated,
}: {
  cards: MembershipCard[]
  onUpdated: (card: MembershipCard) => void
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { cardId } = useParams()
  const card = cards.find((c) => c.id === cardId)

  const store = card ? getStore(card.store_id) : null
  const [label, setLabel] = useState(card?.label ?? '')
  const [code, setCode] = useState(card?.code ?? '')
  const [codeType, setCodeType] = useState<CodeType>(card?.code_type ?? 'barcode')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!card) navigate('/')
  }, [card, navigate])

  if (!card) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!card || !code.trim()) {
      setError(t('login.error'))
      return
    }
    setSaving(true)
    setError(null)
    try {
      const updated = await updateCard(card.id, {
        label: label.trim() || null,
        code: code.trim(),
        codeType,
      })
      onUpdated(updated)
      navigate(`/card/${card.id}`)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <form onSubmit={handleSubmit} className="card-form">
        <h2>{t('editCard.title')}</h2>
        <p className="hint">{store?.name}</p>
        <label>
          {t('addCard.label')}
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder={store?.name}
          />
        </label>
        <label>
          {t('addCard.code')}
          <input value={code} onChange={(e) => setCode(e.target.value)} required />
        </label>
        <label>
          {t('addCard.codeType')}
          <select value={codeType} onChange={(e) => setCodeType(e.target.value as CodeType)}>
            <option value="barcode">{t('addCard.codeType.barcode')}</option>
            <option value="qr">{t('addCard.codeType.qr')}</option>
          </select>
        </label>
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="secondary" onClick={() => navigate(`/card/${card.id}`)}>
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
