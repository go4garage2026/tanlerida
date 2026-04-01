'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Step = 'request' | 'reset'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('request')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRequestOtp(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? 'Failed to send OTP.')
        return
      }

      setMessage('OTP sent to your email.')
      setStep('reset')
    } catch {
      setError('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message ?? 'Reset failed.')
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
      <div className="w-full max-w-md border border-[#2A2A2A] bg-[#111111] p-8">
        <p className="font-label text-[11px] tracking-[0.35em] text-[#C0392B]">PASSWORD RESET</p>
        <h1 className="mt-4 font-heading text-3xl">
          {step === 'request' ? 'Request an OTP' : 'Set New Password'}
        </h1>
        <p className="mt-4 text-sm text-[#A0A0A0]">
          {step === 'request'
            ? "We'll send a one-time code to your registered email so you can set a new Tangred password securely."
            : 'Enter the OTP from your email and choose a new password.'}
        </p>

        {error && (
          <div className="mt-4 border border-[#C0392B]/40 bg-[#C0392B]/10 p-3 text-center text-sm text-[#E74C3C]">{error}</div>
        )}
        {message && (
          <div className="mt-4 border border-[#BFA07A]/40 bg-[#BFA07A]/10 p-3 text-center text-sm text-[#BFA07A]">{message}</div>
        )}

        {step === 'request' ? (
          <form onSubmit={handleRequestOtp} className="mt-8 space-y-4">
            <input className="input-luxury" type="email" placeholder="Email address" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
            <button type="submit" className="btn-red w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="mt-8 space-y-4">
            <input className="input-luxury text-center tracking-[0.5em]" placeholder="Enter OTP" required value={otp} onChange={(e) => setOtp(e.target.value)} disabled={loading} />
            <input className="input-luxury" type="password" placeholder="New password" required minLength={8} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={loading} />
            <input className="input-luxury" type="password" placeholder="Confirm new password" required minLength={8} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
            <button type="submit" className="btn-red w-full" disabled={loading}>
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
