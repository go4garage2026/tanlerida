export async function generateOutfitImage(params: {
  visualPrompt: string
  productName: string
  productCategory: string
  gender?: string
}) {
  const { visualPrompt, productName, productCategory, gender = 'person' } = params

  const fullPrompt = `${visualPrompt}. Premium Indian ${gender} carrying/wearing Tangred ${productName} (${productCategory}), 
  photorealistic luxury editorial photography, dark studio background with cinematic lighting, 
  high fashion magazine quality, 8K resolution, sharp details, ${gender} looking confident and professional,
  Tangred brand aesthetic — premium, handcrafted leather goods, Indian luxury fashion`

  const negativePrompt = 'cartoon, illustration, anime, low quality, blurry, plastic, cheap, casual, streetwear'

  try {
    // Try Stability AI first
    const stabilityKey = process.env.STABILITY_API_KEY
    if (stabilityKey) {
      const response = await fetch(
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${stabilityKey}`,
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
        if (data.artifacts && data.artifacts[0]) {
          return {
            type: 'base64',
            data: data.artifacts[0].base64,
            mimeType: 'image/png',
          }
        }
      }
    }

    // Fallback: Return null if no image generation service available
    return null
  } catch (error) {
    console.error('Image generation error:', error)
    return null
  }
}
