'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function VerifyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? 'Verification failed.')
        return
      }

      router.push('/login')
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <div className="w-full max-w-md border border-[#2A2A2A] bg-[#111111] p-8 text-center">
        <p className="font-label text-[11px] tracking-[0.35em] text-[#C0392B]">EMAIL VERIFICATION</p>
        <h1 className="mt-4 font-heading text-3xl">Enter Your OTP</h1>
        <p className="mt-4 text-sm text-[#A0A0A0]">
          {email ? `We sent a verification code to ${email}.` : 'Enter the verification code sent to your email.'}
        </p>

        {error && (
          <div className="mt-4 border border-[#C0392B]/40 bg-[#C0392B]/10 p-3 text-sm text-[#E74C3C]">{error}</div>
        )}

        <form onSubmit={handleVerify}>
          <input
            className="input-luxury mt-8 text-center tracking-[0.5em]"
            placeholder="123456"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn-primary mt-6 w-full" disabled={loading}>
            {loading ? 'Verifying…' : 'Verify & Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
