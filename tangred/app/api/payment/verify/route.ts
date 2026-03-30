import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { verifyRazorpaySignature } from '@/lib/razorpay'
import { sendTanLeridaAccessEmail } from '@/lib/resend'
import { markTanLeridaSessionPaid } from '@/lib/tan-leida-store'

const schema = z.object({
  orderId: z.string().min(1),
  paymentId: z.string().min(1),
  signature: z.string().min(1),
  tanLeridaSessionId: z.string().min(1).optional(),
  tanLeidaSessionId: z.string().min(1).optional(),
})

export async function POST(request: Request) {
  try {
    const payload = schema.parse(await request.json())
    const verified = verifyRazorpaySignature(payload.orderId, payload.paymentId, payload.signature)

    if (!verified) {
      return NextResponse.json({ success: false, message: 'Invalid Razorpay signature.' }, { status: 400 })
    }

    const sessionId = payload.tanLeridaSessionId ?? payload.tanLeidaSessionId

    if (sessionId) {
      const session = await prisma.tanLeidaSession.findUnique({
        where: { id: sessionId },
        select: {
          id: true,
          payment: {
            select: {
              razorpayOrderId: true,
            },
          },
        },
      })

      if (!session?.payment || session.payment.razorpayOrderId !== payload.orderId) {
        return NextResponse.json({ success: false, message: 'Tan Lerida payment record not found.' }, { status: 404 })
      }

      const paid = await markTanLeridaSessionPaid(sessionId, payload.paymentId)
      if (paid.user.email) {
        void sendTanLeridaAccessEmail(paid.user.email, paid.user.name ?? 'Client', paid.user.tanLeidaId)
      }

      return NextResponse.json({ success: true, verified, session: paid.session })
    }

    return NextResponse.json({ success: true, verified })
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : 'Unable to verify payment.' }, { status: 400 })
  }
}
