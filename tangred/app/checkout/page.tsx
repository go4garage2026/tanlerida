'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cartStore'
import { formatPaise } from '@/lib/utils/currency'
import type { AddressType } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, getSubtotal, getGST, getTotal, clearCart } = useCartStore()
  const [addresses, setAddresses] = useState<AddressType[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [error, setError] = useState('')

  const subtotal = getSubtotal()
  const gst = getGST()
  const total = getTotal()

  useEffect(() => {
    fetch('/api/account/addresses')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.addresses.length > 0) {
          setAddresses(data.addresses)
          const defaultAddr = data.addresses.find((a: AddressType) => a.isDefault) ?? data.addresses[0]
          setSelectedAddressId(defaultAddr.id)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-32 md:px-10 lg:px-16 text-center">
        <h1 className="font-heading text-[42px]">Checkout</h1>
        <p className="mt-6 text-[#A0A0A0]">Your cart is empty.</p>
        <button type="button" className="btn-primary mt-6" onClick={() => router.push('/products')}>Continue Shopping</button>
      </div>
    )
  }

  async function handlePayment() {
    if (!selectedAddressId) {
      setError('Please select a delivery address.')
      return
    }

    setError('')
    setPaying(true)

    try {
      // Create a payment order (returns mock when Razorpay is not configured)
      const orderRes = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: total }),
      })

      const orderData = await orderRes.json()
      if (!orderData.success) {
        setError(orderData.message ?? 'Failed to create payment order.')
        setPaying(false)
        return
      }

      const mockPaymentId = `pay_${Date.now()}`

      // Create order directly — payment is auto-accepted
      const createRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          addressId: selectedAddressId,
          items: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: item.product.discountPrice ?? item.product.basePrice,
          })),
          subtotal,
          gst,
          total,
          razorpayOrderId: orderData.order.id,
          razorpayPayId: mockPaymentId,
        }),
      })

      const createData = await createRes.json()
      if (createData.success) {
        clearCart()
        router.push('/orders')
      } else {
        setError(createData.message ?? 'Failed to create order.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-32 md:px-10 lg:px-16">
      <h1 className="font-heading text-[42px] md:text-[56px]">Checkout</h1>

      {error && (
        <div className="mt-4 border border-[#C0392B]/40 bg-[#C0392B]/10 p-3 text-sm text-[#E74C3C]">{error}</div>
      )}

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_400px]">
        <section className="space-y-8">
          {/* Address Selection */}
          <div className="border border-[#2A2A2A] bg-[#111111] p-6">
            <h2 className="font-label text-xs tracking-[0.28em] text-[#F5F5F5]">DELIVERY ADDRESS</h2>
            {loading ? (
              <div className="mt-5 h-20 skeleton" />
            ) : addresses.length === 0 ? (
              <div className="mt-5">
                <p className="text-sm text-[#A0A0A0]">No saved addresses.</p>
                <button type="button" className="btn-ghost mt-3 text-xs" onClick={() => router.push('/account/addresses')}>Add Address</button>
              </div>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {addresses.map((address) => (
                  <button
                    key={address.id}
                    type="button"
                    className={`border p-4 text-left transition-luxury ${selectedAddressId === address.id ? 'border-[#C0392B]' : 'border-[#2A2A2A] hover:border-[#A0A0A0]'}`}
                    onClick={() => setSelectedAddressId(address.id)}
                  >
                    <p className="font-label text-xs tracking-[0.2em] text-[#F5F5F5]">{address.label}</p>
                    <p className="mt-3 text-sm leading-7 text-[#A0A0A0]">
                      {address.line1}<br />
                      {address.line2 ? <>{address.line2}<br /></> : null}
                      {address.city}, {address.state} {address.pincode}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Items */}
          <div className="border border-[#2A2A2A] bg-[#111111] p-6">
            <h2 className="font-label text-xs tracking-[0.28em] text-[#F5F5F5]">ORDER ITEMS</h2>
            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 border-b border-[#2A2A2A] pb-4">
                  <div className="h-16 w-16 bg-[#1A1A1A] flex-shrink-0">
                    {item.product.images[0] && (
                      <img src={item.product.images[0].url} alt={item.product.name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-[#F5F5F5]">{item.product.name}</p>
                    <p className="text-xs text-[#A0A0A0]">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm text-[#F5F5F5]">{formatPaise((item.product.discountPrice ?? item.product.basePrice) * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="border border-[#2A2A2A] bg-[#111111] p-6">
            <h2 className="font-label text-xs tracking-[0.28em] text-[#F5F5F5]">PAYMENT</h2>
            <p className="mt-5 text-sm text-[#A0A0A0]">Your order will be confirmed instantly. Payment is collected on delivery.</p>
            <button type="button" className="btn-red mt-5 text-xs" onClick={handlePayment} disabled={paying}>
              {paying ? 'Placing order…' : `Place Order — ${formatPaise(total)}`}
            </button>
          </div>
        </section>

        {/* Order Summary */}
        <aside className="h-fit border border-[#2A2A2A] bg-[#111111] p-6">
          <h2 className="font-label text-xs tracking-[0.28em] text-[#F5F5F5]">ORDER SUMMARY</h2>
          <div className="mt-5 space-y-4 border-b border-[#2A2A2A] pb-5">
            {items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 text-sm text-[#A0A0A0]">
                <span>{item.product.name} × {item.quantity}</span>
                <span>{formatPaise((item.product.discountPrice ?? item.product.basePrice) * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 text-sm text-[#A0A0A0]">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPaise(subtotal)}</span></div>
            <div className="flex justify-between"><span>GST (18%)</span><span>{formatPaise(gst)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span className="text-[#BFA07A]">Included</span></div>
            <div className="flex justify-between border-t border-[#2A2A2A] pt-3 text-[#F5F5F5]">
              <span>Total</span>
              <span className="font-display text-2xl text-[#C0392B]">{formatPaise(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
