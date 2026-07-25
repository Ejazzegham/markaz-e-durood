'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowRight
} from 'react-icons/fa'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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

            <form onSubmit={handleSubmit}>

              <div className="mb-4 relative">
                <FaUser className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full h-14 rounded-full bg-white/10 border border-white/20 pl-14 pr-5 text-white"
                />
              </div>

              <div className="mb-4 relative">
                <FaEnvelope className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full h-14 rounded-full bg-white/10 border border-white/20 pl-14 pr-5 text-white"
                />
              </div>

              <div className="mb-4 relative">
                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" />
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full h-14 rounded-full bg-white/10 border border-white/20 pl-14 pr-5 text-white"
                />
              </div>

              <div className="mb-6 relative">
                <FaLock className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500" />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full h-14 rounded-full bg-white/10 border border-white/20 pl-14 pr-5 text-white"
                />
              </div>

              <button
                type="submit"
                className="
                  w-full
                  h-14
                  rounded-full
                  bg-gold-500
                  hover:bg-gold-600
                  text-black
                  font-bold
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                Create Account
                <FaArrowRight />
              </button>

            </form>

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

          </div>

        </div>

      </div>

    </div>
  )
}