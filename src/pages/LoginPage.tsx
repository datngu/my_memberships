import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { findOrCreateProfile, saveSession } from '../lib/session'
import { errorMessage } from '../lib/errors'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import type { Profile } from '../types'

export function LoginPage({ onSignedIn }: { onSignedIn: (profile: Profile) => void }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      setError(t('login.error'))
      return
    }
    setError(null)
    setLoading(true)
    try {
      const profile = await findOrCreateProfile({
        name: name.trim(),
        email: email.trim() || null,
        phone,
      })
      saveSession(profile.id)
      onSignedIn(profile)
    } catch (err) {
      setError(errorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page login-page">
      <div className="top-bar">
        <h1>{t('app.title')}</h1>
        <LanguageSwitcher />
      </div>
      <form onSubmit={handleSubmit} className="card-form">
        <h2>{t('login.title')}</h2>
        <p className="hint">{t('login.subtitle')}</p>
        <label>
          {t('login.name')}
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          {t('login.email')}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          {t('login.phone')}
          <input
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {t('login.submit')}
        </button>
      </form>
    </div>
  )
}
