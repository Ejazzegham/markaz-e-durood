import Image from 'next/image'
import type { SurahMeta } from '@/lib/quran/surahs'

// Makki Surahs get the Kaaba (Makkah) icon, Madani Surahs get the Masjid-e-
// Nabawi (Madina) icon — a quick visual cue anywhere a Surah's revelation
// type is shown (the Surah list, the Surah reading header, etc).
const REVELATION_ICON: Record<SurahMeta['revelationType'], { src: string; alt: string }> = {
  Makki: { src: '/quran/makkah-icon.png', alt: 'Makkah — Makki Surah' },
  Madani: { src: '/quran/madina-icon.png', alt: 'Madina — Madani Surah' },
}

export default function RevelationIcon({
  type,
  size = 14,
  className = '',
}: {
  type: SurahMeta['revelationType']
  size?: number
  className?: string
}) {
  const icon = REVELATION_ICON[type]
  return (
    <Image
      src={icon.src}
      alt={icon.alt}
      width={size}
      height={size}
      className={`rounded-[3px] object-contain flex-shrink-0 ${className}`}
    />
  )
}
