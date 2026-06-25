import Link from 'next/link'
import Image from 'next/image'
import { 
  FaMosque, 
  FaHeart, 
  FaQuran, 
  FaGlobe,
  FaUsers,
  FaHands,
  FaArrowRight,
  FaBookOpen,
  FaVideo,
  FaMicrophone,
  FaNewspaper
} from 'react-icons/fa'

export default function About() {
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
                  <FaArrowRight className="relative group-hover:-translate-x-1 transition-transform text-sm rotate-180" />
                </Link>
                
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#D4AF37]/20 rounded-xl blur-lg"></div>
                    <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#D4AF37]/30 to-[#D4AF37]/10 border border-[#D4AF37]/30">
                      <FaMosque className="text-[#D4AF37] text-xl" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                      <span className="text-white">About</span>
                      <span className="text-[#D4AF37]"> Us</span>
                    </h1>
                    <p className="text-gray-400 text-xs hidden sm:block">
                      Learn about our mission and vision
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/20">
                  <FaHeart className="text-[#D4AF37] text-xs animate-pulse" />
                  <span className="text-gray-300 text-xs font-medium">Our Mission</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================
            MAIN CONTENT - 2 COLUMN LAYOUT
            ============================================ */}
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
          {/* ============================================
              LEFT SIDE - TEXT CONTENT
              ============================================ */}
          <div className="space-y-6">
            {/* Our Vision Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20">
              <FaHeart className="text-[#D4AF37] text-xs" />
              <span className="text-[#D4AF37] text-xs font-medium tracking-wider">OUR VISION</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              Spreading the Blessings of{' '}
              <span className="text-[#D4AF37]">Durood Shareef</span>
            </h2>

            <div className="space-y-4 text-gray-300 leading-relaxed">
              <p>
                This website is dedicated to collect and promote Durood Shareef and its blessings throughout the world. The benefits of Durood Shareef will be shared through Videos, Lectures, Naats, Books and Articles.
              </p>
              <p>
                InshaAllah the viewer of this website will be spiritually uplifted and is encouraged to share the blessings with others.
              </p>
              <p className="text-[#D4AF37] font-semibold">
                Join us on this journey and help us reach a target of over 50 Million Duroods per day.
              </p>
            </div>

            {/* Arabic Text */}
            <div className="bg-[#112c1b]/60 border border-[#D4AF37]/10 rounded-xl p-5 text-right">
              <p className="text-lg text-[#D4AF37] font-arabic leading-relaxed">
                یہ ویب سائٹ پوری دنیا میں درود شریف اور اس کی برکات کو جمع کرنے اور اسے فروغ دینے کے لیے وقف ہے۔ درود شریف کے فوائد وڈیوز، لیکچرز، نعتوں، کتابوں اور مضامین کے ذریعے شیئر کیے جائیں گے۔ انشاء اللہ اس ویب سائٹ کو دیکھنے والے روحانی طور پر بلند ہو جائیں گے اور دوسروں کے ساتھ برکات بانٹنے کی ترغیب دی جاتی ہے۔
              </p>
              <p className="text-[#D4AF37] text-sm font-semibold mt-3">
                اس سفر میں ہمارے ساتھ شامل ہوں اور روزانہ 50 ملین سے زیادہ درود کے ہدف تک پہنچنے میں ہماری مدد کریں
              </p>
            </div>

            {/* Key Points */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <FaBookOpen />, label: 'Books & Articles' },
                { icon: <FaVideo />, label: 'Videos & Lectures' },
                { icon: <FaMicrophone />, label: 'Naats & Bayan' },
                { icon: <FaNewspaper />, label: 'Daily Updates' }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-[#112c1b]/60 border border-[#D4AF37]/10 rounded-lg px-3 py-2">
                  <span className="text-[#D4AF37]">{item.icon}</span>
                  <span className="text-gray-300 text-xs">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ============================================
              RIGHT SIDE - IMAGE (Rounded Corners)
              ============================================ */}
          <div className="relative group">
            {/* Decorative Glow Behind Image */}
            <div className="absolute -inset-8 bg-[#D4AF37]/10 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            {/* Image Container */}
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/20 group-hover:border-[#D4AF37]/40 transition-all duration-500 shadow-2xl shadow-[#D4AF37]/10 group-hover:shadow-[#D4AF37]/30">
              <Image
                src="/about.png"
                alt="About Markaz-e-Durood"
                width={600}
                height={700}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a10]/60 via-transparent to-transparent"></div>
              
              {/* Corner Accents */}
              <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/30 rounded-tl-lg"></div>
              <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/30 rounded-br-lg"></div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 -right-4 bg-[#D4AF37] text-green-950 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2">
              <FaHeart className="text-red-500 animate-pulse" />
              <span className="font-bold text-sm">50M+ Target</span>
            </div>
          </div>
        </div>

        {/* ============================================
            STATS SECTION
            ============================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
          {[
            { icon: <FaGlobe />, num: '100+', label: 'Countries' },
            { icon: <FaUsers />, num: '10K+', label: 'Active Users' },
            { icon: <FaHeart />, num: '50M+', label: 'Daily Durood Target' },
            { icon: <FaHands />, num: '100%', label: 'Blessings Shared' }
          ].map((item, i) => (
            <div key={i} className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-4 text-center hover:border-[#D4AF37]/40 transition-all hover:-translate-y-1">
              <div className="text-[#D4AF37] text-2xl flex justify-center mb-1">{item.icon}</div>
              <div className="text-xl font-bold text-white">{item.num}</div>
              <div className="text-gray-400 text-xs">{item.label}</div>
            </div>
          ))}
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
            Spreading the love of Prophet Muhammad ﷺ worldwide
          </p>
        </div>

      </div>
    </div>
  )
}