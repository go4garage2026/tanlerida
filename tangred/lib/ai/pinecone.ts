import { Pinecone } from '@pinecone-database/pinecone'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { isConfigured } from '@/lib/utils/guards'
import { githubModelsEmbed, isGitHubModelsAvailable } from '@/lib/ai/github-models'

const indexName = process.env.PINECONE_INDEX_NAME ?? 'tangred-products'
const EMBEDDING_MODEL = 'text-embedding-004'

function getClient() {
  if (!isConfigured(process.env.PINECONE_API_KEY)) {
    return null
  }

  return new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string })
}

function getEmbeddingClient() {
  if (!isConfigured(process.env.GOOGLE_GEMINI_API_KEY)) return null
  return new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY as string)
}

async function generateEmbedding(text: string): Promise<number[] | null> {
  // Try Gemini embeddings first
  const client = getEmbeddingClient()
  if (client) {
    const model = client.getGenerativeModel({ model: EMBEDDING_MODEL })
    const result = await model.embedContent(text)
    return result.embedding.values
  }

  // Fallback to GitHub Models (text-embedding-3-small)
  if (isGitHubModelsAvailable()) {
    const embedding = await githubModelsEmbed(text)
    return embedding.length > 0 ? embedding : null
  }

  return null
}

function buildProfileText(params: {
  bodyProfile: Record<string, unknown>
  stylePrefs: Record<string, unknown>
  geminiAnalysis: Record<string, unknown>
}): string {
  const parts: string[] = []

  const { bodyProfile, stylePrefs, geminiAnalysis } = params

  if (bodyProfile.gender) parts.push(`gender: ${bodyProfile.gender}`)
  if (bodyProfile.bodyBuild) parts.push(`build: ${bodyProfile.bodyBuild}`)
  if (bodyProfile.skinTone) parts.push(`skin tone: ${bodyProfile.skinTone}`)
  if (bodyProfile.resonance) parts.push(`style resonance: ${Array.isArray(bodyProfile.resonance) ? bodyProfile.resonance.join(', ') : bodyProfile.resonance}`)

  if (stylePrefs.need) parts.push(`looking for: ${stylePrefs.need}`)
  if (stylePrefs.budget) parts.push(`budget: ${stylePrefs.budget}`)
  if (stylePrefs.occasion) parts.push(`occasion: ${stylePrefs.occasion}`)
  if (stylePrefs.colours) parts.push(`colour preference: ${stylePrefs.colours}`)

  if (geminiAnalysis.bodyShape) parts.push(`body shape: ${geminiAnalysis.bodyShape}`)
  if (geminiAnalysis.undertone) parts.push(`undertone: ${geminiAnalysis.undertone}`)
  if (geminiAnalysis.styleSensibility) parts.push(`style sensibility: ${geminiAnalysis.styleSensibility}`)
  if (geminiAnalysis.colourBias) parts.push(`colour bias: ${Array.isArray(geminiAnalysis.colourBias) ? geminiAnalysis.colourBias.join(', ') : geminiAnalysis.colourBias}`)

  return parts.join('. ') || 'premium leather product recommendation'
}

export async function matchProductsFromEmbeddings(params: {
  bodyProfile: Record<string, unknown>
  stylePrefs: Record<string, unknown>
  geminiAnalysis: Record<string, unknown>
  topK: number
}) {
  const client = getClient()
  if (!client) return []

  const queryText = buildProfileText(params)
  const embedding = await generateEmbedding(queryText)
  if (!embedding) return []

  const index = client.index(indexName)
  const response = await index.query({
    vector: embedding,
    topK: params.topK,
    includeMetadata: true,
  })

  return response.matches.map((match) => ({ id: match.id, score: match.score, ...(match.metadata ?? {}) }))
}

export async function upsertProductEmbedding(params: {
  productId: string
  productName: string
  category: string
  material: string
  tags: string[]
  embedding?: number[]
}) {
  const client = getClient()
  if (!client) return

  let embedding = params.embedding
  if (!embedding || embedding.length === 0) {
    const text = `${params.productName}. Category: ${params.category}. Material: ${params.material}. Tags: ${params.tags.join(', ')}`
    embedding = (await generateEmbedding(text)) ?? undefined
    if (!embedding) return
  }

  const index = client.index(indexName)
  await index.upsert({
    records: [
      {
        id: params.productId,
        values: embedding,
        metadata: {
          name: params.productName,
          category: params.category,
          material: params.material,
          tags: params.tags.join(','),
        },
      },
    ],
  })
}
