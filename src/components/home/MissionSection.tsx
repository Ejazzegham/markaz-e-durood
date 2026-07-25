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
export default function MissionSection() {
  return (
    <section className="relative py-20 px-4 overflow-hidden bg-gradient-to-b from-green-950 via-green-900 to-green-950">
      {/* Decorative glows — matches the premium look used on About/Gallery */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section label */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20">
            <FaHeart className="text-gold-500 text-xs" />
            <span className="text-gold-500 text-xs font-medium tracking-wider">OUR MISSION</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-stretch">
          {/* ============================================
              MISSION TEXT — English + Urdu (now on the left)
              ============================================ */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight text-center">
              Spreading the Blessings of{' '}
              <span className="text-gold-500">Durood Shareef</span>
            </h2>

            <div className="space-y-4 text-gray-300 leading-relaxed text-center lg:text-left">
              <p>
                This website is dedicated to collect and promote Durood Shareef and its
                blessings throughout the world. The benefits of Durood Shareef will be
                shared through Videos, Lectures, Naats, Books and Articles.
              </p>
              <p>
                InshaAllah the viewer of this website will be spiritually uplifted and is
                encouraged to share the blessings with others.
              </p>
              <p className="text-gold-500 font-semibold">
                Join us on this journey and help us reach a target of over 50 Million
                Duroods per day.
              </p>
            </div>

            {/* Urdu block — professional Nastaliq font, right-aligned RTL,
                each sentence on its own line with a thin divider beneath it
                so lines never feel like they're touching */}
            <div className="relative bg-green-850/60 border border-gold-500/15 border-r-4 border-r-gold-500/60 rounded-2xl p-5 sm:p-6 pt-4">
              <span className="font-urdu inline-block text-gold-500/90 text-xs font-bold tracking-wide bg-gold-500/10 border border-gold-500/20 rounded-full px-3 py-1 mb-4">
                اردو ترجمہ
              </span>

              {urduLines.map((line, i) => (
                <p
                  key={i}
                  dir="rtl"
                  className="font-urdu text-white text-xl sm:text-2xl pb-4 mb-4 border-b border-white/15"
                  style={{ lineHeight: 2.4 }}
                >
                  {line}
                </p>
              ))}

              <p
                dir="rtl"
                className="font-urdu text-gold-400 font-bold text-lg sm:text-xl pt-1"
                style={{ lineHeight: 2.2 }}
              >
                اس سفر میں ہمارے ساتھ شامل ہوں اور روزانہ 50 ملین سے زیادہ درود کے ہدف
                تک پہنچنے میں ہماری مدد کریں
              </p>
            </div>

            <div className="flex justify-center lg:justify-start">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-green-950 px-6 py-3 rounded-lg font-semibold text-sm transition-all"
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
          <div className="relative group w-full h-[420px] sm:h-[480px] lg:h-auto flex flex-col">
            <div className="absolute -inset-6 bg-gold-500/10 rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative flex-1 min-h-0 rounded-[1.75rem] overflow-hidden border-2 border-gold-500/25 group-hover:border-gold-500/50 transition-all duration-500 shadow-2xl shadow-black/40">
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
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold-500/40 rounded-tl-lg" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold-500/40 rounded-br-lg" />
            </div>

            {/* Name plate */}
            <div className="mt-4 text-center shrink-0">
              <p className="text-white font-semibold text-sm">Sultan Fiaz-ul-Hassan Qadri</p>
              <p className="text-gold-500/80 text-xs tracking-wide">Founder, Markaz-e-Durood</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
