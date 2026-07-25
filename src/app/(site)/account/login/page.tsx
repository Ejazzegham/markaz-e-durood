'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaEnvelope, FaLock, FaArrowRight, FaUser, FaCheckCircle } from 'react-icons/fa'

export default function LoginPage() {
  const router = useRouter()
  const [isRegister, setIsRegister] = useState(false)

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

  const switchMode = (register: boolean) => {
    setIsRegister(register)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (isRegister) {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
    }

    setSubmitting(true)
    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const body = isRegister
        ? formData
        : { email: formData.email, password: formData.password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/')
        router.refresh()
      }, 1000)
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
        {/* Background Image */}
        <img
          src="/login-bg.jpg"
          alt="Markaz e Durood"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 lg:bg-black/10" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center lg:justify-end px-5 py-10 sm:px-8 lg:px-0 lg:py-0 lg:h-full">

          <div className="w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[520px] lg:mr-16">

            {/* Hide Welcome Section when Register */}
            {!isRegister && !success && (
              <>
                <p className="text-gold-500 text-sm tracking-[6px] mb-2 uppercase">
                  WELCOME TO
                </p>

                <h1
                  className="
                    text-white
                    text-4xl
                    md:text-5xl
                    font-bold
                    leading-tight
                    mb-4
                  "
                >
                  Markaz-e-Durood
                </h1>

                <p className="text-white/80 text-base leading-7 mb-8 max-w-md">
                  Join our global community dedicated to spreading
                  Durood & Salam upon Prophet Muhammad ﷺ.
                </p>
              </>
            )}

            {success ? (
              <div className="text-center py-10">
                <FaCheckCircle className="text-6xl text-gold-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isRegister ? 'Account Created!' : 'Welcome Back!'}
                </h2>
                <p className="text-white/80">Taking you to the homepage...</p>
              </div>
            ) : (
              <>
                <h2 className="text-white text-3xl font-bold mb-6">
                  {isRegister ? 'Register' : 'Login'}
                </h2>

                <form onSubmit={handleSubmit}>

                  {/* Register Name */}
                  {isRegister && (
                    <div className="mb-5">
                      <div className="relative">
                        <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 text-lg z-10" />
                        <input
                          type="text"
                          placeholder="Full Name"
                          required
                          value={formData.name}
                          onChange={handleChange('name')}
                          className="w-full h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 pl-14 pr-5 text-white placeholder-white/60 focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div className="mb-5">
                    <div className="relative">
                      <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 text-lg z-10" />
                      <input
                        type="email"
                        placeholder="Enter your email"
                        required
                        value={formData.email}
                        onChange={handleChange('email')}
                        className="w-full h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 pl-14 pr-5 text-white placeholder-white/60 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="mb-5">
                    <div className="relative">
                      <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 text-lg z-10" />
                      <input
                        type="password"
                        placeholder="Enter your password"
                        required
                        minLength={isRegister ? 6 : undefined}
                        value={formData.password}
                        onChange={handleChange('password')}
                        className="w-full h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 pl-14 pr-5 text-white placeholder-white/60 focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  {isRegister && (
                    <div className="mb-6">
                      <div className="relative">
                        <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 text-lg z-10" />
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          required
                          minLength={6}
                          value={formData.confirmPassword}
                          onChange={handleChange('confirmPassword')}
                          className="w-full h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 pl-14 pr-5 text-white placeholder-white/60 focus:outline-none focus:border-gold-500"
                        />
                      </div>
                    </div>
                  )}

                  {error && (
                    <p className="text-red-300 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2.5 text-sm mb-5 text-center">
                      {error}
                    </p>
                  )}

                  {/* Button */}
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
                      transition-all
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    {submitting ? (isRegister ? 'Creating Account...' : 'Logging in...') : (isRegister ? 'Create Account' : 'Login')}
                    {!submitting && <FaArrowRight />}
                  </button>
                </form>

                {/* Toggle */}
                <div className="text-center mt-8">

                  {!isRegister ? (
                    <>
                      <p className="text-white/80">
                        Don't have an account?
                      </p>

                      <button
                        onClick={() => switchMode(true)}
                        className="text-gold-500 font-semibold hover:text-white"
                      >
                        Register Now
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-white/80">
                        Already have an account?
                      </p>

                      <button
                        onClick={() => switchMode(false)}
                        className="text-gold-500 font-semibold hover:text-white"
                      >
                        Back to Login
                      </button>
                    </>
                  )}

                </div>
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}
