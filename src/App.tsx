import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { LoginPage } from './pages/LoginPage'
import { CardsPage } from './pages/CardsPage'
import { AddCardPage } from './pages/AddCardPage'
import { EditCardPage } from './pages/EditCardPage'
import { EditProfilePage } from './pages/EditProfilePage'
import { CardDetailPage } from './pages/CardDetailPage'
import { GuidePage } from './pages/GuidePage'
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

  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, registration) {
      // registerType 'prompt' only checks on registration, poll periodically
      // so a long-open tab still notices a deploy.
      if (registration) {
        setInterval(() => registration.update(), 60 * 60 * 1000)
      }
    },
  })

  useEffect(() => {
    loadCurrentProfile()
      .then(async (p) => {
        setProfile(p)
        if (p) setCards(await loadCardsWithMaster(p))
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <Routes>
      {/* Reachable without signing in: this is the link sent to a new
          friend before they've ever opened the app. */}
      <Route path="/guide" element={<GuidePage />} />
      <Route
        path="/*"
        element={
          loading ? null : !profile ? (
            <LoginPage
              onSignedIn={async (p) => {
                setProfile(p)
                setCards(await loadCardsWithMaster(p))
              }}
            />
          ) : (
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
                    updateAvailable={needRefresh}
                    onUpdate={() => updateServiceWorker(true)}
                  />
                }
              />
              <Route
                path="/profile/edit"
                element={<EditProfilePage profile={profile} onUpdated={(p) => setProfile(p)} />}
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
              <Route path="/card/:cardId" element={<CardDetailPage cards={cards} />} />
              <Route
                path="/card/:cardId/edit"
                element={
                  <EditCardPage
                    cards={cards}
                    onUpdated={(card) =>
                      setCards((prev) => prev.map((c) => (c.id === card.id ? card : c)))
                    }
                    onDeleted={(cardId) => setCards((prev) => prev.filter((c) => c.id !== cardId))}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )
        }
      />
    </Routes>
  )
}

export default App
