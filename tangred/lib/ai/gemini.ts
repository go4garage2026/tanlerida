import { GoogleGenerativeAI } from '@google/generative-ai'
import { isConfigured } from '@/lib/utils/guards'
import { githubModelsVision, isGitHubModelsAvailable } from '@/lib/ai/github-models'

const DEFAULT_VISION_MODEL = process.env.GEMINI_VISION_MODEL ?? 'gemini-1.5-pro'
const DEFAULT_VALIDATION_MODEL = process.env.GEMINI_VALIDATION_MODEL ?? 'gemini-1.5-flash'

function getGeminiClient() {
  if (!isConfigured(process.env.GOOGLE_GEMINI_API_KEY)) {
    return null
  }

  return new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY as string)
}

function extractJson<T>(text: string, fallback: T): T {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return fallback

  try {
    return JSON.parse(match[0]) as T
  } catch {
    return fallback
  }
}

export async function validatePhotoWithGemini(photoUrl: string) {
  const client = getGeminiClient()
  const validationPrompt = 'Validate whether this is a real human photo, whether the body is sufficiently visible for body analysis, and whether the image appears safe for premium styling use. Return JSON with keys isRealPerson, hasFullBody, safeForProcessing, and reason.'

  // Try Gemini first
  if (client) {
    const model = client.getGenerativeModel({ model: DEFAULT_VALIDATION_MODEL })
    const result = await model.generateContent([
      { fileData: { mimeType: 'image/jpeg', fileUri: photoUrl } },
      { text: validationPrompt },
    ])

    return extractJson<{ isRealPerson: boolean; hasFullBody: boolean; safeForProcessing: boolean; reason: string }>(result.response.text(), {
      isRealPerson: true,
      hasFullBody: true,
      safeForProcessing: true,
      reason: 'Unable to parse provider response.',
    })
  }

  // Fallback to GitHub Models (GPT-4o vision)
  if (isGitHubModelsAvailable()) {
    const raw = await githubModelsVision([photoUrl], validationPrompt)
    return extractJson<{ isRealPerson: boolean; hasFullBody: boolean; safeForProcessing: boolean; reason: string }>(raw, {
      isRealPerson: true,
      hasFullBody: true,
      safeForProcessing: true,
      reason: 'Unable to parse provider response.',
    })
  }

  // Dev mock
  return {
    isRealPerson: true,
    hasFullBody: true,
    safeForProcessing: true,
    reason: 'Mock validation accepted the image in development mode.',
  }
}

export async function analysePhotosWithGemini(params: { photoUrls: string[]; prompt?: string }) {
  const analysisPrompt = params.prompt ?? 'Analyse these user photos and return strict JSON with keys: bodyShape, undertone, styleSensibility, posture, faceShape, notes, colourBias.'

  const fallback = {
    bodyShape: 'Rectangle athletic frame',
    undertone: 'Warm neutral',
    styleSensibility: 'Classic professional',
    posture: 'Confident posture',
    faceShape: 'Oval',
    notes: 'Fallback parse result.',
    colourBias: ['black', 'brown'],
  }

  // Try Gemini first
  const client = getGeminiClient()
  if (client) {
    const model = client.getGenerativeModel({ model: DEFAULT_VISION_MODEL })
    const parts: Array<{ text: string } | { fileData: { mimeType: string; fileUri: string } }> = params.photoUrls.map((url) => ({
      fileData: { mimeType: 'image/jpeg', fileUri: url },
    }))
    parts.push({ text: analysisPrompt })

    const result = await model.generateContent(parts)
    return extractJson(result.response.text(), fallback)
  }

  // Fallback to GitHub Models (GPT-4o vision)
  if (isGitHubModelsAvailable()) {
    const raw = await githubModelsVision(params.photoUrls, analysisPrompt)
    return extractJson(raw, fallback)
  }

  // Dev mock
  return { ...fallback, validation: 'Mock analysis used because no AI provider is configured.' }
}
