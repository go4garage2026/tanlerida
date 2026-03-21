import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUserIdOrDemo } from '@/lib/request-auth'
import { getTanLeridaSession, updateTanLeridaSession } from '@/lib/tan-lerida-store'

const preferenceSchema = z.object({
  sessionId: z.string().min(1),
  need: z.string().min(5),
  laptopSize: z.string().optional(),
  structure: z.string().optional(),
  budget: z.string().min(1),
  occasion: z.string().min(1),
  colours: z.string().min(1),
})

export async function POST(request: Request) {
  try {
    const payload = preferenceSchema.parse(await request.json())
    const session = getTanLeridaSession(payload.sessionId)
    const userId = await getCurrentUserIdOrDemo()

    if (!session || session.ownerId !== userId) {
      return NextResponse.json({ success: false, message: 'Session not found.' }, { status: 404 })
    }

    const updated = updateTanLeridaSession(payload.sessionId, {
      stylePreferences: payload,
    })

    return NextResponse.json({ success: true, session: updated })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to save preferences.' }, { status: 400 })
  }
}
