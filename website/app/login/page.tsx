'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const justRegistered = searchParams.get('registered') === 'true'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleCredentialsLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(
          result.error.includes('EMAIL_NOT_VERIFIED')
            ? 'Verify your email before signing in.'
            : 'Invalid email or password.',
        )
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    await signIn('google', { callbackUrl })
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 pt-24">
      <div className="w-full max-w-md border border-[#2A2A2A] bg-[#111111] p-8">
        <p className="text-center font-display text-4xl tracking-[0.2em]">TANGRED</p>
        <h1 className="mt-6 font-heading text-3xl text-center">Welcome Back</h1>

        {error && (
          <div className="mt-4 border border-[#C0392B]/40 bg-[#C0392B]/10 p-3 text-center text-sm text-[#E74C3C]">
            {error}
          </div>
        )}

        {justRegistered && !error && (
          <div className="mt-4 border border-[#BFA07A]/40 bg-[#BFA07A]/10 p-3 text-center text-sm text-[#BFA07A]">
            Account created successfully. Sign in to continue.
          </div>
        )}

        <form onSubmit={handleCredentialsLogin} className="mt-8 space-y-4">
          <input
            className="input-luxury"
            placeholder="Email address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            className="input-luxury"
            placeholder="Password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Login'}
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-[#2A2A2A]" />
          <span className="text-xs text-[#A0A0A0]">OR</span>
          <div className="h-px flex-1 bg-[#2A2A2A]" />
        </div>

        <button type="button" className="btn-ghost w-full mt-4" onClick={handleGoogleLogin} disabled={loading}>
          Continue with Google
        </button>

        <div className="mt-6 flex items-center justify-between text-sm text-[#A0A0A0]">
          <Link href="/register">Create account</Link>
          <Link href="/forgot-password">Forgot password?</Link>
        </div>
      </div>
    </div>
  )
}
