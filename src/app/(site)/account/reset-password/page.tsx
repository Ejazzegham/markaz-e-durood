'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FaLock, FaArrowRight, FaArrowLeft, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''
  const email = searchParams.get('email') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!token || !email) {
      setError('This reset link is invalid. Please request a new one.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password, confirmPassword }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setSuccess(true)
      setTimeout(() => router.push('/account/login'), 1800)
    } catch {
      setError('Could not connect. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] bg-green-875 flex items-center justify-center px-4 py-8 sm:px-6 sm:py-10">
      <div
        className="
          relative
          w-full
          max-w-5xl
          lg:h-[600px]
          rounded-3xl
          lg:rounded-[25px]
          overflow-hidden
          shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        "
      >
        <img
          src="/login-bg.jpg"
          alt="Reset your password"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 lg:bg-black/10" />

        <div className="relative z-10 flex items-center justify-center lg:justify-end px-5 py-10 sm:px-8 lg:px-0 lg:py-0 lg:h-full">
          <div className="w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[520px] lg:mr-16">

            <Link
              href="/account/login"
              className="inline-flex items-center gap-2 text-gold-500 hover:text-white mb-6"
            >
              <FaArrowLeft />
              Back to Login
            </Link>

            <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">
              Set New Password
            </h1>

            {success ? (
              <div className="py-6">
                <FaCheckCircle className="text-5xl text-gold-500 mb-4" />
                <p className="text-white/90 text-lg mb-2">Password updated!</p>
                <p className="text-white/70 text-sm">Taking you to the login page...</p>
              </div>
            ) : !token || !email ? (
              <p className="text-red-300 bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 text-sm">
                This reset link is missing or invalid. Please request a new one from the{' '}
                <Link href="/account/forgot-password" className="text-gold-500 font-semibold hover:text-white">
                  forgot password
                </Link>{' '}
                page.
              </p>
            ) : (
              <>
                <p className="text-white/80 mb-8">
                  Choose a new password for <span className="text-gold-500">{email}</span>.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-5">
                    <div className="relative">
                      <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 text-lg z-10" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="New password"
                        required
                        minLength={6}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 pl-14 pr-12 text-white placeholder-white/60 focus:outline-none focus:border-gold-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-gold-500 transition-colors z-10"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="relative">
                      <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 text-lg z-10" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        required
                        minLength={6}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 pl-14 pr-12 text-white placeholder-white/60 focus:outline-none focus:border-gold-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((v) => !v)}
                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-white/60 hover:text-gold-500 transition-colors z-10"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-300 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2.5 text-sm mb-5 text-center">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="
                      w-full h-14 rounded-full bg-gold-500 hover:bg-gold-600
                      disabled:opacity-60 disabled:cursor-not-allowed
                      text-black font-bold transition-all
                      flex items-center justify-center gap-2
                    "
                  >
                    {submitting ? 'Updating...' : 'Update Password'}
                    {!submitting && <FaArrowRight />}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
