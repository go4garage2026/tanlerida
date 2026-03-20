import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const TAN_LEIDA_SYSTEM_PROMPT = `You are Tan Leida — Tangred's master tailor and personal style consultant. 
Tangred is India's premier luxury leather goods brand, handcrafting pieces 
for the ambitious, discerning upper-class professional.

Your role is to guide customers through a bespoke consultation, much like 
a session with a master tailor at a prestigious atelier. You speak with 
quiet authority and warmth. Never rush. Never oversell. Your every word 
reflects craftsmanship and attention to detail.

Your consultation goals:
1. Understand exactly what the customer is looking for (product type, occasion)
2. Understand their lifestyle (corporate, entrepreneur, frequent traveller?)  
3. Understand their aesthetic preference (classic, contemporary, bold)
4. Understand practical requirements (size, capacity, durability)
5. Understand their budget comfort zone

Rules:
- Only recommend products from the Tangred catalogue
- Always tie your recommendation back to the customer's specific body profile, skin tone, and style
- Explain WHY this piece will work for THEM specifically
- Mention the craftsmanship story — the leather type, the finishing technique
- Be aspirational but not condescending
- Sign off recommendations with: "This is my recommendation for you — crafted to be worn for a lifetime."
- Keep responses concise yet rich — never more than 3-4 sentences per turn`

export async function claudeStyleConsultation(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  userContext?: Record<string, unknown>
) {
  const systemWithContext = userContext
    ? `${TAN_LEIDA_SYSTEM_PROMPT}\n\nUser Context: ${JSON.stringify(userContext)}`
    : TAN_LEIDA_SYSTEM_PROMPT

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemWithContext,
    messages,
  })

  return response.content[0].type === 'text' ? response.content[0].text : ''
}

export async function claudeGenerateRecommendation(params: {
  userProfile: Record<string, unknown>
  geminiAnalysis: Record<string, unknown>
  products: Array<Record<string, unknown>>
  stylePreferences: Record<string, unknown>
}) {
  const prompt = `Based on the following customer profile, generate a personalised Tangred product recommendation:

Customer Body Profile: ${JSON.stringify(params.userProfile)}
AI Vision Analysis: ${JSON.stringify(params.geminiAnalysis)}
Style Preferences: ${JSON.stringify(params.stylePreferences)}
Top Matched Products: ${JSON.stringify(params.products)}

Generate a JSON response with:
{
  "primaryRecommendation": {
    "productId": "string",
    "narrative": "2-3 sentence personalised recommendation",
    "whyItWorks": "specific reasons tied to body profile and style",
    "craftStory": "leather type and finishing technique story"
  },
  "alternatives": [
    { "productId": "string", "brief": "one-line reason" }
  ],
  "visualPrompt": "detailed Stability AI prompt for generating image of user wearing/carrying this product",
  "signOff": "personalised sign-off message"
}`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: TAN_LEIDA_SYSTEM_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  })

  const text =
    response.content[0].type === 'text' ? response.content[0].text : '{}'
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) return JSON.parse(jsonMatch[0])
  return { raw: text }
}

export async function claudeGetInitialQuestion(): Promise<string> {
  return "What brings you to Tangred today? Are you looking for something for your boardroom — perhaps a structured office bag or a refined belt — or do you have a particular occasion in mind?"
}
