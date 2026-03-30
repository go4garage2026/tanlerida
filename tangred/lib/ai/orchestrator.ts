import { prisma } from '@/lib/prisma'
import { updateTanLeridaSession, completeTanLeridaSession, getTanLeridaSession } from '@/lib/tan-leida-store'
import { analysePhotosWithGemini } from '@/lib/ai/gemini'
import { claudeGenerateRecommendation } from '@/lib/ai/claude'
import { generateOutfitImage } from '@/lib/ai/image-gen'
import { matchProductsFromEmbeddings } from '@/lib/ai/pinecone'

function extractBudgetRange(budget: string): { min: number; max: number } | null {
  const numbers = budget.replace(/[₹,]/g, '').match(/\d+/g)
  if (!numbers || numbers.length === 0) return null
  const values = numbers.map(Number)
  return { min: Math.min(...values) * 100, max: Math.max(...values) * 100 }
}

function extractCategoryHints(need: string): string[] {
  const text = need.toLowerCase()
  const hints: string[] = []
  if (/bag|tote|briefcase|laptop|carry|messenger/.test(text)) hints.push('bag', 'briefcase', 'office-bag')
  if (/belt/.test(text)) hints.push('belt')
  if (/wallet|card.?holder|money/.test(text)) hints.push('wallet')
  if (/jacket|coat|blazer/.test(text)) hints.push('jacket')
  if (/accessor/.test(text)) hints.push('accessories')
  return hints
}

async function getSmartCandidates(
  bodyProfile: Record<string, unknown>,
  stylePrefs: Record<string, unknown>,
  analysis: Record<string, unknown>,
) {
  // Try Pinecone vector search first
  try {
    const pineconeResults = await matchProductsFromEmbeddings({
      bodyProfile,
      stylePrefs,
      geminiAnalysis: analysis,
      topK: 6,
    })

    if (pineconeResults.length > 0) {
      const productIds = pineconeResults.map((r) => r.id)
      const products = await prisma.product.findMany({
        where: { id: { in: productIds }, isActive: true },
        include: { images: true, category: true, tags: true },
      })
      if (products.length >= 2) return products
    }
  } catch {
    // Pinecone not configured or failed — fall through to DB query
  }

  // Smart DB query: filter by user preferences
  const need = String(stylePrefs.need ?? '')
  const categoryHints = extractCategoryHints(need)
  const budgetRange = extractBudgetRange(String(stylePrefs.budget ?? ''))

  const where: Record<string, unknown> = { isActive: true }

  if (categoryHints.length > 0) {
    where.OR = [
      { category: { slug: { in: categoryHints } } },
      { tags: { some: { tag: { in: categoryHints } } } },
    ]
  }

  if (budgetRange) {
    where.basePrice = { gte: budgetRange.min, lte: budgetRange.max * 1.3 }
  }

  let products = await prisma.product.findMany({
    where,
    include: { images: true, category: true, tags: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  })

  // If filters are too strict, relax and try again
  if (products.length < 2) {
    products = await prisma.product.findMany({
      where: { isActive: true },
      include: { images: true, category: true, tags: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
    })
  }

  return products
}

export async function runTanLeridaPipeline(sessionId: string) {
  try {
    const session = await getTanLeridaSession(sessionId)
    if (!session) return

    await updateTanLeridaSession(sessionId, { status: 'ANALYSING' })

    const photoUrls = Object.values(session.userPhotos ?? {})
    const analysis = await analysePhotosWithGemini({ photoUrls })

    const candidateProducts = await getSmartCandidates(
      session.bodyProfile ?? {},
      session.stylePreferences ?? {},
      analysis,
    )

    const productsForClaude = candidateProducts.length > 0
      ? candidateProducts
      : [{ id: '', name: 'Default Product', slug: 'default', basePrice: 0 }]

    const recommendation = await claudeGenerateRecommendation({
      userProfile: session.bodyProfile ?? {},
      geminiAnalysis: analysis,
      stylePreferences: session.stylePreferences ?? {},
      products: productsForClaude as unknown as Array<Record<string, unknown>>,
    })

    const rec = recommendation as Record<string, unknown>
    const primaryRec = rec.primaryRecommendation as Record<string, unknown> | undefined
    const primaryProductId = String(primaryRec?.productId ?? productsForClaude[0]?.id ?? '')
    const product = candidateProducts.find((item) => item.id === primaryProductId) ?? candidateProducts[0] ?? productsForClaude[0]

    const image = await generateOutfitImage({
      baseUserPhoto: String((session.userPhotos ?? {}).fullBody ?? Object.values(session.userPhotos ?? {})[0] ?? ''),
      productName: product.name,
      stylePrompt: String(rec.visualPrompt ?? ''),
    })

    await updateTanLeridaSession(sessionId, {
      aiAnalysis: analysis,
      recommendation,
      recommendedProductId: product.id,
      generatedImageUrl: image.generatedImageUrl,
      status: 'RECOMMENDATION_READY',
    })

    await completeTanLeridaSession(sessionId)
  } catch (error) {
    console.error(`Tan Lerida pipeline failed for session ${sessionId}:`, error)
    // Mark session as ready with whatever data we have so the user isn't stuck
    await updateTanLeridaSession(sessionId, {
      status: 'RECOMMENDATION_READY',
      recommendation: {
        error: true,
        narrative: 'We encountered an issue generating your recommendation. Please try starting a new session.',
      },
    }).catch(() => {})
  }
}

export const runTanLeidaPipeline = runTanLeridaPipeline
