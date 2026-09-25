import { useEffect, useRef, useState, useCallback } from 'react'

interface PlayableAyah {
  number: number
  audio?: string
}

/**
 * Drives a single shared <audio> element for a list of ayahs — keeps only
 * one ayah playing at a time and can auto-advance through the whole list
 * ("play full surah"), which a separate <audio> per ayah card can't do
 * cleanly.
 */
export function useAyahAudioPlayer(ayahs: PlayableAyah[]) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playingNumber, setPlayingNumber] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [continuous, setContinuous] = useState(false)
  const continuousRef = useRef(false)
  const ayahsRef = useRef(ayahs)
  ayahsRef.current = ayahs

  useEffect(() => {
    if (typeof window === 'undefined') return
    const audio = new Audio()
    audioRef.current = audio

    const handleEnded = () => {
      if (continuousRef.current) {
        const list = ayahsRef.current
        const idx = list.findIndex((a) => String(a.number) === audio.dataset.ayahNumber)
        const next = list[idx + 1]
        if (next?.audio) {
          playAyah(next.number, next.audio)
          return
        }
      }
      setPlayingNumber(null)
    }
    const handleWaiting = () => setIsLoading(true)
    const handlePlaying = () => setIsLoading(false)

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('playing', handlePlaying)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('playing', handlePlaying)
      audio.pause()
      audioRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const playAyah = useCallback((number: number, url: string) => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = url
    audio.dataset.ayahNumber = String(number)
    setIsLoading(true)
    audio
      .play()
      .then(() => setPlayingNumber(number))
      .catch(() => {
        setIsLoading(false)
        setPlayingNumber(null)
      })
  }, [])

  const toggle = useCallback(
    (number: number, url?: string) => {
      if (!url) return
      const audio = audioRef.current
      if (!audio) return
      if (playingNumber === number && !audio.paused) {
        audio.pause()
        setPlayingNumber(null)
        return
      }
      playAyah(number, url)
    },
    [playingNumber, playAyah]
  )

  const stop = useCallback(() => {
    continuousRef.current = false
    setContinuous(false)
    const audio = audioRef.current
    if (audio) audio.pause()
    setPlayingNumber(null)
  }, [])

  const playAll = useCallback(() => {
    const first = ayahsRef.current.find((a) => a.audio)
    if (!first?.audio) return
    continuousRef.current = true
    setContinuous(true)
    playAyah(first.number, first.audio)
  }, [playAyah])

  return { playingNumber, isLoading, continuous, toggle, stop, playAll }
}
