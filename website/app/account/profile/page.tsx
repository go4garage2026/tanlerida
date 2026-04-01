'use client'

import { useState, useEffect } from 'react'

interface UserProfile {
  name: string | null
  email: string
  phone: string | null
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [form, setForm] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/account/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.user)
          setForm({ name: data.user.name ?? '', phone: data.user.phone ?? '' })
        }
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/account/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name || undefined, phone: form.phone || undefined }),
      })

      const data = await res.json()
      if (data.success) {
        setProfile(data.user)
        setMessage('Profile updated successfully.')
      } else {
        setMessage(data.message ?? 'Update failed.')
      }
    } catch {
      setMessage('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 pb-20 pt-32 md:px-10">
        <h1 className="font-heading text-[42px]">Profile</h1>
        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 skeleton" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-6 pb-20 pt-32 md:px-10">
      <h1 className="font-heading text-[42px]">Profile</h1>

      {message && (
        <div className="mt-4 border border-[#BFA07A]/40 bg-[#BFA07A]/10 p-3 text-sm text-[#BFA07A]">{message}</div>
      )}

      <form onSubmit={handleSave} className="mt-8 grid gap-4 md:grid-cols-2">
        <input className="input-luxury" placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} disabled={saving} />
        <input className="input-luxury opacity-60 cursor-not-allowed" value={profile?.email ?? ''} disabled title="Email cannot be changed" />
        <input className="input-luxury" placeholder="Phone number" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} disabled={saving} />
        <div />
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
