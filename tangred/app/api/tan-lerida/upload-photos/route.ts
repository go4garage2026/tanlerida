import { NextResponse } from 'next/server'
import { z } from 'zod'
import { validatePhotoWithGemini } from '@/lib/ai/gemini'
import { getCurrentUserIdOrDemo } from '@/lib/request-auth'
import { getTanLeridaSession, updateTanLeridaSession } from '@/lib/tan-leida-store'

const payloadSchema = z.object({
  sessionId: z.string().min(1),
  photos: z.object({
    casual: z.string().min(1),
    formal: z.string().min(1),
    fullBody: z.string().min(1),
    ethnic: z.string().optional(),
  }),
})

export async function POST(request: Request) {
  try {
    const payload = payloadSchema.parse(await request.json())
    const session = await getTanLeridaSession(payload.sessionId)
    const userId = await getCurrentUserIdOrDemo()

    if (!session || session.ownerId !== userId) {
      return NextResponse.json({ success: false, message: 'Session not found.' }, { status: 404 })
    }

    const validations = await Promise.all(Object.values(payload.photos).map((url) => validatePhotoWithGemini(url)))
    const rejected = validations.find((item) => item.isRealPerson === false || item.hasFullBody === false || item.safeForProcessing === false)

    if (rejected) {
      return NextResponse.json({ success: false, message: rejected.reason ?? 'Photo validation failed.' }, { status: 400 })
    }

    const updated = await updateTanLeridaSession(payload.sessionId, {
      userPhotos: payload.photos,
      status: 'PHOTOS_UPLOADED',
    })

    return NextResponse.json({ success: true, session: updated })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to save photos.' }, { status: 400 })
  }
}
