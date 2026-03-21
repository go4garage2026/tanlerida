'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPaise } from '@/lib/utils/currency'
import { formatDisplayDate } from '@/lib/utils/date'
import type { OrderType } from '@/types'

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => { if (data.success) setOrders(data.orders) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-32 md:px-10 lg:px-16">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="font-label text-[11px] tracking-[0.35em] text-[#C0392B]">ACCOUNT</p>
          <h1 className="mt-4 font-heading text-[42px] md:text-[56px]">Orders</h1>
        </div>
        <Link href="/account" className="text-sm uppercase tracking-[0.16em] text-[#A0A0A0]">Back to dashboard</Link>
      </div>

      {loading ? (
        <div className="space-y-5">
          {[1, 2].map((i) => <div key={i} className="h-40 skeleton" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#A0A0A0]">No orders yet.</p>
          <Link href="/products" className="btn-primary mt-6 inline-block">Start Shopping</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <article key={order.id} className="border border-[#2A2A2A] bg-[#111111] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-label text-xs tracking-[0.25em] text-[#F5F5F5]">{order.orderNumber}</p>
                  <p className="mt-2 text-sm text-[#A0A0A0]">Placed on {formatDisplayDate(order.createdAt)}</p>
                </div>
                <div className="text-sm uppercase tracking-[0.16em] text-[#C0392B]">{order.status}</div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {order.items.map((item) => (
                  <div key={item.id} className="border border-[#2A2A2A] p-4">
                    <p className="font-heading text-xl">{item.product.name}</p>
                    <p className="mt-2 text-sm text-[#A0A0A0]">Quantity: {item.quantity}</p>
                    <p className="mt-3 font-display text-2xl text-[#C0392B]">{formatPaise(item.total)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-right">
                <span className="text-sm text-[#A0A0A0]">Total: </span>
                <span className="font-display text-xl text-[#F5F5F5]">{formatPaise(order.total)}</span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
