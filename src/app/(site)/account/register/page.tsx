'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaCheckCircle
} from 'react-icons/fa'

export default function RegisterPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Could not create your account. Please try again.')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1200)
    } catch {
      setError('Could not create your account. Please check your connection and try again.')
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
          alt="Register"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60 lg:bg-black/10" />

        <div className="relative z-10 flex items-center justify-center lg:justify-end px-5 py-10 sm:px-8 lg:px-0 lg:py-0 lg:h-full">

          <div className="w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[520px] lg:mr-16">

            <h1 className="text-white text-4xl font-bold mb-2">
              Create Account
            </h1>

            <p className="text-white/80 mb-8">
              Join Markaz-e-Durood Community
            </p>

            {success ? (
              <div className="text-center py-10">
                <FaCheckCircle className="text-6xl text-gold-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
                <p className="text-white/80">Taking you to the homepage...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                <div className="mb-4 relative">
                  <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" />
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={handleChange('name')}
                    className="w-full h-14 rounded-full bg-white/10 border border-white/20 pl-14 pr-5 text-white placeholder-white/60 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="mb-4 relative">
                  <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={handleChange('email')}
                    className="w-full h-14 rounded-full bg-white/10 border border-white/20 pl-14 pr-5 text-white placeholder-white/60 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="mb-4 relative">
                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" />
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange('password')}
                    className="w-full h-14 rounded-full bg-white/10 border border-white/20 pl-14 pr-5 text-white placeholder-white/60 focus:outline-none focus:border-gold-500"
                  />
                </div>

                <div className="mb-6 relative">
                  <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    minLength={6}
                    value={formData.confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    className="w-full h-14 rounded-full bg-white/10 border border-white/20 pl-14 pr-5 text-white placeholder-white/60 focus:outline-none focus:border-gold-500"
                  />
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
                    w-full
                    h-14
                    rounded-full
                    bg-gold-500
                    hover:bg-gold-600
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    text-black
                    font-bold
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition-all
                  "
                >
                  {submitting ? 'Creating Account...' : 'Create Account'}
                  {!submitting && <FaArrowRight />}
                </button>

              </form>
            )}

            {!success && (
              <div className="text-center mt-8">
                <p className="text-white/80">
                  Already have an account?
                </p>

                <Link
                  href="/account/login"
                  className="text-gold-500 font-semibold"
                >
                  Login Now
                </Link>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}
