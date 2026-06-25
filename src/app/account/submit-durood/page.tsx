'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaHeart, FaUser, FaLock, FaCheckCircle,  FaArrowLeft, FaHands } from 'react-icons/fa'

export default function SubmitDurood() {
  const [formData, setFormData] = useState({ name: '', count: '', anonymous: false })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

return (
  <div className="min-h-[calc(100vh-64px)] bg-[#0B3A2D] flex items-center justify-center px-6 py-10">

    <div
      className="
        relative
        w-full
        max-w-5xl
        h-[600px]
        rounded-[25px]
        overflow-hidden
        shadow-[0_25px_80px_rgba(0,0,0,0.45)]
      "
    >
      {/* Background */}
      <img
        src="/login-bg.jpg"
        alt="Submit Durood"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 h-full flex justify-end items-center">

        <div className="w-full max-w-[520px] mr-16">

           <Link
                         href="/"
                         className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-white mb-6"
                       >
                         <FaArrowLeft />
                         Back
                       </Link>

          <h1 className="text-white text-4xl md:text-5xl font-bold mb-3">
            Submit Durood
          </h1>

          <p className="text-white/80 mb-8">
            Share your blessings with the world
          </p>

          {submitted ? (
            <div className="text-center py-10">

              <FaCheckCircle className="text-6xl text-[#D4AF37] mx-auto mb-4" />

              <h2 className="text-3xl font-bold text-white mb-3">
                Thank You!
              </h2>

              <p className="text-white/80">
                Your Durood has been submitted successfully.
              </p>

            </div>
          ) : (
            <form onSubmit={handleSubmit}>

              {/* Name */}
<div className="mb-5">
  <div className="relative">
    <FaUser
      size={18}
      className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37] z-20 pointer-events-none"
    />

    <input
      type="text"
      value={formData.name}
      onChange={(e) =>
        setFormData({
          ...formData,
          name: e.target.value,
        })
      }
      placeholder="Your Name"
      required
      className="
        w-full
        h-14
        rounded-full
        bg-white/10
        backdrop-blur-md
        border border-white/20
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

{/* Count */}
<div className="mb-5">
  <div className="relative">
    <FaHands
      size={18}
      className="absolute left-5 top-1/2 -translate-y-1/2 text-[#D4AF37] z-20 pointer-events-none"
    />

    <input
      type="number"
      value={formData.count}
      onChange={(e) =>
        setFormData({
          ...formData,
          count: e.target.value,
        })
      }
      placeholder="Number of Durood"
      min="1"
      required
      className="
        w-full
        h-14
        rounded-full
        bg-white/10
        backdrop-blur-md
        border border-white/20
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

              {/* Anonymous */}
              <div
                className="
                  flex
                  items-center
                  gap-3
                  mb-6
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
                  <FaLock className="text-[#D4AF37]" />
                  Submit anonymously
                </label>
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
                <FaHeart />
                Submit Durood
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  </div>
)
}