'use client'

import { FaTimes, FaCog, FaLanguage, FaHeadphones, FaBookOpen, FaFont } from 'react-icons/fa'
import { useQuranSettings } from '@/contexts/QuranSettingsContext'
import PremiumSelect from '@/components/ui/PremiumSelect'
import {
  MAX_ARABIC_FONT,
  MAX_TRANSLATION_FONT,
  MIN_ARABIC_FONT,
  MIN_TRANSLATION_FONT,
  RECITERS,
  TAFSIRS,
  THEME_OPTIONS,
  TRANSLATIONS,
  type QuranTheme,
} from '@/lib/quran/constants'

interface QuranSettingsPanelProps {
  open: boolean
  onClose: () => void
}

export default function QuranSettingsPanel({ open, onClose }: QuranSettingsPanelProps) {
  const settings = useQuranSettings()

  const translationOptions = TRANSLATIONS.map((t) => ({
    value: t.edition,
    label: `${t.label} (${t.language})`,
  }))
  const reciterOptions = RECITERS.map((r) => ({ value: r.edition, label: r.label }))
  const tafsirOptions = TAFSIRS.map((t) => ({ value: t.slug, label: `${t.label} (${t.language})` }))

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm z-[70] bg-gradient-to-b from-green-900 to-green-950 border-l border-gold-500/20 shadow-2xl transition-transform duration-300 overflow-y-auto ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-green-900/95 backdrop-blur-xl border-b border-gold-500/15">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-gold-500/10 border border-gold-500/20">
              <FaCog className="text-gold-500 text-sm" />
            </div>
            <h2 className="text-white font-bold text-base">Reading Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            aria-label="Close settings"
          >
            <FaTimes />
          </button>
        </div>

        <div className="px-5 py-6 space-y-7">
          {/* Theme */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => settings.setTheme(opt.value as QuranTheme)}
                  className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                    settings.theme === opt.value
                      ? 'bg-gold-500 text-[#0b1d12] border-gold-500'
                      : 'bg-white/5 text-gray-300 border-white/10 hover:border-gold-500/40'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Arabic font size */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3 flex items-center gap-2">
              <FaFont className="text-gold-500" /> Arabic Font Size
            </p>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={MIN_ARABIC_FONT}
                max={MAX_ARABIC_FONT}
                step={1}
                value={settings.arabicFontSize}
                onChange={(e) => settings.setArabicFontSize(parseInt(e.target.value, 10))}
                className="w-full h-1.5 cursor-pointer accent-gold-500"
              />
              <span className="text-gold-400 text-xs font-mono w-8 text-right">{settings.arabicFontSize}</span>
            </div>
          </div>

          {/* Translation toggle + font size */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold">Translation</p>
              <button
                onClick={() => settings.setShowTranslation(!settings.showTranslation)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  settings.showTranslation ? 'bg-gold-500' : 'bg-white/10'
                }`}
                aria-label="Toggle translation visibility"
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.showTranslation ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {settings.showTranslation && (
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={MIN_TRANSLATION_FONT}
                  max={MAX_TRANSLATION_FONT}
                  step={1}
                  value={settings.translationFontSize}
                  onChange={(e) => settings.setTranslationFontSize(parseInt(e.target.value, 10))}
                  className="w-full h-1.5 cursor-pointer accent-gold-500"
                />
                <span className="text-gold-400 text-xs font-mono w-8 text-right">{settings.translationFontSize}</span>
              </div>
            )}
          </div>

          {/* Translation language */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3 flex items-center gap-2">
              <FaLanguage className="text-gold-500" /> Translation Language
            </p>
            <PremiumSelect
              value={settings.translationEdition}
              onChange={settings.setTranslationEdition}
              options={translationOptions}
              className="w-full"
            />
          </div>

          {/* Reciter */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3 flex items-center gap-2">
              <FaHeadphones className="text-gold-500" /> Reciter
            </p>
            <PremiumSelect
              value={settings.reciterEdition}
              onChange={settings.setReciterEdition}
              options={reciterOptions}
              className="w-full"
            />
          </div>

          {/* Tafsir edition */}
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 font-semibold mb-3 flex items-center gap-2">
              <FaBookOpen className="text-gold-500" /> Tafseer Edition
            </p>
            <PremiumSelect
              value={settings.tafsirSlug}
              onChange={settings.setTafsirSlug}
              options={tafsirOptions}
              className="w-full"
            />
          </div>

          <p className="text-[11px] text-gray-500 leading-relaxed border-t border-white/5 pt-4">
            Your reading preferences are saved on this device and applied automatically the next time you open the Qur&apos;an section.
          </p>
        </div>
      </div>
    </>
  )
}
