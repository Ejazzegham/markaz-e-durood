'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaHeart, FaArrowRight } from 'react-icons/fa'

// Urdu translation broken into individual sentences so each one can get
// its own thin divider underneath it — keeps the Nastaliq script from
// ever feeling like one dense, run-together block of text.
const urduLines = [
  'یہ ویب سائٹ پوری دنیا میں درود شریف اور اس کی برکات کو جمع کرنے اور اسے فروغ دینے کے لیے وقف ہے۔',
  'درود شریف کے فوائد وڈیوز، لیکچرز، نعتوں، کتابوں اور مضامین کے ذریعے شیئر کیے جائیں گے۔',
  'انشاء اللہ اس ویب سائٹ کو دیکھنے والے روحانی طور پر بلند ہو جائیں گے اور دوسروں کے ساتھ برکات بانٹنے کی ترغیب دی جاتی ہے۔',
]

// Our Mission — bilingual (English + Urdu) statement paired with the
// founder's photo. Sits right under the hero on the home page so a first-
// time visitor immediately understands what the site is for.
//
// Kept intentionally compact (smaller text + a shorter photo) so this
// section reads as a quick summary rather than a second hero — the grid's
// items-stretch + the photo's h-auto/flex-1 combo means the picture always
// matches the text column's height exactly, at any screen size.
export default function MissionSection() {
  return (
    <section className="relative py-12 px-4 overflow-hidden bg-gradient-to-b from-green-950 via-green-900 to-green-950">
      {/* Decorative glows — matches the premium look used on About/Gallery */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section label */}
        <div className="flex justify-center mb-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20">
            <FaHeart className="text-gold-500 text-xs" />
            <span className="text-gold-500 text-xs font-medium tracking-wider">OUR MISSION</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* ============================================
              MISSION TEXT — English + Urdu (now on the left)
              ============================================ */}
          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight text-center">
              Spreading the Blessings of{' '}
              <span className="text-gold-500">Durood Shareef</span>
            </h2>

            <div className="space-y-2 text-gray-300 text-xs sm:text-sm leading-relaxed text-center lg:text-left">
              <p>
                This website is dedicated to collect and promote Durood Shareef and its
                blessings throughout the world. The benefits of Durood Shareef will be
                shared through Videos, Lectures, Naats, Books and Articles.
              </p>
              <p className="text-gold-500 font-semibold">
                Join us on this journey and help us reach a target of over 50 Million
                Duroods per day.
              </p>
            </div>

            {/* Urdu block — professional Nastaliq font, right-aligned RTL,
                each sentence on its own line with a thin divider beneath it
                so lines never feel like they're touching */}
            <div className="relative bg-green-850/60 border border-gold-500/15 border-r-4 border-r-gold-500/60 rounded-xl p-3 sm:p-4 pt-3">
              <span className="font-urdu inline-block text-gold-500/90 text-[10px] font-bold tracking-wide bg-gold-500/10 border border-gold-500/20 rounded-full px-2.5 py-0.5 mb-2">
                اردو ترجمہ
              </span>

              {urduLines.slice(0, 2).map((line, i) => (
                <p
                  key={i}
                  dir="rtl"
                  className="font-urdu text-white text-sm sm:text-base pb-2 mb-2 border-b border-white/15"
                  style={{ lineHeight: 1.9 }}
                >
                  {line}
                </p>
              ))}

              <p
                dir="rtl"
                className="font-urdu text-gold-400 font-bold text-xs sm:text-sm pt-0.5"
                style={{ lineHeight: 1.8 }}
              >
                اس سفر میں ہمارے ساتھ شامل ہوں اور روزانہ 50 ملین سے زیادہ درود کے ہدف
                تک پہنچنے میں ہماری مدد کریں
              </p>
            </div>

            <div className="flex justify-center lg:justify-start">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-green-950 px-5 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all"
              >
                Learn More About Us
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>

          {/* ============================================
              FOUNDER PHOTO (now on the right) — stretches to
              match the full height of the text column so the
              two sides read as the same visual size
              ============================================ */}
          <div className="relative group w-full h-[220px] sm:h-[260px] lg:h-auto flex flex-col">
            <div className="absolute -inset-4 bg-gold-500/10 rounded-[1.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative flex-1 min-h-0 rounded-2xl overflow-hidden border-2 border-gold-500/25 group-hover:border-gold-500/50 transition-all duration-500 shadow-2xl shadow-black/40">
              <Image
                src="/mission/sultan-fiaz-ul-hassan.png"
                alt="Sultan Fiaz-ul-Hassan Qadri"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/70 via-transparent to-transparent" />

              {/* Corner accents */}
              <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-gold-500/40 rounded-tl-lg" />
              <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-gold-500/40 rounded-br-lg" />
            </div>

            {/* Name plate */}
            <div className="mt-2 text-center shrink-0">
              <p className="text-white font-semibold text-xs">Sultan Fiaz-ul-Hassan Qadri</p>
              <p className="text-gold-500/80 text-[10px] tracking-wide">Founder, Markaz-e-Durood</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
