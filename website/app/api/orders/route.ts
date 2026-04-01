import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { generateOrderNumber } from '@/lib/utils/ids'
import { sendOrderConfirmationEmail } from '@/lib/resend'

const createOrderSchema = z.object({
  addressId: z.string().min(1),
  items: z.array(z.object({
    productId: z.string().min(1),
    variantId: z.string().nullable().optional(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().int().positive(),
  })),
  subtotal: z.number().int().positive(),
  gst: z.number().int().nonnegative(),
  total: z.number().int().positive(),
  razorpayOrderId: z.string().optional(),
  razorpayPayId: z.string().optional(),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { where: { isPrimary: true }, take: 1 },
              category: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ success: true, orders })
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Not authenticated.' }, { status: 401 })
  }

  try {
    const body = createOrderSchema.parse(await request.json())

    const address = await prisma.address.findFirst({ where: { id: body.addressId, userId: session.user.id } })
    if (!address) {
      return NextResponse.json({ success: false, message: 'Address not found.' }, { status: 404 })
    }

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        orderNumber: generateOrderNumber(),
        status: 'CONFIRMED',
        subtotal: body.subtotal,
        gst: body.gst,
        total: body.total,
        shippingCharge: 0,
        addressSnapshot: {
          label: address.label,
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        razorpayOrderId: body.razorpayOrderId,
        razorpayPayId: body.razorpayPayId,
        paidAt: body.razorpayPayId ? new Date() : null,
        items: {
          create: body.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId ?? null,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            total: item.unitPrice * item.quantity,
          })),
        },
      },
      include: { items: true },
    })

    // Send confirmation email
    const user = await prisma.user.findUnique({ where: { id: session.user.id }, select: { email: true, name: true } })
    if (user?.email) {
      void sendOrderConfirmationEmail(user.email, user.name ?? 'Customer', order.orderNumber, order.total)
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Order creation failed.' }, { status: 400 })
  }
}
