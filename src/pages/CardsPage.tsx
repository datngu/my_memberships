import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { StoreLogo } from '../components/StoreLogo'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { getStore } from '../data/stores'
import { clearSession } from '../lib/session'
import { checkForAppUpdate } from '../lib/pwa'
import type { MembershipCard, Profile } from '../types'

export function CardsPage({
  profile,
  cards,
  onSignedOut,
}: {
  profile: Profile
  cards: MembershipCard[]
  onSignedOut: () => void
}) {
  const { t } = useTranslation()
  const masterCard = cards.find((c) => c.store_id === 'master')
  const otherCards = cards.filter((c) => c.store_id !== 'master')
  const [checkingUpdate, setCheckingUpdate] = useState(false)

  function handleSignOut() {
    clearSession()
    onSignedOut()
  }

  async function handleCheckForUpdate() {
    setCheckingUpdate(true)
    await checkForAppUpdate()
  }

  return (
    <div className="page">
      <div className="top-bar">
        <h1>{t('app.title')}</h1>
        <LanguageSwitcher />
      </div>
      <div className="cards-header">
        <div>
          <h2>{t('cards.title')}</h2>
          <p className="hint">
            {profile.name} · <Link to="/profile/edit">{t('cardDetail.edit')}</Link>
          </p>
        </div>
        <div className="header-actions">
          <button type="button" onClick={handleSignOut} className="secondary">
            {t('cards.logout')}
          </button>
          <button
            type="button"
            onClick={handleCheckForUpdate}
            className="secondary"
            disabled={checkingUpdate}
          >
            {checkingUpdate ? t('cards.updating') : t('cards.update')}
          </button>
        </div>
      </div>

      {masterCard && (
        <Link to={`/card/${masterCard.id}`} className="card-row master-row">
          <StoreLogo storeId="master" size={56} />
          <div className="card-row-text">
            <span className="card-row-title">{masterCard.label || profile.name}</span>
            <span className="card-row-code">{masterCard.code}</span>
          </div>
        </Link>
      )}

      {otherCards.length === 0 && <p className="hint">{t('cards.empty')}</p>}
      {otherCards.length > 0 && <p className="hint">{t('cards.scan')}</p>}

      <ul className="card-list">
        {otherCards.map((card) => {
          const store = getStore(card.store_id)
          return (
            <li key={card.id}>
              <Link to={`/card/${card.id}`} className="card-row">
                <StoreLogo storeId={card.store_id} />
                <div className="card-row-text">
                  <span className="card-row-title">{card.label || store.name}</span>
                  <span className="card-row-code">{card.code}</span>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      <Link to="/add" className="fab">
        + {t('cards.add')}
      </Link>
    </div>
  )
}
