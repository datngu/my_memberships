import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { CardsPage } from './pages/CardsPage'
import { AddCardPage } from './pages/AddCardPage'
import { EditCardPage } from './pages/EditCardPage'
import { CardDetailPage } from './pages/CardDetailPage'
import { loadCurrentProfile } from './lib/session'
import { ensureMasterCard, listCards } from './lib/cards'
import type { MembershipCard, Profile } from './types'
import './App.css'

async function loadCardsWithMaster(p: Profile): Promise<MembershipCard[]> {
  await ensureMasterCard(p.id, p.phone)
  return listCards(p.id)
}

function App() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cards, setCards] = useState<MembershipCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCurrentProfile()
      .then(async (p) => {
        setProfile(p)
        if (p) setCards(await loadCardsWithMaster(p))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null

  if (!profile) {
    return (
      <LoginPage
        onSignedIn={async (p) => {
          setProfile(p)
          setCards(await loadCardsWithMaster(p))
        }}
      />
    )
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <CardsPage
            profile={profile}
            cards={cards}
            onSignedOut={() => {
              setProfile(null)
              setCards([])
            }}
          />
        }
      />
      <Route
        path="/add"
        element={
          <AddCardPage
            profile={profile}
            nextSortOrder={cards.length}
            onAdded={(card) => setCards((prev) => [...prev, card])}
          />
        }
      />
      <Route
        path="/card/:cardId"
        element={
          <CardDetailPage
            cards={cards}
            onDeleted={(cardId) => setCards((prev) => prev.filter((c) => c.id !== cardId))}
          />
        }
      />
      <Route
        path="/card/:cardId/edit"
        element={
          <EditCardPage
            cards={cards}
            onUpdated={(card) =>
              setCards((prev) => prev.map((c) => (c.id === card.id ? card : c)))
            }
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
