'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  FaDonate,
  FaUser,
  FaEnvelope,
  FaArrowLeft,
  FaCheckCircle,
  FaLock,
  FaCopy,
  FaCheck,
} from 'react-icons/fa'

type BankId = 'pk' | 'uk'

interface BankAccount {
  id: BankId
  flag: string
  countryLabel: string
  currency: string
  currencySymbol: string
  quickAmounts: number[]
  fields: { label: string; value: string }[]
}

// Exact values as provided by the trust — numbers/codes are kept
// byte-for-byte as given; only the bank display name's casing is tidied
// up for readability. Kept in sync with BANK_ACCOUNTS in the mobile app's
// DonateScreen.tsx so both platforms show identical account details.
const BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'pk',
    flag: '🇵🇰',
    countryLabel: 'Pakistan',
    currency: 'PKR',
    currencySymbol: 'Rs',
    quickAmounts: [500, 1000, 2500, 5000, 10000],
    fields: [
      { label: 'Account Name', value: 'Hazrat Sultan Bahu Trust' },
      { label: 'Bank Name', value: 'United Bank' },
      { label: 'Branch', value: 'Abdulla Pur, Faisalabad' },
      { label: 'Branch Code', value: '1353' },
      { label: 'Account No.', value: '211024233' },
    ],
  },
  {
    id: 'uk',
    flag: '🌍',
    countryLabel: 'International',
    currency: 'GBP',
    currencySymbol: '£',
    quickAmounts: [10, 25, 50, 100, 250],
    fields: [
      { label: 'Account Title', value: 'HSBT Current' },
      { label: 'Account Name', value: 'Hazrat Sultan Bahu Trust' },
      { label: 'Bank', value: 'NatWest' },
      { label: 'Sort Code', value: '010085' },
      { label: 'Account No.', value: '14053837' },
      { label: 'Charity No.', value: '292697' },
      { label: 'IBAN', value: 'GB07NWBK01008514053837' },
    ],
  },
]

