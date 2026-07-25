'use client'

import AudioPlayer from '@/components/AudioPlayer'
import TopSendersLeaderboard from '@/components/home/TopSendersLeaderboard'
import NaatVideoSection from '@/components/home/NaatVideoSection'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { 
  FaQuran, 
  FaHeart, 
  FaGlobe,
  FaBookOpen,
  FaHeadphones,
  FaVideo,
  FaFilePdf,
  FaBlog,
  FaQuestionCircle,
  FaHands,
  FaArrowRight,
  FaUsers,
  FaFlag,
  FaCheckCircle,
  FaPlayCircle,
  FaMosque,
  FaFeatherAlt,
  FaDonate
} from 'react-icons/fa'

import { MdLibraryMusic, MdMenuBook } from 'react-icons/md'
import { GiPrayer, GiPearlNecklace, GiBookCover } from 'react-icons/gi'

// Animated stat — counts up from 0 to its target the moment it scrolls
// into view, then holds. Gives the impact numbers a "live" feel instead
// of sitting there as static text.
function AnimatedStat({
  target,
  suffix,
  label,
}: {
  target: number
  suffix: string
  label: string
}) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRun.current) {
            hasRun.current = true
            const duration = 1800
            const start = performance.now()

            const tick = (now: number) => {
              const progress = Math.min((now - start) / duration, 1)
              const eased = 1 - Math.pow(1 - progress, 3)
              setCount(Math.round(target * eased))
              if (progress < 1) requestAnimationFrame(tick)
            }
            requestAnimationFrame(tick)
          }
        })
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return (
    <div ref={ref}>
      <div className="text-4xl font-bold text-yellow-400">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-green-300 text-sm">{label}</div>
    </div>
  )
}

