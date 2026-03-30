import Anthropic from '@anthropic-ai/sdk'
import { isConfigured } from '@/lib/utils/guards'
import { githubModelsChat, githubModelsChatMultiTurn, isGitHubModelsAvailable } from '@/lib/ai/github-models'

export const TAN_Lerida_SYSTEM_PROMPT = `You are Tan Lerida — Tangred's master tailor and personal style consultant.
You speak with quiet authority, warmth, and precise craftsmanship language.
Only recommend Tangred catalogue pieces.
Always connect your guidance to body profile, skin tone, lifestyle, occasion, and leather craft.
Never sound pushy. End recommendations with: "This is my recommendation for you — crafted to be worn for a lifetime."`

function getAnthropicClient() {
  if (!isConfigured(process.env.ANTHROPIC_API_KEY)) {
    return null
  }

  return new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
}

const model = process.env.ANTHROPIC_TEXT_MODEL ?? 'claude-3-5-sonnet-latest'

function extractJsonFromText(raw: string): Record<string, unknown> {
  const match = raw.match(/\{[\s\S]*\}/)
  return match ? JSON.parse(match[0]) : { raw }
}

export async function claudeStyleConsultation(messages: Array<{ role: 'user' | 'assistant'; content: string }>, userContext?: Record<string, unknown>) {
  const systemPrompt = `${TAN_Lerida_SYSTEM_PROMPT}\nUser context: ${JSON.stringify(userContext ?? {})}`

  // Try Anthropic first
  const client = getAnthropicClient()
  if (client) {
    const response = await client.messages.create({
      model,
      system: systemPrompt,
      max_tokens: 700,
      messages,
    })
    const content = response.content.find((entry) => entry.type === 'text')
    return content && 'text' in content ? content.text : ''
  }

  // Fallback to GitHub Models
  if (isGitHubModelsAvailable()) {
    return githubModelsChatMultiTurn(systemPrompt, messages, 700)
  }

  // Dev mock
  return 'What are you looking for today — a boardroom bag, a finishing belt, or a more complete Tangred look?'
}

export async function claudeGenerateRecommendation(params: {
  userProfile: Record<string, unknown>
  geminiAnalysis: Record<string, unknown>
  products: Array<Record<string, unknown>>
  stylePreferences: Record<string, unknown>
}) {
  const userMessage = `Return JSON for a Tangred recommendation. Body profile: ${JSON.stringify(params.userProfile)}. Vision analysis: ${JSON.stringify(params.geminiAnalysis)}. Preferences: ${JSON.stringify(params.stylePreferences)}. Products: ${JSON.stringify(params.products)}.

Return a JSON object with these keys:
- primaryRecommendation: { productId, narrative, whyItWorks, craftStory }
- alternatives: [{ productId, brief }]
- visualPrompt: a text prompt for generating an editorial image of the customer with the product
- signOff: your closing line`

  // Try Anthropic first
  const client = getAnthropicClient()
  if (client) {
    const response = await client.messages.create({
      model,
      system: TAN_Lerida_SYSTEM_PROMPT,
      max_tokens: 1200,
      messages: [{ role: 'user', content: userMessage }],
    })
    const text = response.content.find((entry) => entry.type === 'text')
    const raw = text && 'text' in text ? text.text : '{}'
    return extractJsonFromText(raw)
  }

  // Fallback to GitHub Models
  if (isGitHubModelsAvailable()) {
    const raw = await githubModelsChat(TAN_Lerida_SYSTEM_PROMPT, userMessage, 1200)
    return extractJsonFromText(raw)
  }

  // Dev mock
  const [primary, ...alternatives] = params.products
  return {
    primaryRecommendation: {
      productId: String(primary?.id ?? ''),
      narrative:
        'Your profile calls for a disciplined, structured leather silhouette with enough authority for formal work settings while remaining versatile across travel and evening use.',
      whyItWorks: 'The piece balances your proportions, supports a refined palette, and mirrors a composed professional wardrobe.',
      craftStory: 'The selected Tangred leather brings controlled texture, careful edge finishing, and long-wear polish.',
    },
    alternatives: alternatives.slice(0, 2).map((product) => ({ productId: String(product.id), brief: 'An alternative with a slightly different shape or carry profile.' })),
    visualPrompt: 'Luxury editorial portrait of the customer carrying a structured Tangred leather bag, dark background, cinematic lighting, premium Indian tailoring aesthetic.',
    signOff: 'This is my recommendation for you — crafted to be worn for a lifetime.',
  }
}
