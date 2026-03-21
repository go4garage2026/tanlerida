'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Star } from 'lucide-react'
import type { AddressType } from '@/types'

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<AddressType[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ label: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function fetchAddresses() {
    fetch('/api/account/addresses')
      .then((res) => res.json())
      .then((data) => { if (data.success) setAddresses(data.addresses) })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAddresses() }, [])

  function resetForm() {
    setForm({ label: '', line1: '', line2: '', city: '', state: '', pincode: '', isDefault: false })
    setShowForm(false)
    setError('')
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/account/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, line2: form.line2 || undefined }),
      })

      const data = await res.json()
      if (data.success) {
        resetForm()
        fetchAddresses()
      } else {
        setError(data.message ?? 'Failed to add address.')
      }
    } catch {
      setError('Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    await fetch('/api/account/addresses', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    fetchAddresses()
  }

  async function handleSetDefault(id: string) {
    await fetch('/api/account/addresses', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isDefault: true }),
    })
    fetchAddresses()
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-6 pb-20 pt-32 md:px-10">
        <h1 className="font-heading text-[42px]">Saved Addresses</h1>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => <div key={i} className="h-40 skeleton" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-20 pt-32 md:px-10">
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-heading text-[42px]">Saved Addresses</h1>
        <button type="button" className="btn-ghost text-xs" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} /> {showForm ? 'Cancel' : 'Add New Address'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mt-6 border border-[#2A2A2A] bg-[#111111] p-6 space-y-4">
          {error && <div className="border border-[#C0392B]/40 bg-[#C0392B]/10 p-3 text-sm text-[#E74C3C]">{error}</div>}
          <div className="grid gap-4 md:grid-cols-2">
            <input className="input-luxury" placeholder="Label (e.g. Home, Office)" required value={form.label} onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))} disabled={saving} />
            <input className="input-luxury" placeholder="Address line 1" required value={form.line1} onChange={(e) => setForm((p) => ({ ...p, line1: e.target.value }))} disabled={saving} />
            <input className="input-luxury" placeholder="Address line 2 (optional)" value={form.line2} onChange={(e) => setForm((p) => ({ ...p, line2: e.target.value }))} disabled={saving} />
            <input className="input-luxury" placeholder="City" required value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} disabled={saving} />
            <input className="input-luxury" placeholder="State" required value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} disabled={saving} />
            <input className="input-luxury" placeholder="Pincode" required value={form.pincode} onChange={(e) => setForm((p) => ({ ...p, pincode: e.target.value }))} disabled={saving} />
          </div>
          <label className="flex items-center gap-2 text-sm text-[#A0A0A0]">
            <input type="checkbox" className="accent-[#C0392B]" checked={form.isDefault} onChange={(e) => setForm((p) => ({ ...p, isDefault: e.target.checked }))} />
            Set as default address
          </label>
          <button type="submit" className="btn-red text-xs" disabled={saving}>
            {saving ? 'Saving…' : 'Save Address'}
          </button>
        </form>
      )}

      {addresses.length === 0 ? (
        <p className="mt-10 text-center text-[#A0A0A0]">No saved addresses yet.</p>
      ) : (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <article key={address.id} className={`border p-6 ${address.isDefault ? 'border-[#C0392B] bg-[#111111]' : 'border-[#2A2A2A] bg-[#111111]'}`}>
              <div className="flex items-center justify-between">
                <p className="font-label text-xs tracking-[0.25em] text-[#F5F5F5]">{address.label}</p>
                <div className="flex gap-2">
                  {!address.isDefault && (
                    <button type="button" className="text-[#A0A0A0] hover:text-[#BFA07A] transition-colors" title="Set as default" onClick={() => handleSetDefault(address.id)}>
                      <Star size={14} />
                    </button>
                  )}
                  <button type="button" className="text-[#A0A0A0] hover:text-[#C0392B] transition-colors" title="Delete" onClick={() => handleDelete(address.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#A0A0A0]">
                {address.line1}<br />
                {address.line2 ? <>{address.line2}<br /></> : null}
                {address.city}, {address.state} {address.pincode}
              </p>
              {address.isDefault && <span className="mt-3 inline-block badge-gold">Default</span>}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
