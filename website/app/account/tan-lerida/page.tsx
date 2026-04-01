'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Crown } from 'lucide-react'
import { formatDisplayDate } from '@/lib/utils/date'
import type { TanLeridaSessionType } from '@/types'

export default function AccountTanLeridaPage() {
  const [sessions, setSessions] = useState<TanLeridaSessionType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tan-lerida/session')
      .then((r) => r.json())
      .then((data) => { if (data.success) setSessions(data.sessions) })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-6 pb-20 pt-32 md:px-10">
      <div className="flex items-center gap-3">
        <Crown size={22} className="text-[#C0392B]" />
        <h1 className="font-heading text-[42px]">Tan Lerida™ Hub</h1>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
        <div className="border border-[#2A2A2A] bg-[#111111] p-6">
          <p className="font-label text-xs tracking-[0.3em] text-[#C0392B]">TAN LERIDA</p>
          <p className="mt-4 font-display text-3xl">Your AI Styling Consultant</p>
          <p className="mt-3 text-sm text-[#A0A0A0]">Start a new consultation any time you need a fresh recommendation powered by Gemini vision analysis and Claude styling intelligence.</p>
        </div>
        <div className="border border-[#2A2A2A] bg-[#111111] p-6">
          <p className="font-label text-xs tracking-[0.3em] text-[#F5F5F5]">NEXT STEP</p>
          <Link href="/tan-lerida/payment" className="btn-outline mt-6">Start New Session</Link>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 space-y-4">
          {[1, 2].map((i) => <div key={i} className="h-24 skeleton" />)}
        </div>
      ) : sessions.length === 0 ? (
        <div className="mt-8 text-center py-10 border border-[#2A2A2A] bg-[#111111]">
          <p className="text-[#A0A0A0]">No sessions yet. Start your first consultation.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {sessions.map((session) => (
            <article key={session.id} className="border border-[#2A2A2A] bg-[#111111] p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="font-mono-tan text-lg text-[#BFA07A]">{session.sessionCode}</p>
                  <p className="mt-2 text-sm text-[#A0A0A0]">Created {formatDisplayDate(session.createdAt)} · {session.status}</p>
                </div>
                <Link href={`/account/tan-lerida/session/${session.id}`} className="btn-ghost text-xs">Open Session</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
