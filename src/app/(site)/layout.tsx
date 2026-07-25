import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import '../globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SplashScreen from '@/components/SplashScreen'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  display: 'swap',
  variable: '--font-playfair',
})

const siteUrl = 'https://www.markaz-e-durood.com'
const siteName = 'Markaz-e-Durood'
const description =
  'Markaz-e-Durood is a global platform dedicated to learning, reciting and spreading the blessings of Durood Shareef upon Prophet Muhammad ﷺ — featuring live durood counting, naat, books, audio, bayan and online classes.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Markaz-e-Durood — Spreading the Blessings of Durood Shareef',
    template: '%s | Markaz-e-Durood',
  },
  description,
  keywords: [
    'Durood Shareef',
    'Salawat',
    'Naat Shareef',
    'Islamic resources',
    'online Quran classes',
    'Markaz-e-Durood',
  ],
  applicationName: siteName,
  authors: [{ name: siteName }],
  robots: { index: true, follow: true },
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName,
    title: 'Markaz-e-Durood — Spreading the Blessings of Durood Shareef',
    description,
    images: [{ url: '/logo.png', width: 512, height: 512, alt: siteName }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Markaz-e-Durood — Spreading the Blessings of Durood Shareef',
    description,
    images: ['/logo.png'],
  },
}

export const viewport: Viewport = {
  themeColor: '#0a1a10',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <SplashScreen>
          <Navbar />
          <div className="pt-16 min-h-screen flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </SplashScreen>
      </body>
    </html>
  )
}