import crypto from 'crypto'
import { products, TanLeridaSessions } from '@/lib/catalog'
import { formatDeliveryEstimate } from '@/lib/utils/date'
import { generateTanLeridaSessionCode } from '@/lib/utils/ids'
import type { TanLeridaSessionType } from '@/types'

export type RuntimeSession = TanLeridaSessionType & {
  ownerId: string
  consent?: boolean
  moderationAccepted?: boolean
}

const globalStore = globalThis as typeof globalThis & {
  __tangredTanLeridaStore?: Map<string, RuntimeSession>
}

const store =
  globalStore.__tangredTanLeridaStore ??
  new Map<string, RuntimeSession>(
    TanLeridaSessions.map((session) => [
      session.id,
      {
        ...session,
        ownerId: 'demo-user',
        consent: true,
        moderationAccepted: true,
      },
    ])
  )

if (!globalStore.__tangredTanLeridaStore) {
  globalStore.__tangredTanLeridaStore = store
}

export function listTanLeridaSessions(ownerId: string) {
  return Array.from(store.values()).filter((session) => session.ownerId === ownerId)
}

export function getTanLeridaSession(sessionId: string) {
  return store.get(sessionId)
}

export function createTanLeridaSession(ownerId: string) {
  const id = `session-${crypto.randomUUID()}`
  const session: RuntimeSession = {
    id,
    ownerId,
    sessionCode: generateTanLeridaSessionCode(),
    isPaid: true,
    status: 'INITIATED',
    createdAt: new Date(),
    consent: false,
    moderationAccepted: false,
  }

  store.set(id, session)
  return session
}

export function updateTanLeridaSession(sessionId: string, patch: Partial<RuntimeSession>) {
  const current = store.get(sessionId)
  if (!current) return null

  const next = {
    ...current,
    ...patch,
  }

  store.set(sessionId, next)
  return next
}

export function completeTanLeridaSession(sessionId: string) {
  const session = store.get(sessionId)
  if (!session) return null

  const recommendedProduct = products.find((product) => product.id === session.recommendedProductId) ?? products[0]
  const next = {
    ...session,
    status: 'COMPLETED' as const,
    estimatedDelivery: formatDeliveryEstimate(recommendedProduct.leadTimeDays),
  }

  store.set(sessionId, next)
  return next
}
