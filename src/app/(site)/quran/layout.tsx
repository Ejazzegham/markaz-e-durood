import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { QuranSettingsProvider } from '@/contexts/QuranSettingsContext'

export const metadata: Metadata = {
  title: "Quran Pak",
  description:
    "Read or listen to Quran Pak online with Urdu & English Tarjuma (translation) and Tafseer — browse by Surah or Para, choose a reciter, and bookmark your place.",
}

export default function QuranLayout({ children }: { children: ReactNode }) {
  return <QuranSettingsProvider>{children}</QuranSettingsProvider>
}
