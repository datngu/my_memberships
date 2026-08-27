import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from '../lib/session'
import { errorMessage } from '../lib/errors'
import type { Profile } from '../types'

export function EditProfilePage({
  profile,
  onUpdated,
}: {
  profile: Profile
  onUpdated: (profile: Profile) => void
}) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email ?? '')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      setError(t('login.error'))
      return
    }
    setSaving(true)
    setError(null)
    try {
      const updated = await updateProfile(profile.id, {
        name: name.trim(),
        email: email.trim() || null,
      })
      onUpdated(updated)
      navigate('/')
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page">
      <form onSubmit={handleSubmit} className="card-form">
        <h2>{t('editProfile.title')}</h2>
        <label>
          {t('login.name')}
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          {t('login.email')}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        {error && <p className="error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="secondary" onClick={() => navigate('/')}>
            {t('common.cancel')}
          </button>
          <button type="submit" disabled={saving}>
            {t('common.save')}
          </button>
        </div>
      </form>
    </div>
  )
}
