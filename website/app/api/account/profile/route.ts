import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, avatarUrl: true, isVerified: true, tanLeidaAccess: true, tanLeidaId: true, createdAt: true },
  })

  if (!user) {
    return NextResponse.json({ success: false, message: 'User not found.' }, { status: 404 })
  }

  return NextResponse.json({ success: true, user })
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 })
  }

  try {
    const body = updateSchema.parse(await request.json())
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: body,
      select: { id: true, name: true, email: true, phone: true, avatarUrl: true },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Update failed.' }, { status: 400 })
  }
}
