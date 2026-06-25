'use client'

import AudioPlayer from '@/components/AudioPlayer'
import Link from 'next/link'
import { useState, useEffect } from 'react'
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
  FaDonate,
  FaChevronLeft,
  FaChevronRight,
  FaCircle
} from 'react-icons/fa'

import { MdLibraryMusic, MdMenuBook } from 'react-icons/md'
import { GiPrayer, GiPearlNecklace, GiBookCover } from 'react-icons/gi'
import './globals.css'

export default function Home() {
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0)
  const slides = [
    { id: 1, image: '/slides/s1.png', title: 'Slide 1' },
    { id: 2, image: '/slides/s2.png', title: 'Slide 2' },
    { id: 3, image: '/slides/s3.png', title: 'Slide 3' },
    { id: 4, image: '/slides/s4.png', title: 'Slide 4' }
  ]

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [slides.length])

  // Go to previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // Go to next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  // Go to specific slide
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="min-h-screen">
      
      {/* Audio Player */}
      <AudioPlayer src="/audio/background-music.mp3" autoPlay={true} loop={true} />
      
      {/* Hero Section - Text on Left, Image on Right */}
      <section className="relative h-[580px] overflow-hidden">
  <div className="absolute top-0 left-0 right-0 z-50">
    <div className="durood-banner">
      ...
    </div>
  </div>
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
        <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
          <div className="max-w-3xl text-center">
            <h2 className="text-[#D4AF37] text-5xl md:text-6xl font-black uppercase mb-6">
              MARKAZ-E-DUROOD
            </h2>

            <p className="text-gray-300 text-xl leading-relaxed max-w-2xl">
              Markaz-e-Durood is an Islamic non-profit organization working to spread
              the love of Prophet Muhammad ﷺ and encouraging Muslims worldwide to
              recite Durood Shareef daily.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <Link
                href="/account/submit-durood"
                className="inline-flex items-center gap-2 bg-[#D4AF37] hover:bg-[#c79f22] text-black px-8 py-4 rounded-lg font-semibold transition-all"
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
          </div>
        </div>
      </section>

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
            <h2 className="text-[#D4AF37] text-5xl md:text-5xl font-bold mb-6">
              Explore Our Collections
            </h2>
            <div className="mt-5 flex justify-center">
              <div className="w-30 h-[2px] bg-[#D4AF37]"></div>
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
                  border-[#D4AF37]/25
                  rounded-xl
                  bg-[#071018]
                  overflow-hidden
                  transition-all
                  duration-500
                  hover:border-[#D4AF37]
                  hover:-translate-y-2
                  hover:shadow-[0_0_40px_rgba(212,175,55,0.15)]
                "
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_70%)]"></div>

                <div className="relative z-10 h-full flex flex-col items-center text-center p-5">
                  {/* Icon */}
                  <div className="h-13 flex items-start justify-center pt-0">
                    <div className="text-4xl text-[#D4AF37]">
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
                    <span className="text-[#D4AF37] text-sm font-semibold flex items-center gap-2">
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

      {/* Stats Section - Full Width */}
      <section className="py-16 bg-green-900 text-white px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: '500K+', label: 'People Reached Worldwide' },
              { num: '50+', label: 'Countries Covered' },
              { num: '100+', label: 'Projects Completed' },
              { num: '100%', label: 'Donation Transparency' }
            ].map((item, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-yellow-400">{item.num}</div>
                <div className="text-green-300 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* ============================================
          4-SLIDE CAROUSEL - Clean, No Controls
          ============================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-1500 via-green-1500 to-green-1500">
        {/* Islamic Texture Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(212,175,55,0.3) 60px, rgba(212,175,55,0.3) 61px),
              repeating-linear-gradient(90deg, transparent, transparent 60px, rgba(212,175,55,0.3) 60px, rgba(212,175,55,0.3) 61px),
              repeating-linear-gradient(45deg, transparent, transparent 120px, rgba(212,175,55,0.1) 120px, rgba(212,175,55,0.1) 121px),
              repeating-linear-gradient(-45deg, transparent, transparent 120px, rgba(212,175,55,0.1) 120px, rgba(212,175,55,0.1) 121px)
            `
          }} />
        </div>

        {/* Subtle Gold Glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08),transparent_70%)]"></div>

        {/* Carousel Container */}
        <div>
          <div>
            {/* Slides - Auto play only, no controls */}
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slide) => (
                <div key={slide.id} className="min-w-full">
                  <img
                    src={slide.image}
                    alt={`Slide ${slide.id}`}
                    className="w-full h-[400px] md:h-[500px] object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Dots Indicator - Minimal */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? 'bg-[#D4AF37] w-8'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Subtle Gradient Overlay at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-900/50 to-transparent pointer-events-none"></div>
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