'use client'

import { useEffect, useMemo, useState } from 'react'
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

export function TanLeridaSessionClient({ initialSession }: { initialSession: SessionResponse }) {
  const router = useRouter()
  const [session, setSession] = useState<SessionResponse>(initialSession)
  const [busy, setBusy] = useState(false)
  const [dbProducts, setDbProducts] = useState<Product[]>([])
  const [photoValues, setPhotoValues] = useState<Record<string, string>>({
    casual: session.userPhotos?.casual ?? '',
    formal: session.userPhotos?.formal ?? '',
    fullBody: session.userPhotos?.fullBody ?? '',
    ethnic: session.userPhotos?.ethnic ?? '',
  })
  const [profileValues, setProfileValues] = useState({
    gender: String(session.bodyProfile?.gender ?? 'Male'),
    ageRange: String(session.bodyProfile?.ageRange ?? '31-35'),
    heightCm: Number(session.bodyProfile?.heightCm ?? 180),
    bodyBuild: String(session.bodyProfile?.bodyBuild ?? 'Athletic'),
    skinTone: String(session.bodyProfile?.skinTone ?? 'Warm medium'),
    resonance: Array.isArray(session.bodyProfile?.resonance) ? (session.bodyProfile?.resonance as string[]) : ['Classic Professional'],
  })
  const [preferenceValues, setPreferenceValues] = useState({
    need: String(session.stylePreferences?.need ?? ''),
    laptopSize: String(session.stylePreferences?.laptopSize ?? '15 inch'),
    structure: String(session.stylePreferences?.structure ?? 'Structured'),
    budget: String(session.stylePreferences?.budget ?? '₹10,000 - ₹15,000'),
    occasion: String(session.stylePreferences?.occasion ?? 'Quarterly board presentations'),
    colours: String(session.stylePreferences?.colours ?? 'Prefer black, oxblood, and dark brown.'),
  })

  // Fetch real products from DB for recommendation display
  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => { if (data.products) setDbProducts(data.products) })
      .catch(() => {})
  }, [])

  const allProducts = dbProducts.length > 0 ? dbProducts : catalogProducts
  const recommendedProduct = useMemo(
    () => allProducts.find((p) => p.id === session.recommendedProductId) ?? allProducts[0],
    [session.recommendedProductId, allProducts]
  )
  const recommendation = (session.recommendation ?? {}) as { primaryRecommendation?: { narrative?: string }; narrative?: string }

  async function refreshSession() {
    const response = await fetch(`/api/tan-lerida/session/${session.id}`)
    const data = await response.json()
    if (data.success) {
      setSession(data.session)
      router.refresh()
      return data.session as SessionResponse
    }
    throw new Error(data.message ?? 'Unable to load session state.')
  }

  async function savePhotos() {
    setBusy(true)
    const response = await fetch('/api/tan-lerida/upload-photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id, photos: photoValues }),
    })
    const data = await response.json()
    if (data.success) setSession(data.session)
    setBusy(false)
  }

  async function saveProfile() {
    setBusy(true)
    const response = await fetch('/api/tan-lerida/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id, ...profileValues }),
    })
    const data = await response.json()
    if (data.success) setSession(data.session)
    setBusy(false)
  }

  async function savePreferences() {
    setBusy(true)
    const response = await fetch('/api/tan-lerida/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id, ...preferenceValues }),
    })
    const data = await response.json()
    if (data.success) setSession(data.session)
    setBusy(false)
  }

  async function startAnalysis() {
    setBusy(true)
    await fetch('/api/tan-lerida/analyse', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: session.id }),
    })

    const poll = setInterval(async () => {
      const next = await refreshSession()
      if (next.status === 'COMPLETED' || next.status === 'RECOMMENDATION_READY') {
        clearInterval(poll)
        setBusy(false)
      }
    }, 1200)
  }

  return (
    <div className="space-y-8">
      <div className="border border-[#2A2A2A] bg-[#111111] p-6">
        <p className="font-label text-xs tracking-[0.25em] text-[#C0392B]">YOUR SESSION</p>
        <p className="mt-3 font-mono-tan text-2xl text-[#BFA07A]">{session.sessionCode}</p>
        <p className="mt-2 text-sm text-[#A0A0A0]">Current status: {session.status}</p>
      </div>

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
