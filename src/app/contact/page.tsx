'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaPaperPlane, 
  FaClock,
  FaMosque,
  FaGlobe,
  FaUser,
  FaComment,
  FaCheckCircle,
  FaArrowLeft
} from 'react-icons/fa'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate form submission
    setTimeout(() => {
      setSubmitted(true)
      setLoading(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
      setTimeout(() => setSubmitted(false), 5000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1a10] via-[#112c1b] to-[#0a1a10] relative overflow-hidden">
      
      {/* ============================================
          PREMIUM BACKGROUND LAYERS
          ============================================ */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 80px, #D4AF37 80px, #D4AF37 81px),
            repeating-linear-gradient(90deg, transparent, transparent 80px, #D4AF37 80px, #D4AF37 81px),
            repeating-linear-gradient(45deg, transparent, transparent 160px, rgba(212, 175, 55, 0.3) 160px, rgba(212, 175, 55, 0.3) 161px),
            repeating-linear-gradient(-45deg, transparent, transparent 160px, rgba(212, 175, 55, 0.3) 160px, rgba(212, 175, 55, 0.3) 161px)
          `
        }} />
      </div>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '300px 300px'
      }} />

      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/3 rounded-full blur-[150px]"></div>
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-[#D4AF37]/10 rounded-tl-2xl"></div>
      <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-[#D4AF37]/10 rounded-tr-2xl"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-[#D4AF37]/10 rounded-bl-2xl"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-[#D4AF37]/10 rounded-br-2xl"></div>

      {/* ============================================
          CONTENT
          ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ============================================
            TITLE BAR
            ============================================ */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-[#D4AF37]/5 rounded-2xl blur-2xl"></div>
          
          <div className="relative bg-gradient-to-r from-[#112c1b]/90 via-[#1a4d2e]/80 to-[#112c1b]/90 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl overflow-hidden shadow-2xl shadow-[#D4AF37]/5">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 md:px-8 py-4">
              <div className="flex items-center gap-4">
                <Link 
                  href="/" 
                  className="group relative p-2.5 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 text-[#D4AF37] transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FaArrowLeft className="relative group-hover:-translate-x-1 transition-transform text-sm" />
                </Link>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-xl blur-lg"></div>
                    <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 border border-[#D4AF37]/30">
                      <FaEnvelope className="text-[#D4AF37] text-xl" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      <span className="text-white">Contact</span>
                      <span className="text-[#D4AF37]"> Us</span>
                    </h1>
                    <p className="text-gray-400 text-xs hidden sm:block">
                      We hear your voice. Get in touch with us.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaClock className="text-[#D4AF37] text-xs" />
                  <span className="text-gray-300 text-xs font-medium">Mon - Sun: 9:00 AM - 9:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            MAIN CONTENT - 2 COLUMN LAYOUT
            ============================================ */}
        <div className="grid lg:grid-cols-5 gap-8">
          
          {/* ============================================
              LEFT SIDE - CONTACT INFO (2 columns)
              ============================================ */}
          <div className="lg:col-span-2 space-y-6">
            {/* Location Card */}
            <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaMosque className="text-[#D4AF37] text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Location</h3>
                  <p className="text-gray-300 text-sm">
                    MASJID-E-HUSSAIN<br />
                    Darbar Hazrat Sultan Bahu<br />
                    Jung, Pakistan
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaEnvelope className="text-[#D4AF37] text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <a href="mailto:markaz.e.durood@gmail.com" className="text-[#D4AF37] text-sm hover:underline">
                    markaz.e.durood@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Phone & Web Card */}
            <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaPhone className="text-[#D4AF37] text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone & Web</h3>
                  <p className="text-gray-300 text-sm">
                    Tel: <a href="tel:03014391609" className="text-[#D4AF37] hover:underline">0301-4391609</a>
                  </p>
                  <p className="text-gray-300 text-sm">
                    Web: <a href="https://www.markaz-e-durood.com" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">
                      www.markaz-e-durood.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37]/40 transition-all">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaClock className="text-[#D4AF37] text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Working Hours</h3>
                  <p className="text-gray-300 text-sm">
                    Mon - Sun: 9:00 AM - 9:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================
              RIGHT SIDE - CONTACT FORM (3 columns)
              ============================================ */}
          <div className="lg:col-span-3">
            <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-6 md:p-8 hover:border-[#D4AF37]/40 transition-all">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaPaperPlane className="text-[#D4AF37] text-sm" />
                </div>
                <h2 className="text-xl font-bold text-white">Send us a Message</h2>
              </div>

              {submitted ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
                  <FaCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-400 text-sm">Thank you for reaching out. We'll get back to you soon.</p>
                  <p className="text-[#D4AF37] text-xs mt-3">InshaAllah, your message has been received.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-300 text-sm block mb-1.5 flex items-center gap-2">
                        <FaUser className="text-[#D4AF37] text-xs" /> Your Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#0a1a10] border border-[#D4AF37]/20 rounded-lg focus:border-[#D4AF37] outline-none text-white transition"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm block mb-1.5 flex items-center gap-2">
                        <FaEnvelope className="text-[#D4AF37] text-xs" /> Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2.5 bg-[#0a1a10] border border-[#D4AF37]/20 rounded-lg focus:border-[#D4AF37] outline-none text-white transition"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm block mb-1.5 flex items-center gap-2">
                      <FaComment className="text-[#D4AF37] text-xs" /> Subject
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#0a1a10] border border-[#D4AF37]/20 rounded-lg focus:border-[#D4AF37] outline-none text-white transition"
                      placeholder="What is this about?"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm block mb-1.5 flex items-center gap-2">
                      <FaComment className="text-[#D4AF37] text-xs" /> Message
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full px-4 py-2.5 bg-[#0a1a10] border border-[#D4AF37]/20 rounded-lg focus:border-[#D4AF37] outline-none text-white transition resize-none"
                      placeholder="Write your message here..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#D4AF37] hover:bg-[#c9a030] text-green-950 font-bold py-3 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-green-950 border-t-transparent rounded-full animate-spin"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane /> Send Message
                      </>
                    )}
                  </button>

                  <p className="text-center text-gray-500 text-[10px]">
                    <FaClock className="inline mr-1" />
                    We respond within 24 hours, InshaAllah
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* ============================================
            BOTTOM DECORATION
            ============================================ */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]/30"></div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-lg shadow-[#D4AF37]/50"></div>
            <div className="w-1 h-1 rounded-full bg-[#D4AF37]/40"></div>
          </div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]/30"></div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-600 tracking-wider">
            <FaMosque className="inline mr-1.5 text-[#D4AF37]/30 text-[10px]" />
            We hear your voice. Reach out to us anytime.
          </p>
        </div>

      </div>
    </div>
  )
}