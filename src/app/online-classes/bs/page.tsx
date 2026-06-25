import Link from 'next/link'
import { FaGraduationCap, FaBook, FaClock, FaArrowLeft } from 'react-icons/fa'

export default function BSClasses() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/online-classes" className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 mb-6">
          <FaArrowLeft /> Back to Classes
        </Link>
        
        <h1 className="text-4xl font-bold text-green-900 mb-4 flex items-center gap-3">
          <FaGraduationCap className="text-yellow-500" />
          BS Classes
        </h1>
        <p className="text-gray-600 mb-8">Bachelor of Science Islamic Studies</p>

        <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <h2 className="text-2xl font-bold text-green-800 mb-3">Program Overview</h2>
            <p className="text-gray-700">Comprehensive degree program in Islamic Studies with modern curriculum.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <FaBook className="text-green-600 text-2xl mx-auto" />
              <p className="font-semibold mt-2">4 Years</p>
              <p className="text-sm text-gray-600">Full Program</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <FaGraduationCap className="text-green-600 text-2xl mx-auto" />
              <p className="font-semibold mt-2">Degree</p>
              <p className="text-sm text-gray-600">B.Sc Islamic Studies</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <FaClock className="text-green-600 text-2xl mx-auto" />
              <p className="font-semibold mt-2">Flexible</p>
              <p className="text-sm text-gray-600">Online Learning</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}