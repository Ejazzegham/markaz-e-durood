import Link from 'next/link'
import { FaUser, FaHeart, FaBook, FaHistory, FaCog, FaSignOutAlt } from 'react-icons/fa'

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1a10] via-[#112c1b] to-[#0a1a10] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
          <FaUser className="text-[#D4AF37]" />
          My Account
        </h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Stats Cards */}
          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37]/40 transition">
            <FaHeart className="text-[#D4AF37] text-2xl mb-2" />
            <p className="text-gray-400 text-sm">Total Durood</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>

          <div className="bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37]/40 transition">
            <FaBook className="text-[#D4AF37] text-2xl mb-2" />
            <p className="text-gray-400 text-sm">Resources Accessed</p>
            <p className="text-2xl font-bold text-white">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-[#112c1b]/80 border border-[#D4AF37]/20 rounded-xl p-6">
          <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/account/submit-durood" className="bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-white p-3 rounded-lg text-center transition text-sm">
              Submit Durood
            </Link>
            <Link href="/account/login" className="bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-white p-3 rounded-lg text-center transition text-sm">
              Login
            </Link>
            <Link href="/account/register" className="bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-white p-3 rounded-lg text-center transition text-sm">
              Register
            </Link>
            <button className="bg-red-500/10 hover:bg-red-500/20 text-red-400 p-3 rounded-lg text-center transition text-sm">
              <FaSignOutAlt className="inline mr-1" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}