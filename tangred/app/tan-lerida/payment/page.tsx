'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { formatPrice } from '@/lib/format'
import { TAN_LERIDA_TOTAL_PAISE } from '@/lib/utils/currency'

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void
    }
  }
}

export default function TanLeridaPaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function ensureRazorpayCheckout() {
    if (typeof window === 'undefined') return false
    if (window.Razorpay) return true

    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async = true
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  async function startSession() {
    setLoading(true)
    setError('')
    const response = await fetch('/api/tan-lerida/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ consent: true, moderationAccepted: true }),
    })
    const data = await response.json()

    if (!data.success) {
      setError(data.message ?? 'Unable to start Tan Lerida.')
      setLoading(false)
      return
    }

    if (data.session?.isPaid) {
      setLoading(false)
      router.push(`/account/tan-lerida/session/${data.session.id}`)
      return
    }

    const checkoutReady = await ensureRazorpayCheckout()
    if (!checkoutReady || !window.Razorpay || !data.payment?.keyId) {
      setError('Razorpay checkout is unavailable right now. Please try again shortly.')
      setLoading(false)
      return
    }

    const razorpay = new window.Razorpay({
      key: data.payment.keyId,
      amount: data.payment.amount,
      currency: data.payment.currency,
      name: 'Tangred',
      description: 'Tan Lerida consultation',
      order_id: data.payment.orderId,
      theme: { color: '#C0392B' },
      handler: async (paymentResponse: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        const verifyResponse = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: paymentResponse.razorpay_order_id,
            paymentId: paymentResponse.razorpay_payment_id,
            signature: paymentResponse.razorpay_signature,
            tanLeridaSessionId: data.session.id,
            tanLeidaSessionId: data.session.id,
          }),
        })
        const verifyData = await verifyResponse.json()

        if (verifyData.success) {
          router.push(`/account/tan-lerida/session/${data.session.id}`)
          return
        }

        setError(verifyData.message ?? 'Payment verification failed.')
        setLoading(false)
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
    })

    razorpay.open()
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-32 md:px-10">
      <div className="border border-[#2A2A2A] bg-[#111111] p-8 md:p-10">
        <p className="font-label text-[11px] tracking-[0.35em] text-[#C0392B]">Tan Lerida PAYMENT</p>
        <h1 className="mt-4 font-heading text-[42px] md:text-[56px]">Unlock Your Consultation</h1>
        <p className="mt-5 max-w-2xl text-[#A0A0A0]">Consent to likeness-based image generation, confirm your premium styling session, and enter the multi-step Tan Lerida wizard with persisted status polling.</p>
        {error ? (
          <div className="mt-6 border border-[#C0392B]/40 bg-[#C0392B]/10 p-3 text-sm text-[#E74C3C]">{error}</div>
        ) : null}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="border border-[#2A2A2A] p-5"><p className="text-sm text-[#A0A0A0]">Base Price</p><p className="mt-2 font-display text-3xl">₹99.00</p></div>
          <div className="border border-[#2A2A2A] p-5"><p className="text-sm text-[#A0A0A0]">GST</p><p className="mt-2 font-display text-3xl">₹17.82</p></div>
          <div className="border border-[#C0392B] p-5"><p className="text-sm text-[#A0A0A0]">Total</p><p className="mt-2 font-display text-3xl text-[#C0392B]">{formatPrice(TAN_LERIDA_TOTAL_PAISE)}</p></div>
        </div>
        <div className="mt-8 rounded-sm border border-[#2A2A2A] bg-black/20 p-4 text-sm text-[#A0A0A0]">
          By continuing, you confirm you have explicit consent to use uploaded likenesses for styling analysis and generated visual outputs.
        </div>
        <button type="button" className="btn-red mt-8" onClick={startSession} disabled={loading}>
          {loading ? 'Creating session…' : 'Proceed with Tan Lerida™'}
        </button>
      </div>
    </div>
  )
}
