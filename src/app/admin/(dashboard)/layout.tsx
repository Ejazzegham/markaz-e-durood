import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_COOKIE_NAME, verifyAdminToken } from '@/lib/auth/jwt'
import AdminSidebar from './AdminSidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value
  const admin = token ? await verifyAdminToken(token) : null

  // Middleware already guards this, but bail out gracefully if this layout
  // is ever reached without a valid session.
  if (!admin) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar adminName={admin.name} adminEmail={admin.email} />
      <main className="flex-1 min-w-0 lg:pl-64">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
