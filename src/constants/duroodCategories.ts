// Fixed list of Durood/Dhikr categories offered in the submission dropdown.
// Keeping this as a single shared source means the Submit Durood page, the
// Durood Count page's quick-submit widget, and the category cards shown on
// the Durood Count page can never drift out of sync with each other.
export const DUROOD_CATEGORIES = [
  'Surah Yaseen',
  'Surah Rehman',
  'Surah Mulk',
  'Surah Muzammil',
  'Complete Quran',
  'Durood e Taj',
  'Durood',
] as const

export type DuroodCategory = (typeof DUROOD_CATEGORIES)[number]

// Sentinel shown as the last dropdown option — picking it reveals a free-text
// field so a visitor can name any Surah/Durood not covered by the fixed list
// above, without us having to guess every possible name in advance.
export const DUROOD_CATEGORY_OTHER = 'Other' as const
