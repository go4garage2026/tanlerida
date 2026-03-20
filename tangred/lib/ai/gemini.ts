import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!)

export async function analysePhotosWithGemini(
  photoUrls: string[],
  customPrompt?: string
) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

  const prompt =
    customPrompt ??
    `Analyse these photos of a person. Identify:
    1. Body shape classification (inverted triangle, rectangle, oval, pear, hourglass, etc.)
    2. Estimated skin undertone (warm/cool/neutral) and skin tone depth (fair, medium, tan, deep)
    3. Apparent style sensibility from clothing choices (formal, casual, traditional, etc.)
    4. Posture and body proportion notes (height estimate, shoulder width relative to hips)
    5. Face shape (if visible — oval, round, square, heart, oblong)
    6. Any style signatures or recurring colour preferences
    Return as structured JSON with these exact keys: bodyShape, skinUndertone, skinTone, styleSensibility, proportionNotes, faceShape, colourPreferences.`

  // Build parts array with image URLs
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } } | { fileData: { mimeType: string; fileUri: string } }> = []

  for (const url of photoUrls) {
    parts.push({
      fileData: {
        mimeType: 'image/jpeg',
        fileUri: url,
      },
    })
  }
  parts.push({ text: prompt })

  try {
    const result = await model.generateContent(parts)
    const response = result.response
    const text = response.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    return { raw: text }
  } catch (error) {
    console.error('Gemini analysis error:', error)
    throw new Error('Failed to analyse photos with Gemini Vision')
  }
}

export async function validatePhotoWithGemini(photoUrl: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContent([
    {
      fileData: {
        mimeType: 'image/jpeg',
        fileUri: photoUrl,
      },
    },
    {
      text: `Is this a real photograph of a real human being (not a cartoon, illustration, or AI art)? 
             Can you see the full body or at least from head to mid-thigh? 
             Respond with JSON: { "isRealPerson": boolean, "hasFullBody": boolean, "reason": string }`,
    },
  ])

  const text = result.response.text()
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (jsonMatch) return JSON.parse(jsonMatch[0])
  return { isRealPerson: true, hasFullBody: true, reason: 'Could not validate' }
}
