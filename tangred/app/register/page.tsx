'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!agreed) {
      setError('Please agree to the terms and privacy policy.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, phone: form.phone || undefined, password: form.password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message ?? 'Registration failed.')
        return
      }

      router.push('/login?registered=true')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <div className="w-full max-w-2xl border border-[#2A2A2A] bg-[#111111] p-8">
        <h1 className="font-heading text-4xl">Create Your Tangred Account</h1>

        {error && (
          <div className="mt-4 border border-[#C0392B]/40 bg-[#C0392B]/10 p-3 text-sm text-[#E74C3C]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <input className="input-luxury" placeholder="Full name" required value={form.name} onChange={(e) => update('name', e.target.value)} disabled={loading} />
          <input className="input-luxury" placeholder="Email address" type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} disabled={loading} />
          <input className="input-luxury" placeholder="Phone number (optional)" type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} disabled={loading} />
          <input className="input-luxury" placeholder="Password" type="password" required minLength={8} value={form.password} onChange={(e) => update('password', e.target.value)} disabled={loading} />
          <input className="input-luxury md:col-span-2" placeholder="Confirm password" type="password" required minLength={8} value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} disabled={loading} />

          <label className="md:col-span-2 mt-1 flex items-center gap-3 text-sm text-[#A0A0A0]">
            <input type="checkbox" className="accent-[#C0392B]" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
            I agree to Tangred&apos;s terms and privacy policy.
          </label>

          <div className="md:col-span-2">
            <button type="submit" className="btn-red" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </div>
        </form>

        <p className="mt-5 text-sm text-[#A0A0A0]">Already registered? <Link href="/login" className="text-[#F5F5F5]">Sign in</Link></p>
      </div>
    </div>
  )
}
