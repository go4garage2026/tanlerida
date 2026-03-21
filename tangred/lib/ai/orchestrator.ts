import { prisma } from '@/lib/prisma'
import { updateTanLeridaSession, completeTanLeridaSession, getTanLeridaSession } from '@/lib/tan-lerida-store'
import { analysePhotosWithGemini } from '@/lib/ai/gemini'
import { claudeGenerateRecommendation } from '@/lib/ai/claude'
import { generateOutfitImage } from '@/lib/ai/image-gen'

export async function runTanLeridaPipeline(sessionId: string) {
  const session = await getTanLeridaSession(sessionId)
  if (!session) return

  await updateTanLeridaSession(sessionId, { status: 'ANALYSING' })

  const photoUrls = Object.values(session.userPhotos ?? {})
  const analysis = await analysePhotosWithGemini({ photoUrls })

  // Get candidate products from DB
  const dbProducts = await prisma.product.findMany({
    where: { isActive: true },
    include: { images: true, category: true, tags: true },
    take: 6,
  })
  const candidateProducts = dbProducts.length > 0
    ? dbProducts.slice(0, 3)
    : [{ id: '', name: 'Default Product', slug: 'default', basePrice: 0 }]

  const recommendation = await claudeGenerateRecommendation({
    userProfile: session.bodyProfile ?? {},
    geminiAnalysis: analysis,
    stylePreferences: session.stylePreferences ?? {},
    products: candidateProducts as unknown as Array<Record<string, unknown>>,
  })

  const primaryProductId = String(recommendation.primaryRecommendation?.productId ?? candidateProducts[0]?.id ?? '')
  const product = candidateProducts.find((item) => item.id === primaryProductId) ?? candidateProducts[0]

  const image = await generateOutfitImage({
    baseUserPhoto: String((session.userPhotos ?? {}).fullBody ?? Object.values(session.userPhotos ?? {})[0] ?? ''),
    productName: product.name,
    stylePrompt: String(recommendation.visualPrompt ?? ''),
  })

  await updateTanLeridaSession(sessionId, {
    aiAnalysis: analysis,
    recommendation,
    recommendedProductId: product.id,
    generatedImageUrl: image.generatedImageUrl,
    status: 'RECOMMENDATION_READY',
  })

  await completeTanLeridaSession(sessionId)
}
