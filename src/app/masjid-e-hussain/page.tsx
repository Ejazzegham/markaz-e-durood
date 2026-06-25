import Link from 'next/link'
import Image from 'next/image'
import { 
  FaMosque, 
  FaHeart, 
  FaArrowRight,
  FaClock,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUsers,
  FaGlobe,
  FaStar,
  FaBuilding,
  FaPrayingHands,
  FaQuran,
  FaHands,
  FaBookOpen,
  FaVideo,
  FaHeadphones,
  FaNewspaper
} from 'react-icons/fa'

export default function MasjidEHussain() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] via-[#0f2847] to-[#0a1628] relative overflow-hidden">
      
      {/* ============================================
          BLUE THEME BACKGROUND LAYERS
          ============================================ */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 80px, #4FC3F7 80px, #4FC3F7 81px),
            repeating-linear-gradient(90deg, transparent, transparent 80px, #4FC3F7 80px, #4FC3F7 81px),
            repeating-linear-gradient(45deg, transparent, transparent 160px, rgba(79, 195, 247, 0.3) 160px, rgba(79, 195, 247, 0.3) 161px),
            repeating-linear-gradient(-45deg, transparent, transparent 160px, rgba(79, 195, 247, 0.3) 160px, rgba(79, 195, 247, 0.3) 161px)
          `
        }} />
      </div>

      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: '300px 300px'
      }} />

      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#4FC3F7]/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#4FC3F7]/5 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#4FC3F7]/3 rounded-full blur-[150px]"></div>
      </div>

      <div className="absolute top-10 left-10 w-20 h-20 border-t-2 border-l-2 border-[#4FC3F7]/10 rounded-tl-2xl"></div>
      <div className="absolute top-10 right-10 w-20 h-20 border-t-2 border-r-2 border-[#4FC3F7]/10 rounded-tr-2xl"></div>
      <div className="absolute bottom-10 left-10 w-20 h-20 border-b-2 border-l-2 border-[#4FC3F7]/10 rounded-bl-2xl"></div>
      <div className="absolute bottom-10 right-10 w-20 h-20 border-b-2 border-r-2 border-[#4FC3F7]/10 rounded-br-2xl"></div>

      {/* ============================================
          CONTENT
          ============================================ */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ============================================
            HERO SECTION - Image on Right, Text on Left
            ============================================ */}
        <section className="min-h-[90vh] flex items-center py-12">
          <div className="w-full">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-12">
              
              {/* Left Side - Text */}
              <div className="w-full lg:w-1/2 text-center lg:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#4FC3F7]/10 border border-[#4FC3F7]/20 mb-6">
                  <FaMosque className="text-[#4FC3F7] text-xs" />
                  <span className="text-[#4FC3F7] text-xs font-medium tracking-wider">MASJID-E-HUSSAIN</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  Welcome to{' '}
                  <span className="text-[#4FC3F7]">Masjid-e-Hussain</span>
                </h1>

                <p className="text-xl text-blue-200 mb-6">
                  Darbar Hazrat Sultan Bahu, Jung, Pakistan
                </p>

                <p className="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8">
                  A place of peace, prayer, and community. We are dedicated to serving 
                  the community and spreading the teachings of Islam.
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link 
                    href="/masjid-e-hussain/visit"
                    className="inline-flex items-center gap-2 bg-[#4FC3F7] hover:bg-[#38b0e8] text-blue-950 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg shadow-[#4FC3F7]/20 hover:shadow-[#4FC3F7]/40"
                  >
                    <FaPrayingHands />
                    Plan Your Visit
                  </Link>
                  <Link 
                    href="/masjid-e-hussain/contact"
                    className="inline-flex items-center gap-2 border border-[#4FC3F7]/30 bg-white/5 backdrop-blur-md hover:bg-white/10 text-white px-8 py-3 rounded-lg font-semibold transition-all"
                  >
                    Contact Us
                  </Link>
                </div>

                {/* Stats */}
                <div className="mt-8 flex flex-wrap gap-6 justify-center lg:justify-start">
                  <div className="flex items-center gap-2 text-blue-300">
                    <FaUsers className="text-[#4FC3F7]" />
                    <span>10K+ Community</span>
                  </div>
                  <div className="flex items-center gap-2 text-blue-300">
                    <FaClock className="text-[#4FC3F7]" />
                    <span>5 Daily Prayers</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <div className="relative group">
                  {/* Glow Effect */}
                  <div className="absolute -inset-8 bg-[#4FC3F7]/10 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  
                  {/* Image Container */}
                  <div className="relative rounded-3xl overflow-hidden border-2 border-[#4FC3F7]/20 group-hover:border-[#4FC3F7]/40 transition-all duration-500 shadow-2xl shadow-[#4FC3F7]/10 group-hover:shadow-[#4FC3F7]/30">
                    <img
                      src="/hussain.png"
                      alt="Masjid-e-Hussain"
                      className="w-full max-w-lg h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a1628]/40 via-transparent to-transparent"></div>
                    
                    {/* Corner Accents */}
                    <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#4FC3F7]/30 rounded-tl-lg"></div>
                    <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#4FC3F7]/30 rounded-br-lg"></div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute -bottom-4 -right-4 bg-[#4FC3F7] text-blue-950 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2">
                    <FaHeart className="text-red-500 animate-pulse" />
                    <span className="font-bold text-sm">Community Center</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================
            FEATURES SECTION - 4 Cards
            ============================================ */}
        <section className="py-16 border-t border-[#4FC3F7]/10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            What We <span className="text-[#4FC3F7]">Offer</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaPrayingHands />, title: 'Daily Prayers', desc: 'Five times daily congregational prayers', color: '#4FC3F7' },
              { icon: <FaQuran />, title: 'Quran Classes', desc: 'Learn Quran with Tajweed', color: '#4FC3F7' },
              { icon: <FaUsers />, title: 'Community Events', desc: 'Weekly gatherings and programs', color: '#4FC3F7' },
              { icon: <FaGlobe />, title: 'Online Services', desc: 'Live streaming and virtual events', color: '#4FC3F7' }
            ].map((item, i) => (
              <div key={i} className="bg-[#0f2847]/80 border border-[#4FC3F7]/20 rounded-xl p-6 text-center hover:border-[#4FC3F7]/40 transition-all hover:-translate-y-2 shadow-lg hover:shadow-[#4FC3F7]/10">
                <div className="text-4xl text-[#4FC3F7] flex justify-center mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================
            SERVICES SECTION - 3 Cards with Icons
            ============================================ */}
        <section className="py-16 border-t border-[#4FC3F7]/10">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Our <span className="text-[#4FC3F7]">Services</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                icon: <FaBookOpen />, 
                title: 'Islamic Education',
                desc: 'Comprehensive Islamic studies for all ages',
                link: '/masjid-e-hussain/education'
              },
              { 
                icon: <FaHeart />, 
                title: 'Community Support',
                desc: 'Helping those in need with care and compassion',
                link: '/masjid-e-hussain/support'
              },
              { 
                icon: <FaVideo />, 
                title: 'Live Broadcasts',
                desc: 'Watch prayers and lectures online',
                link: '/masjid-e-hussain/live'
              }
            ].map((item, i) => (
              <div key={i} className="group bg-[#0f2847]/80 border border-[#4FC3F7]/20 rounded-xl p-6 hover:border-[#4FC3F7]/40 transition-all hover:-translate-y-2">
                <div className="text-4xl text-[#4FC3F7] mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#4FC3F7] transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.desc}</p>
                <Link href={item.link} className="inline-flex items-center gap-2 text-[#4FC3F7] font-semibold hover:gap-3 transition-all text-sm">
                  Learn More <FaArrowRight className="text-xs" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================
            STATS SECTION - Blue Theme
            ============================================ */}
        <section className="py-16 border-t border-[#4FC3F7]/10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { num: '10K+', label: 'Community Members', icon: <FaUsers /> },
              { num: '50+', label: 'Events per Year', icon: <FaStar /> },
              { num: '100+', label: 'Volunteers', icon: <FaHands /> },
              { num: '5', label: 'Daily Prayers', icon: <FaPrayingHands /> }
            ].map((item, i) => (
              <div key={i} className="bg-[#0f2847]/80 border border-[#4FC3F7]/20 rounded-xl p-5 hover:border-[#4FC3F7]/40 transition-all hover:-translate-y-1">
                <div className="text-3xl text-[#4FC3F7] flex justify-center mb-2">{item.icon}</div>
                <div className="text-3xl font-bold text-white">{item.num}</div>
                <div className="text-gray-400 text-sm">{item.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================
            QURAN VERSE - Blue Theme
            ============================================ */}
        <section className="py-16 border-t border-[#4FC3F7]/10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-2xl md:text-3xl text-[#4FC3F7] font-serif leading-relaxed mb-4">
              <FaQuran className="inline text-[#4FC3F7] text-3xl mr-3" />
              "إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ"
            </div>
            <p className="text-gray-300 text-lg">
              "Only those who believe in Allah and the Last Day should maintain the mosques of Allah."
            </p>
            <p className="text-sm text-gray-500 mt-2">(Quran 9:18)</p>
          </div>
        </section>

        {/* ============================================
            CONTACT SECTION
            ============================================ */}
        <section className="py-16 border-t border-[#4FC3F7]/10">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0f2847]/80 border border-[#4FC3F7]/20 rounded-xl p-5 text-center hover:border-[#4FC3F7]/40 transition-all">
              <FaMapMarkerAlt className="text-3xl text-[#4FC3F7] mx-auto mb-2" />
              <h3 className="text-white font-semibold">Location</h3>
              <p className="text-gray-400 text-sm">Darbar Hazrat Sultan Bahu, Jung, Pakistan</p>
            </div>
            <div className="bg-[#0f2847]/80 border border-[#4FC3F7]/20 rounded-xl p-5 text-center hover:border-[#4FC3F7]/40 transition-all">
              <FaPhone className="text-3xl text-[#4FC3F7] mx-auto mb-2" />
              <h3 className="text-white font-semibold">Contact</h3>
              <p className="text-gray-400 text-sm">0301-4391609</p>
            </div>
            <div className="bg-[#0f2847]/80 border border-[#4FC3F7]/20 rounded-xl p-5 text-center hover:border-[#4FC3F7]/40 transition-all">
              <FaClock className="text-3xl text-[#4FC3F7] mx-auto mb-2" />
              <h3 className="text-white font-semibold">Prayer Times</h3>
              <p className="text-gray-400 text-sm">Five times daily</p>
            </div>
          </div>
        </section>

        {/* ============================================
            BOTTOM DECORATION
            ============================================ */}
        <div className="py-8 flex items-center justify-center gap-4 border-t border-[#4FC3F7]/10">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#4FC3F7]/30"></div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-[#4FC3F7]/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#4FC3F7] shadow-lg shadow-[#4FC3F7]/50"></div>
            <div className="w-1 h-1 rounded-full bg-[#4FC3F7]/40"></div>
          </div>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#4FC3F7]/30"></div>
        </div>

        <div className="pb-8 text-center">
          <p className="text-[10px] text-gray-600 tracking-wider">
            <FaMosque className="inline mr-1.5 text-[#4FC3F7]/30 text-[10px]" />
            A place of peace, prayer and community
          </p>
        </div>

      </div>
    </div>
  )
}