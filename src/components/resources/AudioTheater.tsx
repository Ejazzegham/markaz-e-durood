'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import {
  FaPlay,
  FaPause,
  FaSpinner,
  FaYoutube,
  FaClock,
  FaUser,
  FaShareAlt,
  FaCheck,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaHeadphonesAlt,
} from 'react-icons/fa'
import type { PlayableItem } from './YoutubeStyleTheater'

interface AudioTheaterProps {
  items: PlayableItem[]
  loading: boolean
  emptyMessage: string
  /** e.g. "Audio" — used in labels */
  kindLabel: string
  /** e.g. "Reciter" — label shown before the subtitle on the main player */
  subtitleFieldLabel?: string
  accentIcon?: React.ReactNode
}

// The YouTube IFrame API is loaded once per page and shared if something
// else on the page also needs it.
let ytApiPromise: Promise<void> | null = null
function loadYoutubeIframeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if ((window as any).YT && (window as any).YT.Player) return Promise.resolve()
  if (ytApiPromise) return ytApiPromise

  ytApiPromise = new Promise((resolve) => {
    const previous = (window as any).onYouTubeIframeAPIReady
    ;(window as any).onYouTubeIframeAPIReady = () => {
      if (typeof previous === 'function') previous()
      resolve()
    }
    if (!document.getElementById('youtube-iframe-api-script')) {
      const tag = document.createElement('script')
      tag.id = 'youtube-iframe-api-script'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
  return ytApiPromise
}

function thumbFor(item: PlayableItem) {
  return item.thumbnailUrl || `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AudioTheater({
  items,
  loading,
  emptyMessage,
  kindLabel,
  subtitleFieldLabel = 'By',
  accentIcon,
}: AudioTheaterProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [playerReady, setPlayerReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)

  const playerRef = useRef<any>(null)
  const containerTopRef = useRef<HTMLDivElement>(null)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const initializedRef = useRef(false)
  const seekingRef = useRef(false)

  const active = items.find((i) => i.id === activeId) || items[0]

  // Pick the first item as active once data arrives
  useEffect(() => {
    if (!activeId && items.length > 0) {
      setActiveId(items[0].id)
    }
  }, [items, activeId])

  const startPolling = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(() => {
      const p = playerRef.current
      if (!p || typeof p.getCurrentTime !== 'function') return
      if (!seekingRef.current) setCurrentTime(p.getCurrentTime() || 0)
      const d = p.getDuration()
      if (d) setDuration(d)
    }, 400)
  }, [])

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [])

  // Initialize the hidden YouTube player once the API is ready and we
  // have a first track to cue.
  useEffect(() => {
    if (initializedRef.current || !active) return
    initializedRef.current = true

    loadYoutubeIframeApi().then(() => {
      const YT = (window as any).YT
      playerRef.current = new YT.Player('audio-theater-hidden-player', {
        videoId: active.youtubeId,
        playerVars: { autoplay: 0, controls: 0, playsinline: 1 },
        events: {
          onReady: (e: any) => {
            setPlayerReady(true)
            e.target.setVolume(volume)
            setDuration(e.target.getDuration() || 0)
          },
          onStateChange: (e: any) => {
            const YTState = (window as any).YT.PlayerState
            if (e.data === YTState.PLAYING) {
              setIsPlaying(true)
              setIsBuffering(false)
              setDuration(e.target.getDuration() || 0)
              startPolling()
            } else if (e.data === YTState.PAUSED) {
              setIsPlaying(false)
              stopPolling()
            } else if (e.data === YTState.BUFFERING) {
              setIsBuffering(true)
            } else if (e.data === YTState.ENDED) {
              setIsPlaying(false)
              stopPolling()
              setCurrentTime(0)
              // Auto-advance to the next track, playlist-style
              setActiveId((prevId) => {
                const idx = items.findIndex((i) => i.id === prevId)
                if (idx === -1) return prevId
                const nextItem = items[(idx + 1) % items.length]
                return nextItem.id
              })
            }
          },
        },
      })
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  // When the selected track changes (after the player already exists),
  // load the new video into the same hidden player and auto-play it.
  const prevActiveIdRef = useRef<string | null>(null)
  useEffect(() => {
    if (!playerReady || !active) return
    if (prevActiveIdRef.current === null) {
      prevActiveIdRef.current = active.id
      return
    }
    if (prevActiveIdRef.current === active.id) return
    prevActiveIdRef.current = active.id

    const p = playerRef.current
    if (p && typeof p.loadVideoById === 'function') {
      setCurrentTime(0)
      setDuration(0)
      setIsBuffering(true)
      p.loadVideoById(active.youtubeId)
    }
  }, [active, playerReady])

  useEffect(() => stopPolling, [stopPolling])

  const handleSelect = (item: PlayableItem) => {
    if (item.id === activeId) return
    setActiveId(item.id)
    setCopied(false)
    if (window.innerWidth < 1024 && containerTopRef.current) {
      containerTopRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const togglePlay = () => {
    const p = playerRef.current
    if (!p) return
    if (isPlaying) {
      p.pauseVideo()
    } else {
      p.playVideo()
    }
  }

  const goToOffset = (offset: number) => {
    const idx = items.findIndex((i) => i.id === active?.id)
    if (idx === -1) return
    const nextItem = items[(idx + offset + items.length) % items.length]
    handleSelect(nextItem)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setCurrentTime(val)
  }

  const commitSeek = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const val = parseFloat((e.target as HTMLInputElement).value)
    const p = playerRef.current
    if (p && typeof p.seekTo === 'function') {
      p.seekTo(val, true)
    }
    seekingRef.current = false
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    setVolume(val)
    setIsMuted(val === 0)
    const p = playerRef.current
    if (p && typeof p.setVolume === 'function') {
      p.setVolume(val)
      if (val === 0) p.mute()
      else p.unMute()
    }
  }

  const toggleMute = () => {
    const p = playerRef.current
    if (!p) return
    if (isMuted) {
      p.unMute()
      setIsMuted(false)
    } else {
      p.mute()
      setIsMuted(true)
    }
  }

  const handleShare = () => {
    if (!active) return
    const link = `https://www.youtube.com/watch?v=${active.youtubeId}`
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 text-gray-500 text-sm">
        <FaSpinner className="animate-spin mr-2" /> Loading {kindLabel.toLowerCase()}...
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-400 text-sm">{emptyMessage}</p>
      </div>
    )
  }

  if (!active) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] xl:lg:grid-cols-[minmax(0,1fr)_400px] gap-6 items-start">
      {/* Hidden YouTube player — this is the real audio engine, never shown */}
      <div
        aria-hidden="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', opacity: 0, pointerEvents: 'none' }}
      >
        <div id="audio-theater-hidden-player" />
      </div>

      {/* ============================================
          MAIN AUDIO PLAYER (LEFT)
          ============================================ */}
      <div ref={containerTopRef} className="min-w-0 scroll-mt-28">
        <div className="relative bg-gradient-to-br from-green-825/90 via-green-900/80 to-green-850/90 backdrop-blur-2xl border border-gold-500/20 rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

          <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-5">
            {/* Cover art */}
            <div className="relative w-full sm:w-44 h-44 shrink-0 mx-auto sm:mx-0 rounded-xl overflow-hidden border border-gold-500/20 bg-black shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={active.id}
                src={thumbFor(active)}
                alt={active.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                {isBuffering ? (
                  <FaSpinner className="text-gold-500 text-2xl animate-spin" />
                ) : isPlaying ? (
                  <span className="flex gap-1 items-end h-6">
                    <span className="w-1 h-3 bg-gold-500 rounded-full animate-[wave_0.8s_ease-in-out_infinite]" />
                    <span className="w-1 h-6 bg-gold-500 rounded-full animate-[wave_0.6s_ease-in-out_infinite_0.2s]" />
                    <span className="w-1 h-4 bg-gold-500 rounded-full animate-[wave_0.7s_ease-in-out_infinite_0.4s]" />
                  </span>
                ) : (
                  <button
                    onClick={togglePlay}
                    className="w-12 h-12 bg-gold-500 hover:bg-gold-600 rounded-full flex items-center justify-center transition-colors"
                  >
                    <FaPlay className="text-green-950 ml-0.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Title / meta */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-gold-500 text-[11px] font-semibold uppercase tracking-wide">
                <FaHeadphonesAlt className="text-[10px]" /> Now Playing
              </div>
              <h2 className="mt-1 text-lg md:text-xl font-bold text-white leading-snug line-clamp-2">{active.title}</h2>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400">
                {active.subtitle && (
                  <span className="flex items-center gap-1.5">
                    <FaUser className="text-gold-500 text-[10px]" />
                    {subtitleFieldLabel}: <span className="text-gray-300">{active.subtitle}</span>
                  </span>
                )}
              </div>

              {active.description && (
                <p className="mt-3 text-sm text-gray-400 leading-relaxed line-clamp-3">{active.description}</p>
              )}

              <div className="mt-4 hidden sm:flex flex-wrap items-center gap-2.5">
                <a
                  href={`https://www.youtube.com/watch?v=${active.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600/20 hover:bg-red-600/30 text-white font-semibold text-xs py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-red-500/30"
                >
                  <FaYoutube className="text-red-500" />
                  Source
                </a>
                <button
                  onClick={handleShare}
                  className="bg-gold-500/10 hover:bg-gold-500/20 text-gold-500 font-semibold text-xs py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-gold-500/30"
                >
                  {copied ? <FaCheck /> : <FaShareAlt />}
                  {copied ? 'Link Copied' : 'Share'}
                </button>
              </div>
            </div>
          </div>

          {/* Controls bar */}
          <div className="px-5 sm:px-6 pb-6">
            <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1.5">
              <span className="w-9 text-right tabular-nums">{formatTime(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={duration || 0}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                onChange={handleSeek}
                onMouseDown={() => { seekingRef.current = true }}
                onMouseUp={commitSeek}
                onTouchStart={() => { seekingRef.current = true }}
                onTouchEnd={commitSeek}
                disabled={!playerReady}
                className="flex-1 h-1.5 rounded-full cursor-pointer accent-gold-500 disabled:cursor-not-allowed"
              />
              <span className="w-9 tabular-nums">{formatTime(duration)}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <button
                  onClick={toggleMute}
                  className="text-gold-500 hover:text-white transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 cursor-pointer accent-gold-500"
                />
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => goToOffset(-1)}
                  className="text-gray-400 hover:text-gold-500 transition-colors"
                  title="Previous"
                >
                  <FaStepBackward />
                </button>
                <button
                  onClick={togglePlay}
                  disabled={!playerReady}
                  className="w-11 h-11 rounded-full bg-gold-500 hover:bg-gold-600 disabled:opacity-50 text-green-950 flex items-center justify-center shadow-lg shadow-gold-500/20 transition-colors"
                >
                  {isBuffering ? (
                    <FaSpinner className="animate-spin" />
                  ) : isPlaying ? (
                    <FaPause />
                  ) : (
                    <FaPlay className="ml-0.5" />
                  )}
                </button>
                <button
                  onClick={() => goToOffset(1)}
                  className="text-gray-400 hover:text-gold-500 transition-colors"
                  title="Next"
                >
                  <FaStepForward />
                </button>
              </div>

              <div className="flex-1 hidden sm:block" />
            </div>

            <div className="mt-4 flex sm:hidden flex-wrap items-center gap-2.5">
              <a
                href={`https://www.youtube.com/watch?v=${active.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600/20 hover:bg-red-600/30 text-white font-semibold text-xs py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-red-500/30"
              >
                <FaYoutube className="text-red-500" />
                Source
              </a>
              <button
                onClick={handleShare}
                className="bg-gold-500/10 hover:bg-gold-500/20 text-gold-500 font-semibold text-xs py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-gold-500/30"
              >
                {copied ? <FaCheck /> : <FaShareAlt />}
                {copied ? 'Link Copied' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================
          PLAYLIST (RIGHT) — scrollable, scrollbar hidden
          ============================================ */}
      <div className="min-w-0 lg:sticky lg:top-24">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-sm font-bold text-white tracking-wide">
            {accentIcon}
            <span className="ml-1.5">All {kindLabel}</span>
          </h3>
          <span className="text-[11px] text-gold-500 font-medium">{items.length} items</span>
        </div>

        <div
          className="scrollbar-hide space-y-2.5 overflow-y-auto pr-1 lg:max-h-[calc(100vh-9rem)]"
          style={{ maxHeight: 'min(70vh, 640px)' }}
        >
          {items.map((item) => {
            const isActive = item.id === active.id
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className={`group w-full text-left flex gap-3 rounded-xl p-2 transition-all duration-300 border ${
                  isActive
                    ? 'bg-gold-500/10 border-gold-500/40 shadow-lg shadow-gold-500/5'
                    : 'bg-green-900/30 border-transparent hover:bg-green-900/60 hover:border-gold-500/20'
                }`}
              >
                <div className="relative w-14 h-14 shrink-0 rounded-lg overflow-hidden bg-green-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbFor(item)}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  {isActive ? (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="flex gap-0.5 items-end h-3">
                        <span className="w-0.5 h-1.5 bg-gold-500 animate-[wave_0.8s_ease-in-out_infinite]" />
                        <span className="w-0.5 h-3 bg-gold-500 animate-[wave_0.6s_ease-in-out_infinite_0.2s]" />
                        <span className="w-0.5 h-2 bg-gold-500 animate-[wave_0.7s_ease-in-out_infinite_0.4s]" />
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <FaPlay className="text-gold-500 text-xs" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 py-0.5">
                  <h4
                    className={`text-xs font-semibold leading-snug line-clamp-2 transition-colors ${
                      isActive ? 'text-gold-500' : 'text-white group-hover:text-gold-500'
                    }`}
                  >
                    {item.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-2 flex-wrap">
                    {item.subtitle && (
                      <p className="text-[11px] text-gray-500 flex items-center gap-1 line-clamp-1">
                        <FaUser className="text-gold-500/70 text-[9px] shrink-0" />
                        {item.subtitle}
                      </p>
                    )}
                    {item.duration && (
                      <p className="text-[11px] text-gray-600 flex items-center gap-1">
                        <FaClock className="text-[9px]" />
                        {item.duration}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%,
          100% {
            transform: scaleY(0.5);
          }
          50% {
            transform: scaleY(1);
          }
        }
      `}</style>
    </div>
  )
}
