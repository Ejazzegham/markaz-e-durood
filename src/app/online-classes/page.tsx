import Link from 'next/link'
import { FaChalkboardTeacher, FaBook, FaGlobe, FaUsers, FaArrowRight } from 'react-icons/fa'

export default function OnlineClasses() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-green-900 text-center mb-4 flex items-center justify-center gap-3">
          <FaChalkboardTeacher className="text-yellow-500" />
          Online Classes
        </h1>
        <p className="text-gray-600 text-center mb-12">Quality Islamic education from anywhere in the world</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Arabic Classes', icon: <FaBook />, desc: 'Learn Arabic language with expert teachers', link: '/online-classes/arabic' },
            { title: 'Urdu Classes', icon: <FaBook />, desc: 'Master Urdu language and literature', link: '/online-classes/urdu' },
            { title: 'BS Classes', icon: <FaUsers />, desc: 'Bachelor of Science Islamic Studies', link: '/online-classes/bs' },
            { title: 'English Medium', icon: <FaGlobe />, desc: 'Islamic education in English', link: '/online-classes/english-medium' },
            { title: 'Online Recitation', icon: <FaBook />, desc: 'Learn Quran recitation with Tajweed', link: '/online-classes/recitation' },
            { title: 'Naat Competition', icon: <FaUsers />, desc: 'Participate in Naat competitions', link: '/online-classes/naat-competition' }
          ].map((item, i) => (
            <Link href={item.link} key={i}>
              <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-4xl text-green-600 mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-green-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.desc}</p>
                <span className="inline-flex items-center gap-2 text-green-600 font-semibold">
                  Learn More <FaArrowRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}