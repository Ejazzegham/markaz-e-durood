'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FaMapMarkerAlt,
  FaBell,
  FaBellSlash,
  FaPlay,
  FaStop,
  FaCompass,
  FaCloudSun,
  FaSun,
  FaCloudMoon,
  FaMoon,
  FaLocationArrow,
  FaSpinner,
} from 'react-icons/fa'
import { Coordinates, Qibla } from 'adhan'
import PremiumSelect from '@/components/ui/PremiumSelect'
import { WORLD_CITIES, DEFAULT_CITY_ID, findCityById } from '@/lib/prayer/cities'
import {
  computePrayerTimes,
  formatClockTime,
  formatCountdown,
  METHOD_OPTIONS,
  AZAN_PRAYERS,
  PRAYER_LABELS,
  type MethodKey,
  type MadhabKey,
  type PrayerKey,
} from '@/lib/prayer/compute'

const MUTE_STORAGE_KEY = 'markaz-azan-muted'
const METHOD_STORAGE_KEY = 'markaz-azan-method'
const MADHAB_STORAGE_KEY = 'markaz-azan-madhab'

const PRAYER_ICONS: Record<PrayerKey, React.ReactNode> = {
  fajr: <FaCloudSun />,
  sunrise: <FaSun />,
  dhuhr: <FaSun />,
  asr: <FaCloudSun />,
  maghrib: <FaCloudMoon />,
  isha: <FaMoon />,
}

type LocationSource = 'locating' | 'auto' | 'manual' | 'denied'

const CITY_OPTIONS = WORLD_CITIES.map((c) => ({ value: c.id, label: `${c.name}, ${c.country}` }))
const MADHAB_OPTIONS = [
  { value: 'Hanafi', label: 'Hanafi (later Asr)' },
  { value: 'Shafi', label: "Shafi'i / Maliki / Hanbali" },
]

