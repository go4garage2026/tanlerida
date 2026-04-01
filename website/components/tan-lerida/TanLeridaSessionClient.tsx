'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnalysisLoader } from '@/components/tan-lerida/AnalysisLoader'
import { BodyProfileStep } from '@/components/tan-lerida/BodyProfileStep'
import { GeneratedOutfitCard } from '@/components/tan-lerida/GeneratedOutfitCard'
import { PhotoUploadStep } from '@/components/tan-lerida/PhotoUploadStep'
import { RecommendationCard } from '@/components/tan-lerida/RecommendationCard'
import { StylePreferenceStep } from '@/components/tan-lerida/StylePreferenceStep'
import { products as catalogProducts } from '@/lib/catalog'
import type { Product, TanLeridaSessionType } from '@/types'

type SessionResponse = TanLeridaSessionType & { ownerId?: string; consent?: boolean; moderationAccepted?: boolean }

const POLL_INTERVAL_MS = 2_500
const POLL_TIMEOUT_MS = 120_000

export function TanLeridaSessionClient({ initialSession }: { initialSession: SessionResponse }) {
  const router = useRouter()
  const [session, setSession] = useState<SessionResponse>(initialSession)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dbProducts, setDbProducts] = useState<Product[]>([])
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [photoValues, setPhotoValues] = useState<Record<string, string>>({
    casual: initialSession.userPhotos?.casual ?? '',
    formal: initialSession.userPhotos?.formal ?? '',
    fullBody: initialSession.userPhotos?.fullBody ?? '',
    ethnic: initialSession.userPhotos?.ethnic ?? '',
  })
  const [profileValues, setProfileValues] = useState({
    gender: String(initialSession.bodyProfile?.gender ?? 'Male'),
    ageRange: String(initialSession.bodyProfile?.ageRange ?? '31-35'),
    heightCm: Number(initialSession.bodyProfile?.heightCm ?? 180),
    bodyBuild: String(initialSession.bodyProfile?.bodyBuild ?? 'Athletic'),
    skinTone: String(initialSession.bodyProfile?.skinTone ?? 'Warm medium'),
    resonance: Array.isArray(initialSession.bodyProfile?.resonance) ? (initialSession.bodyProfile?.resonance as string[]) : ['Classic Professional'],
  })
  const [preferenceValues, setPreferenceValues] = useState({
    need: String(initialSession.stylePreferences?.need ?? ''),
    laptopSize: String(initialSession.stylePreferences?.laptopSize ?? '15 inch'),
    structure: String(initialSession.stylePreferences?.structure ?? 'Structured'),
    budget: String(initialSession.stylePreferences?.budget ?? '₹10,000 - ₹15,000'),
    occasion: String(initialSession.stylePreferences?.occasion ?? 'Quarterly board presentations'),
    colours: String(initialSession.stylePreferences?.colours ?? 'Prefer black, oxblood, and dark brown.'),
  })

  const refreshSession = useCallback(async () => {
    const response = await fetch(`/api/tan-lerida/session/${initialSession.id}`)
    const data = await response.json()
    if (data.success) {
      setSession(data.session)
      return data.session as SessionResponse
    }
    throw new Error(data.message ?? 'Unable to load session state.')
  }, [initialSession.id])

  // Fetch real session data on mount & products
  useEffect(() => {
    refreshSession().catch(() => {})
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => { if (data.products) setDbProducts(data.products) })
      .catch(() => {})
  }, [refreshSession])

  // Resume polling if we land on ANALYSING status
  useEffect(() => {
    if (session.status !== 'ANALYSING' || busy) return

    setBusy(true)
    setError(null)
    const start = Date.now()

    pollRef.current = setInterval(async () => {
      try {
        const next = await refreshSession()
        if (next.status === 'COMPLETED' || next.status === 'RECOMMENDATION_READY') {
          if (pollRef.current) clearInterval(pollRef.current)
          pollRef.current = null
          setBusy(false)
          router.refresh()
        }
      } catch {
        // ignore transient fetch errors during polling
      }

      if (Date.now() - start > POLL_TIMEOUT_MS) {
        if (pollRef.current) clearInterval(pollRef.current)
        pollRef.current = null
        setBusy(false)
        setError('Analysis is taking longer than expected. Please refresh the page to check for results.')
      }
    }, POLL_INTERVAL_MS)

    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.status])

  // Clean up polling on unmount
  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [])

  const allProducts = dbProducts.length > 0 ? dbProducts : catalogProducts
  const recommendedProduct = useMemo(
    () => allProducts.find((p) => p.id === session.recommendedProductId) ?? allProducts[0],
    [session.recommendedProductId, allProducts]
  )
  const recommendation = (session.recommendation ?? {}) as { primaryRecommendation?: { narrative?: string }; narrative?: string }

  async function savePhotos() {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/tan-lerida/upload-photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, photos: photoValues }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.message ?? 'Photo validation failed.')
      setSession(data.session)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save photos. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function saveProfile() {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/tan-lerida/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, ...profileValues }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.message ?? 'Unable to save profile.')
      setSession(data.session)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save profile. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function savePreferences() {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/tan-lerida/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id, ...preferenceValues }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.message ?? 'Unable to save preferences.')
      setSession(data.session)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save preferences. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function startAnalysis() {
    setBusy(true)
    setError(null)
    try {
      const response = await fetch('/api/tan-lerida/analyse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: session.id }),
      })
      const data = await response.json()
      if (!data.success) throw new Error(data.message ?? 'Unable to start analysis.')

      setSession((prev) => ({ ...prev, status: 'ANALYSING' as const }))
      // Polling is started by the useEffect that watches session.status === 'ANALYSING'
    } catch (err) {
      setBusy(false)
      setError(err instanceof Error ? err.message : 'Unable to start analysis. Please try again.')
    }
  }

  return (
    <div className="space-y-8">
      <div className="border border-[#2A2A2A] bg-[#111111] p-6">
        <p className="font-label text-xs tracking-[0.25em] text-[#C0392B]">YOUR SESSION</p>
        <p className="mt-3 font-mono-tan text-2xl text-[#BFA07A]">{session.sessionCode}</p>
        <p className="mt-2 text-sm text-[#A0A0A0]">Current status: {session.status}</p>
      </div>

      {error ? (
        <div className="border border-red-700 bg-red-950/40 p-4 text-sm text-red-300">
          <p>{error}</p>
          <button type="button" className="mt-2 text-xs underline text-red-400 hover:text-red-200" onClick={() => setError(null)}>Dismiss</button>
        </div>
      ) : null}

      {session.status === 'INITIATED' ? (
        <PhotoUploadStep values={photoValues} onChange={(key, value) => setPhotoValues((current) => ({ ...current, [key]: value }))} onSubmit={savePhotos} loading={busy} />
      ) : null}

      {session.status === 'PHOTOS_UPLOADED' ? (
        <BodyProfileStep values={profileValues} onChange={(key, value) => setProfileValues((current) => ({ ...current, [key]: value }))} onSubmit={saveProfile} loading={busy} />
      ) : null}

      {session.status === 'PROFILE_COLLECTED' ? (
        <StylePreferenceStep values={preferenceValues} onChange={(key, value) => setPreferenceValues((current) => ({ ...current, [key]: value }))} onSubmit={savePreferences} loading={busy} />
      ) : null}

      {session.status === 'PROFILE_COLLECTED' && session.stylePreferences ? (
        <button type="button" className="btn-red" onClick={startAnalysis} disabled={busy}>
          {busy ? 'Starting Tan Lerida…' : 'Begin analysis'}
        </button>
      ) : null}

      {session.status === 'ANALYSING' ? <AnalysisLoader /> : null}

      {(session.status === 'RECOMMENDATION_READY' || session.status === 'COMPLETED') && session.generatedImageUrl ? (
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <GeneratedOutfitCard imageUrl={session.generatedImageUrl} />
          <RecommendationCard product={recommendedProduct} narrative={String(recommendation.primaryRecommendation?.narrative ?? recommendation.narrative ?? '')} estimatedDelivery={session.estimatedDelivery} />
        </div>
      ) : null}
    </div>
  )
}
