import { NextResponse } from 'next/server'
import { getCurrentUserIdOrDemo } from '@/lib/request-auth'
import { getTanLeridaSession } from '@/lib/tan-lerida-store'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = getTanLeridaSession(id)
  const currentUserId = await getCurrentUserIdOrDemo()

  if (!session || session.ownerId !== currentUserId) {
    return NextResponse.json({ success: false, message: 'Session not found.' }, { status: 404 })
  }

  return NextResponse.json({ success: true, session })
}
