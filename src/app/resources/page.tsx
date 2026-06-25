import Link from 'next/link'
import { 
  FaHeadphones, 
  FaBook, 
  FaVideo, 
  FaBlog, 
  FaQuran,
  FaFilePdf,
  FaPlayCircle,
  FaBookOpen
} from 'react-icons/fa'
import { MdLibraryMusic, MdMenuBook } from 'react-icons/md'

export default function Resources() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-900 mb-4 text-center flex items-center justify-center gap-3">
          <MdLibraryMusic className="text-yellow-500" />
          Our Resources
        </h1>
        <p className="text-gray-600 text-center mb-12 text-lg">
          Explore our collection of Islamic resources to learn and grow
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <Link href={resource.link} key={index}>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-5xl text-green-600 mb-4">{resource.icon}</div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                  Explore → 
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 bg-green-900 rounded-xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400">500+</div>
              <div className="text-green-300">Audio Files</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">250+</div>
              <div className="text-green-300">Books & PDFs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">100+</div>
              <div className="text-green-300">Videos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">50+</div>
              <div className="text-green-300">Blog Articles</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const resources = [
  {
    icon: <FaQuran />,
    title: 'Durood Shareef',
    description: 'Read and learn authentic Durood with meanings and translations.',
    link: '/resources/durood'
  },
  {
    icon: <FaHeadphones />,
    title: 'Audio Library',
    description: 'Listen to beautiful recitations of Durood and Islamic nasheeds.',
    link: '/resources/audio'
  },
  {
    icon: <FaFilePdf />,
    title: 'Books & PDFs',
    description: 'Download authentic Islamic books and PDFs for free.',
    link: '/resources/books'
  },
  {
    icon: <FaVideo />,
    title: 'Videos',
    description: 'Watch Islamic videos, lectures, and educational content.',
    link: '/resources/videos'
  },
  {
    icon: <FaBlog />,
    title: 'Articles & Blog',
    description: 'Read beneficial articles and Islamic insights.',
    link: '/resources/blog'
  },
  {
    icon: <FaBookOpen />,
    title: 'Ask & Learn',
    description: 'Get answers to your Islamic questions from scholars.',
    link: '/resources/ask'
  }
]