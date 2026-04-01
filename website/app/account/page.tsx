'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Crown } from 'lucide-react'
import { formatDisplayDate } from '@/lib/utils/date'

const navItems = [
  { label: 'My Profile', href: '/account/profile' },
  { label: 'My Orders', href: '/orders' },
  { label: 'My Wishlist', href: '/account/wishlist' },
  { label: 'Saved Addresses', href: '/account/addresses' },
  { label: 'Tan Lerida™', href: '/account/tan-lerida', special: true },
]

interface OrderSummary {
  id: string
  orderNumber: string
  status: string
  createdAt: string
}

interface SessionSummary {
  id: string
  sessionCode: string
}

export default function AccountPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then((r) => r.json()),
      fetch('/api/tan-lerida/session').then((r) => r.json()),
    ])
      .then(([ordersData, sessionsData]) => {
        if (ordersData.success) setOrders(ordersData.orders)
        if (sessionsData.success) setSessions(sessionsData.sessions)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-32 md:px-10 lg:px-16">
      <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit border border-[#2A2A2A] bg-[#111111] p-6">
          <h1 className="font-heading text-3xl">My Account</h1>
          <nav className="mt-6 space-y-2">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href} className={`flex items-center gap-3 border px-4 py-3 text-sm uppercase tracking-[0.16em] ${item.special ? 'border-[#C0392B] text-[#C0392B]' : 'border-[#2A2A2A] text-[#A0A0A0]'}`}>
                {item.special ? <Crown size={14} /> : null}
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="space-y-6">
          <div className="border border-[#2A2A2A] bg-[#111111] p-6">
            <p className="font-label text-xs tracking-[0.3em] text-[#C0392B]">ACCOUNT SNAPSHOT</p>
            {loading ? (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-24 skeleton" />)}
              </div>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-3">
                <div className="border border-[#2A2A2A] p-4"><p className="text-sm text-[#A0A0A0]">Orders</p><p className="mt-2 font-display text-4xl">{orders.length}</p></div>
                <div className="border border-[#2A2A2A] p-4"><p className="text-sm text-[#A0A0A0]">Tan Lerida Sessions</p><p className="mt-2 font-display text-4xl">{sessions.length}</p></div>
                <div className="border border-[#2A2A2A] p-4"><p className="text-sm text-[#A0A0A0]">Latest Session</p><p className="mt-2 font-mono-tan text-xl text-[#BFA07A]">{sessions[0]?.sessionCode ?? '—'}</p></div>
              </div>
            )}
          </div>
          <div className="border border-[#2A2A2A] bg-[#111111] p-6">
            <h2 className="font-heading text-3xl">Recent Activity</h2>
            {loading ? (
              <div className="mt-5 space-y-4">
                {[1, 2].map((i) => <div key={i} className="h-12 skeleton" />)}
              </div>
            ) : orders.length === 0 ? (
              <p className="mt-5 text-sm text-[#A0A0A0]">No recent activity.</p>
            ) : (
              <div className="mt-5 space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex flex-col gap-2 border-b border-[#1F1F1F] pb-4 text-sm text-[#A0A0A0] md:flex-row md:items-center md:justify-between">
                    <span>{order.orderNumber} · {order.status}</span>
                    <span>{formatDisplayDate(order.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
