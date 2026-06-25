import Link from 'next/link'
import { FaBook, FaUser, FaClock, FaArrowLeft } from 'react-icons/fa'

export default function ArabicClasses() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/online-classes" className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 mb-6">
          <FaArrowLeft /> Back to Classes
        </Link>
        
        <h1 className="text-4xl font-bold text-green-900 mb-4 flex items-center gap-3">
          <FaBook className="text-yellow-500" />
          Arabic Classes
        </h1>
        <p className="text-gray-600 mb-8">Learn Arabic language with expert teachers</p>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-3">Course Overview</h2>
            <p className="text-gray-700">Master the Arabic language from beginner to advanced level. Learn grammar, vocabulary, and conversation skills.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <FaUser className="text-green-600 text-xl" />
              <p className="font-semibold mt-2">Qualified Teachers</p>
              <p className="text-sm text-gray-600">Native Arabic speakers</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <FaClock className="text-green-600 text-xl" />
              <p className="font-semibold mt-2">Flexible Timing</p>
              <p className="text-sm text-gray-600">Schedule according to your convenience</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}