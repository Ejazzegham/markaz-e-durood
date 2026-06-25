'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FaDonate,
  FaUser,
  FaEnvelope,
  FaArrowLeft,
  FaCheckCircle
} from 'react-icons/fa'

export default function DonatePage() {
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    setSubmitted(true)

    setTimeout(() => {
      setSubmitted(false)
    }, 3000)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B3A2D] flex items-center justify-center px-6 py-10">

      <div
        className="
          relative
          w-full
          max-w-5xl
          h-[650px]
          rounded-[25px]
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
        <div className="absolute inset-0 bg-black/20" />

        {/* Content */}
        <div className="relative z-10 h-full flex justify-end items-center">

          <div className="w-full max-w-[520px] mr-16">

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white mb-6"
            >
              <FaArrowLeft />
              Back
            </Link>

            <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">
              Support Markaz-e-Durood
            </h1>

            <p className="text-white/80 mb-8">
              Help us spread Durood & Salam worldwide.
              Every contribution supports our mission.
            </p>

            {submitted ? (
              <div className="text-center py-12">

                <FaCheckCircle className="text-6xl text-[#D4AF37] mx-auto mb-4" />

                <h2 className="text-3xl font-bold text-white mb-3">
                  Thank You!
                </h2>

                <p className="text-white/80">
                  Your donation request has been received.
                </p>

              </div>
            ) : (
              <form onSubmit={handleSubmit}>

                {/* Name */}
                <div className="mb-4">
                  <div className="relative">

                    <FaUser
              className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37] text-xl z-20 drop-shadow-[0_0_2px_rgba(212,175,55,0.6)]"/>

                    <input
                      type="text"
                      placeholder="Full Name"
                      required
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
                        focus:border-[#D4AF37]
                      "
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <div className="relative">

                    <FaEnvelope
               className=" absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37] text-xl z-20 drop-shadow-[0_0_2px_rgba(212,175,55,0.6)]"/>

                    <input
                      type="email"
                      placeholder="Email Address"
                      required
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
                        focus:border-[#D4AF37]
                      "
                    />
                  </div>
                </div>


                {/* Custom Amount */}
                <div className="mb-4">
                  <input
  type="number"
  placeholder="Donation Amount"
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
    focus:border-[#D4AF37]
    appearance-none
    [-moz-appearance:textfield]
  "
/>
                </div>

                {/* Message */}
                <div className="mb-6">
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
                      focus:border-[#D4AF37]
                    "
                  />
                </div>

                <button
                  type="submit"
                  className="
                    w-full
                    h-14
                    rounded-full
                    bg-[#D4AF37]
                    hover:bg-[#c79f22]
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
                  Donate Now
                </button>

              </form>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}