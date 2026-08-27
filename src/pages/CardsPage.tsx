import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { StoreLogo } from '../components/StoreLogo'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { getStore } from '../data/stores'
import { clearSession } from '../lib/session'
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

  function handleSignOut() {
    clearSession()
    onSignedOut()
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
          <p className="hint">{profile.name}</p>
        </div>
        <button type="button" onClick={handleSignOut} className="secondary">
          {t('cards.logout')}
        </button>
      </div>

      {cards.length === 0 && <p className="hint">{t('cards.empty')}</p>}
      {cards.length > 0 && <p className="hint">{t('cards.scan')}</p>}

      <ul className="card-list">
        {cards.map((card) => {
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
