'use client'

import Image from 'next/image'
import Link from 'next/link'
import { FaHeart, FaVideo, FaBookOpen, FaMicrophone, FaArrowRight } from 'react-icons/fa'

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

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center">
          {/* ============================================
              FOUNDER PHOTO
              ============================================ */}
          <div className="relative group mx-auto lg:mx-0 w-full max-w-sm">
            <div className="absolute -inset-6 bg-gold-500/10 rounded-[2rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative rounded-[1.75rem] overflow-hidden border-2 border-gold-500/25 group-hover:border-gold-500/50 transition-all duration-500 shadow-2xl shadow-black/40">
              <Image
                src="/mission/sultan-fiaz-ul-hassan.png"
                alt="Sultan Fiaz-ul-Hassan Qadri"
                width={700}
                height={764}
                className="w-full h-auto object-cover"
                priority={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-950/70 via-transparent to-transparent" />

              {/* Corner accents */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-gold-500/40 rounded-tl-lg" />
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-gold-500/40 rounded-br-lg" />
            </div>

            {/* Name plate */}
            <div className="mt-4 text-center">
              <p className="text-white font-semibold text-sm">Sultan Fiaz-ul-Hassan Qadri</p>
              <p className="text-gold-500/80 text-xs tracking-wide">Founder, Markaz-e-Durood</p>
            </div>
          </div>

          {/* ============================================
              MISSION TEXT — English + Urdu
              ============================================ */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight text-center lg:text-left">
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

            {/* Urdu block — professional Nastaliq font, right-aligned RTL */}
            <div className="bg-green-850/60 border border-gold-500/15 rounded-2xl p-5 sm:p-6">
              <p className="font-urdu text-gold-400 text-xl sm:text-2xl">
                یہ ویب سائٹ پوری دنیا میں درود شریف اور اس کی برکات کو جمع کرنے اور اسے
                فروغ دینے کے لیے وقف ہے۔ درود شریف کے فوائد وڈیوز، لیکچرز، نعتوں، کتابوں
                اور مضامین کے ذریعے شیئر کیے جائیں گے۔ انشاء اللہ اس ویب سائٹ کو دیکھنے
                والے روحانی طور پر بلند ہو جائیں گے اور دوسروں کے ساتھ برکات بانٹنے کی
                ترغیب دی جاتی ہے۔
              </p>
              <p className="font-urdu text-gold-500 font-bold text-lg sm:text-xl mt-3 pt-3 border-t border-gold-500/10">
                اس سفر میں ہمارے ساتھ شامل ہوں اور روزانہ 50 ملین سے زیادہ درود کے ہدف
                تک پہنچنے میں ہماری مدد کریں
              </p>
            </div>

            {/* Quick highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: <FaBookOpen />, label: 'Books & Articles' },
                { icon: <FaVideo />, label: 'Videos & Lectures' },
                { icon: <FaMicrophone />, label: 'Naats & Bayan' },
                { icon: <FaHeart />, label: 'Daily Durood' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-green-850/60 border border-gold-500/10 rounded-lg px-3 py-2.5"
                >
                  <span className="text-gold-500">{item.icon}</span>
                  <span className="text-gray-300 text-xs">{item.label}</span>
                </div>
              ))}
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
        </div>
      </div>
    </section>
  )
}
