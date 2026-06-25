import Link from 'next/link'
import { FaMicrophone, FaTrophy, FaUsers, FaArrowLeft } from 'react-icons/fa'

export default function NaatCompetition() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/online-classes" className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 mb-6">
          <FaArrowLeft /> Back to Classes
        </Link>
        
        <h1 className="text-4xl font-bold text-green-900 mb-4 flex items-center gap-3">
          <FaMicrophone className="text-yellow-500" />
          Naat Competition
        </h1>
        <p className="text-gray-600 mb-8">Participate in Naat competitions and showcase your talent</p>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-3">Competition Details</h2>
            <p className="text-gray-700">Annual Naat competition open to all ages. Submit your recitation and win prizes.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <FaTrophy className="text-yellow-500 text-2xl mx-auto" />
              <p className="font-semibold mt-2">Prizes</p>
              <p className="text-sm text-gray-600">Cash prizes & certificates</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <FaUsers className="text-green-600 text-2xl mx-auto" />
              <p className="font-semibold mt-2">Participants</p>
              <p className="text-sm text-gray-600">Open to everyone</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <FaMicrophone className="text-blue-600 text-2xl mx-auto" />
              <p className="font-semibold mt-2">Categories</p>
              <p className="text-sm text-gray-600">Multiple age groups</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}