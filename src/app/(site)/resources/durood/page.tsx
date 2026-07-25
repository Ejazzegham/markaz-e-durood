import { FaQuran, FaHeart, FaBook } from 'react-icons/fa'
import Link from 'next/link'

export default function DuroodResources() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/resources" className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 mb-6">
          ← Back to Resources
        </Link>
        
        <h1 className="text-4xl font-bold text-green-900 mb-6 flex items-center gap-3">
          <FaQuran className="text-yellow-500" />
          Durood Shareef
        </h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-3">What is Durood Shareef?</h2>
            <p className="text-gray-700">
              Durood Shareef is a way of sending blessings and salutations upon the Prophet Muhammad (peace be upon him). It is a form of prayer and respect for the beloved Prophet.
            </p>
          </div>

          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-3">Popular Durood</h2>
            <ul className="space-y-3">
              <li className="p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold">Durood Ibrahim</span>
                <p className="text-gray-600 text-sm">The most comprehensive Durood from Quran</p>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold">Durood Tunjina</span>
                <p className="text-gray-600 text-sm">Durood for seeking help and relief</p>
              </li>
              <li className="p-3 bg-gray-50 rounded-lg">
                <span className="font-semibold">Durood Salli Wasallim</span>
                <p className="text-gray-600 text-sm">The most commonly recited Durood</p>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-3 flex items-center gap-2">
              <FaHeart className="text-red-500" />
              Benefits of Sending Durood
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Receives blessings from Allah</li>
              <li>✓ Increases love for the Prophet</li>
              <li>✓ Sins are forgiven</li>
              <li>✓ Ranks are elevated</li>
              <li>✓ Gets closer to the Prophet on Judgement Day</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}