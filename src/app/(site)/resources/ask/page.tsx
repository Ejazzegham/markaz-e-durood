'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  FaQuestionCircle, 
  FaArrowLeft, 
  FaPaperPlane, 
  FaUser, 
  FaEnvelope, 
  FaCheckCircle,
  FaClock,
  FaSearch,
  FaFilter,
  FaEye,
  FaHeart
} from 'react-icons/fa'

export default function AskAndLearn() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    question: '',
    category: 'General'
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    fetch('/api/content/faq')
      .then((res) => res.json())
      .then((data) => {
        const items = (data.items || []).map((f: any) => ({
          ...f,
          name: 'Community Question',
          isAnswered: true,
          date: new Date(f.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }))
        setQuestions(items)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')

    try {
      const res = await fetch('/api/content/faq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: formData.question, category: formData.category }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || 'Could not submit your question. Please try again.')
        return
      }

      setSubmitted(true)
      // Show it locally right away as pending — it won't appear publicly
      // for other visitors until an admin reviews and answers it.
      setQuestions([
        {
          id: data.item.id,
          name: formData.name || 'You',
          question: formData.question,
          answer: '',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          isAnswered: false,
          category: formData.category,
        },
        ...questions,
      ])
      setFormData({ name: '', email: '', question: '', category: 'General' })
      setTimeout(() => setSubmitted(false), 3000)
    } catch {
      setSubmitError('Could not submit your question. Please try again.')
    }
  }

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          q.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get unique categories
  const categories = ['All', ...new Set(questions.map(q => q.category))]

  // Toggle expand answer
  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-850 to-green-950 flex items-center justify-center">
        <div className="text-gold-500 text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-850 to-green-950 relative overflow-hidden">
      
      {/* ============================================
          BACKGROUND LAYERS
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
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/3 rounded-full blur-[150px]"></div>
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-gold-500/10 rounded-tl-2xl"></div>
      <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-gold-500/10 rounded-tr-2xl"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-gold-500/10 rounded-bl-2xl"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-gold-500/10 rounded-br-2xl"></div>

      {/* ============================================
          CONTENT
          ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ============================================
            TITLE BAR
            ============================================ */}
        <div className="relative mb-10">
          <div className="absolute inset-0 bg-gold-500/5 rounded-2xl blur-2xl"></div>
          
          <div className="relative bg-gradient-to-r from-green-850/90 via-green-900/80 to-green-850/90 backdrop-blur-xl border border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-gold-500/5">
            
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 md:px-8 py-4">
              
              <div className="flex items-center gap-4">
                <Link 
                  href="/" 
                  className="group relative p-2.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/20 hover:border-gold-500/40 text-gold-500 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gold-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FaArrowLeft className="relative group-hover:-translate-x-1 transition-transform text-sm" />
                </Link>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gold-500/20 rounded-xl blur-lg"></div>
                    <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-gold-500/30 to-gold-500/10 border border-gold-500/30">
                      <FaQuestionCircle className="text-gold-500 text-xl" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      <span className="text-white">Ask &</span>
                      <span className="text-gold-500"> Learn</span>
                    </h1>
                    <p className="text-gray-400 text-xs hidden sm:block">
                      Submit your questions and receive authentic Islamic guidance
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20">
                  <FaCheckCircle className="text-gold-500 text-xs" />
                  <span className="text-gray-300 text-xs font-medium">{questions.filter(q => q.isAnswered).length} Answered</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gold-500/10 border border-gold-500/20">
                  <FaHeart className="text-gold-500 text-xs" />
                  <span className="text-gray-300 text-xs font-medium">Q&A</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* ============================================
              LEFT: QUESTION FORM
              ============================================ */}
          <div className="lg:col-span-1">
            <div className="bg-green-850/80 backdrop-blur-xl border border-gold-500/20 rounded-2xl p-6 sticky top-28">
              <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <FaPaperPlane className="text-gold-500" />
                Ask a Question
              </h2>
              <p className="text-gray-400 text-sm mb-6">
                Submit your question and receive authentic Islamic guidance from scholars.
              </p>

              {submitted ? (
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 text-center">
                  <FaCheckCircle className="text-4xl text-green-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold">Question Submitted!</h3>
                  <p className="text-gray-400 text-sm">We'll get back to you with authentic guidance.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-gray-300 text-sm block mb-1.5 flex items-center gap-2">
                      <FaUser className="text-gold-500" /> Your Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-green-950 border border-gold-500/20 rounded-lg focus:border-gold-500 outline-none text-white transition"
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm block mb-1.5 flex items-center gap-2">
                      <FaEnvelope className="text-gold-500" /> Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-2.5 bg-green-950 border border-gold-500/20 rounded-lg focus:border-gold-500 outline-none text-white transition"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm block mb-1.5 flex items-center gap-2">
                      <FaFilter className="text-gold-500" /> Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="premium-select w-full px-4 py-2.5 bg-green-950 border border-gold-500/20 rounded-lg focus:border-gold-500 outline-none text-white transition"
                    >
                      <option value="General">General</option>
                      <option value="Durood">Durood</option>
                      <option value="Benefits">Benefits</option>
                      <option value="Fiqh">Fiqh</option>
                      <option value="Seerah">Seerah</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-300 text-sm block mb-1.5 flex items-center gap-2">
                      <FaQuestionCircle className="text-gold-500" /> Your Question
                    </label>
                    <textarea
                      rows={4}
                      value={formData.question}
                      onChange={(e) => setFormData({...formData, question: e.target.value})}
                      className="w-full px-4 py-2.5 bg-green-950 border border-gold-500/20 rounded-lg focus:border-gold-500 outline-none text-white transition resize-none"
                      placeholder="Ask your Islamic question here..."
                      required
                    />
                  </div>

                  {submitError && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-lg px-3 py-2">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gold-500 hover:bg-gold-600 text-green-950 font-bold py-2.5 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <FaPaperPlane /> Submit Question
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ============================================
              RIGHT: QUESTIONS LIST
              ============================================ */}
          <div className="lg:col-span-2">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-2.5 bg-green-850/80 border border-gold-500/20 rounded-xl focus:border-gold-500 outline-none text-white transition"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="premium-select pl-4 pr-4 py-2.5 bg-green-850/80 border border-gold-500/20 rounded-xl focus:border-gold-500 outline-none text-white transition"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
                  <FaClock className="animate-pulse mr-2" /> Loading questions...
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="bg-green-850/80 border border-gold-500/20 rounded-xl p-8 text-center">
                  <FaQuestionCircle className="text-4xl text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">No questions found.</p>
                </div>
              ) : (
                filteredQuestions.map((q) => (
                  <div 
                    key={q.id} 
                    className="bg-green-850/80 border border-gold-500/20 rounded-xl p-5 hover:border-gold-500/40 transition-all duration-300"
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-1.5">
                          <span className="text-sm font-semibold text-white">{q.name}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FaClock className="text-[10px]" /> {q.date}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            q.isAnswered 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {q.isAnswered ? '✓ Answered' : '⏳ Pending'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-500">
                            {q.category}
                          </span>
                        </div>
                        <p className="text-white text-sm leading-relaxed">{q.question}</p>
                      </div>
                      <button
                        onClick={() => toggleExpand(q.id)}
                        className="flex-shrink-0 px-3 py-1 text-xs text-gold-500 hover:bg-gold-500/10 rounded-lg transition"
                      >
                        {expandedId === q.id ? 'Hide' : 'View'}
                      </button>
                    </div>

                    {/* Answer (expanded) */}
                    {expandedId === q.id && (
                      <div className="mt-4 pt-4 border-t border-gold-500/10">
                        {q.isAnswered ? (
                          <div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                              <span className="text-gold-500 font-semibold">Answer: </span>
                              {q.answer}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                            <p className="text-yellow-400 text-sm">
                              <FaClock className="inline mr-2" />
                              This question is being reviewed. We'll answer it soon!
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ============================================
            BOTTOM DECORATION
            ============================================ */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-gold-500/30"></div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-gold-500/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gold-500 shadow-lg shadow-gold-500/50"></div>
            <div className="w-1 h-1 rounded-full bg-gold-500/40"></div>
          </div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-gold-500/30"></div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-600 tracking-wider">
            <FaCheckCircle className="inline mr-1.5 text-gold-500/30 text-[10px]" />
            All answers are based on authentic Islamic sources
          </p>
        </div>

      </div>
    </div>
  )
}