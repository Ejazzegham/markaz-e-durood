'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaDonate,
  FaUser,
  FaEnvelope,
  FaArrowLeft,
  FaCheckCircle,
  FaLock
} from 'react-icons/fa'

export default function DonatePage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    message: '',
    anonymous: false,
  })

  // This page is open to everyone — no account required. If the visitor
  // happens to be signed in, prefill their account name/email so they don't
  // have to retype it (they can still tick "donate anonymously").
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setFormData((prev) => ({
            ...prev,
            name: prev.name || data.user.name || '',
            email: prev.email || data.user.email || '',
          }))
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const amount = parseFloat(formData.amount)
    if (!amount || amount <= 0) {
      setError('Please enter a valid donation amount.')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/donations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: formData.anonymous ? undefined : formData.name || undefined,
          email: formData.email || undefined,
          amount,
          message: formData.message || undefined,
          isAnonymous: formData.anonymous,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not submit. Please try again.')
        return
      }
      setFormData({ name: formData.name, email: formData.email, amount: '', message: '', anonymous: false })
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 4000)
    } catch {
      setError('Could not submit. Please try again.')
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
          lg:h-[680px]
          rounded-3xl
          lg:rounded-[25px]
          overflow-hidden
          shadow-[0_25px_80px_rgba(0,0,0,0.45)]
        "
      >
        {/* Background Image */}
        <img
          src="/donation-bg.jpg"
          alt="Donate"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60 lg:bg-black/20" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center lg:justify-end px-5 py-10 sm:px-8 lg:px-0 lg:py-0 lg:h-full overflow-y-auto">

          <div className="w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[520px] lg:mr-16">

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gold-500 hover:text-white mb-6"
            >
              <FaArrowLeft />
              Back
            </Link>

            <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">
              Support Markaz-e-Durood
            </h1>

            <p className="text-white/80 mb-8">
              Help us spread Durood & Salam worldwide.
              Every contribution supports our mission — no account needed.
            </p>

            {submitted ? (
              <div className="text-center py-12">

                <FaCheckCircle className="text-6xl text-gold-500 mx-auto mb-4" />

                <h2 className="text-3xl font-bold text-white mb-3">
                  Thank You!
                </h2>

                <p className="text-white/80">
                  Your donation request has been received. Our team will be in touch to complete the contribution.
                </p>

              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="mb-4">
                  <div className="relative">

                    <FaUser
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 text-xl z-20 drop-shadow-[0_0_2px_rgba(212,175,55,0.6)]"/>

                    <input
                      type="text"
                      placeholder="Full Name"
                      disabled={formData.anonymous}
                      required={!formData.anonymous}
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value
                        })
                      }
                      className="
                        w-full
                        h-14
                        rounded-full
                        bg-white/10
                        backdrop-blur-md
                        border
                        border-white/20
                        pl-14
                        pr-5
                        text-white
                        placeholder-white/60
                        focus:outline-none
                        focus:border-gold-500
                        disabled:opacity-50
                      "
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <div className="relative">

                    <FaEnvelope
               className=" absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 text-xl z-20 drop-shadow-[0_0_2px_rgba(212,175,55,0.6)]"/>

                    <input
                      type="email"
                      placeholder="Email Address (optional)"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value
                        })
                      }
                      className="
                        w-full
                        h-14
                        rounded-full
                        bg-white/10
                        backdrop-blur-md
                        border
                        border-white/20
                        pl-14
                        pr-5
                        text-white
                        placeholder-white/60
                        focus:outline-none
                        focus:border-gold-500
                      "
                    />
                  </div>
                </div>


                {/* Custom Amount */}
                <div className="mb-4">
                  <input
  type="number"
  min="1"
  step="1"
  placeholder="Donation Amount (PKR)"
  required
  value={formData.amount}
  onChange={(e) =>
    setFormData({
      ...formData,
      amount: e.target.value
    })
  }
  className="
    w-full
    h-14
    rounded-full
    bg-white/10
    backdrop-blur-md
    border
    border-white/20
    px-6
    text-white
    placeholder-white/60
    focus:outline-none
    focus:border-gold-500
    appearance-none
    [-moz-appearance:textfield]
  "
/>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <textarea
                    rows={3}
                    placeholder="Message (Optional)"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value
                      })
                    }
                    className="
                      w-full
                      rounded-3xl
                      bg-white/10
                      backdrop-blur-md
                      border
                      border-white/20
                      p-4
                      text-white
                      placeholder-white/60
                      resize-none
                      focus:outline-none
                      focus:border-gold-500
                    "
                  />
                </div>

                {/* Anonymous */}
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    mb-4
                    bg-white/10
                    backdrop-blur-md
                    border
                    border-white/20
                    rounded-full
                    px-6
                    py-4
                  "
                >
                  <input
                    type="checkbox"
                    checked={formData.anonymous}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        anonymous: e.target.checked
                      })
                    }
                    className="w-5 h-5"
                  />

                  <label className="text-white flex items-center gap-2">
                    <FaLock className="text-gold-500" />
                    Donate anonymously
                  </label>
                </div>

                {error && (
                  <p className="text-red-300 bg-red-500/10 border border-red-500/30 rounded-full px-5 py-2.5 text-sm mb-4 text-center">
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
                  <FaDonate />
                  {submitting ? 'Submitting...' : 'Donate Now'}
                </button>

              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}