export default function PrayerTimesSection() {
  const [now, setNow] = useState<Date | null>(null)
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null)
  const [timeZone, setTimeZone] = useState<string | undefined>(undefined)
  const [locationLabel, setLocationLabel] = useState('Locating your position...')
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null)
  const [locationSource, setLocationSource] = useState<LocationSource>('locating')

  const [method, setMethod] = useState<MethodKey>('Karachi')
  const [madhab, setMadhab] = useState<MadhabKey>('Hanafi')
  const [muted, setMuted] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  const [nowPlaying, setNowPlaying] = useState<PrayerKey | null>(null)
  const [previewing, setPreviewing] = useState<PrayerKey | null>(null)
  const [needsUnlock, setNeedsUnlock] = useState<PrayerKey | null>(null)

  const fajrAudioRef = useRef<HTMLAudioElement | null>(null)
  const regularAudioRef = useRef<HTMLAudioElement | null>(null)
  const playedTodayRef = useRef<Set<string>>(new Set())

  // ---- Load persisted preferences (mute / method / madhab) ----------------
  useEffect(() => {
    try {
      const storedMute = localStorage.getItem(MUTE_STORAGE_KEY)
      if (storedMute) setMuted(storedMute === 'true')
      const storedMethod = localStorage.getItem(METHOD_STORAGE_KEY)
      if (storedMethod && METHOD_OPTIONS.some((m) => m.key === storedMethod)) {
        setMethod(storedMethod as MethodKey)
      }
      const storedMadhab = localStorage.getItem(MADHAB_STORAGE_KEY)
      if (storedMadhab === 'Hanafi' || storedMadhab === 'Shafi') setMadhab(storedMadhab)
    } catch {
      // localStorage unavailable — defaults are fine
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(MUTE_STORAGE_KEY, String(muted))
    } catch {}
  }, [muted, hydrated])
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(METHOD_STORAGE_KEY, method)
    } catch {}
  }, [method, hydrated])
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(MADHAB_STORAGE_KEY, madhab)
    } catch {}
  }, [madhab, hydrated])

  // ---- Ticking clock (drives the live countdown) ---------------------------
  useEffect(() => {
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  function applyCity(cityId: string) {
    const city = findCityById(cityId)
    if (!city) return
    setCoords({ latitude: city.latitude, longitude: city.longitude })
    setTimeZone(city.timezone)
    setLocationLabel(`${city.name}, ${city.country}`)
    setSelectedCityId(cityId)
  }

  function detectLocation() {
    setLocationSource('locating')
    setLocationLabel('Locating your position...')
    if (typeof window === 'undefined' || !navigator.geolocation) {
      applyCity(DEFAULT_CITY_ID)
      setLocationSource('denied')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude })
        setTimeZone(undefined) // browser's own local timezone matches its own location
        setLocationLabel('Your Location')
        setSelectedCityId(null)
        setLocationSource('auto')
      },
      () => {
        applyCity(DEFAULT_CITY_ID)
        setLocationSource('denied')
      },
      { timeout: 8000, maximumAge: 10 * 60 * 1000 }
    )
  }

  // Detect once on mount
  useEffect(() => {
    detectLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleCityChange(cityId: string) {
    setLocationSource('manual')
    applyCity(cityId)
  }

  // ---- Compute today's (and tomorrow's Fajr) prayer times -----------------
  const dateKey = now ? `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}` : ''
  const computed = useMemo(() => {
    if (!coords || !now) return null
    return computePrayerTimes(coords.latitude, coords.longitude, method, madhab, now, timeZone)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coords?.latitude, coords?.longitude, method, madhab, timeZone, dateKey])

  const qiblaDegrees = useMemo(() => {
    if (!coords) return null
    return Math.round(Qibla(new Coordinates(coords.latitude, coords.longitude)))
  }, [coords?.latitude, coords?.longitude])

  const { rows, currentPrayer, nextKey, nextTime } = useMemo(() => {
    if (!computed || !now) {
      return { rows: [], currentPrayer: 'none' as const, nextKey: null as PrayerKey | null, nextTime: null as Date | null }
    }
    const rows = (Object.keys(PRAYER_LABELS) as PrayerKey[]).map((key) => ({
      key,
      label: PRAYER_LABELS[key],
      time: computed.today.timeForPrayer(key) as Date,
    }))
    const current = computed.today.currentPrayer(now)
    const nextRaw = computed.today.nextPrayer(now)
    const nextKey: PrayerKey = nextRaw === 'none' ? 'fajr' : nextRaw
    const nextTime: Date = nextRaw === 'none' ? computed.tomorrowFajr : (computed.today.timeForPrayer(nextRaw) as Date)
    return { rows, currentPrayer: current, nextKey, nextTime }
  }, [computed, now])

  // ---- Schedule automatic Azan playback for today's remaining prayers -----
  useEffect(() => {
    if (!computed) return
    const timeouts: ReturnType<typeof setTimeout>[] = []
    const nowMs = Date.now()

    AZAN_PRAYERS.forEach((key) => {
      const time = computed.today.timeForPrayer(key) as Date | null
      if (!time) return
      const fireKey = `${dateKey}-${key}`
      const delay = time.getTime() - nowMs
      if (delay < 0 || delay > 24 * 60 * 60 * 1000) return
      if (playedTodayRef.current.has(fireKey)) return

      const timeout = setTimeout(() => {
        playedTodayRef.current.add(fireKey)
        triggerAzan(key)
      }, delay)
      timeouts.push(timeout)
    })

    return () => timeouts.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [computed, dateKey, muted])

  function triggerAzan(key: PrayerKey) {
    if (muted) return
    const audio = key === 'fajr' ? fajrAudioRef.current : regularAudioRef.current
    if (!audio) return
    stopAudio()
    audio.currentTime = 0
    setNowPlaying(key)
    audio.play().catch(() => {
      setNowPlaying(null)
      setNeedsUnlock(key)
    })
  }

  function stopAudio() {
    fajrAudioRef.current?.pause()
    regularAudioRef.current?.pause()
    if (fajrAudioRef.current) fajrAudioRef.current.currentTime = 0
    if (regularAudioRef.current) regularAudioRef.current.currentTime = 0
    setNowPlaying(null)
    setPreviewing(null)
  }

  function previewAzan(key: PrayerKey) {
    if (previewing === key || nowPlaying === key) {
      stopAudio()
      return
    }
    stopAudio()
    const audio = key === 'fajr' ? fajrAudioRef.current : regularAudioRef.current
    if (!audio) return
    audio.currentTime = 0
    setNeedsUnlock(null)
    setPreviewing(key)
    audio.play().catch(() => setPreviewing(null))
  }

  function confirmUnlock() {
    if (!needsUnlock) return
    const key = needsUnlock
    setNeedsUnlock(null)
    const audio = key === 'fajr' ? fajrAudioRef.current : regularAudioRef.current
    if (!audio) return
    audio.currentTime = 0
    setNowPlaying(key)
    audio.play().catch(() => setNowPlaying(null))
  }

  // Clear the "now playing" / "previewing" flags once a clip finishes
  useEffect(() => {
    const a = fajrAudioRef.current
    const b = regularAudioRef.current
    const onEnd = () => {
      setNowPlaying(null)
      setPreviewing(null)
    }
    a?.addEventListener('ended', onEnd)
    b?.addEventListener('ended', onEnd)
    return () => {
      a?.removeEventListener('ended', onEnd)
      b?.removeEventListener('ended', onEnd)
    }
  }, [])

  const isLoading = !now || !coords

  return (
    <div className="relative bg-gradient-to-b from-green-850/90 to-green-850/60 border border-gold-500/20 rounded-2xl p-5 sm:p-7 shadow-lg shadow-black/20">
      {/* Hidden audio elements — Fajr gets its own (longer) Azan */}
      <audio ref={fajrAudioRef} src="/audio/azan-fajr.mp3" preload="auto" />
      <audio ref={regularAudioRef} src="/audio/azan.mp3" preload="auto" />

      {/* Header: title + mute toggle */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/20 text-gold-500">
            <FaBell className="text-sm" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg leading-tight">Prayer Times</h3>
            <p className="text-gray-500 text-[11px]">Worldwide — with Azan</p>
          </div>
        </div>

        <button
          onClick={() => setMuted((m) => !m)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-colors ${
            muted
              ? 'bg-white/5 border-white/15 text-gray-400 hover:border-white/30'
              : 'bg-gold-500/10 border-gold-500/30 text-gold-400 hover:bg-gold-500/15'
          }`}
          aria-pressed={muted}
        >
          {muted ? <FaBellSlash /> : <FaBell />}
          {muted ? 'Azan Muted' : 'Azan Alerts On'}
        </button>
      </div>

      {/* Location + city picker */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2 text-white text-sm font-medium">
          {locationSource === 'locating' ? (
            <FaSpinner className="text-gold-500 animate-spin text-xs" />
          ) : (
            <FaMapMarkerAlt className="text-gold-500 text-xs" />
          )}
          <span className="truncate max-w-[200px]">{locationLabel}</span>
          {locationSource === 'auto' && (
            <span className="text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full shrink-0">Auto-detected</span>
          )}
        </div>

        <PremiumSelect
          className="w-full sm:w-64"
          value={selectedCityId ?? ''}
          onChange={handleCityChange}
          options={CITY_OPTIONS}
          placeholder="Choose a city..."
          icon={<FaMapMarkerAlt className="text-xs" />}
        />

        {locationSource !== 'auto' && (
          <button
            onClick={detectLocation}
            className="flex items-center gap-1.5 text-gold-400 hover:text-gold-300 text-xs font-medium"
          >
            <FaLocationArrow className="text-[10px]" />
            Use my location
          </button>
        )}
      </div>

      {/* Method + Madhab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        <div>
          <label className="text-gray-500 text-[11px] uppercase tracking-wider mb-1 block">Calculation Method</label>
          <PremiumSelect
            value={method}
            onChange={(v) => setMethod(v as MethodKey)}
            options={METHOD_OPTIONS.map((m) => ({ value: m.key, label: m.label }))}
          />
        </div>
        <div>
          <label className="text-gray-500 text-[11px] uppercase tracking-wider mb-1 block">Madhab (Asr time)</label>
          <PremiumSelect value={madhab} onChange={(v) => setMadhab(v as MadhabKey)} options={MADHAB_OPTIONS} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-14 text-gray-500 text-sm gap-2">
          <FaSpinner className="animate-spin" /> Calculating prayer times...
        </div>
      ) : (
        <>
          {/* Next prayer banner */}
          {nextKey && nextTime && now && (
            <div className="flex items-center justify-between gap-3 mb-4 px-4 py-3 rounded-xl bg-gradient-to-r from-gold-500/15 to-transparent border border-gold-500/25">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-gold-500/80 font-semibold">Next Prayer</p>
                <p className="text-white text-base font-bold">{PRAYER_LABELS[nextKey]}</p>
              </div>
              <div className="text-right">
                <p className="text-gold-400 text-xl font-bold tabular-nums">{formatClockTime(nextTime, timeZone)}</p>
                <p className="text-gray-400 text-xs">in {formatCountdown(nextTime, now)}</p>
              </div>
            </div>
          )}

          {/* Prayer rows */}
          <div className="space-y-2">
            {rows.map((row) => {
              const isCurrent = row.key === currentPrayer
              const isNext = row.key === nextKey
              const canAzan = AZAN_PRAYERS.includes(row.key)
              const isActiveAudio = previewing === row.key || nowPlaying === row.key

              return (
                <div
                  key={row.key}
                  className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition-colors ${
                    isCurrent
                      ? 'bg-gold-500/15 border-gold-500/40'
                      : isNext
                      ? 'border-gold-500/20 bg-gold-500/5'
                      : 'border-white/5 bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`text-base shrink-0 ${isCurrent || isNext ? 'text-gold-400' : 'text-gray-500'}`}>
                      {PRAYER_ICONS[row.key]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-white text-sm font-semibold">{row.label}</p>
                      {isCurrent && <p className="text-green-400 text-[10px] font-medium">Current</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-white text-sm sm:text-base font-bold tabular-nums">
                      {formatClockTime(row.time, timeZone)}
                    </span>
                    {canAzan && (
                      <button
                        onClick={() => previewAzan(row.key)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors ${
                          isActiveAudio
                            ? 'bg-gold-500 border-gold-500 text-green-950'
                            : 'bg-white/5 border-white/15 text-gray-400 hover:border-gold-500/40 hover:text-gold-400'
                        }`}
                        aria-label={`${isActiveAudio ? 'Stop' : 'Preview'} ${row.label} Azan`}
                        title={`${isActiveAudio ? 'Stop' : 'Preview'} Azan`}
                      >
                        {isActiveAudio ? <FaStop className="text-xs" /> : <FaPlay className="text-[10px]" />}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Now playing banner */}
          {nowPlaying && (
            <div className="flex items-center justify-between gap-3 mt-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/30">
              <p className="text-white text-sm flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                Playing Azan — {PRAYER_LABELS[nowPlaying]}
              </p>
              <button
                onClick={stopAudio}
                className="text-xs font-semibold text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
              >
                Stop
              </button>
            </div>
          )}

          {/* Autoplay-blocked banner */}
          {needsUnlock && (
            <div className="flex items-center justify-between gap-3 mt-4 px-4 py-3 rounded-xl bg-gold-500/15 border border-gold-500/40">
              <p className="text-white text-sm">
                It&apos;s time for <b>{PRAYER_LABELS[needsUnlock]}</b> — tap to play the Azan.
              </p>
              <button
                onClick={confirmUnlock}
                className="text-xs font-semibold text-green-950 bg-gold-500 hover:bg-gold-600 px-3 py-1.5 rounded-lg shrink-0"
              >
                Play Azan
              </button>
            </div>
          )}

          {/* Qibla + footnote */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4 border-t border-gold-500/10">
            {qiblaDegrees !== null && (
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <FaCompass className="text-gold-500" style={{ transform: `rotate(${qiblaDegrees}deg)` }} />
                Qibla: {qiblaDegrees}&deg; from North
              </div>
            )}
            <p className="text-gray-600 text-[10px]">
              Azan plays automatically while this tab stays open — some browsers require one tap on the page first.
            </p>
          </div>
        </>
      )}
    </div>
  )
}
