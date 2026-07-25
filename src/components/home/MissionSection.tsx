'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaHeart, FaArrowRight } from 'react-icons/fa'

// Urdu translation — kept as continuous, book-style paragraphs rather than
// being chopped into separate per-sentence boxes. The .font-urdu class
// (see globals.css) already sets a consistent line-height, so every line
// sits the same distance from the next, the way a printed page reads.
const urduBody =
  'یہ ویب سائٹ پوری دنیا میں درود شریف اور اس کی برکات کو جمع کرنے اور اسے فروغ دینے کے لیے وقف ہے۔ درود شریف کے فوائد وڈیوز، لیکچرز، نعتوں، کتابوں اور مضامین کے ذریعے شیئر کیے جائیں گے۔ انشاء اللہ اس ویب سائٹ کو دیکھنے والے روحانی طور پر بلند ہو جائیں گے اور دوسروں کے ساتھ برکات بانٹنے کی ترغیب دی جاتی ہے۔'

const urduCallToAction =
  'اس سفر میں ہمارے ساتھ شامل ہوں اور روزانہ 50 ملین سے زیادہ درود کے ہدف تک پہنچنے میں ہماری مدد کریں۔'

// Our Mission — bilingual (English + Urdu) statement paired with the
// founder's photo. Sits right under the hero on the home page so a first-
// time visitor immediately understands what the site is for.
//
// The text column and the photo column are both wrapped in matching
// bordered cards and stretched to equal height (items-stretch + h-full),
// so the two sides read as the same visual size. The photo uses
// object-contain inside a padded frame so the entire portrait is always
// visible — nothing is ever cropped off.
export default function MissionSection() {
  return (
    <section className="relative py-12 px-4 overflow-hidden bg-gradient-to-b from-green-950 via-green-900 to-green-950">
      {/* Decorative glows — matches the premium look used on About/Gallery */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section label */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20">
            <FaHeart className="text-gold-500 text-xs" />
            <span className="text-gold-500 text-xs font-medium tracking-wider">OUR MISSION</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* ============================================
              MISSION TEXT — English + Urdu
              Wrapped in a bordered card that stretches to
              match the photo card's height exactly.
              ============================================ */}
          <div className="flex flex-col justify-center bg-green-900/40 border border-gold-500/15 rounded-2xl p-5 sm:p-6 lg:p-8 space-y-4">
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight text-center lg:text-left">
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

            {/* Urdu block — single justified, book-page paragraph.
                No per-line dividers, no "اردو ترجمہ" label — just the
                translation itself, set the same way on both pages. */}
            <div className="bg-green-950/50 border border-gold-500/10 border-r-4 border-r-gold-500/60 rounded-xl px-4 py-4 sm:px-5 sm:py-5">
              <p
                dir="rtl"
                className="font-urdu text-white text-sm sm:text-base md:text-[17px]"
                style={{ textAlign: 'justify', textAlignLast: 'right' }}
              >
                {urduBody}
              </p>
              <p
                dir="rtl"
                className="font-urdu text-gold-400 font-bold text-sm sm:text-base md:text-[17px] mt-3 pt-3 border-t border-gold-500/15"
                style={{ textAlign: 'justify', textAlignLast: 'right' }}
              >
                {urduCallToAction}
              </p>
            </div>

            <div className="flex justify-center lg:justify-start pt-1">
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
              FOUNDER PHOTO — object-contain inside a padded
              frame so the complete photo is always visible,
              never cropped, at any screen size. The card
              stretches (items-stretch on the parent grid) to
              match the text column's height exactly.
              ============================================ */}
          <div className="relative group w-full flex flex-col">
            <div className="absolute -inset-4 bg-gold-500/10 rounded-[1.75rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative flex-1 min-h-[340px] sm:min-h-[420px] lg:min-h-0 rounded-2xl overflow-hidden border-2 border-gold-500/25 group-hover:border-gold-500/50 transition-all duration-500 shadow-2xl shadow-black/40 bg-gradient-to-b from-green-900/60 to-green-950/70">
              <Image
                src="/public/sultan-fiaz-ul-hassan.png"
                alt="Sultan Fiaz-ul-Hassan Qadri"
                fill
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-contain p-3 sm:p-4"
                priority={false}
              />

              {/* Corner accents */}
              <div className="absolute top-2.5 left-2.5 w-6 h-6 border-t-2 border-l-2 border-gold-500/40 rounded-tl-lg pointer-events-none" />
              <div className="absolute bottom-2.5 right-2.5 w-6 h-6 border-b-2 border-r-2 border-gold-500/40 rounded-br-lg pointer-events-none" />
            </div>

            {/* Name plate */}
            <div className="mt-3 text-center shrink-0">
              <p className="text-white font-semibold text-xs sm:text-sm">Sultan Fiaz-ul-Hassan Qadri</p>
              <p className="text-gold-500/80 text-[10px] sm:text-xs tracking-wide">Founder, Markaz-e-Durood</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
