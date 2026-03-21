import { isConfigured } from '@/lib/utils/guards'

export async function generateOutfitImage(params: { baseUserPhoto: string; productName: string; stylePrompt: string }) {
  // Try Stability AI if configured
  if (isConfigured(process.env.STABILITY_API_KEY)) {
    try {
      const fullPrompt = `${params.stylePrompt}. Premium Indian person carrying/wearing Tangred ${params.productName}, photorealistic luxury editorial photography, dark studio background with cinematic lighting, high fashion magazine quality, 8K resolution, Tangred brand aesthetic — premium handcrafted leather goods, Indian luxury fashion`
      const negativePrompt = 'cartoon, illustration, anime, low quality, blurry, plastic, cheap, casual, streetwear'

      const response = await fetch(
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          },
          body: JSON.stringify({
            text_prompts: [
              { text: fullPrompt, weight: 1 },
              { text: negativePrompt, weight: -1 },
            ],
            cfg_scale: 7,
            height: 1024,
            width: 768,
            samples: 1,
            steps: 30,
            style_preset: 'photographic',
          }),
        }
      )

      if (response.ok) {
        const data = await response.json() as { artifacts: Array<{ base64: string }> }
        if (data.artifacts?.[0]?.base64) {
          return {
            provider: 'stability',
            model: 'sdxl-1.0',
            generatedImageUrl: `data:image/png;base64,${data.artifacts[0].base64}`,
          }
        }
      }
    } catch (error) {
      console.error('Stability AI generation error:', error)
    }
  }

  // Fallback: use the user's photo as the result
  return {
    provider: 'fallback',
    model: 'passthrough',
    generatedImageUrl: params.baseUserPhoto || '/tangred-hero.png',
  }
}
