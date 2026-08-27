import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { CardsPage } from './pages/CardsPage'
import { AddCardPage } from './pages/AddCardPage'
import { CardDetailPage } from './pages/CardDetailPage'
import { loadCurrentProfile } from './lib/session'
import { listCards } from './lib/cards'
import type { MembershipCard, Profile } from './types'
import './App.css'

function App() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cards, setCards] = useState<MembershipCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCurrentProfile()
      .then(async (p) => {
        setProfile(p)
        if (p) setCards(await listCards(p.id))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return null

  if (!profile) {
    return (
      <LoginPage
        onSignedIn={async (p) => {
          setProfile(p)
          setCards(await listCards(p.id))
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
