import { NextResponse } from 'next/server'
import { z } from 'zod'
import { runTanLeridaPipeline } from '@/lib/ai/orchestrator'
import { getCurrentUserIdOrDemo } from '@/lib/request-auth'
import { getTanLeridaSession, updateTanLeridaSession } from '@/lib/tan-lerida-store'

const schema = z.object({ sessionId: z.string().min(1) })

export async function POST(request: Request) {
  try {
    const { sessionId } = schema.parse(await request.json())
    const session = getTanLeridaSession(sessionId)
    const userId = await getCurrentUserIdOrDemo()

    if (!session || session.ownerId !== userId) {
      return NextResponse.json({ success: false, message: 'Session not found.' }, { status: 404 })
    }

    updateTanLeridaSession(sessionId, { status: 'ANALYSING' })
    void runTanLeridaPipeline(sessionId)

    return NextResponse.json({
      success: true,
      status: 'ANALYSING',
      messages: [
        'Tan Lerida is studying your photographs…',
        'Analysing your body profile and style markers…',
        'Matching with the finest Tangred pieces…',
        'Crafting your personalised look…',
      ],
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to start analysis.' }, { status: 400 })
  }
}
