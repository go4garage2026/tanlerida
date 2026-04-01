import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

const createSchema = z.object({
  label: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(5),
  isDefault: z.boolean().optional(),
})

const updateSchema = createSchema.partial().extend({ id: z.string().min(1) })

const deleteSchema = z.object({ id: z.string().min(1) })

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 })
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  })

  return NextResponse.json({ success: true, addresses })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 })
  }

  try {
    const body = createSchema.parse(await request.json())

    if (body.isDefault) {
      await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } })
    }

    const address = await prisma.address.create({
      data: { ...body, userId: session.user.id },
    })

    return NextResponse.json({ success: true, address })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Failed to create address.' }, { status: 400 })
  }
}

export async function PATCH(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 })
  }

  try {
    const { id, ...data } = updateSchema.parse(await request.json())

    const existing = await prisma.address.findFirst({ where: { id, userId: session.user.id } })
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Address not found.' }, { status: 404 })
    }

    if (data.isDefault) {
      await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } })
    }

    const address = await prisma.address.update({ where: { id }, data })
    return NextResponse.json({ success: true, address })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Update failed.' }, { status: 400 })
  }
}

export async function DELETE(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 })
  }

  try {
    const { id } = deleteSchema.parse(await request.json())

    const existing = await prisma.address.findFirst({ where: { id, userId: session.user.id } })
    if (!existing) {
      return NextResponse.json({ success: false, message: 'Address not found.' }, { status: 404 })
    }

    await prisma.address.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Delete failed.' }, { status: 400 })
  }
}
