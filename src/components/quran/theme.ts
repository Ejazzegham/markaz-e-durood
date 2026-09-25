import type { QuranTheme } from '@/lib/quran/constants'

export interface QuranThemeClasses {
  panel: string
  arabicText: string
  translationText: string
  tafsirBg: string
  tafsirText: string
  ayahNumberBadge: string
  divider: string
  metaText: string
}

// Every class string below is written out in full (never built by
// concatenating fragments) so Tailwind's JIT scanner can see and generate
// each one — see the note on DropdownLink in Navbar.tsx for the same rule.
export function getQuranThemeClasses(theme: QuranTheme): QuranThemeClasses {
  switch (theme) {
    case 'sepia':
      return {
        panel: 'bg-[#f4ecd8] border border-[#d8c9a3]',
        arabicText: 'text-[#2b2013]',
        translationText: 'text-[#4a3c28]',
        tafsirBg: 'bg-[#ece0c4] border border-[#d8c9a3]',
        tafsirText: 'text-[#4a3c28]',
        ayahNumberBadge: 'bg-[#d8c9a3]/60 text-[#4a3c28] border border-[#c7b587]',
        divider: 'border-[#d8c9a3]',
        metaText: 'text-[#8a7752]',
      }
    case 'light':
      return {
        panel: 'bg-white border border-gray-200',
        arabicText: 'text-gray-900',
        translationText: 'text-gray-700',
        tafsirBg: 'bg-gray-50 border border-gray-200',
        tafsirText: 'text-gray-600',
        ayahNumberBadge: 'bg-gray-100 text-gray-600 border border-gray-200',
        divider: 'border-gray-200',
        metaText: 'text-gray-400',
      }
    case 'dark':
    default:
      return {
        panel: 'bg-green-900/40 border border-gold-500/15',
        arabicText: 'text-gold-100',
        translationText: 'text-gray-200',
        tafsirBg: 'bg-black/20 border border-gold-500/10',
        tafsirText: 'text-gray-300',
        ayahNumberBadge: 'bg-gold-500/10 text-gold-400 border border-gold-500/20',
        divider: 'border-gold-500/10',
        metaText: 'text-gray-500',
      }
  }
}
