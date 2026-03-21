import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUserIdOrDemo } from '@/lib/request-auth'
import { createTanLeridaSession, listTanLeridaSessions, updateTanLeridaSession } from '@/lib/tan-lerida-store'
import { enforceRateLimit } from '@/lib/rate-limit'
import { getRequestIp } from '@/lib/utils/guards'

const createSchema = z.object({
  consent: z.literal(true),
  moderationAccepted: z.literal(true),
})

export async function GET() {
  const userId = await getCurrentUserIdOrDemo()
  return NextResponse.json({ success: true, sessions: listTanLeridaSessions(userId) })
}

export async function POST(request: Request) {
  try {
    enforceRateLimit(`tan-lerida-session:${getRequestIp(request)}`, 10, 60_000)
    const body = createSchema.parse(await request.json())
    const userId = await getCurrentUserIdOrDemo()
    const session = createTanLeridaSession(userId)
    const updated = updateTanLeridaSession(session.id, body)
    return NextResponse.json({ success: true, session: updated })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to create session.' }, { status: 400 })
  }
}
