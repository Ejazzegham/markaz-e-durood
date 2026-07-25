import Link from 'next/link'
import { getDb } from '@/lib/db/firestore'
import { FaBookOpen, FaMicrophone, FaHeart, FaImages, FaHeadphones, FaVideo, FaBlog, FaNewspaper, FaQuestionCircle, FaArrowRight } from 'react-icons/fa'

export default async function AdminDashboardPage() {
  const db = getDb()
  const count = async (col: string) => (await db.collection(col).count().get()).data().count

  const [books, naat, bayan, gallery, audio, video, blog, news, faq] = await Promise.all([
    count('bookResources'),
    count('naats'),
    count('bayans'),
    count('galleryImages'),
    count('audioResources'),
    count('videoResources'),
    count('blogPosts'),
    count('news'),
    count('faqs'),
  ])

  const cards = [
    { href: '/admin/books', label: 'Books', count: books, icon: FaBookOpen, color: 'text-blue-400 bg-blue-500/10' },
    { href: '/admin/naat', label: 'Naat Shareef', count: naat, icon: FaMicrophone, color: 'text-red-400 bg-red-500/10' },
    { href: '/admin/bayan', label: 'Bayan', count: bayan, icon: FaHeart, color: 'text-pink-400 bg-pink-500/10' },
    { href: '/admin/audio', label: 'Audio Library', count: audio, icon: FaHeadphones, color: 'text-purple-400 bg-purple-500/10' },
    { href: '/admin/video', label: 'Video Library', count: video, icon: FaVideo, color: 'text-orange-400 bg-orange-500/10' },
    { href: '/admin/pictures', label: 'Pictures', count: gallery, icon: FaImages, color: 'text-green-400 bg-green-500/10' },
    { href: '/admin/blog', label: 'Blog', count: blog, icon: FaBlog, color: 'text-cyan-400 bg-cyan-500/10' },
    { href: '/admin/news', label: 'News', count: news, icon: FaNewspaper, color: 'text-amber-400 bg-amber-500/10' },
    { href: '/admin/faq', label: 'FAQ', count: faq, icon: FaQuestionCircle, color: 'text-teal-400 bg-teal-500/10' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-8">Manage the content shown across your site.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-gold-500/30 transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${card.color}`}>
                <Icon className="text-lg" />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{card.count}</p>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-sm">{card.label}</p>
                <FaArrowRight className="text-gray-600 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all text-xs" />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
