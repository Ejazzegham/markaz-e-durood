'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaHeart, FaUser, FaLock, FaCheckCircle,  FaArrowLeft, FaHands, FaListUl } from 'react-icons/fa'
import { DUROOD_CATEGORIES, DUROOD_CATEGORY_OTHER } from '@/constants/duroodCategories'
import PremiumSelect from '@/components/ui/PremiumSelect'

export default function SubmitDurood() {
  const [formData, setFormData] = useState({ name: '', count: '', anonymous: false })
  const [category, setCategory] = useState<string>(DUROOD_CATEGORIES[6]) // "Durood" — sensible default
  const [otherCategory, setOtherCategory] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // This page is open to everyone — guests can type any name they like.
  // If the visitor happens to be signed in, prefill their account name so
  // they don't have to retype it (they can still tick "submit anonymously"
  // if they don't want it shown publicly).
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user?.name) {
          setFormData((prev) => (prev.name ? prev : { ...prev, name: data.user.name }))
        }
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const count = parseInt(formData.count, 10)
    if (!count || count < 1) {
      setError('Please enter a valid number of Durood.')
      return
    }

    if (category === DUROOD_CATEGORY_OTHER && !otherCategory.trim()) {
      setError('Please tell us which Surah/Durood you recited.')
      return
    }

    const duroodType = category === DUROOD_CATEGORY_OTHER ? otherCategory.trim() : category

    setSubmitting(true)
    try {
      const res = await fetch('/api/durood/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: formData.anonymous ? undefined : formData.name || undefined,
          duroodCount: count,
          duroodType,
          isAnonymous: formData.anonymous,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not submit. Please try again.')
        return
      }
      setFormData({ name: '', count: '', anonymous: false })
      setCategory(DUROOD_CATEGORIES[6])
      setOtherCategory('')
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
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
        lg:h-[600px]
        rounded-3xl
        lg:rounded-[25px]
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

      <div className="absolute inset-0 bg-black/60 lg:bg-black/10" />

      <div className="relative z-10 flex items-center justify-center lg:justify-end px-5 py-10 sm:px-8 lg:px-0 lg:py-0 lg:h-full">

        <div className="w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[520px] lg:mr-16">

           <Link
                         href="/"
                         className="inline-flex items-center gap-2 text-gold-500 hover:text-white mb-6"
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

              <FaCheckCircle className="text-6xl text-gold-500 mx-auto mb-4" />

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
      className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 z-20 pointer-events-none"
    />

    <input
      type="text"
      value={formData.name}
      disabled={formData.anonymous}
      onChange={(e) =>
        setFormData({
          ...formData,
          name: e.target.value,
        })
      }
      placeholder="Your Name"
      required={!formData.anonymous}
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
        focus:border-gold-500
      "
    />
  </div>
</div>

{/* Category */}
<div className="mb-5">
  <PremiumSelect
    variant="pill"
    icon={<FaListUl size={16} />}
    value={category}
    onChange={setCategory}
    options={[
      ...DUROOD_CATEGORIES.map((c) => ({ value: c, label: c })),
      { value: DUROOD_CATEGORY_OTHER, label: `${DUROOD_CATEGORY_OTHER} (specify below)` },
    ]}
  />

  {category === DUROOD_CATEGORY_OTHER && (
    <input
      type="text"
      value={otherCategory}
      onChange={(e) => setOtherCategory(e.target.value)}
      placeholder="e.g. Surah Kahf, Durood-e-Ibrahimi..."
      required
      className="
        w-full
        h-14
        rounded-full
        bg-white/10
        backdrop-blur-md
        border border-white/20
        px-5
        mt-3
        text-white
        placeholder-white/60
        focus:outline-none
        focus:border-gold-500
      "
    />
  )}
</div>

{/* Count */}
<div className="mb-5">
  <div className="relative">
    <FaHands
      size={18}
      className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500 z-20 pointer-events-none"
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
        focus:border-gold-500
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
                  <FaLock className="text-gold-500" />
                  Submit anonymously
                </label>
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
                <FaHeart />
                {submitting ? 'Submitting...' : 'Submit Durood'}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  </div>
)
}