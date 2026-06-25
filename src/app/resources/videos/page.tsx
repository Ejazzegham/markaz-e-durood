import Link from 'next/link'
import { FaVideo, FaPlay, FaClock, FaArrowLeft, FaFilm } from 'react-icons/fa'

export default function Videos() {
  return (
    <div className="min-h-screen bg-green-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-8 transition-colors">
          <FaArrowLeft /> Back to Home
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center gap-3">
          <FaVideo className="text-yellow-400" />
          Videos
        </h1>
        <p className="text-gray-300 mb-12">Watch Islamic videos, Naat performances and educational content.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((item, index) => (
            <div key={index} className="bg-green-800/50 rounded-xl overflow-hidden border border-green-700 hover:border-yellow-500/50 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="aspect-video bg-green-700 flex items-center justify-center relative">
                <FaFilm className="text-6xl text-yellow-400" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center">
                    <FaPlay className="text-green-900 text-xl ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-gray-300 text-sm">{item.description}</p>
                <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                  <FaClock className="text-yellow-400" /> {item.duration}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const videos = [
  {
    title: 'Durood & Its Blessings',
    description: 'Learn about the blessings of sending Durood',
    duration: '15:30'
  },
  {
    title: 'Beautiful Naat Performance',
    description: 'Heart-touching Naat about Prophet ﷺ',
    duration: '8:45'
  },
  {
    title: 'Islamic Lecture - Part 1',
    description: 'Life-changing Islamic lecture',
    duration: '45:00'
  },
  {
    title: 'Durood Healing',
    description: 'How Durood heals the heart',
    duration: '22:15'
  },
  {
    title: 'Naat Competition Highlights',
    description: 'Best performances from the competition',
    duration: '35:20'
  },
  {
    title: 'Spiritual Reminders',
    description: 'Daily Islamic reminders',
    duration: '12:00'
  }
]