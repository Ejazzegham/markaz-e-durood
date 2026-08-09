import { FaYoutube, FaExternalLinkAlt } from 'react-icons/fa'

// ============================================================
// YOUTUBE CHANNEL SECTION — one simple embedded box
// ============================================================
// A single official YouTube embed (the channel's full uploads playlist),
// the same way a Facebook Page Plugin shows a whole page in one widget.
// No custom shorts row, no custom comments panel, no separate video
// grid — just one native YouTube box with the player and the full
// video list built in, plus a button to the channel itself.
//
// Nothing here needs an API key or server calls, since it's a public
// embed rather than the YouTube Data API.
// ============================================================

const YOUTUBE_CHANNEL_URL = 'https://www.youtube.com/@SultanFiazulHassan-Qadri'

// Channel's uploads playlist = channel id with "UC" swapped for "UU".
const CHANNEL_ID = 'UCLFXZpwfGcxsCB-nzCRyI1A'
const UPLOADS_PLAYLIST_ID = `UU${CHANNEL_ID.slice(2)}`

export default function YouTubeChannelSection() {
  return (
    <section
      id="youtube-channel"
      className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-10 overflow-hidden scroll-mt-20"
      style={{ background: 'linear-gradient(to bottom, #02070d, #071018)' }}
    >
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
              <FaYoutube className="text-red-500 text-xs" />
              <span className="text-red-400 text-xs font-medium tracking-wider">OUR CHANNEL</span>
            </div>
          </div>
          <h2 className="text-gold-500 text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Watch on YouTube
          </h2>
          <div className="flex justify-center mb-5">
            <div className="w-20 h-[2px] bg-gold-500" />
          </div>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto">
            Browse the whole channel right here — every video, one place.
          </p>
        </div>

        {/* ---------------- Single embedded channel box ---------------- */}
        <div className="rounded-2xl overflow-hidden border border-gold-500/20 bg-black shadow-2xl shadow-black/40">
          <iframe
            src={`https://www.youtube.com/embed/videoseries?list=${UPLOADS_PLAYLIST_ID}&rel=0`}
            title="Markaz-e-Durood — YouTube channel"
            className="w-full aspect-video sm:aspect-[16/8]"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="flex justify-center mt-8">
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gold-500 hover:bg-gold-600 text-black px-6 py-3 rounded-lg font-semibold transition-all text-sm"
          >
            Subscribe on YouTube <FaExternalLinkAlt className="text-xs" />
          </a>
        </div>
      </div>
    </section>
  )
}
