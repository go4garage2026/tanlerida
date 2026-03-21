import { prisma } from '@/lib/prisma'
import { formatDeliveryEstimate } from '@/lib/utils/date'
import { generateTanLeridaSessionCode } from '@/lib/utils/ids'

export type RuntimeSession = {
  id: string
  ownerId: string
  sessionCode: string
  isPaid: boolean
  status: string
  userPhotos?: Record<string, string> | null
  bodyProfile?: Record<string, unknown> | null
  stylePreferences?: Record<string, unknown> | null
  aiAnalysis?: Record<string, unknown> | null
  recommendation?: Record<string, unknown> | null
  generatedImageUrl?: string | null
  recommendedProductId?: string | null
  estimatedDelivery?: string | null
  createdAt: Date
  consent?: boolean
  moderationAccepted?: boolean
}

function toRuntime(row: {
  id: string
  userId: string
  sessionCode: string
  isPaid: boolean
  status: string
  userPhotos: unknown
  bodyProfile: unknown
  stylePreferences: unknown
  aiAnalysis: unknown
  recommendation: unknown
  generatedImageUrl: string | null
  recommendedProductId: string | null
  estimatedDelivery: string | null
  createdAt: Date
}): RuntimeSession {
  return {
    id: row.id,
    ownerId: row.userId,
    sessionCode: row.sessionCode,
    isPaid: row.isPaid,
    status: row.status,
    userPhotos: (row.userPhotos as Record<string, string>) ?? null,
    bodyProfile: (row.bodyProfile as Record<string, unknown>) ?? null,
    stylePreferences: (row.stylePreferences as Record<string, unknown>) ?? null,
    aiAnalysis: (row.aiAnalysis as Record<string, unknown>) ?? null,
    recommendation: (row.recommendation as Record<string, unknown>) ?? null,
    generatedImageUrl: row.generatedImageUrl,
    recommendedProductId: row.recommendedProductId,
    estimatedDelivery: row.estimatedDelivery,
    createdAt: row.createdAt,
    consent: true,
    moderationAccepted: true,
  }
}

export async function listTanLeridaSessions(ownerId: string) {
  const rows = await prisma.TanLeridaSession.findMany({
    where: { userId: ownerId },
    orderBy: { createdAt: 'desc' },
  })
  return rows.map(toRuntime)
}

export async function getTanLeridaSession(sessionId: string) {
  const row = await prisma.TanLeridaSession.findUnique({ where: { id: sessionId } })
  return row ? toRuntime(row) : null
}

export async function createTanLeridaSession(ownerId: string) {
  const row = await prisma.TanLeridaSession.create({
    data: {
      userId: ownerId,
      sessionCode: generateTanLeridaSessionCode(),
      isPaid: true,
      status: 'INITIATED',
    },
  })
  return toRuntime(row)
}

export async function updateTanLeridaSession(sessionId: string, patch: Partial<RuntimeSession>) {
  const data: Record<string, unknown> = {}
  if (patch.status !== undefined) data.status = patch.status
  if (patch.userPhotos !== undefined) data.userPhotos = patch.userPhotos
  if (patch.bodyProfile !== undefined) data.bodyProfile = patch.bodyProfile
  if (patch.stylePreferences !== undefined) data.stylePreferences = patch.stylePreferences
  if (patch.aiAnalysis !== undefined) data.aiAnalysis = patch.aiAnalysis
  if (patch.recommendation !== undefined) data.recommendation = patch.recommendation
  if (patch.generatedImageUrl !== undefined) data.generatedImageUrl = patch.generatedImageUrl
  if (patch.recommendedProductId !== undefined) data.recommendedProductId = patch.recommendedProductId
  if (patch.estimatedDelivery !== undefined) data.estimatedDelivery = patch.estimatedDelivery

  const row = await prisma.TanLeridaSession.update({ where: { id: sessionId }, data })
  return toRuntime(row)
}

export async function completeTanLeridaSession(sessionId: string) {
  const session = await prisma.TanLeridaSession.findUnique({
    where: { id: sessionId },
    include: { recommendedProduct: true },
  })
  if (!session) return null

  const leadTimeDays = session.recommendedProduct?.leadTimeDays ?? 14
  const row = await prisma.TanLeridaSession.update({
    where: { id: sessionId },
    data: {
      status: 'COMPLETED',
      estimatedDelivery: formatDeliveryEstimate(leadTimeDays),
    },
  })
  return toRuntime(row)
}
