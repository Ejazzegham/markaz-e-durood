import Link from 'next/link'
import { FaMicrophone, FaMusic, FaHeart, FaPlay } from 'react-icons/fa'

export default function MarkazENaat() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-900 text-center mb-4 flex items-center justify-center gap-3">
          <FaMicrophone className="text-yellow-500" />
          Markaz-e-Naat
        </h1>
        <p className="text-gray-600 text-center mb-12">Beautiful Naat recitations and poetry in praise of Prophet Muhammad (PBUH)</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {naatList.map((naat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <div className="text-4xl mb-4">🎵</div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">{naat.title}</h3>
              <p className="text-gray-600 text-sm mb-2">By: {naat.reciter}</p>
              <p className="text-gray-500 text-sm mb-4">{naat.duration}</p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                <FaPlay /> Listen Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const naatList = [
  { title: 'Tajdar-e-Haram', reciter: 'Atif Aslam', duration: '8:30' },
  { title: 'Madina Ya Madina', reciter: 'Junaid Jamshed', duration: '6:45' },
  { title: 'Mere Nabi', reciter: 'Qari Waheed Zafar', duration: '5:20' },
  { title: 'Nabi Ka Roza', reciter: 'Owais Raza Qadri', duration: '7:15' },
  { title: 'Darood o Salaam', reciter: 'Various Artists', duration: '10:00' },
  { title: 'Madani Munawwara', reciter: 'Syed Fasihuddin', duration: '4:50' }
]