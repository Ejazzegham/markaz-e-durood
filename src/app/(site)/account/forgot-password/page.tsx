'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaEnvelope, FaArrowRight, FaArrowLeft, FaCheckCircle } from 'react-icons/fa'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setSuccess(true)
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
          lg:h-[560px]
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
              Forgot Password
            </h1>

            {success ? (
              <div className="py-6">
                <FaCheckCircle className="text-5xl text-gold-500 mb-4" />
                <p className="text-white/90 text-lg mb-2">Check your email</p>
                <p className="text-white/70 text-sm leading-6">
                  If an account exists for <span className="text-gold-500">{email}</span>, we've sent
                  a link to reset your password. It's valid for 1 hour.
                </p>
              </div>
            ) : (
              <>
                <p className="text-white/80 mb-8">
                  Enter the email linked to your account and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <div className="relative">
                      <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 text-lg z-10" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 pl-14 pr-5 text-white placeholder-white/60 focus:outline-none focus:border-gold-500"
                      />
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
                    {submitting ? 'Sending link...' : 'Send Reset Link'}
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
