import { FaApple, FaGooglePlay, FaMobileAlt } from 'react-icons/fa'

// Homepage "Get the App" call to action, placed after the newsletter
// section and just above the footer.
//
// IMPORTANT — placeholder links:
// The href values below (APP_STORE_URL / PLAY_STORE_URL) are placeholders.
// Once the Markaz-e-Durood app is published, replace them with the real
// App Store and Google Play listing URLs, e.g.
//   https://apps.apple.com/app/idXXXXXXXXXX
//   https://play.google.com/store/apps/details?id=com.yourcompany.app
const APP_STORE_URL = '#'
const PLAY_STORE_URL = '#'

export default function DownloadAppSection() {
  return (
    <section className="relative py-16 px-4 overflow-hidden bg-gradient-to-b from-green-950 via-green-900 to-green-950">
      {/* Decorative glows — matches the look used elsewhere on the home page */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-gold-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/20">
            <FaMobileAlt className="text-gold-500 text-xs" />
            <span className="text-gold-500 text-xs font-medium tracking-wider">GET THE APP</span>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Take Markaz-e-Durood <span className="text-gold-500">Wherever You Go</span>
        </h2>
        <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto mb-8">
          Recite, count and share Durood Shareef on the go. Download the app for Android and iOS.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* App Store badge */}
          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-black hover:bg-gray-900 border border-white/15 hover:border-gold-500/40 rounded-xl px-5 py-3 transition-all"
          >
            <FaApple className="text-white text-3xl shrink-0" />
            <span className="text-left leading-tight">
              <span className="block text-[10px] text-gray-300">Download on the</span>
              <span className="block text-lg font-semibold text-white -mt-0.5">App Store</span>
            </span>
          </a>

          {/* Google Play badge */}
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-black hover:bg-gray-900 border border-white/15 hover:border-gold-500/40 rounded-xl px-5 py-3 transition-all"
          >
            <FaGooglePlay className="text-white text-2xl shrink-0" />
            <span className="text-left leading-tight">
              <span className="block text-[10px] text-gray-300">GET IT ON</span>
              <span className="block text-lg font-semibold text-white -mt-0.5">Google Play</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