export default function DonatePage() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [selectedBank, setSelectedBank] = useState<BankId | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    message: '',
    anonymous: false,
  })

  const activeBank = BANK_ACCOUNTS.find((b) => b.id === selectedBank) ?? null

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

  const handleSelectBank = (id: BankId) => {
    setSelectedBank(id)
    setFormData((prev) => ({ ...prev, amount: '' }))
    setError('')
  }

  const handleCopy = async (fieldKey: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
      setCopiedField(fieldKey)
      setTimeout(() => setCopiedField((prev) => (prev === fieldKey ? null : prev)), 2000)
    } catch {
      // Clipboard access can fail (e.g. insecure context) — the value is
      // still visible and selectable on the page either way.
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!activeBank) {
      setError('Please choose which account you sent your donation to.')
      return
    }

    const amount = parseFloat(formData.amount)
    if (!amount || amount <= 0) {
      setError('Please enter a valid donation amount.')
      return
    }

    setSubmitting(true)
    try {
      // Which bank account the transfer went to has no matching field on
      // the server record, so — same as the mobile app — that detail is
      // folded into the message text instead of an unrecognized top-level
      // key.
      const bankNote = `Sent via bank transfer to the ${activeBank.countryLabel} account (${activeBank.currency} ${activeBank.currencySymbol}${amount}).`
      const fullMessage = [bankNote, formData.message.trim()].filter(Boolean).join('\n\n')

      const res = await fetch('/api/donations/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorName: formData.anonymous ? undefined : formData.name || undefined,
          email: formData.email || undefined,
          amount,
          currency: activeBank.currency,
          message: fullMessage,
          isAnonymous: formData.anonymous,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not submit. Please try again.')
        return
      }
      setFormData({ name: formData.name, email: formData.email, amount: '', message: '', anonymous: false })
      setSelectedBank(null)
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
          lg:min-h-[680px]
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
        <div className="absolute inset-0 bg-black/60 lg:bg-black/25" />

        {/* Content */}
        <div className="relative z-10 flex items-center justify-center lg:justify-end px-5 py-10 sm:px-8 lg:px-0 lg:py-14">

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
                  Your donation has been recorded. Our team will confirm receipt of your transfer shortly.
                </p>

              </div>
            ) : (
              <>
                {/* Step 1: choose which account to send to */}
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider mb-3">
                  Choose an account to donate to
                </p>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  {BANK_ACCOUNTS.map((b) => {
                    const active = b.id === selectedBank
                    return (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleSelectBank(b.id)}
                        className={`
                          rounded-2xl border px-4 py-4 text-center transition-all backdrop-blur-md
                          ${active
                            ? 'bg-gold-500/15 border-gold-500'
                            : 'bg-white/10 border-white/20 hover:border-white/40'}
                        `}
                      >
                        <div className="text-2xl mb-1">{b.flag}</div>
                        <div className={`text-sm font-bold ${active ? 'text-white' : 'text-white/80'}`}>
                          {b.countryLabel}
                        </div>
                        <div className={`text-[11px] mt-0.5 ${active ? 'text-gold-500' : 'text-white/50'}`}>
                          {b.currency}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {!activeBank && (
                  <p className="text-white/50 text-sm mb-6">
                    Select an account above to see its bank details and continue.
                  </p>
                )}

                {activeBank && (
                  <form onSubmit={handleSubmit}>

                    {/* Bank details */}
                    <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-gold-500/30 p-4 mb-5">
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-white/10">
                        <span className="text-white font-bold text-sm">
                          {activeBank.flag} {activeBank.countryLabel} Account
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedBank(null)}
                          className="text-gold-500 hover:text-white text-xs font-semibold"
                        >
                          Change
                        </button>
                      </div>
                      <div className="space-y-2.5">
                        {activeBank.fields.map((f) => {
                          const fieldKey = `${activeBank.id}-${f.label}`
                          const isCopied = copiedField === fieldKey
                          return (
                            <div key={f.label} className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-white/50 text-[10px] uppercase tracking-wide">
                                  {f.label}
                                </div>
                                <div className="text-white text-sm font-semibold break-all">
                                  {f.value}
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleCopy(fieldKey, f.value)}
                                aria-label={`Copy ${f.label}`}
                                className={`
                                  shrink-0 w-8 h-8 rounded-lg border flex items-center justify-center transition-colors
                                  ${isCopied
                                    ? 'bg-green-500/15 border-green-400/40 text-green-300'
                                    : 'bg-gold-500/10 border-gold-500/30 text-gold-500 hover:bg-gold-500/20'}
                                `}
                              >
                                {isCopied ? <FaCheck size={12} /> : <FaCopy size={12} />}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>

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

                    {/* Quick amounts */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {activeBank.quickAmounts.map((a) => {
                        const selected = formData.amount === String(a)
                        return (
                          <button
                            key={a}
                            type="button"
                            onClick={() => setFormData({ ...formData, amount: String(a) })}
                            className={`
                              px-4 py-2 rounded-full text-xs font-bold border transition-colors
                              ${selected
                                ? 'bg-gold-500 border-gold-500 text-black'
                                : 'bg-white/10 border-white/20 text-white/80 hover:border-white/40'}
                            `}
                          >
                            {activeBank.currencySymbol}{a.toLocaleString()}
                          </button>
                        )
                      })}
                    </div>

                    {/* Custom Amount */}
                    <div className="mb-4">
                      <input
      type="number"
      min="1"
      step="1"
      placeholder={`Donation Amount (${activeBank.currency})`}
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
                      {submitting ? 'Submitting...' : "I've Sent This Donation"}
                    </button>

                    <p className="text-white/40 text-[11px] text-center mt-4 leading-relaxed">
                      Send your transfer to the account above using your own bank, then let us know
                      here so our team can confirm receipt.
                    </p>

                  </form>
                )}
              </>
            )}

          </div>

        </div>

      </div>

    </div>
  )
}
