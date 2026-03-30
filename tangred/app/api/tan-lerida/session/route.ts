import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCurrentUserIdOrDemo } from '@/lib/request-auth'
import { prisma } from '@/lib/prisma'
import { createRazorpayOrder, getRazorpayKeyId, getTanLeridaPaymentBreakdown, isMockRazorpayOrder } from '@/lib/razorpay'
import { enforceRateLimit } from '@/lib/rate-limit'
import { sendTanLeridaAccessEmail } from '@/lib/resend'
import { createTanLeridaSession, listTanLeridaSessions, markTanLeridaSessionPaid, updateTanLeridaSession } from '@/lib/tan-leida-store'
import { getRequestIp } from '@/lib/utils/guards'

const createSchema = z.object({
  consent: z.literal(true),
  moderationAccepted: z.literal(true),
})

export async function GET() {
  const userId = await getCurrentUserIdOrDemo()
  const sessions = await listTanLeridaSessions(userId)
  return NextResponse.json({ success: true, sessions })
}

export async function POST(request: Request) {
  try {
    enforceRateLimit(`tan-lerida-session:${getRequestIp(request)}`, 10, 60_000)
    const body = createSchema.parse(await request.json())
    const userId = await getCurrentUserIdOrDemo()
    const breakdown = getTanLeridaPaymentBreakdown()
    const paymentOrder = await createRazorpayOrder(breakdown.total)

    const payment = await prisma.tanLeidaPayment.create({
      data: {
        userId,
        razorpayOrderId: paymentOrder.id,
        amount: breakdown.subtotal,
        gstAmount: breakdown.gst,
        status: isMockRazorpayOrder(paymentOrder.id) ? 'paid' : 'created',
      },
    })

    const session = await createTanLeridaSession(userId, {
      paymentId: payment.id,
      isPaid: isMockRazorpayOrder(paymentOrder.id),
    })
    const updated = await updateTanLeridaSession(session.id, body as Record<string, unknown>)

    if (isMockRazorpayOrder(paymentOrder.id)) {
      const paid = await markTanLeridaSessionPaid(updated.id, `mock_pay_${Date.now()}`)
      if (paid.user.email) {
        void sendTanLeridaAccessEmail(paid.user.email, paid.user.name ?? 'Client', paid.user.tanLeidaId)
      }

      return NextResponse.json({
        success: true,
        session: paid.session,
        payment: {
          orderId: paymentOrder.id,
          amount: paymentOrder.amount,
          currency: paymentOrder.currency,
          mode: 'mock',
        },
      })
    }

    return NextResponse.json({
      success: true,
      session: updated,
      payment: {
        orderId: paymentOrder.id,
        amount: paymentOrder.amount,
        currency: paymentOrder.currency,
        keyId: getRazorpayKeyId(),
        mode: 'razorpay',
      },
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to create session.' }, { status: 400 })
  }
}
