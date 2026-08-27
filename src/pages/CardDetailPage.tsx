import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { StoreLogo } from '../components/StoreLogo'
import { CodeDisplay } from '../components/CodeDisplay'
import { getStore } from '../data/stores'
import type { MembershipCard } from '../types'

export function CardDetailPage({ cards }: { cards: MembershipCard[] }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { cardId } = useParams()
  const card = cards.find((c) => c.id === cardId)

  useEffect(() => {
    if (!card) navigate('/')
  }, [card, navigate])

  if (!card) return null

  const store = getStore(card.store_id)

  return (
    <div className="page card-detail-page">
      <div className="detail-header">
        <button type="button" className="secondary back-button" onClick={() => navigate('/')}>
          &larr; {t('cardDetail.back')}
        </button>
        <Link to={`/card/${card.id}/edit`} className="secondary">
          {t('cardDetail.edit')}
        </Link>
      </div>

      <div className="card-detail-body">
        <StoreLogo storeId={card.store_id} size={64} />
        <h2>{card.label || store.name}</h2>
        <div className="code-wrap">
          <CodeDisplay code={card.code} codeType={card.code_type} />
        </div>
        <p className="code-text">{card.code}</p>
      </div>
    </div>
  )
}
