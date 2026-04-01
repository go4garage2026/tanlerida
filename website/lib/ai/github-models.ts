import OpenAI from 'openai'
import { isConfigured } from '@/lib/utils/guards'

const GITHUB_MODELS_BASE_URL = 'https://models.inference.ai.azure.com'

const VISION_MODEL = 'gpt-4o'
const TEXT_MODEL = 'gpt-4o'
const EMBEDDING_MODEL = 'text-embedding-3-small'

export function getGitHubModelsClient(): OpenAI | null {
  if (!isConfigured(process.env.GITHUB_TOKEN)) return null
  return new OpenAI({
    baseURL: GITHUB_MODELS_BASE_URL,
    apiKey: process.env.GITHUB_TOKEN as string,
  })
}

export async function githubModelsVision(
  imageUrls: string[],
  prompt: string,
): Promise<string> {
  const client = getGitHubModelsClient()
  if (!client) throw new Error('GITHUB_TOKEN not configured')

  const imageContent: OpenAI.Chat.ChatCompletionContentPart[] = imageUrls.map((url) => ({
    type: 'image_url' as const,
    image_url: { url, detail: 'high' as const },
  }))

  const response = await client.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'user',
        content: [...imageContent, { type: 'text', text: prompt }],
      },
    ],
    max_tokens: 1200,
    temperature: 0.3,
  })

  return response.choices[0]?.message?.content ?? '{}'
}

export async function githubModelsChat(
  systemPrompt: string,
  userMessage: string,
  maxTokens = 1200,
): Promise<string> {
  const client = getGitHubModelsClient()
  if (!client) throw new Error('GITHUB_TOKEN not configured')

  const response = await client.chat.completions.create({
    model: TEXT_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    max_tokens: maxTokens,
    temperature: 0.7,
  })

  return response.choices[0]?.message?.content ?? ''
}

export async function githubModelsChatMultiTurn(
  systemPrompt: string,
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  maxTokens = 700,
): Promise<string> {
  const client = getGitHubModelsClient()
  if (!client) throw new Error('GITHUB_TOKEN not configured')

  const response = await client.chat.completions.create({
    model: TEXT_MODEL,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    max_tokens: maxTokens,
    temperature: 0.7,
  })

  return response.choices[0]?.message?.content ?? ''
}

export async function githubModelsEmbed(text: string): Promise<number[]> {
  const client = getGitHubModelsClient()
  if (!client) throw new Error('GITHUB_TOKEN not configured')

  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  })

  return response.data[0]?.embedding ?? []
}

export function isGitHubModelsAvailable(): boolean {
  return isConfigured(process.env.GITHUB_TOKEN)
}
