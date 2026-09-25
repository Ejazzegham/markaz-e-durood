// Static reference metadata for all 30 Paras (Juz) of the Qur'an — number and
// the Arabic opening words traditionally used to label each Para on an index page.

export interface ParaMeta {
  number: number
  arabicStart: string
}

export const PARAS: ParaMeta[] = [
  { number: 1, arabicStart: 'الٓمّٓ' },
  { number: 2, arabicStart: 'سَیَقُوْلُ' },
  { number: 3, arabicStart: 'تِلْكَ الرُّسُلُ' },
  { number: 4, arabicStart: 'لَنْ تَنَالُوا' },
  { number: 5, arabicStart: 'وَ الْمُحْصَنٰتُ' },
  { number: 6, arabicStart: 'لَا یُحِبُّ اللّٰهُ' },
  { number: 7, arabicStart: 'وَ اِذَا سَمِعُوْا' },
  { number: 8, arabicStart: 'وَ لَوْ اَنَّنَا' },
  { number: 9, arabicStart: 'قَالَ الْمَلَاُ' },
  { number: 10, arabicStart: 'وَ اعْلَمُوْۤا' },
  { number: 11, arabicStart: 'یَعْتَذِرُوْنَ' },
  { number: 12, arabicStart: 'وَ مَا مِنْ دَآبَّةٍ' },
  { number: 13, arabicStart: 'وَ مَاۤ اُبَرِّئُ' },
  { number: 14, arabicStart: 'رُبَمَا' },
  { number: 15, arabicStart: 'سُبْحٰنَ الَّذِیْۤ' },
  { number: 16, arabicStart: 'قَالَ اَلَمْ' },
  { number: 17, arabicStart: 'اِقْتَرَبَ لِلنَّاسِ' },
  { number: 18, arabicStart: 'قَدْ اَفْلَحَ' },
  { number: 19, arabicStart: 'وَ قَالَ الَّذِیْنَ' },
  { number: 20, arabicStart: 'اَمَّنْ خَلَقَ' },
  { number: 21, arabicStart: 'اُتْلُ مَاۤ اُوْحِیَ' },
  { number: 22, arabicStart: 'وَ مَنْ یَّقْنُتْ' },
  { number: 23, arabicStart: 'وَ مَا لِیَ' },
  { number: 24, arabicStart: 'فَمَنْ اَظْلَمُ' },
  { number: 25, arabicStart: 'اِلَیْهِ یُرَدُّ' },
  { number: 26, arabicStart: 'حٰمٓ' },
  { number: 27, arabicStart: 'قَالَ فَمَا خَطْبُكُمْ' },
  { number: 28, arabicStart: 'قَدْ سَمِعَ اللّٰهُ' },
  { number: 29, arabicStart: 'تَبٰرَكَ الَّذِیْ' },
  { number: 30, arabicStart: 'عَمَّ' },
]

export function getParaMeta(number: number): ParaMeta | undefined {
  return PARAS.find((p) => p.number === number)
}