export default function Home() {
  // Live Durood Counter State — real total, polled periodically
  const [liveDuroodCount, setLiveDuroodCount] = useState(0)
  const [justAdded, setJustAdded] = useState(0)
  const [tickKey, setTickKey] = useState(0)

  useEffect(() => {
    const fetchTotal = () => {
      fetch('/api/durood/stats')
        .then((res) => res.json())
        .then((data) => {
          setLiveDuroodCount((prev) => {
            const next = data.total || 0
            if (prev && next > prev) {
              setJustAdded(next - prev)
              setTickKey((k) => k + 1)
            }
            return next
          })
        })
        .catch(() => {})
    }

    fetchTotal()
    const interval = setInterval(fetchTotal, 20000) // refresh every 20s
    return () => clearInterval(interval)
  }, [])

  // Fade the "+xx" indicator out after each tick
  useEffect(() => {
    if (justAdded === 0) return
    const fade = setTimeout(() => setJustAdded(0), 1400)
    return () => clearTimeout(fade)
  }, [tickKey])

  // Slide strip — runs as a continuous CSS marquee (see .slides-marquee-*
  // in globals.css), so no JS timer or active-slide state is needed.
  const slides = [
    { id: 1, image: '/slides/s1.png', title: 'Slide 1' },
    { id: 2, image: '/slides/s2.png', title: 'Slide 2' },
    { id: 3, image: '/slides/s3.png', title: 'Slide 3' },
    { id: 4, image: '/slides/s4.png', title: 'Slide 4' }
  ]

  return (
    <div className="min-h-screen">
      
      {/* Audio Player */}
      <AudioPlayer src="/audio/background-music.mp3" autoPlay={true} loop={true} />
      
      {/* Hero Section - Text on Left, Image on Right */}
      <section className="relative min-h-[580px] h-auto overflow-hidden flex items-center pt-20 pb-10">
        {/* Background Image */}
        <img
          src="/madina-hero.jpg"
          alt="Masjid Nabawi"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* DUROOD BANNER - Transparent Background */}
        <div className="durood-banner">
          <div className="durood-scroll">
            {/* First Copy */}
            <div className="durood-item">
              <span className="star">✦</span>
              إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا
              <span className="star">✦</span>
              <span className="divider">|</span>
              ترجمہ: بیشک اللہ اور اس کے فرشتے نبی ﷺ پر درود بھیجتے ہیں، اے ایمان والو! تم بھی ان پر درود و سلام بھیجا کرو۔
              <span className="star">✦</span>
            </div>

            {/* Second Copy */}
            <div className="durood-item">
              <span className="star">✦</span>
              إِنَّ اللَّهَ وَمَلَائِكَتَهُ يُصَلُّونَ عَلَى النَّبِيِّ ۚ يَا أَيُّهَا الَّذِينَ آمَنُوا صَلُّوا عَلَيْهِ وَسَلِّمُوا تَسْلِيمًا
              <span className="star">✦</span>
              <span className="divider">|</span>
              ترجمہ: بیشک اللہ اور اس کے فرشتے نبی ﷺ پر درود بھیجتے ہیں، اے ایمان والو! تم بھی ان پر درود و سلام بھیجا کرو۔
              <span className="star">✦</span>
            </div>
          </div>
        </div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#090d12] via-[#090d12]/90 to-[#090d12]/20" />

        {/* Decorative Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.15),transparent_40%)]"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl text-center">
            <h2 className="text-gold-500 text-4xl sm:text-5xl md:text-6xl font-black uppercase mb-4 sm:mb-6">
              MARKAZ-E-DUROOD
            </h2>

            <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
              Markaz-e-Durood is an Islamic non-profit organization working to spread
              the love of Prophet Muhammad ﷺ and encouraging Muslims worldwide to
              recite Durood Shareef daily.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link
                href="/account/submit-durood"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black px-8 py-4 rounded-lg font-semibold transition-all"
              >
                <FaHeart />
                Submit Durood
              </Link>

              <Link
                href="/account/donate"
                className="inline-flex items-center gap-2 border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white px-8 py-4 rounded-lg font-semibold transition-all"
              >
                <FaDonate />
                Donate Now
              </Link>
            </div>

            {/* Live Durood Counter */}
            <div className="mt-8 flex justify-center">
              <Link
                href="/durood-count"
                className="group relative w-full max-w-md"
                aria-label="View live Durood count"
              >
                <div className="relative overflow-hidden rounded-2xl border border-gold-500/25 bg-gradient-to-b from-white/[0.06] to-black/30 backdrop-blur-xl px-6 sm:px-8 py-5 transition-all duration-300 hover:border-gold-500/50 hover:from-white/[0.09] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
                  {/* Thin top accent line — replaces the old blurred glow */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent"></div>

                  <div className="flex items-center justify-between gap-4 sm:gap-6">
                    {/* Live badge */}
                    <div className="flex flex-col items-center gap-1.5 shrink-0">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      <span className="text-red-400/90 text-[9px] font-bold tracking-[0.15em] uppercase">Live</span>
                    </div>

                    <div className="w-px h-9 bg-white/10 shrink-0"></div>

                    {/* Count */}
                    <div className="text-left flex-1 min-w-0">
                      <p className="text-gray-400 text-[10px] sm:text-[11px] uppercase tracking-wider mb-1">
                        Durood Shareef Sent Worldwide
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-gold-400 text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight">
                          {liveDuroodCount.toLocaleString('en-US')}
                        </span>
                        {justAdded > 0 && (
                          <span key={tickKey} className="text-green-400 text-xs font-semibold animate-fadeIn">
                            +{justAdded}
                          </span>
                        )}
                      </div>
                    </div>

                    <FaArrowRight className="text-gold-500/40 group-hover:text-gold-500 group-hover:translate-x-1 transition-all duration-300 text-sm shrink-0" />
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          VISION IMAGE SECTION - Responsive
          ============================================ */}
      <section className="w-full">
        {/* Desktop Image - Hidden on mobile */}
        <div className="hidden md:block w-full">
          <img 
            src="/vision/v1.png" 
            alt="Vision" 
            className="w-full h-auto object-cover"
          />
        </div>
        
        {/* Mobile Image - Hidden on desktop */}
        <div className="block md:hidden w-full">
          <img 
            src="/vision/m1.png" 
            alt="Vision" 
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      {/* Top Durood Senders — Today / Weekly / Monthly leaderboard with chart */}
      <TopSendersLeaderboard />

      {/* Features Section */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaQuran />, title: 'Authentic & Trusted', desc: 'Based on Quran & Sunnah' },
              { icon: <MdMenuBook />, title: 'Learn & Understand', desc: 'Easy explanations & resources' },
              { icon: <FaHeadphones />, title: 'Listen & Recite', desc: 'Audio recitations & playlists' },
              { icon: <FaGlobe />, title: 'Share & Benefit', desc: 'Spread blessings worldwide' }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 text-center">
                <div className="text-4xl text-green-600 mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section
        className="py-24 px-4"
        style={{
          background: 'linear-gradient(to bottom, #02070d, #071018)'
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-gold-500 text-5xl md:text-5xl font-bold mb-6">
              Explore Our Collections
            </h2>
            <div className="mt-5 flex justify-center">
              <div className="w-30 h-[2px] bg-gold-500"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              {
                icon: <GiPrayer />, 
                title: 'Naat Shareef', 
                desc: 'Watch Beautiful Video Naat Collections and Sufi Kalam.', 
                link: '/resources/naat' 
              },
              {
                icon: <FaHeadphones />,
                title: 'Audio Library',
                desc: 'Listen to Durood recitations, Naats and Islamic audio content.',
                link: '/resources/audio'
              },
              {
                icon: <GiBookCover />,
                title: 'Books & PDFs',
                desc: 'Access Islamic books and downloadable resources.',
                link: '/resources/books'
              },
              {
                icon: <FaVideo />,
                title: 'Bayan',
                desc: 'Watch Spiritual, Heart-touching and Life Changing Bayan.',
                link: '/resources/bayan'
              },
              {
                icon: <FaBlog />,
                title: 'Articles & Insights',
                desc: 'Explore inspiring articles, research and Islamic knowledge.',
                link: '/blog'
              },
              {
                icon: <FaQuestionCircle />,
                title: 'Ask & Learn',
                desc: 'Submit your questions and receive authentic Islamic guidance.',
                link: '/resources/ask'
              }
            ].map((item, i) => (
              <Link
                key={i}
                href={item.link}
                className="
                  group
                  relative
                  h-[300px]
                  border
                  border-gold-500/25
                  rounded-xl
                  bg-[#071018]
                  overflow-hidden
                  transition-all
                  duration-500
                  hover:border-gold-500
                  hover:-translate-y-2
                  hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]
                "
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_70%)]"></div>

                <div className="relative z-10 h-full flex flex-col items-center text-center p-5">
                  {/* Icon */}
                  <div className="h-13 flex items-start justify-center pt-0">
                    <div className="text-4xl text-gold-500">
                      {item.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="h-12 flex items-center justify-center">
                    <h3 className="text-white font-semibold text-x3 leading-tight">
                      {item.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <div className="h-20 flex items-start justify-center">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  {/* Button */}
                  <div className="mt-8">
                    <span className="text-gold-500 text-sm font-semibold flex items-center gap-2">
                      Explore
                      <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Naat Video Gallery — watch naat videos right on the homepage */}
      <NaatVideoSection />

      {/* Stats Section - Full Width */}
      <section className="py-16 bg-green-900 text-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedStat target={500} suffix="K+" label="People Reached Worldwide" />
            <AnimatedStat target={50} suffix="+" label="Countries Covered" />
            <AnimatedStat target={100} suffix="+" label="Projects Completed" />
            <AnimatedStat target={100} suffix="%" label="Donation Transparency" />
          </div>
        </div>
      </section>

      {/* ============================================
          SLIDES STRIP - small, continuously running marquee
          ============================================ */}
      <section className="w-full bg-white py-6">
        <div className="slides-marquee-wrap">
          <div className="slides-marquee-track">
            {/* Two back-to-back copies create a seamless infinite loop */}
            {[...slides, ...slides].map((slide, i) => (
              <div key={`${slide.id}-${i}`} className="slides-marquee-item">
                <img
                  src={slide.image}
                  alt={`Slide ${slide.id}`}
                  className="h-20 sm:h-28 md:h-32 w-auto rounded-lg border border-gold-500/10 shadow-md object-contain bg-white"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stay Connected */}
      <section className="py-16 bg-gradient-to-r from-green-800 to-green-900 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-green-200 mb-8 text-lg">Subscribe to our newsletter and get updates on new content and resources.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <input type="email" placeholder="Enter your email" className="px-6 py-3 rounded-lg text-gray-900 w-full max-w-md" />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-green-900 px-8 py-3 rounded-lg font-semibold transition-colors">
              Subscribe Now
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}